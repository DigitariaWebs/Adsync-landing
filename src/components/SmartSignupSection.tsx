import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

type RoleTab = 'createur' | 'marque';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Facebook',
  'Twitch',
  'X (Twitter)',
  'LinkedIn',
  'Snapchat',
  'Autre (Blog, Site web…)',
];

const AUDIENCE_BY_PLATFORM: Record<string, string[]> = {
  Instagram: ['Moins de 1 000', '1 000 à 10 000', '10 000 à 100 000', '100 000 à 500 000', 'Plus de 500 000'],
  TikTok: ['Moins de 5 000', '5 000 à 50 000', '50 000 à 500 000', '500 000 à 2 M', 'Plus de 2 M'],
  YouTube: ['Moins de 1 000 abonnés', '1 000 à 10 000', '10 000 à 100 000', '100 000 à 1 M', 'Plus de 1 M'],
  Facebook: ['Moins de 1 000 fans', '1 000 à 10 000', '10 000 à 100 000', '100 000 à 500 000', 'Plus de 500 000'],
  Twitch: ['Moins de 100 followers', '100 à 1 000', '1 000 à 10 000', '10 000 à 100 000', 'Plus de 100 000'],
  'X (Twitter)': ['Moins de 1 000', '1 000 à 10 000', '10 000 à 100 000', '100 000 à 1 M', 'Plus de 1 M'],
  LinkedIn: ['Moins de 500 relations', '500 à 5 000', '5 000 à 30 000', '30 000 à 100 000', 'Plus de 100 000'],
  Snapchat: ['Moins de 1 000', '1 000 à 10 000', '10 000 à 100 000', '100 000 à 1 M', 'Plus de 1 M'],
  'Autre (Blog, Site web…)': [
    'Moins de 500 visites/mois',
    '500 à 5 000 visites/mois',
    '5 000 à 50 000 visites/mois',
    '50 000 à 500 000 visites/mois',
    'Plus de 500 000 visites/mois',
  ],
};

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
  // Europe francophone
  'France',
  'Belgique',
  'Suisse',
  'Luxembourg',
  'Monaco',
  // Amérique du Nord
  'Canada',
  'États-Unis',
  'Haïti',
  // Afrique de l'Ouest
  'Côte d’Ivoire',
  'Sénégal',
  'Mali',
  'Burkina Faso',
  'Bénin',
  'Togo',
  'Niger',
  'Guinée',
  'Mauritanie',
  // Afrique Centrale
  'Cameroun',
  'Gabon',
  'Tchad',
  'Centrafrique',
  'Congo-Brazzaville',
  'RD Congo',
  // Afrique du Nord
  'Maroc',
  'Algérie',
  'Tunisie',
  'Égypte',
  'Libye',
  // Afrique Australe et Est
  'Madagascar',
  'Maurice',
  'Comores',
  'Djibouti',
  'Rwanda',
  'Burundi',
  'Afrique du Sud',
  'Kenya',
  'Tanzanie',
  'Nigeria',
  'Ghana',
  // Europe (autre)
  'Allemagne',
  'Royaume-Uni',
  'Espagne',
  'Italie',
  'Portugal',
  'Pays-Bas',
  'Pologne',
  // Moyen-Orient et Asie
  'Émirats arabes unis',
  'Arabie saoudite',
  'Liban',
  'Turquie',
  'Inde',
  'Vietnam',
  'Thaïlande',
  // Amérique du Sud / Caraïbes
  'Brésil',
  'Mexique',
  'Argentine',
  'Guadeloupe',
  'Martinique',
  'Guyane française',
  'La Réunion',
  // Océanie
  'Australie',
  'Nouvelle-Calédonie',
  'Polynésie française',
  // Catch-all
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
  'Autre',
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
  'Autre (Blog, Site web…)': 'URL de ton blog ou site (ex : https://monblog.fr)',
};

type PlatformEntry = { handle: string; audience: string };

