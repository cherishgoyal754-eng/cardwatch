import React, { useState, useEffect } from 'react';
import { ScreenType, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import {
  ShieldAlert,
  CreditCard,
  SlidersHorizontal,
  GitCompare,
  Plane,
  Coins,
  Wallet,
  Volume2,
  VolumeX,
  Menu,
  X,
  Home,
  KeyRound,
  Sparkles,
  Maximize,
  Minimize
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userProfile: UserProfile | null;
  savedCardsCount: number;
  unreadChangesCount: number;
  onOpenSearch?: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  savedCardsCount,
  unreadChangesCount,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false;
  });

  const { user, profile, isGuest, promptSignIn } = useAuth();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    sound.playClick();
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (document.documentElement as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sound.playClick();
  };

  const handleNavClick = (screen: ScreenType) => {
    sound.playClick();
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  const primaryNavItems = [
    { id: 'home' as ScreenType, label: 'Overview', icon: Home },
    {
      id: 'changes' as ScreenType,
      label: 'Devaluations',
      icon: ShieldAlert,
      badge: unreadChangesCount > 0 ? `${unreadChangesCount}` : undefined,
    },
    { id: 'explorer' as ScreenType, label: 'All Cards', icon: CreditCard },
    { id: 'compare' as ScreenType, label: 'Compare', icon: GitCompare },
    { id: 'tailor' as ScreenType, label: 'Tailor Card', icon: SlidersHorizontal },
    {
      id: 'wallet' as ScreenType,
      label: 'My Wallet',
      icon: Wallet,
      badge: savedCardsCount > 0 ? `${savedCardsCount}` : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-2xl shadow-sm">
      <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 h-20 flex items-center gap-2 lg:gap-3">

        {/* Left Section: Full Screen Toggle + Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Full Screen Toggle Button (Matches User Drawing Exactly) */}
          <button
            onClick={toggleFullscreen}
            className={`h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl text-xs font-mono font-extrabold flex items-center gap-1.5 transition-all select-none cursor-pointer border shrink-0 ${
              isFullscreen
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-300'
                : 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-800 border-emerald-200 hover:border-emerald-400'
            }`}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <Minimize className="w-3.5 h-3.5 text-white" />
            ) : (
              <Maximize className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span className="font-extrabold tracking-tight">
              {isFullscreen ? 'Exit' : 'Full'}
            </span>
          </button>

          {/* Brand Logo (Pure White & Green Theme) */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 font-mono">
                  CARD<span className="text-emerald-600">WATCH</span>
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-emerald-700 font-mono tracking-wider uppercase font-bold">
                Credit Card Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Bar shifted LEFT right next to the logo, utilizing the empty space */}
        <nav className="hidden lg:flex items-center gap-0.5 sm:gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-200/80 shadow-inner shrink-0">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            const isDeval = item.id === 'changes';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`h-9 px-2 sm:px-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap select-none shrink-0 ${
                  isActive
                    ? isDeval
                      ? 'text-white bg-red-600 shadow-md shadow-red-600/30 border border-red-500'
                      : 'text-white bg-emerald-600 shadow-md shadow-emerald-600/30 border border-emerald-500'
                    : isDeval
                    ? 'text-slate-700 hover:text-red-700 hover:bg-red-50'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-100/70'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : isDeval
                      ? 'text-red-600'
                      : 'text-emerald-600'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>

                {item.badge && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[10px] font-mono font-extrabold rounded-full shrink-0 shadow-sm ${
                      isDeval
                        ? isActive
                          ? 'bg-white text-red-700'
                          : 'bg-red-600 text-white animate-pulse'
                        : isActive
                        ? 'bg-white text-emerald-800'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Elegant Divider before Standout Tools */}
          <div className="w-px h-5 bg-emerald-300/70 mx-0.5 shrink-0" />

          {/* 1. STANDOUT DECORATIVE: AIRPLANE MODE */}
          <button
            onClick={() => handleNavClick('travel-intent')}
            className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 select-none shrink-0 relative overflow-hidden group shadow-sm cursor-pointer ${
              currentScreen === 'travel-intent'
                ? 'bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white ring-2 ring-emerald-400 shadow-emerald-700/40'
                : 'bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.02] border border-teal-300/60'
            }`}
            title="Airplane Mode: Flight Discounts & Airport Lounge Cards"
          >
            {/* Shimmer reflection sweep */}
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            <div className="w-4 h-4 rounded-md bg-white/20 flex items-center justify-center shrink-0">
              <Plane className="w-3 h-3 text-white group-hover:-rotate-12 transition-transform" />
            </div>

            <span className="whitespace-nowrap font-black">Airplane Mode</span>

            <span className="px-1.5 py-0.5 rounded-full bg-white/25 text-white font-mono text-[9px] font-black border border-white/30 uppercase tracking-tight">
              FLIGHTS & LOUNGE
            </span>
          </button>

          {/* 2. STANDOUT DECORATIVE: REWARD POINTS (Fully visible, completely unclipped) */}
          <button
            onClick={() => handleNavClick('calculator')}
            className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 select-none shrink-0 relative overflow-hidden group shadow-sm cursor-pointer ${
              currentScreen === 'calculator'
                ? 'bg-emerald-800 text-white border-2 border-emerald-400 ring-2 ring-emerald-300 shadow-emerald-700/40'
                : 'bg-white hover:bg-emerald-50 text-slate-900 border-2 border-emerald-400 hover:border-emerald-600 shadow-emerald-600/10 hover:scale-[1.02]'
            }`}
            title="Reward Points Calculator: Full points-to-cash yield simulator"
          >
            <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
              currentScreen === 'calculator' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              <Coins className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>

            <span className="whitespace-nowrap font-black">Reward Points</span>

            <span className={`px-1.5 py-0.5 rounded-full font-mono text-[9px] font-black border uppercase tracking-tight shrink-0 ${
              currentScreen === 'calculator' ? 'bg-white/20 text-white border-white/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              ₹ CALC
            </span>
          </button>
        </nav>

        {/* Right Controls pushed to far right with ml-auto */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-700 hover:bg-white hover:border-emerald-400 transition-colors flex items-center justify-center shrink-0 shadow-sm"
            title={soundEnabled ? 'Mute Audio Clicks' : 'Enable Audio Clicks'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Profile / Sign In */}
          {!user ? (
            <button
              onClick={() => {
                sound.playClick();
                const el = document.getElementById('signin-section');
                if (el && currentScreen === 'home') {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  promptSignIn('Sign in to access your personal card wallet and custom alerts.');
                }
              }}
              className="h-9 sm:h-10 flex items-center gap-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shrink-0 shadow-sm shadow-emerald-600/20"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline-block whitespace-nowrap">Sign In</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenProfile();
              }}
              className="h-9 sm:h-10 flex items-center gap-2 px-2.5 sm:px-3 rounded-xl bg-emerald-50/90 border border-emerald-200 hover:border-emerald-400 hover:bg-white text-xs font-bold transition-all shrink-0 shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                {profile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-slate-800 hidden sm:inline-block font-bold whitespace-nowrap">
                {profile?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Profile'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified Account" />
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 flex items-center justify-center shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Everything visible directly) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-100 bg-white px-4 py-4 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              ...primaryNavItems,
              { id: 'travel-intent' as ScreenType, label: 'Airplane Mode', icon: Plane },
              { id: 'calculator' as ScreenType, label: 'Reward Points', icon: Coins },
            ].map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              const isDeval = item.id === 'changes';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? isDeval
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-emerald-600 text-white shadow-md'
                      : isDeval
                      ? 'bg-red-50 text-red-900 border border-red-200'
                      : 'bg-emerald-50 text-slate-800 border border-emerald-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : isDeval
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
