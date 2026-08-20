import React from 'react';
import { FilterOptions, Priority, Label } from '../types/kanban';
import { DEFAULT_LABELS } from '../utils/initialData';
import { X, Filter, RotateCcw, SortAsc } from 'lucide-react';

interface FilterDrawerProps {
  filterOptions: FilterOptions;
  onUpdateFilter: (updated: Partial<FilterOptions>) => void;
  onResetFilter: () => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filterOptions,
  onUpdateFilter,
  onResetFilter,
  onClose
}) => {
  const availableLabels: Label[] = Object.values(DEFAULT_LABELS);

  const handleToggleLabelFilter = (labelId: string) => {
    const exists = filterOptions.labels.includes(labelId);
    let updatedLabels: string[];
    if (exists) {
      updatedLabels = filterOptions.labels.filter((id) => id !== labelId);
    } else {
      updatedLabels = [...filterOptions.labels, labelId];
    }
    onUpdateFilter({ labels: updatedLabels });
  };

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <Filter size={18} color="var(--accent-primary)" /> Filter & Sort Cards
        </div>
        <button className="btn btn-icon" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="drawer-body">
        {/* Sort By Section */}
        <div className="modal-section">
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <SortAsc size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> SORT BY
          </label>
          <select
            value={filterOptions.sortBy}
            onChange={(e) =>
              onUpdateFilter({
                sortBy: e.target.value as FilterOptions['sortBy']
              })
            }
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              fontSize: '0.85rem'
            }}
          >
            <option value="manual">Board Order (Default)</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority Level</option>
            <option value="title">Title (Alphabetical)</option>
            <option value="createdAt">Date Created</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="modal-section">
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            PRIORITY LEVEL
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                className={`btn ${filterOptions.priority === p ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}
                onClick={() => onUpdateFilter({ priority: p })}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div className="modal-section">
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            DUE DATE STATUS
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { id: 'all', label: 'All Due Dates' },
              { id: 'overdue', label: 'Overdue Cards' },
              { id: 'dueToday', label: 'Due Today' },
              { id: 'dueThisWeek', label: 'Due This Week' },
              { id: 'noDueDate', label: 'No Due Date Set' }
            ].map((d) => (
              <button
                key={d.id}
                className={`btn ${filterOptions.dueDateFilter === d.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }}
                onClick={() =>
                  onUpdateFilter({
                    dueDateFilter: d.id as FilterOptions['dueDateFilter']
                  })
                }
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Labels Filter */}
        <div className="modal-section">
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            TAGS / LABELS
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {availableLabels.map((lbl) => {
              const isSelected = filterOptions.labels.includes(lbl.id);
              return (
                <span
                  key={lbl.id}
                  className="label-pill"
                  style={{
                    color: lbl.color,
                    backgroundColor: lbl.bgColor,
                    border: isSelected ? `2px solid ${lbl.color}` : '1px solid transparent',
                    padding: '0.3rem 0.6rem',
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}
                  onClick={() => handleToggleLabelFilter(lbl.id)}
                >
                  {isSelected ? '✓ ' : ''}
                  {lbl.name}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={onResetFilter}
          >
            <RotateCcw size={15} /> Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
};
