-- ============================================================
-- FacturePilot — Row Level Security (RLS)
-- Mission 2 : Politiques de sécurité
-- ============================================================
-- Principe : chaque utilisateur ne voit et ne modifie
-- que ses propres données (user_id = auth.uid()).
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Pas de INSERT public : le trigger handle_new_user s'en charge en SECURITY DEFINER

-- ============================================================
-- COMPANIES
-- ============================================================
alter table public.companies enable row level security;

create policy "companies_select_own"
  on public.companies for select
  using (user_id = auth.uid());

create policy "companies_insert_own"
  on public.companies for insert
  with check (user_id = auth.uid());

create policy "companies_update_own"
  on public.companies for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "companies_delete_own"
  on public.companies for delete
  using (user_id = auth.uid());

-- ============================================================
-- CLIENTS
-- ============================================================
alter table public.clients enable row level security;

create policy "clients_select_own"
  on public.clients for select
  using (user_id = auth.uid());

create policy "clients_insert_own"
  on public.clients for insert
  with check (user_id = auth.uid());

create policy "clients_update_own"
  on public.clients for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "clients_delete_own"
  on public.clients for delete
  using (user_id = auth.uid());

-- ============================================================
-- QUOTES
-- ============================================================
alter table public.quotes enable row level security;

create policy "quotes_select_own"
  on public.quotes for select
  using (user_id = auth.uid());

create policy "quotes_insert_own"
  on public.quotes for insert
  with check (user_id = auth.uid());

create policy "quotes_update_own"
  on public.quotes for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "quotes_delete_own"
  on public.quotes for delete
  using (user_id = auth.uid());

-- ============================================================
-- QUOTE_LINES
-- ============================================================
alter table public.quote_lines enable row level security;

-- Accès via la quote parente (join)
create policy "quote_lines_select_own"
  on public.quote_lines for select
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_lines.quote_id
        and q.user_id = auth.uid()
    )
  );

create policy "quote_lines_insert_own"
  on public.quote_lines for insert
  with check (
    exists (
      select 1 from public.quotes q
      where q.id = quote_lines.quote_id
        and q.user_id = auth.uid()
    )
  );

create policy "quote_lines_update_own"
  on public.quote_lines for update
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_lines.quote_id
        and q.user_id = auth.uid()
    )
  );

create policy "quote_lines_delete_own"
  on public.quote_lines for delete
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_lines.quote_id
        and q.user_id = auth.uid()
    )
  );

-- ============================================================
-- INVOICES
-- ============================================================
alter table public.invoices enable row level security;

create policy "invoices_select_own"
  on public.invoices for select
  using (user_id = auth.uid());

create policy "invoices_insert_own"
  on public.invoices for insert
  with check (user_id = auth.uid());

create policy "invoices_update_own"
  on public.invoices for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "invoices_delete_own"
  on public.invoices for delete
  using (user_id = auth.uid());

-- ============================================================
-- INVOICE_LINES
-- ============================================================
alter table public.invoice_lines enable row level security;

create policy "invoice_lines_select_own"
  on public.invoice_lines for select
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_lines.invoice_id
        and i.user_id = auth.uid()
    )
  );

create policy "invoice_lines_insert_own"
  on public.invoice_lines for insert
  with check (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_lines.invoice_id
        and i.user_id = auth.uid()
    )
  );

create policy "invoice_lines_update_own"
  on public.invoice_lines for update
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_lines.invoice_id
        and i.user_id = auth.uid()
    )
  );

create policy "invoice_lines_delete_own"
  on public.invoice_lines for delete
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_lines.invoice_id
        and i.user_id = auth.uid()
    )
  );

-- ============================================================
-- PAYMENTS
-- ============================================================
alter table public.payments enable row level security;

create policy "payments_select_own"
  on public.payments for select
  using (user_id = auth.uid());

create policy "payments_insert_own"
  on public.payments for insert
  with check (user_id = auth.uid());

create policy "payments_update_own"
  on public.payments for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "payments_delete_own"
  on public.payments for delete
  using (user_id = auth.uid());

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (user_id = auth.uid());

-- Pas de INSERT/UPDATE/DELETE public : géré côté serveur (webhooks Stripe)
-- en SECURITY DEFINER uniquement.

-- ============================================================
-- SERVICE ROLE : accès complet pour les fonctions serveur
-- (webhooks Stripe, jobs, triggers)
-- Les fonctions SECURITY DEFINER contournent déjà RLS,
-- ce bloc est ici pour documenter l'intention.
-- ============================================================
