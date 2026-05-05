import { FormEvent, useEffect, useState } from 'react';
import { supabase, UserPermissions, TeamInvite } from '../lib/supabase';
import { logAction } from './audit';

type PermKey = 'can_view_waitlist' | 'can_edit_waitlist' | 'can_view_messages' | 'can_reply_messages';

const PERM_KEYS: Array<{ key: PermKey; label: string; desc: string }> = [
  { key: 'can_view_waitlist', label: 'Voir les inscriptions', desc: 'Lire la liste d’attente' },
  { key: 'can_edit_waitlist', label: 'Modifier les inscriptions', desc: 'Exporter, supprimer' },
  { key: 'can_view_messages', label: 'Voir les messages', desc: 'Lire les messages reçus' },
  { key: 'can_reply_messages', label: 'Répondre aux messages', desc: 'Envoyer/sauvegarder une réponse' },
];

const EMPTY_PERMS: Record<PermKey, boolean> = {
  can_view_waitlist: false,
  can_edit_waitlist: false,
  can_view_messages: false,
  can_reply_messages: false,
};

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
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePerms, setInvitePerms] = useState<Record<PermKey, boolean>>({ ...EMPTY_PERMS });
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    const [usersRes, invitesRes] = await Promise.all([
      supabase.from('user_permissions').select('*').order('created_at', { ascending: false }),
      supabase.from('team_invites').select('*').order('created_at', { ascending: false }),
    ]);
    if (usersRes.error) setErrorMsg(usersRes.error.message);
    else if (usersRes.data) setUsers(usersRes.data as UserPermissions[]);
    if (invitesRes.error && invitesRes.error.code !== 'PGRST116') {
      setErrorMsg(prev => prev || invitesRes.error!.message);
    } else if (invitesRes.data) {
      setInvites(invitesRes.data as TeamInvite[]);
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

  const submitInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInviteSubmitting(true);
    setErrorMsg('');
    setInviteSuccess('');

    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg('Entre un email valide.');
      setInviteSubmitting(false);
      return;
    }

    const { error } = await supabase.from('team_invites').upsert({
      email,
      ...invitePerms,
      invited_by: adminEmail,
    });

    setInviteSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setInviteSuccess(
      `Invitation préparée pour ${email}. Demande-lui d'aller sur /admin et de cliquer « Créer un compte » avec cet email exact. Ses permissions seront appliquées automatiquement à l'inscription.`,
    );
    setInviteEmail('');
    setInvitePerms({ ...EMPTY_PERMS });
    void logAction('team.invite_created', 'invite', email, invitePerms);
    void load();
  };

  const cancelInvite = async (email: string) => {
    const { error } = await supabase.from('team_invites').delete().eq('email', email);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setInvites(prev => prev.filter(i => i.email !== email));
    void logAction('team.invite_cancelled', 'invite', email);
  };

  const updateInvitePerm = async (invite: TeamInvite, patch: Partial<TeamInvite>) => {
    const { error } = await supabase.from('team_invites').update(patch).eq('email', invite.email);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setInvites(prev => prev.map(i => (i.email === invite.email ? { ...i, ...patch } as TeamInvite : i)));
  };

  return (
    <>
      {errorMsg && <div className="admin-error-banner">{errorMsg}</div>}

      <section className="admin-team-intro">
        <h2>Inviter un manager</h2>
        <p>
          Renseigne son email et coche les permissions à lui donner. Quand il créera son compte sur{' '}
          <code>/admin</code> avec ce même email, ses droits seront appliqués automatiquement.
          L&apos;admin principal <strong>{adminEmail}</strong> garde tous les accès.
        </p>

        <form className="admin-invite-form" onSubmit={submitInvite}>
          <div className="admin-invite-row">
            <label className="admin-invite-field">
              <span>Email du manager</span>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="manager@adsync.io"
              />
            </label>
          </div>

          <div className="admin-team-perms admin-invite-perms">
            {PERM_KEYS.map(({ key, label, desc }) => (
              <label key={key} className="admin-team-perm">
                <input
                  type="checkbox"
                  checked={invitePerms[key]}
                  onChange={e => setInvitePerms(prev => ({ ...prev, [key]: e.target.checked }))}
                />
                <div>
                  <span className="admin-team-perm-label">{label}</span>
                  <span className="admin-team-perm-desc">{desc}</span>
                </div>
              </label>
            ))}
          </div>

          {inviteSuccess && <p className="admin-login-info">{inviteSuccess}</p>}

          <button type="submit" className="admin-export" disabled={inviteSubmitting}>
            {inviteSubmitting ? 'Envoi...' : 'Préparer l’invitation'}
          </button>
        </form>
      </section>

      {invites.length > 0 && (
        <section className="admin-team-section">
          <h3 className="admin-team-section-title">Invitations en attente</h3>
          <div className="admin-team-grid">
            {invites.map(invite => (
              <article key={invite.email} className="admin-team-card admin-team-card-invite">
                <header className="admin-team-card-head">
                  <div>
                    <h3>{invite.email}</h3>
                    <p>Invité le {formatDate(invite.created_at)}</p>
                    <span className="admin-team-badge admin-team-badge-pending">En attente d&apos;inscription</span>
                  </div>
                  <button
                    type="button"
                    className="admin-segment-btn admin-team-cancel"
                    onClick={() => cancelInvite(invite.email)}
                  >
                    Annuler
                  </button>
                </header>

                <div className="admin-team-perms">
                  {PERM_KEYS.map(({ key, label, desc }) => (
                    <label key={key} className="admin-team-perm">
                      <input
                        type="checkbox"
                        checked={Boolean(invite[key])}
                        onChange={e => updateInvitePerm(invite, { [key]: e.target.checked } as Partial<TeamInvite>)}
                      />
                      <div>
                        <span className="admin-team-perm-label">{label}</span>
                        <span className="admin-team-perm-desc">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="admin-team-section">
        <h3 className="admin-team-section-title">Comptes actifs</h3>
        {loading ? (
          <div className="admin-empty">Chargement...</div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            Aucun compte n&apos;est encore actif. Invite un manager ci-dessus, puis demande-lui de
            créer son compte sur <code>/admin</code>.
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
                      <p>Inscrit le {formatDate(user.created_at)}</p>
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
      </section>
    </>
  );
}
