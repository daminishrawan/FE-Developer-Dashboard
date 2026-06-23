import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Laptop,
  Moon,
  Sun,
  RotateCcw,
  Plus,
  Compass,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Database,
  ExternalLink,
  BookOpen
} from 'lucide-react';

import { User, UserRole, UserStatus } from './types';
import { INITIAL_USERS } from './data';
import MetricCards from './components/MetricCards';
import FilterBar from './components/FilterBar';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';

export default function App() {
  // 1. Storage & Persistence
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('DEV_DASHBOARD_USERS');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback to initial if localStorage throws a SecurityError inside sandboxed iframe
    }
    return INITIAL_USERS;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('DEV_DASHBOARD_DARK');
      return saved === 'true';
    } catch (e) {
      // Fallback
    }
    return true; // We default to dark mode for "Sophisticated Dark" flavor!
  });

  // 2. Filter & Modal UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize Dark Mode Class on body element
  useEffect(() => {
    try {
      localStorage.setItem('DEV_DASHBOARD_DARK', String(darkMode));
    } catch (e) {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Synchronize Users data
  useEffect(() => {
    try {
      localStorage.setItem('DEV_DASHBOARD_USERS', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Show status toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 3. User State Actions (CRUD)
  const handleSaveUser = (formData: Omit<User, 'id' | 'createdDate'> & { id?: string }) => {
    if (formData.id) {
      // Update Action
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === formData.id
            ? { ...u, ...formData } as User
            : u
        )
      );
      triggerToast(`Developer profile ${formData.name} updated successfully!`);
    } else {
      // Create Action
      const nextNum = users.reduce((acc, cur) => {
        const num = parseInt(cur.id.replace('DEV-', ''), 10);
        return num > acc ? num : acc;
      }, 0) + 1;
      const newId = `DEV-${String(nextNum).padStart(3, '0')}`;
      const nowStr = new Date().toISOString().split('T')[0];

      const newUser: User = {
        ...formData,
        id: newId,
        createdDate: nowStr,
      } as User;

      setUsers([newUser, ...users]);
      triggerToast(`Registered new developer profile: ${formData.name}!`);
    }
    setUserToEdit(null);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    triggerToast(`Deleted ${user?.name || 'developer'} profile.`);
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    triggerToast(`Updated ${user?.name}'s access status to ${newStatus}`);
  };

  const handleResetToDefault = () => {
    setUsers(INITIAL_USERS);
    setSearchQuery('');
    setSelectedRole('');
    setSelectedStatus('');
    triggerToast('Dev Registry Database restored to original mock profiles.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedStatus('');
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  // 4. Reactive Search & Filter Computations
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Real-time matched query by Name, Email, or Phone
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.mobile.toLowerCase().includes(q);

      // Filters dropdown role check
      const matchesRole = selectedRole === '' || user.role === selectedRole;

      // Filters dropdown status check
      const matchesStatus = selectedStatus === '' || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-90 w-full transition-colors duration-200 font-sans" id="app-root-container">
      
      {/* Sidebar Overlay and Frame Layout */}
      <div className="flex">
        
        {/* Sidebar Nav (Desktop only) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 shrink-0 p-6 shadow-xs" id="desktop-sidebar">
          
          {/* Logo Brand Title */}
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                DevSquad
              </h1>
              <span className="text-[10px] text-indigo-500 font-semibold tracking-wider uppercase">
                Registry Core
              </span>
            </div>
          </div>

          {/* Navigation Links (Decorative list representing the portal layout requested by user) */}
          <nav className="space-y-1 flex-1" aria-label="Sidebar Menu" id="sidebar-navigation">
            <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-3 mb-2.5">
              Admin Suite
            </span>
            <a
              href="#dashboard"
              className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/30 transition-all pointer-events-none"
            >
              <div className="flex items-center space-x-3">
                <Laptop className="h-4.5 w-4.5" />
                <span>Directories List</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>

            <div className="pt-6">
              <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-3 mb-2.5">
                Technical Actions
              </span>
              <button
                onClick={handleResetToDefault}
                className="w-full flex items-center space-x-3 px-3.5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                id="reset-db-sidebar-btn"
              >
                <RotateCcw className="h-4 w-4 text-zinc-400" />
                <span>Restore Default DB</span>
              </button>
            </div>
          </nav>

          {/* Sidebar Footer context */}
          <div className="border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Admin</p>
                <p className="text-[10px] text-zinc-400 font-medium">Workspace Port 3000</p>
              </div>
              <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 uppercase">
                v1.2.0
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Frame container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-12">
          
          {/* Header Action Navbar */}
          <header className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800/80" id="main-header-navbar">
            <div className="flex items-center space-x-3 lg:space-x-0">
              
              {/* Brand icon for mobile/hybrid widths */}
              <div className="p-2 bg-indigo-600 rounded-lg text-white lg:hidden">
                <Code className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-930 dark:text-zinc-50" id="header-main-title">
                  Software Developer User Dashboard
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-none">
                    State Sync Online • {users.length} active registry logs
                  </span>
                </div>
              </div>
            </div>

            {/* Quick utility widgets */}
            <div className="flex items-center space-x-2.5">
              
              {/* Reset defaults button for tablet/mobile where sidebar is hidden */}
              <button
                onClick={handleResetToDefault}
                className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                title="Reset Database to Defaults"
                id="reset-db-header-navbar"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Theme toggler */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs hover:bg-zinc-50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                aria-label="Toggle visual theme"
                id="theme-toggler"
              >
                {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-600" />}
              </button>
            </div>
          </header>

          {/* 5. Numeric Indicators Grid (Metrics overview) */}
          <MetricCards users={users} />

          {/* Developer Quick-Stats Bar & Guidelines Banner before control panels */}
          <div className="bg-gradient-to-r from-indigo-50/50 to-indigo-100/10 dark:from-indigo-950/20 dark:to-zinc-900 border border-indigo-100/40 dark:border-indigo-900/40 rounded-xl p-4 mb-6 flex items-start space-x-3 text-left">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-950/80 dark:text-zinc-300 leading-relaxed">
              <span className="font-bold text-indigo-900 dark:text-indigo-300">Live Mock Engine Integrated:</span> Feel free to <b>Add</b>, <b>Edit</b>, or <b>Delete</b> profiles. Your actions are saved directly in your browser's persistence layout! Double-click or hover a status badge in the table grid to swap status instantly on-the-fly.
            </div>
          </div>

          {/* 6. Filter Controls Toolbox Panel */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onOpenAddModal={handleOpenAdd}
            onResetFilters={handleResetFilters}
          />

          {/* 7. Primary Developer Grid Table */}
          <UserTable
            users={filteredUsers}
            onEditUser={handleOpenEdit}
            onDeleteUser={handleDeleteUser}
            onStatusChange={handleStatusChange}
          />

        </main>
      </div>

      {/* 8. User Creation & Edit Form Drawer Overlay */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
      />

      {/* Real-time floating Notification Toast alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-5 right-5 z-50 bg-zinc-900 dark:bg-zinc-105 border border-zinc-700 text-white rounded-xl shadow-2xl p-4 text-xs font-semibold flex items-center space-x-3 scroll-smooth select-none cursor-pointer"
            id="toast-notification-banner"
            onClick={() => setToastMessage(null)}
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
