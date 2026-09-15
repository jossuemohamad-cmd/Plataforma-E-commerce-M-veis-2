import React, { useState, useEffect } from 'react';
import { ActiveScreen, Product, CartItem } from './types';
import { AETHEL_PRODUCTS } from './data/aethelData';

import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';

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
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');

  // Products Database (persisted with fallback to AETHEL_PRODUCTS)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aethel_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].sku?.includes('SOF-NUV')) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored products', e);
      }
    }
    return AETHEL_PRODUCTS;
  });

  // Active selected product for ProductDetailScreen
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aethel_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored cart', e);
      }
    }
    // Default matching prototype checkout: Sofá Nuvola + Poltrona Kyoto + Mesa Monolito
    return [
      {
        product: AETHEL_PRODUCTS[0],
        quantity: 1,
        selectedMaterial: 'Linho Natural Cru',
        selectedSize: '280 cm',
        unitPrice: 78500
      },
      {
        product: AETHEL_PRODUCTS[1],
        quantity: 1,
        selectedMaterial: 'Bouclé Italiano',
        selectedSize: 'Padrão',
        unitPrice: 34820
      },
      {
        product: AETHEL_PRODUCTS[2],
        quantity: 1,
        selectedMaterial: 'Mármore Travertino Navona',
        selectedSize: '140 x 80 cm',
        unitPrice: 26000
      }
    ];
  });

  // Favorites State (Persisted)
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aethel_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored favorites', e);
      }
    }
    return [AETHEL_PRODUCTS[0], AETHEL_PRODUCTS[1]];
  });

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

  // Persist Data
  useEffect(() => {
    localStorage.setItem('aethel_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aethel_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aethel_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handlers
  const handleNavigate = (screen: ActiveScreen) => {
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
    unitPrice?: number
  ) => {
    setCart((prev) => {
      const priceToUse = unitPrice || product.price;
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedMaterial === selectedMaterial &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedMaterial: selectedMaterial || product.material,
          selectedSize: selectedSize || 'Padrão',
          unitPrice: priceToUse
        }
      ];
    });

    showToast(`"${product.title}" adicionado ao caderno de aquisição!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Peça removida do caderno.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleFavorite = (product: Product) => {
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
  };

  // Product Management Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`"${newProd.title}" registrada com sucesso no acervo!`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    showToast(`"${updatedProd.title}" atualizada.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Peça removida do acervo.');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
      <main className={`flex-1 w-full ${activeScreen === 'home' ? '' : 'pt-[112px] sm:pt-[116px]'}`}>
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1c1b] text-white px-5 py-3.5 shadow-2xl border border-white/10 flex items-center gap-3 animate-fade-in">
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
