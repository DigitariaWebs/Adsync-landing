-- Ajout de la ville, du pays propre et de l'objectif sur la table waitlist
-- A executer dans Supabase SQL editor du projet AdSync.

alter table public.waitlist
  add column if not exists city text,
  add column if not exists objective text;

-- Migration des donnees marques : la colonne country stockait jusqu'ici
-- l'objectif pour les marques. On la deplace vers la nouvelle colonne objective
-- puis on remet country a NULL pour ces lignes afin qu'elles puissent recevoir
-- un vrai pays a la prochaine inscription ou edition.
update public.waitlist
  set objective = country,
      country = null
  where role = 'marque'
    and objective is null
    and country is not null;
