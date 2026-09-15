import React, { useEffect, useState } from 'react';
import { Product, ActiveScreen } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface ProductDetailScreenProps {
  product: Product;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, quantity?: number, selectedMaterial?: string, selectedSize?: string, unitPrice?: number, variantId?: string) => void;
  favorites: Product[];
  onToggleFavorite: (p: Product) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  allProducts = [],
  onSelectProduct,
  onAddToCart,
  favorites = [],
  onToggleFavorite,
  onNavigate
}) => {
  const { formatPrice } = useLocalization();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sampleRequested, setSampleRequested] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);

  // Bundle selection checkboxes
  const [includeTable, setIncludeTable] = useState(true);
  const [includeChair, setIncludeChair] = useState(true);

  const variantMaterials = product.variants?.filter((variant, index, items) =>
    Boolean(variant.material) && items.findIndex((item) => item.material === variant.material) === index
  ).map((variant) => ({ name: variant.material!, color: variant.color ?? '#E3DAC9', extraPrice: variant.priceDelta })) ?? [];
  const materials = product.materialOptions || (variantMaterials.length ? variantMaterials : [
    { name: 'Linho Natural Cru', color: '#E3DAC9', extraPrice: 0 },
    { name: 'Linho Cinza Grafite', color: '#4A4B4D', extraPrice: 3500 },
    { name: 'Bouclé Off-White Nobre', color: '#F5F5F0', extraPrice: 5000 }
  ]);

  const variantSizes = product.variants?.filter((variant, index, items) =>
    Boolean(variant.size) && items.findIndex((item) => item.size === variant.size) === index
  ).map((variant) => ({ label: variant.size!, subLabel: variant.name, extraPrice: 0 })) ?? [];
  const sizes = product.sizeOptions || (variantSizes.length ? variantSizes : [
    { label: '280 cm', subLabel: '3 Módulos • Padrão', extraPrice: 0 },
    { label: '340 cm', subLabel: '4 Módulos c/ Chaise', extraPrice: 12000 },
    { label: 'Personalizado', subLabel: 'Sob medida estúdio', extraPrice: 0, custom: true }
  ]);

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedMaterialIndex(0);
    setSelectedSizeIndex(0);
    setQuantity(1);
  }, [product.id]);

  const currentExtraMaterial = materials[selectedMaterialIndex]?.extraPrice || 0;
  const currentExtraSize = sizes[selectedSizeIndex]?.extraPrice || 0;
  const finalUnitPrice = product.price + currentExtraMaterial + currentExtraSize;
  const selectedVariant = product.variants?.find((variant) =>
    (!variant.material || variant.material === materials[selectedMaterialIndex]?.name) &&
    (!variant.size || variant.size === sizes[selectedSizeIndex]?.label)
  ) ?? product.variants?.[0];

  const isFav = favorites.some((f) => f.id === product.id);

  // Bundle calculations
  const tableProduct = allProducts.find((p) => p.id === 'mes-monolito');
  const chairProduct = allProducts.find((p) => p.id === 'pol-kyoto');

  const bundleTotal =
    finalUnitPrice +
    (includeTable && tableProduct ? tableProduct.price : 0) +
    (includeChair && chairProduct ? chairProduct.price : 0) -
    (includeTable && includeChair ? 10000 : 0);

  const handleAddMainProduct = () => {
    onAddToCart(
      product,
      quantity,
      materials[selectedMaterialIndex]?.name,
      sizes[selectedSizeIndex]?.label,
      selectedVariant ? product.price + selectedVariant.priceDelta : finalUnitPrice,
      selectedVariant?.id
    );
  };

  const handleAddBundle = () => {
    handleAddMainProduct();
    if (includeTable && tableProduct) onAddToCart(tableProduct, 1);
    if (includeChair && chairProduct) onAddToCart(chairProduct, 1);
  };

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="w-full bg-[#faf9f7] pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6 overflow-hidden whitespace-nowrap">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
            Início
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('catalogo')} className="hover:text-black transition-colors">
            Catálogo
          </button>
          <span>/</span>
          <span className="hover:text-black">{product.category}</span>
          <span>/</span>
          <span className="text-[#1a1c1b] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Ficha Técnica Principal: 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ==========================================
              COLUNA ESQUERDA: GALERIA DE FOTOS & 3D
              ========================================== */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Foto Principal com Ações Sobrepostas */}
            <div className="relative aspect-[16/11] w-full bg-[#efeeec] overflow-hidden shadow-sm border border-[#e9e8e6]">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Badges superiores */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="px-3 py-1 bg-black text-white font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="hidden sm:block px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-semibold tracking-wider border border-[#e9e8e6]">
                  Foto Oficial de Estúdio
                </span>
              </div>

              {/* Botão Ver em 3D / AR */}
              <button
                onClick={() => setShow3DModal(true)}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 sm:px-4 py-2.5 bg-white/95 backdrop-blur-md text-[#1a1c1b] hover:bg-black hover:text-white transition-all font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider flex items-center gap-2 shadow-md border border-[#e9e8e6]"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Visualizar em 3D / AR</span>
              </button>

              {/* Botão Favoritar no topo direito */}
              <button
                onClick={() => onToggleFavorite(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a1c1b] hover:text-[#ba1a1a] transition-colors shadow-md"
                title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${isFav ? 'text-[#ba1a1a]' : ''}`}
                  style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Carrossel de Miniaturas */}
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[4/3] bg-[#efeeec] overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-black opacity-100 ring-2 ring-black/10'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* 4 Cards de Respaldo Estrutural */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e9e8e6]">
              <div className="p-3.5 bg-[#f4f3f1] border border-[#e9e8e6]">
                <span className="material-symbols-outlined text-[#7d5540] text-[22px] mb-1">forest</span>
                <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                  Madeira FSC
                </h5>
                <p className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f] mt-0.5">
                  Maciça reflorestada
                </p>
              </div>

              <div className="p-3.5 bg-[#f4f3f1] border border-[#e9e8e6]">
                <span className="material-symbols-outlined text-[#7d5540] text-[22px] mb-1">verified</span>
                <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                  24 Meses
                </h5>
                <p className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f] mt-0.5">
                  Garantia estrutural
                </p>
              </div>

              <div className="p-3.5 bg-[#f4f3f1] border border-[#e9e8e6]">
                <span className="material-symbols-outlined text-[#7d5540] text-[22px] mb-1">front_hand</span>
                <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                  Luva Branca
                </h5>
                <p className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f] mt-0.5">
                  Entrega & montagem
                </p>
              </div>

              <div className="p-3.5 bg-[#f4f3f1] border border-[#e9e8e6]">
                <span className="material-symbols-outlined text-[#7d5540] text-[22px] mb-1">workspace_premium</span>
                <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                  Certificado
                </h5>
                <p className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f] mt-0.5">
                  Autenticidade de lote
                </p>
              </div>
            </div>
          </div>

          {/* ==========================================
              COLUNA DIREITA: CONFIGURADOR & COMPRA
              ========================================== */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
            {/* Metadados Superiores */}
            <div>
              <div className="flex items-center justify-between font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-1.5">
                <span className="uppercase tracking-widest font-semibold text-[#7d5540]">
                  {product.designer || 'Studio Aethel • Linha Pura'}
                </span>
                <span className="font-mono text-[11px]">SKU: {product.sku}</span>
              </div>

              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal leading-tight">
                {product.title}
              </h1>

              {/* Avaliações de Arquitetos */}
              <div className="flex items-center gap-2 mt-2 font-['Plus_Jakarta_Sans'] text-xs">
                <div className="flex text-[#b26a4d]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="text-[#1a1c1b] font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-[#7c766f]">({product.reviewCount} avaliações de arquitetos)</span>
              </div>
            </div>

            {/* Bloco de Preço */}
            <div className="p-4 bg-[#f4f3f1] border border-[#e9e8e6]">
              <div className="flex items-baseline gap-3">
                <span className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
                  {formatPrice(finalUnitPrice)}
                </span>
                {product.originalPrice && (
                  <span className="font-['Plus_Jakarta_Sans'] text-sm line-through text-[#7c766f]">
                    {formatPrice(product.originalPrice + currentExtraMaterial + currentExtraSize)}
                  </span>
                )}
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mt-1">
                Ou em até 3x de {formatPrice(Math.round(finalUnitPrice / 3))} sem juros corporativos
              </p>
            </div>

            {/* Descrição Concisa */}
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] leading-relaxed">
              {product.description}
            </p>

            {/* SELETOR 1: Tecido & Acabamento Nobre */}
            <div className="space-y-3 pt-2 border-t border-[#e9e8e6]">
              <div className="flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b]">
                  Revestimento & Tecido
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7d5540] font-medium">
                  {materials[selectedMaterialIndex].name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {materials.map((mat, idx) => (
                  <button
                    key={mat.name}
                    onClick={() => setSelectedMaterialIndex(idx)}
                    className={`p-2.5 flex flex-col items-center text-center border transition-all ${
                      selectedMaterialIndex === idx
                        ? 'border-black bg-[#faf9f7] ring-1 ring-black'
                        : 'border-[#cdc5bd] hover:border-black bg-white'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: mat.color }}
                      className="w-6 h-6 rounded-full ring-1 ring-black/20 mb-1.5"
                    />
                    <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold text-[#1a1c1b] leading-tight">
                      {mat.name}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f] mt-0.5">
                      {mat.extraPrice > 0 ? `+${formatPrice(mat.extraPrice)}` : 'Incluso'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SELETOR 2: Dimensões Modulares */}
            <div className="space-y-3 pt-2 border-t border-[#e9e8e6]">
              <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b] block">
                Comprimento Modular
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {sizes.map((sz, idx) => (
                  <button
                    key={sz.label}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`p-2.5 flex flex-col items-center text-center border transition-all ${
                      selectedSizeIndex === idx
                        ? 'border-black bg-[#faf9f7] ring-1 ring-black'
                        : 'border-[#cdc5bd] hover:border-black bg-white'
                    }`}
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b]">
                      {sz.label}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f] mt-0.5 leading-tight">
                      {sz.subLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SELETOR 3: Quantidade e Botão Adicionar ao Carrinho */}
            <div className="pt-4 border-t border-[#e9e8e6] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Seletor de Quantidade */}
                <div className="flex items-center border border-[#cdc5bd] bg-[#f4f3f1] h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-black hover:bg-[#e9e8e6] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-['Plus_Jakarta_Sans'] text-sm font-semibold text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-black hover:bg-[#e9e8e6] transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Botão Adicionar ao Carrinho / Caderno */}
                <button
                  onClick={handleAddMainProduct}
                  className="flex-1 h-12 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-[0.14em] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>+ Adicionar ao Caderno</span>
                </button>
              </div>

              {/* Botão Secundário: Solicitar Amostra */}
              <button
                onClick={() => setSampleRequested(true)}
                className="w-full py-3 border border-black hover:bg-[#efeeec] text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider transition-colors text-center"
              >
                {sampleRequested ? '✓ Amostra Solicitada ao Concierge' : 'Solicitar Amostra de Tecido em Casa'}
              </button>
            </div>

            {/* Simulador de Frete & Luva Branca */}
            <div className="p-3.5 bg-[#faf9f7] border border-[#e9e8e6] text-xs font-['Plus_Jakarta_Sans'] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#7d5540] font-semibold">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Entrega Especial Luva Branca</span>
              </div>
              <p className="text-[#4a4640]">
                Disponível para Maputo, Matola, Beira, Nampula e Tete com montadores técnicos dedicados.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-[#7c766f]">
                <span>Prazo de fabrico e entrega:</span>
                <span className="font-semibold text-[#1a1c1b]">12 a 18 dias úteis</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            ESPECIFICAÇÕES TÉCNICAS COMPLETAS
            ========================================== */}
        <section className="mt-16 pt-12 border-t border-[#e9e8e6]">
          <div className="max-w-3xl mb-8">
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
              Engenharia e Manufatura
            </span>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal">
              Especificações Técnicas da Peça
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-[#e9e8e6]">
              <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c1b] mb-3">
                Dimensões Estruturais
              </h4>
              <ul className="space-y-2 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Largura:</span>
                  <span className="font-medium text-[#1a1c1b]">{sizes[selectedSizeIndex].label}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Profundidade:</span>
                  <span className="font-medium text-[#1a1c1b]">105 cm</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Altura Total:</span>
                  <span className="font-medium text-[#1a1c1b]">82 cm</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Altura do Assento:</span>
                  <span className="font-medium text-[#1a1c1b]">42 cm</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[#e9e8e6]">
              <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c1b] mb-3">
                Composição Interna
              </h4>
              <ul className="space-y-2 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Estrutura:</span>
                  <span className="font-medium text-[#1a1c1b]">Eucalipto Certificado</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Espuma Assento:</span>
                  <span className="font-medium text-[#1a1c1b]">Poliuretano D33 Soft</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Encosto:</span>
                  <span className="font-medium text-[#1a1c1b]">Fibra Siliconada Pluma</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#7c766f]">Pés:</span>
                  <span className="font-medium text-[#1a1c1b]">Sapatas Ocultas Feltro</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[#e9e8e6]">
              <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c1b] mb-3">
                Cuidados & Manutenção
              </h4>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] leading-relaxed">
                Aspiração periódica com bocal de cerdas macias. Não utilizar produtos químicos abrasivos ou alvejantes. Impermeabilização orgânica recomendada a cada 18 meses.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#e9e8e6] flex flex-col justify-between">
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c1b] mb-2">
                  Especificação Arquitetural
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mb-4">
                  Faça o download dos blocos em 3D para renderização realista no projeto executivo.
                </p>
              </div>
              <div className="space-y-2 font-['Plus_Jakarta_Sans'] text-[11px] font-semibold">
                <button
                  disabled
                  title="Modelo BIM ainda não publicado"
                  className="w-full py-2 bg-[#efeeec] opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Bloco Revit (.RFA)</span>
                </button>
                <button
                  disabled
                  title="Modelo SketchUp ainda não publicado"
                  className="w-full py-2 bg-[#efeeec] opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>SketchUp (.SKP)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            COMPONHA O AMBIENTE COMPLETO (BUNDLE)
            ========================================== */}
        <section className="mt-16 pt-12 border-t border-[#e9e8e6]">
          <div className="bg-[#f4f3f1] p-8 border border-[#e9e8e6]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
                  Harmonia Curatorial
                </span>
                <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal">
                  Componha o Ambiente Completo
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
                  Combine o {product.title} com as peças homologadas pelos nossos arquitetos para uma composição perfeita.
                </p>
              </div>

              {includeTable && includeChair && (
                <div className="px-3.5 py-1 bg-[#fec9ae] text-[#79523e] font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider">
                  Desconto de Conjunto: -10.000 MT
                </div>
              )}
            </div>

            {/* Lista dos 3 itens do Bundle com Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Item 1: Sofá Principal */}
              <div className="bg-white p-4 border border-[#cdc5bd] flex items-center gap-3">
                <input type="checkbox" checked disabled className="accent-black w-4 h-4 cursor-not-allowed" />
                <img src={product.images[0]} alt={product.title} className="w-16 h-16 object-cover bg-[#efeeec]" />
                <div className="overflow-hidden">
                  <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] truncate">
                    {product.title}
                  </h5>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] block">
                    Peça Selecionada
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                    {formatPrice(finalUnitPrice)}
                  </span>
                </div>
              </div>

              {/* Item 2: Mesa Monolito */}
              {tableProduct && (
                <div
                  onClick={() => setIncludeTable(!includeTable)}
                  className={`bg-white p-4 border cursor-pointer transition-colors flex items-center gap-3 ${
                    includeTable ? 'border-black' : 'border-[#e9e8e6] opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeTable}
                    onChange={(e) => setIncludeTable(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                  <img src={tableProduct.images[0]} alt={tableProduct.title} className="w-16 h-16 object-cover bg-[#efeeec]" />
                  <div className="overflow-hidden">
                    <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] truncate">
                      {tableProduct.title}
                    </h5>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] block">
                      Mármore Travertino
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                      +{formatPrice(tableProduct.price)}
                    </span>
                  </div>
                </div>
              )}

              {/* Item 3: Poltrona Kyoto */}
              {chairProduct && (
                <div
                  onClick={() => setIncludeChair(!includeChair)}
                  className={`bg-white p-4 border cursor-pointer transition-colors flex items-center gap-3 ${
                    includeChair ? 'border-black' : 'border-[#e9e8e6] opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeChair}
                    onChange={(e) => setIncludeChair(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                  <img src={chairProduct.images[0]} alt={chairProduct.title} className="w-16 h-16 object-cover bg-[#efeeec]" />
                  <div className="overflow-hidden">
                    <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] truncate">
                      {chairProduct.title}
                    </h5>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] block">
                      Bouclé Italiano
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b]">
                      +{formatPrice(chairProduct.price)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Totalizador do Conjunto */}
            <div className="mt-6 pt-6 border-t border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] block">
                  Investimento para o conjunto completo:
                </span>
                <span className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal">
                  {formatPrice(bundleTotal)}
                </span>
              </div>
              <button
                onClick={handleAddBundle}
                className="px-8 py-3.5 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider transition-colors whitespace-nowrap"
              >
                Adicionar Conjunto Coordenado
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            OBRAS RELACIONADAS
            ========================================== */}
        <section className="mt-16 pt-12 border-t border-[#e9e8e6]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal">
              Obras Relacionadas do Acervo
            </h3>
            <button
              onClick={() => onNavigate('catalogo')}
              className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b] hover:text-[#7d5540]"
            >
              Ver Todas as Peças
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group p-3 bg-white border border-[#e9e8e6] cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#efeeec]">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pt-3">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-widest text-[#7c766f]">
                    {p.category}
                  </span>
                  <h4 className="font-['Playfair_Display'] text-base text-[#1a1c1b] mt-0.5 group-hover:text-[#7d5540] transition-colors">
                    {p.title}
                  </h4>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] block mt-1">
                    {formatPrice(p.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal 3D Interativo Simulado */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative border border-[#e9e8e6] max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain">
            <button
              onClick={() => setShow3DModal(false)}
              className="absolute top-4 right-4 text-black hover:text-[#7d5540]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-1">
              Visualização Espacial
            </span>
            <h4 className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] mb-4">
              Modelo 3D Interativo • {product.title}
            </h4>

            <div className="relative aspect-[16/10] bg-[#1a1c1b] overflow-hidden flex items-center justify-center text-white">
              <img
                src={product.images[0]}
                alt={product.title}
                className="max-h-full max-w-full object-contain filter contrast-105"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-xs font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#fec9ae]">3d_rotation</span>
                <span>Gire 360° com o cursor do rato</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs font-['Plus_Jakarta_Sans']">
              <span className="text-[#7c766f]">Compatível com Apple AR QuickLook e Android SceneViewer</span>
              <button
                onClick={() => setShow3DModal(false)}
                className="px-5 py-2 bg-black text-white uppercase text-[11px] font-semibold tracking-wider"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
