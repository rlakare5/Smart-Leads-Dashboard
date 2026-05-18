import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LEAD_SOURCES, LEAD_STATUSES, LeadFilters as LeadFiltersType } from '@/types';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFilterChange: (filters: Partial<LeadFiltersType>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const LeadFiltersBar = ({
  filters,
  onFilterChange,
  searchValue,
  onSearchChange,
}: LeadFiltersProps) => (
  <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
    <Input
      label="Search"
      placeholder="Search by name or email..."
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <Select
      label="Status"
      value={filters.status || ''}
      onChange={(e) => onFilterChange({ status: e.target.value as LeadFiltersType['status'], page: 1 })}
      placeholder="All Statuses"
      options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
    />
    <Select
      label="Source"
      value={filters.source || ''}
      onChange={(e) => onFilterChange({ source: e.target.value as LeadFiltersType['source'], page: 1 })}
      placeholder="All Sources"
      options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
    />
    <Select
      label="Sort By"
      value={filters.sort}
      onChange={(e) =>
        onFilterChange({ sort: e.target.value as LeadFiltersType['sort'], page: 1 })
      }
      options={[
        { value: 'latest', label: 'Latest First' },
        { value: 'oldest', label: 'Oldest First' },
      ]}
    />
  </div>
);
