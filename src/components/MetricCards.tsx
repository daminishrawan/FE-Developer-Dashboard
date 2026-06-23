import { motion } from 'framer-motion';
import { Users, CheckCircle2, CloudLightning, Ban } from 'lucide-react';
import { User } from '../types';

interface MetricCardsProps {
  users: User[];
}

export default function MetricCards({ users }: MetricCardsProps) {
  const total = users.length;
  const active = users.filter((u) => u.status === 'ACTIVE').length;
  const inactive = users.filter((u) => u.status === 'INACTIVE').length;
  const blocked = users.filter((u) => u.status === 'BLOCKED').length;

  const cards = [
    {
      id: 'metric-total',
      title: 'Total Developers',
      value: total,
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-zinc-900/45 border-indigo-100 dark:border-zinc-800',
    },
    {
      id: 'metric-active',
      title: 'Active Accounts',
      value: active,
      icon: CheckCircle2,
      color: 'text-emerald-500 dark:text-[#34d399]',
      bgColor: 'bg-emerald-50 dark:bg-zinc-900/45 border-emerald-100 dark:border-zinc-800',
    },
    {
      id: 'metric-inactive',
      title: 'Inactive Accounts',
      value: inactive,
      icon: CloudLightning,
      color: 'text-zinc-650 dark:text-zinc-400',
      bgColor: 'bg-zinc-50 dark:bg-zinc-900/45 border-zinc-100 dark:border-zinc-800',
    },
    {
      id: 'metric-blocked',
      title: 'Blocked Access',
      value: blocked,
      icon: Ban,
      color: 'text-rose-500 dark:text-[#fb7185]',
      bgColor: 'bg-rose-50 dark:bg-zinc-900/45 border-rose-100 dark:border-zinc-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`p-4 rounded-xl border ${card.bgColor} flex items-center justify-between shadow-xs dark:backdrop-blur-md`}
            id={card.id}
          >
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-1">
                {card.value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg bg-white dark:bg-[#18181b] border border-transparent dark:border-[#27272a] shadow-xs ${card.color}`}>
              <IconComponent className="h-5 w-5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
