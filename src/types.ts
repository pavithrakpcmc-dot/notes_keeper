/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string; // Emoji character or profile graphic ID
  colorTheme: string; // Accent color theme (e.g., violet, emerald, amber, sky, rose)
  joinedDate: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  pinned: boolean;
  color: string; // Tailwind bg class identifier (e.g., 'default', 'sky', 'rose', 'amber', 'emerald', 'indigo', 'violet')
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
}

export type ActiveFilter = 'all' | 'pinned' | 'favorites' | 'archived' | 'category' | 'tag';

export interface FilterState {
  type: ActiveFilter;
  value?: string; // used for category name or tag name depending on active filter
}

export const ATTACHMENT_COLORS = [
  { id: 'default', bg: 'bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800', name: 'Original' },
  { id: 'rose', bg: 'bg-rose-50/70 border-rose-200/80 dark:bg-rose-950/20 dark:border-rose-900/50', name: 'Blush' },
  { id: 'amber', bg: 'bg-amber-50/70 border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-900/50', name: 'Sunset' },
  { id: 'emerald', bg: 'bg-emerald-50/70 border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-900/50', name: 'Mint' },
  { id: 'sky', bg: 'bg-sky-50/70 border-sky-200/80 dark:bg-sky-950/20 dark:border-sky-900/50', name: 'Sky' },
  { id: 'violet', bg: 'bg-violet-50/70 border-violet-200/80 dark:bg-violet-950/20 dark:border-violet-900/50', name: 'Lavender' },
  { id: 'stone', bg: 'bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700', name: 'Pebble' },
];

export const CATEGORIES = [
  { id: 'Personal', label: 'Personal', color: 'text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-950/30' },
  { id: 'Work', label: 'Work', color: 'text-indigo-500 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30' },
  { id: 'Ideas', label: 'Ideas', color: 'text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-950/30' },
  { id: 'Study', label: 'Study', color: 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30' },
  { id: 'Finance', label: 'Finance', color: 'text-sky-500 bg-sky-50 border-sky-100 dark:bg-sky-950/30' },
  { id: 'General', label: 'General', color: 'text-stone-500 bg-stone-50 border-stone-100 dark:bg-stone-800/50' },
];

export const AVATARS = [
  '✍️', '💡', '🌟', '🚀', '🧠', '🎨', '💼', '🏡', '🪴', '🍀', '🐾', '🍕', '☕', '🎧', '🪁', '🌻'
];

export const USER_THEMES = [
  { id: 'violet', value: 'indigo', text: 'text-indigo-600', bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', glow: 'shadow-indigo-100 dark:shadow-none' },
  { id: 'rose', value: 'rose', text: 'text-rose-600', bg: 'bg-rose-500', hover: 'hover:bg-rose-600', glow: 'shadow-rose-100 dark:shadow-none' },
  { id: 'amber', value: 'amber', text: 'text-amber-600', bg: 'bg-amber-500', hover: 'hover:bg-amber-600', glow: 'shadow-amber-100 dark:shadow-none' },
  { id: 'emerald', value: 'emerald', text: 'text-emerald-600', bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', glow: 'shadow-emerald-100 dark:shadow-none' },
  { id: 'sky', value: 'sky', text: 'text-sky-600', bg: 'bg-sky-500', hover: 'hover:bg-sky-600', glow: 'shadow-sky-100 dark:shadow-none' },
  { id: 'neutral', value: 'stone', text: 'text-stone-800 dark:text-stone-200', bg: 'bg-stone-900 dark:bg-stone-100', hover: 'hover:bg-stone-800 dark:hover:bg-stone-200', glow: 'shadow-stone-100 dark:shadow-none' },
];
