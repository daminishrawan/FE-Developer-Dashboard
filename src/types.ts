export type UserRole = 'Frontend Engineer' | 'Backend Engineer' | 'Fullstack Developer' | 'DevOps Engineer' | 'Data Scientist' | 'QA Engineer' | 'Engineering Manager';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface User {
  id: string; // e.g. "DEV-001"
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  createdDate: string; // YYYY-MM-DD
  bio?: string;
  githubUsername?: string;
  avatarUrl?: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  status?: string;
}
