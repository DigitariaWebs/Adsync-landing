-- Fix : ne creer une ligne user_permissions QUE pour les membres de l'equipe
-- (admin principal ou invitation team_invites existante), pas pour les
-- partenaires qui s'inscrivent via le programme partenaire ni pour aucun
-- autre user "public".
--
-- A executer dans Supabase SQL editor. Idempotent.

-- 1. Trigger corrige : pas de creation auto pour les non-invites.
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
  end if;

  -- Si l'email n'est pas dans team_invites : on ne cree PAS de ligne
  -- user_permissions. Les partenaires et autres users restent en dehors
  -- de la team admin.

  return new;
end;
$$;

-- 2. Nettoyage : supprime les lignes user_permissions creees a tort
-- (toutes permissions a false, donc non assignees par l'admin).
-- Garde l'admin principal meme si sa ligne est vide.
delete from public.user_permissions
where can_view_waitlist = false
  and can_edit_waitlist = false
  and can_view_messages = false
  and can_reply_messages = false
  and lower(email) <> 'contact@adsynchro.com';
