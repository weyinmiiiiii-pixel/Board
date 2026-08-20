import React, { useState } from 'react';
import { Board, Theme } from '../types/kanban';
import {
  Trello,
  Plus,
  Moon,
  Sun,
  BarChart3,
  History,
  Download,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react';

interface HeaderProps {
  boards: Board[];
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
  onCreateBoard: (title: string, background: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenStats: () => void;
  onOpenActivity: () => void;
  onExportBoard: () => void;
  onResetData: () => void;
}

const PRESET_BACKGROUNDS = [
  { name: 'Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)' },
  { name: 'Emerald', value: 'linear-gradient(135deg, #111827 0%, #064e3b 50%, #022c22 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 50%, #111827 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #451a03 0%, #701a75 50%, #18181b 100%)' },
  { name: 'Cyberpunk', value: 'linear-gradient(135deg, #18002e 0%, #4c0519 50%, #030712 100%)' }
];

export const Header: React.FC<HeaderProps> = ({
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
  theme,
  onToggleTheme,
  onOpenStats,
  onOpenActivity,
  onExportBoard,
  onResetData
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [selectedBg, setSelectedBg] = useState(PRESET_BACKGROUNDS[0].value);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    onCreateBoard(newBoardTitle.trim(), selectedBg);
    setNewBoardTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-icon">
          <Trello size={20} />
        </div>
        <span className="logo-text">Board</span>

        {/* Board Selection Dropdown */}
        <div style={{ position: 'relative', marginLeft: '1rem' }}>
          <button
            className="board-select-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{activeBoard ? activeBoard.title : 'Select Board'}</span>
            <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '260px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 50
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.4rem 0.6rem', fontWeight: 700 }}>
                YOUR BOARDS ({boards.length})
              </div>
              {boards.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBoard(b.id);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify-content: 'space-between',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: b.id === activeBoardId ? 'var(--bg-card-hover)' : 'transparent',
                    fontSize: '0.85rem',
                    fontWeight: b.id === activeBoardId ? 700 : 500
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.title}
                  </span>
                  {b.id === activeBoardId && <Check size={14} color="var(--accent-primary)" />}
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                >
                  <Plus size={16} /> Create New Board
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
          title="Create New Board"
        >
          <Plus size={16} />
          <span>New Board</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenStats}
          title="Board Analytics & Metrics"
        >
          <BarChart3 size={16} />
          <span>Analytics</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenActivity}
          title="Activity Log"
        >
          <History size={16} />
          <span>Activity</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onExportBoard}
          title="Export Board JSON"
        >
          <Download size={16} />
          <span>Export</span>
        </button>

        <button
          className="btn btn-icon"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="btn btn-icon btn-danger"
          onClick={onResetData}
          title="Reset Demo Data"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Create Board Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Sparkles size={20} color="var(--accent-primary)" />
                Create New Board
              </div>
              <button className="btn btn-icon" onClick={() => setIsCreateModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="modal-body">
              <div className="modal-section">
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Board Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Growth Marketing"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  autoFocus
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div className="modal-section">
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Background Gradient</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {PRESET_BACKGROUNDS.map((bg) => (
                    <div
                      key={bg.name}
                      onClick={() => setSelectedBg(bg.value)}
                      style={{
                        height: '45px',
                        borderRadius: 'var(--radius-md)',
                        background: bg.value,
                        cursor: 'pointer',
                        border: selectedBg === bg.value ? '2px solid #ffffff' : '1px solid var(--border-color)',
                        boxShadow: selectedBg === bg.value ? '0 0 10px var(--accent-glow)' : 'none'
                      }}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
