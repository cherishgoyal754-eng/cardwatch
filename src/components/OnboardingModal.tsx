import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validatePassword, authRateLimiter } from '../utils/security';
import { sound } from '../utils/audio';
import { AnimatedVaultChamber } from './AnimatedVaultChamber';
import { Real3DCard } from './Real3DCard';
import { CREDIT_CARDS_DATA } from '../data/cards';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Mail,
  User,
  AlertCircle,
  KeyRound,
  Check,
  X,
  Loader2,
  Compass,
  CreditCard as CardIcon
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialTab?: 'signin' | 'register';
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
}) => {
  const {
    signIn,
    signUp,
    resetPasswordForEmail,
    exploreAsGuest,
    signInPromptReason,
    closeSignInPrompt,
    isGuest,
    user,
  } = useAuth();

  // Mode: 'signin' | 'register' | 'forgot'
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot'>(initialTab);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Showcase card
  const showcaseCard = CREDIT_CARDS_DATA.find(c => c.id === 'amex-platinum') || CREDIT_CARDS_DATA[0];

  // Reset tab when reopened
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds(prev => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  // Live password validation
  const passValidation = validatePassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleTabChange = (tab: 'signin' | 'register') => {
    sound.playClick();
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const rate = authRateLimiter.check(cleanEmail);
    if (!rate.allowed) {
      setLockoutSeconds(rate.waitSeconds);
      setErrorMessage(`Too many unsuccessful login attempts. For security, please wait ${rate.waitSeconds}s.`);
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
        setTimeout(() => {
          if (onClose) onClose();
          closeSignInPrompt();
        }, 800);
      } else {
        sound.playDevaluation();
        setErrorMessage(res.message);
        const updatedRate = authRateLimiter.check(cleanEmail);
        if (!updatedRate.allowed) {
          setLockoutSeconds(updatedRate.waitSeconds);
        }
      }
    } catch {
      setErrorMessage('Unable to connect to authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Registration submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service & Privacy Policy to continue.');
      return;
    }

    if (!passValidation.valid) {
      setErrorMessage(passValidation.errors[0] || 'Password does not satisfy security policy.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    setIsLoading(true);
    sound.playClick();

    try {
      const res = await signUp(fullName, email, password, confirmPassword, acceptTerms);
      if (res.success) {
        sound.playSuccess();
        setSuccessMessage(res.message);
        setTimeout(() => {
          if (onClose) onClose();
          closeSignInPrompt();
        }, 1200);
      } else {
        sound.playDevaluation();
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    sound.playClick();

    try {
      const res = await resetPasswordForEmail(email);
      sound.playSuccess();
      setSuccessMessage(res.message);
    } catch {
      setErrorMessage('Unable to send password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestClick = () => {
    sound.playClick();
    exploreAsGuest();
    if (onClose) onClose();
    closeSignInPrompt();
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col overflow-y-auto select-none">

      {/* TOP FULL-SCREEN NAVIGATION BAR */}
      <header className="w-full border-b border-emerald-100 bg-white/95 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <CardIcon className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight font-sans">
                CARD<span className="text-emerald-700">WATCH</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono uppercase text-emerald-800 tracking-widest font-bold hidden sm:block">
              Credit Card Intelligence & Devaluation Radar
            </span>
          </div>
        </div>

        {/* Center Security Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bank-Grade 256-Bit SSL • Zero Spam Guarantee</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGuestClick}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 font-extrabold text-xs border border-emerald-200 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Explore as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {(isGuest || user || onClose) && (
            <button
              onClick={handleGuestClick}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-emerald-50 border border-emerald-100 transition-colors"
              title="Close and return to App"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Contextual Protected Feature Banner if triggered in app */}
      {signInPromptReason && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <ShieldAlert className="w-4 h-4" />
          <span>{signInPromptReason}</span>
        </div>
      )}

      {/* MAIN FULL-SCREEN BODY: 2-COLUMN IMMERSIVE VIEW */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

        {/* ======================================================== */}
        {/* LEFT COLUMN: CINEMATIC ANIMATION & REAL 3D CARD SHOWCASE */}
        {/* ======================================================== */}
        <div className="w-full lg:w-7/12 relative rounded-[32px] p-6 sm:p-10 border border-emerald-200 bg-white/80 shadow-xl overflow-hidden flex flex-col justify-between space-y-6">

          {/* Animated Moving Vault Chamber in Background */}
          <AnimatedVaultChamber className="opacity-95" />

          {/* Ambient Mint Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-r from-emerald-200/50 via-teal-100/60 to-emerald-300/50 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-20 space-y-5">
            {/* Top Intelligence Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono tracking-wide uppercase">India's #1 Credit Card Intelligence Platform</span>
            </div>

            {/* Kinetic Punchline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
              Know what your bank changes{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
                before it costs you money.
              </span>
            </h1>

            {/* Platform Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Over 48 popular Indian credit cards quietly reduced airport lounge quotas, capped cashback, or introduced spend thresholds. Protect your wallet with CARDWATCH.
            </p>

            {/* Real-Life 3D Animated Card with Continuous Motion */}
            <div className="py-2 flex justify-center">
              <Real3DCard
                card={showcaseCard}
                cardholderName="CHERISH GOYAL"
                autoRotate={true}
                isInteractive={true}
              />
            </div>

            {/* Authentic Trust Grid (Supported by Real Platform Data) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-emerald-200 text-left shadow-sm backdrop-blur-md">
              <div className="p-1 sm:p-1.5">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">48+ Cards</div>
                <div className="text-[11px] text-slate-600 font-bold">Monitored Live</div>
              </div>
              <div className="p-1 sm:p-1.5 border-x border-emerald-200">
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">100% Signed</div>
                <div className="text-[11px] text-slate-600 font-bold">Bank Circulars</div>
              </div>
              <div className="p-1 sm:p-1.5">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">0 Spam</div>
                <div className="text-[11px] text-slate-600 font-bold">No Sales Calls</div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: FULL-HEIGHT AUTHENTICATION TERMINAL       */}
        {/* ======================================================== */}
        <div className="w-full lg:w-5/12 bg-white rounded-[32px] border-2 border-emerald-300 p-6 sm:p-9 shadow-2xl shadow-emerald-600/10 relative">

          {/* Tab Switcher */}
          {activeTab !== 'forgot' && (
            <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-6 relative">
              <button
                type="button"
                onClick={() => handleTabChange('signin')}
                className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  {lockoutSeconds > 0 && (
                    <div className="font-mono text-[11px] font-bold text-rose-700 mt-1">
                      Cooldown remaining: {lockoutSeconds} seconds
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="flex-1">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
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
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-slate-600 font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('forgot');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || lockoutSeconds > 0}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CARDWATCH</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Cherish Goyal"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password (min 12 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600">Password Strength:</span>
                      <span
                        className={`font-mono ${
                          passValidation.score <= 1
                            ? 'text-rose-600'
                            : passValidation.score <= 3
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {passValidation.strengthLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map(step => (
                        <div
                          key={step}
                          className={`rounded-full transition-all ${
                            passValidation.score >= step
                              ? passValidation.score <= 1
                                ? 'bg-rose-500'
                                : passValidation.score <= 3
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px]">
                      <div className={`flex items-center gap-1 ${passValidation.hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                        {passValidation.hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
                        <span>12+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passValidation.hasUppercase && passValidation.hasLowercase ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                        {passValidation.hasUppercase && passValidation.hasLowercase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
                        <span>Upper & Lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passValidation.hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                        {passValidation.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passValidation.hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                        {passValidation.hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
                        <span>Symbol (!@#$)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p className="text-[11px] mt-1 flex items-center gap-1 font-semibold">
                    {passwordsMatch ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <X className="w-3 h-3" /> Passwords do not match
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    I agree to the CARDWATCH <span className="text-emerald-700 font-bold hover:underline">Terms of Service</span> and <span className="text-emerald-700 font-bold hover:underline">Privacy Policy</span>. Zero spam, zero sales calls.
                  </span>
                </label>
              </div>

              {/* Live helper message if password incomplete */}
              {!passValidation.valid && password.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{passValidation.errors[0] || 'Please fulfill all password security requirements above.'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:scale-100 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-center">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Reset Your Password</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Enter your registered email address to receive a secure recovery link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Secure Recovery Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full text-center text-xs text-slate-600 hover:text-emerald-700 font-bold"
              >
                ← Return to Sign In
              </button>
            </form>
          )}

          {/* Bottom Divider & Guest Explorer Option */}
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
            <button
              type="button"
              onClick={handleGuestClick}
              className="w-full py-3.5 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 font-extrabold text-xs sm:text-sm border border-emerald-300 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Explore as Guest (Browse 48+ Cards & Devaluations)</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
            <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bank-grade encryption. We never request your credit card PIN or CVV.</span>
            </p>
          </div>

        </div>

      </main>

    </div>
  );
};
