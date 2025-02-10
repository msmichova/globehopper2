export interface MeetingPoint {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Review {
  userId: string;
  rating: number; // 1 to 5
  comment: string;
}

export interface Tour {
  id: string;
  name: string;
  type: string;
  description: string;
  createdBy: string;
  location: string;
  guideName: string;
  meetingPoint?: MeetingPoint;
  itinerary?: string[];
  reviews?: Review[];
  bookedSpaces: number;
}

export interface User {
  id: string;
  name: string;
  role: "admin" | "guide" | "tourist";
  specialties?: string[];
  wishlist?: string[];
  bookings?: string[];
}
