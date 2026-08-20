import React from 'react';
import { Card } from '../types/kanban';
import { CheckSquare, MessageSquare, Clock, Paperclip } from 'lucide-react';

interface CardComponentProps {
  card: Card;
  onClickCard: () => void;
  onDragStartCard: (e: React.DragEvent, cardId: string) => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onClickCard,
  onDragStartCard
}) => {
  const completedChecklistItems = card.checklist ? card.checklist.filter((i) => i.completed).length : 0;
  const totalChecklistItems = card.checklist ? card.checklist.length : 0;

  // Due date status evaluation
  const isOverdue = card.dueDate && !card.completed && new Date(card.dueDate) < new Date();
  const isDueSoon =
    card.dueDate &&
    !card.completed &&
    !isOverdue &&
    new Date(card.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => onDragStartCard(e, card.id)}
      onClick={onClickCard}
    >
      {/* Cover Color Bar */}
      {card.coverColor && (
        <div className="card-cover-bar" style={{ backgroundColor: card.coverColor }} />
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="card-labels">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="label-pill"
              style={{
                color: label.color,
                backgroundColor: label.bgColor,
                border: `1px solid ${label.color}40`
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <div
        className="card-title"
        style={{
          textDecoration: card.completed ? 'line-through' : 'none',
          opacity: card.completed ? 0.65 : 1
        }}
      >
        {card.title}
      </div>

      {/* Footer Details & Indicators */}
      <div className="card-footer">
        <div className="card-meta-left">
          {/* Priority Pill */}
          <span
            className={`priority-pill ${card.priority}`}
            title={`Priority: ${card.priority.toUpperCase()}`}
          />

          {/* Due Date */}
          {card.dueDate && (
            <span
              className={`meta-item due-badge ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}
            >
              <Clock size={12} />
              {formatDate(card.dueDate)}
            </span>
          )}

          {/* Checklist Counter */}
          {totalChecklistItems > 0 && (
            <span
              className="meta-item"
              style={{
                color: completedChecklistItems === totalChecklistItems ? '#10b981' : 'inherit'
              }}
            >
              <CheckSquare size={12} />
              {completedChecklistItems}/{totalChecklistItems}
            </span>
          )}

          {/* Comments Counter */}
          {card.comments && card.comments.length > 0 && (
            <span className="meta-item">
              <MessageSquare size={12} />
              {card.comments.length}
            </span>
          )}

          {/* Attachments Counter */}
          {card.attachments && card.attachments.length > 0 && (
            <span className="meta-item">
              <Paperclip size={12} />
              {card.attachments.length}
            </span>
          )}
        </div>

        {/* Member Avatars */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="card-assignees">
            {card.assignees.map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="assignee-avatar"
                title={user.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
