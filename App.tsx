import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { storageService } from './services/storageService';

// Pages
import { Splash } from './pages/Splash';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Workspace } from './pages/Workspace';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';

// Components
import { Layout } from './components/Shared';
import { CAIAgent } from './components/CAIAgent';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SPLASH');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = storageService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSplashComplete = () => {
    if (user) {
      setView('DASHBOARD');
    } else {
      setView('LANDING');
    }
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
    setView('LANDING');
  };

  // --- Router Logic ---
  const renderView = () => {
    switch (view) {
      case 'SPLASH':
        return <Splash onComplete={handleSplashComplete} />;
      
      case 'LANDING':
        return <Landing onStart={() => setView('AUTH')} />;
      
      case 'AUTH':
        return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setView('LANDING')} />;
      
      case 'DASHBOARD':
        return user ? (
          <Layout onNavigate={setView} currentView={view} user={user}>
            <Dashboard user={user} onNavigate={setView} />
            <CAIAgent user={user} />
          </Layout>
        ) : <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setView('LANDING')} />;

      case 'WORKSPACE':
        return user ? (
          <Layout onNavigate={setView} currentView={view} user={user}>
            <Workspace user={user} />
            <CAIAgent user={user} />
          </Layout>
        ) : null;

      case 'ACCOUNT':
        return user ? (
          <Layout onNavigate={setView} currentView={view} user={user}>
            <Account user={user} onUpdateUser={setUser} onLogout={handleLogout} />
            <CAIAgent user={user} />
          </Layout>
        ) : null;

      case 'ADMIN':
        return (user && user.role === 'ADMIN') ? (
          <Layout onNavigate={setView} currentView={view} user={user}>
            <Admin />
          </Layout>
        ) : <Dashboard user={user!} onNavigate={setView} />; // Redirect if not admin

      default:
        return <Landing onStart={() => setView('AUTH')} />;
    }
  };

  return (
    <div className="bg-vision-black min-h-screen text-gray-200 font-sans selection:bg-electric-blue selection:text-white">
      {renderView()}
    </div>
  );
};

export default App;