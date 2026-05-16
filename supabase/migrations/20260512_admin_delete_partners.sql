-- Permet a l'admin (et a la team can_edit_waitlist) de supprimer des
-- partenaires depuis le dashboard /admin > Partenaires.
-- La cascade ON DELETE sur referrals.partner_id supprime aussi les filleuls.
-- Le compte auth.users associe reste (user_id devient null sur partners
-- mais ici on supprime la ligne partners entiere).
--
-- A executer dans Supabase SQL editor. Idempotent.

drop policy if exists "Admin deletes partners" on public.partners;
create policy "Admin deletes partners"
  on public.partners
  for delete
  to authenticated
  using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_edit_waitlist = true
    )
  );
