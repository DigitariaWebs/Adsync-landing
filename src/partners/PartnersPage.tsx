import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import PartnersLanding from './PartnersLanding';
import PartnerLogin from './PartnerLogin';
import PartnerDashboard from './PartnerDashboard';

type View = 'landing' | 'login' | 'dashboard';

export default function PartnersPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('landing');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session) setView('dashboard');
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) setView('dashboard');
      else setView('landing');
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (session && view === 'dashboard') {
    return <PartnerDashboard session={session} onSignOut={handleSignOut} />;
  }

  if (view === 'login') {
    return <PartnerLogin onBackToLanding={() => setView('landing')} />;
  }

  return <PartnersLanding onLoginClick={() => setView('login')} />;
}
