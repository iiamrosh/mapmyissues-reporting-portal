export interface Issue {
  id: string;
  type: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photo: string;
  votes: number;
  priority: 'low' | 'medium' | 'immediate' | 'urgent';
  status: 'recent' | 'queue' | 'inprogress' | 'completed';
  department: string;
  expense: number;
  createdAt: number;
  votedBy: string[];
}

export interface User {
  username: string;
  role: 'citizen' | 'admin' | 'department';
  district?: string;
  town?: string;
  department?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  role: 'citizen' | 'admin' | 'department';
  district?: string;
  town?: string;
  department?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IssueFormData {
  type: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  photo?: string;
}

export interface FilterOptions {
  status?: string;
  priority?: string;
  department?: string;
  sortOrder?: string;
}
