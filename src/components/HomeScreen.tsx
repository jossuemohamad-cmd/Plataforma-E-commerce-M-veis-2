import React, { useState } from 'react';
import { Product, ActiveScreen } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface HomeScreenProps {
  products?: Product[];
  featuredProducts?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  favorites?: Product[];
  onToggleFavorite: (product: Product) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products: propProducts,
  featuredProducts: propFeaturedProducts,
  onSelectProduct,
  onAddToCart,
  favorites = [],
  onToggleFavorite,
  onNavigate
}) => {
  const { formatPrice, t } = useLocalization();
  const products = propProducts || propFeaturedProducts || [];

  // Highlighted filter tab
  const [activeFilterTab, setActiveFilterTab] = useState('Todos');

  // Hotspot active popover
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1); // default open: Hotspot 1 (Sofá Nuvola)

  // Filter products for "Obras em Destaque"
  const featuredProducts = (products || []).filter((p) => {
    if (activeFilterTab === 'Todos') return true;
    if (activeFilterTab === 'Mais Desejados') return p.rating >= 4.9;
    return (p.ambiente || '').toLowerCase().includes(activeFilterTab.toLowerCase());
  }).slice(0, 6);

  // Gazeta form
  const [gazetteEmail, setGazetteEmail] = useState('');
  const [gazetteDone, setGazetteDone] = useState(false);

  const handleGazetteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gazetteEmail) return;
    setGazetteDone(true);
    setTimeout(() => {
      setGazetteDone(false);
      setGazetteEmail('');
    }, 4000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* ==========================================
          1. HERO SECTION ARQUITETÔNICO (100vh Full Viewport)
          ========================================== */}
      <section className="relative w-full h-screen min-h-[660px] flex items-end pb-12 sm:pb-16 pt-[116px] overflow-hidden bg-black text-white">
        {/* Imagem de Fundo com Scrim Editorial Escuro */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Living room de alto padrão Aethel Studio"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt1H6nSKFrcVw1WThChsR6VGmFhmjmgmFStgpYIfzykfsGxBt3mOtruzm5g2f2yRgEnmcXNh0pGEwgm-k3Pqq1zcb_3kZKnk8qv21q_5GquxCuIrc6LhWrFRSI9wlYUz8MuAvdhJLY6wdX6kV18dGfL6ptsZbdFq61DXJEv_rQXH6NadUGxsuUNiJJIPyxlcRRkcszXh1OwyD8OG5-bQ5HnhyIe4Fy1ZnP3jlGKxKvJajZDW850Mnjlw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            {/* Bloco de Texto Principal */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md mb-4 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fec9ae]"></span>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fec9ae]">
                  {t('hero.badge', 'Lançamento Coleção 2025')}
                </span>
              </div>

              <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-[58px] text-white font-normal tracking-tight leading-[1.08] max-w-3xl">
                {t('hero.title', 'Mobiliário Autoral Onde a Nobreza da Madeira Encontra a Pureza das Formas')}
              </h1>

              <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#cac6c4] mt-4 max-w-2xl leading-relaxed">
                {t('hero.subtitle', 'Peças exclusivas desenhadas para resistir às tendências e acolher a vida contemporânea com sofisticação tátil, harmonia visual e presença escultural.')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-7 pt-1">
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#faf9f7] text-black font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-[#ffdbca] transition-colors"
                >
                  {t('hero.cta_explore', 'Explorar Coleção')}
                </button>
                <button
                  onClick={() => {
                    document.getElementById('showroom-interativo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-7 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                  {t('hero.cta_virtual', 'Visitar Showroom Virtual')}
                </button>
              </div>
            </div>

            {/* Micro-informação Lateral & Paginação */}
            <div className="lg:col-span-4 flex lg:flex-col items-end justify-between lg:justify-end gap-6 text-right">
              <div className="hidden lg:flex flex-col items-end text-[#cac6c4] space-y-1">
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#cdc5bd]">
                  {t('hero.scenario_title', 'Cenário Arquitetural')}
                </span>
                <p className="font-['Playfair_Display'] text-2xl text-white font-normal">
                  {t('hero.scenario_name', 'Living Nuvola & Pátio')}
                </p>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#cdc5bd]">
                  {t('hero.scenario_loc', 'Maputo • Residencial Privado 04')}
                </p>
              </div>

              {/* Indicador de slide numérico editorial */}
              <div className="flex items-center gap-4 text-white">
                <span className="font-['Playfair_Display'] text-2xl font-light text-white">01</span>
                <div className="w-16 h-[1px] bg-white/40">
                  <div className="w-1/3 h-full bg-white"></div>
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] tracking-widest text-[#cdc5bd]">03</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. BARRA DE COMPROMISSO & ATRIBUTOS PREMIUM
          ========================================== */}
      <section className="w-full bg-[#f4f3f1] py-8 border-b border-[#e9e8e6]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-2">
              <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white text-black shadow-xs">
                <span className="material-symbols-outlined text-[24px]">forest</span>
              </div>
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-base font-medium text-[#1a1c1b]">
                  Madeira Certificada
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-1">
                  Maciços nobres, manejo auditado e fibras puras de toque orgânico.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2">
              <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white text-black shadow-xs">
                <span className="material-symbols-outlined text-[24px]">front_hand</span>
              </div>
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-base font-medium text-[#1a1c1b]">
                  Entrega Luva Branca
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-1">
                  Equipe própria, transporte climatizado, montagem e descarte ecológico.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2">
              <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white text-black shadow-xs">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-base font-medium text-[#1a1c1b]">
                  Garantia Estrutural
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-1">
                  Até 5 anos de respaldo fabril contínuo e laudo de autenticidade numerado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2">
              <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white text-black shadow-xs">
                <span className="material-symbols-outlined text-[24px]">architecture</span>
              </div>
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-base font-medium text-[#1a1c1b]">
                  Consultoria & 3D
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-1">
                  Assessoria direta de arquitetos residentes para integração espacial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SEÇÃO "COMPRE POR AMBIENTE"
          ========================================== */}
      <section id="explore-ambientes" className="w-full py-16 lg:py-20 bg-[#faf9f7]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Cabeçalho Editorial */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
                Curações Integradas
              </span>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[36px] text-[#1a1c1b] font-normal">
                Explore por Ambiente
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalogo')}
              className="inline-flex items-center gap-1 font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] font-semibold text-[#1a1c1b] hover:text-[#7d5540] transition-colors group"
            >
              <span>Ver todos os 6 ambientes</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Grid Editorial Assimétrico de Ambientes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* 1. Sala de Estar (7 cols) */}
            <div
              onClick={() => onNavigate('catalogo')}
              className="group relative md:col-span-7 h-[440px] lg:h-[520px] overflow-hidden bg-[#efeeec] flex flex-col justify-end p-8 cursor-pointer"
            >
              <img
                alt="Sala de Estar Contemporânea Aethel"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwGw_hKxPRIHrB5wQIDHLJnspmVCf5_sGGsrvN4DVrNqcQCvaVVK2zjhgtneEzwDEoeZsQkK4wt75P-URcj2QinMe59ldXZeK506xjspAm2KP3qT4R-0HT4yFdO5VHDCLJfGplX8a0cu4FTz0dcGe5sAXzLv7kEtgeNAPY2G2LN9sLMSBahnBlx84cyalZ5M9JpOyTvKxvbgn86MF0Ve2xmoFAMjLS50a1T2HVgLsxMwEhTJzaIfSqw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] text-[#ffdbca] font-semibold mb-1 block">
                  18 Peças em Catálogo
                </span>
                <h3 className="font-['Playfair_Display'] text-2xl lg:text-[28px] text-white font-normal">
                  Sala de Estar Contemporânea
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#cac6c4] mt-1 max-w-md">
                  Módulos envolventes, tapeçarias orgânicas e apoios em rochas nobres.
                </p>
              </div>
            </div>

            {/* 2. Sala de Jantar (5 cols) */}
            <div
              onClick={() => onNavigate('catalogo')}
              className="group relative md:col-span-5 h-[440px] lg:h-[520px] overflow-hidden bg-[#efeeec] flex flex-col justify-end p-8 cursor-pointer"
            >
              <img
                alt="Sala de Jantar & Banquete"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU8_ksFbvBPbwTNOOhhopdYb5i9kJfoBTPf2Ha8BHYi3AizUE6LyoEYO1en4xD0t4gr7xADuueEsZyJrDF2mDfSp_4z3ZAsM5_y40IHgmM7ThHDOw2IvnbllFfMucKcnatAR-BJWjukyphe7F4IObPZ6fOpwBgypNSGsz4Jy6JfnMmVdyvoiviAY1LhSaSFH5G1GUKb40cjmnjFVEbDqF2T_6HEr1e4TJutY7G8NJ2FDfZxi-9P1e4cA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] text-[#ffdbca] font-semibold mb-1 block">
                  12 Peças em Catálogo
                </span>
                <h3 className="font-['Playfair_Display'] text-2xl lg:text-[28px] text-white font-normal">
                  Sala de Jantar & Banquete
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#cac6c4] mt-1 max-w-sm">
                  Mesas em nogueira maciça, assentos em couro e bufês arquitetônicos.
                </p>
              </div>
            </div>

            {/* 3. Quarto & Suíte (4 cols) */}
            <div
              onClick={() => onNavigate('catalogo')}
              className="group relative md:col-span-4 h-[360px] overflow-hidden bg-[#efeeec] flex flex-col justify-end p-8 cursor-pointer"
            >
              <img
                alt="Quarto & Suíte Master"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY9YYRkayFMwJWzd4NgYcjiiB8xcz9R8uVuFrxBciFSVjjMdspYETM4edQp0T35oX9ItkmwZdzhiKbwLUc_OTs-sX7JpyDU5vArEXwLy1SqvJ6XXv43m-AzuD2hmbsUtseYBnFLjuleFmb_HXqz_vzl-O5sW_rFo0DIGhHJcum-1m4TRfIdweIABUVm-Z61I_1o1MswS6Vk_HGueHrL4ytriMuAa8WWUJIe45Dz05mq0obYGMIlRv3Tw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] text-[#ffdbca] font-semibold mb-1 block">
                  10 Peças em Catálogo
                </span>
                <h3 className="font-['Playfair_Display'] text-xl lg:text-2xl text-white font-normal">
                  Quarto & Suíte Master
                </h3>
              </div>
            </div>

            {/* 4. Escritório Executivo (4 cols) */}
            <div
              onClick={() => onNavigate('catalogo')}
              className="group relative md:col-span-4 h-[360px] overflow-hidden bg-[#efeeec] flex flex-col justify-end p-8 cursor-pointer"
            >
              <img
                alt="Escritório Executivo"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDARmLpV7hPu7LYOumsbeRC0q5Bnvk86m-fAE-SK76haATn2mgWbKdU361X8ZvqJTp1LA0nHOuCoEWnOr0gvkd0uBrSpqH9fBX16kJslK3R0VIcTfsyBJ2885vHmVUjpFqBUI0nwV_UuQ1Q5n6NooUohDqwBGvkaPJ6PVNWGFngmpO02i-V1osGUrIzekJ6PhBPCUqL0b-tbh6STUDXkejtO8z95rN6EWdaD_MZvGo7YOTWUb2zAHiiKw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] text-[#ffdbca] font-semibold mb-1 block">
                  8 Peças em Catálogo
                </span>
                <h3 className="font-['Playfair_Display'] text-xl lg:text-2xl text-white font-normal">
                  Escritório Executivo & Ateliê
                </h3>
              </div>
            </div>

            {/* 5. Cozinha & 6. Externa (4 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:col-span-4 gap-6">
              <div
                onClick={() => onNavigate('catalogo')}
                className="group relative h-[360px] overflow-hidden bg-[#efeeec] flex flex-col justify-end p-6 cursor-pointer"
              >
                <img
                  alt="Cozinha & Gourmet Integrada"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5qQva2igYCTVPtI23ujdFdoMHRBRc_7k4HA0mw90dhK4ZdkMcRmRBlmGxWytPNvYINMzGau19tCnouC3qyembo2LVVInyrTO4tbTaV8_ZQa1IHzLljtJ3h7KllGw_4TTM7JSkIx5Q2d-hlpwGFSxnfzV77aZ3TeKdPWM3ZumqiYKm8VvLYMiMP2YkWRrO4rveo_1YfQ57geK3-eSaXgoqxAZ27MOr89ZIZaJatMVBDd0EJTjZA-4odQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.14em] text-[#ffdbca] block font-bold">
                    6 Peças
                  </span>
                  <h4 className="font-['Playfair_Display'] text-lg text-white font-normal">
                    Cozinha Gourmet
                  </h4>
                </div>
              </div>

              <div
                onClick={() => onNavigate('catalogo')}
                className="group relative h-[360px] overflow-hidden bg-[#efeeec] flex flex-col justify-end p-6 cursor-pointer"
              >
                <img
                  alt="Área Externa & Varanda"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWdX3O0B3QZRebVmAreVr2NoYXNpGMyVPME6GSrK0jtNK8wLoiuLFe-0Kxiwv7GQ146BHqyxLVRDe4EvWxc4eRctTpdxEaIkudE1uwl7aqNR5PNcVt1XgmVO25iL3BOF_HJWKRmHTf2zbD-teFiHaqMrW8QK0f5invyYdJm3HzWXnAOHVJryMhQz-4oSC4cv0Ia1mxLD1RXU9cBTjEaCGfpGqs-YZAI3iDcpLbPh6-C9tb69eDwmpY1g"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.14em] text-[#ffdbca] block font-bold">
                    9 Peças
                  </span>
                  <h4 className="font-['Playfair_Display'] text-lg text-white font-normal">
                    Área Externa & Lounge
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SEÇÃO SHOWROOM VIRTUAL INTERATIVO COM HOTSPOTS
          ========================================== */}
      <section id="showroom-interativo" className="w-full py-16 lg:py-20 bg-[#e9e8e6]/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Introdução da Experiência */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#efeeec] text-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-[0.16em] mb-2">
                <span className="material-symbols-outlined text-[16px]">360</span>
                <span>Experiência Espacial Interativa</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[36px] text-[#1a1c1b] font-normal">
                Showroom Virtual Imersivo
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#4a4640] mt-2">
                Interaja diretamente com as peças no espaço arquitetural real. Clique nos pontos de luz para ver especificações táteis, acabamentos disponíveis e adquirir o conjunto coordenado.
              </p>
            </div>
            <button
              onClick={() => onNavigate('showrooms')}
              className="inline-flex items-center gap-2 text-[#1a1c1b] hover:text-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors"
            >
              <span>Ver todos os 4 Showrooms Virtuais</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Canvas do Showroom Interativo com Hotspots Reais */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] bg-[#efeeec] overflow-hidden shadow-2xl">
            {/* Foto Base do Ambiente em Alta Resolução */}
            <img
              alt="Living Contemporâneo Nuvola - Showroom Aethel"
              className="w-full h-full object-cover object-center"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzNcLdHwhRYLwhV_sQdb-H0QSgf2N-NdsdwANIi8PaQ_vPEJv0eoLsT_pHp1UUUUzd_G9o7cfCklPK6lASCQTYYwx5ZlXHfMUhDlan5y-HtNVxQigHgeO8b5_KNZun7l4zJSrFUWncoov71lMkWJ4BX_pSFA_iyARj1nV3cFCz8pkZtDlucLiHlMUVNeUpOtCgmyWbOtsFrRTep2vEnHDRLQtkCAcHVhp-6xmrlP-3K__yD3tPGdlkTg"
            />
            {/* Overlay Gradiente Sutil */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

            {/* HOTSPOT 1: Sofá Modular Nuvola (X: 48.5%, Y: 62%) */}
            <div className="absolute top-[62%] left-[48.5%] -translate-x-1/2 -translate-y-1/2 z-30">
              <button
                onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
                className="relative group flex items-center justify-center w-8 h-8 focus:outline-none cursor-pointer"
                title="Inspecionar Sofá Modular Nuvola"
              >
                <span className="absolute inset-0 rounded-full bg-white/80 animate-ping opacity-75"></span>
                <span className="relative w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[16px]">
                    {activeHotspot === 1 ? 'remove' : 'add'}
                  </span>
                </span>
              </button>

              {/* Popover Card */}
              {activeHotspot === 1 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 sm:w-80 bg-white p-4 shadow-[0_24px_48px_-12px_rgba(23,22,21,0.22)] z-40 border border-[#e3e2e0]">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeeec] mb-3">
                    <img
                      alt="Sofá Modular Nuvola"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqeGOVTwh3UhSaQb52d7ReftrOAJbb08Mjed5XzCLhcvHFBb1hFOOaSJYpQAPOohG87FKXeJjwmbXt6Nl1Y0ymT0PdPFtzN05HZLUpAwWavBNidcdXSjBXqeU9dYxCtHyWm9fbEK88B3WZgu8j5y57M2JEtB-0HAA4cED2bBz8S3AubkkRLBsXNzg27NFH_igOMLZK8JhlYBFsxYTi79Y7agHaWegOQBbqA7VTngkFqtEOzZTDwidaMQ"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider text-black">
                      Peça Principal
                    </span>
                  </div>
                  <div>
                    <h5 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#1a1c1b] leading-tight">
                      Sofá Modular Nuvola
                    </h5>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mt-0.5">
                      Linho Cru Belga • 280 x 82 x 105 cm
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-['Playfair_Display'] text-xl font-normal text-[#1a1c1b]">
                      79.900 MT
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs line-through text-[#7c766f]">
                      89.500 MT
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
                    <button
                      onClick={() => {
                        const prod = products.find(p => p.id === 'sof-nuvola');
                        if (prod) onAddToCart(prod);
                      }}
                      className="w-full py-2.5 bg-black text-white font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider hover:bg-[#7d5540] transition-colors text-center"
                    >
                      + Carrinho
                    </button>
                    <button
                      onClick={() => {
                        const prod = products.find(p => p.id === 'sof-nuvola');
                        if (prod) onSelectProduct(prod);
                        else onNavigate('produto-nuvola');
                      }}
                      className="w-full py-2.5 bg-[#efeeec] text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider hover:bg-[#e9e8e6] transition-colors text-center"
                    >
                      Ver Peça
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* HOTSPOT 2: Mesa Travertino Monolito (X: 52%, Y: 78.5%) */}
            <div className="absolute top-[78.5%] left-[52%] -translate-x-1/2 -translate-y-1/2 z-20 group">
              <button
                onClick={() => {
                  const prod = products.find(p => p.id === 'mes-monolito');
                  if (prod) onSelectProduct(prod);
                }}
                className="relative flex items-center justify-center w-8 h-8 cursor-pointer"
                title="Mesa Travertino Monolito"
              >
                <span className="absolute inset-0 rounded-full bg-white/80 animate-ping opacity-60"></span>
                <span className="relative w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-black group-hover:scale-125 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                </span>
              </button>
              <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white p-3 shadow-xl flex-col border border-[#e3e2e0]">
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#1a1c1b] font-semibold">
                  Mesa Travertino Monolito
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7c766f]">
                  Mármore Travertino Navona
                </span>
                <span className="font-['Playfair_Display'] text-base text-[#1a1c1b] mt-1 font-normal">
                  36.500 MT
                </span>
              </div>
            </div>

            {/* HOTSPOT 3: Poltrona Kyoto (X: 18.5%, Y: 68%) */}
            <div className="absolute top-[68%] left-[18.5%] -translate-x-1/2 -translate-y-1/2 z-20 group">
              <button
                onClick={() => {
                  const prod = products.find(p => p.id === 'pol-kyoto');
                  if (prod) onSelectProduct(prod);
                }}
                className="relative flex items-center justify-center w-8 h-8 cursor-pointer"
                title="Poltrona Kyoto"
              >
                <span className="absolute inset-0 rounded-full bg-white/80 animate-ping opacity-60"></span>
                <span className="relative w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-black group-hover:scale-125 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                </span>
              </button>
              <div className="hidden group-hover:flex absolute bottom-full left-0 mb-2 w-56 bg-white p-3 shadow-xl flex-col border border-[#e3e2e0]">
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#1a1c1b] font-semibold">
                  Poltrona Kyoto
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7c766f]">
                  Carvalho Maciço & Bouclé
                </span>
                <span className="font-['Playfair_Display'] text-base text-[#1a1c1b] mt-1 font-normal">
                  38.400 MT
                </span>
              </div>
            </div>

            {/* HOTSPOT 4: Luminária Vértice (X: 85%, Y: 42%) */}
            <div className="absolute top-[42%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20 group">
              <button
                onClick={() => {
                  const prod = products.find(p => p.id === 'lum-vertice');
                  if (prod) onSelectProduct(prod);
                }}
                className="relative flex items-center justify-center w-8 h-8 cursor-pointer"
                title="Luminária de Piso Vértice"
              >
                <span className="absolute inset-0 rounded-full bg-white/80 animate-ping opacity-60"></span>
                <span className="relative w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-black group-hover:scale-125 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                </span>
              </button>
              <div className="hidden group-hover:flex absolute bottom-full right-0 mb-2 w-56 bg-white p-3 shadow-xl flex-col border border-[#e3e2e0]">
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#1a1c1b] font-semibold">
                  Luminária de Piso Vértice
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7c766f]">
                  Latão Escovado & Cúpula Seda
                </span>
                <span className="font-['Playfair_Display'] text-base text-[#1a1c1b] mt-1 font-normal">
                  16.800 MT
                </span>
              </div>
            </div>

            {/* Barra Inferior Flutuante: Comprar Conjunto Completo */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-30">
              <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#e3e2e0]">
                <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                  <span className="material-symbols-outlined text-[#7d5540] text-[24px]">style</span>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-widest text-[#7c766f] block font-semibold">
                      Composição Arquitetural Completa
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#1a1c1b]">
                      Living Contemporâneo Nuvola (4 peças)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="text-right">
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7d5540] font-bold block">
                      Economize 10.000 MT
                    </span>
                    <span className="font-['Playfair_Display'] text-xl font-normal text-[#1a1c1b]">
                      171.600 MT
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const sofa = products.find(p => p.id === 'sof-nuvola');
                      const table = products.find(p => p.id === 'mes-monolito');
                      const chair = products.find(p => p.id === 'pol-kyoto');
                      if (sofa) onAddToCart(sofa);
                      if (table) onAddToCart(table);
                      if (chair) onAddToCart(chair);
                    }}
                    className="px-5 py-3 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shadow-sm"
                  >
                    Adquirir Ambiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. SEÇÃO CATEGORIAS DE DESIGN (8 Categorias)
          ========================================== */}
      <section className="w-full py-16 lg:py-20 bg-[#faf9f7]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
              Catálogo Tipológico
            </span>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[36px] text-[#1a1c1b] font-normal">
              Categorias de Design
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#4a4640] mt-2">
              Peças criadas com pureza estrutural para pontuar ou orquestrar cada metro quadrado.
            </p>
          </div>

          {/* Grid 8 Categorias */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: 'Sofás & Chaise', icon: 'weekend', count: '14 Modelos' },
              { title: 'Mesas de Jantar & Centro', icon: 'table_restaurant', count: '22 Modelos' },
              { title: 'Cadeiras & Poltronas', icon: 'chair', count: '19 Modelos' },
              { title: 'Camas & Cabeceiras', icon: 'bed', count: '11 Modelos' },
              { title: 'Roupeiros & Closets', icon: 'door_sliding', count: '08 Sistemas' },
              { title: 'Estantes & Aparadores', icon: 'shelves', count: '16 Modelos' },
              { title: 'Escritório & Home Office', icon: 'desk', count: '13 Peças' },
              { title: 'Decoração & Iluminação', icon: 'light', count: '28 Peças' }
            ].map((cat) => (
              <div
                key={cat.title}
                onClick={() => onNavigate('catalogo')}
                className="group flex flex-col items-center text-center p-6 bg-[#f4f3f1] hover:bg-[#efeeec] transition-colors cursor-pointer border border-[#e9e8e6]"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1a1c1b] group-hover:text-[#7d5540] group-hover:scale-110 transition-all mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                </div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#1a1c1b]">
                  {cat.title}
                </h4>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mt-0.5">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. SEÇÃO PRODUTOS EM DESTAQUE
          ========================================== */}
      <section className="w-full py-16 lg:py-20 bg-[#f4f3f1]/50 border-t border-[#e9e8e6]" id="produtos-destaque">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
                Curações Essenciais
              </span>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[36px] text-[#1a1c1b] font-normal">
                Obras em Destaque
              </h2>
            </div>

            {/* Filtros Rápidos */}
            <div className="flex flex-wrap items-center gap-2">
              {['Todos', 'Sala de Estar', 'Quarto', 'Sala de Jantar', 'Mais Desejados'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-4 py-2 font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider transition-colors ${
                    activeFilterTab === tab
                      ? 'bg-black text-white'
                      : 'bg-[#efeeec] text-[#1a1c1b] hover:bg-[#e9e8e6]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Produtos Reais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((p) => {
              const isFav = favorites.some((f) => f.id === p.id);
              return (
                <div
                  key={p.id}
                  className="group flex flex-col bg-white p-4 border border-[#e9e8e6] shadow-xs"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efeeec]">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
                      onClick={() => onSelectProduct(p)}
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#7d5540] text-white font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                        {p.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(p);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#1a1c1b] hover:text-[#ba1a1a] transition-colors shadow-sm"
                      title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      <span 
                        className={`material-symbols-outlined text-[18px] ${isFav ? 'text-[#ba1a1a]' : ''}`}
                        style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p);
                      }}
                      className="absolute bottom-0 inset-x-0 py-3 bg-black text-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hover:bg-[#7d5540]"
                    >
                      <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                      {t('btn.quick_add', 'Quick Add')} • {formatPrice(p.price)}
                    </button>
                  </div>

                  <div className="pt-4 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-widest text-[#7c766f]">
                          {p.material.slice(0, 30)}
                        </span>
                        {p.colorSwatches && p.colorSwatches.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            {p.colorSwatches.map((sw, idx) => (
                              <span
                                key={idx}
                                style={{ backgroundColor: sw.color }}
                                className="w-3.5 h-3.5 rounded-full ring-1 ring-black/20"
                                title={sw.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <h3
                        onClick={() => onSelectProduct(p)}
                        className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal mt-1 cursor-pointer hover:text-[#7d5540] transition-colors"
                      >
                        {p.title}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-2 mt-3 pt-2 border-t border-[#f4f3f1]">
                      <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#1a1c1b]">
                        {formatPrice(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="font-['Plus_Jakarta_Sans'] text-xs line-through text-[#7c766f]">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. BANNER EDITORIAL SHOWROOM FÍSICO & B2B
          ========================================== */}
      <section className="w-full py-16 lg:py-20 bg-[#1c1b1a] text-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Imagem do Ateliê / Studio de Arquitetura */}
            <div className="lg:col-span-6 relative aspect-[16/11] overflow-hidden shadow-2xl">
              <img
                alt="Estúdio de Projetos Arquitetônicos Aethel"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhLlqgo3Z6Tpg1ioE_TBD6ATVxCZkqubNx0nSPWoyJRF_3EyeddV_CnxHgXUhux-YLBpCE9ZO9JuOYquZRmcfoWZCPInA9mta6uh2uiFFI3iUqe5WFqyvGG0Z8dXVwQ6EK0hsBdEyZcOaO1lvxDKSlINCRVSS8GG6Npoe-AUmUOAKdNuhAScY1OVy4y7WHmQG8jnA35FAiG6EFB2YbBGSLTgNMzvwZ7FDmYH4wI68d6GCxVv3SH-sdcA"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md border border-white/10">
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-widest text-white font-bold">
                  Pavilhão Aethel • Polana Cimento
                </span>
              </div>
            </div>

            {/* Conteúdo B2B e Atendimento */}
            <div className="lg:col-span-6 flex flex-col items-start lg:pl-6">
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase text-[#efbca1] font-semibold tracking-[0.16em] mb-2">
                Divisão Corporativa & Residencial
              </span>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-[44px] text-white font-normal leading-tight">
                Projetos Corporativos, Hotelaria e Residências Completas
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#cac6c4] mt-4 leading-relaxed">
                Agende uma sessão imersiva com nossos arquitetos residentes de interiores ou solicite um caderno de especificações B2B para o seu empreendimento imobiliário de luxo.
              </p>

              <div className="w-full grid grid-cols-2 gap-6 my-6 py-2 border-y border-white/10">
                <div>
                  <span className="font-['Playfair_Display'] text-2xl sm:text-3xl text-white block font-normal">+140</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#cdc5bd]">Projetos Executados em Moçambique</span>
                </div>
                <div>
                  <span className="font-['Playfair_Display'] text-2xl sm:text-3xl text-white block font-normal">100%</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#cdc5bd]">Modelagem 3D & Amostras Físicas</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => onNavigate('showrooms')}
                  className="px-8 py-4 bg-[#7d5540] text-white font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] font-semibold hover:bg-[#fec9ae] hover:text-[#79523e] transition-colors"
                >
                  Solicitar Orçamento B2B
                </button>
                <button
                  onClick={() => onNavigate('showrooms')}
                  className="px-7 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors"
                >
                  Agendar Visita ao Showroom
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          8. GAZETTE DE TENDÊNCIAS & INSIGHTS
          ========================================== */}
      <section className="w-full py-16 bg-[#f4f3f1]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="w-10 h-10 rounded-full bg-[#efeeec] flex items-center justify-center text-[#7d5540] mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] mb-1">
              Publicação Bimestral
            </span>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[36px] text-[#1a1c1b] font-normal">
              Gazette de Tendências & Arquitetura
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#4a4640] mt-2 max-w-lg">
              Cadernos de marcenaria de autor, prévias de lançamentos e ensaios com os maiores nomes da arquitetura contemporânea africana e mundial.
            </p>

            {/* Formulário Elegante */}
            <form onSubmit={handleGazetteSubmit} className="flex flex-col sm:flex-row items-stretch w-full max-w-lg mt-8 shadow-sm">
              <input
                type="email"
                required
                value={gazetteEmail}
                onChange={(e) => setGazetteEmail(e.target.value)}
                placeholder="Digite o seu correio eletrónico executivo"
                className="w-full px-5 py-4 bg-white text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-sm focus:outline-none placeholder:text-[#7c766f] border border-[#cdc5bd]"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-[0.14em] transition-colors whitespace-nowrap"
              >
                {gazetteDone ? 'Assinatura Ativada' : 'Assinar Gazette'}
              </button>
            </form>
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mt-3">
              Conteúdo estritamente curatorial. Cancele a qualquer momento.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
