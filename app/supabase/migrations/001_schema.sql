-- ============================================================
-- FacturePilot — Schéma de base de données
-- Mission 2 : Tables, relations, index
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extension de auth.users)
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  phone         text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.profiles is 'Profil étendu de l''utilisateur (extension de auth.users)';

-- Trigger : création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger : mise à jour du champ updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- COMPANIES (informations de l'entreprise de l'utilisateur)
-- ============================================================
create table if not exists public.companies (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  name                text not null,
  legal_form          text,               -- SAS, SARL, AE, EI...
  siret               text,
  vat_number          text,               -- Numéro TVA intracommunautaire
  address_line1       text,
  address_line2       text,
  postal_code         text,
  city                text,
  country             text not null default 'FR',
  email               text,
  phone               text,
  website             text,
  logo_url            text,
  -- Paramètres de facturation
  default_currency    text not null default 'EUR',
  default_vat_rate    numeric(5,2) default 20.00,
  payment_terms_days  integer not null default 30,
  invoice_prefix      text not null default 'FA',
  quote_prefix        text not null default 'DEV',
  invoice_counter     integer not null default 1,
  quote_counter       integer not null default 1,
  bank_iban           text,
  bank_bic            text,
  -- Franchise en base de TVA
  vat_exempt          boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.companies is 'Entreprise / informations légales de l''utilisateur';

create unique index companies_user_id_idx on public.companies(user_id);
create index companies_siret_idx on public.companies(siret) where siret is not null;

create trigger set_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists public.clients (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  type            text not null default 'company' check (type in ('company', 'individual')),
  name            text not null,
  email           text,
  phone           text,
  siret           text,
  vat_number      text,
  address_line1   text,
  address_line2   text,
  postal_code     text,
  city            text,
  country         text not null default 'FR',
  notes           text,
  archived        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.clients is 'Répertoire des clients de l''utilisateur';

create index clients_user_id_idx on public.clients(user_id);
create index clients_user_archived_idx on public.clients(user_id, archived);
create index clients_name_idx on public.clients using gin(to_tsvector('french', name));

create trigger set_clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ============================================================
-- QUOTES (Devis)
-- ============================================================
create table if not exists public.quotes (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  company_id      uuid references public.companies(id) on delete set null,
  client_id       uuid references public.clients(id) on delete set null,
  quote_number    text not null,          -- Ex. DEV-2026-001
  status          text not null default 'draft'
                    check (status in ('draft', 'sent', 'accepted', 'refused', 'expired', 'invoiced')),
  title           text,
  issue_date      date not null default current_date,
  expiry_date     date,
  currency        text not null default 'EUR',
  subtotal_ht     numeric(12,2) not null default 0,
  discount_rate   numeric(5,2) default 0,
  discount_amount numeric(12,2) default 0,
  vat_amount      numeric(12,2) not null default 0,
  total_ttc       numeric(12,2) not null default 0,
  vat_exempt      boolean not null default false,
  notes           text,
  conditions      text,
  sent_at         timestamptz,
  accepted_at     timestamptz,
  refused_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.quotes is 'Devis émis par l''utilisateur';

create index quotes_user_id_idx on public.quotes(user_id);
create index quotes_user_status_idx on public.quotes(user_id, status);
create index quotes_client_id_idx on public.quotes(client_id);
create index quotes_issue_date_idx on public.quotes(issue_date desc);
create unique index quotes_user_number_idx on public.quotes(user_id, quote_number);

create trigger set_quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- ============================================================
-- QUOTE_LINES (Lignes de devis)
-- ============================================================
create table if not exists public.quote_lines (
  id              uuid primary key default uuid_generate_v4(),
  quote_id        uuid not null references public.quotes(id) on delete cascade,
  position        integer not null default 0,
  description     text not null,
  quantity        numeric(10,3) not null default 1,
  unit            text default 'unité',
  unit_price_ht   numeric(12,2) not null,
  vat_rate        numeric(5,2) not null default 20.00,
  total_ht        numeric(12,2) not null,
  created_at      timestamptz not null default now()
);

comment on table public.quote_lines is 'Lignes d''article d''un devis';

create index quote_lines_quote_id_idx on public.quote_lines(quote_id);
create index quote_lines_position_idx on public.quote_lines(quote_id, position);

-- ============================================================
-- INVOICES (Factures)
-- ============================================================
create table if not exists public.invoices (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  company_id          uuid references public.companies(id) on delete set null,
  client_id           uuid references public.clients(id) on delete set null,
  quote_id            uuid references public.quotes(id) on delete set null,
  invoice_number      text not null,      -- Ex. FA-2026-001
  status              text not null default 'draft'
                        check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
  type                text not null default 'invoice'
                        check (type in ('invoice', 'credit_note', 'deposit', 'proforma')),
  title               text,
  issue_date          date not null default current_date,
  due_date            date,
  currency            text not null default 'EUR',
  subtotal_ht         numeric(12,2) not null default 0,
  discount_rate       numeric(5,2) default 0,
  discount_amount     numeric(12,2) default 0,
  vat_amount          numeric(12,2) not null default 0,
  total_ttc           numeric(12,2) not null default 0,
  amount_paid         numeric(12,2) not null default 0,
  amount_due          numeric(12,2) generated always as (total_ttc - amount_paid) stored,
  vat_exempt          boolean not null default false,
  -- Facture rectificative / avoir
  credited_invoice_id uuid references public.invoices(id) on delete set null,
  notes               text,
  payment_terms       text,
  late_penalty_rate   numeric(5,2) default 0,
  sent_at             timestamptz,
  paid_at             timestamptz,
  cancelled_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.invoices is 'Factures émises par l''utilisateur';

create index invoices_user_id_idx on public.invoices(user_id);
create index invoices_user_status_idx on public.invoices(user_id, status);
create index invoices_client_id_idx on public.invoices(client_id);
create index invoices_issue_date_idx on public.invoices(issue_date desc);
create index invoices_due_date_idx on public.invoices(due_date) where status not in ('paid', 'cancelled');
create unique index invoices_user_number_idx on public.invoices(user_id, invoice_number);

create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- ============================================================
-- INVOICE_LINES (Lignes de facture)
-- ============================================================
create table if not exists public.invoice_lines (
  id              uuid primary key default uuid_generate_v4(),
  invoice_id      uuid not null references public.invoices(id) on delete cascade,
  position        integer not null default 0,
  description     text not null,
  quantity        numeric(10,3) not null default 1,
  unit            text default 'unité',
  unit_price_ht   numeric(12,2) not null,
  vat_rate        numeric(5,2) not null default 20.00,
  total_ht        numeric(12,2) not null,
  created_at      timestamptz not null default now()
);

comment on table public.invoice_lines is 'Lignes d''article d''une facture';

create index invoice_lines_invoice_id_idx on public.invoice_lines(invoice_id);
create index invoice_lines_position_idx on public.invoice_lines(invoice_id, position);

-- ============================================================
-- PAYMENTS (Paiements reçus)
-- ============================================================
create table if not exists public.payments (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  invoice_id      uuid not null references public.invoices(id) on delete cascade,
  amount          numeric(12,2) not null check (amount > 0),
  currency        text not null default 'EUR',
  method          text check (method in ('bank_transfer', 'check', 'cash', 'card', 'paypal', 'other')),
  reference       text,               -- Référence du virement / chèque
  paid_at         date not null default current_date,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.payments is 'Paiements reçus sur les factures';

create index payments_user_id_idx on public.payments(user_id);
create index payments_invoice_id_idx on public.payments(invoice_id);
create index payments_paid_at_idx on public.payments(paid_at desc);

create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Trigger : recalcul de amount_paid sur invoices après paiement
create or replace function public.update_invoice_amount_paid()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_total numeric(12,2);
  v_paid  numeric(12,2);
begin
  select coalesce(sum(amount), 0)
  into v_paid
  from public.payments
  where invoice_id = coalesce(new.invoice_id, old.invoice_id);

  select total_ttc
  into v_total
  from public.invoices
  where id = coalesce(new.invoice_id, old.invoice_id);

  update public.invoices
  set
    amount_paid = v_paid,
    status = case
      when v_paid >= v_total then 'paid'
      when v_paid > 0        then 'sent'
      else status
    end,
    paid_at = case
      when v_paid >= v_total then now()
      else null
    end
  where id = coalesce(new.invoice_id, old.invoice_id);

  return coalesce(new, old);
end;
$$;

create trigger update_invoice_on_payment_insert
  after insert or update or delete on public.payments
  for each row execute function public.update_invoice_amount_paid();

-- ============================================================
-- SUBSCRIPTIONS (Abonnements FacturePilot)
-- ============================================================
create table if not exists public.subscriptions (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  plan                  text not null default 'free'
                          check (plan in ('free', 'starter', 'pro', 'business')),
  status                text not null default 'active'
                          check (status in ('active', 'trialing', 'past_due', 'cancelled', 'paused')),
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  trial_end             timestamptz,
  cancel_at             timestamptz,
  cancelled_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.subscriptions is 'Abonnements des utilisateurs à FacturePilot';

create unique index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_stripe_customer_idx on public.subscriptions(stripe_customer_id)
  where stripe_customer_id is not null;

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Trigger : création automatique d'un abonnement Free à l'inscription
create or replace function public.handle_new_subscription()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

drop trigger if exists on_profile_created_subscription on public.profiles;
create trigger on_profile_created_subscription
  after insert on public.profiles
  for each row execute function public.handle_new_subscription();
