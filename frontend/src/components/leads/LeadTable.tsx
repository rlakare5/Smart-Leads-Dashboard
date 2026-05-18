import { Link } from 'react-router-dom';
import { Lead } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, onEdit, onDelete }: LeadTableProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Name
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:table-cell">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 md:table-cell">
              Source
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:table-cell">
              Created
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td className="px-4 py-3">
                <Link
                  to={`/leads/${lead._id}`}
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {lead.name}
                </Link>
                <p className="text-sm text-slate-500 sm:hidden">{lead.email}</p>
              </td>
              <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 sm:table-cell">
                {lead.email}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 md:table-cell">
                {lead.source}
              </td>
              <td className="hidden px-4 py-3 text-sm text-slate-500 dark:text-slate-400 lg:table-cell">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
                    Edit
                  </Button>
                  {isAdmin && (
                    <Button variant="danger" size="sm" onClick={() => onDelete(lead)}>
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
