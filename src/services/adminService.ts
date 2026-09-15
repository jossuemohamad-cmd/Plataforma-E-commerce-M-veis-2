import { Product } from '../types';
import { requireSupabase } from '../lib/supabase';

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function taxonomyId(table: 'categories' | 'rooms', name: string) {
  const client = requireSupabase();
  const { data: existing, error } = await client.from(table).select('id').eq('name', name).maybeSingle();
  if (error) throw error;
  if (existing) return existing.id;
  const { data, error: insertError } = await client.from(table).insert({ name, slug: slugify(name), active: true }).select('id').single();
  if (insertError) throw insertError;
  return data.id;
}

export async function saveProduct(product: Product): Promise<void> {
  const client = requireSupabase();
  const [categoryId, roomId] = await Promise.all([
    taxonomyId('categories', product.category),
    taxonomyId('rooms', product.ambiente)
  ]);
  const { error } = await client.from('products').upsert({
    id: product.id,
    slug: product.slug || slugify(`${product.title}-${product.sku}`),
    sku: product.sku,
    title: product.title,
    description: product.description,
    category_id: categoryId,
    room_id: roomId,
    material: product.material,
    price: product.price,
    original_price: product.originalPrice ?? null,
    stock_quantity: product.stockCount ?? (product.inStock ? 1 : 0),
    active: true,
    featured: product.featured ?? false,
    is_new: product.isNew ?? false,
    badge: product.badge ?? null,
    designer: product.designer ?? null,
    dimensions: typeof product.dimensions === 'object' ? product.dimensions : {},
    tags: product.tags ?? []
  });
  if (error) throw error;
  if (product.images[0]) {
    const { error: imageError } = await client.from('product_images').upsert({
      product_id: product.id,
      public_url: product.images[0],
      alt_text: product.title,
      position: 0
    }, { onConflict: 'product_id,position' });
    if (imageError) throw imageError;
  }
}

export async function uploadProductImage(file: File, productId: string) {
  const client = requireSupabase();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from('product-media').upload(path, file, { upsert: false });
  if (error) throw error;
  return client.storage.from('product-media').getPublicUrl(path).data.publicUrl;
}

export async function deleteProduct(productId: string) {
  const { error } = await requireSupabase().from('products').delete().eq('id', productId);
  if (error) throw error;
}

export interface DashboardOrder {
  orderId: string;
  id: string;
  client: string;
  project: string;
  items: string;
  value: number;
  deadline: string;
  status: string;
}

export async function getDashboardData() {
  const client = requireSupabase();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const { data, error } = await client
    .from('orders')
    .select('id,order_number,total,status,created_at,profiles(full_name,firm_name),order_items(product_name,quantity)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  const rows = data ?? [];
  const monthly = rows.filter((row) => new Date(row.created_at) >= start);
  const revenue = monthly.reduce((sum, row) => sum + Number(row.total), 0);
  const activeStatuses = new Set(['pending', 'confirmed', 'processing', 'ready', 'shipped']);
  const processing = rows.filter((row) => activeStatuses.has(row.status)).length;
  const average = rows.length ? rows.reduce((sum, row) => sum + Number(row.total), 0) / rows.length : 0;
  const orders: DashboardOrder[] = rows.slice(0, 10).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      orderId: row.id,
      id: row.order_number,
      client: profile?.firm_name || profile?.full_name || 'Cliente EDEN',
      project: 'Encomenda online',
      items: (row.order_items ?? []).map((item) => `${item.quantity}x ${item.product_name}`).join(', '),
      value: Number(row.total),
      deadline: new Date(row.created_at).toLocaleDateString('pt-MZ'),
      status: row.status
    };
  });
  return { revenue, processing, average, orders };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await requireSupabase().rpc('admin_update_order_status', {
    p_order_id: orderId,
    p_status: status
  });
  if (error) throw error;
}
