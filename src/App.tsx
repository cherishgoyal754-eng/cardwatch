import React, { useState, useEffect } from 'react';
import { ScreenType, UserProfile } from './types';
import { useAuth } from './context/AuthContext';
import { CardDataProvider, useCardData } from './context/CardDataContext';
import { getActiveAdminSession, lockAdminVault } from './utils/adminVault';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { FloatingAIDock } from './components/FloatingAIDock';
import { CustomCursor } from './components/CustomCursor';
import { AnimatedVaultChamber } from './components/AnimatedVaultChamber';
import { CreditCard as CardIcon } from 'lucide-react';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { ExplorerScreen } from './screens/ExplorerScreen';
import { CardDetailsScreen } from './screens/CardDetailsScreen';
import { ChangesTrackerScreen } from './screens/ChangesTrackerScreen';
import { CompareScreen } from './screens/CompareScreen';
import { TailorCardScreen } from './screens/TailorCardScreen';
import { TravelIntentScreen } from './screens/TravelIntentScreen';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { AIAdvisorScreen } from './screens/AIAdvisorScreen';
import { WalletScreen } from './screens/WalletScreen';
import { AdminScreen } from './screens/AdminScreen';

const AppContent: React.FC = () => {
  const {
    user,
    profile,
    isLoading: isAuthLoading,
    isGuest,
    isSignInPromptOpen,
    closeSignInPrompt,
    promptSignIn,
  } = useAuth();

  const { cards, liveDevaluations } = useCardData();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === '1' || window.location.hash === '#/admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() =>
    Boolean(getActiveAdminSession())
  );
  const [adminSessionKey, setAdminSessionKey] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string>('hdfc-regalia-gold');
  const [comparisonCardIds, setComparisonCardIds] = useState<string[]>([
    'amex-platinum',
    'hdfc-diners-black',
  ]);
  const [savedCardIds, setSavedCardIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cardwatch_saved_cards');
      return stored ? JSON.parse(stored) : ['hdfc-regalia-gold', 'icici-amazon-pay'];
    } catch {
      return ['hdfc-regalia-gold', 'icici-amazon-pay'];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Synchronize saved cards
  useEffect(() => {
    localStorage.setItem('cardwatch_saved_cards', JSON.stringify(savedCardIds));
  }, [savedCardIds]);

  // Handlers
  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setCurrentScreen('card-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCompare = (cardId: string) => {
    if (comparisonCardIds.includes(cardId)) {
      setComparisonCardIds(comparisonCardIds.filter(id => id !== cardId));
    } else {
      if (comparisonCardIds.length >= 2) {
        setComparisonCardIds([comparisonCardIds[1], cardId]);
      } else {
        setComparisonCardIds([...comparisonCardIds, cardId]);
      }
    }
  };

  const handleSetCompareSlot = (slot: 0 | 1, cardId: string) => {
    setComparisonCardIds(prev => {
      const updated = [
        prev[0] || 'amex-platinum',
        prev[1] || 'hdfc-diners-black',
      ];
      updated[slot] = cardId;
      return updated;
    });
  };

  const handleRemoveFromCompare = (cardId: string) => {
    setComparisonCardIds(comparisonCardIds.filter(id => id !== cardId));
  };

  const handleToggleWallet = (cardId: string) => {
    if (isGuest) {
      promptSignIn('Sign in or create an account to save cards into your personal wallet.');
      return;
    }
    if (savedCardIds.includes(cardId)) {
      setSavedCardIds(savedCardIds.filter(id => id !== cardId));
    } else {
      setSavedCardIds([...savedCardIds, cardId]);
    }
  };

  const unreadChangesCount =
    cards.filter(c => c.recentChangeAlert).length + liveDevaluations.length;
  const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Active user profile object derived from session
  const activeUserProfile: UserProfile = {
    name: profile?.fullName || 'Cherish Goyal',
    phone: '+91 98765 43210',
    salaryMonthly: 120000,
    cibilScore: 780,
    employmentType: 'Salaried',
    city: 'Mumbai',
    isVerified: Boolean(profile?.isVerified),
    notificationPreferences: {
      devaluations: true,
      loungeThresholds: true,
      feeRevisions: true,
      expiringOffers: false,
    },
  };

  // Prevent flicker during initial session restoration
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 animate-pulse mb-4">
          <CardIcon className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase">
          Verifying CARDWATCH Session...
        </p>
      </div>
    );
  }

  // Initial Welcome and Authentication Screen: Shown if not authenticated and not in guest mode
  // (bypassed when accessing Sovereign Admin Vault directly via ?admin=1), or triggered by protected actions.
  const isAuthModalOpen =
    (!user && !isGuest && currentScreen !== 'admin') || isSignInPromptOpen;

  return (
    <div
      data-admin-unlocked={isAdminUnlocked ? 'true' : 'false'}
      className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col font-sans relative overflow-x-hidden"
    >
      {/* Bespoke FinTech EMV & Contactless Custom Cursor */}
      <CustomCursor />

      {/* Global Ambient Living Kinetic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <AnimatedVaultChamber />
      </div>

      {/* Top Symmetrical Navigation (Pure White & Green Theme) */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={screen => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userProfile={activeUserProfile}
        savedCardsCount={savedCardIds.length}
        unreadChangesCount={unreadChangesCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
      />

      {/* Screen Router */}
      <main className="flex-1 relative z-10">
        {currentScreen === 'home' && (
          <HomeScreen
            cards={cards}
            onNavigate={screen => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCard={handleSelectCard}
            userProfile={activeUserProfile}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentScreen === 'explorer' && (
          <ExplorerScreen
            cards={cards}
            onSelectCard={handleSelectCard}
            onAddToCompare={handleAddToCompare}
            comparisonCardIds={comparisonCardIds}
            onAddToWallet={handleToggleWallet}
            savedCardIds={savedCardIds}
          />
        )}

        {currentScreen === 'card-details' && (
          <CardDetailsScreen
            card={currentCard}
            onBack={() => setCurrentScreen('explorer')}
            onNavigate={setCurrentScreen}
            onAddToCompare={handleAddToCompare}
            isCompared={comparisonCardIds.includes(currentCard.id)}
            onAddToWallet={handleToggleWallet}
            isSavedInWallet={savedCardIds.includes(currentCard.id)}
          />
        )}

        {currentScreen === 'changes' && (
          <ChangesTrackerScreen
            cards={cards}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'compare' && (
          <CompareScreen
            cards={cards}
            selectedCardIds={comparisonCardIds}
            onAddCard={handleAddToCompare}
            onSetCompareSlot={handleSetCompareSlot}
            onRemoveCard={handleRemoveFromCompare}
            onSelectCard={handleSelectCard}
          />
        )}

        {currentScreen === 'tailor' && (
          <TailorCardScreen
            cards={cards}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'travel-intent' && (
          <TravelIntentScreen
            cards={cards}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'calculator' && (
          <CalculatorScreen
            cards={cards}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'ai-advisor' && (
          <AIAdvisorScreen
            cards={cards}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'wallet' && (
          <WalletScreen
            cards={cards}
            savedCardIds={savedCardIds}
            onRemoveFromWallet={handleToggleWallet}
            onAddToWallet={handleToggleWallet}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
            userProfile={activeUserProfile}
            onUpdateProfile={() => {}}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            onNavigate={setCurrentScreen}
            onSelectCard={handleSelectCard}
            isUnlocked={isAdminUnlocked}
            sessionKeyInMemory={adminSessionKey}
            onUnlocked={rawKey => {
              setIsAdminUnlocked(true);
              setAdminSessionKey(rawKey);
            }}
            onLockVault={() => {
              lockAdminVault();
              setIsAdminUnlocked(false);
              setAdminSessionKey(null);
            }}
            onRotatedKey={newRawKey => {
              setAdminSessionKey(newRawKey);
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cards={cards}
        onSelectCard={handleSelectCard}
        onNavigate={setCurrentScreen}
      />

      {/* Initial Welcome & Authentication Screen */}
      <OnboardingModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          if (isSignInPromptOpen) closeSignInPrompt();
        }}
      />

      {/* Profile & Security Management Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAuth={() => promptSignIn('Sign in to access your saved cards and customized alerts.')}
        onOpenAdmin={() => {
          setCurrentScreen('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Side Dock: Compare & Credit-Card-Themed AI Advisor */}
      {!isAuthModalOpen && (
        <FloatingAIDock
          comparisonCount={comparisonCardIds.length}
          onOpenCompare={() => {
            setCurrentScreen('compare');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          cards={cards}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => (
  <CardDataProvider>
    <AppContent />
  </CardDataProvider>
);

export default App;
