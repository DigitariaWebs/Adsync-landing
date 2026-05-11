-- Tracking du code parrain sur la table waitlist
-- A executer dans Supabase SQL editor du projet AdSync.

alter table public.waitlist
  add column if not exists referral_code text;

create index if not exists waitlist_referral_code_idx on public.waitlist (referral_code);
