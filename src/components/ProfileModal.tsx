import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/security';
import { sound } from '../utils/audio';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Trash2,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Bell,
  Sliders,
  Check
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenAdmin,
}) => {
  const {
    user,
    profile,
    isGuest,
    signOut,
    signOutAllDevices,
    updatePassword,
    updateProfileName,
    deleteAccount,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'danger'>('profile');

  // Edit Name State
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.fullName || '');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Notification State
  const [notifyDevaluations, setNotifyDevaluations] = useState(true);
  const [notifyLounge, setNotifyLounge] = useState(true);
  const [notifyFees, setNotifyFees] = useState(true);
  const [notifyOffers, setNotifyOffers] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsLoading(true);
    setStatusMessage(null);
    sound.playClick();

    const res = await updateProfileName(nameInput.trim());
    setIsLoading(false);
    if (res.success) {
      sound.playSuccess();
      setStatusMessage({ text: 'Name updated successfully.', isError: false });
      setEditingName(false);
    } else {
      sound.playDevaluation();
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const val = validatePassword(newPassword);
    if (!val.valid) {
      sound.playDevaluation();
      setStatusMessage({ text: val.errors[0] || 'Password does not meet requirements.', isError: true });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      sound.playDevaluation();
      setStatusMessage({ text: 'Passwords do not match.', isError: true });
      return;
    }

    setIsLoading(true);
    sound.playClick();
    const res = await updatePassword(newPassword);
    setIsLoading(false);

    if (res.success) {
      sound.playSuccess();
      setStatusMessage({ text: res.message, isError: false });
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      sound.playDevaluation();
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const handleSignOut = async () => {
    sound.playClick();
    await signOut();
    onClose();
  };

  const handleSignOutAll = async () => {
    sound.playClick();
    await signOutAllDevices();
    onClose();
  };

  const handleDeleteAccount = async () => {
    sound.playDevaluation();
    setIsLoading(true);
    const res = await deleteAccount();
    setIsLoading(false);
    if (res.success) {
      onClose();
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const passVal = validatePassword(newPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md text-slate-900 select-none overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto rounded-[28px] bg-white p-6 sm:p-8 border border-emerald-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-mono font-extrabold text-xl shadow-md shadow-emerald-600/20">
              {profile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'G'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isGuest ? 'Guest Explorer' : profile?.fullName || user?.email?.split('@')[0] || 'User Profile'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-emerald-700 flex items-center gap-1 font-mono font-bold">
                  {isGuest ? (
                    <>
                      <Sliders className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-700">Guest Access</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified Member ({profile?.role || 'Customer'})</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-emerald-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Mode Callout */}
        {isGuest && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">You are browsing as a Guest</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Your customized card alerts and wallet preferences are currently stored temporarily in this browser session. Create a verified account to sync your cards across devices.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In or Create Verified Account</span>
            </button>
          </div>
        )}

        {/* Tabs */}
        {!isGuest && (
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('profile');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('security');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'security' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('notifications');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'notifications' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('danger');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'danger' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Danger
            </button>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-start gap-2 ${
              statusMessage.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {statusMessage.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* TAB 1: PROFILE ACCOUNT INFO */}
        {!isGuest && activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">FULL NAME</span>
                {editingName ? (
                  <form onSubmit={handleUpdateName} className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="px-2 py-1 text-xs font-bold rounded-lg border border-emerald-300 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      className="text-xs text-slate-500"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <span className="text-sm font-extrabold text-slate-900">
                    {profile?.fullName || 'CARDWATCH Member'}
                  </span>
                )}
              </div>
              {!editingName && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setEditingName(true);
                  }}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">EMAIL ADDRESS</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {user?.email || profile?.email || 'member@cardwatch.in'}
                </span>
              </div>
              <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                PRIMARY
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">SYSTEM ROLE</span>
                <span className="text-sm font-extrabold text-slate-900 uppercase font-mono">
                  {profile?.role || 'Customer'}
                </span>
              </div>
              <span className="text-xs text-slate-500">Tier 1 Consumer</span>
            </div>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/30 shadow-md cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Sovereign Admin Vault (Master Key)</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {!isGuest && activeTab === 'security' && (
          <div className="space-y-4">
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900">Change Account Password</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  New Password (min 12 characters)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />

                {newPassword.length > 0 && (
                  <div className="mt-1.5 p-2 rounded-lg bg-slate-50 text-[10px] text-slate-600 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Strength Score:</span>
                      <span className={passVal.score >= 3 ? 'text-emerald-600' : 'text-amber-600'}>
                        {passVal.score >= 3 ? 'Strong' : 'Insufficient'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !passVal.valid || newPassword !== confirmNewPassword}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900">Active Sessions</h4>
              <button
                onClick={handleSignOutAll}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-slate-600" />
                <span>Sign Out All Other Devices</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {!isGuest && activeTab === 'notifications' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Devaluation Alerts</span>
                <span className="text-[11px] text-slate-600">Immediate notice on reward cuts & merchant caps</span>
              </div>
              <input
                type="checkbox"
                checked={notifyDevaluations}
                onChange={e => setNotifyDevaluations(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Lounge Spend Thresholds</span>
                <span className="text-[11px] text-slate-600">Alerts when quarterly spend rules change</span>
              </div>
              <input
                type="checkbox"
                checked={notifyLounge}
                onChange={e => setNotifyLounge(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Annual Fee Revisions</span>
                <span className="text-[11px] text-slate-600">Fee hikes and waiver condition revisions</span>
              </div>
              <input
                type="checkbox"
                checked={notifyFees}
                onChange={e => setNotifyFees(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>
          </div>
        )}

        {/* TAB 4: DANGER ZONE */}
        {!isGuest && activeTab === 'danger' && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold text-rose-900">Permanent Account Deletion</h4>
                <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                  Deleting your account will irreversibly erase your saved credit cards, custom alert preferences, and history. This action cannot be undone.
                </p>
              </div>
            </div>

            {showDeleteConfirm ? (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-rose-800">
                  Are you absolutely certain? Confirming will delete all data immediately.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span>Confirm Delete</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete My Account Permanently</span>
              </button>
            )}
          </div>
        )}

        {/* Sign Out Button */}
        {!isGuest && (
          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-extrabold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Current Device</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
