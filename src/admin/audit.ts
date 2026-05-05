import { supabase } from '../lib/supabase';

export async function logAction(
  action: string,
  targetType: string | null = null,
  targetId: string | null = null,
  details: Record<string, unknown> = {},
) {
  try {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;
    await supabase.from('audit_log').insert({
      user_id: session.user.id,
      user_email: session.user.email ?? '',
      action,
      target_type: targetType,
      target_id: targetId,
      details,
    });
  } catch {
    // never block UI on audit failure
  }
}
