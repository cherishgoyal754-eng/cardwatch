import React, { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Clock,
  Fingerprint,
} from 'lucide-react';
import {
  verifyAndUnlockAdmin,
  checkAdminLockout,
  getAdminKeyFingerprint,
} from '../../utils/adminVault';
import { sound } from '../../utils/audio';

interface AdminLockGateProps {
  onUnlocked: (rawMasterKey: string, trustedDevice: boolean) => void;
  onExit: () => void;
}

export const AdminLockGate: React.FC<AdminLockGateProps> = ({ onUnlocked, onExit }) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => checkAdminLockout().waitSeconds);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      const status = checkAdminLockout();
      setLockoutSeconds(status.waitSeconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const status = checkAdminLockout();
    if (status.locked) {
      setLockoutSeconds(status.waitSeconds);
      setErrorMsg(`Vault temporarily locked. Wait ${status.waitSeconds}s before retrying.`);
      sound.playAlert();
      return;
    }

    setIsVerifying(true);
    sound.playClick();

    try {
      const result = await verifyAndUnlockAdmin(keyInput, trustDevice);
      if (result.valid) {
        sound.playSuccess();
        onUnlocked(keyInput.trim(), trustDevice);
        setKeyInput('');
      } else {
        sound.playAlert();
        setErrorMsg(result.reason || 'Invalid Master Admin Key.');
        if (result.waitSeconds) setLockoutSeconds(result.waitSeconds);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md rounded-3xl bg-slate-950 text-white border border-emerald-500/30 shadow-2xl shadow-emerald-950/30 p-7 sm:p-9 space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Owner-Only Access
              </span>
              <h1 className="text-xl font-black tracking-tight text-white">
                Sovereign Admin Vault
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <p className="relative text-xs text-slate-300 leading-relaxed">
          Enter your saved Master Admin Key to inspect project internals, manage the live 48+ card catalog, publish circular deadlines, and track every change.
        </p>

        <div className="relative flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            Active Digest
          </span>
          <span className="text-emerald-300 font-bold">{getAdminKeyFingerprint()}</span>
        </div>

        {errorMsg && (
          <div className="relative p-3.5 rounded-2xl bg-red-500/15 border border-red-400/40 text-xs text-red-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{errorMsg}</p>
              {lockoutSeconds > 0 && (
                <p className="font-mono text-[11px] text-red-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Lockout resets in {lockoutSeconds}s
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block">
              Saved Master Admin Key
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                disabled={isVerifying || lockoutSeconds > 0}
                placeholder="CW-ADM-XXXX-XXXX-XXXX"
                autoComplete="off"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-900 border border-slate-700 focus:border-emerald-400 focus:outline-none text-sm font-mono text-white placeholder:text-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={e => setTrustDevice(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 accent-emerald-500"
            />
            <span>Keep vault unlocked on this trusted browser for 24 hours</span>
          </label>

          <button
            type="submit"
            disabled={isVerifying || lockoutSeconds > 0 || !keyInput.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying SHA-256 Digest...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Admin Console</span>
              </>
            )}
          </button>
        </form>

        <div className="relative pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Salted SHA-256 Auth</span>
          <span>5-Attempt Rate Limit</span>
        </div>
      </div>
    </div>
  );
};
