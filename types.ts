
export type TransportType = 'flight' | 'train' | 'bus' | 'ferry';

export interface RouteLeg {
  id: string;
  from: string;
  to: string;
  type: TransportType;
  duration: string;
  cost: number;
  carrier: string;
}

export interface BookingOption {
  platform: string;
  price: number;
  url: string;
}

export interface TravelRoute {
  id: string;
  name: string;
  totalCost: number;
  totalDuration: string;
  transfers: number;
  legs: RouteLeg[];
  bookingOptions: BookingOption[];
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  savedRoutes: TravelRoute[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
