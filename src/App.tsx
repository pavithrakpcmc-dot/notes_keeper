/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Sun, Moon, Sparkles, Filter, 
  Trash2, SlidersHorizontal, BookOpen, AlertCircle, X, ChevronRight, PenTool
} from 'lucide-react';
import { User, Note, FilterState, USER_THEMES } from './types';
import { getSessionUser, setSessionUser, getUserNotes, saveUserNotes } from './utils/storage';
import AuthScreen from './components/AuthScreen';
import NotesSidebar from './components/NotesSidebar';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterState>({ type: 'all' });
  
  // Editor and Create state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Mobile UI controls
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Dark mode setting
  const [darkMode, setDarkMode] = useState(() => {
    const cached = localStorage.getItem('notes_keeper_dark_mode');
    return cached === 'true' || (!cached && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Track dynamic search highlight tags
  const [allUserTags, setAllUserTags] = useState<string[]>([]);

  // Hook validation and setup
  useEffect(() => {
    // Check local session
    const active = getSessionUser();
    if (active) {
      setCurrentUser(active);
      const loadedNotes = getUserNotes(active.id);
      setNotes(loadedNotes);
    }
  }, []);

  // Update HTML theme tag on dark mode change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('notes_keeper_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('notes_keeper_dark_mode', 'false');
    }
  }, [darkMode]);

  // Extract all unique tags dynamically
  useEffect(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      if (!note.isArchived) {
        note.tags.forEach(t => tagsSet.add(t));
      }
    });
    setAllUserTags(Array.from(tagsSet).slice(0, 15)); // Limit to top 15 tags
  }, [notes]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    const loadedNotes = getUserNotes(user.id);
    setNotes(loadedNotes);
  };

  const handleLogout = () => {
    setSessionUser(null);
    setCurrentUser(null);
    setNotes([]);
    setActiveFilter({ type: 'all' });
    setSearchQuery('');
  };

  // --- CRUD Note Handlers (Saved instantly and auto-updated!) ---
  
  const handleCreateNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleNoteSave = (noteData: Partial<Note>) => {
    if (!currentUser) return;

    let updatedNotes: Note[] = [];

    if (editingNote) {
      // Edit mode
      updatedNotes = notes.map(note => {
        if (note.id === editingNote.id) {
          return {
            ...note,
            ...noteData,
            updatedAt: Date.now()
          } as Note;
        }
        return note;
      });
    } else {
      // Creation mode
      const freshNote: Note = {
        id: `note-${Date.now()}`,
        userId: currentUser.id,
        title: noteData.title || '',
        content: noteData.content || '',
        tags: noteData.tags || [],
        category: noteData.category || 'General',
        pinned: false,
        color: noteData.color || 'default',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isArchived: false,
      };
      updatedNotes = [freshNote, ...notes];
    }

    setNotes(updatedNotes);
    saveUserNotes(currentUser.id, updatedNotes);
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleNoteDelete = (id: string) => {
    if (!currentUser) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this note permanently?');
    if (!confirmDelete) return;

    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    saveUserNotes(currentUser.id, filtered);
  };

  const handleTogglePin = (id: string) => {
    if (!currentUser) return;
    const updated = notes.map(n => {
      if (n.id === id) {
        return { ...n, pinned: !n.pinned, updatedAt: Date.now() };
      }
      return n;
    });
    setNotes(updated);
    saveUserNotes(currentUser.id, updated);
  };

  const handleToggleArchive = (id: string) => {
    if (!currentUser) return;
    const updated = notes.map(n => {
      if (n.id === id) {
        return { ...n, isArchived: !n.isArchived, pinned: false, updatedAt: Date.now() };
      }
      return n;
    });
    setNotes(updated);
    saveUserNotes(currentUser.id, updated);
  };

  const handleTriggerEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // --- Filtering & Searching Logic ---

  const filteredNotes = notes.filter(note => {
    // 1. Isolate archived views
    if (activeFilter.type === 'archived') {
      if (!note.isArchived) return false;
    } else {
      if (note.isArchived) return false;
    }

    // 2. Filter states
    if (activeFilter.type === 'pinned' && !note.pinned) {
      return false;
    }
    if (activeFilter.type === 'category' && note.category !== activeFilter.value) {
      return false;
    }
    if (activeFilter.type === 'tag' && !note.tags.includes(activeFilter.value || '')) {
      return false;
    }

    // 3. Keyword Search Engine (Searches matching titles, full bodies or single tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchBody = note.content.toLowerCase().includes(q);
      const matchTags = note.tags.some(tag => tag.toLowerCase().includes(q));
      const matchCategory = note.category.toLowerCase().includes(q);

      return matchTitle || matchBody || matchTags || matchCategory;
    }

    return true;
  });

  // Segregate notes into Pinned and Unpinned for Clean Grid Display
  const pinnedList = filteredNotes.filter(n => n.pinned);
  const regularList = filteredNotes.filter(n => !n.pinned);

  // Active theme specifications
  const activeThemeSpec = USER_THEMES.find(t => t.id === currentUser?.colorTheme) || USER_THEMES[0];

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Dynamic Left Navigation Panel */}
      <NotesSidebar 
        user={currentUser}
        onLogout={handleLogout}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notesCount={notes.filter(n => !n.isArchived).length}
        pinnedCount={notes.filter(n => n.pinned && !n.isArchived).length}
        archivedCount={notes.filter(n => n.isArchived).length}
        allUserTags={allUserTags}
        activeSidebarMobile={mobileSidebarOpen}
        setSidebarMobile={setMobileSidebarOpen}
      />

      {/* Main Container Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Control Bar in High Density 48px height (h-12) */}
        <header className="h-12 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-4 shrink-0 shadow-xs z-10">
          
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Open Navigation"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-150">
                Notes Command Center
              </h1>
              <div className="hidden sm:block h-3.5 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="hidden sm:flex space-x-1 shrink-0">
                <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded text-[9px] font-mono font-semibold border border-indigo-100/80 dark:border-indigo-900/40">
                  SECURE DB
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-mono font-semibold border border-emerald-100/50 dark:border-emerald-900/30">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Dark/Light Theme Button */}
            <button
              id="btn-toggle-dark-mode"
              onClick={() => setDarkMode(!darkMode)}
              className="h-7 w-7 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-405 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Compose Shortcut Button */}
            <button
              id="btn-header-new-note"
              onClick={handleCreateNewNote}
              className="h-7 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold tracking-wide uppercase transition-all shadow-xs flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          </div>
        </header>

        {/* Workspace Operations Scrollable Arena */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f8fafc] dark:bg-[#070d19] scrollbar-thin">
          
          {/* Section 1: search and quick Filter State Indicator Panel */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 p-2.5 rounded shadow-2xs">
            
            {/* Dynamic Search Box */}
            <div className="relative flex-1 max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 dark:text-slate-500">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                id="search-input"
                type="text"
                placeholder="Search database entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1 h-7 text-[11px] bg-slate-50 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* active indicator filter badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 whitespace-nowrap">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-slate-400" /> INDEX:
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-800">
                {activeFilter.type === 'all' && '🌿 ALL_RECORDS'}
                {activeFilter.type === 'pinned' && '📌 PIN_RECORDS'}
                {activeFilter.type === 'archived' && '📁 ARCHIVED_VAULT'}
                {activeFilter.type === 'category' && `🏷️ CAT:${activeFilter.value?.toUpperCase()}`}
                {activeFilter.type === 'tag' && `#️⃣ TAG:${activeFilter.value?.toUpperCase()}`}

                {/* Reset filter trigger */}
                {activeFilter.type !== 'all' && (
                  <button
                    onClick={() => setActiveFilter({ type: 'all' })}
                    className="ml-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Clear filter"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </span>
            </div>
          </div>

          {/* Quick Scratchpad click bar */}
          <div 
            id="quick-compose-trigger"
            onClick={handleCreateNewNote}
            className="flex items-center gap-3 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 px-3 py-2 rounded shadow-2xs cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 shrink-0">
              <PenTool className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 select-none">
              TAKE NEW LIGHT NOTE IN SECONDS...
            </span>
          </div>

          {/* Grid Panel Section */}
          <div className="space-y-4">
            
            {/* Subset A: Pinned notes layout */}
            {pinnedList.length > 0 && (
              <div id="section-pinned" className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  📌 PINNED NOTES_({pinnedList.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {pinnedList.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleTriggerEdit}
                      onDelete={handleNoteDelete}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Subset B: regular notes layout */}
            <div id="section-notes" className="space-y-2">
              {pinnedList.length > 0 && regularList.length > 0 && (
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  📂 RECENT ENTRIES_({regularList.length})
                </h3>
              )}
              
              {regularList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {regularList.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleTriggerEdit}
                      onDelete={handleNoteDelete}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                    />
                  ))}
                </div>
              ) : pinnedList.length === 0 ? (
                /* Complete Empty State placeholder */
                <div id="empty-workspace-state" className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded p-6 max-w-xs mx-auto">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center text-lg mb-3">
                    📓
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
                    No Records Indexed
                  </h3>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 leading-normal max-w-[220px]">
                    {searchQuery 
                      ? "Search criteria returned zero matched entries in index database." 
                      : activeFilter.type !== 'all'
                      ? "Empty set returned for this specific workspace search category."
                      : "Create your first high density note to populate your workspace dashboard."}
                  </p>
                  {(activeFilter.type !== 'all' || searchQuery) ? (
                    <button
                      onClick={() => { setActiveFilter({ type: 'all' }); setSearchQuery(''); }}
                      className="mt-3 px-3 py-1 h-6 text-[10px] uppercase font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition"
                    >
                      CLEAR_FILTERS
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateNewNote}
                      className="mt-3 px-3 py-1 h-6 text-[10px] uppercase font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition shadow-xs"
                    >
                      COMPOSE_NOTE
                    </button>
                  )}
                </div>
              ) : null}
            </div>

          </div>

        </div>

        {/* High Density Status Bar */}
        <footer className="h-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-3 text-[9px] text-slate-500 font-mono shrink-0 select-none z-10">
          <div className="flex space-x-4">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span> 
              SYSTEM OPERATIONAL
            </span>
            <span>LATENCY: 42ms</span>
            <span>COMMIT_STATE: READY</span>
          </div>
          <div className="hidden sm:block">
            STAGING: LOCAL_DB • AUTH: AES-256 (SECURE_WORKSPACE)
          </div>
        </footer>
      </main>

      {/* Slide-in Overlay Note Editor Panel */}
      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleNoteSave}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
