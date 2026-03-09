/**
 * OrderRepository
 * Data access layer for Order entity from Stripe webhooks
 */

import { Order } from '@api/types';
import { getSupabaseClient } from '@api/utils/supabaseClient';
import { logger } from '@api/utils/logger';
import { InternalError } from '@api/errors/AppError';

export class OrderRepository {
  private readonly tableName = 'orders';

  async findOrCreateByStripeId(stripeId: string, orderData: Omit<Order, 'id'>): Promise<Order> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .upsert({ ...orderData, stripe_id: stripeId }, { onConflict: 'stripe_id' })
        .select()
        .single();

      if (error) {
        throw new InternalError(`Failed to upsert order: ${error.message}`);
      }

      return data as Order;
    } catch (error) {
      logger.error('Error in findOrCreateByStripeId', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async findByStripeId(stripeId: string): Promise<Order | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from(this.tableName)
        .select('*')
        .eq('stripe_id', stripeId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new InternalError(`Failed to fetch order: ${error.message}`);
      }

      return (data as Order) || null;
    } catch (error) {
      logger.error('Error in findByStripeId', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async updateCustomerNotified(id: string): Promise<void> {
    try {
      const { error } = await getSupabaseClient()
        .from(this.tableName)
        .update({ customer_emailed: true })
        .eq('id', id);

      if (error) {
        throw new InternalError(`Failed to update order: ${error.message}`);
      }
    } catch (error) {
      logger.error('Error in updateCustomerNotified', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  async updateOwnerNotified(id: string): Promise<void> {
    try {
      const { error } = await getSupabaseClient()
        .from(this.tableName)
        .update({ owner_notified: true })
        .eq('id', id);

      if (error) {
        throw new InternalError(`Failed to update order: ${error.message}`);
      }
    } catch (error) {
      logger.error('Error in updateOwnerNotified', error instanceof Error ? error : undefined);
      throw error;
    }
  }
}
