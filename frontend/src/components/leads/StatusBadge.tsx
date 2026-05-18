import { LeadStatus } from '@/types';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
  >
    {status}
  </span>
);
