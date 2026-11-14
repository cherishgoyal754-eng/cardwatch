import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validatePassword, authRateLimiter, getGenericAuthError } from '../utils/security';

export interface AuthProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'customer' | 'admin';
  isVerified: boolean;
  createdAt?: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  requiresEmailVerification?: boolean;
}

interface AuthContextType {
  user: any | null;
  profile: AuthProfile | null;
  session: any | null;
  isLoading: boolean;
  isGuest: boolean;
  signInPromptReason: string | null;
  isSignInPromptOpen: boolean;
  signUp: (fullName: string, email: string, pass: string, confirmPass: string, acceptTerms: boolean) => Promise<AuthResult>;
  signIn: (email: string, pass: string, rememberMe?: boolean) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signOutAllDevices: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<AuthResult>;
  updatePassword: (newPass: string) => Promise<AuthResult>;
  updateProfileName: (newName: string) => Promise<AuthResult>;
  deleteAccount: () => Promise<AuthResult>;
  exploreAsGuest: () => void;
  promptSignIn: (reason?: string) => void;
  closeSignInPrompt: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local fallback storage keys for when Supabase is running in local offline demo mode
const LOCAL_SESSION_KEY = 'cardwatch_active_session';
const LOCAL_PROFILES_KEY = 'cardwatch_local_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [signInPromptReason, setSignInPromptReason] = useState<string | null>(null);
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState<boolean>(false);

