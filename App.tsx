
import React, { useState, useCallback } from 'react';
import SplashScreen from './components/common/SplashScreen';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/core/Dashboard';
import { AppScreen, User } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setScreen(AppScreen.DASHBOARD);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setScreen(AppScreen.AUTH);
  }, []);

  const handleSplashFinished = useCallback(() => {
    setScreen(AppScreen.AUTH);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.SPLASH:
        return <SplashScreen onFinished={handleSplashFinished} />;
      case AppScreen.AUTH:
        return <AuthScreen onLogin={handleLogin} />;
      case AppScreen.DASHBOARD:
        return user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthScreen onLogin={handleLogin} />;
      default:
        return <SplashScreen onFinished={handleSplashFinished} />;
    }
  };
  
  return (
    <div className="bg-dark-charcoal min-h-screen">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-grid -z-10 opacity-20"></div>
      <style>{`
        .bg-grid {
          background-image:
            linear-gradient(to right, rgba(0, 230, 118, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 230, 118, 0.1) 1px, transparent 1px);
          background-size: 2rem 2rem;
          animation: bg-scroll 20s linear infinite;
        }

        @keyframes bg-scroll {
          from { background-position: 0 0; }
          to { background-position: -2rem -2rem; }
        }
      `}</style>
      {renderScreen()}
    </div>
  );
};

export default App;
