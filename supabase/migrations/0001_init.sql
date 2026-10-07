-- Profissionais da barbearia
create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  whatsapp_number text not null,   -- número que recebe a confirmação, formato 55DDDNÚMERO (só dígitos)
  start_time time not null default '09:00',
  end_time time not null default '19:00',
  slot_minutes int not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Agendamentos
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references public.barbers(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'pendente' check (status in ('pendente', 'confirmado', 'cancelado', 'concluido')),
  created_at timestamptz not null default now(),
  unique (barber_id, appointment_date, appointment_time)
);

create index if not exists idx_appointments_barber_date
  on public.appointments(barber_id, appointment_date);

-- RLS
alter table public.barbers enable row level security;
alter table public.appointments enable row level security;

create policy "Qualquer um pode ver os barbeiros ativos" on public.barbers
  for select using (active = true);

create policy "Qualquer um pode criar um agendamento" on public.appointments
  for insert with check (status = 'pendente');

-- A agenda interna (ver todos os agendamentos) por enquanto fica aberta
-- para simplificar o MVP. Antes de ir pra produção, troque para
-- "using (auth.role() = 'authenticated')" e adicione login para os barbeiros.
create policy "Leitura da agenda" on public.appointments
  for select using (true);

create policy "Atualizar status do agendamento" on public.appointments
  for update using (true);

-- Função segura que só devolve os horários já ocupados de um barbeiro num dia,
-- sem expor nome/telefone de clientes. Usada na tela pública de agendamento.
create or replace function public.get_booked_times(p_barber_id uuid, p_date date)
returns table (appointment_time time)
language sql
security definer
set search_path = public
as $$
  select appointment_time
  from public.appointments
  where barber_id = p_barber_id
    and appointment_date = p_date
    and status <> 'cancelado';
$$;

grant execute on function public.get_booked_times(uuid, date) to anon, authenticated;

-- Barbeiros de exemplo — edite o número de WhatsApp de cada um antes de usar
insert into public.barbers (name, whatsapp_number, start_time, end_time, slot_minutes)
values
  ('Carlos', '5511999990001', '09:00', '19:00', 30),
  ('Diego', '5511999990002', '09:00', '19:00', 30),
  ('Bruno', '5511999990003', '10:00', '20:00', 45)
on conflict do nothing;
