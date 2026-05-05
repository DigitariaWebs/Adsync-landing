-- Messages publics envoyes via le formulaire de contact du site.
-- A executer dans Supabase SQL editor du projet AdSync.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied'))
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_status_idx on public.messages (status);

alter table public.messages enable row level security;

-- Tout visiteur peut envoyer un message (insert anonyme)
drop policy if exists "Public can insert messages" on public.messages;
create policy "Public can insert messages"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

-- Seuls les admins authentifies peuvent lire les messages
drop policy if exists "Admins can read messages" on public.messages;
create policy "Admins can read messages"
  on public.messages
  for select
  to authenticated
  using (true);

-- Et les mettre a jour (mark as read / replied)
drop policy if exists "Admins can update messages" on public.messages;
create policy "Admins can update messages"
  on public.messages
  for update
  to authenticated
  using (true)
  with check (true);
