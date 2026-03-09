/**
 * Supabase Client Factory
 * Centralized instance creation for database access
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from '@api/config';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = getConfig();
  supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  return supabaseClient;
}
