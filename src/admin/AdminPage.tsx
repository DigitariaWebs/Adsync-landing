import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  supabase,
  effectivePermissions,
  isAdminEmail,
  EffectivePermissions,
  UserPermissions,
} from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [perms, setPerms] = useState<EffectivePermissions | null>(null);
  const [permsLoading, setPermsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setPerms(null);
      return;
    }
    const email = session.user.email ?? '';
    if (isAdminEmail(email)) {
      setPerms(effectivePermissions(email, null));
      return;
    }
    setPermsLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error && error.code !== 'PGRST116') {
        // ignore not-found, treat as no perms
        console.warn('Failed to load permissions', error);
      }
      setPerms(effectivePermissions(email, (data as UserPermissions | null) ?? null));
      setPermsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (!session) {
    return <AdminLogin />;
  }

  if (permsLoading || !perms) {
    return <div className="admin-loading">Chargement...</div>;
  }

  const userEmail = session.user.email ?? '';

  if (!perms.isAdmin && !perms.isActive) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <span className="admin-login-kicker">Compte en attente</span>
            <h1>Accès non encore activé</h1>
            <p>
              Tu es connecté en tant que <strong>{userEmail}</strong>. L&apos;administrateur doit
              activer ton compte et te donner des permissions avant que tu puisses accéder au
              tableau de bord.
            </p>
          </div>
          <button type="button" className="admin-signout" onClick={handleSignOut}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (
    !perms.isAdmin &&
    !perms.canViewWaitlist &&
    !perms.canViewMessages
  ) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <span className="admin-login-kicker">Aucune permission</span>
            <h1>Pas d&apos;accès configuré</h1>
            <p>
              Ton compte <strong>{userEmail}</strong> n&apos;a aucune permission active.
              Demande à l&apos;admin d&apos;activer au moins une section.
            </p>
          </div>
          <button type="button" className="admin-signout" onClick={handleSignOut}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard adminEmail={userEmail} permissions={perms} onSignOut={handleSignOut} />;
}
