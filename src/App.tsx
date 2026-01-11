import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';

const THEME_KEY = 'expense-tracker-theme';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Check for Env Vars immediately to trigger ErrorBoundary if missing
  // if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
  //   throw new Error("Missing Supabase Variables on Vercel.\nPlease go to Vercel Settings -> Environment Variables and add them.");
  // }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // DEBUG: Remove this before production
  const debugInfo = {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    isPlaceholder: import.meta.env.VITE_SUPABASE_URL?.includes('placeholder'),
    loading,
    hasSession: !!session,
    url: window.location.href
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Debug Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        color: 'lime',
        padding: '10px',
        fontSize: '12px',
        pointerEvents: 'none',
        maxWidth: '100%',
        overflow: 'auto'
      }}>
        <p>DEBUG MODE</p>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              !session ? (
                <LandingPage isDark={isDark} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !session ? (
                <Login isDark={isDark} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              session ? (
                <Dashboard
                  session={session}
                  isDark={isDark}
                  toggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
