import React from 'react';
import { ActivityLog } from '../types/kanban';
import { X, History, Activity } from 'lucide-react';

interface ActivityLogDrawerProps {
  logs: ActivityLog[];
  onClose: () => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({ logs, onClose }) => {
  const formatTime = (ts: string) => {
    try {
      const diffMs = Date.now() - new Date(ts).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <History size={18} color="var(--accent-primary)" /> Activity History
        </div>
        <button className="btn btn-icon" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="drawer-body">
        {logs.length === 0 ? (
          <div className="empty-board-cue">
            <Activity size={32} />
            <span>No activity recorded yet</span>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                background: 'var(--bg-secondary)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.user}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatTime(log.timestamp)}
                </span>
              </div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.78rem' }}>
                {log.action}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>{log.details}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