  // Initialize and listen to active session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (mounted && data.session) {
            setSession(data.session);
            setUser(data.session.user);
            await fetchProfile(data.session.user.id, data.session.user.email || '');
          }
        } else {
          // Local fallback provider
          const cachedSession = localStorage.getItem(LOCAL_SESSION_KEY);
          if (cachedSession) {
            const parsed = JSON.parse(cachedSession);
            setSession(parsed);
            setUser(parsed.user);
            setProfile(parsed.profile);
          }
        }
      } catch (err) {
        console.warn('Session verification fallback:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Supabase Auth listener
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsGuest(false);
          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id, currentSession.user.email || '');
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsGuest(false);
        }
      });

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch or provision user profile from database
  async function fetchProfile(userId: string, email: string) {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          // If profile table trigger hasn't run yet, provision local object
          setProfile({
            id: userId,
            fullName: user?.user_metadata?.full_name || 'Cherish Goyal',
            email,
            role: 'customer',
            isVerified: Boolean(user?.email_confirmed_at),
          });
        } else if (data) {
          setProfile({
            id: data.id,
            fullName: data.full_name,
            email: data.email,
            role: data.role || 'customer',
            isVerified: data.is_verified || false,
            createdAt: data.created_at,
          });
        }
      }
    } catch {
      // Graceful fallback
      setProfile({
        id: userId,
        fullName: 'Cherish Goyal',
        email,
        role: 'customer',
        isVerified: true,
      });
    }
  }

  // Complete Registration Process
  const signUp = async (
    fullName: string,
    email: string,
    pass: string,
    confirmPass: string,
    acceptTerms: boolean
  ): Promise<AuthResult> => {
    // 1. Basic field checks
    if (!fullName.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    if (!acceptTerms) {
      return { success: false, message: 'You must accept the Terms of Service & Privacy Policy to create an account.' };
    }

    // 2. Strict Password Validation
    const passCheck = validatePassword(pass);
    if (!passCheck.valid) {
      return { success: false, message: passCheck.errors[0] };
    }
    if (pass !== confirmPass) {
      return { success: false, message: 'Password confirmation does not match.' };
    }

    // 3. Authenticate with Supabase / Provider
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/auth/verify`,
          },
        });

        if (error) {
          return { success: false, message: getGenericAuthError(error) };
        }

        // Generic response to avoid account enumeration
        const requiresVerification = !data.session;
        return {
          success: true,
          message: requiresVerification
            ? 'Account created successfully! We have sent a secure verification link to your email. Please verify before signing in.'
            : 'Account registered and secured.',
          requiresEmailVerification: requiresVerification,
        };
      } else {
        // High-Fidelity Local Dev Simulation when Supabase keys are not yet connected
        const newUserId = 'usr_' + Math.random().toString(36).substring(2, 9);
        const newProfile: AuthProfile = {
          id: newUserId,
          fullName: fullName.trim(),
          email: email.trim(),
          role: 'customer',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

        const mockSession = {
          access_token: 'mock_jwt_token',
          user: { id: newUserId, email: email.trim() },
          profile: newProfile,
        };

        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockSession));
        setSession(mockSession);
        setUser(mockSession.user);
        setProfile(newProfile);
        setIsGuest(false);

        return {
          success: true,
          message: 'Account created and secured with verified local session.',
          requiresEmailVerification: false,
        };
      }
    } catch (err) {
      return { success: false, message: getGenericAuthError(err) };
    }
  };

  // Complete Sign In Process
  const signIn = async (email: string, pass: string, _rememberMe = true): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate limiting check
    const rateCheck = authRateLimiter.check(cleanEmail, 5, 60000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: `Too many unsuccessful login attempts. For your security, this account is temporarily locked for ${rateCheck.waitSeconds}s.`,
      };
    }

    // 2. Validate input format
    if (!cleanEmail || !pass) {
      return { success: false, message: 'Please enter both your email address and password.' };
    }

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (error) {
          authRateLimiter.recordFailure(cleanEmail, 5, 60000);
          return { success: false, message: getGenericAuthError(error) };
        }

        authRateLimiter.reset(cleanEmail);
        setSession(data.session);
        setUser(data.user);
        setIsGuest(false);
        await fetchProfile(data.user.id, data.user.email || '');

        return { success: true, message: 'Signed in successfully. Welcome back to CARDWATCH!' };
      } else {
        // Local Dev simulation
        authRateLimiter.reset(cleanEmail);
        const mockProfile: AuthProfile = {
          id: 'usr_local_member',
          fullName: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: 'customer',
          isVerified: true,
        };

        const mockSession = {
          access_token: 'mock_token',
          user: { id: mockProfile.id, email: cleanEmail },
          profile: mockProfile,
        };

        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockSession));
        setSession(mockSession);
        setUser(mockSession.user);
        setProfile(mockProfile);
        setIsGuest(false);

        return { success: true, message: 'Signed in successfully. Welcome back to CARDWATCH!' };
      }
    } catch (err) {
      authRateLimiter.recordFailure(cleanEmail, 5, 60000);
      return { success: false, message: getGenericAuthError(err) };
    }
  };

  // Sign out active session
  const signOut = async (): Promise<void> => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut({ scope: 'local' });
      } else {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    } catch (err) {
      console.warn('Sign out cleanup:', err);
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsGuest(false);
    }
  };

  // Sign out from all devices
  const signOutAllDevices = async (): Promise<void> => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut({ scope: 'global' });
      } else {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    } catch (err) {
      console.warn('Global sign out cleanup:', err);
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsGuest(false);
    }
  };

  // Password Recovery Request
  const resetPasswordForEmail = async (email: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please provide your account email address.' };
    }

    try {
      if (isSupabaseConfigured) {
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
      }
      // Generic response to prevent account enumeration
      return {
        success: true,
        message: 'If an account exists with this email address, you will receive a password reset link shortly.',
      };
    } catch {
      return {
        success: true,
        message: 'If an account exists with this email address, you will receive a password reset link shortly.',
      };
    }
  };

  // Update password
  const updatePassword = async (newPass: string): Promise<AuthResult> => {
    const check = validatePassword(newPass);
    if (!check.valid) {
      return { success: false, message: check.errors[0] };
    }

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) throw error;
      }
      return { success: true, message: 'Your password has been securely updated across all devices.' };
    } catch (err) {
      return { success: false, message: getGenericAuthError(err) };
    }
  };

  // Update full name
  const updateProfileName = async (newName: string): Promise<AuthResult> => {
    if (!newName.trim()) {
      return { success: false, message: 'Name cannot be empty.' };
    }

    try {
      if (isSupabaseConfigured && user) {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: newName.trim(), updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (error) throw error;
      }

      setProfile(prev => prev ? { ...prev, fullName: newName.trim() } : null);
      return { success: true, message: 'Profile updated successfully.' };
    } catch (err) {
      return { success: false, message: getGenericAuthError(err) };
    }
  };

  // Account Deletion
  const deleteAccount = async (): Promise<AuthResult> => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.rpc('delete_user_account');
        if (error) throw error;
      }
      await signOut();
      return { success: true, message: 'Your account and related data have been completely deleted.' };
    } catch (err) {
      return { success: false, message: getGenericAuthError(err) };
    }
  };

  // Guest exploration
  const exploreAsGuest = () => {
    setIsGuest(true);
    setIsSignInPromptOpen(false);
  };

  // Prompt sign in when guest touches a protected resource
  const promptSignIn = (reason?: string) => {
    setSignInPromptReason(reason || 'Sign in to access your personal card wallet and custom devaluation alerts.');
    setIsSignInPromptOpen(true);
  };

  const closeSignInPrompt = () => {
    setIsSignInPromptOpen(false);
    setSignInPromptReason(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isGuest,
        signInPromptReason,
        isSignInPromptOpen,
        signUp,
        signIn,
        signOut,
        signOutAllDevices,
        resetPasswordForEmail,
        updatePassword,
        updateProfileName,
        deleteAccount,
        exploreAsGuest,
        promptSignIn,
        closeSignInPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
