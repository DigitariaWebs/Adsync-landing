import { useEffect, useMemo, useState } from 'react';
import { supabase, AuditEntry } from '../lib/supabase';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const ACTION_LABELS: Record<string, string> = {
  'message.status_change': 'Changement de statut',
  'message.reply_saved': 'Brouillon de réponse sauvegardé',
  'message.reply_sent': 'Réponse envoyée',
  'team.permissions_update': 'Mise à jour des permissions',
  'waitlist.export': 'Export CSV de la liste',
};

function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action;
}

export default function AdminAudit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (cancelled) return;
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setEntries(data as AuditEntry[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const usersInLog = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) set.add(e.user_email);
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter(e => {
      if (userFilter !== 'all' && e.user_email !== userFilter) return false;
      if (!q) return true;
      return (
        e.user_email.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        (e.target_type ?? '').toLowerCase().includes(q) ||
        (e.target_id ?? '').toLowerCase().includes(q)
      );
    });
  }, [entries, userFilter, search]);

  return (
    <>
      {errorMsg && <div className="admin-error-banner">{errorMsg}</div>}

      <section className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <select
            className="admin-select"
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            aria-label="Filtrer par utilisateur"
          >
            <option value="all">Tous les utilisateurs</option>
            {usersInLog.map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="admin-search"
            placeholder="Rechercher action, cible, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            {entries.length === 0 ? 'Aucune activité enregistrée.' : 'Aucun résultat avec ces filtres.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Cible</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id}>
                  <td className="admin-cell-date">{formatDate(entry.created_at)}</td>
                  <td className="admin-cell-email">{entry.user_email}</td>
                  <td>{actionLabel(entry.action)}</td>
                  <td>
                    {entry.target_type ? `${entry.target_type}` : '.'}
                    {entry.target_id && (
                      <span className="admin-audit-id"> · {entry.target_id.slice(0, 8)}</span>
                    )}
                  </td>
                  <td>
                    {entry.details && Object.keys(entry.details).length > 0 ? (
                      <code className="admin-audit-json">
                        {JSON.stringify(entry.details)}
                      </code>
                    ) : (
                      '.'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
