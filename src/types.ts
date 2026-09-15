export type ActiveScreen = 
  | 'home'
  | 'sobre'
  | 'colecoes'
  | 'contacto'
  | 'catalogo'
  | 'produto'
  | 'produto-nuvola'
  | 'checkout'
  | 'autenticacao'
  | 'minha-conta'
  | 'showrooms'
  | 'gestao'
  | 'dashboard'
  | 'administracao';

export type Currency = 'MZN' | 'USD' | 'EUR';
export type Language = 'PT' | 'EN';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'architect' | 'client';
  membershipLevel?: string;
  firmName?: string;
  nuit?: string;
  phone?: string;
  avatar?: string;
  accountType?: 'residential' | 'architect';
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  material?: string;
  color?: string;
  size?: string;
  priceDelta: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface ColorSwatch {
  name: string;
  color: string;
  bgClass?: string;
  imageIndex?: number;
}

export interface MaterialOption {
  name: string;
  color: string;
  extraPrice: number;
}

export interface SizeOption {
  label: string;
  subLabel: string;
  extraPrice: number;
  custom?: boolean;
}

export interface ProductDimensions {
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
}

export interface Product {
  id: string;
  slug?: string;
  sku: string;
  title: string;
  category: string;
  ambiente: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  designer?: string;
  material: string;
  badge?: string;
  inStock: boolean;
  stockCount?: number;
  featured?: boolean;
  isNew?: boolean;
  tags?: string[];
  dimensions?: ProductDimensions | string;
  colorSwatches?: ColorSwatch[];
  materialOptions?: MaterialOption[];
  sizeOptions?: SizeOption[];
  variants?: ProductVariant[];
  specs?: {
    [key: string]: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMaterial?: string;
  selectedSize?: string;
  selectedVariant?: string;
  variantId?: string;
  unitPrice: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  refCode?: string;
  details?: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  phaseNumber?: number; // 1 to 5 for progress tracker
  phaseName?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  customerName: string;
  customerNuit?: string;
  deliveryAddress?: string;
}

export interface ShowroomLocation {
  id: string;
  provinceKey?: string;
  provinceName?: string;
  cityName?: string;
  city?: string;
  title?: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  hours: string;
  image: string;
  tag?: string;
  badgeText?: string;
  curator?: string;
  curationFocus?: string;
  description?: string;
  areasInExhibition?: string;
  services?: string[];
  isFlagship?: boolean;
}

export interface FilterOptions {
  search: string;
  category: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onlyInStock: boolean;
  minPrice: number;
  maxPrice: number;
}
