import { CartItem, Order } from '../types';
import { requireSupabase } from '../lib/supabase';

export async function saveCart(items: CartItem[]): Promise<string> {
  const payload = items.map((item) => ({
    product_id: item.product.id,
    variant_id: item.variantId ?? null,
    quantity: item.quantity
  }));
  const { data, error } = await requireSupabase().rpc('replace_cart_items', { p_items: payload });
  if (error) throw error;
  return data as string;
}

export async function loadCart(products: CartItem['product'][]): Promise<CartItem[]> {
  const client = requireSupabase();
  const { data: cart, error: cartError } = await client
    .from('carts')
    .select('id')
    .eq('status', 'active')
    .maybeSingle();
  if (cartError) throw cartError;
  if (!cart) return [];
  const { data, error } = await client
    .from('cart_items')
    .select('product_id,variant_id,quantity')
    .eq('cart_id', cart.id);
  if (error) throw error;
  return (data ?? []).flatMap((row) => {
    const product = products.find((item) => item.id === row.product_id);
    if (!product) return [];
    const variant = product.variants?.find((item) => item.id === row.variant_id);
    return [{
      product,
      quantity: row.quantity,
      variantId: row.variant_id ?? undefined,
      selectedVariant: variant?.name,
      selectedMaterial: variant?.material ?? product.material,
      selectedSize: variant?.size ?? 'Padrão',
      unitPrice: product.price + (variant?.priceDelta ?? 0)
    }];
  });
}

export async function loadFavoriteIds(): Promise<string[]> {
  const { data, error } = await requireSupabase().from('favorites').select('product_id');
  if (error) throw error;
  return (data ?? []).map((row) => row.product_id);
}

export async function setFavorite(productId: string, favorite: boolean) {
  const client = requireSupabase();
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError || !auth.user) throw authError ?? new Error('Authentication required');
  if (favorite) {
    const { error } = await client.from('favorites').upsert({ user_id: auth.user.id, product_id: productId });
    if (error) throw error;
  } else {
    const { error } = await client.from('favorites').delete().eq('product_id', productId);
    if (error) throw error;
  }
}

export async function placeOrder(input: {
  cartId: string;
  address: {
    label: string;
    recipientName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode?: string;
  };
  paymentMethod: 'transfer' | 'pos' | 'card';
  couponCode?: string;
  deliveryNotes?: string;
}) {
  const client = requireSupabase();
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError || !auth.user) throw authError ?? new Error('Authentication required');
  const { data: address, error: addressError } = await client
    .from('addresses')
    .insert({
      user_id: auth.user.id,
      label: input.address.label,
      recipient_name: input.address.recipientName,
      phone: input.address.phone,
      line1: input.address.line1,
      line2: input.address.line2 || null,
      city: input.address.city,
      province: input.address.province,
      postal_code: input.address.postalCode || null
    })
    .select('id')
    .single();
  if (addressError) throw addressError;

  const { data: orderId, error } = await client.rpc('place_order', {
    p_cart_id: input.cartId,
    p_address_id: address.id,
    p_payment_method: input.paymentMethod,
    p_coupon_code: input.couponCode?.trim() || null,
    p_delivery_notes: input.deliveryNotes?.trim() || null
  });
  if (error) throw error;
  const { data, error: orderError } = await client
    .from('orders')
    .select('id,order_number,total,status')
    .eq('id', orderId)
    .single();
  if (orderError) throw orderError;
  return data as { id: string; order_number: string; total: number; status: string };
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await requireSupabase()
    .from('orders')
    .select('*, order_items(*, products(*, product_images(public_url,position)))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    date: row.created_at,
    total: Number(row.total),
    status: row.status,
    phaseName: row.status,
    customerName: '',
    deliveryAddress: '',
    items: (row.order_items ?? []).map((item: Record<string, any>) => ({
      product: {
        id: item.product_id,
        sku: item.sku,
        title: item.product_name,
        category: '',
        ambiente: '',
        price: Number(item.unit_price),
        rating: 0,
        reviewCount: 0,
        images: (item.products?.product_images ?? []).map((image: { public_url: string }) => image.public_url),
        description: '',
        material: item.variant_name ?? '',
        inStock: true
      },
      quantity: item.quantity,
      refCode: item.sku,
      details: item.variant_name,
      price: Number(item.line_total)
    }))
  }));
}
