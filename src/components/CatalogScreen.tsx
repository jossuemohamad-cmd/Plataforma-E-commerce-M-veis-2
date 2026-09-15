import React, { useState, useMemo } from 'react';
import { Product, ActiveScreen } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface CatalogScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onNavigate: (screen: ActiveScreen) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  products = [],
  onSelectProduct,
  onAddToCart,
  favorites = [],
  onToggleFavorite,
  onNavigate,
  searchQuery,
  onSearchChange
}) => {
  const { formatPrice, t } = useLocalization();
  const [selectedAmbiente, setSelectedAmbiente] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedMaterial, setSelectedMaterial] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const ambientesList = [
    { label: 'Todos', count: products.length },
    { label: 'Sala de Estar', count: products.filter(p => p.ambiente === 'Sala de Estar').length },
    { label: 'Sala de Jantar', count: products.filter(p => p.ambiente === 'Sala de Jantar').length },
    { label: 'Quarto', count: products.filter(p => p.ambiente === 'Quarto').length },
    { label: 'Escritório & Estúdio', count: products.filter(p => (p.ambiente || '').includes('Escritório')).length },
    { label: 'Área Externa & Lounge', count: products.filter(p => (p.ambiente || '').includes('Externa')).length }
  ];

  const categoriesList = [
    'Todas',
    'Sofás & Chaise',
    'Mesas de Jantar & Centro',
    'Cadeiras & Poltronas',
    'Camas & Cabeceiras',
    'Estantes & Aparadores',
    'Escritório & Home Office',
    'Decoração & Iluminação'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesMat = p.material.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesMat && !matchesSku) return false;
      }

      // Ambiente
      if (selectedAmbiente !== 'Todos') {
        if (!p.ambiente.toLowerCase().includes(selectedAmbiente.toLowerCase())) return false;
      }

      // Category
      if (selectedCategory !== 'Todas') {
        if (p.category !== selectedCategory) return false;
      }

      // Material
      if (selectedMaterial !== 'Todos') {
        if (!p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;
      }

      // Max Price
      if (p.price > maxPrice) return false;

      // In stock
      if (onlyInStock && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, searchQuery, selectedAmbiente, selectedCategory, selectedMaterial, maxPrice, onlyInStock, sortBy]);

  const handleResetFilters = () => {
    setSelectedAmbiente('Todos');
    setSelectedCategory('Todas');
    setSelectedMaterial('Todos');
    setMaxPrice(100000);
    setOnlyInStock(false);
    onSearchChange('');
  };

  return (
    <div className="w-full bg-[#faf9f7] pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
            Início
          </button>
          <span>/</span>
          <span className="text-[#1a1c1b] font-medium">Catálogo Geral</span>
        </nav>

        {/* Header do Catálogo */}
        <div className="mb-10 pb-8 border-b border-[#e9e8e6]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
                Acervo de Mobiliário de Luxo
              </span>
              <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl text-[#1a1c1b] font-normal tracking-tight">
                Peças & Coleções 2025
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#4a4640] mt-2 max-w-3xl leading-relaxed">
                Mobiliário escultural de autor desenvolvido sob encomenda e pronta-entrega curada com madeiras nobres, mármores nacionais e tecidos de alta costura.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#7c766f]">
                {filteredProducts.length} obras encontradas
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((visible) => !visible)}
          aria-expanded={showFilters}
          aria-controls="catalog-filters"
          className="lg:hidden w-full mb-4 min-h-11 px-4 bg-white border border-[#cdc5bd] flex items-center justify-between font-['Plus_Jakarta_Sans'] text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">tune</span>
            Filtrar peças
          </span>
          <span className="material-symbols-outlined text-[20px]">
            {showFilters ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {/* Layout Principal: Filtros Laterais + Grid de Peças */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ==========================================
              SIDEBAR DE FILTROS REAIS
              ========================================== */}
          <aside
            id="catalog-filters"
            className={`${showFilters ? 'flex' : 'hidden'} lg:col-span-3 lg:flex flex-col gap-6 lg:gap-8 bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 border lg:border-none border-[#e9e8e6] shadow-xs lg:shadow-none`}
          >
            {/* Busca Interna do Catálogo */}
            <div>
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b] block mb-2">
                Pesquisar no Catálogo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Nome, madeira, SKU..."
                  className="w-full bg-[#f4f3f1] pl-3.5 pr-9 py-2.5 font-['Plus_Jakarta_Sans'] text-xs text-[#1a1c1b] focus:outline-none focus:bg-white border border-[#e9e8e6]"
                />
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#7c766f] text-[18px]">
                  search
                </span>
              </div>
            </div>

            {/* Filtro por Ambiente */}
            <div className="space-y-2.5">
              <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b]">
                Ambientes
              </h3>
              <div className="space-y-1 font-['Plus_Jakarta_Sans'] text-xs">
                {ambientesList.map((amb) => (
                  <button
                    key={amb.label}
                    onClick={() => setSelectedAmbiente(amb.label)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-none text-left transition-colors ${
                      selectedAmbiente === amb.label
                        ? 'bg-[#efeeec] text-[#1a1c1b] font-semibold'
                        : 'text-[#4a4640] hover:text-[#1a1c1b] hover:bg-[#f4f3f1]'
                    }`}
                  >
                    <span>{amb.label}</span>
                    <span className="text-[11px] text-[#7c766f]">({amb.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Categoria */}
            <div className="space-y-2.5">
              <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b]">
                Categorias
              </h3>
              <div className="space-y-1 font-['Plus_Jakarta_Sans'] text-xs">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 text-left transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#efeeec] text-[#1a1c1b] font-semibold'
                        : 'text-[#4a4640] hover:text-[#1a1c1b] hover:bg-[#f4f3f1]'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa de Investimento (Range MT) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b]">
                  Investimento Máximo
                </h3>
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b]">
                  {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#7c766f] font-mono">
                <span>10.000 MT</span>
                <span>100.000 MT</span>
              </div>
            </div>

            {/* Material Predominante */}
            <div className="space-y-2.5">
              <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b]">
                Material Nobre
              </h3>
              <div className="space-y-1 font-['Plus_Jakarta_Sans'] text-xs">
                {[
                  'Todos',
                  'Linho Belga Cru',
                  'Carvalho Maciço',
                  'Nogueira Maciça',
                  'Mármore Travertino',
                  'Couro Bovino'
                ].map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 text-left transition-colors ${
                      selectedMaterial === mat
                        ? 'bg-[#efeeec] text-[#1a1c1b] font-semibold'
                        : 'text-[#4a4640] hover:text-[#1a1c1b] hover:bg-[#f4f3f1]'
                    }`}
                  >
                    <span>{mat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="pt-2 border-t border-[#e9e8e6]">
              <label className="flex items-center gap-2 text-xs text-[#1a1c1b] font-['Plus_Jakarta_Sans'] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded-none accent-black w-4 h-4"
                />
                <span>Apenas Pronta Entrega</span>
              </label>
            </div>

            {/* Botão Limpar Filtros */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 border border-[#cdc5bd] hover:border-black text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider transition-colors text-center"
            >
              Restaurar Filtros
            </button>
          </aside>

          {/* ==========================================
              GRID DE PRODUTOS PRINCIPAL
              ========================================== */}
          <main className="lg:col-span-9 flex flex-col">
            {/* Top Toolbar de Ordenação */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e9e8e6]">
              <div className="flex items-center gap-2">
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
                  Exibindo {filteredProducts.length} peças
                </span>
                {selectedAmbiente !== 'Todos' && (
                  <span className="px-2 py-0.5 bg-[#efeeec] text-[10px] font-bold text-[#1a1c1b] uppercase">
                    {selectedAmbiente}
                  </span>
                )}
                {selectedCategory !== 'Todas' && (
                  <span className="px-2 py-0.5 bg-[#efeeec] text-[10px] font-bold text-[#1a1c1b] uppercase">
                    {selectedCategory}
                  </span>
                )}
              </div>

              <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-2 min-[420px]:gap-3">
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full min-[420px]:w-auto bg-transparent font-['Plus_Jakarta_Sans'] text-sm sm:text-xs font-semibold text-[#1a1c1b] focus:outline-none cursor-pointer border border-[#cdc5bd] min-h-11 px-3 sm:min-h-0 sm:border-x-0 sm:border-t-0 sm:border-b-black sm:px-0 sm:pb-0.5"
                >
                  <option value="featured">Destaques da Curadoria</option>
                  <option value="price-asc">Investimento: Menor para Maior</option>
                  <option value="price-desc">Investimento: Maior para Menor</option>
                  <option value="rating">Melhor Avaliados</option>
                </select>
              </div>
            </div>

            {/* Se nenhum produto encontrado */}
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-white p-8 border border-[#e9e8e6]">
                <span className="material-symbols-outlined text-4xl text-[#7c766f] mb-3">
                  chair
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b]">
                  Nenhuma peça encontrada para estes critérios
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mt-1 max-w-sm">
                  Tente redefinir a faixa de valor ou selecionar outro ambiente no painel de filtros.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-6 py-2.5 bg-black text-white font-['Plus_Jakarta_Sans'] text-xs uppercase font-semibold tracking-wider hover:bg-[#7d5540] transition-colors"
                >
                  Ver Todo o Acervo
                </button>
              </div>
            )}

            {/* Grid 3 Colunas de Peças */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isFav = favorites.some((f) => f.id === p.id);
                return (
                  <div
                    key={p.id}
                    className="group flex flex-col bg-white p-3.5 border border-[#e9e8e6] shadow-xs hover:shadow-md transition-shadow"
                  >
                    {/* Imagem do Produto com Proporção 4:5 */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efeeec]">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                        onClick={() => onSelectProduct(p)}
                      />

                      {/* Badge Superior */}
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#7d5540] text-white font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider shadow-xs">
                          {p.badge}
                        </span>
                      )}

                      {/* Favoritar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a1c1b] hover:text-[#ba1a1a] transition-colors shadow-sm"
                        title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                      >
                        <span 
                          className={`material-symbols-outlined text-[17px] ${isFav ? 'text-[#ba1a1a]' : ''}`}
                          style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      </button>

                      {/* Quick Add overlay no hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p);
                        }}
                        className="absolute bottom-0 inset-x-0 py-3 bg-black text-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-wider opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hover:bg-[#7d5540]"
                      >
                        <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                        {t('btn.quick_add', 'Adicionar')} • {formatPrice(p.price)}
                      </button>
                    </div>

                    {/* Ficha Resumida */}
                    <div className="pt-3.5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-widest text-[#7c766f]">
                            {p.category}
                          </span>
                          {p.colorSwatches && p.colorSwatches.length > 0 && (
                            <div className="flex items-center gap-1">
                              {p.colorSwatches.map((sw, idx) => (
                                <span
                                  key={idx}
                                  style={{ backgroundColor: sw.color }}
                                  className="w-3 h-3 rounded-full ring-1 ring-black/20"
                                  title={sw.name}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <h3
                          onClick={() => onSelectProduct(p)}
                          className="font-['Playfair_Display'] text-lg text-[#1a1c1b] font-normal leading-snug cursor-pointer hover:text-[#7d5540] transition-colors"
                        >
                          {p.title}
                        </h3>

                        <p className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7c766f] mt-1 line-clamp-1">
                          {p.material}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-2 mt-3 pt-2 border-t border-[#f4f3f1]">
                        <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#1a1c1b]">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="font-['Plus_Jakarta_Sans'] text-[11px] line-through text-[#7c766f]">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 pt-6 border-t border-[#e9e8e6] flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
                  Página {currentPage} de 2 • Mostrando {filteredProducts.length} de {products.length} peças
                </span>

                <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-xs font-semibold">
                  <button 
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 flex items-center justify-center ${
                      currentPage === 1 ? 'bg-black text-white' : 'bg-white hover:bg-[#efeeec] text-[#1a1c1b] border border-[#e9e8e6]'
                    }`}
                  >
                    1
                  </button>
                  <button 
                    onClick={() => setCurrentPage(2)}
                    className={`w-8 h-8 flex items-center justify-center ${
                      currentPage === 2 ? 'bg-black text-white' : 'bg-white hover:bg-[#efeeec] text-[#1a1c1b] border border-[#e9e8e6]'
                    }`}
                  >
                    2
                  </button>
                  <button 
                    onClick={() => setCurrentPage(currentPage === 1 ? 2 : 1)}
                    className="px-3 h-8 bg-white hover:bg-[#efeeec] text-[#1a1c1b] border border-[#e9e8e6] flex items-center gap-1 text-[11px] uppercase tracking-wider"
                  >
                    <span>Próximo</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}

            {/* Banner B2B no final do catálogo */}
            <div className="mt-14 p-8 bg-[#f4f3f1] border border-[#e9e8e6] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-widest text-[#7d5540] font-bold block mb-1">
                  Atendimento a Gabinetes & Construtoras
                </span>
                <h4 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Precisa de Especificação Especial para Empreendimento ou Hotelaria?
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-1 max-w-xl">
                  Disponibilizamos modelos BIM/Revit, arquivos DWG, ensaios de tração e prazos de fabrico escalonados com condições comerciais exclusivas para arquitetos.
                </p>
              </div>
              <button
                onClick={() => onNavigate('showrooms')}
                className="px-6 py-3 bg-black text-white font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#7d5540] transition-colors whitespace-nowrap"
              >
                Falar com Arquiteto Residente
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
