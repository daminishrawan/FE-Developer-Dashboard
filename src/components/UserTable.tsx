import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Github, Mail, Smartphone, ArrowUpDown, ChevronDown, Calendar, SearchX, UserCheck } from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

type SortField = 'id' | 'name' | 'createdDate' | 'role';
type SortOrder = 'asc' | 'desc';

export default function UserTable({ users, onEditUser, onDeleteUser, onStatusChange }: UserTableProps) {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let valA = a[sortField]?.toLowerCase() || '';
    let valB = b[sortField]?.toLowerCase() || '';

    if (sortField === 'id') {
      // Numerical sort forDEV-XXX
      const numA = parseInt(a.id.replace('DEV-', ''), 10) || 0;
      const numB = parseInt(b.id.replace('DEV-', ''), 10) || 0;
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-[#34d399] border border-emerald-500/20 shadow-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] mr-1.5 animate-pulse" />
            ACTIVE
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-[#a1a1aa] border border-zinc-500/20 shadow-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mr-1.5" />
            INACTIVE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-[#fb7185] border border-rose-500/20 shadow-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb7185] mr-1.5 animate-pulse" />
            BLOCKED
          </span>
        );
      default:
        return null;
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-zinc-400 opacity-60 hover:opacity-100 transition-opacity" />;
    return (
      <ArrowUpDown className={`ml-1 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  if (sortedUsers.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center" id="empty-state-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-4">
          <SearchX className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">No Developers Found</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          We couldn't find any profiles matching your filtering criteria. Try adjusting your search query, selecting another role, or adding a new developer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="user-display-wrapper">
      {/* 1. Desktop and Tablet Large screen view table */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-zinc-900/40 dark:backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-[#27272a]" id="desktop-developer-table">
            <thead className="bg-zinc-50 dark:bg-zinc-900/80">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-[#18181b]"
                  id="header-id"
                >
                  <div className="flex items-center">
                    User ID {getSortIcon('id')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-[#18181b]"
                  id="header-profile"
                >
                  <div className="flex items-center">
                    Developer Details {getSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-[#18181b]"
                  id="header-role"
                >
                  <div className="flex items-center">
                    Engineering Role {getSortIcon('role')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" id="header-contact">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" id="header-status">
                  Status
                </th>
                <th
                  onClick={() => handleSort('createdDate')}
                  className="px-6 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-[#18181b]"
                  id="header-created"
                >
                  <div className="flex items-center">
                    Joined Date {getSortIcon('createdDate')}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" id="header-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-[#18181b] bg-white dark:bg-transparent">
              {sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-[#18181b] transition-colors"
                  id={`user-row-${user.id}`}
                >
                  {/* ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {user.id}
                    </span>
                  </td>

                  {/* Profile and Bio */}
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex items-start space-x-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover shrink-0 mt-0.5"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate" title={user.name}>
                            {user.name}
                          </span>
                          {user.githubUsername && (
                            <a
                              href={`https://github.com/${user.githubUsername}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors inline-block"
                              title={`View GitHub profile (${user.githubUsername})`}
                            >
                              <Github className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                        {user.bio && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {user.role}
                    </span>
                  </td>

                  {/* Contact info info */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs space-y-1">
                    <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                      <Mail className="h-3 w-3 mr-1.5 shrink-0 text-zinc-400" />
                      <a href={`mailto:${user.email}`} className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                        {user.email}
                      </a>
                    </div>
                    <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                      <Smartphone className="h-3 w-3 mr-1.5 shrink-0 text-zinc-400" />
                      <span>{user.mobile}</span>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block text-left group">
                      {getStatusBadge(user.status)}

                      {/* Status toggle action selector on hover/tap */}
                      <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 z-10 w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-1">
                        <p className="text-[10px] font-bold text-zinc-400 px-2 py-1 uppercase tracking-wider">Change Status</p>
                        <hr className="border-zinc-100 dark:border-zinc-700 mb-1" />
                        {(['ACTIVE', 'INACTIVE', 'BLOCKED'] as UserStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => onStatusChange(user.id, st)}
                            disabled={user.status === st}
                            className={`w-full text-left px-2 py-1 text-xs rounded-md transition-colors ${
                              user.status === st
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-3 w-3 mr-1.5 text-zinc-400 shrink-0" />
                      <span>{user.createdDate}</span>
                    </div>
                  </td>

                  {/* Row Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {confirmDeleteId === user.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-bold font-semibold">Delete?</span>
                        <button
                          onClick={() => {
                            onDeleteUser(user.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 bg-rose-600 text-white text-[11px] font-semibold rounded-md hover:bg-rose-500 hover:shadow-xs transition-all cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[11px] font-semibold rounded-md transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2.5">
                        <button
                          onClick={() => onEditUser(user)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
                          title="Edit Developer Details"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(user.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
                          title="Remove Profile"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile Responsive Screen Adaptor View Cards */}
      <div className="md:hidden space-y-4" id="mobile-developer-grid">
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
          Registered Developers ({sortedUsers.length})
        </p>
        {sortedUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col space-y-4"
          >
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full border border-zinc-200 dark:border-zinc-850 object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{user.name}</h4>
                    {user.githubUsername && (
                      <a
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="inline-block mt-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[10px] px-1.5 py-0.5 rounded">
                    {user.id}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(user.status)}
              </div>
            </div>

            {/* Profile Bio details */}
            {user.bio && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 border-l-2 border-indigo-100 dark:border-indigo-950/50 pl-2.5 py-1 leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Role and Join Info */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <dt className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Role</dt>
                <dd className="mt-0.5 text-zinc-800 dark:text-zinc-250 font-semibold">{user.role}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Joined On</dt>
                <dd className="mt-0.5 text-zinc-800 dark:text-zinc-250 font-semibold flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-zinc-400 shrink-0" />
                  {user.createdDate}
                </dd>
              </div>
            </div>

            {/* Contact details */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-805 space-y-1.5 text-xs">
              <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                <Mail className="h-3.5 w-3.5 mr-2 text-zinc-400 shrink-0" />
                <a href={`mailto:${user.email}`} className="truncate hover:underline">
                  {user.email}
                </a>
              </div>
              <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                <Smartphone className="h-3.5 w-3.5 mr-2 text-zinc-400 shrink-0" />
                <span>{user.mobile}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-805">
              {confirmDeleteId === user.id ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-rose-500 font-bold">Really delete profile?</span>
                  <button
                    onClick={() => {
                      onDeleteUser(user.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-500 cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {/* Status Switch links */}
                  <div className="mr-auto flex items-center space-x-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mr-1">Status:</span>
                    {(['ACTIVE', 'INACTIVE', 'BLOCKED'] as UserStatus[])
                      .filter((st) => st !== user.status)
                      .map((st) => (
                        <button
                          key={st}
                          onClick={() => onStatusChange(user.id, st)}
                          className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                        >
                          {st.slice(0, 3)}
                        </button>
                      ))}
                  </div>

                  <button
                    onClick={() => onEditUser(user)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 border border-zinc-250 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 rounded-lg text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(user.id)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 border border-rose-150 dark:border-rose-900/30 text-rose-600 dark:text-rose-450 rounded-lg text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/10 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
