/**
 * CustomRequestRepository
 * Data access layer for CustomRequest entity
 * Implements IRepository CRUD operations
 */

import { IRepository, CustomRequest, CustomRequestStatus } from '@api/types';
import { getSupabaseClient } from '@api/utils/supabaseClient';
import { logger } from '@api/utils/logger';
import { InternalError } from '@api/errors/AppError';

export class CustomRequestRepository implements IRepository<CustomRequest> {
  private readonly tableName = 'custom_requests';

  async findAll(): Promise<CustomRequest[]> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new InternalError(`Failed to fetch custom requests: ${error.message}`);
      }

      return (data as CustomRequest[]) || [];
    } catch (error) {
      logger.error('Error in findAll', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async findById(id: string): Promise<CustomRequest | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new InternalError(`Failed to fetch custom request: ${error.message}`);
      }

      return (data as CustomRequest) || null;
    } catch (error) {
      logger.error('Error in findById', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async create(data: Omit<CustomRequest, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<CustomRequest> {
    try {
      const { data: created, error } = await getSupabaseClient()
        .from(this.tableName)
        .insert({
          ...data,
          status: CustomRequestStatus.NEW,
        })
        .select()
        .single();

      if (error) {
        throw new InternalError(`Failed to create custom request: ${error.message}`);
      }

      return created as CustomRequest;
    } catch (error) {
      logger.error('Error in create', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async update(id: string, data: Partial<CustomRequest>): Promise<CustomRequest | null> {
    try {
      const { data: updated, error } = await getSupabaseClient()
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new InternalError(`Failed to update custom request: ${error.message}`);
      }

      return (updated as CustomRequest) || null;
    } catch (error) {
      logger.error('Error in update', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await getSupabaseClient()
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new InternalError(`Failed to delete custom request: ${error.message}`);
      }

      return true;
    } catch (error) {
      logger.error('Error in delete', error instanceof Error ? error : undefined);
      throw error;
    }
  }
}
