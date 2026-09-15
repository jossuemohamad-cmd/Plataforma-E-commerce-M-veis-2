import React, { useState } from 'react';
import { Product, ActiveScreen, Order } from '../types';
import { INITIAL_ACTIVE_ORDER } from '../data/aethelData';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';

interface MyAccountScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  favorites: Product[];
  onSelectProduct: (p: Product) => void;
}

export const MyAccountScreen: React.FC<MyAccountScreenProps> = ({
  onNavigate,
  favorites,
  onSelectProduct
}) => {
  const { formatPrice, t } = useLocalization();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'painel' | 'ordens' | 'favoritos' | 'enderecos' | 'blocos' | 'faturas'>('painel');
  const [order, setOrder] = useState<Order>(INITIAL_ACTIVE_ORDER);

  return (
    <div className="w-full bg-[#faf9f7] pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
            Início
          </button>
          <span>/</span>
          <span className="text-[#1a1c1b] font-medium">Área Exclusiva VIP</span>
        </nav>

        {/* ==========================================
            BANNER DE PERFIL VIP DO ARQUITETO
            ========================================== */}
        <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={user?.avatar || "https://lh3.googleusercontent.com/aida/AEtjO1X7_npcnp3WsXRdRLwlAatGP6-v7I2pr0CBvu6o1VAQMTGIKxcq90ZJ9f_z9dVX47dcBw5isRyGGS8Qp1O-FpN4mUafGaIHvi7kK6-sAkiqOTCQ2a7_ah0wRjNQN7rzMp_SZUktdN_13kCroYSJMWa3nFtHfIGUI6y2cKzSKExRXfY8n2w2fKpLJ6KNe8Hdyn8RxfhrpE2oYRNnnJyXGMFHTHpww8sWK_odYW1h44ANMrMY6BMkS_QkGZ6V"}
                alt={user?.name || "Usuário VIP"}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#f4f3f1] shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-[#fec9ae] text-[#79523e] font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                    {user?.role === 'admin' ? 'Acesso Master • Administrador' : user?.membershipLevel || 'Membro Aethel Partners • Nível Platina'}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] font-mono">
                    ID: {user?.id ? user.id.toUpperCase() : 'MZ-8921'}
                  </span>
                </div>
                <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal">
                  {user?.name || 'Arq. Beatriz Mendes'}
                </h1>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-0.5">
                  {user?.firmName || 'Atelier de Arquitetura & Interiores Lda'} • {user?.email || 'beatriz.mendes@arquitetura.co.mz'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => alert('Caixa de amostras de madeira e tecidos solicitada para entrega expressa.')}
                className="px-5 py-2.5 bg-[#efeeec] hover:bg-[#e9e8e6] text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>Pedir Amostras Físicas</span>
              </button>
              <button
                onClick={() => onNavigate('catalogo')}
                className="px-5 py-2.5 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Nova Especificação</span>
              </button>
            </div>
          </div>

          {/* 4 Métricas de Desempenho do Atelier */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#e9e8e6]">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7c766f] block">
                Investimento Acumulado
              </span>
              <span className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal mt-0.5 block">
                412.500 MT
              </span>
            </div>
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7c766f] block">
                Obras Executadas
              </span>
              <span className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal mt-0.5 block">
                8 Projetos
              </span>
            </div>
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7c766f] block">
                Lote em Trânsito
              </span>
              <span className="font-['Playfair_Display'] text-2xl text-[#7d5540] font-normal mt-0.5 block">
                #AET-2025-0892
              </span>
            </div>
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7c766f] block">
                Blocos BIM Baixados
              </span>
              <span className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal mt-0.5 block">
                24 Arquivos
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================
            ABAS DE NAVEGAÇÃO VIP
            ========================================== */}
        <div className="flex border-b border-[#e9e8e6] mb-8 overflow-x-auto whitespace-nowrap">
          {[
            { id: 'painel', label: 'Painel & Rastreamento', icon: 'timeline' },
            { id: 'ordens', label: 'Ordens de Fabrico (3)', icon: 'receipt_long' },
            { id: 'favoritos', label: `Caderno de Desejos (${favorites.length})`, icon: 'favorite' },
            { id: 'blocos', label: 'Biblioteca BIM / 3D', icon: 'deployed_code' },
            { id: 'enderecos', label: 'Moradas de Obra', icon: 'location_on' },
            { id: 'faturas', label: 'Faturação Fiscal', icon: 'description' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3.5 px-4 font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-[#1a1c1b]'
                  : 'border-transparent text-[#7c766f] hover:text-[#1a1c1b]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ==========================================
            CONTEÚDO DA ABA SELECIONADA
            ========================================== */}
        {activeTab === 'painel' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Bloco de Rastreamento da Ordem Ativa (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9e8e6] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#7d5540] bg-[#faf9f7] px-2 py-0.5 border border-[#e9e8e6]">
                      {order.orderNumber}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#7d5540] animate-pulse"></span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase text-[#1a1c1b]">
                      {order.status}
                    </span>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal mt-1">
                    Lote Residencial Polana Cimento
                  </h3>
                </div>

                <div className="text-right">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase text-[#7c766f] block">
                    Entrega Prevista Luva Branca:
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b]">
                    {order.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Linha do Tempo em 5 Etapas do Fabrico Artesanal */}
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c1b] mb-6">
                  Cronograma de Produção & Transporte Climatizado:
                </h4>

                <div className="relative">
                  {/* Linha conectora de fundo */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#e9e8e6] -z-0"></div>
                  <div className="absolute top-4 left-4 w-3/4 h-0.5 bg-black -z-0"></div>

                  <div className="grid grid-cols-5 gap-2 text-center">
                    {/* Etapa 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-xs mb-2">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#1a1c1b] leading-tight">
                        Confirmação
                      </span>
                      <span className="text-[9px] text-[#7c766f]">18 Fev</span>
                    </div>

                    {/* Etapa 2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-xs mb-2">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#1a1c1b] leading-tight">
                        Marcenaria
                      </span>
                      <span className="text-[9px] text-[#7c766f]">21 Fev</span>
                    </div>

                    {/* Etapa 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-xs mb-2">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#1a1c1b] leading-tight">
                        Tapeçaria
                      </span>
                      <span className="text-[9px] text-[#7c766f]">24 Fev</span>
                    </div>

                    {/* Etapa 4 - ATIVA */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#7d5540] text-white flex items-center justify-center text-xs shadow-md mb-2 ring-4 ring-[#fec9ae]/50">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#7d5540] leading-tight">
                        Em Trânsito
                      </span>
                      <span className="text-[9px] font-semibold text-[#7d5540]">Atual</span>
                    </div>

                    {/* Etapa 5 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#efeeec] text-[#7c766f] flex items-center justify-center text-xs mb-2">
                        <span className="material-symbols-outlined text-[16px]">front_hand</span>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-medium text-[#7c766f] leading-tight">
                        Luva Branca
                      </span>
                      <span className="text-[9px] text-[#7c766f]">28 Fev</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Peças Inclusas no Lote Atual */}
              <div className="pt-6 border-t border-[#e9e8e6]">
                <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c1b] mb-4">
                  Peças deste Lote de Produção:
                </h4>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#faf9f7] border border-[#e9e8e6] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-14 h-14 object-cover bg-[#efeeec]"
                        />
                        <div className="font-['Plus_Jakarta_Sans']">
                          <span className="text-[10px] font-mono text-[#7c766f] uppercase">
                            REF: {item.refCode}
                          </span>
                          <h5 className="text-xs font-bold text-[#1a1c1b]">{item.product.title}</h5>
                          <span className="text-[11px] text-[#4a4640]">{item.details}</span>
                        </div>
                      </div>

                      <div className="text-right font-['Plus_Jakarta_Sans']">
                        <span className="text-[10px] text-[#7c766f] block">Qtd: {item.quantity}</span>
                        <span className="text-xs font-bold text-[#1a1c1b]">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Lateral VIP: Concierge & Ações Rápidas (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Concierge Residente */}
              <div className="bg-white p-6 border border-[#e9e8e6] shadow-xs">
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-1">
                  Atendimento Exclusivo
                </span>
                <h4 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal mb-3">
                  Concierge Dedicado ao Atelier
                </h4>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#efeeec] flex items-center justify-center text-[#7d5540] font-bold">
                    RM
                  </div>
                  <div className="font-['Plus_Jakarta_Sans']">
                    <span className="text-xs font-bold text-[#1a1c1b] block">Eng. Rui Matsinhe</span>
                    <span className="text-[11px] text-[#7c766f]">Curador Técnico & Gestão de Obras</span>
                  </div>
                </div>

                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] leading-relaxed mb-4">
                  Disponível para emissão de relatórios de produção, ensaios estruturais ou alinhamentos logísticos especiais no canteiro de obras.
                </p>

                <div className="space-y-2 font-['Plus_Jakarta_Sans'] text-xs">
                  <a
                    href="tel:+258840009200"
                    className="w-full py-2.5 bg-black text-white hover:bg-[#7d5540] font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Ligar: +258 84 000 9200</span>
                  </a>
                  <button
                    onClick={() => alert('Mensagem enviada diretamente ao Concierge via WhatsApp Corporativo.')}
                    className="w-full py-2.5 bg-[#efeeec] hover:bg-[#e9e8e6] text-[#1a1c1b] font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Mensagem Instantânea</span>
                  </button>
                </div>
              </div>

              {/* Download Rápido de Blocos 3D */}
              <div className="bg-white p-6 border border-[#e9e8e6] shadow-xs">
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#1a1c1b] block mb-2">
                  Biblioteca Técnica 3D
                </span>
                <div className="space-y-2.5 font-['Plus_Jakarta_Sans'] text-xs">
                  <div className="p-2.5 bg-[#f4f3f1] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#1a1c1b] block">Sofá Nuvola 280</span>
                      <span className="text-[10px] text-[#7c766f]">Revit 2024 (.RFA) • 18MB</span>
                    </div>
                    <button 
                      onClick={() => alert('Download do modelo Revit iniciado.')}
                      className="text-black hover:text-[#7d5540]"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-[#f4f3f1] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#1a1c1b] block">Poltrona Kyoto</span>
                      <span className="text-[10px] text-[#7c766f]">SketchUp (.SKP) • 12MB</span>
                    </div>
                    <button 
                      onClick={() => alert('Download do modelo SketchUp iniciado.')}
                      className="text-black hover:text-[#7d5540]"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: FAVORITOS / CADERNO DE DESEJOS */}
        {activeTab === 'favoritos' && (
          <div className="bg-white p-8 border border-[#e9e8e6]">
            <h3 className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal mb-2">
              Caderno de Desejos & Especificação ({favorites.length} peças)
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6">
              Peças guardadas para especificação em projetos residenciais ou corporativos.
            </p>

            {favorites.length === 0 ? (
              <div className="py-12 text-center font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
                Ainda não adicionou nenhuma peça aos seus favoritos.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((p) => (
                  <div key={p.id} className="p-3 border border-[#e9e8e6] flex flex-col justify-between">
                    <img src={p.images[0]} alt={p.title} className="aspect-[4/3] object-cover bg-[#efeeec] mb-2" />
                    <div>
                      <h4 className="font-['Playfair_Display'] text-base text-[#1a1c1b] font-normal">{p.title}</h4>
                      <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] block mt-1">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="mt-3 py-2 bg-black text-white text-[11px] uppercase font-semibold tracking-wider hover:bg-[#7d5540] transition-colors text-center"
                    >
                      Ver Ficha Técnica
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: ORDENS HISTÓRICAS */}
        {activeTab === 'ordens' && (
          <div className="bg-white p-8 border border-[#e9e8e6] space-y-4">
            <h3 className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal mb-4">
              Histórico de Ordens de Fabrico
            </h3>
            <div className="p-4 bg-[#faf9f7] border border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-['Plus_Jakarta_Sans'] text-xs">
              <div>
                <span className="font-bold text-[#1a1c1b] block">Ordem #AET-2025-0892</span>
                <span className="text-[#7c766f]">Emitida em 18 Fev 2025 • 3 Peças • Residencial Polana Cimento</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1a1c1b]">139.320 MT</span>
                <span className="px-2.5 py-1 bg-[#7d5540] text-white text-[10px] uppercase font-bold">
                  Em Trânsito
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#faf9f7] border border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-['Plus_Jakarta_Sans'] text-xs opacity-75">
              <div>
                <span className="font-bold text-[#1a1c1b] block">Ordem #AET-2024-0419</span>
                <span className="text-[#7c766f]">Emitida em 12 Nov 2024 • 4 Peças • Penthouse Sommerchield</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1a1c1b]">273.180 MT</span>
                <span className="px-2.5 py-1 bg-black text-white text-[10px] uppercase font-bold">
                  Entregue
                </span>
              </div>
            </div>
          </div>
        )}

        {/* OUTRAS ABAS (MORADAS, BLOCOS, FATURAS) */}
        {(activeTab === 'enderecos' || activeTab === 'blocos' || activeTab === 'faturas') && (
          <div className="bg-white p-8 border border-[#e9e8e6]">
            <h3 className="font-['Playfair_Display'] text-2xl text-[#1a1c1b] font-normal mb-2 capitalize">
              {activeTab} do Atelier
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
              Dados sincronizados diretamente com a base cadastral da Aethel Studio.
            </p>
            <div className="mt-6 p-4 bg-[#f4f3f1] border border-[#e9e8e6] text-xs font-['Plus_Jakarta_Sans'] text-[#4a4640]">
              Todos os registros estão atualizados com certificado fiscal e alvará vigente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
