export interface Guide {
  id: string;
  name: string;
  photoUrl: string;
  bio: string;
  languages: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  location: string;
  specialties: string[];
  verified: boolean;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  itinerary: string[];
  images: string[];
  price: number;
  duration: string;
  location: string;
  guideId: string;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  date: string;
  targetId: string; // guideId or tourId
}

export interface Booking {
  id: string;
  userId: string;
  guideId: string;
  tourId?: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: string;
}
