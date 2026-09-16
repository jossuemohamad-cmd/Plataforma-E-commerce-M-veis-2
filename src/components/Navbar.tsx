import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ActiveScreen, Product, Currency, Language } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import edenLogo from '../assets/images/eden-logo-official.png';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  cartCount: number;
  isCartOpen?: boolean;
  onOpenCart: () => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  cartCount,
  isCartOpen = false,
  onOpenCart,
  favoritesCount = 0,
  onOpenFavorites,
  searchQuery,
  onSearchChange,
  products = [],
  onSelectProduct
}) => {
  const {
    currency, setCurrency, lang, setLang, formatPrice, t,
    getExchangeLabel, ratesLoading, ratesUpdatedAt, rateError, translationError
  } = useLocalization();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const catalog = products;
  const tickerItems = [
    <>Frete cortesia para mobiliário assinado acima de {formatPrice(50000)} • Consultoria B2B e Residencial</>,
    <>Vendas a retalho • +258 87 000 3388 • esales@esm.co.mz</>,
    <>Personalização de produtos para responder às necessidades de cada cliente</>,
    <>Fábricas em Matola, Beira e Nampula</>,
    <>Mais do que uma marca, a escolha para um sono saudável</>
  ];

  // Exact pages of the application with translation keys
  const navPages = ([
    { id: 'home', key: 'nav.home', label: t('nav.home', 'Início') },
    { id: 'sobre', key: 'nav.sobre', label: t('nav.sobre', 'Sobre Eden') },
    { id: 'colecoes', key: 'nav.colecoes', label: t('nav.colecoes', 'Coleções') },
    { id: 'catalogo', key: 'nav.loja', label: t('nav.loja', 'Loja') },
    { id: 'showrooms', key: 'nav.sucursais', label: t('nav.sucursais', 'Sucursais') },
    { id: 'contacto', key: 'nav.contacto', label: t('nav.contacto', 'Contacto') }
  ] satisfies { id: ActiveScreen; key: string; label: string }[]);

  // Quick keyword filters for instant search
  const quickKeywords = [
    'Sofá Nuvola',
    'Mármore Travertino',
    'Poltronas',
    'Nogueira',
    'Sala de Estar',
    'Pronta Entrega'
  ];

  // Live "AJAX" product filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return catalog.slice(0, 4);
    }
    return catalog.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCat = (p.category || '').toLowerCase().includes(q);
      const matchAmb = (p.ambiente || '').toLowerCase().includes(q);
      const matchMat = (p.material || '').toLowerCase().includes(q);
      const matchSku = (p.sku || '').toLowerCase().includes(q);
      const matchDes = (p.designer || '').toLowerCase().includes(q);
      const matchStock = q.includes('pronta') && p.inStock;
      const matchTags = (p.tags || []).some((tag) => tag.toLowerCase().includes(q));
      return (
        matchTitle ||
        matchCat ||
        matchAmb ||
        matchMat ||
        matchSku ||
        matchDes ||
        matchStock ||
        matchTags
      );
    });
  }, [searchQuery, catalog]);

  // Focus search input when popup opens & handle ESC key
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsSearchModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isSearchModalOpen]);

  const handleFavClick = () => {
    if (onOpenFavorites) {
      onOpenFavorites();
    } else {
      onNavigate('minha-conta');
    }
  };

  const handleSelectSearchResult = (product: Product) => {
    setIsSearchModalOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onNavigate('catalogo');
    }
  };

  const handleViewAllCatalog = () => {
    setIsSearchModalOpen(false);
    onNavigate('catalogo');
  };

  const isMenuSectionActive = mobileMenuOpen || [
    'sobre', 'colecoes', 'showrooms', 'contacto', 'minha-conta', 'autenticacao'
  ].includes(activeScreen);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-[#faf9f7]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e9e8e6]/80">
        {/* Top Announcement Ribbon */}
        <div className="eden-ticker-bar hidden bg-[#132240] text-white border-b border-[#132240] sm:block">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-8 sm:h-9 flex items-center justify-between font-['Plus_Jakarta_Sans'] text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-semibold gap-3">
            <div className="eden-ticker min-w-0 flex-1 overflow-hidden" aria-label="Informações e novidades Eden">
              <div className="eden-ticker-track flex w-max items-center whitespace-nowrap">
                {[false, true].map((duplicate) => (
                  <div
                    key={duplicate ? 'ticker-copy' : 'ticker-original'}
                    className="eden-ticker-group flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12"
                    aria-hidden={duplicate || undefined}
                  >
                    {tickerItems.map((item, index) => (
                      <span key={index} className="flex items-center gap-8 sm:gap-12">
                        <span>{item}</span>
                        <span className="h-1 w-1 rounded-full bg-white/60" aria-hidden="true" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex self-stretch items-center gap-2 sm:gap-3 shrink-0 bg-[#FDCB00] px-3 sm:px-4 text-black">
              {/* Currency Selector with Dropdown */}
              <div className="relative" data-no-translate>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyMenuOpen(!currencyMenuOpen);
                    setLangMenuOpen(false);
                  }}
                  className="flex h-full items-center gap-1 cursor-pointer px-2 text-black transition-colors hover:bg-black/10"
                  title="Alterar Moeda (MZN, USD, EUR)"
                >
                  <span className="font-bold text-black">
                    {currency}
                  </span>
                  <span className="material-symbols-outlined text-[14px]">
                    {currencyMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {currencyMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#e9e8e6] shadow-xl py-1 z-50 min-w-[250px] text-xs font-['Plus_Jakarta_Sans']">
                    <button
                      onClick={() => {
                        setCurrency('MZN');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        currency === 'MZN' ? 'bg-[#faf9f7] font-bold text-[#1a1c1b]' : 'hover:bg-[#f4f3f1] text-[#4a4640]'
                      }`}
                    >
                      <span>MZN • Moçambique</span>
                      {currency === 'MZN' && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('USD');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        currency === 'USD' ? 'bg-[#faf9f7] font-bold text-[#1a1c1b]' : 'hover:bg-[#f4f3f1] text-[#4a4640]'
                      }`}
                    >
                      <span>$ • Dólar (USD)</span>
                      {currency === 'USD' && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('EUR');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        currency === 'EUR' ? 'bg-[#faf9f7] font-bold text-[#1a1c1b]' : 'hover:bg-[#f4f3f1] text-[#4a4640]'
                      }`}
                    >
                      <span>€ • Euro (EUR)</span>
                      {currency === 'EUR' && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                    <div className="border-t border-[#e9e8e6] mt-1 px-3 py-2.5 normal-case tracking-normal space-y-1 text-[11px] text-[#4a4640]">
                      {ratesLoading ? <span>A atualizar taxas…</span> : rateError ? <span className="text-red-700">{rateError}</span> : <>
                        <span className="block font-semibold">{getExchangeLabel('USD', 'MZN')}</span>
                        <span className="block font-semibold">{getExchangeLabel('EUR', 'MZN')}</span>
                        <span className="block">{getExchangeLabel('USD', 'EUR')}</span>
                        {ratesUpdatedAt && <span className="block text-[9px] text-[#7c766f]">Atualização: {ratesUpdatedAt.toLocaleDateString('pt-MZ')}</span>}
                      </>}
                      <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="block text-[9px] text-[#7d5540] hover:underline">Rates by ExchangeRate-API</a>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-black/50">|</span>

              {/* Language Selector with Dropdown */}
              <div className="relative" data-no-translate>
                <button
                  type="button"
                  onClick={() => {
                    setLangMenuOpen(!langMenuOpen);
                    setCurrencyMenuOpen(false);
                  }}
                  className="flex h-full items-center gap-1 cursor-pointer px-2 text-black transition-colors hover:bg-black/10"
                  title="Alterar Idioma (Português / English)"
                >
                  <span className="font-bold text-black">{lang}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {langMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#e9e8e6] shadow-xl py-1 z-50 min-w-[120px] text-xs font-['Plus_Jakarta_Sans']">
                    <button
                      onClick={() => {
                        setLang('PT');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        lang === 'PT' ? 'bg-[#faf9f7] font-bold text-[#1a1c1b]' : 'hover:bg-[#f4f3f1] text-[#4a4640]'
                      }`}
                    >
                      <span>Português</span>
                      {lang === 'PT' && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLang('EN');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        lang === 'EN' ? 'bg-[#faf9f7] font-bold text-[#1a1c1b]' : 'hover:bg-[#f4f3f1] text-[#4a4640]'
                      }`}
                    >
                      <span>English</span>
                      {lang === 'EN' && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                    {translationError && <p className="px-3 py-2 border-t border-[#e9e8e6] text-[10px] normal-case tracking-normal text-red-700">{translationError}</p>}
                    <a href="https://mymemory.translated.net" target="_blank" rel="noreferrer" className="block px-3 py-2 border-t border-[#e9e8e6] text-[9px] normal-case tracking-normal text-[#7d5540] hover:underline">Automatic translation by MyMemory</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="h-16 sm:h-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex h-full items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDCB00] focus-visible:ring-offset-2 shrink-0"
            aria-label="Ir para a página inicial da Eden"
          >
            <img
              src={edenLogo}
              alt="Eden — Colchões e Mobília"
              className="h-11 w-auto max-w-[94px] object-contain sm:h-16 sm:max-w-[158px]"
            />
          </button>

          {/* Compact mobile controls */}
          <div className="ml-auto flex items-center gap-1.5 sm:hidden" data-no-translate>
            <label className="relative flex h-9 items-center rounded-[10px] bg-[#FDCB00] pl-3 pr-7 text-[11px] font-bold text-black shadow-sm">
              <span className="sr-only">Alterar moeda</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as Currency)}
                className="appearance-none bg-transparent pr-0 font-bold text-black outline-none"
                aria-label="Alterar moeda"
              >
                <option value="MZN">MZN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 text-[16px]">expand_more</span>
            </label>
            <label className="relative flex h-9 items-center rounded-[10px] bg-[#FDCB00] pl-3 pr-7 text-[11px] font-bold text-black shadow-sm">
              <span className="sr-only">Alterar idioma</span>
              <select
                value={lang}
                onChange={(event) => setLang(event.target.value as Language)}
                className="appearance-none bg-transparent font-bold text-black outline-none"
                aria-label="Alterar idioma"
              >
                <option value="PT">PT</option>
                <option value="EN">EN</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 text-[16px]">expand_more</span>
            </label>
            <button
              type="button"
              onClick={() => onNavigate(user ? 'minha-conta' : 'autenticacao')}
              className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#FDCB00] bg-[#f4f6f9] text-[#132240] shadow-sm"
              aria-label={user ? 'Abrir minha conta' : 'Iniciar sessão'}
              title={user ? user.name : 'Iniciar sessão'}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : user ? (
                <span className="text-sm font-bold uppercase">{user.name.trim().charAt(0) || 'E'}</span>
              ) : (
                <span className="material-symbols-outlined text-[21px]">person</span>
              )}
            </button>
          </div>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 shrink-0">
            {navPages.map((page) => {
              const isActive = activeScreen === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => onNavigate(page.id)}
                  className={`font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] transition-all pb-1 border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'text-[#005EA4] border-[#FDCB00] font-bold'
                      : 'text-[#132240] border-transparent font-semibold hover:text-[#005EA4] hover:border-[#FDCB00]'
                  }`}
                >
                  {page.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons Cluster */}
          <div className="hidden items-center gap-1.5 sm:flex sm:gap-2.5 shrink-0">
            {/* Search Trigger Button (icon only - opens AJAX popup) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="text-[#4a4640] hover:text-[#1a1c1b] p-2 hover:bg-[#efeeec] rounded-full transition-colors flex items-center justify-center group"
              title={t('search.placeholder', 'Pesquisar no acervo')}
              aria-label="Abrir pesquisa"
            >
              <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
                search
              </span>
            </button>

            {/* Favorites Icon */}
            <button
              onClick={handleFavClick}
              className="relative text-[#4a4640] hover:text-[#1a1c1b] p-2.5 hover:bg-[#efeeec] rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="Ver Favoritos"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {favoritesCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#FDCB00] text-[#132240] font-['Plus_Jakarta_Sans'] text-[9px] font-bold flex items-center justify-center leading-none">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={onOpenCart}
              className="relative text-[#4a4640] hover:text-[#1a1c1b] p-2.5 hover:bg-[#efeeec] rounded-full transition-colors flex items-center justify-center"
              title="Ver Carrinho de Compras"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#005EA4] text-white font-['Plus_Jakarta_Sans'] text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar with Role Tag */}
            {user ? <div
              data-no-translate
              onClick={() => onNavigate('minha-conta')}
              className="hidden sm:flex items-center gap-1.5 pl-1 cursor-pointer group"
              title={`Conta de cliente: ${user.name}`}
            >
              <div className="relative">
                <img
                  src={user.avatar || '/images/catalog/3e19a9bf07b7eeac9c6e.jpg'}
                  alt={user.name}
                  className={`w-8 h-8 rounded-full object-cover ring-2 transition-all ${
                    'ring-[#e9e8e6] group-hover:ring-[#005EA4]'
                  }`}
                />
              </div>
            </div> : <button
              type="button"
              onClick={() => onNavigate('autenticacao')}
              className="hidden sm:flex p-2.5 text-[#4a4640] hover:text-black"
              aria-label="Iniciar sessão"
              title="Iniciar sessão"
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
            </button>}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hidden p-2.5 text-[#4a4640] hover:text-[#1a1c1b] rounded-full hover:bg-[#efeeec] sm:flex xl:hidden"
              aria-label="Menu de Navegação"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-[#e3e2e0] px-4 sm:px-6 py-4 sm:py-5 space-y-4 shadow-xl max-h-[calc(100dvh-8.75rem)] sm:max-h-[calc(100dvh-7.25rem)] overflow-y-auto overscroll-contain">
            {/* Currency & Language in Mobile Drawer */}
            <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e9e8e6] text-xs" data-no-translate>
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-[#7c766f]">Moeda:</span>
                {(['MZN', 'USD', 'EUR'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 text-[11px] font-bold ${
                      currency === c ? 'bg-[#FDCB00] text-black' : 'bg-[#f4f3f1] text-[#4a4640]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-[#7c766f]">Idioma:</span>
                {(['PT', 'EN'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-1 text-[11px] font-bold ${
                      lang === l ? 'bg-[#FDCB00] text-black' : 'bg-[#f4f3f1] text-[#4a4640]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden text-[10px] text-[#7c766f] space-y-0.5 sm:block" data-no-translate>
              <span className="block">{getExchangeLabel('USD', 'MZN')} • {getExchangeLabel('EUR', 'MZN')}</span>
              {translationError && <span className="block text-red-700">{translationError}</span>}
            </div>

            {/* Search Shortcut in Mobile Drawer */}
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchModalOpen(true);
              }}
              className="hidden items-center justify-between bg-[#f4f3f1] p-3 text-xs text-[#7c766f] cursor-pointer hover:bg-[#ebe9e6] sm:flex"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#1a1c1b]">search</span>
                <span className="truncate">{t('search.placeholder', 'Pesquisar no acervo autoral...')}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-[#7d5540]">AJAX</span>
            </div>

            {/* Mobile Exact Pages List */}
            <div className="flex flex-col space-y-1 font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-[0.14em] font-semibold text-[#1a1c1b]">
              {navPages.map((page) => {
                const isActive = activeScreen === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      onNavigate(page.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left py-2.5 px-3 flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#005EA4] text-white font-bold'
                        : 'text-[#132240] hover:bg-[#eef7fc] hover:text-[#005EA4]'
                    }`}
                  >
                    <span>{page.label}</span>
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-widest font-normal opacity-80">
                        Ativo
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#e9e8e6] pt-3 sm:hidden">
              <button
                type="button"
                onClick={() => {
                  handleFavClick();
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[#f4f6f9] px-3 text-xs font-bold text-[#132240]"
              >
                <span className="material-symbols-outlined text-[20px]">favorite</span>
                Favoritos {favoritesCount > 0 ? `(${favoritesCount})` : ''}
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate(user ? 'minha-conta' : 'autenticacao');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[#f4f6f9] px-3 text-xs font-bold text-[#132240]"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                {user ? 'Minha conta' : 'Entrar'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* App-style mobile navigation */}
      <nav className="eden-mobile-dock fixed inset-x-0 bottom-0 z-40 border-t border-[#dbe3ec] bg-white/95 px-2 pt-1.5 shadow-[0_-8px_24px_rgba(19,34,64,0.12)] backdrop-blur-xl sm:hidden" aria-label="Navegação móvel">
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-end">
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            aria-current={activeScreen === 'home' ? 'page' : undefined}
            className={`relative flex h-full flex-col items-center justify-center gap-0.5 rounded-[10px] text-[10px] font-bold transition-colors ${activeScreen === 'home' ? 'bg-[#eef7fc] text-[#005EA4]' : 'text-[#596579]'}`}
          >
            {activeScreen === 'home' && <span className="absolute top-0 h-1 w-7 rounded-b-full bg-[#FDCB00]" />}
            <span className="material-symbols-outlined text-[23px]">home</span>
            Início
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('catalogo');
              setMobileMenuOpen(false);
            }}
            aria-current={activeScreen === 'catalogo' || activeScreen === 'produto' ? 'page' : undefined}
            className={`relative flex h-full flex-col items-center justify-center gap-0.5 rounded-[10px] text-[10px] font-bold transition-colors ${activeScreen === 'catalogo' || activeScreen === 'produto' ? 'bg-[#eef7fc] text-[#005EA4]' : 'text-[#596579]'}`}
          >
            {(activeScreen === 'catalogo' || activeScreen === 'produto') && <span className="absolute top-0 h-1 w-7 rounded-b-full bg-[#FDCB00]" />}
            <span className="material-symbols-outlined text-[23px]">storefront</span>
            Loja
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsSearchModalOpen(true);
            }}
            aria-current={isSearchModalOpen ? 'page' : undefined}
            className={`flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${isSearchModalOpen ? 'text-[#005EA4]' : 'text-[#132240]'}`}
          >
            <span className={`-mt-5 grid h-12 w-12 place-items-center rounded-full border-4 bg-[#FDCB00] shadow-lg transition-colors ${isSearchModalOpen ? 'border-[#005EA4]' : 'border-white'}`}>
              <span className="material-symbols-outlined text-[24px]">search</span>
            </span>
            Buscar
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            aria-current={isCartOpen || activeScreen === 'checkout' ? 'page' : undefined}
            className={`relative flex h-full flex-col items-center justify-center gap-0.5 rounded-[10px] text-[10px] font-bold transition-colors ${isCartOpen || activeScreen === 'checkout' ? 'bg-[#eef7fc] text-[#005EA4]' : 'text-[#596579]'}`}
          >
            {(isCartOpen || activeScreen === 'checkout') && <span className="absolute top-0 h-1 w-7 rounded-b-full bg-[#FDCB00]" />}
            <span className="relative">
              <span className="material-symbols-outlined text-[23px]">shopping_bag</span>
              {cartCount > 0 && <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#005EA4] px-1 text-[9px] text-white">{cartCount}</span>}
            </span>
            Carrinho
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-current={isMenuSectionActive ? 'page' : undefined}
            className={`relative flex h-full flex-col items-center justify-center gap-0.5 rounded-[10px] text-[10px] font-bold transition-colors ${isMenuSectionActive ? 'bg-[#eef7fc] text-[#005EA4]' : 'text-[#596579]'}`}
          >
            {isMenuSectionActive && <span className="absolute top-0 h-1 w-7 rounded-b-full bg-[#FDCB00]" />}
            <span className="material-symbols-outlined text-[23px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            Menu
          </button>
        </div>
      </nav>

      {/* =========================================================
          POPUP DE PESQUISA COM FILTRO EM TEMPO REAL ("AJAX")
          ========================================================= */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchModalOpen(false);
            }
          }}
        >
          <div className="bg-white max-w-3xl w-full border border-[#e9e8e6] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-[#e9e8e6] bg-[#faf9f7] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7d5540] text-[24px]">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('search.placeholder', 'Pesquisar por peça, estilo, material, arquiteto ou SKU...')}
                className="flex-1 bg-transparent text-[#1a1c1b] placeholder:text-[#8C857B] text-sm sm:text-base font-['Plus_Jakarta_Sans'] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-[#7c766f] hover:text-black p-1 text-xs uppercase font-semibold flex items-center gap-1"
                  title="Limpar busca"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  <span className="hidden sm:inline">{t('search.clean', 'Limpar')}</span>
                </button>
              )}
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1.5 text-[#4a4640] hover:text-black border border-[#e9e8e6] hover:bg-[#efeeec] transition-colors ml-1"
                title="Fechar (ESC)"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Filter Tags */}
            <div className="px-4 sm:px-5 py-3 bg-white border-b border-[#f0eee9] flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7c766f] shrink-0">
                {t('search.suggestions', 'Sugestões:')}
              </span>
              {quickKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => onSearchChange(kw)}
                  className={`text-[11px] font-['Plus_Jakarta_Sans'] px-2.5 py-1 transition-colors shrink-0 ${
                    searchQuery.toLowerCase() === kw.toLowerCase()
                      ? 'bg-[#1a1c1b] text-white font-medium'
                      : 'bg-[#f4f3f1] text-[#4a4640] hover:bg-[#e9e8e6] hover:text-[#1a1c1b]'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Results Header */}
            <div className="px-4 sm:px-5 py-2.5 bg-[#f9f8f6] border-b border-[#f0eee9] flex items-center justify-between text-xs text-[#7c766f]">
              <span className="font-semibold text-[#1a1c1b]">
                {searchQuery.trim()
                  ? `${searchResults.length} ${
                      searchResults.length === 1
                        ? t('search.single_found', 'peça encontrada')
                        : t('search.found', 'peças encontradas')
                    }`
                  : 'Peças em Destaque no Acervo'}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono text-[#7d5540] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7d5540] animate-pulse"></span>
                {t('search.realtime', 'Busca em Tempo Real (AJAX)')}
              </span>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto divide-y divide-[#f0eee9] flex-1 p-2 sm:p-3">
              {searchResults.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <span className="material-symbols-outlined text-4xl text-[#cdc5bd] mb-2 block">
                    search_off
                  </span>
                  <h4 className="font-['Playfair_Display'] text-lg text-[#1a1c1b] mb-1">
                    {t('search.no_results', 'Nenhum resultado encontrado')}
                  </h4>
                  <p className="text-xs text-[#7c766f] max-w-sm mx-auto">
                    Não encontramos nenhuma peça com "{searchQuery}". Tente buscar por termos como "Sofás", "Travertino" ou "Nogueira".
                  </p>
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectSearchResult(product)}
                    className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 hover:bg-[#faf9f7] cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-[#efeeec] shrink-0 border border-[#e9e8e6] group-hover:opacity-90"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#7d5540] bg-[#f4ede7] px-1.5 py-0.5">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#7c766f]">
                          SKU: {product.sku}
                        </span>
                        {product.inStock && (
                          <span className="hidden sm:inline-block text-[9px] uppercase font-bold bg-[#efeeec] text-[#1a1c1b] px-1.5 py-0.5">
                            {t('badge.instock', 'Pronta Entrega')}
                          </span>
                        )}
                      </div>

                      <h4 className="font-['Playfair_Display'] text-sm sm:text-base text-[#1a1c1b] font-medium group-hover:text-[#7d5540] transition-colors truncate">
                        {product.title}
                      </h4>

                      <p className="text-[11px] text-[#7c766f] truncate">
                        {product.material}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-xs sm:text-sm text-[#1a1c1b]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] line-through text-[#8C857B]">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-[#7c766f] group-hover:text-black group-hover:translate-x-0.5 transition-all">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-[#f4f3f1] border-t border-[#e9e8e6] flex items-center justify-between gap-3">
              <span className="text-[10px] text-[#7c766f] hidden sm:inline">
                Pressione <kbd className="px-1.5 py-0.5 bg-white border border-[#cdc5bd] text-[9px] font-mono">ESC</kbd> para fechar
              </span>

              <button
                onClick={handleViewAllCatalog}
                className="w-full sm:w-auto px-5 py-2 bg-black text-white hover:bg-[#7d5540] text-xs font-semibold uppercase tracking-wider transition-colors ml-auto flex items-center justify-center gap-1.5"
              >
                <span>{t('search.view_all', 'Ver todos os resultados no Catálogo')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
