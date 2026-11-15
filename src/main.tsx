import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Global protection: prevent copying, cutting, dragging, and context menu across the entire app
if (typeof window !== 'undefined') {
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.clearData();
    }
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.clearData();
    }
  });

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
  });

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    // Block copy (Ctrl+C / Cmd+C) and cut (Ctrl+X / Cmd+X)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
      e.preventDefault();
    }
    // Block select-all (Ctrl+A / Cmd+A) outside form fields
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      const target = e.target as HTMLElement | null;
      if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) {
        e.preventDefault();
      }
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
