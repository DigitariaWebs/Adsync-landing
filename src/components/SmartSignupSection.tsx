import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

type RoleTab = 'createur' | 'marque';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitch', 'X (Twitter)', 'LinkedIn', 'Snapchat'];

const AUDIENCE_SIZES = [
  'Moins de 5 000',
  '5 000 à 50 000',
  '50 000 à 250 000',
  '250 000 à 1 M',
  'Plus de 1 M',
];

const CREATOR_CATEGORIES = [
  'Lifestyle',
  'Mode et beauté',
  'Tech et gaming',
  'Business et finance',
  'Cuisine et food',
  'Sport et fitness',
  'Voyage',
  'Musique',
  'Éducation',
  'Humour et divertissement',
  'Famille et parentalité',
  'Autre',
];

const COUNTRIES = [
  'France',
  'Belgique',
  'Suisse',
  'Canada',
  'Côte d’Ivoire',
  'Sénégal',
  'Cameroun',
  'Maroc',
  'Algérie',
  'Tunisie',
  'RD Congo',
  'Bénin',
  'Togo',
  'Mali',
  'Burkina Faso',
  'Autre',
];

const BRAND_SECTORS = [
  'Mode et beauté',
  'Tech et logiciel',
  'Finance et fintech',
  'Food et restauration',
  'Santé et bien-être',
  'Voyage et hôtellerie',
  'Éducation',
  'Automobile',
  'Immobilier',
  'E-commerce',
  'Divertissement',
  'Autre',
];

const BUDGETS = [
  'Moins de 500 €',
  '500 à 2 000 €',
  '2 000 à 10 000 €',
  '10 000 à 50 000 €',
  'Plus de 50 000 €',
];

const OBJECTIVES = [
  'Notoriété de marque',
  'Acquisition clients',
  'Conversions et ventes',
  'Lancement de produit',
  'Téléchargements d’app',
  'Trafic site web',
];

const HANDLE_PLACEHOLDERS: Record<string, string> = {
  Instagram: '@ton_pseudo (ex : @aicha.studio)',
  TikTok: '@ton_pseudo (ex : @aicha.studio)',
  YouTube: 'Nom de la chaîne ou @handle',
  Facebook: 'Nom de la page ou URL',
  Twitch: 'Pseudo Twitch',
  'X (Twitter)': '@ton_pseudo',
  LinkedIn: 'URL de ton profil',
  Snapchat: '@ton_pseudo',
};

