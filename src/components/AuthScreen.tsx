import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, PenTool, Sparkles, Check, Key } from 'lucide-react';
import { User as UserType, AVATARS, USER_THEMES } from '../types';
import { getStoredUsers, saveStoredUsers, setSessionUser } from '../utils/storage';

interface AuthScreenProps {
  onLoginSuccess: (user: UserType) => void;
}

type AuthMode = 'login' | 'signup';

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login Fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Fields
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDisplayName, setSignupDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedTheme, setSelectedTheme] = useState(USER_THEMES[0].id);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword) {
      setLoginError('Please fill out all fields.');
      return;
    }

    const users = getStoredUsers();
    const cleanUsername = loginUsername.trim().toLowerCase();
    const matched = users[cleanUsername];

    if (!matched || matched.passwordHash !== loginPassword) {
      setLoginError('Invalid username or password.');
      return;
    }

    // Success
    setSessionUser(matched.user);
    onLoginSuccess(matched.user);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupUsername.trim() || !signupPassword || !signupDisplayName.trim()) {
      setSignupError('Please fill out all fields.');
      return;
    }

    const cleanUsername = signupUsername.trim().toLowerCase();
    
    if (cleanUsername.length < 3) {
      setSignupError('Username must be at least 3 characters.');
      return;
    }

    if (signupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters.');
      return;
    }

    const users = getStoredUsers();
    if (users[cleanUsername]) {
      setSignupError('Username is already taken.');
      return;
    }

    // Create User
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      name: signupDisplayName.trim(),
      avatar: selectedAvatar,
      colorTheme: selectedTheme,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    users[cleanUsername] = {
      user: newUser,
      passwordHash: signupPassword,
    };

    saveStoredUsers(users);
    
    // Animate transition
    setSignupSuccess(true);
    setTimeout(() => {
      // Auto-login after successful registration!
      setSessionUser(newUser);
      onLoginSuccess(newUser);
    }, 1200);
  };

  return (
    <div id="auth-container" className="min-h-screen flex items-center justify-center bg-[#f1f5f9] dark:bg-[#0b1329] p-4 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background blur vectors */}
      <div className="absolute top-0 -left-4 w-80 h-80 bg-indigo-200 dark:bg-indigo-950/15 rounded-full filter blur-3xl opacity-25 -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-80 h-80 bg-emerald-200 dark:bg-emerald-950/15 rounded-full filter blur-3xl opacity-25 -z-10 animate-pulse delay-75" />

      <div className="w-full max-w-sm bg-white dark:bg-[#0f172a] shadow-md rounded border border-slate-200 dark:border-slate-800/80 p-5 relative overflow-hidden">
        
        {/* App Greeting/Branding */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white shadow-xs mb-2">
            <PenTool className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-150">Notes Command Workspace</h1>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">SECURE INDEX & DIGITAL DATABASE</p>
        </div>

        {/* Auth Tabs */}
        {!signupSuccess && (
          <div className="flex bg-slate-100 dark:bg-slate-850 p-0.5 rounded border border-slate-200 dark:border-slate-800/80 mb-4">
            <button
              id="tab-login"
              type="button"
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`flex-1 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              Log In
            </button>
            <button
              id="tab-signup"
              type="button"
              onClick={() => { setMode('signup'); setSignupError(''); }}
              className={`flex-1 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {signupSuccess ? (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <div className="w-12 h-12 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Account Commited!</h2>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase">INITIALIZING LOCAL NOTES DATABASE...</p>
            </motion.div>
          ) : mode === 'login' ? (
            <motion.form
              key="login-form"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.12 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-mono">ACCOUNT_USERNAME_</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <User className="h-3.5 w-3.5" />
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-8 pr-3 h-7.5 text-[11px] bg-slate-50 dark:bg-slate-900 dark:text-slate-100 border border-slate-205 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-550/40 focus:border-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-mono">SECURITY_PASSKEY_</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Key className="h-3.5 w-3.5" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-8 pr-3 h-7.5 text-[11px] bg-slate-50 dark:bg-slate-900 dark:text-slate-100 border border-slate-205 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-550/40 focus:border-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {loginError && (
                <div id="login-error-msg" className="p-2 text-[10px] font-mono bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded text-rose-600 dark:text-rose-400 font-bold uppercase">
                  ERROR: {loginError}
                </div>
              )}

              <button
                id="btn-submit-login"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-7.5 py-1 rounded text-[11px] uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 mt-2"
              >
                Sign In to Workspace
              </button>

              <div className="text-center pt-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  New users?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setSignupError(''); }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline font-bold"
                  >
                    REGISTER ACCOUNT_
                  </button>
                </span>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="signup-form"
              onSubmit={handleSignup}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.12 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-mono">CHOOSE_USERNAME_</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <User className="h-3.5 w-3.5" />
                  </span>
                  <input
                    id="signup-username"
                    type="text"
                    placeholder="e.g. pavithra"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full pl-8 pr-3 h-7.5 text-[11px] bg-slate-50 dark:bg-slate-900 dark:text-slate-100 border border-slate-205 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-550/40 focus:border-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">PASSWORD_PHRASE_</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Key className="h-3.5 w-3.5" />
                  </span>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="At least 4 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-8 pr-3 h-7.5 text-[11px] bg-slate-50 dark:bg-slate-900 dark:text-slate-100 border border-slate-205 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-550/40 focus:border-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">DISPLAY_NAME_</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <input
                    id="signup-display-name"
                    type="text"
                    placeholder="e.g. Pavithra S"
                    value={signupDisplayName}
                    onChange={(e) => setSignupDisplayName(e.target.value)}
                    className="w-full pl-8 pr-3 h-7.5 text-[11px] bg-slate-50 dark:bg-slate-900 dark:text-slate-100 border border-slate-205 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-indigo-550/40 focus:border-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Avatar Selector Grid */}
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                  CHOOSE_AVATAR_GLYPH
                </label>
                <div className="grid grid-cols-8 gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-800 max-h-[72px] overflow-y-auto">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`h-6 w-6 rounded flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
                        selectedAvatar === emoji
                          ? 'bg-white dark:bg-[#1e293b] ring-1 ring-indigo-500 scale-105 shadow-3xs'
                          : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                  ACCENT_CONSOLE_THEME
                </label>
                <div className="flex gap-2 justify-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                  {USER_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border transition-all ${theme.bg} ${
                        selectedTheme === theme.id
                          ? 'border-indigo-600 dark:border-white scale-105 ring-1 ring-slate-350 dark:ring-slate-700'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={theme.id}
                    >
                      {selectedTheme === theme.id && (
                        <Check className="h-2.5 w-2.5 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {signupError && (
                <div id="signup-error-msg" className="p-2 text-[10px] font-mono bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded text-rose-600 dark:text-rose-400 font-bold uppercase">
                  ERROR: {signupError}
                </div>
              )}

              <button
                id="btn-submit-signup"
                type="submit"
                className="w-full bg-[#0f172a] dark:bg-slate-100 text-white dark:text-slate-900 font-bold h-7.5 py-1 rounded text-[11px] uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 mt-2 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                Create Account & Log In
              </button>

              <div className="text-center pt-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setLoginError(''); }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline font-bold"
                  >
                    GO TO LOGIN_
                  </button>
                </span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
