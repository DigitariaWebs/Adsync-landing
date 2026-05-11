-- Correction : la fonction is_app_admin() avait l'email admin code en dur
-- sur l'ancienne valeur. Cette migration la met a jour avec le bon email.
-- A executer dans le SQL Editor du projet Supabase AdSync.
--
-- IMPORTANT : remplace contact@adsynchro.com ci-dessous par l'email
-- avec lequel tu te connectes a /admin (doit correspondre a VITE_ADMIN_EMAIL
-- defini dans les variables d'environnement Vercel).

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = lower('contact@adsynchro.com'),
    false
  );
$$;

grant execute on function public.is_app_admin() to anon, authenticated;
