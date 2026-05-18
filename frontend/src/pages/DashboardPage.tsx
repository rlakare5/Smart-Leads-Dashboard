import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { leadService } from '@/services/lead.service';
import { getErrorMessage } from '@/services/api';
import { Lead, LeadFilters, LeadFormData, PaginatedLeads } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { Pagination } from '@/components/leads/Pagination';

const initialFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await leadService.getLeads({
        ...filters,
        search: debouncedSearch || undefined,
      });
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const handleFilterChange = (updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleCreate = async (formData: LeadFormData) => {
    await leadService.createLead(formData);
    setModalMode(null);
    fetchLeads();
  };

  const handleUpdate = async (formData: LeadFormData) => {
    if (!selectedLead) return;
    await leadService.updateLead(selectedLead._id, formData);
    setModalMode(null);
    setSelectedLead(null);
    fetchLeads();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await leadService.deleteLead(deleteTarget._id);
    setDeleteTarget(null);
    fetchLeads();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadService.exportCsv({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch || undefined,
        sort: filters.sort,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport} isLoading={isExporting}>
            Export CSV
          </Button>
          <Button onClick={() => setModalMode('create')}>+ Add Lead</Button>
        </div>
      </div>

      <LeadFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="No leads found"
          description="Try adjusting your filters or create a new lead."
          action={<Button onClick={() => setModalMode('create')}>Create Lead</Button>}
        />
      ) : (
        <>
          <LeadTable
            leads={data.items}
            onEdit={(lead) => {
              setSelectedLead(lead);
              setModalMode('edit');
            }}
            onDelete={setDeleteTarget}
          />
          <Pagination
            pagination={data.pagination}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </>
      )}

      <Modal
        isOpen={modalMode === 'create'}
        onClose={() => setModalMode(null)}
        title="Create New Lead"
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setModalMode(null)}
          submitLabel="Create Lead"
        />
      </Modal>

      <Modal
        isOpen={modalMode === 'edit' && !!selectedLead}
        onClose={() => {
          setModalMode(null);
          setSelectedLead(null);
        }}
        title="Edit Lead"
      >
        {selectedLead && (
          <LeadForm
            initialData={{
              name: selectedLead.name,
              email: selectedLead.email,
              status: selectedLead.status,
              source: selectedLead.source,
            }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalMode(null);
              setSelectedLead(null);
            }}
            submitLabel="Update Lead"
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Lead"
        size="sm"
      >
        <p className="text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot
          be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
