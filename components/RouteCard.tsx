
import React from 'react';
import { TravelRoute, RouteLeg, TransportType } from '../types';

interface RouteCardProps {
  route: TravelRoute;
  onSave?: (route: TravelRoute) => void;
  isSaved?: boolean;
}

const getIcon = (type: TransportType) => {
  switch (type) {
    case 'flight': return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    );
    case 'train': return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    );
    case 'bus': return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    );
    default: return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
};

const RouteCard: React.FC<RouteCardProps> = ({ route, onSave, isSaved }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{route.name}</h3>
          <p className="text-sm text-slate-500">{route.totalDuration} • {route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">₹{route.totalCost.toLocaleString('en-IN')}</p>
          <button 
            onClick={() => onSave?.(route)}
            className={`mt-2 text-sm font-medium transition-colors ${isSaved ? 'text-green-600' : 'text-slate-400 hover:text-blue-600'}`}
          >
            {isSaved ? 'Saved to Profile' : '+ Save Route'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {route.legs.map((leg, index) => (
          <div key={leg.id || index} className="relative pl-8 pb-4 last:pb-0">
            {index !== route.legs.length - 1 && (
              <div className="absolute left-[14px] top-6 bottom-0 w-0.5 bg-slate-100"></div>
            )}
            <div className="absolute left-0 top-1 p-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
              {getIcon(leg.type)}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-800">{leg.from} → {leg.to}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{leg.carrier || 'Standard'} • {leg.duration}</p>
              </div>
              <p className="text-sm font-medium text-slate-600">₹{leg.cost.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase w-full block mb-3">Compare & Book on:</span>
        <div className="flex flex-wrap gap-3">
          {route.bookingOptions.map((option, idx) => (
            <a 
              key={idx} 
              href={option.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 transition-colors shadow-sm"
            >
              <span>{option.platform}</span>
              <span className="opacity-40">|</span>
              <span>₹{option.price.toLocaleString('en-IN')}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
