-- AdSync : invitations d'equipe pre-remplies par l'admin.
-- L'admin invite un email avec des permissions pre-cochees, le manager
-- s'inscrit ensuite a /admin avec ce meme email et recupere automatiquement
-- ses droits a la connexion.
--
-- A executer dans le SQL Editor du projet Supabase AdSync APRES la migration
-- 20260505_team_audit.sql. Idempotent.

-- =====================================================
-- 1. Table team_invites
-- =====================================================

create table if not exists public.team_invites (
  email text primary key,
  can_view_waitlist boolean not null default false,
  can_edit_waitlist boolean not null default false,
  can_view_messages boolean not null default false,
  can_reply_messages boolean not null default false,
  invited_by text,
  created_at timestamptz not null default now()
);

alter table public.team_invites enable row level security;

drop policy if exists "Admin reads invites" on public.team_invites;
create policy "Admin reads invites" on public.team_invites
  for select to authenticated using (public.is_app_admin());

drop policy if exists "Admin writes invites" on public.team_invites;
create policy "Admin writes invites" on public.team_invites
  for insert to authenticated with check (public.is_app_admin());

drop policy if exists "Admin updates invites" on public.team_invites;
create policy "Admin updates invites" on public.team_invites
  for update to authenticated using (public.is_app_admin())
  with check (public.is_app_admin());

drop policy if exists "Admin deletes invites" on public.team_invites;
create policy "Admin deletes invites" on public.team_invites
  for delete to authenticated using (public.is_app_admin());

-- =====================================================
-- 2. Trigger : a chaque signup, copie les perms depuis team_invites si presentes
-- =====================================================

create or replace function public.handle_new_user_perms()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.team_invites%rowtype;
begin
  select * into v_invite
  from public.team_invites
  where lower(email) = lower(new.email);

  if found then
    insert into public.user_permissions (
      user_id, email,
      can_view_waitlist, can_edit_waitlist,
      can_view_messages, can_reply_messages,
      is_active
    ) values (
      new.id, new.email,
      v_invite.can_view_waitlist, v_invite.can_edit_waitlist,
      v_invite.can_view_messages, v_invite.can_reply_messages,
      true
    )
    on conflict (user_id) do update set
      can_view_waitlist  = excluded.can_view_waitlist,
      can_edit_waitlist  = excluded.can_edit_waitlist,
      can_view_messages  = excluded.can_view_messages,
      can_reply_messages = excluded.can_reply_messages,
      is_active          = true,
      updated_at         = now();

    delete from public.team_invites where lower(email) = lower(new.email);
  else
    insert into public.user_permissions (user_id, email)
    values (new.id, new.email)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

-- (le trigger on_auth_user_created_perms est deja cree par 20260505_team_audit.sql)
