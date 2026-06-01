import { useState } from 'react';
import { 
  BookOpen, Pin, Archive, Tag, LogOut, 
  ChevronLeft, Menu, Sparkles, LayoutGrid, Heart 
} from 'lucide-react';
import { User, CATEGORIES, FilterState } from '../types';

interface NotesSidebarProps {
  user: User;
  onLogout: () => void;
  activeFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  notesCount: number;
  pinnedCount: number;
  archivedCount: number;
  allUserTags: string[];
  activeSidebarMobile: boolean;
  setSidebarMobile: (open: boolean) => void;
}

export default function NotesSidebar({
  user,
  onLogout,
  activeFilter,
  onFilterChange,
  notesCount,
  pinnedCount,
  archivedCount,
  allUserTags,
  activeSidebarMobile,
  setSidebarMobile
}: NotesSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Helper to determine if a menu item is active
  const isSelected = (type: string, value?: string) => {
    if (activeFilter.type !== type) return false;
    if (value !== undefined && activeFilter.value !== value) return false;
    return true;
  };

  return (
    <>
      {/* Mobile background backdrop overlay when sidebar is open */}
      {activeSidebarMobile && (
        <div 
          onClick={() => setSidebarMobile(false)}
          className="lg:hidden fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-30 transition-opacity" 
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 bg-[#0f172a] text-slate-300 border-r border-slate-800/80 z-40 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${activeSidebarMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header Branding Panel inside High Density header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#1e293b]/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm text-xs font-bold leading-none">
              N
            </div>
            {!isCollapsed && (
              <span className="font-bold text-slate-200 tracking-tight text-xs uppercase whitespace-nowrap animate-fade-in">
                Notes Command
              </span>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-6 w-6 rounded border border-slate-800 text-slate-400 hover:text-white items-center justify-center hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Filters */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin">
          
          {/* Base Views */}
          <div className="space-y-0.5">
            <button
              onClick={() => { onFilterChange({ type: 'all' }); setSidebarMobile(false); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2.5 py-1.5 rounded transition-all text-xs font-semibold ${
                isSelected('all')
                  ? 'bg-slate-800 text-indigo-400 border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-150'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                {!isCollapsed && <span>ALL ENTITIES</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">{notesCount}</span>}
            </button>

            <button
              onClick={() => { onFilterChange({ type: 'pinned' }); setSidebarMobile(false); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2.5 py-1.5 rounded transition-all text-xs font-semibold ${
                isSelected('pinned')
                  ? 'bg-slate-800 text-amber-400 border-l-2 border-amber-500'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-150'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Pin className="w-3.5 h-3.5 shrink-0" />
                {!isCollapsed && <span>PINNED NOTES</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">{pinnedCount}</span>}
            </button>

            <button
              onClick={() => { onFilterChange({ type: 'archived' }); setSidebarMobile(false); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2.5 py-1.5 rounded transition-all text-xs font-semibold ${
                isSelected('archived')
                  ? 'bg-slate-800 text-slate-200 border-l-2 border-slate-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-150'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Archive className="w-3.5 h-3.5 shrink-0" />
                {!isCollapsed && <span>ARCHIVED VAULT</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">{archivedCount}</span>}
            </button>
          </div>

          {/* Categories Section */}
          <div>
            {!isCollapsed && (
              <h4 className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                CATEGORIES
              </h4>
            )}
            <div className="space-y-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { onFilterChange({ type: 'category', value: cat.id }); setSidebarMobile(false); }}
                  className={`w-full flex items-center px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    isSelected('category', cat.id)
                      ? 'bg-slate-800 text-slate-100 border-l-2 border-indigo-500'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-150'
                  } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2.5 shrink-0 ${
                    cat.id === 'Personal' ? 'bg-rose-500' :
                    cat.id === 'Work' ? 'bg-indigo-500' :
                    cat.id === 'Ideas' ? 'bg-amber-500' :
                    cat.id === 'Study' ? 'bg-emerald-500' :
                    cat.id === 'Finance' ? 'bg-sky-500' : 'bg-slate-400'
                  }`} />
                  {!isCollapsed && <span className="truncate">{cat.label.toUpperCase()}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* dynamic tags filter section */}
          {allUserTags.length > 0 && (
            <div>
              {!isCollapsed && (
                <h4 className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  TAG INDEX
                </h4>
              )}
              <div className={isCollapsed ? 'flex flex-col items-center gap-1.5' : 'flex flex-wrap gap-1 px-2.5'}>
                {allUserTags.map((tag) => {
                  const isTagSelected = isSelected('tag', tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => { onFilterChange({ type: 'tag', value: tag }); setSidebarMobile(false); }}
                      className={`flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded transition-all ${
                        isTagSelected
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-850 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                      }`}
                      title={tag}
                    >
                      <Tag className="w-2.5 h-2.5 mr-1 text-slate-500 shrink-0" />
                      {!isCollapsed && <span className="truncate max-w-[110px]">#{tag.toUpperCase()}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick instructions/inspiration block */}
          {!isCollapsed && (
            <div className="bg-[#1e293b]/30 p-3 rounded border border-slate-800/80 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
              </div>
              <h5 className="text-[9px] uppercase tracking-widest font-bold text-indigo-400 font-mono">STATUS: OPERATIONAL</h5>
              <p className="text-[10px] text-slate-400 mt-1 lines-2 leading-normal">
                Workspace content is indexed. Changes are committed instantly to browser DB.
              </p>
            </div>
          )}
        </div>

        {/* User Card & Sign Out Panel */}
        <div className="p-2.5 border-t border-slate-800/85 bg-[#131d30]/65 text-xs">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-md shrink-0">
                {user.avatar || '✍️'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 leading-none">
                  <h3 className="text-xs font-semibold text-slate-200 truncate pr-0.5 mb-1">
                    {user.name}
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 truncate block">
                    @{user.username.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                id="btn-sidebar-logout"
                onClick={onLogout}
                className="h-7 w-7 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 flex items-center justify-center transition-colors border border-transparent hover:border-rose-900/40"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={onLogout}
              className="mt-1.5 w-8 h-8 mx-auto rounded text-slate-400 hover:text-rose-450 hover:bg-rose-950/30 flex items-center justify-center transition-colors border border-slate-800"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
