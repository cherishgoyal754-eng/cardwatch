import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validatePassword, authRateLimiter } from '../utils/security';
import { sound } from '../utils/audio';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Compass,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  LogOut,
  Wallet
} from 'lucide-react';

interface ScrollSignInSectionProps {
  onExploreCards?: () => void;
  onOpenWallet?: () => void;
}

export const ScrollSignInSection: React.FC<ScrollSignInSectionProps> = ({
  onExploreCards,
  onOpenWallet,
}) => {
  const {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    resetPasswordForEmail,
    exploreAsGuest,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passValidation = validatePassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Handle Tab Switch
  const handleTabChange = (tab: 'signin' | 'register') => {
    sound.playClick();
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Submit Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const rate = authRateLimiter.check(cleanEmail);
    if (!rate.allowed) {
      setErrorMessage(`Too many attempts. Please wait ${rate.waitSeconds}s.`);
      sound.playDevaluation();
      return;
    }

    setIsLoading(true);
    sound.playClick();

    try {
      const res = await signIn(cleanEmail, password, rememberMe);
      if (res.success) {
        sound.playSuccess();
        setSuccessMessage(res.message);
      } else {
        sound.playDevaluation();
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Unexpected login error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service to proceed.');
      sound.playDevaluation();
      return;
    }

    if (!passValidation.isValid) {
      setErrorMessage('Password must be 8+ chars and include upper, lower, number, and special character.');
      sound.playDevaluation();
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      sound.playDevaluation();
      return;
    }

    setIsLoading(true);
    sound.playClick();

    try {
      const res = await signUp(fullName.trim(), email.trim().toLowerCase(), password, confirmPassword, acceptTerms);
      if (res.success) {
        sound.playSuccess();
        setSuccessMessage(res.message);
      } else {
        sound.playDevaluation();
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Unable to complete account registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Enter your email address.');
      return;
    }

    setIsLoading(true);
    sound.playClick();

    try {
      const res = await resetPasswordForEmail(email.trim().toLowerCase());
      sound.playSuccess();
      setSuccessMessage(res.message);
    } catch {
      setErrorMessage('Unable to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="signin-section" className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
      <div className="relative rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border-2 border-emerald-200/90 bg-white/90 backdrop-blur-xl shadow-2xl shadow-emerald-600/10 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-32 bg-gradient-to-r from-emerald-200/40 via-teal-100/50 to-emerald-300/40 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono uppercase tracking-wider">Bank-Grade 256-Bit SSL • Member Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {user ? 'Your CARDWATCH Account' : 'Sign In to Your Account'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium">
            {user
              ? 'Save custom cards, track spend-linked lounge quotas, and receive verified circular alerts.'
              : 'Save cards to your personal wallet, track real-time devaluations, and get tailored bank alerts.'}
          </p>
        </div>

        {/* ALREADY LOGGED IN VIEW */}
        {user ? (
          <div className="relative z-10 max-w-lg mx-auto p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-md">
              {profile?.fullName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{profile?.fullName || 'Cardwatch Member'}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Account Active</span>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {onOpenWallet && (
                <button
                  onClick={onOpenWallet}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Open My Wallet</span>
                </button>
              )}
              {onExploreCards && (
                <button
                  onClick={onExploreCards}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
                >
                  Browse Cards
                </button>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  signOut();
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* AUTH FORM CONTAINER */
          <div className="relative z-10 max-w-md mx-auto space-y-5">
            
            {/* Top Switcher Tabs */}
            <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => handleTabChange('signin')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to CARDWATCH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Cherish Goyal"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create secure password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer text-xs font-medium text-slate-600 pt-1 text-left">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I agree to CARDWATCH Terms & Privacy Policy</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Create CARDWATCH Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-left">
                <p className="text-xs text-slate-600 font-medium">
                  Enter your email address to receive password reset instructions.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium text-slate-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Instructions</span>}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Guest Option Button from Screenshot */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  exploreAsGuest();
                  if (onExploreCards) onExploreCards();
                }}
                className="w-full p-3 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-500 transition-all flex items-center justify-between gap-3 group shadow-sm text-left"
              >
                <div className="flex items-center gap-2.5 pl-1">
                  <Compass className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                    Explore as Guest (Browse 48+ Cards & Devaluations)
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>
            </div>

            {/* Security Guarantee Footer from Screenshot */}
            <div className="pt-2 text-center text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Bank-grade encryption. We never request your credit card PIN or CVV.</span>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
