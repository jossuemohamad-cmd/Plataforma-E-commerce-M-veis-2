import React, { createContext, useContext, useState } from 'react';
import { Currency, Language } from '../types';

interface LocalizationContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lang: Language;
  setLang: (l: Language) => void;
  formatPrice: (amountInMZN: number) => string;
  t: (key: string, fallback?: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  PT: {
    // Navigation
    'nav.home': 'Início',
    'nav.catalogo': 'Coleções',
    'nav.showrooms': 'Showrooms',
    'nav.minha_conta': 'Minha Conta',
    'nav.portal_vip': 'Portal VIP',
    'nav.gestao': 'Gestão Acervo',
    'nav.dashboard': 'Painel B2B',
    'ribbon.text': 'Frete cortesia para mobiliário assinado acima de 50.000 MT • Consultoria B2B e Residencial',
    'search.placeholder': 'Pesquisar por peça, estilo, material, arquiteto ou SKU...',
    'search.suggestions': 'Sugestões:',
    'search.realtime': 'Busca em Tempo Real (AJAX)',
    'search.view_all': 'Ver todos os resultados no Catálogo',
    'search.no_results': 'Nenhum resultado encontrado',
    'search.clean': 'Limpar',
    'search.found': 'peças encontradas',
    'search.single_found': 'peça encontrada',

    // Hero
    'hero.badge': 'Lançamento Coleção 2025',
    'hero.title': 'Mobiliário Autoral Onde a Nobreza da Madeira Encontra a Pureza das Formas',
    'hero.subtitle': 'Peças exclusivas desenhadas para resistir às tendências e acolher a vida contemporânea com sofisticação tátil, harmonia visual e presença escultural.',
    'hero.cta_explore': 'Explorar Coleção',
    'hero.cta_virtual': 'Visitar Showroom Virtual',
    'hero.scenario_title': 'Cenário Arquitetural',
    'hero.scenario_name': 'Living Nuvola & Pátio',
    'hero.scenario_loc': 'Maputo • Residencial Privado 04',

    // Common buttons & badges
    'btn.add_to_cart': 'Adicionar ao Caderno',
    'btn.checkout': 'Finalizar Pedido',
    'btn.back': 'Voltar',
    'btn.cancel': 'Cancelar',
    'btn.save': 'Salvar',
    'btn.filter': 'Filtros',
    'btn.view_product': 'Ver Peça',
    'btn.login': 'Iniciar Sessão',
    'btn.register': 'Criar Conta Exclusiva',
    'btn.quick_add': 'Quick Add',
    'badge.instock': 'Pronta Entrega',
    'badge.order': 'Sob Encomenda',
    'badge.fsc': 'Madeira FSC Maciça',
    'badge.warranty': '24 Meses Garantia',
    'badge.white_glove': 'Entrega Luva Branca',
    'badge.certified': 'Certificado Autoral',

    // Screens
    'catalog.title': 'Acervo & Coleções 2025',
    'catalog.subtitle': 'Mobiliário de marcenaria artesanal e pedras nobres com curadoria contemporânea.',
    'cart.title': 'Caderno de Compras',
    'cart.empty': 'O seu caderno de aquisição está vazio.',
    'checkout.title': 'Finalização de Pedido',
    'showrooms.title': 'Rede de Showrooms & Espaços',
    'management.title': 'Gestão Curatorial do Acervo',
    'dashboard.title': 'Painel Executivo B2B & Oficinas'
  },
  EN: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalogo': 'Collections',
    'nav.showrooms': 'Showrooms',
    'nav.minha_conta': 'My Account',
    'nav.portal_vip': 'VIP Portal',
    'nav.gestao': 'Collection Mgmt',
    'nav.dashboard': 'B2B Dashboard',
    'ribbon.text': 'Complimentary white-glove delivery on orders above $800 • B2B & Residential Consulting',
    'search.placeholder': 'Search by piece, style, noble material, architect or SKU...',
    'search.suggestions': 'Suggestions:',
    'search.realtime': 'Real-Time Live Search (AJAX)',
    'search.view_all': 'View all results in Catalog',
    'search.no_results': 'No pieces found',
    'search.clean': 'Clear',
    'search.found': 'pieces found',
    'search.single_found': 'piece found',

    // Hero
    'hero.badge': '2025 Signature Collection',
    'hero.title': 'Authorial Furniture Where the Nobility of Wood Meets Pure Geometry',
    'hero.subtitle': 'Bespoke sculptural furniture crafted to transcend trends and embrace contemporary living with tactile refinement and visual harmony.',
    'hero.cta_explore': 'Explore Collection',
    'hero.cta_virtual': 'Visit Virtual Showroom',
    'hero.scenario_title': 'Architectural Setting',
    'hero.scenario_name': 'Living Nuvola & Patio',
    'hero.scenario_loc': 'Maputo • Private Residence 04',

    // Common buttons & badges
    'btn.add_to_cart': 'Add to Selection',
    'btn.checkout': 'Proceed to Checkout',
    'btn.back': 'Back',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.filter': 'Filters',
    'btn.view_product': 'View Piece',
    'btn.login': 'Sign In',
    'btn.register': 'Create VIP Account',
    'btn.quick_add': 'Quick Add',
    'badge.instock': 'In Stock',
    'badge.order': 'Made to Order',
    'badge.fsc': 'FSC Solid Hardwood',
    'badge.warranty': '24-Month Warranty',
    'badge.white_glove': 'White-Glove Delivery',
    'badge.certified': 'Certified Artwork',

    // Screens
    'catalog.title': 'Signature Collection 2025',
    'catalog.subtitle': 'Artisanal joinery and noble minerals curated for refined architectural spaces.',
    'cart.title': 'Purchase Selection',
    'cart.empty': 'Your purchase selection is currently empty.',
    'checkout.title': 'Order Checkout',
    'showrooms.title': 'Showroom Network & Galleries',
    'management.title': 'Curatorial Inventory Management',
    'dashboard.title': 'B2B Executive & Atelier Dashboard'
  }
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('aethel_currency') as Currency) || 'MZN';
  });

  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('aethel_lang') as Language) || 'PT';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('aethel_currency', c);
  };

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('aethel_lang', l);
  };

  const formatPrice = (amountInMZN: number): string => {
    if (currency === 'USD') {
      const usd = Math.round(amountInMZN / 64);
      return `$${usd.toLocaleString('en-US')} USD`;
    }
    if (currency === 'EUR') {
      const eur = Math.round(amountInMZN / 70);
      return `€${eur.toLocaleString('de-DE')} EUR`;
    }
    return `${Math.round(amountInMZN).toLocaleString('pt-MZ')} MT`;
  };

  const t = (key: string, fallback?: string): string => {
    const table = DICTIONARY[lang] || DICTIONARY.PT;
    return table[key] || fallback || key;
  };

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        setCurrency,
        lang,
        setLang,
        formatPrice,
        t
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return ctx;
};
