import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { leadService } from '@/services/lead.service';
import { getErrorMessage } from '@/services/api';
import { Lead } from '@/types';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { Button } from '@/components/ui/Button';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchLead = async () => {
      setIsLoading(true);
      try {
        const data = await leadService.getLeadById(id);
        setLead(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error || 'Lead not found'} />
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        ← Back to Dashboard
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lead.name}</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{lead.email}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Source</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">
              {new Date(lead.createdAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Updated</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">
              {new Date(lead.updatedAt).toLocaleString()}
            </dd>
          </div>
          {lead.createdBy && (
            <div>
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created By</dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {lead.createdBy.name} ({lead.createdBy.email})
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
