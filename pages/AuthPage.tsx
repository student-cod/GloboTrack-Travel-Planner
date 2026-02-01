
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface AuthPageProps {
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful authentication
    const mockUser: UserProfile = {
      name: isLogin ? (email.split('@')[0] || 'User') : name,
      email: email,
      bio: "Avid traveler looking for unique routes.",
      savedRoutes: []
    };
    
    setUser(mockUser);
    localStorage.setItem('globo_user', JSON.stringify(mockUser));
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-slate-500 mt-2">
          {isLogin ? 'Sign in to access your saved trips.' : 'Start your smarter travel journey today.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase ml-2">Email Address</label>
          <input
            type="email"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase ml-2">Password</label>
          <input
            type="password"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all mt-4"
        >
          {isLogin ? 'Sign In' : 'Join GloboTrack'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-blue-600 hover:text-blue-700"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
