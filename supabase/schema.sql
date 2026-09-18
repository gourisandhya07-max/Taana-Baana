-- ==========================================
-- TAANA BAANA — DATABASE SCHEMA & SEED DATA
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Artisans Table (Extends Supabase auth.users)
create table if not exists artisans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text unique not null,
  preferred_language text default 'en',
  craft_type text,
  region text,
  bio text,
  avatar_url text,
  voice_intro_url text,
  created_at timestamptz default now()
);

-- 2. Products Table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid references artisans(id) on delete cascade,
  title text not null,
  description text,
  category text,
  tags text[],
  image_urls text[],
  material_cost numeric default 0,
  production_hours numeric default 0,
  size text,
  quantity_available integer default 1,
  suggested_price_min numeric,
  suggested_price_max numeric,
  final_price numeric,
  status text default 'draft', -- draft | published | sold_out
  created_at timestamptz default now()
);

-- 3. Market Segments (Reference table for AI Linkage Engine)
create table if not exists market_segments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  target_demographic text,
  avg_margin_multiplier numeric default 1.5,
  created_at timestamptz default now()
);

-- 4. Product <-> Market Segment Matches
create table if not exists product_market_matches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  market_segment_id uuid references market_segments(id) on delete cascade,
  match_score numeric check (match_score >= 0 and match_score <= 1.0),
  reasoning text,
  created_at timestamptz default now()
);

-- 5. Orders / Inquiries Table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  artisan_id uuid references artisans(id) on delete cascade,
  customer_name text not null,
  customer_contact text not null,
  customer_email text,
  quantity integer default 1,
  notes text,
  status text default 'pending', -- pending | confirmed | fulfilled | cancelled
  created_at timestamptz default now()
);

-- 6. Product Views (For analytics dashboard)
create table if not exists product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  viewed_at timestamptz default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table artisans enable row level security;
alter table products enable row level security;
alter table market_segments enable row level security;
alter table product_market_matches enable row level security;
alter table orders enable row level security;
alter table product_views enable row level security;

-- Public read access for published products
create policy "Published products are readable by anyone"
  on products for select
  using (status = 'published');

-- Artisans full access to their own products
create policy "Artisans can view own products"
  on products for select
  using (auth.uid() = artisan_id or status = 'published');

create policy "Artisans can insert own products"
  on products for insert
  with check (auth.uid() = artisan_id);

create policy "Artisans can update own products"
  on products for update
  using (auth.uid() = artisan_id);

-- Market segments read-only for public
create policy "Market segments readable by everyone"
  on market_segments for select
  using (true);

-- Product market matches readable by product owner or public
create policy "Matches readable by everyone"
  on product_market_matches for select
  using (true);

-- Orders: public insertion, artisan read/update
create policy "Anyone can create order inquiry"
  on orders for insert
  with check (true);

create policy "Artisans can view received orders"
  on orders for select
  using (auth.uid() = artisan_id);

-- Product views public insertion
create policy "Anyone can log product view"
  on product_views for insert
  with check (true);

-- ==========================================
-- SEED DATA (INITIAL MARKET SEGMENTS & DEMO DATA)
-- ==========================================

insert into market_segments (name, description, target_demographic, avg_margin_multiplier) values
  ('Eco-friendly & Sustainable Boutiques', 'Conscious consumers seeking authentic organic dye textiles & zero-plastic home goods.', 'Urban eco-conscious buyers, 25-45', 1.8),
  ('Luxury Heritage & Home Décor', 'Interior designers & boutique hotels looking for bespoke handcrafted weaves and brass accent pieces.', 'High net-worth homeowners & decorators', 2.2),
  ('Bulk Corporate Gifting', 'Corporate clients seeking artisanal handcrafted gift boxes, diaries, and festive brassware.', 'HR & PR managers in tech & finance', 1.5),
  ('Tourist & Cultural Souvenirs', 'Travelers looking for portable, high-quality authentic craft keepsakes with certified artisan origin.', 'Domestic & international tourists', 1.6),
  ('Fair-Trade Export Distributors', 'International buyers sourcing authentic Indian handlooms for North American & European ethical stores.', 'Global wholesale buyers', 2.0),
  ('Festive & Temple Art Enthusiasts', 'Collectors and traditional households buying ceremonial art, silk sarees, and festival lamps.', 'Cultural enthusiasts & collectors', 1.7)
on conflict do nothing;
