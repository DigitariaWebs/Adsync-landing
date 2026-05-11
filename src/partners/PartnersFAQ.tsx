import { useState } from 'react';

type FaqItem = { question: string; answer: string };

const faqs: FaqItem[] = [
  {
    question: "C'est vraiment gratuit ? Y a-t-il un coût caché ?",
    answer:
      "100 % gratuit. Aucun frais d'inscription, aucun abonnement, aucun engagement. Tu génères ton lien en 60 secondes et tu peux arrêter quand tu veux.",
  },
  {
    question: 'Pourquoi je touche 25 % seulement sur le 2ème contrat du filleul ?',
    answer:
      "Le 1er contrat est offert à ton filleul (créateur ou marque) : AdSync prend 0 % pour qu'il teste la plateforme sans risque. Sur son 2ème contrat, AdSync prend 25 % de commission, et te reverse 100 % de cette commission. C'est notre manière de récompenser les ambassadeurs qui amènent des utilisateurs qui restent.",
  },
  {
    question: 'Combien je peux gagner concrètement ?',
    answer:
      "Exemple : un filleul signe un 2ème contrat de 100 €. Le créateur reçoit 75 €, AdSync reçoit 25 €, et tu reçois 25 % de cette commission, soit 25 € (ou 6,25 € si la commission AdSync est de 6,25 € selon le montant). Aucun plafond : 10 filleuls actifs = 10 commissions, 100 filleuls = 100 commissions.",
  },
  {
    question: 'Pourquoi la date limite du 21 juin 2026 ?',
    answer:
      'Le programme partenaires est réservé à la phase de pré-lancement. Seules les personnes inscrites via ton lien AVANT le 21 juin 2026 sont rattachées à ton code. Après cette date, le programme évolue et les nouvelles inscriptions ne te seront plus attribuées.',
  },
  {
    question: 'Comment je suis sûr que mes filleuls sont bien comptabilisés ?',
    answer:
      "Chaque inscription via ton lien personnel (ex. adsync.io/?ref=AS-PRENOM1234) est trackée automatiquement et apparaît dans ton tableau de bord en temps réel : nom masqué, rôle, date d'inscription et statut des contrats.",
  },
  {
    question: 'Comment et quand je suis payé ?',
    answer:
      'Dès que ton filleul signe son 2ème contrat, ta commission est déclenchée et versée dans les 7 jours via Stripe, PayPal, virement SEPA ou Mobile Money (Orange Money, MTN MoMo, Wave, M-Pesa) selon ta région.',
  },
  {
    question: "Je n'ai pas une grosse audience. Je peux quand même être partenaire ?",
    answer:
      "Oui. Aucun minimum d'abonnés exigé. Tu peux être influenceur, streamer, blogueur, newsletter, communauté Discord, groupe WhatsApp, ou simplement quelqu'un qui partage à son réseau pro. Ce qui compte, c'est l'engagement, pas la taille.",
  },
  {
    question: 'Que se passe-t-il si mon filleul ne signe jamais de 2ème contrat ?',
    answer:
      "Tu ne touches rien sur lui, mais tu n'as rien perdu non plus. La commission est uniquement déclenchée par le 2ème contrat, qui est le signal qu'il est devenu un utilisateur actif.",
  },
  {
    question: 'Puis-je parrainer aussi bien des créateurs que des marques ?',
    answer:
      "Oui, ton lien fonctionne pour les deux. Que ton filleul s'inscrive comme créateur ou comme marque, dès qu'il signe son 2ème contrat, tu touches ta commission.",
  },
  {
    question: 'Est-ce que je peux retirer mon code ou mon compte ?',
    answer:
      'Oui, à tout moment depuis ton tableau de bord. Aucun engagement, aucune pénalité.',
  },
  {
    question: 'Aurai-je accès à une appli mobile pour suivre mes gains ?',
    answer:
      "Oui. Dès l'ouverture officielle le 21 juin 2026, ton tableau de bord partenaire sera disponible sur l'application mobile AdSync (iOS + Android), avec notifications push à chaque nouvelle inscription et chaque commission débloquée.",
  },
];

export default function PartnersFAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="partners-faq" id="faq-partenaires">
      <header className="partners-faq-head">
        <span className="eyebrow">FAQ Partenaires</span>
        <h2>
          Les réponses à tes
          <br />
          <em>questions.</em>
        </h2>
        <p>Tout ce qu&apos;il faut savoir avant de rejoindre le programme partenaires AdSync.io.</p>
      </header>

      <div className="partners-faq-list">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <article
              key={item.question}
              className={`partners-faq-item ${isOpen ? 'is-open' : ''}`}
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <div className="partners-faq-row">
                <h3>{item.question}</h3>
                <span className="partners-faq-plus" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </div>
              {isOpen && <p>{item.answer}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
