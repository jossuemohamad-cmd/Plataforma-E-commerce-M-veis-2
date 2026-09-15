import { useState, useEffect, useRef } from 'react';
import { ActiveScreen, Product, CartItem } from './types';
import { AETHEL_PRODUCTS } from './data/aethelData';

import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';
import { listProducts } from './services/catalogService';
import { loadCart, loadFavoriteIds, placeOrder, saveCart, setFavorite } from './services/commerceService';
import { deleteProduct, saveProduct } from './services/adminService';
import { cartItemKey, clampQuantity } from './lib/commerce.js';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { AuthScreen } from './components/AuthScreen';
import { MyAccountScreen } from './components/MyAccountScreen';
import { ShowroomsScreen } from './components/ShowroomsScreen';
import { ManagementScreen } from './components/ManagementScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CartDrawer } from './components/CartDrawer';

function AppContent() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');

  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Active selected product for ProductDetailScreen
  const [selectedProduct, setSelectedProduct] = useState<Product>(AETHEL_PRODUCTS[0]);

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aethel_guest_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored cart', e);
      }
    }
    return [];
  });

  // Favorites State (Persisted)
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aethel_guest_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored favorites', e);
      }
    }
    return [];
  });
  const syncedUserId = useRef<string | null>(null);

  // Cart Drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Global Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  useEffect(() => {
    let active = true;
    void listProducts()
      .then((items) => {
        if (!active) return;
        setProducts(items);
        if (items[0]) setSelectedProduct(items[0]);
        setCatalogError(null);
      })
      .catch((error) => active && setCatalogError(error instanceof Error ? error.message : 'Falha ao carregar o catálogo.'))
      .finally(() => active && setCatalogLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user) syncedUserId.current = null;
    if (!user) localStorage.setItem('aethel_guest_cart', JSON.stringify(cart));
  }, [cart, user]);

  useEffect(() => {
    if (!user) localStorage.setItem('aethel_guest_favorites', JSON.stringify(favorites));
  }, [favorites, user]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured || products.length === 0 || syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;
    const guestCart = cart;
    const guestFavorites = favorites;
    void Promise.all([loadCart(products), loadFavoriteIds()]).then(async ([remoteCart, favoriteIds]) => {
      const merged = [...remoteCart];
      for (const guestItem of guestCart) {
        const found = merged.find((item) => cartItemKey(item.product.id, item.variantId) === cartItemKey(guestItem.product.id, guestItem.variantId));
        if (found) found.quantity = clampQuantity(found.quantity + guestItem.quantity, found.product.stockCount ?? 99);
        else merged.push(guestItem);
      }
      setCart(merged);
      const allFavoriteIds = new Set([...favoriteIds, ...guestFavorites.map((item) => item.id)]);
      setFavorites(products.filter((item) => allFavoriteIds.has(item.id)));
      await Promise.all([saveCart(merged), ...guestFavorites.map((item) => setFavorite(item.id, true))]);
      localStorage.removeItem('aethel_guest_cart');
      localStorage.removeItem('aethel_guest_favorites');
    }).catch((error) => showToast(error instanceof Error ? error.message : 'Falha ao sincronizar a conta.'));
  }, [user, products]);

  useEffect(() => {
    if (!user || syncedUserId.current !== user.id || !isSupabaseConfigured) return;
    const timer = window.setTimeout(() => {
      void saveCart(cart).catch((error) => showToast(error instanceof Error ? error.message : 'Falha ao guardar o carrinho.'));
    }, 500);
    return () => window.clearTimeout(timer);
  }, [cart, user]);

  // Handlers
  const handleNavigate = (screen: ActiveScreen) => {
    if ((screen === 'gestao' || screen === 'dashboard') && !isAdmin) {
      showToast('Esta área é exclusiva para administradores.');
      setActiveScreen(user ? 'home' : 'autenticacao');
      return;
    }
    if ((screen === 'minha-conta' || screen === 'checkout') && !user) {
      if (screen === 'checkout') showToast('Inicie sessão para concluir o pedido. O carrinho será preservado.');
      setActiveScreen('autenticacao');
      return;
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('produto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedMaterial?: string,
    selectedSize?: string,
    unitPrice?: number,
    variantId?: string
  ) => {
    setCart((prev) => {
      const priceToUse = unitPrice ?? product.price;
      const materialToUse = selectedMaterial ?? product.material;
      const sizeToUse = selectedSize ?? 'Padrão';
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedMaterial === materialToUse &&
          item.selectedSize === sizeToUse &&
          item.variantId === variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: clampQuantity(
            updated[existingIndex].quantity + quantity,
            product.variants?.find((variant) => variant.id === variantId)?.stockQuantity ?? product.stockCount ?? 99
          )
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedMaterial: materialToUse,
          selectedSize: sizeToUse,
          variantId,
          unitPrice: priceToUse
        }
      ];
    });

    showToast(`"${product.title}" adicionado ao caderno de aquisição!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (itemIndex: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(itemIndex);
      return;
    }
    setCart((prev) =>
      prev.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              quantity: clampQuantity(
                quantity,
                item.product.variants?.find((variant) => variant.id === item.variantId)?.stockQuantity ?? item.product.stockCount ?? 99
              )
            }
          : item
      )
    );
  };

  const handleRemoveCartItem = (itemIndex: number) => {
    setCart((prev) => prev.filter((_, index) => index !== itemIndex));
    showToast('Peça removida do caderno.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (data: Omit<Parameters<typeof placeOrder>[0], 'cartId'>) => {
    if (!user) throw new Error('Inicie sessão para concluir o pedido.');
    const cartId = await saveCart(cart);
    return placeOrder({ ...data, cartId });
  };

  const handleToggleFavorite = (product: Product) => {
    const willFavorite = !favorites.some((item) => item.id === product.id);
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`"${product.title}" removido dos favoritos.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`"${product.title}" guardado no caderno de desejos.`);
        return [...prev, product];
      }
    });
    if (user && isSupabaseConfigured) {
      void setFavorite(product.id, willFavorite).catch((error) =>
        showToast(error instanceof Error ? error.message : 'Falha ao guardar favorito.')
      );
    }
  };

  // Product Management Handlers
  const handleAddProduct = async (newProd: Product) => {
    await saveProduct(newProd);
    setProducts(await listProducts());
    showToast(`"${newProd.title}" registrada com sucesso no acervo!`);
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    await saveProduct(updatedProd);
    setProducts(await listProducts());
    showToast(`"${updatedProd.title}" atualizada.`);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setProducts(await listProducts());
    showToast('Peça removida do acervo.');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (catalogLoading || authLoading) {
    return <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center text-sm text-[#7c766f]">A carregar a experiência EDEN…</div>;
  }

  if (catalogError) {
    return <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-6"><div className="max-w-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{catalogError}</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col selection:bg-[#7d5540] selection:text-white font-['Plus_Jakarta_Sans'] text-[#1a1c1b]">
      {/* Barra de Navegação Principal */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        favoritesCount={favorites.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Container Central dos 9 Ecrãs do Protótipo */}
      <main className={`flex-1 w-full min-w-0 ${activeScreen === 'home' ? '' : 'pt-[96px] sm:pt-[116px]'}`}>
        {activeScreen === 'home' && (
          <HomeScreen
            products={products}
            featuredProducts={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'catalogo' && (
          <CatalogScreen
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeScreen === 'produto' && (
          <ProductDetailScreen
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'checkout' && (
          <CheckoutScreen
            cart={cart}
            onNavigate={handleNavigate}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeScreen === 'autenticacao' && (
          <AuthScreen onNavigate={handleNavigate} />
        )}

        {activeScreen === 'minha-conta' && (
          <MyAccountScreen
            onNavigate={handleNavigate}
            favorites={favorites}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'showrooms' && (
          <ShowroomsScreen onNavigate={handleNavigate} />
        )}

        {activeScreen === 'gestao' && (
          <ManagementScreen
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'dashboard' && (
          <DashboardScreen onNavigate={handleNavigate} />
        )}
      </main>

      {/* Rodapé Curatorial */}
      <Footer onNavigate={handleNavigate} />

      {/* Gaveta Lateral de Caderno de Compras (CartDrawer) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => handleNavigate('checkout')}
        onViewProduct={handleSelectProduct}
      />

      {/* Notificação Toast Flutuante */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-[#1a1c1b] text-white px-4 sm:px-5 py-3.5 shadow-2xl border border-white/10 flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#fec9ae] text-[20px]">
            check_circle
          </span>
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-medium">
            {toast}
          </span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LocalizationProvider>
  );
}
