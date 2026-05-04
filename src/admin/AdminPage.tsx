import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, ADMIN_EMAIL } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (!session) {
    return <AdminLogin />;
  }

  const userEmail = session.user.email ?? '';

  if (ADMIN_EMAIL && userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <span className="admin-login-kicker">Accès refusé</span>
            <h1>Compte non autorisé</h1>
            <p>
              Tu es connecté en tant que <strong>{userEmail}</strong> mais ce compte n&apos;est pas
              administrateur.
            </p>
          </div>
          <button type="button" className="admin-signout" onClick={handleSignOut}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard adminEmail={userEmail} onSignOut={handleSignOut} />;
}
