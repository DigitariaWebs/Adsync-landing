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

export type MessageStatus = 'new' | 'read' | 'replied';

export type Message = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: MessageStatus;
  reply: string | null;
  replied_at: string | null;
  replied_by: string | null;
};

export type MessageInsert = {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
};

export type UserPermissions = {
  user_id: string;
  email: string;
  can_view_waitlist: boolean;
  can_edit_waitlist: boolean;
  can_view_messages: boolean;
  can_reply_messages: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuditEntry = {
  id: string;
  created_at: string;
  user_id: string | null;
  user_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
};

export type EffectivePermissions = {
  isAdmin: boolean;
  isActive: boolean;
  canViewWaitlist: boolean;
  canEditWaitlist: boolean;
  canViewMessages: boolean;
  canReplyMessages: boolean;
};

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && !!ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function effectivePermissions(
  email: string | null | undefined,
  perms: UserPermissions | null,
): EffectivePermissions {
  if (isAdminEmail(email)) {
    return {
      isAdmin: true,
      isActive: true,
      canViewWaitlist: true,
      canEditWaitlist: true,
      canViewMessages: true,
      canReplyMessages: true,
    };
  }
  if (!perms || !perms.is_active) {
    return {
      isAdmin: false,
      isActive: false,
      canViewWaitlist: false,
      canEditWaitlist: false,
      canViewMessages: false,
      canReplyMessages: false,
    };
  }
  return {
    isAdmin: false,
    isActive: true,
    canViewWaitlist: perms.can_view_waitlist,
    canEditWaitlist: perms.can_edit_waitlist,
    canViewMessages: perms.can_view_messages,
    canReplyMessages: perms.can_reply_messages,
  };
}
