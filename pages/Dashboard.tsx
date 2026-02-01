
import React, { useState } from 'react';
import { getTravelRoutes } from '../services/geminiService';
import { TravelRoute, UserProfile } from '../types';
import RouteCard from '../components/RouteCard';
import AIChatbot from '../components/AIChatbot';

interface DashboardProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<TravelRoute[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;

    setLoading(true);
    setError('');
    setRoutes([]);

    try {
      const results = await getTravelRoutes(source, destination);
      setRoutes(results);
      if (results.length === 0) setError("No routes found. Try different cities.");
    } catch (err) {
      setError("Failed to fetch routes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = (route: TravelRoute) => {
    if (!user) {
      alert("Please sign in to save routes.");
      return;
    }
    
    // Check if already saved
    if (user.savedRoutes.some(r => r.name === route.name)) return;

    const updatedUser = {
      ...user,
      savedRoutes: [...user.savedRoutes, { ...route, id: Date.now().toString() }]
    };
    setUser(updatedUser);
    localStorage.setItem('globo_user', JSON.stringify(updatedUser));
  };

  const isRouteSaved = (routeName: string) => {
    return user?.savedRoutes.some(r => r.name === routeName) || false;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Search & Results Section */}
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Plan your next adventure</h1>
            <p className="text-slate-500">Enter your source and destination to find the best multi-modal routes.</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">From</label>
              <input
                type="text"
                placeholder="e.g. London"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
            <div className="flex-grow space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">To</label>
              <input
                type="text"
                placeholder="e.g. Kyoto"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-8 py-3 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <span>Find Routes</span>
              )}
            </button>
          </form>
        </section>

        {loading && (
          <div className="space-y-4">
            <div className="h-64 bg-white animate-pulse rounded-3xl border border-slate-100"></div>
            <div className="h-64 bg-white animate-pulse rounded-3xl border border-slate-100"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        {!loading && routes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Suggested Routes</h2>
            </div>
            {routes.map((route) => (
              <RouteCard 
                key={route.id} 
                route={route} 
                onSave={handleSaveRoute}
                isSaved={isRouteSaved(route.name)}
              />
            ))}
          </div>
        )}

        {!loading && routes.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <svg className="w-24 h-24 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <p className="text-lg">Your next journey starts here</p>
          </div>
        )}
      </div>

      {/* Sidebar Section */}
      <div className="lg:col-span-1 space-y-8">
        <AIChatbot />
        
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
          <h4 className="text-lg font-bold mb-2">Travel Insights</h4>
          <p className="text-sm text-blue-100 mb-4">Globotrack uses real-time AI to analyze millions of flight and transit hubs to bring you the best indirect routes.</p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>Carbon tracking integration coming soon</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>Verified carrier estimates</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
