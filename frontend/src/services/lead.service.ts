import { api } from './api';
import { ApiResponse, Lead, LeadFilters, LeadFormData, PaginatedLeads } from '@/types';

export const leadService = {
  getLeads: async (filters: LeadFilters): Promise<PaginatedLeads> => {
    const params: Record<string, string | number> = {
      page: filters.page,
      sort: filters.sort,
    };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;

    const response = await api.get<ApiResponse<PaginatedLeads>>('/leads', { params });
    return response.data.data!;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return response.data.data!.lead;
  },

  createLead: async (data: LeadFormData): Promise<Lead> => {
    const response = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return response.data.data!.lead;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
    const response = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return response.data.data!.lead;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportCsv: async (filters: Omit<LeadFilters, 'page'>): Promise<Blob> => {
    const params: Record<string, string> = { sort: filters.sort };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;

    const response = await api.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
