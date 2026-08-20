import React, { useState } from 'react';
import { Board, FilterOptions } from '../types/kanban';
import { Star, Search, Filter, Plus, CheckCircle2, Clock, Layers } from 'lucide-react';

interface BoardHeaderProps {
  board: Board;
  onUpdateTitle: (title: string) => void;
  onToggleFavorite: () => void;
  filterOptions: FilterOptions;
  onUpdateFilter: (updated: Partial<FilterOptions>) => void;
  onOpenFilterDrawer: () => void;
  onAddColumn: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  board,
  onUpdateTitle,
  onToggleFavorite,
  filterOptions,
  onUpdateFilter,
  onOpenFilterDrawer,
  onAddColumn
}) => {
  const [titleInput, setTitleInput] = useState(board.title);

  const handleBlur = () => {
    if (titleInput.trim() && titleInput.trim() !== board.title) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(board.title);
    }
  };

  // Calculate stats
  const allCards = Object.values(board.cards);
  const totalCards = allCards.length;
  const completedCards = allCards.filter((c) => c.completed).length;
  const overdueCards = allCards.filter((c) => {
    if (!c.dueDate || c.completed) return false;
    return new Date(c.dueDate) < new Date();
  }).length;

  return (
    <div className="board-header">
      <div className="board-title-group">
        <input
          type="text"
          className="board-title-input"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
        />

        <Star
          size={18}
          className={`fav-btn ${board.isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          style={{ cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', gap: '0.6rem', marginLeft: '0.5rem' }}>
          <div className="meta-item" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Layers size={14} /> {totalCards} Cards
          </div>
          <div className="meta-item" style={{ fontSize: '0.78rem', color: '#10b981' }}>
            <CheckCircle2 size={14} /> {completedCards} Completed
          </div>
          {overdueCards > 0 && (
            <div className="meta-item" style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>
              <Clock size={14} /> {overdueCards} Overdue
            </div>
          )}
        </div>
      </div>

      <div className="board-controls">
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search cards..."
            value={filterOptions.searchQuery}
            onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
          />
        </div>

        <button className="btn btn-secondary" onClick={onOpenFilterDrawer}>
          <Filter size={15} />
          <span>Filter</span>
          {(filterOptions.labels.length > 0 || filterOptions.priority !== 'all' || filterOptions.dueDateFilter !== 'all') && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                marginLeft: '0.2rem'
              }}
            />
          )}
        </button>

        <button className="btn btn-primary" onClick={onAddColumn}>
          <Plus size={16} />
          <span>Add Column</span>
        </button>
      </div>
    </div>
  );
};
