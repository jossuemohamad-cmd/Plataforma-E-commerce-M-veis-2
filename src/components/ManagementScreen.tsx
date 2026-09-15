import React, { useState } from 'react';
import { Product, ActiveScreen } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { uploadProductImage } from '../services/adminService';

interface ManagementScreenProps {
  products: Product[];
  onAddProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onNavigate: (screen: ActiveScreen) => void;
}

export const ManagementScreen: React.FC<ManagementScreenProps> = ({
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onNavigate
}) => {
  const { formatPrice } = useLocalization();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sofás & Chaise');
  const [newPrice, setNewPrice] = useState<number>(45000);
  const [newMaterial, setNewMaterial] = useState('Carvalho Maciço e Linho');
  const [newDimensions, setNewDimensions] = useState('220 x 95 x 80 cm');
  const newAmbiente = 'Sala de Estar';
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const formatDimensions = (dimensions: Product['dimensions']) => {
    if (!dimensions) return '—';
    if (typeof dimensions === 'string') return dimensions;
    if (typeof dimensions === 'object') {
      const { width, depth, height } = dimensions;
      const parts: string[] = [];
      if (width) parts.push(`L: ${width}`);
      if (depth) parts.push(`P: ${depth}`);
      if (height) parts.push(`A: ${height}`);
      return parts.length > 0 ? parts.join(' × ') : '—';
    }
    return String(dimensions);
  };

  const filtered = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.material.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'Todas' && p.category !== categoryFilter) return false;
    return true;
  });

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = 'prod-' + Date.now();
    const product: Product = {
      id: productId,
      title: newTitle,
      category: newCategory,
      price: Number(newPrice),
      description: 'Mobiliário de autor com acabamentos nobres e estrutura maciça de alta durabilidade.',
      dimensions: newDimensions,
      material: newMaterial,
      ambiente: newAmbiente,
      images: [newImage],
      inStock: true,
      sku: 'AET-' + Math.floor(100 + Math.random() * 900),
      rating: 5.0,
      reviewCount: 1,
      badge: 'Novo Lote'
    };
    setSaving(true);
    setSaveError(null);
    try {
      if (newImageFile) {
        if (!newImageFile.type.startsWith('image/') || newImageFile.size > 5 * 1024 * 1024) {
          throw new Error('A imagem deve ser JPG, PNG ou WebP e ter no máximo 5 MB.');
        }
        product.images = [await uploadProductImage(newImageFile, productId)];
      }
      await onAddProduct(product);
      setShowAddModal(false);
      setNewTitle('');
      setNewPrice(45000);
      setNewImageFile(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Não foi possível guardar a peça.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-[#faf9f7] pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
            Início
          </button>
          <span>/</span>
          <span className="text-[#1a1c1b] font-medium">Gestão do Acervo</span>
        </nav>

        {/* Header com Ação Principal */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#e9e8e6]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
              Painel de Engenharia & Catálogo
            </span>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#1a1c1b] font-normal tracking-tight">
              Gestão do Acervo & Fichas de Fabrico
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
              Controle mestre de catálogo, cotações em Meticais (MT), especificações técnicas e fichas de marcenaria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto justify-center px-5 py-2.5 bg-[#efeeec] hover:bg-[#e9e8e6] text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-xs uppercase font-semibold tracking-wider transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">monitoring</span>
              <span>Painel Executivo</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto justify-center px-5 py-2.5 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-xs uppercase font-semibold tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Nova Peça Autoral</span>
            </button>
          </div>
        </div>

        {/* 4 Métricas de Estoque e Operação */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-white border border-[#e9e8e6] shadow-xs">
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider text-[#7c766f]">
              Obras no Acervo Ativo
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
                {products.length}
              </span>
              <span className="text-xs font-['Plus_Jakarta_Sans'] text-[#7d5540] font-semibold">
                peças cadastradas
              </span>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#e9e8e6] shadow-xs">
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider text-[#7c766f]">
              Lotes em Produção Ativa
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
                4
              </span>
              <span className="text-xs font-['Plus_Jakarta_Sans'] text-[#7c766f]">
                oficinas ocupadas
              </span>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#e9e8e6] shadow-xs">
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider text-[#7c766f]">
              Valor Total do Acervo
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
                {formatPrice(products.reduce((acc, p) => acc + p.price, 0))}
              </span>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#e9e8e6] shadow-xs">
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider text-[#7c766f]">
              Pontualidade Luva Branca
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
                99.4%
              </span>
              <span className="text-xs font-['Plus_Jakarta_Sans'] text-emerald-700 font-semibold">
                excelência
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar de Pesquisa & Filtro */}
        <div className="bg-white p-4 border border-[#e9e8e6] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por título, SKU ou material..."
              className="w-full bg-[#f4f3f1] pl-9 pr-3.5 py-2 text-xs font-['Plus_Jakarta_Sans'] text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#7c766f] text-[18px]">
              search
            </span>
          </div>

          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-2 min-[420px]:gap-3">
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">Filtrar Categoria:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1a1c1b] border border-[#cdc5bd] px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="Todas">Todas as Categorias</option>
              <option value="Sofás & Chaise">Sofás & Chaise</option>
              <option value="Mesas de Jantar & Centro">Mesas</option>
              <option value="Cadeiras & Poltronas">Cadeiras & Poltronas</option>
              <option value="Camas & Cabeceiras">Camas</option>
              <option value="Escritório & Home Office">Escritório</option>
            </select>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white border border-[#e9e8e6] shadow-xs overflow-x-auto">
          <table className="w-full min-w-[960px] text-left font-['Plus_Jakarta_Sans'] text-xs">
            <thead>
              <tr className="bg-[#faf9f7] border-b border-[#e9e8e6] text-[#7c766f] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Peça & SKU</th>
                <th className="py-3 px-4">Ambiente & Categoria</th>
                <th className="py-3 px-4">Material Predominante</th>
                <th className="py-3 px-4">Dimensões</th>
                <th className="py-3 px-4">Investimento (MT)</th>
                <th className="py-3 px-4">Disponibilidade</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f3f1]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#faf9f7] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-12 object-cover bg-[#efeeec] shrink-0 border border-[#e9e8e6]"
                      />
                      <div>
                        <span className="font-bold text-[#1a1c1b] block">{p.title}</span>
                        <span className="font-mono text-[10px] text-[#7c766f]">SKU: {p.sku}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[#1a1c1b] block">{p.category}</span>
                    <span className="text-[10px] text-[#7c766f]">{p.ambiente}</span>
                  </td>

                  <td className="py-3 px-4 text-[#4a4640] max-w-xs truncate">
                    {p.material}
                  </td>

                  <td className="py-3 px-4 text-[#7c766f] font-mono text-[11px]">
                    {formatDimensions(p.dimensions)}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#1a1c1b]">
                    {formatPrice(p.price)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase ${
                        p.inStock
                          ? 'bg-[#efeeec] text-[#1a1c1b]'
                          : 'bg-[#fec9ae] text-[#79523e]'
                      }`}
                    >
                      {p.inStock ? 'Pronta Entrega' : 'Sob Encomenda'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          const newP = prompt('Novo valor para esta peça (em MT):', String(p.price));
                          if (newP && !isNaN(Number(newP))) {
                            void onUpdateProduct({ ...p, price: Number(newP) }).catch((error) => setSaveError(error instanceof Error ? error.message : 'Falha ao atualizar.'));
                          }
                        }}
                        className="p-1 text-[#7c766f] hover:text-black"
                        title="Editar Valor"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja remover ${p.title} do acervo?`)) {
                            void onDeleteProduct(p.id).catch((error) => setSaveError(error instanceof Error ? error.message : 'Falha ao remover.'));
                          }
                        }}
                        className="p-1 text-[#7c766f] hover:text-[#ba1a1a]"
                        title="Remover do Acervo"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Nova Peça */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-xl w-full p-4 sm:p-8 border border-[#e9e8e6] shadow-2xl relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-black hover:text-[#7d5540]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-1">
              Ateliê de Fabricação
            </span>
            <h3 className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] mb-4">
              Registrar Nova Peça Autoral
            </h3>

            <form onSubmit={handleSaveNew} className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs">
              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Nome da Peça
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Poltrona Savana em Couro Natural"
                  className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:bg-white focus:outline-none"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setNewImageFile(event.target.files?.[0] ?? null)}
                  className="mt-2 block w-full text-[11px] text-[#7c766f] file:mr-3 file:border-0 file:bg-[#efeeec] file:px-3 file:py-2 file:text-[10px] file:font-semibold file:uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:bg-white focus:outline-none"
                  >
                    <option value="Sofás & Chaise">Sofás & Chaise</option>
                    <option value="Mesas de Jantar & Centro">Mesas</option>
                    <option value="Cadeiras & Poltronas">Cadeiras & Poltronas</option>
                    <option value="Camas & Cabeceiras">Camas</option>
                    <option value="Escritório & Home Office">Escritório</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Investimento (MT)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Material Nobre
                  </label>
                  <input
                    type="text"
                    required
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="Ex: Nogueira Maciça e Latão"
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Dimensões
                  </label>
                  <input
                    type="text"
                    required
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    placeholder="Ex: 200 x 90 x 75 cm"
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  URL da Foto de Estúdio
                </label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:bg-white focus:outline-none text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e9e8e6]">
                {saveError && <p role="alert" className="mr-auto text-xs text-red-700">{saveError}</p>}
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-[#cdc5bd] text-[#1a1c1b] text-[11px] uppercase font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-black text-white hover:bg-[#7d5540] text-[11px] uppercase font-semibold tracking-wider transition-colors"
                >
                  {saving ? 'A guardar…' : 'Salvar no Acervo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
