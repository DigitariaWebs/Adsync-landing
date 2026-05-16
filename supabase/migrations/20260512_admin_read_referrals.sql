-- Permet a l'admin et a la team autorisee (can_view_waitlist) de lire
-- la table referrals depuis le dashboard /admin > Partenaires.
-- A executer dans Supabase SQL editor.

drop policy if exists "Admin reads all referrals" on public.referrals;
create policy "Admin reads all referrals"
  on public.referrals
  for select
  to authenticated
  using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_view_waitlist = true
    )
  );
