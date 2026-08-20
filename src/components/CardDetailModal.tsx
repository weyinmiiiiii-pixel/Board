import React, { useState } from 'react';
import { Card, Column, Priority, Label } from '../types/kanban';
import { DEFAULT_LABELS } from '../utils/initialData';
import {
  X,
  Tag,
  CheckSquare,
  MessageSquare,
  Trash2,
  List,
  Plus,
  Send,
  Check
} from 'lucide-react';

interface CardDetailModalProps {
  card: Card;
  columns: Column[];
  onClose: () => void;
  onUpdateCard: (updatedCard: Card) => void;
  onDeleteCard: (cardId: string) => void;
}

const COVER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '' // none
];

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  columns,
  onClose,
  onUpdateCard,
  onDeleteCard
}) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState<Priority>(card.priority);
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [completed, setCompleted] = useState(card.completed || false);
  const [coverColor, setCoverColor] = useState(card.coverColor || '');

  // Subtask Checklist state
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Comments state
  const [comments, setComments] = useState(card.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  // Labels state
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(card.labels || []);
  const [isLabelPickerOpen, setIsLabelPickerOpen] = useState(false);

  // Available label list
  const availableLabels: Label[] = Object.values(DEFAULT_LABELS);

  const handleSave = () => {
    onUpdateCard({
      ...card,
      title: title.trim() || card.title,
      description: description.trim(),
      priority,
      dueDate: dueDate || undefined,
      completed,
      coverColor,
      checklist,
      comments,
      labels: selectedLabels,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const newItem = {
      id: `chk-${Date.now()}`,
      text: newSubtaskText.trim(),
      completed: false
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewSubtaskText('');
    onUpdateCard({ ...card, checklist: updated });
  };

  const handleToggleSubtask = (itemId: string) => {
    const updated = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    onUpdateCard({ ...card, checklist: updated });
  };

  const handleDeleteSubtask = (itemId: string) => {
    const updated = checklist.filter((item) => item.id !== itemId);
    setChecklist(updated);
    onUpdateCard({ ...card, checklist: updated });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newCmt = {
      id: `cmt-${Date.now()}`,
      author: 'Current User',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };
    const updated = [newCmt, ...comments];
    setComments(updated);
    setNewCommentText('');
    onUpdateCard({ ...card, comments: updated });
  };

  const handleToggleLabel = (lbl: Label) => {
    const exists = selectedLabels.some((l) => l.id === lbl.id);
    let updated: Label[];
    if (exists) {
      updated = selectedLabels.filter((l) => l.id !== lbl.id);
    } else {
      updated = [...selectedLabels, lbl];
    }
    setSelectedLabels(updated);
    onUpdateCard({ ...card, labels: updated });
  };

  const handleMoveColumn = (newColId: string) => {
    onUpdateCard({ ...card, columnId: newColId });
  };

  const completedChecklistCount = checklist.filter((c) => c.completed).length;
  const checklistPercentage =
    checklist.length > 0 ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Cover Header */}
        {coverColor && (
          <div
            style={{
              height: '32px',
              backgroundColor: coverColor,
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)'
            }}
          />
        )}

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-primary)',
                fontSize: '1.25rem',
                fontWeight: 700,
                width: '100%',
                outline: 'none',
                borderRadius: 'var(--radius-sm)'
              }}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              in column{' '}
              <select
                value={card.columnId}
                onChange={(e) => handleMoveColumn(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.1rem 0.3rem',
                  fontWeight: 600
                }}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Controls Bar: Priority, Due Date, Labels & Cover */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              padding: '0.85rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {/* Priority Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                PRIORITY
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value as Priority);
                  onUpdateCard({ ...card, priority: e.target.value as Priority });
                }}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.85rem'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Due Date Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                DUE DATE
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  onUpdateCard({ ...card, dueDate: e.target.value });
                }}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Completed Checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                STATUS
              </label>
              <button
                className={`btn ${completed ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
                onClick={() => {
                  setCompleted(!completed);
                  onUpdateCard({ ...card, completed: !completed });
                }}
              >
                {completed ? <Check size={14} /> : null}
                {completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            {/* Cover Color Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                COVER COLOR
              </label>
              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                {COVER_COLORS.map((c) => (
                  <div
                    key={c || 'none'}
                    onClick={() => {
                      setCoverColor(c);
                      onUpdateCard({ ...card, coverColor: c });
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: c || 'transparent',
                      border: coverColor === c ? '2px solid #ffffff' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Labels Section */}
          <div className="modal-section">
            <div className="modal-section-title">
              <Tag size={16} /> Labels
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              {selectedLabels.map((lbl) => (
                <span
                  key={lbl.id}
                  className="label-pill"
                  style={{
                    color: lbl.color,
                    backgroundColor: lbl.bgColor,
                    border: `1px solid ${lbl.color}40`,
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleToggleLabel(lbl)}
                >
                  {lbl.name} ×
                </span>
              ))}

              <button
                className="btn btn-secondary"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                onClick={() => setIsLabelPickerOpen(!isLabelPickerOpen)}
              >
                <Plus size={12} /> Add Tag
              </button>
            </div>

            {isLabelPickerOpen && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '0.4rem'
                }}
              >
                {availableLabels.map((lbl) => {
                  const isSelected = selectedLabels.some((l) => l.id === lbl.id);
                  return (
                    <span
                      key={lbl.id}
                      className="label-pill"
                      style={{
                        color: lbl.color,
                        backgroundColor: lbl.bgColor,
                        border: isSelected ? `2px solid ${lbl.color}` : '1px solid transparent',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleToggleLabel(lbl)}
                    >
                      {isSelected ? '✓ ' : ''}
                      {lbl.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="modal-section">
            <div className="modal-section-title">
              <List size={16} /> Description
            </div>
            <textarea
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows={4}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Subtask Checklist Section */}
          <div className="modal-section">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div className="modal-section-title">
                <CheckSquare size={16} /> Subtask Checklist ({completedChecklistCount}/{checklist.length})
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {checklistPercentage}%
              </span>
            </div>

            {checklist.length > 0 && (
              <div className="checklist-progress-bar">
                <div
                  className="checklist-progress-fill"
                  style={{ width: `${checklistPercentage}%` }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`checklist-item ${item.completed ? 'completed' : ''}`}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleSubtask(item.id)}
                    />
                    <span>{item.text}</span>
                  </label>
                  <button
                    className="btn btn-icon"
                    style={{ width: '24px', height: '24px', border: 'none' }}
                    onClick={() => handleDeleteSubtask(item.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <input
                type="text"
                placeholder="Add an item..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
              <button type="submit" className="btn btn-secondary">
                <Plus size={14} /> Add
              </button>
            </form>
          </div>

          {/* Activity Comments Section */}
          <div className="modal-section">
            <div className="modal-section-title">
              <MessageSquare size={16} /> Comments & Activity
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
              <button type="submit" className="btn btn-primary">
                <Send size={14} /> Post
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {comments.map((cmt) => (
                <div
                  key={cmt.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <img
                    src={cmt.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={cmt.author}
                    style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.2rem'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {cmt.author}
                      </span>
                      <span>{new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>{cmt.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <button
            className="btn btn-danger"
            onClick={() => {
              onDeleteCard(card.id);
              onClose();
            }}
          >
            <Trash2 size={16} /> Delete Card
          </button>

          <button className="btn btn-primary" onClick={handleSave}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
