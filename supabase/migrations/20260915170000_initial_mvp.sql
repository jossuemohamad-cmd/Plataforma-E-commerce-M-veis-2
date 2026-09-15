create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  firm_name text,
  nuit text,
  avatar_url text,
  account_type text not null default 'residential' check (account_type in ('residential', 'architect')),
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true
);

create table public.styles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true
);

create table public.products (
  id text primary key,
  slug text not null unique,
  sku text not null unique,
  title text not null,
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  room_id uuid references public.rooms(id) on delete set null,
  style_id uuid references public.styles(id) on delete set null,
  material text not null default '',
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2) check (original_price is null or original_price >= price),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  active boolean not null default true,
  featured boolean not null default false,
  is_new boolean not null default false,
  badge text,
  designer text,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  dimensions jsonb not null default '{}'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  storage_path text,
  public_url text not null,
  alt_text text,
  position integer not null default 0,
  unique (product_id, position)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  material text,
  color text,
  size text,
  price_delta numeric(12,2) not null default 0,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_id uuid references public.product_images(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  guest_token text,
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or guest_token is not null)
);

create unique index carts_one_active_user on public.carts(user_id) where status = 'active' and user_id is not null;
create unique index carts_one_active_guest on public.carts(guest_token) where status = 'active' and guest_token is not null;

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (cart_id, product_id, variant_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  province text not null,
  postal_code text,
  access_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code)),
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_order numeric(12,2) not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  active boolean not null default true,
  usage_limit integer,
  usage_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('EDN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  coupon_id uuid references public.coupons(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('transfer', 'pos', 'card')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  subtotal numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  sku text not null,
  variant_name text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) generated always as (quantity * unit_price) stored
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  movement_type text not null check (movement_type in ('sale', 'restock', 'adjustment', 'cancellation')),
  quantity_delta integer not null check (quantity_delta <> 0),
  reason text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.showrooms (
  id text primary key,
  name text not null,
  city text not null,
  province text not null,
  address text not null,
  phone text not null,
  email text,
  hours text not null,
  description text,
  image_url text not null,
  curator text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.showroom_products (
  showroom_id text not null references public.showrooms(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  hotspot_x numeric(5,2),
  hotspot_y numeric(5,2),
  featured boolean not null default false,
  primary key (showroom_id, product_id)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  showroom_id text references public.showrooms(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  requested_date date,
  details text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (position('@' in email) > 1),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, account_type, firm_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'account_type', 'residential'),
    nullif(new.raw_user_meta_data->>'firm_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.prevent_profile_role_change()
returns trigger language plpgsql set search_path = public
as $$
begin
  if new.role is distinct from old.role
    and not public.is_admin()
    and coalesce(auth.role(), '') <> 'service_role'
    and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'Only administrators can change roles';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_protect_role before update on public.profiles
for each row execute function public.prevent_profile_role_change();

create or replace function public.place_order(
  p_cart_id uuid,
  p_address_id uuid,
  p_payment_method text,
  p_coupon_code text default null,
  p_delivery_notes text default null
) returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_order uuid;
  v_subtotal numeric(12,2);
  v_discount numeric(12,2) := 0;
  v_delivery numeric(12,2) := 0;
  v_coupon public.coupons%rowtype;
  v_item record;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_payment_method not in ('transfer', 'pos', 'card') then raise exception 'Invalid payment method'; end if;
  if not exists(select 1 from public.carts where id = p_cart_id and user_id = v_user and status = 'active') then
    raise exception 'Active cart not found';
  end if;
  if not exists(select 1 from public.addresses where id = p_address_id and user_id = v_user) then
    raise exception 'Address not found';
  end if;

  perform 1 from public.product_variants pv
  join public.cart_items ci on ci.variant_id = pv.id
  where ci.cart_id = p_cart_id for update of pv;

  for v_item in
    select ci.*, p.title, p.sku product_sku, p.price base_price, p.stock_quantity product_stock,
      p.active product_active, pv.name variant_name, pv.sku variant_sku, pv.price_delta, pv.stock_quantity variant_stock, pv.active variant_active
    from public.cart_items ci join public.products p on p.id = ci.product_id
    left join public.product_variants pv on pv.id = ci.variant_id
    where ci.cart_id = p_cart_id for update of p
  loop
    if not v_item.product_active then raise exception 'Product % is unavailable', v_item.title; end if;
    if v_item.variant_id is not null and not v_item.variant_active then raise exception 'Variant unavailable'; end if;
    if v_item.product_stock < v_item.quantity or (v_item.variant_id is not null and v_item.variant_stock < v_item.quantity) then
      raise exception 'Insufficient stock for %', v_item.title;
    end if;
  end loop;

  if exists (
    select 1
    from (
      select ci.product_id, sum(ci.quantity)::integer requested, p.stock_quantity available
      from public.cart_items ci
      join public.products p on p.id = ci.product_id
      where ci.cart_id = p_cart_id
      group by ci.product_id, p.stock_quantity
    ) grouped
    where grouped.requested > grouped.available
  ) then
    raise exception 'Insufficient aggregate product stock';
  end if;

  select coalesce(sum(ci.quantity * (p.price + coalesce(pv.price_delta, 0))), 0)
  into v_subtotal from public.cart_items ci join public.products p on p.id = ci.product_id
  left join public.product_variants pv on pv.id = ci.variant_id where ci.cart_id = p_cart_id;
  if v_subtotal <= 0 then raise exception 'Cart is empty'; end if;

  if nullif(trim(p_coupon_code), '') is not null then
    select * into v_coupon from public.coupons where code = upper(trim(p_coupon_code)) and active
      and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at >= now())
      and (usage_limit is null or usage_count < usage_limit) for update;
    if not found or v_subtotal < v_coupon.minimum_order then raise exception 'Invalid coupon'; end if;
    v_discount := case when v_coupon.discount_type = 'percent' then round(v_subtotal * v_coupon.discount_value / 100, 2)
      else least(v_coupon.discount_value, v_subtotal) end;
  end if;

  insert into public.orders(user_id, address_id, coupon_id, payment_method, subtotal, discount, delivery_fee, total, delivery_notes)
  values(v_user, p_address_id, v_coupon.id, p_payment_method, v_subtotal, v_discount, v_delivery, v_subtotal - v_discount + v_delivery, p_delivery_notes)
  returning id into v_order;

  insert into public.order_items(order_id, product_id, variant_id, product_name, sku, variant_name, quantity, unit_price)
  select v_order, ci.product_id, ci.variant_id, p.title, coalesce(pv.sku, p.sku), pv.name, ci.quantity,
    p.price + coalesce(pv.price_delta, 0) from public.cart_items ci join public.products p on p.id = ci.product_id
    left join public.product_variants pv on pv.id = ci.variant_id where ci.cart_id = p_cart_id;

  update public.product_variants pv set stock_quantity = pv.stock_quantity - ci.quantity
  from public.cart_items ci where ci.cart_id = p_cart_id and ci.variant_id = pv.id;
  update public.products p set stock_quantity = p.stock_quantity - grouped.quantity, updated_at = now()
  from (select product_id, sum(quantity)::integer quantity from public.cart_items where cart_id = p_cart_id group by product_id) grouped
  where grouped.product_id = p.id;

  insert into public.inventory_movements(product_id, variant_id, order_id, movement_type, quantity_delta, reason, created_by)
  select ci.product_id, ci.variant_id, v_order, 'sale', -ci.quantity, 'Order placed', v_user
  from public.cart_items ci where ci.cart_id = p_cart_id;

  if v_coupon.id is not null then update public.coupons set usage_count = usage_count + 1 where id = v_coupon.id; end if;
  update public.carts set status = 'converted', updated_at = now() where id = p_cart_id;
  return v_order;
end;
$$;

create or replace function public.replace_cart_items(p_items jsonb)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_cart uuid;
  v_item jsonb;
  v_product text;
  v_variant uuid;
  v_quantity integer;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  insert into public.carts(user_id, status) values(v_user, 'active')
  on conflict (user_id) where status = 'active' and user_id is not null do update set updated_at = now()
  returning id into v_cart;
  delete from public.cart_items where cart_id = v_cart;
  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    v_product := v_item->>'product_id';
    v_variant := nullif(v_item->>'variant_id', '')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity < 1 then raise exception 'Invalid quantity'; end if;
    if not exists(select 1 from public.products where id = v_product and active and stock_quantity >= v_quantity) then
      raise exception 'Product unavailable or insufficient stock';
    end if;
    if v_variant is not null and not exists(select 1 from public.product_variants where id = v_variant and product_id = v_product and active and stock_quantity >= v_quantity) then
      raise exception 'Variant unavailable or insufficient stock';
    end if;
    insert into public.cart_items(cart_id, product_id, variant_id, quantity) values(v_cart, v_product, v_variant, v_quantity);
  end loop;
  return v_cart;
end;
$$;

create or replace function public.admin_update_order_status(p_order_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public
as $$
declare v_previous text;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if p_status not in ('pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled') then raise exception 'Invalid status'; end if;
  select status into v_previous from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_previous = 'cancelled' and p_status <> 'cancelled' then raise exception 'A cancelled order cannot be reopened'; end if;
  if p_status = 'cancelled' and v_previous <> 'cancelled' then
    update public.products p set stock_quantity = p.stock_quantity + grouped.quantity, updated_at = now()
    from (select product_id, sum(quantity)::integer quantity from public.order_items where order_id = p_order_id and product_id is not null group by product_id) grouped
    where p.id = grouped.product_id;
    update public.product_variants pv set stock_quantity = pv.stock_quantity + grouped.quantity
    from (select variant_id, sum(quantity)::integer quantity from public.order_items where order_id = p_order_id and variant_id is not null group by variant_id) grouped
    where pv.id = grouped.variant_id;
    insert into public.inventory_movements(product_id, variant_id, order_id, movement_type, quantity_delta, reason, created_by)
    select product_id, variant_id, p_order_id, 'cancellation', quantity, 'Order cancelled', auth.uid()
    from public.order_items where order_id = p_order_id;
  end if;
  update public.orders set status = p_status, updated_at = now() where id = p_order_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.rooms enable row level security;
alter table public.styles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.favorites enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.showrooms enable row level security;
alter table public.showroom_products enable row level security;
alter table public.contacts enable row level security;
alter table public.quote_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "public read categories" on public.categories for select using (active or public.is_admin());
create policy "public read rooms" on public.rooms for select using (active or public.is_admin());
create policy "public read styles" on public.styles for select using (active or public.is_admin());
create policy "public read products" on public.products for select using (active or public.is_admin());
create policy "public read product images" on public.product_images for select using (true);
create policy "public read active variants" on public.product_variants for select using (active or public.is_admin());
create policy "public read showrooms" on public.showrooms for select using (active or public.is_admin());
create policy "public read showroom products" on public.showroom_products for select using (true);

create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy "favorites own" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "carts own" on public.carts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cart items own" on public.cart_items for all using (exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())) with check (exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "addresses own" on public.addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "orders own read" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "order items own read" on public.order_items for select using (exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy "contacts create" on public.contacts for insert with check (user_id is null or user_id = auth.uid());
create policy "quotes create" on public.quote_requests for insert with check (user_id is null or user_id = auth.uid());
create policy "newsletter subscribe" on public.newsletter_subscribers for insert with check (true);

create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage rooms" on public.rooms for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage styles" on public.styles for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage showrooms" on public.showrooms for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage showroom products" on public.showroom_products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read inventory" on public.inventory_movements for select using (public.is_admin());
create policy "admins manage contacts" on public.contacts for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage quotes" on public.quote_requests for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage newsletter" on public.newsletter_subscribers for all using (public.is_admin()) with check (public.is_admin());

grant select on public.categories, public.rooms, public.styles, public.products, public.product_images,
  public.product_variants, public.showrooms, public.showroom_products to anon, authenticated;
grant insert on public.contacts, public.quote_requests, public.newsletter_subscribers to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant all on public.favorites, public.carts, public.cart_items, public.addresses to authenticated;
grant select on public.orders, public.order_items to authenticated;
grant all on public.categories, public.rooms, public.styles, public.products, public.product_images,
  public.product_variants, public.showrooms, public.showroom_products, public.coupons to authenticated;
grant select on public.inventory_movements to authenticated;

revoke all on function public.place_order(uuid, uuid, text, text, text) from public, anon;
revoke all on function public.replace_cart_items(jsonb) from public, anon;
revoke all on function public.admin_update_order_status(uuid, text) from public, anon;
grant execute on function public.place_order(uuid, uuid, text, text, text) to authenticated;
grant execute on function public.replace_cart_items(jsonb) to authenticated;
grant execute on function public.admin_update_order_status(uuid, text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public product media" on storage.objects for select using (bucket_id = 'product-media');
create policy "admins upload product media" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and public.is_admin());
create policy "admins update product media" on storage.objects for update to authenticated using (bucket_id = 'product-media' and public.is_admin());
create policy "admins delete product media" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and public.is_admin());

create index products_category_idx on public.products(category_id);
create index products_room_idx on public.products(room_id);
create index products_active_idx on public.products(active, featured);
create index product_images_product_idx on public.product_images(product_id, position);
create index product_variants_product_idx on public.product_variants(product_id, active);
create index cart_items_cart_idx on public.cart_items(cart_id);
create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);
