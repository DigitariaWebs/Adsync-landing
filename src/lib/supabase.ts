import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string) || '';

export type WaitlistRole = 'createur' | 'marque';

export type WaitlistEntry = {
  id: string;
  created_at: string;
  role: WaitlistRole;
  name: string;
  email: string;
  platform: string | null;
  category: string | null;
  country: string | null;
  audience_size: string | null;
  phone: string | null;
};

export type WaitlistInsert = {
  role: WaitlistRole;
  name: string;
  email: string;
  platform?: string | null;
  category?: string | null;
  country?: string | null;
  audience_size?: string | null;
  phone?: string | null;
};
