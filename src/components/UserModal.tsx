import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Save, AlertTriangle, Github, Smartphone, Mail, Briefcase, Info } from 'lucide-react';
import { User, UserRole, UserStatus, FormErrors } from '../types';
import { VALID_ROLES, VALID_STATUSES } from '../data';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdDate'> & { id?: string }) => void;
  userToEdit: User | null;
}

const DEFAULT_STATE = {
  name: '',
  email: '',
  mobile: '',
  role: 'Frontend Engineer' as UserRole,
  status: 'ACTIVE' as UserStatus,
  bio: '',
  githubUsername: '',
  avatarUrl: '',
};

export default function UserModal({ isOpen, onClose, onSave, userToEdit }: UserModalProps) {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        mobile: userToEdit.mobile,
        role: userToEdit.role,
        status: userToEdit.status,
        bio: userToEdit.bio || '',
        githubUsername: userToEdit.githubUsername || '',
        avatarUrl: userToEdit.avatarUrl || '',
      });
    } else {
      setFormData(DEFAULT_STATE);
    }
    setErrors({});
    setTouched({});
  }, [userToEdit, isOpen]);

  const validate = (data: typeof DEFAULT_STATE): FormErrors => {
    const errs: FormErrors = {};
    
    // Name validation
    if (!data.name.trim()) {
      errs.name = 'Full Name is required';
    } else if (data.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(data.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g., example@domain.com)';
    }

    // Mobile Validation
    // Standard validation: check if empty, allow local/international numbers with length constraints
    const mobileCleaned = data.mobile.replace(/\s+/g, '');
    if (!data.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (mobileCleaned.length < 7 || mobileCleaned.length > 20) {
      errs.mobile = 'Mobile format range should be between 7 and 20 digits';
    } else if (!/^[\d\s()+-]{7,20}$/.test(data.mobile)) {
      errs.mobile = 'Mobile can only contain numbers, spaces, plus signs, brackets, and hyphens';
    }

    // Role validation
    if (!data.role) {
      errs.role = 'Engineering Role is required';
    }

    // Status validation
    if (!data.status) {
      errs.status = 'Status option is required';
    }

    return errs;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FormErrors] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to show any potential omissions
    const allTouched = Object.keys(DEFAULT_STATE).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Create random stylish avatar if none specified
      let finalAvatar = formData.avatarUrl;
      if (!finalAvatar) {
        const idRandom = Math.floor(Math.random() * 70);
        finalAvatar = `https://i.pravatar.cc/150?img=${idRandom}`;
      }

      onSave({
        ...formData,
        avatarUrl: finalAvatar,
        id: userToEdit?.id,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="user-modal-container">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity"
            id="modal-backdrop"
          />

          {/* Modal Content Drawer */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 text-left shadow-2xl transition-all w-full max-w-lg p-6 sm:p-8"
              id="modal-content-card"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4 mb-5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50" id="modal-title">
                      {userToEdit ? 'Edit Developer Profile' : 'Add New Developer'}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {userToEdit ? `Modifying ID: ${userToEdit.id}` : 'Create a fresh credentials file'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                  id="modal-close-button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Info Alert if Errors exist */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg flex items-start space-x-2 text-rose-800 dark:text-rose-300 text-xs text-left" id="modal-validation-warning">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Please correct the input parameters before saving:</p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      {Object.values(errors).map((err, i) => err && <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-xs">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Alice Mercer"
                      value={formData.name}
                      onBlur={() => handleBlur('name')}
                      onChange={handleInputChange}
                      className={`block w-full rounded-lg pl-3 pr-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 placeholder-zinc-400 transition-colors ${
                        errors.name && touched.name
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-zinc-250 dark:border-[#27272a] focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46]'
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Email and Mobile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Email address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="developer@techcorp.io"
                        value={formData.email}
                        onBlur={() => handleBlur('email')}
                        onChange={handleInputChange}
                        className={`block w-full rounded-lg pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 placeholder-zinc-400 transition-colors ${
                          errors.email && touched.email
                            ? 'border-rose-500 focus:ring-rose-500/20 shadow-xs'
                            : 'border-zinc-250 dark:border-[#27272a] focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46]'
                        }`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label htmlFor="mobile" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        placeholder="+1 (555) 012-3456"
                        value={formData.mobile}
                        onBlur={() => handleBlur('mobile')}
                        onChange={handleInputChange}
                        className={`block w-full rounded-lg pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 placeholder-zinc-400 transition-colors ${
                          errors.mobile && touched.mobile
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-zinc-250 dark:border-[#27272a] focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46]'
                        }`}
                      />
                    </div>
                    {errors.mobile && touched.mobile && (
                      <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Role and Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Role */}
                  <div>
                    <label htmlFor="role" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      User Role <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onBlur={() => handleBlur('role')}
                        onChange={handleInputChange}
                        className={`block w-full rounded-lg pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors border-zinc-250 dark:border-[#27272a]`}
                      >
                        {VALID_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.role && touched.role && (
                      <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">{errors.role}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Status Badge <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onBlur={() => handleBlur('status')}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg px-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border border-zinc-250 dark:border-[#27272a] text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors"
                    >
                      {VALID_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {errors.status && touched.status && (
                      <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">{errors.status}</p>
                    )}
                  </div>
                </div>

                {/* Additional Developer fields for premium touch */}
                {/* Bio text */}
                <div>
                  <label htmlFor="bio" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                    Developer Biography (Optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={2}
                    placeholder="Brief description of tech stack, projects, or interests..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg px-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border border-zinc-250 dark:border-[#27272a] text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors resize-none placeholder-zinc-400"
                  />
                </div>

                {/* GitHub handle */}
                <div>
                  <label htmlFor="githubUsername" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                    GitHub Username (Optional)
                  </label>
                  <div className="relative rounded-md shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <Github className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="githubUsername"
                      name="githubUsername"
                      placeholder="e.g. octocat"
                      value={formData.githubUsername}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-[#18181b] border border-zinc-250 dark:border-[#27272a] text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-[#3f3f46] transition-colors placeholder-zinc-400"
                    />
                  </div>
                </div>

                {/* Actions footer */}
                <div className="flex items-center justify-end space-x-3 pt-5 mt-6 border-t border-zinc-150 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border border-zinc-250 dark:border-zinc-800 transition-all cursor-pointer"
                    id="modal-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 select-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
                    id="modal-save-button"
                  >
                    <Save className="h-4 w-4" />
                    <span>{userToEdit ? 'Update Details' : 'Register Developer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
