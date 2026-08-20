import React, { useState } from 'react';
import { Column, Card } from '../types/kanban';
import { CardComponent } from './CardComponent';
import { Plus, MoreHorizontal, ArrowUpDown, Trash2, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

interface ColumnComponentProps {
  column: Column;
  cards: Card[];
  onUpdateTitle: (title: string) => void;
  onDeleteColumn: () => void;
  onClearCompleted: () => void;
  onDuplicateColumn: () => void;
  onSortCards: () => void;
  onAddCard: (title: string) => void;
  onClickCard: (card: Card) => void;
  onDragStartCard: (e: React.DragEvent, cardId: string) => void;
  onDragOverColumn: (e: React.DragEvent) => void;
  onDragLeaveColumn: (e: React.DragEvent) => void;
  onDropOnColumn: (e: React.DragEvent, columnId: string) => void;
  onDragStartColumn?: (e: React.DragEvent, columnId: string) => void;
}

export const ColumnComponent: React.FC<ColumnComponentProps> = ({
  column,
  cards,
  onUpdateTitle,
  onDeleteColumn,
  onClearCompleted,
  onDuplicateColumn,
  onSortCards,
  onAddCard,
  onClickCard,
  onDragStartCard,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropOnColumn,
  onDragStartColumn
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput.trim() !== column.title) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(column.title);
    }
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onAddCard(newCardTitle.trim());
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOverColumn(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDragLeaveColumn(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropOnColumn(e, column.id);
  };

  const isWipExceeded = column.wipLimit && cards.length > column.wipLimit;

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div
        className="column-header"
        draggable={!!onDragStartColumn}
        onDragStart={(e) => onDragStartColumn && onDragStartColumn(e, column.id)}
      >
        <div className="column-title-area">
          <div
            className="column-color-indicator"
            style={{ backgroundColor: column.colorAccent || '#3b82f6' }}
          />

          {isEditingTitle ? (
            <input
              type="text"
              className="column-title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleBlur();
              }}
              autoFocus
            />
          ) : (
            <span
              className="column-title"
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename column"
            >
              {column.title}
            </span>
          )}

          <span
            className="card-count-badge"
            style={{
              borderColor: isWipExceeded ? '#ef4444' : undefined,
              color: isWipExceeded ? '#ef4444' : undefined
            }}
          >
            {cards.length} {column.wipLimit ? `/ ${column.wipLimit}` : ''}
          </span>

          {isWipExceeded && (
            <AlertCircle size={14} color="#ef4444" title="WIP Limit Exceeded!" />
          )}
        </div>

        {/* Column Actions Menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '190px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.4rem',
                zIndex: 40
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => {
                  onSortCards();
                  setIsMenuOpen(false);
                }}
              >
                <ArrowUpDown size={14} /> Sort by Due Date
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => {
                  onDuplicateColumn();
                  setIsMenuOpen(false);
                }}
              >
                <Copy size={14} /> Duplicate Column
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => {
                  onClearCompleted();
                  setIsMenuOpen(false);
                }}
              >
                <CheckCircle2 size={14} /> Clear Done Cards
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  color: '#ef4444',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '0.3rem',
                  paddingTop: '0.5rem'
                }}
                onClick={() => {
                  onDeleteColumn();
                  setIsMenuOpen(false);
                }}
              >
                <Trash2 size={14} /> Delete Column
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards List Target Area */}
      <div className="column-cards-list">
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onClickCard={() => onClickCard(card)}
            onDragStartCard={onDragStartCard}
          />
        ))}

        {cards.length === 0 && (
          <div
            style={{
              padding: '1.5rem 0.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              border: '1.5px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            Drop cards here
          </div>
        )}
      </div>

      {/* Add Card Box */}
      <div className="add-card-container">
        {isAddingCard ? (
          <form onSubmit={handleAddCardSubmit} className="add-card-input-box">
            <textarea
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCardSubmit(e);
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
              >
                Add Card
              </button>
            </div>
          </form>
        ) : (
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', borderStyle: 'dashed' }}
            onClick={() => setIsAddingCard(true)}
          >
            <Plus size={16} /> Add a Card
          </button>
        )}
      </div>
    </div>
  );
};
