import React, { useState } from 'react';
import { CartItem } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onViewProduct: (product: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onViewProduct
}) => {
  const { formatPrice, t } = useLocalization();
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice || item.product.price) * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'BEMVINDO10' || coupon.trim().toUpperCase() === 'ARQ10') {
      setDiscountPercent(10);
      setCouponMessage('✓ Cupom de 10% aplicado');
    } else if (coupon.trim().toUpperCase() === 'VIP20') {
      setDiscountPercent(20);
      setCouponMessage('✓ Benefício VIP de 20% aplicado');
    } else {
      setCouponMessage('Código não reconhecido. Tente BEMVINDO10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop com blur suave */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#e9e8e6]">
          {/* Header do Drawer */}
          <div className="p-6 border-b border-[#e9e8e6] flex items-center justify-between bg-[#faf9f7]">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block">
                Caderno de Aquisição
              </span>
              <h2 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal">
                Peças Selecionadas ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#7c766f] hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Lista de Peças */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#7c766f]">
                  shopping_bag
                </span>
                <h3 className="font-['Playfair_Display'] text-lg text-[#1a1c1b]">
                  O seu caderno está vazio
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] max-w-xs mx-auto">
                  Explore o nosso catálogo autoral e adicione peças ao seu caderno de obras.
                </p>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const itemPrice = item.unitPrice || item.product.price;
                return (
                  <div
                    key={idx}
                    className="flex gap-4 p-3.5 border border-[#e9e8e6] bg-[#faf9f7] hover:border-black transition-colors"
                  >
                    <div
                      onClick={() => {
                        onViewProduct(item.product);
                        onClose();
                      }}
                      className="w-20 h-20 bg-[#efeeec] overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between font-['Plus_Jakarta_Sans']">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => {
                              onViewProduct(item.product);
                              onClose();
                            }}
                            className="text-xs font-bold text-[#1a1c1b] truncate cursor-pointer hover:text-[#7d5540]"
                          >
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[#7c766f] hover:text-[#ba1a1a]"
                            title="Remover"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>

                        {item.selectedMaterial && (
                          <span className="text-[10px] text-[#7c766f] block mt-0.5">
                            Acabamento: {item.selectedMaterial}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-[10px] text-[#7c766f] block">
                            Dimensão: {item.selectedSize}
                          </span>
                        )}

                        <span className="text-xs font-bold text-[#1a1c1b] mt-1 block">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#efeeec] mt-2">
                        {/* Controles de Quantidade */}
                        <div className="inline-flex items-center border border-[#cdc5bd] bg-white h-7">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-full text-xs text-[#1a1c1b] hover:bg-[#efeeec] flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-[#1a1c1b]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-full text-xs text-[#1a1c1b] hover:bg-[#efeeec] flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-[10px] text-[#7d5540] font-semibold uppercase">
                          Luva Branca
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé do Caderno */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#e9e8e6] bg-[#faf9f7] space-y-4">
              {/* Cupom */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Cupom de Arquiteto..."
                  className="flex-1 bg-white px-3 py-2 text-xs font-['Plus_Jakarta_Sans'] border border-[#cdc5bd] focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-4 bg-black text-white text-[11px] font-['Plus_Jakarta_Sans'] font-semibold uppercase tracking-wider hover:bg-[#7d5540]"
                >
                  Aplicar
                </button>
              </form>
              {couponMessage && (
                <span className="text-[10px] font-['Plus_Jakarta_Sans'] text-[#7d5540] block">
                  {couponMessage}
                </span>
              )}

              {/* Totais */}
              <div className="space-y-1.5 font-['Plus_Jakarta_Sans'] text-xs">
                <div className="flex justify-between text-[#4a4640]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1a1c1b]">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#7d5540]">
                    <span>Desconto ({discountPercent}%):</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4a4640]">
                  <span>Entrega Luva Branca:</span>
                  <span className="font-bold text-[#7d5540] uppercase text-[11px]">Cortesia</span>
                </div>
                <div className="pt-2 border-t border-[#e9e8e6] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1a1c1b]">Total Líquido:</span>
                  <span className="font-['Playfair_Display'] text-2xl font-normal text-[#1a1c1b]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <button
                onClick={() => {
                  onProceedToCheckout();
                  onClose();
                }}
                className="w-full py-3.5 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-[0.16em] transition-colors shadow-md text-center flex items-center justify-center gap-2"
              >
                <span>Finalizar Pedido • Luva Branca</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>

              <p className="text-[10px] font-['Plus_Jakarta_Sans'] text-center text-[#7c766f]">
                Produção artesanal numerada com garantia estrutural de 24 meses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
