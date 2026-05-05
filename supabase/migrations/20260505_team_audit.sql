-- AdSync : permissions par utilisateur, audit log, et reply sur messages.
-- A executer dans le SQL Editor du projet Supabase AdSync.
-- Idempotent : peut etre relance sans casser.

-- =====================================================
-- 1. Champs reply pour la table messages
-- =====================================================

alter table public.messages
  add column if not exists reply text,
  add column if not exists replied_at timestamptz,
  add column if not exists replied_by text;

-- =====================================================
-- 2. Helper : verifier si l'utilisateur connecte est admin principal
-- =====================================================

-- IMPORTANT : remplace l'email ci-dessous par celui de l'admin principal
-- (doit correspondre a VITE_ADMIN_EMAIL dans .env).
create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = lower('yedidiambengalikita13@gmail.com'),
    false
  );
$$;

grant execute on function public.is_app_admin() to anon, authenticated;

-- =====================================================
-- 3. Table user_permissions
-- =====================================================

create table if not exists public.user_permissions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  can_view_waitlist boolean not null default false,
  can_edit_waitlist boolean not null default false,
  can_view_messages boolean not null default false,
  can_reply_messages boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_permissions_email_idx on public.user_permissions (email);

alter table public.user_permissions enable row level security;

drop policy if exists "Read own perms" on public.user_permissions;
create policy "Read own perms" on public.user_permissions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Admin reads all perms" on public.user_permissions;
create policy "Admin reads all perms" on public.user_permissions
  for select to authenticated using (public.is_app_admin());

drop policy if exists "Admin updates perms" on public.user_permissions;
create policy "Admin updates perms" on public.user_permissions
  for update to authenticated using (public.is_app_admin())
  with check (public.is_app_admin());

drop policy if exists "Admin inserts perms" on public.user_permissions;
create policy "Admin inserts perms" on public.user_permissions
  for insert to authenticated with check (public.is_app_admin());

-- Auto-creation d'une ligne user_permissions a chaque signup
create or replace function public.handle_new_user_perms()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_permissions (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_perms on auth.users;
create trigger on_auth_user_created_perms
  after insert on auth.users
  for each row execute function public.handle_new_user_perms();

-- =====================================================
-- 4. Table audit_log
-- =====================================================

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  action text not null,
  target_type text,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);
create index if not exists audit_log_user_idx on public.audit_log (user_id);

alter table public.audit_log enable row level security;

drop policy if exists "Authenticated insert log" on public.audit_log;
create policy "Authenticated insert log" on public.audit_log
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Admin reads log" on public.audit_log;
create policy "Admin reads log" on public.audit_log
  for select to authenticated using (public.is_app_admin());

-- =====================================================
-- 5. RLS waitlist : admin OU manager autorise
-- =====================================================

-- on commence par s'assurer que la table existe et a RLS
alter table public.waitlist enable row level security;

drop policy if exists "Authorized read waitlist" on public.waitlist;
create policy "Authorized read waitlist" on public.waitlist
  for select to authenticated using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_view_waitlist = true
    )
  );

drop policy if exists "Authorized write waitlist" on public.waitlist;
create policy "Authorized write waitlist" on public.waitlist
  for update to authenticated using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_edit_waitlist = true
    )
  );

drop policy if exists "Authorized delete waitlist" on public.waitlist;
create policy "Authorized delete waitlist" on public.waitlist
  for delete to authenticated using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_edit_waitlist = true
    )
  );

-- (l'insert public reste accessible aux anonymes, defini dans la migration originale)

-- =====================================================
-- 6. RLS messages : admin OU manager autorise
-- =====================================================

drop policy if exists "Admins can read messages" on public.messages;
drop policy if exists "Admins can update messages" on public.messages;

create policy "Authorized read messages" on public.messages
  for select to authenticated using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_view_messages = true
    )
  );

create policy "Authorized update messages" on public.messages
  for update to authenticated using (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_reply_messages = true
    )
  )
  with check (
    public.is_app_admin() or exists (
      select 1 from public.user_permissions
      where user_id = auth.uid()
        and is_active = true
        and can_reply_messages = true
    )
  );
