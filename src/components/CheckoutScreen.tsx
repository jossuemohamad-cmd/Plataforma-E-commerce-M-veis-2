import React, { useState } from 'react';
import { CartItem, ActiveScreen } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface CheckoutScreenProps {
  cart: CartItem[];
  onNavigate: (screen: ActiveScreen) => void;
  onClearCart: () => void;
  onPlaceOrder: (data: {
    address: { label: string; recipientName: string; phone: string; line1: string; city: string; province: string };
    paymentMethod: 'transfer' | 'pos' | 'card';
    couponCode?: string;
    deliveryNotes?: string;
  }) => Promise<{ order_number: string; total: number }>;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  onNavigate,
  onClearCart,
  onPlaceOrder
}) => {
  const { formatPrice } = useLocalization();
  const [selectedAddress, setSelectedAddress] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'pos' | 'card'>('transfer');
  const [hasElevator, setHasElevator] = useState(true);
  const [hasWideStairs, setHasWideStairs] = useState(true);
  const [hasRestrictedHours, setHasRestrictedHours] = useState(false);
  const [couponCode, setCouponCode] = useState('BEMVINDO10');
  const [couponApplied, setCouponApplied] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Maputo');
  const [province, setProvince] = useState('Maputo Cidade');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{ order_number: string; total: number } | null>(null);

  // Calculate Subtotal
  const subtotal = cart.length > 0
    ? cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    : 0;

  // O desconto final nunca é confiado ao navegador; a RPC valida e recalcula no servidor.
  const discount = 0;
  const total = subtotal - discount;

  const handlePlaceOrder = async () => {
    if (!acceptTerms) {
      setCheckoutError('Por favor, aceite os termos de produção e entrega para continuar.');
      return;
    }
    if (!recipientName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !province.trim()) {
      setCheckoutError('Preencha o titular, telefone e morada de entrega.');
      return;
    }
    if (cart.length === 0) {
      setCheckoutError('O carrinho está vazio.');
      return;
    }
    setSubmitting(true);
    setCheckoutError(null);
    try {
      const order = await onPlaceOrder({
        address: { label: 'Entrega principal', recipientName, phone, line1: addressLine, city, province },
        paymentMethod,
        couponCode: couponApplied ? couponCode : undefined,
        deliveryNotes: `Elevador: ${hasElevator ? 'sim' : 'não'}; escadas largas: ${hasWideStairs ? 'sim' : 'não'}; horário restrito: ${hasRestrictedHours ? 'sim' : 'não'}`
      });
      setConfirmedOrder(order);
      setOrderConfirmed(true);
      onClearCart();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Não foi possível emitir a ordem.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="w-full bg-[#faf9f7] py-20 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto text-center bg-white p-5 sm:p-10 border border-[#e9e8e6] shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#efeeec] text-[#7d5540] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">verified</span>
          </div>

          <span className="font-['Plus_Jakarta_Sans'] text-xs uppercase font-bold tracking-widest text-[#7d5540]">
            Caderno Emitido com Sucesso
          </span>

          <h2 className="font-['Playfair_Display'] text-3xl text-[#1a1c1b] font-normal mt-2">
            Ordem de Fabrico Registrada
          </h2>

          <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#4a4640] mt-3 leading-relaxed">
            Agradecemos a preferência, <strong>{recipientName}</strong>. O pedido foi encaminhado ao ateliê sob a referência <strong>#{confirmedOrder?.order_number}</strong>.
          </p>

          <div className="p-4 bg-[#f4f3f1] border border-[#e9e8e6] text-left my-6 text-xs font-['Plus_Jakarta_Sans'] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#7c766f]">Referência:</span>
              <span className="font-mono font-bold text-[#1a1c1b]">#{confirmedOrder?.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7c766f]">Investimento Líquido:</span>
              <span className="font-bold text-[#1a1c1b]">{formatPrice(confirmedOrder?.total ?? total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7c766f]">Previsão de Entrega:</span>
              <span className="font-medium text-[#1a1c1b]">28 de Fevereiro de 2025</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('minha-conta')}
              className="px-6 py-3 bg-black text-white font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider hover:bg-[#7d5540] transition-colors"
            >
              Acompanhar no Painel VIP
            </button>
            <button
              onClick={() => onNavigate('catalogo')}
              className="px-6 py-3 bg-[#efeeec] text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider hover:bg-[#e9e8e6] transition-colors"
            >
              Continuar a Explorar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#faf9f7] pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
            Início
          </button>
          <span>/</span>
          <span className="text-[#1a1c1b] font-medium">Finalização de Pedido</span>
        </nav>

        {/* Cabeçalho */}
        <div className="mb-10 pb-6 border-b border-[#e9e8e6]">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
            Aquisição Autoral
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#1a1c1b] font-normal tracking-tight">
            Finalização de Pedido • Caderno Nº 2841-MZ
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
            Mobiliário autoral sob encomenda com fabrico artesanal e entrega de Luva Branca em Moçambique.
          </p>
        </div>

        {/* 2 Colunas: Formulário de 6 Etapas à esquerda, Caderno de Compra à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* ==========================================
              COLUNA ESQUERDA: AS 6 ETAPAS DE CHECKOUT
              ========================================== */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* ETAPA 1: Titular da Encomenda */}
            <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Titular da Encomenda & Faturação Fiscal
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-['Plus_Jakarta_Sans'] text-xs">
                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Nome Completo / Razão Social
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    required
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    NUIT Moçambicano (Para Fatura com Valor Fiscal)
                  </label>
                  <input
                    type="text"
                    defaultValue="400 892 108"
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Correio Eletrónico Executivo
                  </label>
                  <input
                    type="email"
                    defaultValue="beatriz.mendes@arquitetura.co.mz"
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Telemóvel / WhatsApp de Notificação
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    className="w-full bg-[#f4f3f1] px-3.5 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* ETAPA 2: Morada de Entrega & Acessos */}
            <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  2
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Morada de Entrega & Acesso ao Imóvel
                </h3>
              </div>

              <div className="space-y-3 mb-4">
                {/* Morada 1 */}
                <div
                  onClick={() => setSelectedAddress(1)}
                  className={`p-4 border cursor-pointer transition-colors flex items-start gap-3 ${
                    selectedAddress === 1 ? 'border-black bg-[#faf9f7]' : 'border-[#e9e8e6] hover:bg-[#faf9f7]'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === 1}
                    onChange={() => setSelectedAddress(1)}
                    className="accent-black mt-1"
                  />
                  <div className="font-['Plus_Jakarta_Sans'] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1a1c1b]">Residencial Polana Cimento (Principal)</span>
                      <span className="px-2 py-0.5 bg-[#efeeec] text-[9px] font-bold uppercase text-[#7d5540]">
                        Padrão
                      </span>
                    </div>
                    <p className="text-[#4a4640] mt-1">
                      Av. Armando Tivane, 1420 • 4º Andar Nascente, Polana Cimento, Maputo Cidade
                    </p>
                    <span className="text-[11px] text-[#7c766f]">Ponto de referência: Próximo à Escola Portuguesa</span>
                  </div>
                </div>

                {/* Morada 2 */}
                <div
                  onClick={() => setSelectedAddress(2)}
                  className={`p-4 border cursor-pointer transition-colors flex items-start gap-3 ${
                    selectedAddress === 2 ? 'border-black bg-[#faf9f7]' : 'border-[#e9e8e6] hover:bg-[#faf9f7]'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === 2}
                    onChange={() => setSelectedAddress(2)}
                    className="accent-black mt-1"
                  />
                  <div className="font-['Plus_Jakarta_Sans'] text-xs">
                    <span className="font-bold text-[#1a1c1b]">Atelier de Arquitetura Sommerchield</span>
                    <p className="text-[#4a4640] mt-1">
                      Rua do Rio Raraga, 88, Bairro Sommerchield II, Maputo Cidade
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 font-['Plus_Jakarta_Sans'] text-xs">
                <label className="sm:col-span-2 text-[10px] uppercase font-semibold text-[#7c766f]">
                  Endereço completo
                  <input value={addressLine} onChange={(event) => setAddressLine(event.target.value)} required placeholder="Avenida, número, andar e bairro" className="mt-1 w-full bg-[#f4f3f1] px-3.5 py-2.5 text-xs normal-case font-normal text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none" />
                </label>
                <label className="text-[10px] uppercase font-semibold text-[#7c766f]">
                  Cidade
                  <input value={city} onChange={(event) => setCity(event.target.value)} required className="mt-1 w-full bg-[#f4f3f1] px-3.5 py-2.5 text-xs normal-case font-normal text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none" />
                </label>
                <label className="text-[10px] uppercase font-semibold text-[#7c766f]">
                  Província
                  <input value={province} onChange={(event) => setProvince(event.target.value)} required className="mt-1 w-full bg-[#f4f3f1] px-3.5 py-2.5 text-xs normal-case font-normal text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none" />
                </label>
              </div>

              {/* Condições de Acesso */}
              <div className="pt-4 border-t border-[#e9e8e6]">
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#1a1c1b] block mb-2.5">
                  Condições de Içamento e Acesso ao Imóvel:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasElevator}
                      onChange={(e) => setHasElevator(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Elevador de serviço amplo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasWideStairs}
                      onChange={(e) => setHasWideStairs(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Escadarias largas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasRestrictedHours}
                      onChange={(e) => setHasRestrictedHours(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Horário restrito de condomínio</span>
                  </label>
                </div>
              </div>
            </div>

            {/* ETAPA 3: Transporte & Montagem Luva Branca */}
            <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  3
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Modalidade de Transporte & Montagem Especial
                </h3>
              </div>

              <div className="p-4 bg-[#faf9f7] border border-black flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7d5540] text-[24px] mt-0.5">front_hand</span>
                  <div>
                    <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] uppercase tracking-wider">
                      Serviço Luva Branca Aethel Studio (Cortesia VIP)
                    </h5>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640] mt-1 leading-relaxed">
                      Equipe própria de montadores técnicos treinados em marcenaria fina. Desembalagem cuidadosa, nivelamento arquitetural, posicionamento no ambiente desejado e recolha ecológica de todas as embalagens.
                    </p>
                  </div>
                </div>
                <span className="self-end sm:self-auto font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#7d5540] whitespace-nowrap uppercase">
                  Gratuito
                </span>
              </div>
            </div>

            {/* ETAPA 4: Liquidação Segura */}
            <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  4
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Método de Liquidação Segura
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'transfer' ? 'border-black bg-[#faf9f7]' : 'border-[#e9e8e6] hover:bg-[#faf9f7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px] text-[#7d5540] mb-2">account_balance</span>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] block">
                      Transferência Imediata
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f]">
                      BCI • BIM • Standard Bank
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pos')}
                  className={`p-4 border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'pos' ? 'border-black bg-[#faf9f7]' : 'border-[#e9e8e6] hover:bg-[#faf9f7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px] text-[#7d5540] mb-2">point_of_sale</span>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] block">
                      TPA Móvel na Entrega
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f]">
                      Débito ou Crédito Simo
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'card' ? 'border-black bg-[#faf9f7]' : 'border-[#e9e8e6] hover:bg-[#faf9f7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px] text-[#7d5540] mb-2">credit_card</span>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1a1c1b] block">
                      Cartão Internacional
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7c766f]">
                      Visa • Mastercard
                    </span>
                  </div>
                </button>
              </div>

              {/* Informações Bancárias para Transferência */}
              {paymentMethod === 'transfer' && (
                <div className="p-4 bg-[#f4f3f1] border border-[#e9e8e6] font-['Plus_Jakarta_Sans'] text-xs space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[#1a1c1b] block text-[10px]">
                    Coordenadas Bancárias Oficiais da Aethel Studio Lda:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#4a4640]">
                    <div>
                      <p><strong>Banco:</strong> Millennium BIM</p>
                      <p><strong>Conta:</strong> 102 938 475</p>
                      <p><strong>NIB:</strong> 0001 0000 0102 9384 7510 2</p>
                    </div>
                    <div>
                      <p><strong>Banco:</strong> BCI (Banco Comercial)</p>
                      <p><strong>Conta:</strong> 882 341 092</p>
                      <p><strong>NIB:</strong> 0008 0000 0882 3410 9220 5</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#7c766f] pt-1">
                    Após a emissão da ordem, envie o comprovativo para <strong>financeiro@aethelstudio.com</strong> ou anexe diretamente neste canal.
                  </p>
                </div>
              )}
            </div>

            {/* ETAPA 5: Cupom de Desconto */}
            <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  5
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Código de Cortesia / Cupom de Arquiteto
                </h3>
              </div>

              <div className="flex flex-col min-[420px]:flex-row items-stretch max-w-md gap-2 min-[420px]:gap-0">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Ex: ARQBEATRIZ10"
                  className="min-w-0 flex-1 bg-[#f4f3f1] px-3.5 py-2.5 font-mono text-sm text-[#1a1c1b] border min-[420px]:border-r-0 border-[#cdc5bd] uppercase focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (couponCode.trim()) {
                      setCouponApplied(true);
                    }
                  }}
                  className="px-5 bg-black text-white font-['Plus_Jakarta_Sans'] text-xs uppercase font-semibold tracking-wider hover:bg-[#7d5540] transition-colors"
                >
                  {couponApplied ? 'Será validado' : 'Usar código'}
                </button>
              </div>
              {couponApplied && (
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#7d5540] font-semibold mt-2 block">
                  O código será validado no servidor ao confirmar; o total final será recalculado com segurança.
                </span>
              )}
            </div>

            {/* ETAPA 6: Termos de Produção & Aceite */}
            <div className="bg-white p-6 sm:p-8 border border-[#e9e8e6] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  6
                </span>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                  Termos de Produção & Entrega
                </h3>
              </div>

              <label className="flex items-start gap-3 cursor-pointer font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="accent-black mt-0.5 w-4 h-4"
                />
                <span className="leading-relaxed">
                  Declaro que li e concordo com os prazos de produção artesanal (12 a 18 dias úteis), a política de montagem de Luva Branca e a garantia estrutural de 24 meses emitida pela Aethel Studio.
                </span>
              </label>

              {checkoutError && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-xs text-red-800">{checkoutError}</p>}

              <button
                type="button"
                onClick={() => void handlePlaceOrder()}
                disabled={submitting || cart.length === 0}
                className="w-full mt-6 py-4 bg-black text-white hover:bg-[#7d5540] disabled:opacity-50 disabled:cursor-not-allowed font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-[0.18em] transition-colors shadow-md text-center"
              >
                {submitting ? 'A emitir ordem…' : 'Confirmar e Emitir Caderno de Pedido'}
              </button>
            </div>
          </div>

          {/* ==========================================
              COLUNA DIREITA: CADERNO DE COMPRA (STICKY)
              ========================================== */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-white p-4 sm:p-7 border border-[#e9e8e6] shadow-md space-y-6">
            <div className="border-b border-[#e9e8e6] pb-4">
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540]">
                Resumo da Aquisição
              </span>
              <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal mt-0.5">
                Caderno de Compra ({cart.length > 0 ? cart.length : 3} peças)
              </h3>
            </div>

            {/* Lista das Peças no Caderno */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 pb-3 border-b border-[#f4f3f1]">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover bg-[#efeeec] shrink-0"
                    />
                    <div className="flex-1 overflow-hidden font-['Plus_Jakarta_Sans']">
                      <h5 className="text-xs font-semibold text-[#1a1c1b] truncate">
                        {item.product.title}
                      </h5>
                      <span className="text-[10px] text-[#7c766f] block">
                        Qtd: {item.quantity} • {item.selectedSize || 'Padrão'}
                      </span>
                      <span className="text-xs font-bold text-[#1a1c1b]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                /* Mock oficial do protótipo se o carrinho estiver vazio */
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-[#f4f3f1]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFOUwpV0mFZOagYu4ikogGi21LreIVRE_W2J41_3TlGZGwWngCs5ZoVlsf3X8Ei938ut5llACSYSdoKBE0WIU1gqQQm--HXIQr5RMXRLnduFxsXfOO0QcKr3q6aio3-w1xYocgLp2jv6_A5DwX8WyfPGWDZv_RYyI4q__AQsy7Q-qW6NzsmUPFvNM-JCyrNl2lFFztzzbfBxpQ8kv3NDlrQAyQXf5H9bVsPAl_9Ny1JadRKnJXUdwmIA"
                      alt="Sofá Modular Nuvola"
                      className="w-14 h-14 object-cover bg-[#efeeec] shrink-0"
                    />
                    <div className="flex-1 font-['Plus_Jakarta_Sans']">
                      <h5 className="text-xs font-semibold text-[#1a1c1b]">Sofá Modular Nuvola</h5>
                      <span className="text-[10px] text-[#7c766f] block">Linho Cru Belga • 280cm</span>
                      <span className="text-xs font-bold text-[#1a1c1b]">{formatPrice(78500)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b border-[#f4f3f1]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5AflP88jMBe1n-uh9m2tgHQ1zP2iI7i0mfvBhlfm03grETIsOt-YJsz34CQE2O4-7Eqv0ErUbVlB28x6zHL5LU0Xivu7pjV1W-OgmpiR6sugNu9xGnZJEN2qduR3ZLWgNC2aRxI0b8PyH5N2voH__jIps1prfrIaxlNRdYy9CEPFvvEKQCK-BQpndrJ2MNxR2oI_H2u__x0QVgSN7BwHY171xC33ymKPrucIJIT4tUo0rw3hUn1QTsQ"
                      alt="Poltrona Kyoto"
                      className="w-14 h-14 object-cover bg-[#efeeec] shrink-0"
                    />
                    <div className="flex-1 font-['Plus_Jakarta_Sans']">
                      <h5 className="text-xs font-semibold text-[#1a1c1b]">Poltrona Kyoto</h5>
                      <span className="text-[10px] text-[#7c766f] block">Carvalho Maciço & Bouclé</span>
                      <span className="text-xs font-bold text-[#1a1c1b]">{formatPrice(34820)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b border-[#f4f3f1]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAToltq86cxvb6pvYHnKZmJvKEy0_N0XDm1AD-rC-nLKRPdF7nBYzNcryPEm85h2qAFnBRSEYgUxaxznj2Mb2AUe0qSx3xw9BLyJUr5_tCVsijcJMrcyTsSRDS_TT_mRfS2R3HGEbA1bIr5SWNPgLfMtVGCsCLVc-S8hVQYq1quyYexM3GF8HMChChBT3WZPZcxSojZZSypzEInEaywtAVWpHpIrjYpfrm3IIjFrtp7_3-LqpgjqC0Uag"
                      alt="Mesa Travertino Monolito"
                      className="w-14 h-14 object-cover bg-[#efeeec] shrink-0"
                    />
                    <div className="flex-1 font-['Plus_Jakarta_Sans']">
                      <h5 className="text-xs font-semibold text-[#1a1c1b]">Mesa Centro Monolito</h5>
                      <span className="text-[10px] text-[#7c766f] block">Travertino Navona Acetinado</span>
                      <span className="text-xs font-bold text-[#1a1c1b]">{formatPrice(26000)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Resumo Numérico de Valores */}
            <div className="space-y-2 pt-2 border-t border-[#e9e8e6] font-['Plus_Jakarta_Sans'] text-xs">
              <div className="flex justify-between text-[#4a4640]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#1a1c1b]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4a4640]">
                <span>Montagem Luva Branca:</span>
                <span className="text-[#7d5540] font-bold">Cortesia (0 MT)</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#7d5540]">
                  <span>Desconto Curatorial (10%):</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#e9e8e6] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#1a1c1b]">Total Líquido:</span>
                <span className="font-['Playfair_Display'] text-2xl font-normal text-[#1a1c1b]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Selo de Garantia e Confiança */}
            <div className="pt-2 border-t border-[#e9e8e6] text-center font-['Plus_Jakarta_Sans'] text-[11px] text-[#7c766f] space-y-1">
              <div className="flex items-center justify-center gap-1 text-[#7d5540]">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span className="font-semibold uppercase tracking-wider text-[10px]">Transação Auditada</span>
              </div>
              <p>Fatura fiscal válida em Moçambique com NUIT da empresa.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
