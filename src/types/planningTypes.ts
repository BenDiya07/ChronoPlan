export type Priority = 'p1' | 'p2' | 'p3' | 'p4';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  project: 'Travail' | 'Personnel' | 'Études' | 'Santé' | 'Finance' | string;
  estimatedMinutes: number;
  dueDate: string;
  notes?: string;
  isSyncPending?: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  bearerInjected: boolean;
  cachedInHive: boolean;
  durationMs: number;
}

export type MainView = 'simulator' | 'code' | 'rubric';
export type DeviceMode = 'mobile' | 'tablet';
export type ActiveScreen = 'tasks' | 'detail' | 'stats' | 'login';
