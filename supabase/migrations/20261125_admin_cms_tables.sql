-- ==============================================================================
-- CARDWATCH SOVEREIGN ADMIN CMS & PROJECT CHANGELOG MIGRATION
-- Database: PostgreSQL (Supabase)
-- Enables global persistence of Admin card edits, circular notices, and changes.
-- Safe to run multiple times (idempotent).
-- ==============================================================================

-- 1. Admin Credit Card Overrides & Custom Cards
CREATE TABLE IF NOT EXISTS public.cardwatch_admin_cards (
    card_id TEXT PRIMARY KEY,
    card_data JSONB NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Admin-Curated Devaluations & Google News Radar Entries
CREATE TABLE IF NOT EXISTS public.cardwatch_admin_devaluations (
    id TEXT PRIMARY KEY,
    devaluation_data JSONB NOT NULL,
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Persistent Project Change & Release Ledger
CREATE TABLE IF NOT EXISTS public.cardwatch_project_changes (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_id TEXT,
    before_state JSONB,
    after_state JSONB,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_admin_cards_updated_at
    ON public.cardwatch_admin_cards(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_devals_updated_at
    ON public.cardwatch_admin_devaluations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_changes_created_at
    ON public.cardwatch_project_changes(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public read for card/devaluation catalog; Admin-only write and audit visibility.
-- ==============================================================================
ALTER TABLE public.cardwatch_admin_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardwatch_admin_devaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardwatch_project_changes ENABLE ROW LEVEL SECURITY;

-- Drop old policies for safe idempotent re-run
DROP POLICY IF EXISTS "admin_cards_public_select" ON public.cardwatch_admin_cards;
DROP POLICY IF EXISTS "admin_cards_admin_insert" ON public.cardwatch_admin_cards;
DROP POLICY IF EXISTS "admin_cards_admin_update" ON public.cardwatch_admin_cards;
DROP POLICY IF EXISTS "admin_cards_admin_delete" ON public.cardwatch_admin_cards;

DROP POLICY IF EXISTS "admin_devals_public_select" ON public.cardwatch_admin_devaluations;
DROP POLICY IF EXISTS "admin_devals_admin_insert" ON public.cardwatch_admin_devaluations;
DROP POLICY IF EXISTS "admin_devals_admin_update" ON public.cardwatch_admin_devaluations;
DROP POLICY IF EXISTS "admin_devals_admin_delete" ON public.cardwatch_admin_devaluations;

DROP POLICY IF EXISTS "project_changes_admin_select" ON public.cardwatch_project_changes;
DROP POLICY IF EXISTS "project_changes_admin_insert" ON public.cardwatch_project_changes;
DROP POLICY IF EXISTS "project_changes_admin_update" ON public.cardwatch_project_changes;

-- Public Read (All CardWatch visitors see live admin updates)
CREATE POLICY "admin_cards_public_select"
    ON public.cardwatch_admin_cards FOR SELECT
    TO anon, authenticated
    USING (TRUE);

CREATE POLICY "admin_devals_public_select"
    ON public.cardwatch_admin_devaluations FOR SELECT
    TO anon, authenticated
    USING (TRUE);

-- Admin-only Write Policies (verified via public.profiles.role = 'admin')
CREATE POLICY "admin_cards_admin_insert"
    ON public.cardwatch_admin_cards FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_cards_admin_update"
    ON public.cardwatch_admin_cards FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_cards_admin_delete"
    ON public.cardwatch_admin_cards FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_devals_admin_insert"
    ON public.cardwatch_admin_devaluations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_devals_admin_update"
    ON public.cardwatch_admin_devaluations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_devals_admin_delete"
    ON public.cardwatch_admin_devaluations FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

-- Project Changelog Policies (Admin Read & Write)
CREATE POLICY "project_changes_admin_select"
    ON public.cardwatch_project_changes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "project_changes_admin_insert"
    ON public.cardwatch_project_changes FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

CREATE POLICY "project_changes_admin_update"
    ON public.cardwatch_project_changes FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
    );

-- ==============================================================================
-- DATA API TABLE GRANTS
-- ==============================================================================
GRANT SELECT ON TABLE public.cardwatch_admin_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.cardwatch_admin_cards TO authenticated;

GRANT SELECT ON TABLE public.cardwatch_admin_devaluations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.cardwatch_admin_devaluations TO authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE public.cardwatch_project_changes TO authenticated;
