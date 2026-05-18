import { Response } from 'express';
import { Lead } from '../models/Lead';
import { AuthenticatedRequest, LeadSource, LeadStatus, PaginatedResponse, SortOrder } from '../types';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import {
  buildLeadFilter,
  getSortOption,
  LEADS_PER_PAGE,
  LeadQueryParams,
} from '../services/leadQuery.service';

const parseQueryParams = (query: AuthenticatedRequest['query']): LeadQueryParams & { page: number } => {
  return {
    page: Math.max(1, parseInt(String(query.page || '1'), 10) || 1),
    status: query.status as LeadStatus | undefined,
    source: query.source as LeadSource | undefined,
    search: query.search ? String(query.search) : undefined,
    sort: (query.sort as SortOrder) || 'latest',
  };
};

export const createLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Authentication required');
  }

  const lead = await Lead.create({
    ...req.body,
    createdBy: req.user.userId,
  });

  sendSuccess(res, 201, 'Lead created successfully', { lead });
});

export const getLeads = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, status, source, search, sort } = parseQueryParams(req.query);
  const filter = buildLeadFilter({ status, source, search, sort });
  const skip = (page - 1) * LEADS_PER_PAGE;

  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter)
      .sort(getSortOption(sort))
      .skip(skip)
      .limit(LEADS_PER_PAGE)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalRecords / LEADS_PER_PAGE) || 1;

  const data: PaginatedResponse<typeof leads[0]> = {
    items: leads,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit: LEADS_PER_PAGE,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  sendSuccess(res, 200, 'Leads retrieved successfully', data);
});

export const getLeadById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  sendSuccess(res, 200, 'Lead retrieved successfully', { lead });
});

export const updateLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  sendSuccess(res, 200, 'Lead updated successfully', { lead });
});

export const deleteLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  sendSuccess(res, 200, 'Lead deleted successfully');
});

export const exportLeadsCsv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, source, search, sort } = parseQueryParams(req.query);
  const filter = buildLeadFilter({ status, source, search, sort });

  const leads = await Lead.find(filter).sort(getSortOption(sort));

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.email.replace(/"/g, '""')}"`,
    lead.status,
    lead.source,
    lead.createdAt.toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
  res.status(200).send(csv);
});
