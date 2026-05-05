import { useEffect, useMemo, useState } from 'react';
import { supabase, Message, MessageStatus } from '../lib/supabase';
import { logAction } from './audit';

type StatusFilter = 'all' | MessageStatus;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusLabel(status: MessageStatus) {
  if (status === 'new') return 'Nouveau';
  if (status === 'read') return 'Lu';
  return 'Répondu';
}

function buildGmailUrl(to: string, subject: string, body: string) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function AdminMessages({ canReply = true }: { canReply?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyDraft, setReplyDraft] = useState<string>('');
  const [savingReply, setSavingReply] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setMessages(data as Message[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter(m => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject ?? '').toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, statusFilter, search]);

  const stats = useMemo(() => {
    let unread = 0;
    let replied = 0;
    for (const m of messages) {
      if (m.status === 'new') unread++;
      if (m.status === 'replied') replied++;
    }
    return { total: messages.length, unread, replied };
  }, [messages]);

  const updateStatus = async (id: string, next: MessageStatus, silent = false) => {
    const previous = messages;
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, status: next } : m)));
    if (selected?.id === id) {
      setSelected({ ...selected, status: next });
    }
    const { error } = await supabase.from('messages').update({ status: next }).eq('id', id);
    if (error) {
      if (!silent) setErrorMsg(error.message);
      setMessages(previous);
      return false;
    }
    if (!silent) {
      void logAction('message.status_change', 'message', id, { status: next });
    }
    return true;
  };

  const openMessage = (m: Message) => {
    setSelected(m);
    setReplyDraft(m.reply ?? `Bonjour ${m.name},\n\n`);
    if (m.status === 'new') {
      void updateStatus(m.id, 'read', true);
    }
  };

  const saveReply = async (markReplied: boolean) => {
    if (!selected || !canReply) return;
    setSavingReply(true);
    const trimmed = replyDraft.trim();
    const session = (await supabase.auth.getSession()).data.session;
    const repliedBy = session?.user.email ?? null;
    const patch: Partial<Message> = {
      reply: trimmed || null,
      replied_at: markReplied ? new Date().toISOString() : selected.replied_at,
      replied_by: markReplied ? repliedBy : selected.replied_by,
      status: markReplied ? 'replied' : selected.status,
    };
    const { error } = await supabase.from('messages').update(patch).eq('id', selected.id);
    setSavingReply(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setMessages(prev => prev.map(m => (m.id === selected.id ? { ...m, ...patch } as Message : m)));
    setSelected({ ...selected, ...patch } as Message);
    void logAction(markReplied ? 'message.reply_sent' : 'message.reply_saved', 'message', selected.id, {
      length: trimmed.length,
    });
  };

  const openInGmail = () => {
    if (!selected) return;
    const subject = selected.subject ? `Re: ${selected.subject}` : 'Re: ton message à AdSync';
    const body = `${replyDraft.trim()}\n\n---\nMessage d'origine :\n${selected.message}`;
    const url = buildGmailUrl(selected.email, subject, body);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openInMailClient = () => {
    if (!selected) return;
    const subject = selected.subject ? `Re: ${selected.subject}` : 'Re: ton message à AdSync';
    const body = `${replyDraft.trim()}\n\n---\nMessage d'origine :\n${selected.message}`;
    const href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <>
      {errorMsg && <div className="admin-error-banner">{errorMsg}</div>}

      <section className="admin-kpis">
        <article className="admin-kpi">
          <span className="admin-kpi-label">Total messages</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Non lus</span>
          <strong>{stats.unread}</strong>
        </article>
        <article className="admin-kpi">
          <span className="admin-kpi-label">Répondus</span>
          <strong>{stats.replied}</strong>
        </article>
      </section>

      <section className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <div className="admin-segment" role="tablist" aria-label="Filtrer par statut">
            {(['all', 'new', 'read', 'replied'] as StatusFilter[]).map(opt => (
              <button
                key={opt}
                type="button"
                className={`admin-segment-btn ${statusFilter === opt ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(opt)}
              >
                {opt === 'all'
                  ? 'Tous'
                  : opt === 'new'
                    ? 'Nouveaux'
                    : opt === 'read'
                      ? 'Lus'
                      : 'Répondus'}
              </button>
            ))}
          </div>

          <input
            type="search"
            className="admin-search"
            placeholder="Rechercher nom, email, sujet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="admin-messages-layout">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-empty">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              {messages.length === 0 ? 'Aucun message reçu.' : 'Aucun résultat avec ces filtres.'}
            </div>
          ) : (
            <ul className="admin-message-list">
              {filtered.map(m => (
                <li
                  key={m.id}
                  className={`admin-message-row admin-message-${m.status} ${selected?.id === m.id ? 'is-selected' : ''}`}
                >
                  <button type="button" className="admin-message-trigger" onClick={() => openMessage(m)}>
                    <div className="admin-message-row-head">
                      <span className="admin-message-name">{m.name}</span>
                      <span className={`admin-message-status admin-message-status-${m.status}`}>
                        {statusLabel(m.status)}
                      </span>
                    </div>
                    <div className="admin-message-row-meta">
                      <span>{m.email}</span>
                      <span>{formatDate(m.created_at)}</span>
                    </div>
                    <div className="admin-message-row-subject">{m.subject || '(sans sujet)'}</div>
                    <div className="admin-message-row-snippet">{m.message.slice(0, 140)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="admin-message-panel">
          {selected ? (
            <>
              <header className="admin-message-panel-head">
                <div>
                  <span className={`admin-message-status admin-message-status-${selected.status}`}>
                    {statusLabel(selected.status)}
                  </span>
                  <h3>{selected.subject || '(sans sujet)'}</h3>
                  <p>
                    De <strong>{selected.name}</strong> &nbsp;·&nbsp;{' '}
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </p>
                  <p className="admin-message-panel-date">
                    Reçu le {formatDate(selected.created_at)}
                    {selected.replied_at && (
                      <>
                        {' · Répondu le '}
                        {formatDate(selected.replied_at)}
                        {selected.replied_by ? ` par ${selected.replied_by}` : ''}
                      </>
                    )}
                  </p>
                </div>
              </header>

              <div className="admin-message-panel-body">{selected.message}</div>

              {canReply ? (
                <>
                  <div className="admin-reply-block">
                    <label className="admin-reply-label" htmlFor="admin-reply-textarea">
                      Ta réponse
                    </label>
                    <textarea
                      id="admin-reply-textarea"
                      className="admin-reply-textarea"
                      rows={6}
                      value={replyDraft}
                      onChange={e => setReplyDraft(e.target.value)}
                      placeholder="Tape ta réponse ici. Tu pourras ensuite l'envoyer via Gmail ou ton client mail, et garder une trace dans la base."
                    />
                  </div>

                  <div className="admin-message-panel-actions">
                    <button
                      type="button"
                      className="admin-export"
                      onClick={() => {
                        openInGmail();
                        void saveReply(true);
                      }}
                      disabled={savingReply || !replyDraft.trim()}
                    >
                      Envoyer via Gmail
                    </button>
                    <button
                      type="button"
                      className="admin-segment-btn"
                      onClick={() => {
                        openInMailClient();
                        void saveReply(true);
                      }}
                      disabled={savingReply || !replyDraft.trim()}
                    >
                      Envoyer via client mail
                    </button>
                    <button
                      type="button"
                      className="admin-segment-btn"
                      onClick={() => void saveReply(false)}
                      disabled={savingReply}
                    >
                      Sauvegarder le brouillon
                    </button>
                    {selected.status !== 'replied' && (
                      <button
                        type="button"
                        className="admin-segment-btn"
                        onClick={() => void saveReply(true)}
                        disabled={savingReply}
                      >
                        Marquer comme répondu
                      </button>
                    )}
                    {selected.status !== 'new' && (
                      <button
                        type="button"
                        className="admin-segment-btn"
                        onClick={() => void updateStatus(selected.id, 'new')}
                      >
                        Remettre en non lu
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="admin-reply-block">
                  <p className="admin-reply-locked">
                    Tu n&apos;as pas la permission de répondre aux messages. Demande à l&apos;admin
                    d&apos;activer le droit « répondre aux messages ».
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="admin-empty">Sélectionne un message pour le lire.</div>
          )}
        </aside>
      </section>
    </>
  );
}
