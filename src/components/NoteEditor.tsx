import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Tag, PenTool, Sparkles, AlertCircle, FileText, Bookmark } from 'lucide-react';
import { Note, ATTACHMENT_COLORS, CATEGORIES } from '../types';

interface NoteEditorProps {
  note: Note | null; // null if creating a new note
  onSave: (noteData: Partial<Note>) => void;
  onClose: () => void;
}

export default function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[CATEGORIES.length - 1].id);
  const [color, setColor] = useState('default');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const titleRef = useRef<HTMLInputElement>(null);

  // Load initial content if modifying an existing note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setColor(note.color);
      setTags(note.tags);
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setColor('default');
      setTags([]);
    }
    setSaveStatus('idle');

    // Auto-focus title on load
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 100);
  }, [note]);

  // Handle immediate manual save
  const handleSave = () => {
    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      color,
      tags,
    });
    setSaveStatus('saved');
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Add tag tokenization helper
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleanTag && !tags.includes(cleanTag) && cleanTag.length > 0) {
      const updatedTags = [...tags, cleanTag];
      setTags(updatedTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Calculate statistics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  // Selected note color spec
  const activeColorSpec = ATTACHMENT_COLORS.find(c => c.id === color) || ATTACHMENT_COLORS[0];

  return (
    <div id="note-editor-backdrop" className="fixed inset-0 bg-slate-900/40 dark:bg-[#070d19]/65 backdrop-blur-2xs z-50 flex items-center justify-center p-3 font-sans animate-fade-in">
      <div
        id="note-editor-modal"
        className={`w-full max-w-2xl rounded border bg-white dark:bg-[#0f172a] shadow-lg transition-all duration-150 overflow-hidden flex flex-col max-h-[90vh] border-slate-250 dark:border-slate-800 ${activeColorSpec.bg}`}
      >
        {/* Editor Modal Header in compact style */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#131d30]/40">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {note ? 'EDIT_ENTITY_RECORD' : 'CREATE_NEW_RECORD'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <span className="text-[9px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-950/20 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                <Check className="w-2.5 h-2.5" /> COMMIT_SUCCESS
              </span>
            )}
            <button
              id="btn-close-editor"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Close without saving"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editor Main Inputs */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin">
          
          {/* Note Title Input with slate bottom border */}
          <div>
            <input
              id="editor-note-title"
              ref={titleRef}
              type="text"
              placeholder="GIVE YOUR NOTE A DESCRIPTIVE TITLE..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-bold uppercase tracking-tight bg-transparent text-slate-900 dark:text-white border-0 border-b border-slate-200 dark:border-slate-800 focus:ring-0 focus:border-indigo-500 pb-1.5 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Note Body Text Area */}
          <div>
            <textarea
              id="editor-note-content"
              placeholder="Start drafting structured notes, indices or bullet logs here... "
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full text-xs bg-transparent text-slate-800 dark:text-slate-200 border-none focus:ring-0 resize-none min-h-[160px] pb-1 placeholder:text-slate-400 leading-relaxed font-mono focus:outline-none"
            />
          </div>

          {/* Tag Manager Module */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-widest">
              <Tag className="w-3 h-3" /> TAG_INDEX
            </span>
            <div className="flex flex-wrap gap-1 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center text-[9px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-100 darK:border-indigo-900/30"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-indigo-400 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-300 rounded"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <input
                id="editor-tag-input"
                type="text"
                placeholder="TAG_NAME_"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                className="bg-transparent text-[10px] font-mono text-slate-750 dark:text-slate-200 border-none focus:ring-0 focus:outline-none flex-1 min-w-[100px] py-0"
              />
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                <Bookmark className="w-3 h-3" /> CATEGORY_CLASS
              </label>
              <select
                id="editor-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> BACKGROUND_ACCENT
              </label>
              <div className="flex gap-1 p-1 bg-slate-50 dark:bg-[#131d30]/60 border border-slate-200/80 dark:border-slate-800 rounded justify-between h-[30px] items-center">
                {ATTACHMENT_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                      c.id === 'default'
                        ? 'bg-slate-50 border-slate-350 dark:bg-slate-850'
                        : c.id === 'rose'
                        ? 'bg-rose-100 border-rose-300'
                        : c.id === 'amber'
                        ? 'bg-amber-100 border-amber-300'
                        : c.id === 'emerald'
                        ? 'bg-emerald-100 border-emerald-300'
                        : c.id === 'sky'
                        ? 'bg-sky-100 border-sky-300'
                        : c.id === 'violet'
                        ? 'bg-violet-100 border-violet-300'
                        : 'bg-stone-200 border-stone-400'
                    } ${color === c.id ? 'ring-1 ring-indigo-500 dark:ring-white scale-105 border-transparent' : 'border-slate-200'}`}
                    title={c.name}
                  >
                    {color === c.id && (
                      <Check className="h-2.5 w-2.5 text-indigo-600 dark:text-stone-900 font-bold" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Controls Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#131d30]/40 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between font-mono shrink-0 select-none">
          <div className="text-[9px] text-slate-400 dark:text-slate-500 flex gap-2.5 font-mono">
            <span>WORD_COUNT: {wordCount}</span>
            <span>CHAR_COUNT: {charCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-editor"
              type="button"
              onClick={onClose}
              className="px-3 py-1 h-6 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors border border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
            <button
              id="btn-save-note"
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1 h-6 text-[10px] uppercase font-bold bg-indigo-600 text-white hover:bg-indigo-500 rounded transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3 h-3" /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
