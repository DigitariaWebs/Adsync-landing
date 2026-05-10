-- Programme Partenaires AdSync
-- Cree les tables partners (parrains) + referrals (filleuls inscrits via un code).
-- A executer dans Supabase SQL editor du projet AdSync.

-- ============================================================
-- TABLE partners
-- Un partenaire est lie a un compte auth.users (pour le dashboard).
-- ============================================================
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  main_network text,
  audience_size text,
  profile_url text,
  referral_code text not null unique
);

create index if not exists partners_referral_code_idx on public.partners (referral_code);
create index if not exists partners_user_id_idx on public.partners (user_id);
create index if not exists partners_email_idx on public.partners (email);

alter table public.partners enable row level security;

-- Insertion publique (lors de la creation du compte parrain depuis la landing)
drop policy if exists "Public can insert partners" on public.partners;
create policy "Public can insert partners"
  on public.partners
  for insert
  to anon, authenticated
  with check (true);

-- Le partenaire connecte peut lire son propre profil
drop policy if exists "Partner can read own profile" on public.partners;
create policy "Partner can read own profile"
  on public.partners
  for select
  to authenticated
  using (user_id = auth.uid());

-- Lecture publique du code parrain pour resolution depuis l'URL
-- (necessaire pour resolver ?ref=AS-XXXX cote landing)
drop policy if exists "Public can resolve referral code" on public.partners;
create policy "Public can resolve referral code"
  on public.partners
  for select
  to anon, authenticated
  using (true);

-- Le partenaire peut mettre a jour son propre profil
drop policy if exists "Partner can update own profile" on public.partners;
create policy "Partner can update own profile"
  on public.partners
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- TABLE referrals
-- Un filleul = une inscription (waitlist ou direct) liee a un parrain.
-- ============================================================
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  referral_code text not null,
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  role text check (role in ('createur','marque','autre')),
  status text not null default 'pending' check (status in ('pending','active','first_contract','second_contract')),
  first_contract_at timestamptz,
  second_contract_at timestamptz,
  commission_amount numeric(10,2)
);

create index if not exists referrals_partner_id_idx on public.referrals (partner_id);
create index if not exists referrals_code_idx on public.referrals (referral_code);
create index if not exists referrals_created_at_idx on public.referrals (created_at desc);

alter table public.referrals enable row level security;

-- Insertion publique (un filleul s'inscrit via un lien)
drop policy if exists "Public can insert referrals" on public.referrals;
create policy "Public can insert referrals"
  on public.referrals
  for insert
  to anon, authenticated
  with check (true);

-- Le partenaire connecte peut lire ses propres filleuls
drop policy if exists "Partner can read own referrals" on public.referrals;
create policy "Partner can read own referrals"
  on public.referrals
  for select
  to authenticated
  using (
    partner_id in (
      select id from public.partners where user_id = auth.uid()
    )
  );

-- ============================================================
-- VUE: agrégats par partenaire (pratique pour le dashboard)
-- ============================================================
create or replace view public.partner_stats as
select
  p.id as partner_id,
  p.user_id,
  p.referral_code,
  count(r.id) as total_referrals,
  count(r.id) filter (where r.status in ('first_contract','second_contract')) as referrals_with_contract,
  count(r.id) filter (where r.status = 'second_contract') as referrals_paid,
  coalesce(sum(r.commission_amount) filter (where r.status = 'second_contract'), 0) as total_commission
from public.partners p
left join public.referrals r on r.partner_id = p.id
group by p.id, p.user_id, p.referral_code;
