-- Lie automatiquement partners.user_id a auth.users.id par email.
-- Necessaire car la confirmation email Supabase peut casser le lien initial
-- (le user_id retourne par signUp peut etre invalide tant que le user n'est
-- pas confirme). Avec ce trigger, des qu'un user est cree OU confirme dans
-- auth.users, on met a jour la ligne partners correspondante via email.

create or replace function public.link_partner_to_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.partners
    set user_id = new.id
    where lower(email) = lower(new.email)
      and (user_id is null or user_id <> new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_link_partner on auth.users;
create trigger on_auth_user_created_link_partner
  after insert on auth.users
  for each row execute function public.link_partner_to_auth_user();

drop trigger if exists on_auth_user_updated_link_partner on auth.users;
create trigger on_auth_user_updated_link_partner
  after update of email_confirmed_at on auth.users
  for each row execute function public.link_partner_to_auth_user();
