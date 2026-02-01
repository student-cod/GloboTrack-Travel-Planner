
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('globo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('globo_user');
    setUser(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Dashboard user={user} setUser={setUser} />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} /> : <AuthPage setUser={setUser} />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

const Navigation: React.FC<{ user: UserProfile | null, onLogout: () => void }> = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5m-14-11A9 9 0 003.366 19.055" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">GloboTrack</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Planner</Link>
          {user ? (
            <>
              <Link to="/profile" className={`text-sm font-medium transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>My Trips</Link>
              <button onClick={onLogout} className="text-sm font-medium text-slate-600 hover:text-red-500">Sign Out</button>
            </>
          ) : (
            <Link to="/auth" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-200">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-slate-200 py-8">
    <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
      <p>&copy; 2024 GloboTrack AI Travel. Experience the world smarter.</p>
    </div>
  </footer>
);

export default App;