export default function SmartSignupSection() {
  const [role, setRole] = useState<RoleTab>('createur');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [creatorHandles, setCreatorHandles] = useState<Record<string, PlatformEntry>>({});
  const [countryChoice, setCountryChoice] = useState<string>('');
  const [countryOther, setCountryOther] = useState<string>('');
  const [budgetChoice, setBudgetChoice] = useState<string>('');
  const [budgetOther, setBudgetOther] = useState<string>('');

  const togglePlatform = (p: string) => {
    setCreatorHandles(prev => {
      if (p in prev) {
        const next = { ...prev };
        delete next[p];
        return next;
      }
      return { ...prev, [p]: { handle: '', audience: '' } };
    });
  };

  const updateHandle = (p: string, value: string) => {
    setCreatorHandles(prev => ({ ...prev, [p]: { ...prev[p], handle: value } }));
  };

  const updateAudience = (p: string, value: string) => {
    setCreatorHandles(prev => ({ ...prev, [p]: { ...prev[p], audience: value } }));
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
      const missingHandle = entries.find(([, v]) => !v.handle.trim());
      if (missingHandle) {
        setStatus('error');
        setErrorMsg(`Renseigne ton identifiant ${missingHandle[0]}.`);
        return;
      }
      const missingAudience = entries.find(([, v]) => !v.audience);
      if (missingAudience) {
        setStatus('error');
        setErrorMsg(`Sélectionne une fourchette d'audience pour ${missingAudience[0]}.`);
        return;
      }
      platform = entries
        .map(([p, v]) => `• ${p} — ${v.handle.trim()} (${v.audience})`)
        .join('\n');
      audienceSize = entries.map(([p, v]) => `${p}: ${v.audience}`).join(' | ');
      category = String(formData.get('category') ?? '').trim() || null;
      if (countryChoice === 'Autre') {
        const custom = countryOther.trim();
        if (!custom) {
          setStatus('error');
          setErrorMsg('Précise ton pays.');
          return;
        }
        country = `Autre — ${custom}`;
      } else {
        country = countryChoice || null;
      }
    } else {
      platform = String(formData.get('website') ?? '').trim() || null;
      category = String(formData.get('sector') ?? '').trim() || null;
      if (budgetChoice === 'Autre') {
        const customBudget = budgetOther.trim();
        if (!customBudget) {
          setStatus('error');
          setErrorMsg('Précise ton budget.');
          return;
        }
        audienceSize = `Autre — ${customBudget}`;
      } else {
        audienceSize = budgetChoice || null;
      }
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
    setCountryChoice('');
    setCountryOther('');
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
                  <span>Tes plateformes, identifiants et audiences</span>
                  <div className="smart-platforms">
                    {PLATFORMS.map(p => {
                      const selected = p in creatorHandles;
                      const audiences = AUDIENCE_BY_PLATFORM[p] ?? [];
                      return (
                        <div
                          key={p}
                          className={`smart-platform ${selected ? 'is-selected' : ''}`}
                          data-platform={p}
                        >
                          <label className="smart-platform-toggle">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => togglePlatform(p)}
                            />
                            <span>{p}</span>
                          </label>
                          {selected && (
                            <div className="smart-platform-fields">
                              <input
                                type="text"
                                className="smart-platform-handle"
                                value={creatorHandles[p].handle}
                                onChange={e => updateHandle(p, e.target.value)}
                                placeholder={HANDLE_PLACEHOLDERS[p] ?? '@ton_pseudo'}
                                aria-label={`Identifiant ${p}`}
                              />
                              <select
                                className="smart-platform-audience"
                                value={creatorHandles[p].audience}
                                onChange={e => updateAudience(p, e.target.value)}
                                aria-label={`Fourchette d'audience ${p}`}
                              >
                                <option value="" disabled>Fourchette d&apos;audience…</option>
                                {audiences.map(a => (
                                  <option key={a} value={a}>{a}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="smart-platforms-hint">
                    Coche toutes les plateformes où tu es actif. Pour chacune, renseigne ton
                    identifiant et la fourchette d&apos;audience correspondante (chaque plateforme a
                    sa propre échelle).
                  </p>
                </div>
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
                  <select
                    name="country"
                    value={countryChoice}
                    onChange={e => setCountryChoice(e.target.value)}
                  >
                    <option value="" disabled>Sélectionne ton pays</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {countryChoice === 'Autre' && (
                    <input
                      type="text"
                      className="smart-country-other"
                      value={countryOther}
                      onChange={e => setCountryOther(e.target.value)}
                      placeholder="Précise ton pays (ex : Suriname)"
                      aria-label="Pays personnalisé"
                      style={{ marginTop: 8 }}
                    />
                  )}
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
                  <select
                    name="budget"
                    value={budgetChoice}
                    onChange={e => setBudgetChoice(e.target.value)}
                  >
                    <option value="" disabled>Sélectionne un budget</option>
                    {BUDGETS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {budgetChoice === 'Autre' && (
                    <input
                      type="text"
                      className="smart-country-other"
                      value={budgetOther}
                      onChange={e => setBudgetOther(e.target.value)}
                      placeholder="Précise ton budget (ex : 750 €)"
                      aria-label="Budget personnalisé"
                      style={{ marginTop: 8 }}
                    />
                  )}
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
                ? 'L’IA AdSync.io (HUMAN ADTECH) analysera ton profil pour te proposer uniquement des marques compatibles avec ton audience. Tu gardes le dernier mot sur chaque contrat.'
                : 'L’IA Advisor te recommandera les meilleurs créateurs, formats publicitaires et budgets selon ton secteur. Tu uploades ta pub, on s’occupe du reste.'}
            </div>

            <div className="smart-signup-actions">
              <p>Paiements sécurisés par Stripe, Mobile Money et virement.</p>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Envoi...' : 'Réserver mon accès'}
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
