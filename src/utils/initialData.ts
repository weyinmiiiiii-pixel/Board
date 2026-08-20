import { Board, ActivityLog } from '../types/kanban';

export const DEFAULT_LABELS = {
  frontend: { id: 'lbl-1', name: 'Frontend', color: '#60a5fa', bgColor: 'rgba(96, 165, 250, 0.15)' },
  backend: { id: 'lbl-2', name: 'Backend', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.15)' },
  design: { id: 'lbl-3', name: 'UI/UX Design', color: '#f472b6', bgColor: 'rgba(244, 114, 182, 0.15)' },
  bug: { id: 'lbl-4', name: 'Bug Fix', color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.15)' },
  feature: { id: 'lbl-5', name: 'New Feature', color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)' },
  docs: { id: 'lbl-6', name: 'Documentation', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.15)' },
};

// Helper dates
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const INITIAL_BOARDS: Board[] = [
  {
    id: 'board-software-engineering',
    title: '🚀 Software Roadmap 2026',
    description: 'Sprint planning & feature tracking for main engineering roadmap',
    isFavorite: true,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columns: [
      {
        id: 'col-backlog',
        title: '📋 Backlog',
        cardIds: ['card-1', 'card-2'],
        wipLimit: 10,
        colorAccent: '#60a5fa'
      },
      {
        id: 'col-in-progress',
        title: '⚡ In Progress',
        cardIds: ['card-3', 'card-4'],
        wipLimit: 3,
        colorAccent: '#f59e0b'
      },
      {
        id: 'col-review',
        title: '🔍 Code Review',
        cardIds: ['card-5'],
        wipLimit: 4,
        colorAccent: '#a78bfa'
      },
      {
        id: 'col-done',
        title: '✅ Completed',
        cardIds: ['card-6'],
        wipLimit: 20,
        colorAccent: '#10b981'
      }
    ],
    cards: {
      'card-1': {
        id: 'card-1',
        columnId: 'col-backlog',
        title: 'Implement OAuth 2.0 & Social Login',
        description: 'Integrate Google, GitHub, and Apple SSO authentication flows into user accounts service.',
        priority: 'high',
        labels: [DEFAULT_LABELS.backend, DEFAULT_LABELS.feature],
        dueDate: nextWeek,
        coverColor: '#3b82f6',
        checklist: [
          { id: 'chk-1', text: 'Configure Google Developer Console credentials', completed: true },
          { id: 'chk-2', text: 'Implement JWT refresh token rotation logic', completed: false },
          { id: 'chk-3', text: 'Write end-to-end integration tests', completed: false }
        ],
        comments: [
          {
            id: 'cmt-1',
            author: 'Alex Rivera',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            text: 'Ensure PKCE extension is enforced for mobile web auth flow.',
            createdAt: yesterday
          }
        ],
        assignees: [
          { id: 'usr-1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
          { id: 'usr-2', name: 'Samantha Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'card-2': {
        id: 'card-2',
        columnId: 'col-backlog',
        title: 'Dark Mode Visual Polish & Contrast Audit',
        description: 'Verify accessibility WCAG 2.1 AAA color contrast ratios across all dark mode theme variables.',
        priority: 'medium',
        labels: [DEFAULT_LABELS.frontend, DEFAULT_LABELS.design],
        dueDate: tomorrow,
        coverColor: '#ec4899',
        checklist: [
          { id: 'chk-4', text: 'Audit text contrast ratio in dropdown menus', completed: true },
          { id: 'chk-5', text: 'Test glassmorphism blur effect on Firefox', completed: true }
        ],
        comments: [],
        assignees: [
          { id: 'usr-3', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'card-3': {
        id: 'card-3',
        columnId: 'col-in-progress',
        title: 'Real-time WebSocket Notifications Engine',
        description: 'Build bi-directional event stream for live updates when teammates edit board cards.',
        priority: 'urgent',
        labels: [DEFAULT_LABELS.backend, DEFAULT_LABELS.feature],
        dueDate: tomorrow,
        coverColor: '#ef4444',
        checklist: [
          { id: 'chk-6', text: 'Setup Redis Pub/Sub backend broker', completed: true },
          { id: 'chk-7', text: 'Build client heartbeat reconnection handler', completed: true },
          { id: 'chk-8', text: 'Add badge notification sound feedback', completed: false }
        ],
        comments: [
          {
            id: 'cmt-2',
            author: 'Samantha Chen',
            authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
            text: 'WebSocket channel auth token verification is working cleanly in local tests!',
            createdAt: now.toISOString()
          }
        ],
        assignees: [
          { id: 'usr-2', name: 'Samantha Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'card-4': {
        id: 'card-4',
        columnId: 'col-in-progress',
        title: 'Mobile Touch Drag & Drop Optimization',
        description: 'Enhance pointer event handlers to support fluid touch drag experience on iOS and Android browsers.',
        priority: 'high',
        labels: [DEFAULT_LABELS.frontend],
        dueDate: nextWeek,
        coverColor: '#10b981',
        checklist: [
          { id: 'chk-9', text: 'Prevent background scrolling while dragging item', completed: true },
          { id: 'chk-10', text: 'Add touch vibration feedback triggers', completed: false }
        ],
        comments: [],
        assignees: [
          { id: 'usr-1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'card-5': {
        id: 'card-5',
        columnId: 'col-review',
        title: 'Database Query Indexing & Performance Tuning',
        description: 'Optimize PostgreSQL slow query logs; add compound indexes for multi-column card filters.',
        priority: 'medium',
        labels: [DEFAULT_LABELS.backend, DEFAULT_LABELS.bug],
        dueDate: yesterday, // Overdue example
        coverColor: '#8b5cf6',
        checklist: [
          { id: 'chk-11', text: 'Analyze EXPLAIN ANALYZE on card search queries', completed: true },
          { id: 'chk-12', text: 'Benchmark 10,000 card bulk fetch performance', completed: true }
        ],
        comments: [
          {
            id: 'cmt-3',
            author: 'David Kim',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            text: 'Query response time dropped from 420ms down to 14ms! PR is ready for review.',
            createdAt: yesterday
          }
        ],
        assignees: [
          { id: 'usr-3', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'card-6': {
        id: 'card-6',
        columnId: 'col-done',
        title: 'Setup Vite + React Development Suite',
        description: 'Scaffold initial repository with TypeScript configuration, CSS utility setup, and icon library.',
        priority: 'low',
        labels: [DEFAULT_LABELS.frontend, DEFAULT_LABELS.docs],
        completed: true,
        checklist: [
          { id: 'chk-13', text: 'Configure ESLint and Prettier formatting rules', completed: true },
          { id: 'chk-14', text: 'Setup production bundle build scripts', completed: true }
        ],
        comments: [],
        assignees: [
          { id: 'usr-1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },
  {
    id: 'board-product-launch',
    title: '🎯 Product Launch Campaign Q3',
    description: 'Marketing, social media assets, and press releases for v2.0 launch',
    isFavorite: false,
    background: 'linear-gradient(135deg, #111827 0%, #064e3b 50%, #022c22 100%)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columns: [
      { id: 'pl-col-ideas', title: '💡 Ideas & Prep', cardIds: ['pl-card-1'], colorAccent: '#38bdf8' },
      { id: 'pl-col-creative', title: '🎨 Creative Assets', cardIds: ['pl-card-2'], colorAccent: '#f472b6' },
      { id: 'pl-col-published', title: '🚀 Published', cardIds: ['pl-card-3'], colorAccent: '#34d399' }
    ],
    cards: {
      'pl-card-1': {
        id: 'pl-card-1',
        columnId: 'pl-col-ideas',
        title: 'Draft Product Hunt Pitch & Video Script',
        description: 'Write engaging copy highlighting key features, interactive demo link, and founder story.',
        priority: 'high',
        labels: [DEFAULT_LABELS.docs, DEFAULT_LABELS.feature],
        checklist: [
          { id: 'chk-p1', text: 'Record 90-second product demo video', completed: false },
          { id: 'chk-p2', text: 'Prepare high-res gallery screenshots', completed: true }
        ],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'pl-card-2': {
        id: 'pl-card-2',
        columnId: 'pl-col-creative',
        title: 'Design Social Banner Templates & Teaser Cards',
        description: 'Create 1200x630px OG images for Twitter/X, LinkedIn, and blog posts.',
        priority: 'medium',
        labels: [DEFAULT_LABELS.design],
        coverColor: '#ec4899',
        checklist: [
          { id: 'chk-p3', text: 'Export PNG and WebP web formats', completed: true }
        ],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'pl-card-3': {
        id: 'pl-card-3',
        columnId: 'pl-col-published',
        title: 'Send Launch Announcement Newsletter',
        description: 'Distribute release update email to 25,000 subscriber mailing list.',
        priority: 'urgent',
        labels: [DEFAULT_LABELS.feature],
        completed: true,
        checklist: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    boardId: 'board-software-engineering',
    action: 'Card Moved',
    details: 'Moved "Real-time WebSocket Notifications Engine" to In Progress',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    user: 'Samantha Chen'
  },
  {
    id: 'act-2',
    boardId: 'board-software-engineering',
    action: 'Comment Added',
    details: 'Added comment to "Database Query Indexing & Performance Tuning"',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    user: 'David Kim'
  },
  {
    id: 'act-3',
    boardId: 'board-software-engineering',
    action: 'Checklist Updated',
    details: 'Completed subtask in "Dark Mode Visual Polish & Contrast Audit"',
    timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    user: 'Alex Rivera'
  }
];
