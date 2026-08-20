import React from 'react';
import { Board } from '../types/kanban';
import { X, BarChart3, CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

interface StatsModalProps {
  board: Board;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ board, onClose }) => {
  const cards = Object.values(board.cards);
  const totalCards = cards.length;
  const completedCards = cards.filter((c) => c.completed).length;
  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

  const overdueCards = cards.filter((c) => {
    if (!c.dueDate || c.completed) return false;
    return new Date(c.dueDate) < new Date();
  }).length;

  const urgentCards = cards.filter((c) => c.priority === 'urgent').length;
  const highCards = cards.filter((c) => c.priority === 'high').length;
  const mediumCards = cards.filter((c) => c.priority === 'medium').length;
  const lowCards = cards.filter((c) => c.priority === 'low').length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
            <BarChart3 size={20} color="var(--accent-primary)" />
            Board Analytics & Metrics
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CARDS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalCards}</div>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>PROGRESS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{completionRate}%</div>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>OVERDUE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{overdueCards}</div>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>URGENT</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{urgentCards}</div>
            </div>
          </div>

          {/* Cards per Column Breakdown */}
          <div className="modal-section">
            <div className="modal-section-title">
              <Layers size={16} /> Column Distribution
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {board.columns.map((col) => {
                const count = col.cardIds.length;
                const pct = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;
                return (
                  <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 600 }}>{col.title}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {count} cards ({pct}%)
                      </span>
                    </div>
                    <div className="checklist-progress-bar" style={{ height: '8px' }}>
                      <div
                        className="checklist-progress-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: col.colorAccent || 'var(--accent-primary)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="modal-section">
            <div className="modal-section-title">
              <AlertTriangle size={16} /> Priority Breakdown
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--priority-urgent)', fontWeight: 700 }}>URGENT</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{urgentCards}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--priority-high)', fontWeight: 700 }}>HIGH</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{highCards}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--priority-medium)', fontWeight: 700 }}>MEDIUM</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{mediumCards}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--priority-low)', fontWeight: 700 }}>LOW</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{lowCards}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
