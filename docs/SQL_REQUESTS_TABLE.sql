-- ============================================================
-- Tabla requests: búsquedas y requests por usuario o email
-- Ejecutar en Supabase SQL Editor (o migración)
-- ============================================================

-- Asegúrate de que existe la tabla stores con id (uuid), domain, is_shopify.
-- Si no la tienes, créala antes.

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'done', 'failed', 'unsupported')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint requests_user_or_email check (
    user_id is not null or (email is not null and trim(email) != '')
  )
);

create index if not exists idx_requests_user_id on requests(user_id);
create index if not exists idx_requests_email on requests(email);
create index if not exists idx_requests_store_id on requests(store_id);
create index if not exists idx_requests_status on requests(status);
create index if not exists idx_requests_created_at on requests(created_at desc);

-- Actualizar updated_at en cada UPDATE
create or replace function set_requests_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists requests_updated_at on requests;
create trigger requests_updated_at
  before update on requests
  for each row execute function set_requests_updated_at();

-- RLS: usuarios solo ven/insertan sus propias filas (por user_id)
alter table requests enable row level security;

drop policy if exists "Users can read own requests" on requests;
create policy "Users can read own requests"
  on requests for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own requests" on requests;
create policy "Users can insert own requests"
  on requests for insert
  with check (auth.uid() = user_id or user_id is null);

-- El backend usa service_role y bypasea RLS; si algún cliente usa anon key, estas políticas aplican.