export default function SmartSignupSection() {
  const [role, setRole] = useState<RoleTab>('createur');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [creatorHandles, setCreatorHandles] = useState<Record<string, string>>({});

  const togglePlatform = (p: string) => {
    setCreatorHandles(prev => {
      if (p in prev) {
        const next = { ...prev };
        delete next[p];
        return next;
      }
      return { ...prev, [p]: '' };
    });
  };

  const updateHandle = (p: string, value: string) => {
    setCreatorHandles(prev => ({ ...prev, [p]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();

    let platform: string | null = null;
    let category: string | null = null;
    let country: string | null = null;
    let audienceSize: string | null = null;

    if (role === 'createur') {
      const entries = Object.entries(creatorHandles);
      if (entries.length === 0) {
        setStatus('error');
        setErrorMsg('Sélectionne au moins une plateforme.');
        return;
      }
      const missing = entries.find(([, h]) => !h.trim());
      if (missing) {
        setStatus('error');
        setErrorMsg(`Renseigne ton identifiant ${missing[0]}.`);
        return;
      }
      platform = entries.map(([p, h]) => `${p} : ${h.trim()}`).join('\n');
      audienceSize = String(formData.get('audience_size') ?? '').trim() || null;
      category = String(formData.get('category') ?? '').trim() || null;
      country = String(formData.get('country') ?? '').trim() || null;
    } else {
      platform = String(formData.get('website') ?? '').trim() || null;
      category = String(formData.get('sector') ?? '').trim() || null;
      audienceSize = String(formData.get('budget') ?? '').trim() || null;
      country = String(formData.get('objective') ?? '').trim() || null;
    }

    if (!name || !email) {
      setStatus('error');
      setErrorMsg('Nom et email sont requis.');
      return;
    }

    const { error } = await supabase.from('waitlist').insert({
      role,
      name,
      email,
      platform,
      category,
      country,
      audience_size: audienceSize,
    });

    if (error) {
      setStatus('error');
      if (error.code === '23505') {
        setErrorMsg('Cet email est déjà inscrit sur la liste d’attente.');
      } else {
        setErrorMsg(error.message || 'Une erreur est survenue. Réessaie.');
      }
      return;
    }

    setStatus('success');
    (event.target as HTMLFormElement).reset();
    setCreatorHandles({});
  };

  const submitting = status === 'submitting';

  return (
    <section className="smart-signup-section" id="inscription">
      <div className="smart-signup-shell">
        <header className="smart-signup-head">
          <span className="smart-signup-kicker">Inscription intelligente</span>
          <h2>
            Choisis ton rôle.
            <br />
            <strong>L&apos;IA fait le reste.</strong>
          </h2>
          <p>
            Le formulaire s&apos;adapte automatiquement à ton profil. Deux portes d&apos;entrée, une
            seule plateforme. Inscription gratuite, accès au lancement du 21 juin 2026.
          </p>
        </header>

        <div className="smart-signup-panel">
          <div className="smart-signup-tabs" role="tablist" aria-label="Choix du rôle">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'createur'}
              className={`smart-signup-tab ${role === 'createur' ? 'is-active' : ''}`}
              onClick={() => { setRole('createur'); setCreatorHandles({}); setStatus('idle'); }}
            >
              <span className="smart-signup-tab-title">Je suis Créateur</span>
              <span className="smart-signup-tab-sub">Je monétise mon audience · 75 % par contrat</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'marque'}
              className={`smart-signup-tab ${role === 'marque' ? 'is-active' : ''}`}
              onClick={() => { setRole('marque'); setCreatorHandles({}); setStatus('idle'); }}
            >
              <span className="smart-signup-tab-title">Je suis une Marque</span>
              <span className="smart-signup-tab-sub">Je lance des campagnes ciblées par l&apos;IA</span>
            </button>
          </div>

          <form className="smart-signup-form" onSubmit={handleSubmit} key={role}>
            {role === 'createur' ? (
              <div className="smart-signup-grid">
                <label className="smart-field">
                  <span>Ton nom complet</span>
                  <input type="text" name="name" required placeholder="Ex : Aïcha Diallo" />
                </label>
                <label className="smart-field">
                  <span>Email perso</span>
                  <input type="email" name="email" required placeholder="contact@email.com" />
                </label>
                <div className="smart-field smart-field-full">
                  <span>Tes plateformes et identifiants</span>
                  <div className="smart-platforms">
                    {PLATFORMS.map(p => {
                      const selected = p in creatorHandles;
                      return (
                        <div key={p} className={`smart-platform ${selected ? 'is-selected' : ''}`}>
                          <label className="smart-platform-toggle">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => togglePlatform(p)}
                            />
                            <span>{p}</span>
                          </label>
                          {selected && (
                            <input
                              type="text"
                              className="smart-platform-handle"
                              value={creatorHandles[p]}
                              onChange={e => updateHandle(p, e.target.value)}
                              placeholder={HANDLE_PLACEHOLDERS[p] ?? '@ton_pseudo'}
                              aria-label={`Identifiant ${p}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="smart-platforms-hint">
                    Coche toutes les plateformes où tu es actif et renseigne ton identifiant pour
                    chacune. L&apos;IA proposera tes espaces aux marques alignées.
                  </p>
                </div>
                <label className="smart-field">
                  <span>Taille d&apos;audience</span>
                  <select name="audience_size" defaultValue="">
                    <option value="" disabled>Sélectionne une fourchette</option>
                    {AUDIENCE_SIZES.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <label className="smart-field">
                  <span>Catégorie de contenu</span>
                  <select name="category" defaultValue="">
                    <option value="" disabled>Choisis une catégorie</option>
                    {CREATOR_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="smart-field smart-field-full">
                  <span>Pays de résidence</span>
                  <select name="country" defaultValue="">
                    <option value="" disabled>Sélectionne ton pays</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <div className="smart-signup-grid">
                <label className="smart-field">
                  <span>Nom de la marque</span>
                  <input type="text" name="name" required placeholder="Ex : Nova Labs" />
                </label>
                <label className="smart-field">
                  <span>Email professionnel</span>
                  <input type="email" name="email" required placeholder="contact@marque.com" />
                </label>
                <label className="smart-field smart-field-full">
                  <span>Site web de la marque</span>
                  <input type="url" name="website" placeholder="https://marque.com" />
                </label>
                <label className="smart-field">
                  <span>Secteur d&apos;activité</span>
                  <select name="sector" defaultValue="">
                    <option value="" disabled>Choisis un secteur</option>
                    {BRAND_SECTORS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="smart-field">
                  <span>Budget par campagne</span>
                  <select name="budget" defaultValue="">
                    <option value="" disabled>Sélectionne un budget</option>
                    {BUDGETS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </label>
                <label className="smart-field smart-field-full">
                  <span>Objectif principal</span>
                  <select name="objective" defaultValue="">
                    <option value="" disabled>Choisis ton objectif</option>
                    {OBJECTIVES.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div className="smart-signup-note">
              {role === 'createur'
                ? 'L’IA AdSync analysera ton profil pour te proposer uniquement des marques compatibles avec ton audience. Tu gardes le dernier mot sur chaque contrat.'
                : 'L’IA Advisor te recommandera les meilleurs créateurs, formats publicitaires et budgets selon ton secteur. Tu uploades ta pub, on s’occupe du reste.'}
            </div>

            <div className="smart-signup-actions">
              <p>Paiements sécurisés par Stripe, Mobile Money et virement.</p>
              <button type="submit" disabled={submitting}>
                {submitting
                  ? 'Envoi...'
                  : role === 'marque'
                    ? 'Lancer ma marque'
                    : 'Réserver mon accès'}
              </button>
            </div>

            {status === 'success' && (
              <p className="smart-signup-feedback">
                Inscription confirmée. On te recontacte avant le lancement du 21 juin 2026.
              </p>
            )}
            {status === 'error' && (
              <p className="smart-signup-feedback smart-signup-feedback-error">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
