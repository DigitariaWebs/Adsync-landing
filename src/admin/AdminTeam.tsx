import { useEffect, useState } from 'react';
import { supabase, UserPermissions } from '../lib/supabase';
import { logAction } from './audit';

const PERM_KEYS: Array<{ key: keyof UserPermissions; label: string; desc: string }> = [
  { key: 'can_view_waitlist', label: 'Voir les inscriptions', desc: 'Lire la liste d’attente' },
  { key: 'can_edit_waitlist', label: 'Modifier les inscriptions', desc: 'Exporter, supprimer' },
  { key: 'can_view_messages', label: 'Voir les messages', desc: 'Lire les messages reçus' },
  { key: 'can_reply_messages', label: 'Répondre aux messages', desc: 'Envoyer/sauvegarder une réponse' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminTeam({ adminEmail }: { adminEmail: string }) {
  const [users, setUsers] = useState<UserPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setErrorMsg(error.message);
    } else if (data) {
      setUsers(data as UserPermissions[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const updatePerm = async (user: UserPermissions, patch: Partial<UserPermissions>) => {
    setSavingId(user.user_id);
    const { error } = await supabase
      .from('user_permissions')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('user_id', user.user_id);
    setSavingId(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setUsers(prev => prev.map(u => (u.user_id === user.user_id ? { ...u, ...patch } as UserPermissions : u)));
    void logAction('team.permissions_update', 'user', user.user_id, {
      target_email: user.email,
      patch,
    });
  };

  return (
    <>
      {errorMsg && <div className="admin-error-banner">{errorMsg}</div>}

      <section className="admin-team-intro">
        <h2>Gestion de l&apos;équipe</h2>
        <p>
          Tout utilisateur qui se crée un compte sur la page <code>/admin</code> apparaît ici sans
          aucun droit. Active uniquement les permissions nécessaires. L&apos;admin principal{' '}
          <strong>{adminEmail}</strong> a tous les accès en permanence.
        </p>
      </section>

      {loading ? (
        <div className="admin-empty">Chargement...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty">
          Aucun utilisateur secondaire pour le moment. Demande à ton manager de créer son compte sur
          la page <code>/admin</code>, il apparaîtra ici automatiquement.
        </div>
      ) : (
        <div className="admin-team-grid">
          {users.map(user => {
            const isMainAdmin = user.email.toLowerCase() === adminEmail.toLowerCase();
            const saving = savingId === user.user_id;
            return (
              <article key={user.user_id} className="admin-team-card">
                <header className="admin-team-card-head">
                  <div>
                    <h3>{user.email}</h3>
                    <p>Créé le {formatDate(user.created_at)}</p>
                    {isMainAdmin && <span className="admin-team-badge">Admin principal</span>}
                  </div>
                  {!isMainAdmin && (
                    <label className="admin-team-active">
                      <input
                        type="checkbox"
                        checked={user.is_active}
                        disabled={saving}
                        onChange={e => updatePerm(user, { is_active: e.target.checked })}
                      />
                      <span>{user.is_active ? 'Actif' : 'Désactivé'}</span>
                    </label>
                  )}
                </header>

                <div className="admin-team-perms">
                  {PERM_KEYS.map(({ key, label, desc }) => (
                    <label key={key} className="admin-team-perm">
                      <input
                        type="checkbox"
                        checked={isMainAdmin ? true : Boolean(user[key])}
                        disabled={isMainAdmin || saving || !user.is_active}
                        onChange={e => updatePerm(user, { [key]: e.target.checked } as Partial<UserPermissions>)}
                      />
                      <div>
                        <span className="admin-team-perm-label">{label}</span>
                        <span className="admin-team-perm-desc">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
