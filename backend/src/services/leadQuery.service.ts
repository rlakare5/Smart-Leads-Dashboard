import { FilterQuery } from 'mongoose';
import { ILead } from '../models/Lead';
import { LeadSource, LeadStatus, SortOrder } from '../types';

export interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
}

export const buildLeadFilter = (params: LeadQueryParams): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  if (params.status) {
    filter.status = params.status;
  }

  if (params.source) {
    filter.source = params.source;
  }

  if (params.search) {
    const searchRegex = new RegExp(params.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

export const getSortOption = (sort?: SortOrder): Record<string, 1 | -1> => {
  return { createdAt: sort === 'oldest' ? 1 : -1 };
};

export const LEADS_PER_PAGE = 10;
