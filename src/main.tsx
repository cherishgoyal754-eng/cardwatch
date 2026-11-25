import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Global protection: prevent copying, cutting, dragging, and context menu on public views,
// while permitting form inputs and unlocked Owner Admin Vault controls.
if (typeof window !== 'undefined') {
  const isAdminOrInput = (target: EventTarget | null): boolean => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
    return Boolean(el.closest && el.closest('[data-admin-unlocked="true"]'));
  };

  document.addEventListener('copy', (e) => {
    if (isAdminOrInput(e.target)) return;
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.clearData();
    }
  });

  document.addEventListener('cut', (e) => {
    if (isAdminOrInput(e.target)) return;
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.clearData();
    }
  });

  document.addEventListener('contextmenu', (e) => {
    if (isAdminOrInput(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener('selectstart', (e) => {
    if (isAdminOrInput(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    if (isAdminOrInput(e.target)) return;
    // Block copy (Ctrl+C / Cmd+C) and cut (Ctrl+X / Cmd+X)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
      e.preventDefault();
    }
    // Block select-all (Ctrl+A / Cmd+A) outside form fields
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}
