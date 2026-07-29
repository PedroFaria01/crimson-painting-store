-- Crimson Painting — initial schema
-- Catalog (categories, products, images), admin roles, and orders/order_items.
-- Applied via the Supabase SQL editor or `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id uuid references categories(id) on delete restrict,
  price_cents int not null check (price_cents >= 0),
  price_prefix text,       -- e.g. 'from', for custom-order pricing
  price_suffix text,       -- e.g. '/mini'
  currency text not null default 'EUR',
  short_description text not null default '',
  long_description text not null default '',
  stock int not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products(category_id);
create index products_is_active_idx on products(is_active);

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  position int not null default 0
);

create index product_images_product_id_idx on product_images(product_id);

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users with an application role
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- security definer + fixed search_path so it can be used inside RLS policies
-- (including on `profiles` itself) without recursive-RLS or search-path hijacking.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- orders / order_items
-- ---------------------------------------------------------------------------
create sequence order_number_seq start 10000;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('CP-' || nextval('order_number_seq')),
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  subtotal_cents int not null,
  shipping_cents int not null,
  total_cents int not null,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on orders(status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price_cents int not null check (unit_price_cents >= 0),
  quantity int not null check (quantity > 0)
);

create index order_items_order_id_idx on order_items(order_id);

-- Atomic, floor-at-zero stock decrement — called from the Stripe webhook
-- Edge Function via the service role so concurrent payments can't race
-- past a naive "read stock, subtract, write back" from application code.
create or replace function decrement_product_stock(p_product_id uuid, p_quantity int)
returns void
language sql
security definer
set search_path = public
as $$
  update products
  set stock = greatest(stock - p_quantity, 0)
  where id = p_product_id;
$$;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- categories: readable by anyone, writable only by admins
create policy "categories_public_read" on categories
  for select using (true);
create policy "categories_admin_write" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin()) with check (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

-- products: public can read active products, admins can read/write everything
create policy "products_public_read" on products
  for select using (is_active or is_admin());
create policy "products_admin_write" on products
  for insert with check (is_admin());
create policy "products_admin_update" on products
  for update using (is_admin()) with check (is_admin());
create policy "products_admin_delete" on products
  for delete using (is_admin());

-- product_images: same visibility rules as their parent product
create policy "product_images_public_read" on product_images
  for select using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id and (p.is_active or is_admin())
    )
  );
create policy "product_images_admin_write" on product_images
  for insert with check (is_admin());
create policy "product_images_admin_update" on product_images
  for update using (is_admin()) with check (is_admin());
create policy "product_images_admin_delete" on product_images
  for delete using (is_admin());

-- profiles: a user can read their own row, admins can read/update all
create policy "profiles_self_or_admin_read" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_admin_update" on profiles
  for update using (is_admin()) with check (is_admin());

-- orders / order_items: no direct client access at all.
-- Rows are only ever written by Edge Functions using the service role key
-- (which bypasses RLS), and only admins may read them from the app.
create policy "orders_admin_read" on orders
  for select using (is_admin());
create policy "orders_admin_update" on orders
  for update using (is_admin()) with check (is_admin());
create policy "order_items_admin_read" on order_items
  for select using (is_admin());
