import React, { useState, useEffect } from 'react';
import { Board, Card, Column, FilterOptions, ActivityLog, Theme } from './types/kanban';
import {
  loadBoards,
  saveBoards,
  loadActiveBoardId,
  saveActiveBoardId,
  loadActivityLogs,
  saveActivityLogs,
  loadTheme,
  saveTheme,
  resetToDemoData,
  exportBoardJSON
} from './utils/storage';
import { Header } from './components/Header';
import { BoardHeader } from './components/BoardHeader';
import { ColumnComponent } from './components/ColumnComponent';
import { CardDetailModal } from './components/CardDetailModal';
import { FilterDrawer } from './components/FilterDrawer';
import { StatsModal } from './components/StatsModal';
import { ActivityLogDrawer } from './components/ActivityLogDrawer';

export const App: React.FC = () => {
  // State Initialization
  const [boards, setBoards] = useState<Board[]>(() => loadBoards());
  const [activeBoardId, setActiveBoardId] = useState<string>(() =>
    loadActiveBoardId(boards[0]?.id || 'board-software-engineering')
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadActivityLogs());
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  // Modal / Drawer States
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  // Drag and Drop States
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);

  // Filter & Sort State
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: '',
    labels: [],
    priority: 'all',
    dueDateFilter: 'all',
    sortBy: 'manual',
    sortOrder: 'asc'
  });

  // Get Active Board
  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  // Auto-Save Effect
  useEffect(() => {
    saveBoards(boards);
  }, [boards]);

  useEffect(() => {
    saveActiveBoardId(activeBoardId);
  }, [activeBoardId]);

  useEffect(() => {
    saveActivityLogs(activityLogs);
  }, [activityLogs]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Activity Logger Helper
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      boardId: activeBoardId,
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'You'
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Board Actions
  const handleSelectBoard = (id: string) => {
    setActiveBoardId(id);
  };

  const handleCreateBoard = (title: string, background: string) => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      background,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      columns: [
        { id: `col-todo-${Date.now()}`, title: '📋 To Do', cardIds: [], colorAccent: '#60a5fa' },
        { id: `col-prog-${Date.now()}`, title: '⚡ In Progress', cardIds: [], colorAccent: '#f59e0b' },
        { id: `col-done-${Date.now()}`, title: '✅ Done', cardIds: [], colorAccent: '#10b981' }
      ],
      cards: {}
    };
    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    logActivity('Board Created', `Created new board "${title}"`);
  };

  const handleUpdateBoardTitle = (newTitle: string) => {
    if (!activeBoard) return;
    setBoards((prev) =>
      prev.map((b) => (b.id === activeBoard.id ? { ...b, title: newTitle } : b))
    );
    logActivity('Board Renamed', `Renamed board to "${newTitle}"`);
  };

  const handleToggleFavorite = () => {
    if (!activeBoard) return;
    setBoards((prev) =>
      prev.map((b) => (b.id === activeBoard.id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  // Column Actions
  const handleAddColumn = () => {
    if (!activeBoard) return;
    const colTitle = prompt('Enter Column Title:', 'New List');
    if (!colTitle || !colTitle.trim()) return;

    const newCol: Column = {
      id: `col-${Date.now()}`,
      title: colTitle.trim(),
      cardIds: [],
      colorAccent: '#3b82f6'
    };

    setBoards((prev) =>
      prev.map((b) =>
        b.id === activeBoard.id
          ? { ...b, columns: [...b.columns, newCol] }
          : b
      )
    );
    logActivity('Column Added', `Added column "${colTitle.trim()}"`);
  };

  const handleUpdateColumnTitle = (colId: string, newTitle: string) => {
    if (!activeBoard) return;
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;
        return {
          ...b,
          columns: b.columns.map((c) => (c.id === colId ? { ...c, title: newTitle } : c))
        };
      })
    );
  };

  const handleDeleteColumn = (colId: string) => {
    if (!activeBoard) return;
    const col = activeBoard.columns.find((c) => c.id === colId);
    if (!confirm(`Are you sure you want to delete column "${col?.title}"?`)) return;

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;
        const newCols = b.columns.filter((c) => c.id !== colId);
        const newCards = { ...b.cards };
        col?.cardIds.forEach((cid) => delete newCards[cid]);
        return { ...b, columns: newCols, cards: newCards };
      })
    );
    logActivity('Column Deleted', `Deleted column "${col?.title}"`);
  };

  const handleClearCompletedInColumn = (colId: string) => {
    if (!activeBoard) return;
    const col = activeBoard.columns.find((c) => c.id === colId);
    if (!col) return;

    const completedIds = col.cardIds.filter((cid) => activeBoard.cards[cid]?.completed);
    if (completedIds.length === 0) return;

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;
        const newCardIds = col.cardIds.filter((cid) => !completedIds.includes(cid));
        const newCards = { ...b.cards };
        completedIds.forEach((cid) => delete newCards[cid]);
        return {
          ...b,
          columns: b.columns.map((c) => (c.id === colId ? { ...c, cardIds: newCardIds } : c)),
          cards: newCards
        };
      })
    );
    logActivity('Cards Cleared', `Cleared ${completedIds.length} done cards from "${col.title}"`);
  };

  const handleDuplicateColumn = (colId: string) => {
    if (!activeBoard) return;
    const col = activeBoard.columns.find((c) => c.id === colId);
    if (!col) return;

    const newColId = `col-${Date.now()}`;
    const newCards: Record<string, Card> = { ...activeBoard.cards };
    const newCardIds: string[] = [];

    col.cardIds.forEach((cid) => {
      const orig = activeBoard.cards[cid];
      if (orig) {
        const dupId = `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        newCardIds.push(dupId);
        newCards[dupId] = { ...orig, id: dupId, columnId: newColId, title: `${orig.title} (Copy)` };
      }
    });

    const newCol: Column = {
      ...col,
      id: newColId,
      title: `${col.title} (Copy)`,
      cardIds: newCardIds
    };

    setBoards((prev) =>
      prev.map((b) =>
        b.id === activeBoard.id
          ? { ...b, columns: [...b.columns, newCol], cards: newCards }
          : b
      )
    );
  };

  // Card Actions
  const handleAddCard = (columnId: string, title: string) => {
    if (!activeBoard) return;
    const cardId = `card-${Date.now()}`;
    const newCard: Card = {
      id: cardId,
      columnId,
      title,
      priority: 'medium',
      labels: [],
      checklist: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;
        return {
          ...b,
          cards: { ...b.cards, [cardId]: newCard },
          columns: b.columns.map((c) =>
            c.id === columnId ? { ...c, cardIds: [...c.cardIds, cardId] } : c
          )
        };
      })
    );
    logActivity('Card Created', `Created card "${title}"`);
  };

  const handleUpdateCard = (updatedCard: Card) => {
    if (!activeBoard) return;
    const oldCard = activeBoard.cards[updatedCard.id];

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;
        let newColumns = b.columns;

        // If card was moved to a different column in the modal
        if (oldCard && oldCard.columnId !== updatedCard.columnId) {
          newColumns = b.columns.map((c) => {
            if (c.id === oldCard.columnId) {
              return { ...c, cardIds: c.cardIds.filter((id) => id !== updatedCard.id) };
            }
            if (c.id === updatedCard.columnId) {
              return { ...c, cardIds: [...c.cardIds, updatedCard.id] };
            }
            return c;
          });
        }

        return {
          ...b,
          columns: newColumns,
          cards: { ...b.cards, [updatedCard.id]: updatedCard }
        };
      })
    );
  };

  const handleDeleteCard = (cardId: string) => {
    if (!activeBoard) return;
    const card = activeBoard.cards[cardId];

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;
        const newCards = { ...b.cards };
        delete newCards[cardId];

        const newCols = b.columns.map((c) => ({
          ...c,
          cardIds: c.cardIds.filter((id) => id !== cardId)
        }));

        return { ...b, columns: newCols, cards: newCards };
      })
    );
    logActivity('Card Deleted', `Deleted card "${card?.title}"`);
  };

  // Drag and Drop Logic
  const handleDragStartCard = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragStartColumn = (e: React.DragEvent, columnId: string) => {
    setDraggedColumnId(columnId);
  };

  const handleDropOnColumn = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!activeBoard) return;

    // Case 1: Reordering Columns
    if (draggedColumnId && draggedColumnId !== targetColumnId) {
      const oldIndex = activeBoard.columns.findIndex((c) => c.id === draggedColumnId);
      const newIndex = activeBoard.columns.findIndex((c) => c.id === targetColumnId);

      const reorderedCols = [...activeBoard.columns];
      const [movedCol] = reorderedCols.splice(oldIndex, 1);
      reorderedCols.splice(newIndex, 0, movedCol);

      setBoards((prev) =>
        prev.map((b) => (b.id === activeBoard.id ? { ...b, columns: reorderedCols } : b))
      );
      setDraggedColumnId(null);
      return;
    }

    // Case 2: Moving Cards Between or Within Columns
    if (!draggedCardId) return;
    const card = activeBoard.cards[draggedCardId];
    if (!card) return;

    const sourceColId = card.columnId;

    if (sourceColId === targetColumnId) {
      setDraggedCardId(null);
      return;
    }

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoard.id) return b;

        const updatedCards = {
          ...b.cards,
          [draggedCardId]: { ...card, columnId: targetColumnId }
        };

        const updatedColumns = b.columns.map((col) => {
          if (col.id === sourceColId) {
            return { ...col, cardIds: col.cardIds.filter((id) => id !== draggedCardId) };
          }
          if (col.id === targetColumnId) {
            return { ...col, cardIds: [...col.cardIds, draggedCardId] };
          }
          return col;
        });

        return { ...b, columns: updatedColumns, cards: updatedCards };
      })
    );

    const targetCol = activeBoard.columns.find((c) => c.id === targetColumnId);
    logActivity('Card Moved', `Moved "${card.title}" to ${targetCol?.title}`);
    setDraggedCardId(null);
  };

  // Filter & Sort Logic for Column Cards
  const getFilteredColumnCards = (column: Column): Card[] => {
    if (!activeBoard) return [];

    let colCards = column.cardIds.map((cid) => activeBoard.cards[cid]).filter(Boolean);

    // Search Query Filter
    if (filterOptions.searchQuery.trim()) {
      const q = filterOptions.searchQuery.toLowerCase();
      colCards = colCards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Priority Filter
    if (filterOptions.priority !== 'all') {
      colCards = colCards.filter((c) => c.priority === filterOptions.priority);
    }

    // Due Date Filter
    if (filterOptions.dueDateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      colCards = colCards.filter((c) => {
        if (filterOptions.dueDateFilter === 'noDueDate') return !c.dueDate;
        if (!c.dueDate) return false;
        if (filterOptions.dueDateFilter === 'overdue')
          return !c.completed && new Date(c.dueDate) < new Date();
        if (filterOptions.dueDateFilter === 'dueToday') return c.dueDate === today;
        return true;
      });
    }

    // Label Filter
    if (filterOptions.labels.length > 0) {
      colCards = colCards.filter((c) =>
        c.labels?.some((lbl) => filterOptions.labels.includes(lbl.id))
      );
    }

    // Sorting
    if (filterOptions.sortBy !== 'manual') {
      colCards = [...colCards].sort((a, b) => {
        if (filterOptions.sortBy === 'title') return a.title.localeCompare(b.title);
        if (filterOptions.sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (filterOptions.sortBy === 'priority') {
          const pRank = { urgent: 4, high: 3, medium: 2, low: 1 };
          return pRank[b.priority] - pRank[a.priority];
        }
        return 0;
      });
    }

    return colCards;
  };

  const handleResetDemoData = () => {
    if (confirm('Reset to original sample demo data? Any custom boards will be restored.')) {
      const restored = resetToDemoData();
      setBoards(restored.boards);
      setActiveBoardId(restored.boards[0].id);
      setActivityLogs(restored.logs);
    }
  };

  return (
    <div
      className="app-container"
      style={{ backgroundImage: activeBoard ? activeBoard.background : undefined }}
    >
      <div className="app-overlay" />

      {/* Top App Header */}
      <Header
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={handleSelectBoard}
        onCreateBoard={handleCreateBoard}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenActivity={() => setIsActivityDrawerOpen(true)}
        onExportBoard={() => activeBoard && exportBoardJSON(activeBoard)}
        onResetData={handleResetDemoData}
      />

      {/* Board Header Bar */}
      {activeBoard && (
        <BoardHeader
          board={activeBoard}
          onUpdateTitle={handleUpdateBoardTitle}
          onToggleFavorite={handleToggleFavorite}
          filterOptions={filterOptions}
          onUpdateFilter={(up) => setFilterOptions((prev) => ({ ...prev, ...up }))}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          onAddColumn={handleAddColumn}
        />
      )}

      {/* Main Board Canvas */}
      {activeBoard && (
        <main className="board-canvas">
          {activeBoard.columns.map((column) => (
            <ColumnComponent
              key={column.id}
              column={column}
              cards={getFilteredColumnCards(column)}
              onUpdateTitle={(title) => handleUpdateColumnTitle(column.id, title)}
              onDeleteColumn={() => handleDeleteColumn(column.id)}
              onClearCompleted={() => handleClearCompletedInColumn(column.id)}
              onDuplicateColumn={() => handleDuplicateColumn(column.id)}
              onSortCards={() => setFilterOptions((prev) => ({ ...prev, sortBy: 'dueDate' }))}
              onAddCard={(title) => handleAddCard(column.id, title)}
              onClickCard={(card) => setSelectedCard(card)}
              onDragStartCard={handleDragStartCard}
              onDragOverColumn={(e) => e.preventDefault()}
              onDragLeaveColumn={() => {}}
              onDropOnColumn={handleDropOnColumn}
              onDragStartColumn={handleDragStartColumn}
            />
          ))}
        </main>
      )}

      {/* Card Details Modal */}
      {selectedCard && activeBoard && (
        <CardDetailModal
          card={selectedCard}
          columns={activeBoard.columns}
          onClose={() => setSelectedCard(null)}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {/* Filter Side Drawer */}
      {isFilterDrawerOpen && (
        <FilterDrawer
          filterOptions={filterOptions}
          onUpdateFilter={(up) => setFilterOptions((prev) => ({ ...prev, ...up }))}
          onResetFilter={() =>
            setFilterOptions({
              searchQuery: '',
              labels: [],
              priority: 'all',
              dueDateFilter: 'all',
              sortBy: 'manual',
              sortOrder: 'asc'
            })
          }
          onClose={() => setIsFilterDrawerOpen(false)}
        />
      )}

      {/* Stats Modal */}
      {isStatsModalOpen && activeBoard && (
        <StatsModal board={activeBoard} onClose={() => setIsStatsModalOpen(false)} />
      )}

      {/* Activity Log Side Drawer */}
      {isActivityDrawerOpen && (
        <ActivityLogDrawer
          logs={activityLogs.filter((l) => l.boardId === activeBoardId)}
          onClose={() => setIsActivityDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
