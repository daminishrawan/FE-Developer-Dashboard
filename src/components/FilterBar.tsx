import { Search, FilterX, UserPlus, Briefcase, ChevronDown } from 'lucide-react';
import { UserRole, UserStatus } from '../types';
import { VALID_ROLES, VALID_STATUSES } from '../data';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onOpenAddModal,
  onResetFilters,
}: FilterBarProps) {
  const isFiltered = searchQuery !== '' || selectedRole !== '' || selectedStatus !== '';

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6 shadow-xs flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 dark:backdrop-blur-md">
      {/* Filters Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-550">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search by Name, Email, or Mobile..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-lg pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border border-zinc-250 dark:border-[#27272a] text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors placeholder-zinc-400"
            id="filter-search-input"
          />
        </div>

        {/* Role Select Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-550">
            <Briefcase className="h-4 w-4" />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="block w-full rounded-lg pl-9 pr-8 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border border-zinc-250 dark:border-[#27272a] text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors appearance-none cursor-pointer"
            id="filter-role-select"
          >
            <option value="">All Roles</option>
            {VALID_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* Status Select Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-550">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-550" />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full rounded-lg pl-6 pr-8 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border border-zinc-250 dark:border-[#27272a] text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors appearance-none cursor-pointer"
            id="filter-status-select"
          >
            <option value="">All Statuses</option>
            {VALID_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Toolbox Trigger Buttons */}
      <div className="flex items-center space-x-2 shrink-0 md:justify-end">
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer"
            title="Clear filters"
            id="filter-clear-button"
          >
            <FilterX className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98 hover:scale-[1.01] transition-all cursor-pointer w-full lg:w-auto"
          id="add-user-trigger-button"
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Add Developer</span>
        </button>
      </div>
    </div>
  );
}
