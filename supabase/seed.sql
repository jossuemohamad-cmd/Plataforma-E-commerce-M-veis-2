insert into public.categories (name, slug) values
  ('Sofás & Chaise', 'sofas-chaise'),
  ('Cadeiras & Poltronas', 'cadeiras-poltronas'),
  ('Mesas de Jantar & Centro', 'mesas')
on conflict (slug) do nothing;

insert into public.rooms (name, slug) values
  ('Sala de Estar', 'sala-de-estar'),
  ('Sala de Jantar', 'sala-de-jantar')
on conflict (slug) do nothing;

insert into public.styles (name, slug) values ('Contemporâneo', 'contemporaneo')
on conflict (slug) do nothing;

insert into public.products (id, slug, sku, title, description, category_id, room_id, style_id, material, price, original_price, stock_quantity, featured, badge, rating, review_count, dimensions)
select 'sof-nuvola', 'sofa-modular-nuvola', 'SOF-NUV-280', 'Sofá Modular Nuvola',
  'Sofá modular autoral com conforto profundo e composição adaptável.', c.id, r.id, s.id,
  'Linho Belga Cru', 79900, 89500, 8, true, 'Mais Desejado', 4.9, 127,
  '{"width":280,"height":82,"depth":105,"weight":78.5}'::jsonb
from public.categories c, public.rooms r, public.styles s
where c.slug='sofas-chaise' and r.slug='sala-de-estar' and s.slug='contemporaneo'
on conflict (id) do update set price=excluded.price, stock_quantity=excluded.stock_quantity;

insert into public.products (id, slug, sku, title, description, category_id, room_id, style_id, material, price, stock_quantity, featured, rating, review_count, dimensions)
select 'pol-kyoto', 'poltrona-kyoto', 'POL-KYO-088', 'Poltrona Kyoto',
  'Poltrona artesanal em madeira maciça e tecido bouclé.', c.id, r.id, s.id,
  'Carvalho Maciço & Bouclé', 38400, 12, true, 4.9, 84,
  '{"width":88,"height":70,"depth":82,"weight":22}'::jsonb
from public.categories c, public.rooms r, public.styles s
where c.slug='cadeiras-poltronas' and r.slug='sala-de-estar' and s.slug='contemporaneo'
on conflict (id) do update set price=excluded.price, stock_quantity=excluded.stock_quantity;

insert into public.products (id, slug, sku, title, description, category_id, room_id, style_id, material, price, stock_quantity, featured, rating, review_count, dimensions)
select 'mes-monolito', 'mesa-travertino-monolito', 'MES-MON-140', 'Mesa Travertino Monolito',
  'Mesa escultural lapidada em mármore Travertino Navona.', c.id, r.id, s.id,
  'Mármore Travertino Navona', 36500, 6, true, 4.8, 63,
  '{"width":140,"height":32,"depth":80,"weight":128}'::jsonb
from public.categories c, public.rooms r, public.styles s
where c.slug='mesas' and r.slug='sala-de-estar' and s.slug='contemporaneo'
on conflict (id) do update set price=excluded.price, stock_quantity=excluded.stock_quantity;

insert into public.product_images (product_id, public_url, alt_text, position) values
  ('sof-nuvola', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85', 'Sofá Modular Nuvola', 0),
  ('pol-kyoto', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85', 'Poltrona Kyoto', 0),
  ('mes-monolito', 'https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=1600&q=85', 'Mesa Travertino Monolito', 0)
on conflict (product_id, position) do update set public_url=excluded.public_url;

insert into public.product_variants (product_id, sku, name, material, color, size, price_delta, stock_quantity) values
  ('sof-nuvola', 'SOF-NUV-280-LC', 'Linho Cru • 280 cm', 'Linho Natural Cru', 'Cru', '280 cm', 0, 4),
  ('sof-nuvola', 'SOF-NUV-320-BI', 'Bouclé • 320 cm', 'Bouclé Italiano', 'Off-white', '320 cm', 12500, 4),
  ('pol-kyoto', 'POL-KYO-PAD-BC', 'Bouclé • Padrão', 'Bouclé Italiano', 'Off-white', 'Padrão', 0, 12),
  ('mes-monolito', 'MES-MON-140-TV', 'Travertino • 140 x 80 cm', 'Mármore Travertino Navona', 'Natural', '140 x 80 cm', 0, 6)
on conflict (sku) do update set price_delta=excluded.price_delta, stock_quantity=excluded.stock_quantity;

insert into public.coupons (code, discount_type, discount_value, minimum_order, active)
values ('BEMVINDO10', 'percent', 10, 25000, true)
on conflict (code) do nothing;

insert into public.showrooms (id, name, city, province, address, phone, email, hours, description, image_url, curator) values
  ('maputo-flagship', 'Flagship Maputo', 'Maputo', 'Maputo Cidade', 'Av. Julius Nyerere, 1120', '+258 21 490 200', 'maputo@eden.co.mz', 'Seg–Sáb, 09:00–18:00', 'Acervo completo e consultoria residencial.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', 'Beatriz Mendes')
on conflict (id) do update set name=excluded.name, image_url=excluded.image_url;

insert into public.showroom_products (showroom_id, product_id, hotspot_x, hotspot_y, featured) values
  ('maputo-flagship', 'sof-nuvola', 48.5, 62, true),
  ('maputo-flagship', 'mes-monolito', 52, 78.5, true),
  ('maputo-flagship', 'pol-kyoto', 18.5, 68, false)
on conflict (showroom_id, product_id) do update set hotspot_x=excluded.hotspot_x, hotspot_y=excluded.hotspot_y;
