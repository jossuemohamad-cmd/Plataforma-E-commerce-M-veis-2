import { AETHEL_PRODUCTS, SHOWROOMS } from '../data/aethelData';
import { Product, ProductVariant, ShowroomLocation } from '../types';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

type ProductRow = Record<string, unknown> & {
  id: string;
  sku: string;
  slug: string;
  title: string;
  description: string | null;
  material: string | null;
  designer: string | null;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  featured: boolean;
  is_new: boolean;
  badge: string | null;
  dimensions: Record<string, number> | null;
  tags: string[] | null;
  categories: { name: string } | null;
  rooms: { name: string } | null;
  product_images: Array<{ public_url: string; alt_text: string | null; position: number }>;
  product_variants: Array<{
    id: string;
    sku: string;
    name: string;
    material: string | null;
    color: string | null;
    size: string | null;
    price_delta: number;
    stock_quantity: number;
  }>;
};

function mapProduct(row: ProductRow): Product {
  const variants: ProductVariant[] = (row.product_variants ?? []).map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    name: variant.name,
    material: variant.material ?? undefined,
    color: variant.color ?? undefined,
    size: variant.size ?? undefined,
    priceDelta: Number(variant.price_delta),
    stockQuantity: variant.stock_quantity,
    imageUrl: undefined
  }));

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    title: row.title,
    category: row.categories?.name ?? 'Coleção',
    ambiente: row.rooms?.name ?? 'Interiores',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    images: (row.product_images ?? [])
      .sort((a, b) => a.position - b.position)
      .map((image) => image.public_url),
    description: row.description ?? '',
    designer: row.designer ?? undefined,
    material: row.material ?? 'Sob consulta',
    badge: row.badge ?? undefined,
    inStock: row.stock_quantity > 0,
    stockCount: row.stock_quantity,
    featured: row.featured,
    isNew: row.is_new,
    tags: row.tags ?? [],
    dimensions: row.dimensions ?? undefined,
    variants
  };
}

export async function listProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV) return AETHEL_PRODUCTS;
    throw new Error('O catálogo ainda não foi configurado.');
  }

  const { data, error } = await requireSupabase()
    .from('products')
    .select('*, categories(name), rooms(name), product_images(public_url,alt_text,position), product_variants(id,sku,name,material,color,size,price_delta,stock_quantity)')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === 'PGRST205') return AETHEL_PRODUCTS;
    throw error;
  }
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function listShowrooms(): Promise<ShowroomLocation[]> {
  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV) return SHOWROOMS;
    throw new Error('Os showrooms ainda não foram configurados.');
  }

  const { data, error } = await requireSupabase()
    .from('showrooms')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) {
    if (error.code === 'PGRST205') return SHOWROOMS;
    throw error;
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    title: row.name,
    city: row.city,
    provinceName: row.province,
    address: row.address,
    phone: row.phone ?? '',
    email: row.email ?? undefined,
    hours: row.hours ?? '',
    image: row.image_url ?? '',
    description: row.description ?? undefined,
    curator: row.curator ?? undefined
  }));
}

export async function createQuoteRequest(input: {
  showroomId?: string;
  name: string;
  email: string;
  phone?: string;
  desiredDate?: string;
  purpose?: string;
  message?: string;
}) {
  const { error } = await requireSupabase().from('quote_requests').insert({
    showroom_id: input.showroomId || null,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    requested_date: input.desiredDate || null,
    project_type: input.purpose || 'visita',
    details: input.message?.trim() || null
  });
  if (error) throw error;
}

export async function subscribeNewsletter(email: string) {
  const { error } = await requireSupabase().from('newsletter_subscribers').insert({
    email: email.trim().toLowerCase(),
    active: true
  });
  if (error && error.code !== '23505') throw error;
}

export async function createContact(input: { name: string; email: string; phone?: string; subject: string; message: string }) {
  const { error } = await requireSupabase().from('contacts').insert({
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    subject: input.subject.trim(),
    message: input.message.trim()
  });
  if (error) throw error;
}
