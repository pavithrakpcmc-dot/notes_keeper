/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Note } from '../types';

const USERS_KEY = 'notes_keeper_users';
const NOTES_KEY_PREFIX = 'notes_keeper_notes_';
const SESSION_USER_KEY = 'notes_keeper_session_user';

// Mock credentials helper
interface SavedUserEntry {
  user: User;
  passwordHash: string; // Plain for simple mock app
}

export function getStoredUsers(): Record<string, SavedUserEntry> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse users from localStorage', e);
    return {};
  }
}

export function saveStoredUsers(users: Record<string, SavedUserEntry>) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
}

export function getSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSessionUser(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_USER_KEY);
  }
}

const SEED_NOTES = (userId: string): Note[] => [
  {
    id: 'seed-welcome',
    userId,
    title: 'Welcome to your digital garden! 🪴',
    content: `Welcome to **Notes Keeper**! This is your workspace to brainstorm ideas, plan agendas, and keep organized thoughts.

Here is a quick overview of what you can do:
• **Pin notes** to keep them at the top of your list
• **Filter by categories** using the left navigation board
• **Search by typing keywords** instantly in the query bar
• **Color coordinate** cards with visual themes for rapid recognition
• **Add custom tags** below to group across multiple topics

Feel free to delete or edit this note to suit your workflow! Click the edit button below.`,
    tags: ['onboarding', 'tutorial', 'welcome'],
    category: 'General',
    pinned: true,
    color: 'violet',
    createdAt: Date.now() - 3600000 * 3, // 3 hours ago
    updatedAt: Date.now() - 3600000 * 3,
    isArchived: false,
  },
  {
    id: 'seed-ideas',
    userId,
    title: 'Bright Ideas & Brainstorms 💡',
    content: `• Custom mechanical keyboard design with retro keycaps.
• Interactive retro terminal style portfolio project.
• Seed-funding presentation structure for the new micro-app startup:
  1. Problem statement (the daily clutter of information)
  2. Solution (ultra-minimal context writing tools)
  3. Demo highlights (blazing fast indexing, zero friction UI)`,
    tags: ['creativity', 'future-builds'],
    category: 'Ideas',
    pinned: false,
    color: 'amber',
    createdAt: Date.now() - 3600000 * 12, // 12 hours ago
    updatedAt: Date.now() - 3600000 * 10,
    isArchived: false,
  },
  {
    id: 'seed-study',
    userId,
    title: 'Functional Programming notes 🧠',
    content: `Key principles to memorize:
1. **Pure Functions**: Zero side effects, always returns same output for same input
2. **Immutability**: Avoid direct reference updates. Create copies with state spread operators instead
3. **Declarative Style**: Focus on what to solve (using map, filter, reduce states) rather than low-level step-by-step imperative execution loops.`,
    tags: ['learning', 'coding', 'react'],
    category: 'Study',
    pinned: false,
    color: 'emerald',
    createdAt: Date.now() - 3600000 * 24, // 1 day ago
    updatedAt: Date.now() - 3600000 * 24,
    isArchived: false,
  },
  {
    id: 'seed-finance',
    userId,
    title: 'Project Budget Estimation 📊',
    content: `Drafting budget guidelines for Q3 development:
• Hosting & Cloud Compute: $120 / month
• Database persistent operations: $45 / month
• Design resources & dynamic graphics: $180 / flat rate
• Refreshment reserves: $50 / month

Total Estimated Baseline: $395. Buffer of 15% recommended for unforeseen package dependencies or api traffic spikes.`,
    tags: ['budget', 'business'],
    category: 'Finance',
    pinned: false,
    color: 'sky',
    createdAt: Date.now() - 3600000 * 48, // 2 days ago
    updatedAt: Date.now() - 3600000 * 48,
    isArchived: false,
  }
];

export function getUserNotes(userId: string): Note[] {
  try {
    const key = `${NOTES_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Seed initial onboarding notes so the UI is beautiful and educational right away!
      const initialNotes = SEED_NOTES(userId);
      saveUserNotes(userId, initialNotes);
      return initialNotes;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load notes for user ${userId}`, e);
    return [];
  }
}

export function saveUserNotes(userId: string, notes: Note[]) {
  try {
    const key = `${NOTES_KEY_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(notes));
  } catch (e) {
    console.error(`Failed to save notes for user ${userId}`, e);
  }
}
