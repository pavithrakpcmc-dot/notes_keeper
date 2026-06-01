import React from 'react';
import { motion } from 'motion/react';
import { Pin, Trash2, Calendar, Tag, Archive, Edit3, Clipboard } from 'lucide-react';
import { Note, ATTACHMENT_COLORS, CATEGORIES } from '../types';

interface NoteCardProps {
  key?: string;
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive
}: NoteCardProps) {
  // Find color styling mapping
  const colorSpec = ATTACHMENT_COLORS.find(c => c.id === note.color) || ATTACHMENT_COLORS[0];
  const categorySpec = CATEGORIES.find(c => c.id === note.category) || CATEGORIES[CATEGORIES.length - 1];

  // Utility to truncate content preview safely
  const truncateContent = (text: string, limit = 160) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  // Convert updated date to human readable form
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Handle note content styling - highlight bold markdown-like structures
  const renderNotePreview = (content: string) => {
    const truncated = truncateContent(content);
    return (
      <p className="text-[11px] text-slate-650 dark:text-slate-350 whitespace-pre-wrap leading-normal break-words font-sans">
        {truncated}
      </p>
    );
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      id={`note-card-${note.id}`}
      onClick={() => onEdit(note)}
      className={`group relative flex flex-col justify-between p-3 rounded border ${colorSpec.bg} hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-3xs hover:shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-155 cursor-pointer overflow-hidden`}
    >
      <div>
        {/* Card Header Actions in High Density style */}
        <div className="flex items-start justify-between gap-2.5 mb-1.5">
          <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded border shrink-0 ${categorySpec.color}`}>
            {note.category.toUpperCase()}
          </span>
          
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              id={`btn-pin-${note.id}`}
              type="button"
              title={note.pinned ? "Unpin Note" : "Pin Note"}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              className={`p-1 rounded border transition-colors ${
                note.pinned
                  ? 'text-amber-500 bg-amber-500/10 border-amber-550/20'
                  : 'text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-3 h-3 ${note.pinned ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              id={`btn-archive-${note.id}`}
              type="button"
              title={note.isArchived ? "Unarchive Note" : "Archive Note"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive(note.id);
              }}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Archive className="w-3 h-3" />
            </button>

            <button
              id={`btn-delete-${note.id}`}
              type="button"
              title="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Note Body Title */}
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {note.title || <span className="text-slate-400 dark:text-slate-500 italic font-normal">UNTITLED NOTE</span>}
        </h3>

        {/* Note Body Content */}
        <div className="mb-2">
          {renderNotePreview(note.content)}
        </div>
      </div>

      {/* Card Footer Widgets */}
      <div className="pt-1.5 border-t border-slate-150 dark:border-slate-800 mt-2 flex flex-wrap items-center justify-between gap-1.5">

        
        {/* Dynamic Tag Chips */}
        <div className="flex flex-wrap gap-0.5 max-w-[70%]">
          {note.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center text-[8px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.2 rounded border border-slate-200/60 dark:border-slate-700/60 font-bold uppercase"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[9px] font-mono text-slate-400 font-bold px-1.5 py-0.2">
              +{note.tags.length - 3}
            </span>
          )}
        </div>

        {/* Log Timestamp */}
        <div className="flex items-center gap-1 text-[8px] font-mono font-bold text-slate-400 dark:text-slate-550 shrink-0">
          <Calendar className="w-2.5 h-2.5 shrink-0 text-slate-400" />
          <span>{formattedDate.toUpperCase()}</span>
        </div>
      </div>
    </motion.article>
  );
}
