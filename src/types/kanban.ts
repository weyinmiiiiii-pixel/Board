export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Label {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: string;
}

export interface Card {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: Priority;
  labels: Label[];
  checklist: ChecklistItem[];
  dueDate?: string;
  completed?: boolean;
  coverColor?: string;
  comments: Comment[];
  attachments?: Attachment[];
  assignees?: { id: string; name: string; avatar: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
  wipLimit?: number;
  colorAccent?: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  isFavorite?: boolean;
  background: string; // gradient or color
  columns: Column[];
  cards: Record<string, Card>;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  boardId: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface FilterOptions {
  searchQuery: string;
  labels: string[];
  priority: Priority | 'all';
  dueDateFilter: 'all' | 'overdue' | 'dueToday' | 'dueThisWeek' | 'noDueDate';
  sortBy: 'manual' | 'dueDate' | 'priority' | 'title' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export type Theme = 'dark' | 'light';
