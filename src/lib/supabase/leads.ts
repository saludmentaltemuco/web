/**
 * Lead-related database helpers for Supabase (Salud Mental Temuco).
 * CRUD operations for patient inquiries and appointment requests.
 */

import type { Database, Lead, LeadInsert, LeadUpdate, LeadStatus } from '@/types';
import { getErrorMessage, isSupabaseError, PaginatedResponse, ListFilters } from './types';

type SupabaseClient<T> = any;

/**
 * Get all leads with optional filters and pagination.
 */
export async function getLeads(
  client: SupabaseClient<Database>,
  filters?: ListFilters & { status?: LeadStatus; service_type?: string }
): Promise<{ data: PaginatedResponse<Lead> | null; error: string | null }> {
  let query = client.from('leads').select('*', { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.service_type) {
    query = query.eq('service_type', filters.service_type);
  }

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  query = query.range(offset, offset + pageSize - 1);

  const orderBy = filters?.orderBy || 'created_at';
  const orderDirection = filters?.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  const result = await query;

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  const count = result.count || 0;
  const totalPages = Math.ceil(count / pageSize);

  return {
    data: {
      data: result.data || [],
      count,
      page,
      pageSize,
      totalPages,
    },
    error: null,
  };
}

/**
 * Get new (unprocessed) patient inquiries count.
 */
export async function getNewLeadsCount(client: SupabaseClient<Database>) {
  const result = await client
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  if (isSupabaseError(result)) {
    return { data: 0, error: getErrorMessage(result) };
  }

  return { data: result.count || 0, error: null };
}

/**
 * Get a single lead by ID.
 */
export async function getLeadById(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Create a new inquiry/appointment lead from website form.
 */
export async function createLead(
  client: SupabaseClient<Database>,
  data: Omit<LeadInsert, 'status'>
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .insert({ ...data, status: 'new' } as LeadInsert)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Update lead status.
 */
export async function updateLeadStatus(
  client: SupabaseClient<Database>,
  id: string,
  status: LeadStatus
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() } as LeadUpdate)
    .eq('id', id)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Update lead details (notes, status, details).
 */
export async function updateLead(
  client: SupabaseClient<Database>,
  id: string,
  data: LeadUpdate
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Delete a lead.
 */
export async function deleteLead(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const result = await client
    .from('leads')
    .delete()
    .eq('id', id);

  if (isSupabaseError(result)) {
    return { success: false, error: getErrorMessage(result) };
  }

  return { success: true, error: null };
}

/**
 * Get lead statistics by status.
 */
export async function getLeadStats(
  client: SupabaseClient<Database>
): Promise<{
  data: Record<LeadStatus, number> | null;
  error: string | null;
}> {
  const statuses: LeadStatus[] = ['new', 'contacted', 'scheduled', 'attended', 'cancelled'];
  const stats: Record<string, number> = {};

  for (const status of statuses) {
    const result = await client
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', status);

    if (isSupabaseError(result)) {
      return { data: null, error: getErrorMessage(result) };
    }

    stats[status] = result.count || 0;
  }

  return { data: stats as Record<LeadStatus, number>, error: null };
}