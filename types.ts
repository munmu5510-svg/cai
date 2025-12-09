export type PlanType = 'STANDARD' | 'PRO_PLUS' | 'NONE';
export type RoleType = 'USER' | 'ADMIN';
export type ViewState = 'SPLASH' | 'LANDING' | 'AUTH' | 'DASHBOARD' | 'WORKSPACE' | 'ACCOUNT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  role: RoleType;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface BusinessConcept {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  strategy?: string;
}

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  logout: () => void;
}
