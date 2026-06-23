import { User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'DEV-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.io',
    mobile: '+1 (555) 019-2834',
    role: 'Frontend Engineer',
    status: 'ACTIVE',
    createdDate: '2025-11-12',
    bio: 'React enthusiast specializing in high-fidelity micro-interactions and atomic design systems.',
    githubUsername: 'sarahcodes',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEV-002',
    name: 'Marcus Chen',
    email: 'm.chen@cloudstack.net',
    mobile: '+1 (555) 014-9821',
    role: 'Backend Engineer',
    status: 'ACTIVE',
    createdDate: '2026-01-15',
    bio: 'Distributed systems engineer focused on secure gRPC pipelines, Redis caching, and Go microservices.',
    githubUsername: 'marcus-backend',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEV-003',
    name: 'Elena Rostova',
    email: 'e.rostova@devopsforce.com',
    mobile: '+1 (555) 017-3456',
    role: 'DevOps Engineer',
    status: 'ACTIVE',
    createdDate: '2025-08-20',
    bio: 'Kubernetes wizard, GitOps advocate, and champion for fully-automated Zero-Downtime CD pipelines.',
    githubUsername: 'elenak8s',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEV-004',
    name: 'David Kim',
    email: 'david.k@datalink.org',
    mobile: '+1 (555) 012-7890',
    role: 'Data Scientist',
    status: 'INACTIVE',
    createdDate: '2025-10-05',
    bio: 'Transformer model finetuning and vector-database vector embedding query optimization expert.',
    githubUsername: 'kimdata',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEV-005',
    name: 'Chloe Gallagher',
    email: 'chloe.g@debuggers.co',
    mobile: '+1 (555) 015-4422',
    role: 'QA Engineer',
    status: 'BLOCKED',
    createdDate: '2026-03-01',
    bio: 'E2E testing automation engineer writing bulletproof Playwright and Cypress test suites.',
    githubUsername: 'chloedebugs',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEV-006',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@nexuslabs.dev',
    mobile: '+1 (555) 011-9087',
    role: 'Fullstack Developer',
    status: 'ACTIVE',
    createdDate: '2026-02-18',
    bio: 'Building comprehensive Next.js architectures backed by solid relational Postgres databases.',
    githubUsername: 'arjun-nexus',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEV-007',
    name: 'Sonia Campbell',
    email: 'sonia.c@leadscale.com',
    mobile: '+1 (555) 013-1122',
    role: 'Engineering Manager',
    status: 'ACTIVE',
    createdDate: '2025-06-10',
    bio: 'Technical lead scaling engineering productivity and translating architecture to business value.',
    githubUsername: 'sonia-leads',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const VALID_ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Fullstack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'QA Engineer',
  'Engineering Manager'
] as const;

export const VALID_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'BLOCKED'
] as const;
