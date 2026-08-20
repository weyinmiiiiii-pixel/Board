import { Board, ActivityLog, Theme } from '../types/kanban';
import { INITIAL_BOARDS, INITIAL_ACTIVITY_LOGS } from './initialData';

const BOARDS_KEY = 'kanban_trello_boards_v1';
const ACTIVE_BOARD_KEY = 'kanban_trello_active_board_v1';
const ACTIVITY_LOGS_KEY = 'kanban_trello_activity_logs_v1';
const THEME_KEY = 'kanban_trello_theme_v1';

export const loadBoards = (): Board[] => {
  try {
    const saved = localStorage.getItem(BOARDS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading boards from localStorage:', err);
  }
  return INITIAL_BOARDS;
};

export const saveBoards = (boards: Board[]) => {
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  } catch (err) {
    console.error('Error saving boards to localStorage:', err);
  }
};

export const loadActiveBoardId = (defaultId: string): string => {
  try {
    const saved = localStorage.getItem(ACTIVE_BOARD_KEY);
    if (saved) return saved;
  } catch (err) {
    console.error('Error loading active board ID:', err);
  }
  return defaultId;
};

export const saveActiveBoardId = (boardId: string) => {
  try {
    localStorage.setItem(ACTIVE_BOARD_KEY, boardId);
  } catch (err) {
    console.error('Error saving active board ID:', err);
  }
};

export const loadActivityLogs = (): ActivityLog[] => {
  try {
    const saved = localStorage.getItem(ACTIVITY_LOGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading activity logs:', err);
  }
  return INITIAL_ACTIVITY_LOGS;
};

export const saveActivityLogs = (logs: ActivityLog[]) => {
  try {
    // Keep last 100 entries to maintain performance
    const trimmed = logs.slice(0, 100);
    localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Error saving activity logs:', err);
  }
};

export const loadTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (err) {
    console.error('Error loading theme preference:', err);
  }
  return 'dark';
};

export const saveTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Error saving theme preference:', err);
  }
};

export const resetToDemoData = (): { boards: Board[]; logs: ActivityLog[] } => {
  try {
    localStorage.removeItem(BOARDS_KEY);
    localStorage.removeItem(ACTIVE_BOARD_KEY);
    localStorage.removeItem(ACTIVITY_LOGS_KEY);
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
  return { boards: INITIAL_BOARDS, logs: INITIAL_ACTIVITY_LOGS };
};

export const exportBoardJSON = (board: Board) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(board, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${board.title.replace(/[^a-zA-Z0-9]/g, '_')}_kanban.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
