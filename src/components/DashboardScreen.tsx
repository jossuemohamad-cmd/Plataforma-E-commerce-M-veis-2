import React, { useEffect, useState } from 'react';
import { ActiveScreen } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { DashboardOrder, getDashboardData, updateOrderStatus } from '../services/adminService';

interface DashboardScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { formatPrice } = useLocalization();
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [metrics, setMetrics] = useState({ revenue: 0, processing: 0, average: 0 });

  const loadDashboard = async () => {
    const data = await getDashboardData();
      setMetrics({ revenue: data.revenue, processing: data.processing, average: data.average });
      setRecentOrders(data.orders);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const exportOrders = () => {
    const csv = ['Ordem,Cliente,Itens,Valor,Estado', ...recentOrders.map((order) =>
      [order.id, order.client, order.items, order.value, order.status].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')
    )].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `eden-ordens-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
          <span className="text-[#1a1c1b] font-medium">Painel Executivo</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#e9e8e6]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
              Diretoria de Operações & Ateliês
            </span>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#1a1c1b] font-normal tracking-tight">
              Painel Executivo & Operações de Marcenaria
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
              Monitoramento em tempo real de vendas, canteiro de obras, eficiência logística e relacionamento B2B com arquitetos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => onNavigate('gestao')}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#efeeec] hover:bg-[#e9e8e6] text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-xs uppercase font-semibold tracking-wider transition-colors"
            >
              Gerenciar Acervo
            </button>
            <button
              onClick={exportOrders}
              className="w-full sm:w-auto justify-center px-5 py-2.5 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-xs uppercase font-semibold tracking-wider transition-colors flex items-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Exportar Balanço MT</span>
            </button>
          </div>
        </div>

        {/* 4 Grandes KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white border border-[#e9e8e6] shadow-xs">
            <div className="flex items-center justify-between text-[#7c766f] mb-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                Faturamento Mensal
              </span>
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
              {formatPrice(metrics.revenue)}
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-emerald-700 font-semibold block mt-1">
              ↑ +18.4% vs mês anterior
            </span>
          </div>

          <div className="p-6 bg-white border border-[#e9e8e6] shadow-xs">
            <div className="flex items-center justify-between text-[#7c766f] mb-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                Ordens em Fabrico
              </span>
              <span className="material-symbols-outlined text-[18px]">handyman</span>
            </div>
            <div className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
              {metrics.processing} Lotes
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7d5540] font-semibold block mt-1">
              4 oficinas artesanais ativas
            </span>
          </div>

          <div className="p-6 bg-white border border-[#e9e8e6] shadow-xs">
            <div className="flex items-center justify-between text-[#7c766f] mb-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                Ticket Médio B2B
              </span>
              <span className="material-symbols-outlined text-[18px]">domain</span>
            </div>
            <div className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
              {formatPrice(metrics.average)}
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7c766f] block mt-1">
              Por especificação de arquiteto
            </span>
          </div>

          <div className="p-6 bg-white border border-[#e9e8e6] shadow-xs">
            <div className="flex items-center justify-between text-[#7c766f] mb-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                Pontualidade Luva Branca
              </span>
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="font-['Playfair_Display'] text-3xl font-normal text-[#1a1c1b]">
              99.2%
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-emerald-700 font-semibold block mt-1">
              Zero avarias registradas
            </span>
          </div>
        </div>

        {/* 2 Colunas Médias: Demanda por Ambiente & Capacidade das Oficinas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Gráfico / Distribuição por Ambiente */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-1">
              Comportamento do Mercado
            </span>
            <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal mb-6">
              Distribuição da Demanda por Ambiente
            </h3>

            <div className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-[#1a1c1b]">Sala de Estar (Sofás & Chaise)</span>
                  <span className="font-bold text-[#1a1c1b]">45%</span>
                </div>
                <div className="w-full h-2.5 bg-[#efeeec] rounded-none overflow-hidden">
                  <div className="h-full bg-black" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-[#1a1c1b]">Sala de Jantar (Mesas Monolito & Cadeiras)</span>
                  <span className="font-bold text-[#1a1c1b]">28%</span>
                </div>
                <div className="w-full h-2.5 bg-[#efeeec] rounded-none overflow-hidden">
                  <div className="h-full bg-[#7d5540]" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-[#1a1c1b]">Quarto & Suíte Master (Camas & Cabeceiras)</span>
                  <span className="font-bold text-[#1a1c1b]">15%</span>
                </div>
                <div className="w-full h-2.5 bg-[#efeeec] rounded-none overflow-hidden">
                  <div className="h-full bg-[#b26a4d]" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-[#1a1c1b]">Lounge Náutico & Varanda Coberta</span>
                  <span className="font-bold text-[#1a1c1b]">12%</span>
                </div>
                <div className="w-full h-2.5 bg-[#efeeec] rounded-none overflow-hidden">
                  <div className="h-full bg-[#cdc5bd]" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Capacidade Operacional das Oficinas */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-1">
              Chão de Fábrica Artesanal
            </span>
            <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal mb-6">
              Capacidade Produtiva das Oficinas
            </h3>

            <div className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs">
              <div className="p-3 bg-[#faf9f7] border border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1a1c1b] block">Oficina 1 • Marcenaria Fina & Maciços</span>
                  <span className="text-[#7c766f] text-[11px]">6 mestres marceneiros • Nogueira & Carvalho</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#efeeec] text-[10px] font-bold uppercase text-[#1a1c1b]">
                    88% Ocupação
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf9f7] border border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1a1c1b] block">Oficina 2 • Tapeçaria & Alfaiataria Têxtil</span>
                  <span className="text-[#7c766f] text-[11px]">4 alfaiates • Linhos Belgas & Bouclés</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#efeeec] text-[10px] font-bold uppercase text-[#1a1c1b]">
                    72% Ocupação
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf9f7] border border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1a1c1b] block">Oficina 3 • Cantaria & Mármores Travertino</span>
                  <span className="text-[#7c766f] text-[11px]">3 marmoristas • Corte de monólitos</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#fec9ae] text-[10px] font-bold uppercase text-[#79523e]">
                    94% Alta Demanda
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf9f7] border border-[#e9e8e6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1a1c1b] block">Logística • Frotas Climatizadas Luva Branca</span>
                  <span className="text-[#7c766f] text-[11px]">2 carrinhas ativas em Maputo & Matola</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#efeeec] text-[10px] font-bold uppercase text-emerald-800">
                    Disponível
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Ordens B2B Recentes */}
        <div className="bg-white border border-[#e9e8e6] shadow-xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-0.5">
                Pipeline de Produção
              </span>
              <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                Ordens B2B Recentes em Produção
              </h3>
            </div>
            <button
              onClick={exportOrders}
              className="text-xs font-['Plus_Jakarta_Sans'] font-semibold text-[#7d5540] hover:underline"
            >
              Ver Todas as Ordens →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left font-['Plus_Jakarta_Sans'] text-xs">
              <thead>
                <tr className="border-b border-[#e9e8e6] text-[#7c766f] uppercase font-bold text-[10px] tracking-wider pb-3">
                  <th className="py-2.5">Código Ordem</th>
                  <th className="py-2.5">Gabinete / Cliente</th>
                  <th className="py-2.5">Projeto & Local</th>
                  <th className="py-2.5">Peças</th>
                  <th className="py-2.5">Investimento</th>
                  <th className="py-2.5">Previsão</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f3f1]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#faf9f7] transition-colors">
                    <td className="py-3 font-mono font-bold text-[#1a1c1b]">{ord.id}</td>
                    <td className="py-3 font-medium text-[#1a1c1b]">{ord.client}</td>
                    <td className="py-3 text-[#4a4640]">{ord.project}</td>
                    <td className="py-3 text-[#7c766f] max-w-xs truncate">{ord.items}</td>
                    <td className="py-3 font-bold text-[#1a1c1b]">{formatPrice(ord.value)}</td>
                    <td className="py-3 text-[#7c766f]">{ord.deadline}</td>
                    <td className="py-3 text-right">
                      <select
                        value={ord.status}
                        onChange={(event) => void updateOrderStatus(ord.orderId, event.target.value).then(loadDashboard)}
                        className="px-2 py-1 bg-[#efeeec] text-[#1a1c1b] font-bold text-[10px] uppercase border-0"
                        aria-label={`Estado da ordem ${ord.id}`}
                      >
                        {['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
