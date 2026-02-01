
import React from 'react';
import { UserProfile, TravelRoute } from '../types';
import RouteCard from '../components/RouteCard';

interface ProfilePageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  const handleDeleteRoute = (routeId: string) => {
    const updatedRoutes = user.savedRoutes.filter(r => r.id !== routeId);
    const updatedUser = { ...user, savedRoutes: updatedRoutes };
    setUser(updatedUser);
    localStorage.setItem('globo_user', JSON.stringify(updatedUser));
  };

  const handleUpdateBio = (newBio: string) => {
    const updatedUser = { ...user, bio: newBio };
    setUser(updatedUser);
    localStorage.setItem('globo_user', JSON.stringify(updatedUser));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-md">
            {user.name.charAt(0)}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-500 mb-4">{user.email}</p>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
              placeholder="Tell us about your travel style..."
              value={user.bio}
              onChange={(e) => handleUpdateBio(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Saved Routes</h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
            {user.savedRoutes.length} saved
          </span>
        </div>

        {user.savedRoutes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400">You haven't saved any routes yet. Start exploring!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {user.savedRoutes.map((route) => (
              <div key={route.id} className="relative group">
                <button 
                  onClick={() => handleDeleteRoute(route.id)}
                  className="absolute -top-2 -right-2 z-10 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Route"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <RouteCard route={route} isSaved={true} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
