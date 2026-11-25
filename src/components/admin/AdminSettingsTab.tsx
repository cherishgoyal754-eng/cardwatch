import React, { useState } from 'react';
import {
  getAdminKeyFingerprint,
  hasCustomRotatedKey,
  rotateAdminKey,
  resetCustomKeyRotation,
  generateStrongAdminKey,
} from '../../utils/adminVault';
import { CloudSyncStatus } from '../../context/CardDataContext';
import {
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Download,
  Upload,
  Trash2,
  Database,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Lock,
} from 'lucide-react';

interface AdminSettingsTabProps {
  cloudSync: CloudSyncStatus;
  onRefreshSupabase: () => Promise<CloudSyncStatus>;
  onExportSnapshot: () => string;
  onImportSnapshot: (jsonStr: string) => { success: boolean; message: string };
  onResetAllOverrides: () => void;
  onLockVault: () => void;
  onRotatedKey: (newRawKey: string) => void;
}

const ADMIN_PROMOTE_SQL = `-- Run in Supabase SQL Editor to make your account a Global Cloud Admin:
UPDATE public.profiles
SET role = 'admin', is_verified = TRUE
WHERE email = 'cherishgoyal754@gmail.com';`;

const CMS_MIGRATION_HINT = `-- Full migration stored in repo at:
-- supabase/migrations/20261125_admin_cms_tables.sql
-- Creating public.cardwatch_admin_cards, public.cardwatch_admin_devaluations, public.cardwatch_project_changes`;

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  cloudSync,
  onRefreshSupabase,
  onExportSnapshot,
  onImportSnapshot,
  onResetAllOverrides,
  onLockVault,
  onRotatedKey,
}) => {
  const [currentKeyInput, setCurrentKeyInput] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [rotationResult, setRotationResult] = useState<{
    success: boolean;
    message: string;
    newHash?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleCopy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRotate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await rotateAdminKey(currentKeyInput, newKeyInput);
    setRotationResult(res);
    if (res.success) {
      onRotatedKey(newKeyInput.trim());
      setCurrentKeyInput('');
      setNewKeyInput('');
    }
  };

  const handleDownloadBackup = () => {
    const data = onExportSnapshot();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardwatch-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setImportStatus(onImportSnapshot(text));
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Key Management */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Saved Master Key & Vault Control</h3>
                <p className="text-[11px] font-mono text-slate-500">
                  Digest: {getAdminKeyFingerprint()} {hasCustomRotatedKey() ? '(Browser-Rotated)' : '(Env Baseline)'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLockVault}
              className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Now</span>
            </button>
          </div>

          <form onSubmit={handleRotate} className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-slate-800">Rotate / Set Personal Master Key</h4>
            <input
              type="password"
              value={currentKeyInput}
              onChange={e => setCurrentKeyInput(e.target.value)}
              placeholder="Current Master Admin Key"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyInput}
                onChange={e => setNewKeyInput(e.target.value)}
                placeholder="New Master Key (min 14 chars)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setNewKeyInput(generateStrongAdminKey())}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Generate</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={!currentKeyInput || newKeyInput.trim().length < 14}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black cursor-pointer"
              >
                Save New Key Hash
              </button>

              {hasCustomRotatedKey() && (
                <button
                  type="button"
                  onClick={resetCustomKeyRotation}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Revert to Deployment Env Key
                </button>
              )}
            </div>

            {rotationResult && (
              <div
                className={`p-3 rounded-xl text-xs border space-y-1.5 ${
                  rotationResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <p className="font-bold">{rotationResult.message}</p>
                {rotationResult.newHash && (
                  <div className="space-y-1">
                    <p className="text-[11px]">
                      To bake this rotated key across ALL deployments permanently, set{' '}
                      <code className="font-mono font-bold">VITE_ADMIN_KEY_HASH</code> &{' '}
                      <code className="font-mono font-bold">CARDWATCH_ADMIN_KEY_HASH</code> to:
                    </p>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-emerald-200 font-mono text-[10px] break-all">
                      <span className="flex-1">{rotationResult.newHash}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('newhash', rotationResult.newHash!)}
                        className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0"
                      >
                        {copiedId === 'newhash' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Supabase Global Sync Setup */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Global Cloud Sync (Supabase CMS)</h3>
                <p className="text-[11px] text-slate-500">Sync your admin changes live to all visitors globally</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRefreshSupabase}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
              cloudSync.cloudTablesReady
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <div className="font-bold">
                {cloudSync.cloudTablesReady ? 'Connected to Supabase Global CMS Tables' : 'Local Browser Vault Active'}
              </div>
              <p className="text-[11px] mt-0.5">{cloudSync.message}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">
                1. Promote Your Supabase Account
              </span>
              <button
                type="button"
                onClick={() => handleCopy('promotesql', ADMIN_PROMOTE_SQL)}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'promotesql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'promotesql' ? 'Copied SQL' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto">
              {ADMIN_PROMOTE_SQL}
            </pre>
            <p className="text-[11px] text-slate-500 font-mono">{CMS_MIGRATION_HINT}</p>
          </div>
        </div>
      </div>

      {/* Snapshot Backup / Restore / Reset */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">Project Snapshot Backup & Restore</h3>
            <p className="text-[11px] text-slate-500">
              Export all your card edits, circular notices, and change ledger into portable JSON
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
            <label className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import File</span>
              <input type="file" accept="application/json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Or paste exported CARDWATCH snapshot JSON here to restore..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
          />
          <button
            type="button"
            disabled={!importText.trim()}
            onClick={() => setImportStatus(onImportSnapshot(importText))}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
          >
            Restore JSON
          </button>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              importStatus.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {importStatus.message}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-red-700 font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Reset all local card edits & custom devaluations back to repository baseline.</span>
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Overrides</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetAllOverrides();
                  setConfirmReset(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
