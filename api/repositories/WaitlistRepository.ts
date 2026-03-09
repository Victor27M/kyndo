/**
 * WaitlistRepository
 * Data access layer for Waitlist entity
 * Implements IRepository CRUD operations
 */

import { IRepository, Waitlist } from '@api/types';
import { getSupabaseClient } from '@api/utils/supabaseClient';
import { logger } from '@api/utils/logger';
import { InternalError } from '@api/errors/AppError';

export class WaitlistRepository implements IRepository<Waitlist> {
  private readonly tableName = 'waitlist';

  async findAll(): Promise<Waitlist[]> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new InternalError(`Failed to fetch waitlist: ${error.message}`);
      }

      return (data as Waitlist[]) || [];
    } catch (error) {
      logger.error('Error in findAll', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async findById(id: string): Promise<Waitlist | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new InternalError(`Failed to fetch waitlist entry: ${error.message}`);
      }

      return (data as Waitlist) || null;
    } catch (error) {
      logger.error('Error in findById', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Waitlist | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new InternalError(`Failed to fetch waitlist entry: ${error.message}`);
      }

      return (data as Waitlist) || null;
    } catch (error) {
      logger.error('Error in findByEmail', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async create(data: Omit<Waitlist, 'id' | 'created_at' | 'updated_at'>): Promise<Waitlist> {
    try {
      const { data: created, error } = await getSupabaseClient()
        .from(this.tableName)
        .upsert(
          { ...data, email: data.email.toLowerCase() },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (error) {
        throw new InternalError(`Failed to create waitlist entry: ${error.message}`);
      }

      return created as Waitlist;
    } catch (error) {
      logger.error('Error in create', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async update(id: string, data: Partial<Waitlist>): Promise<Waitlist | null> {
    try {
      const { data: updated, error } = await getSupabaseClient()
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new InternalError(`Failed to update waitlist entry: ${error.message}`);
      }

      return (updated as Waitlist) || null;
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
        throw new InternalError(`Failed to delete waitlist entry: ${error.message}`);
      }

      return true;
    } catch (error) {
      logger.error('Error in delete', error instanceof Error ? error : undefined);
      throw error;
    }
  }
}
