-- ==============================================================================
-- CARDWATCH PRODUCTION DATABASE SECURITY & AUTHENTICATION MIGRATION
-- Database: PostgreSQL (Supabase)
-- Implements: Row Level Security (RLS), RBAC, Anti-Privilege Escalation Triggers,
--             Subquery-wrapped auth.uid() for performance, and search_path guards.
-- ==============================================================================

-- 1. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User Owned Cards (Private Card Wallet)
CREATE TABLE IF NOT EXISTS public.user_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL,
    custom_nickname TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_cards_unique_user_card UNIQUE (user_id, card_id)
);

-- 3. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    devaluations BOOLEAN NOT NULL DEFAULT TRUE,
    lounge_thresholds BOOLEAN NOT NULL DEFAULT TRUE,
    fee_revisions BOOLEAN NOT NULL DEFAULT TRUE,
    expiring_offers BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Immutable Security Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR SCALE & QUERY PERFORMANCE
-- Avoid sequential scans on foreign keys and lookup queries.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON public.user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Authenticated users can ONLY access their own records.
-- Subquery `(SELECT auth.uid())` is evaluated once per query, not per row.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe re-runs
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "user_cards_select_own" ON public.user_cards;
DROP POLICY IF EXISTS "user_cards_insert_own" ON public.user_cards;
DROP POLICY IF EXISTS "user_cards_update_own" ON public.user_cards;
DROP POLICY IF EXISTS "user_cards_delete_own" ON public.user_cards;
DROP POLICY IF EXISTS "notif_prefs_select_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "notif_prefs_update_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_select_admin_only" ON public.audit_logs;

-- Profiles Policies
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = id);

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);

-- User Cards Policies (Private Wallet)
CREATE POLICY "user_cards_select_own"
    ON public.user_cards FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "user_cards_insert_own"
    ON public.user_cards FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "user_cards_update_own"
    ON public.user_cards FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "user_cards_delete_own"
    ON public.user_cards FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- Notification Preferences Policies
CREATE POLICY "notif_prefs_select_own"
    ON public.notification_preferences FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "notif_prefs_update_own"
    ON public.notification_preferences FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- Audit Logs Policies (Append-only by authenticated users, readable only by Admins)
CREATE POLICY "audit_logs_insert_authenticated"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "audit_logs_select_admin_only"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

-- ==============================================================================
-- ANTI-PRIVILEGE ESCALATION SECURITY TRIGGER
-- Enforces that no customer can elevate their own role to 'admin' via API.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.role <> OLD.role THEN
        -- Only service_role or existing admin can change roles
        IF auth.uid() IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Privilege Escalation Detected: You are not authorized to modify your security role.';
        END IF;
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_protect_profile_role ON public.profiles;
CREATE TRIGGER trigger_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_role();

-- ==============================================================================
-- AUTOMATED USER REGISTRATION TRIGGER
-- Auto-provisions Profile & Notification Preferences on auth.users INSERT
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, is_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'CARDWATCH Member'),
        NEW.email,
        'customer',
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;

    INSERT INTO public.notification_preferences (user_id, devaluations, lounge_thresholds, fee_revisions, expiring_offers)
    VALUES (NEW.id, TRUE, TRUE, TRUE, TRUE)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.audit_logs (user_id, action, metadata)
    VALUES (NEW.id, 'ACCOUNT_CREATED', jsonb_build_object('email', NEW.email));

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SECURE ACCOUNT DELETION CLEANUP FUNCTION
-- Completely purges or anonymizes user records when deletion is confirmed
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    target_user UUID := auth.uid();
BEGIN
    IF target_user IS NULL THEN
        RAISE EXCEPTION 'Authentication required to delete account.';
    END IF;

    -- Record audit log before removal
    INSERT INTO public.audit_logs (user_id, action, metadata)
    VALUES (target_user, 'ACCOUNT_DELETED_BY_USER', jsonb_build_object('deleted_at', NOW()));

    -- Delete from user tables (cascade will remove user_cards, preferences, profiles)
    DELETE FROM public.user_cards WHERE user_id = target_user;
    DELETE FROM public.notification_preferences WHERE user_id = target_user;
    DELETE FROM public.profiles WHERE id = target_user;
    
    -- Delete auth user
    DELETE FROM auth.users WHERE id = target_user;
END;
$$;

-- ==============================================================================
-- PERMISSIONS / GRANTS FOR SUPABASE DATA (REST) API
-- Ensure authenticated and anon roles have appropriate table permissions.
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_cards TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.notification_preferences TO authenticated;
GRANT INSERT ON TABLE public.audit_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
