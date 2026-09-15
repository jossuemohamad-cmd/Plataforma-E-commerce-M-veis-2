import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { subscribeNewsletter } from '../services/catalogService';
import edenLogo from '../assets/images/eden-logo-official.png';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setFeedback(null);
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Não foi possível concluir a subscrição.');
    }
  };

  return (
    <footer className="eden-footer w-full bg-[#132240] text-white border-t-4 border-[#FDCB00]">
      {/* Gazette Subscription Banner */}
      <div className="bg-[#e9e8e6]/70 border-b border-[#e3e2e0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.14em] block mb-1.5">
              Novidades Eden
            </span>
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl lg:text-[28px] text-[#1a1c1b] font-normal tracking-tight">
              Novidades, inspirações e promoções Eden
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
              Fique por dentro das novidades da marca e conheça as nossas soluções para um sono saudável.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch gap-2 sm:gap-0 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu correio eletrónico executivo"
              required
              className="w-full sm:w-80 px-4 py-3 bg-white font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#1a1c1b] focus:outline-none focus:ring-1 focus:ring-black rounded-none placeholder:text-[#7c766f] border border-r-0 border-[#cdc5bd]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.14em] font-semibold hover:bg-[#7d5540] transition-colors whitespace-nowrap"
            >
              {subscribed ? 'Subscrito!' : 'Subscrever'}
            </button>
          </form>
          {feedback && <p role="alert" className="text-xs text-red-700">{feedback}</p>}
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <img src={edenLogo} alt="Eden — Colchões e Mobília" className="h-16 w-auto max-w-[165px] object-contain object-left" />
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] leading-relaxed">
              Mais do que uma marca, a escolha para um sono saudável. Personalizamos produtos para responder às necessidades de cada cliente.
            </p>
            <a href="https://esm.co.mz/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-[#102752] hover:underline">
              Site oficial ESM
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">open_in_new</span>
            </a>
          </div>

          {/* Navegação de Ambientes */}
          <div className="space-y-3">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase text-[#1a1c1b] tracking-[0.14em] font-bold">
              Navegação de Ambientes
            </h4>
            <ul className="space-y-1.5 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('explore-ambientes')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Sala de Estar Contemporânea
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('explore-ambientes')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Sala de Jantar & Banquete
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('explore-ambientes')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Quarto & Suíte Master
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('explore-ambientes')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Escritório Executivo & Ateliê
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('explore-ambientes')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Cozinha Gourmet Integrada
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('explore-ambientes')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Área Externa & Lounge Privado
                </button>
              </li>
            </ul>
          </div>

          {/* Serviços & Experiência */}
          <div className="space-y-3">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase text-[#1a1c1b] tracking-[0.14em] font-bold">
              Serviços & Experiência
            </h4>
            <ul className="space-y-1.5 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => document.getElementById('showroom-interativo')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Showroom Virtual Interativo 3D
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('showrooms')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Colchões e mobiliário
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('showrooms')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Personalização de produtos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('checkout')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Vendas a retalho
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('minha-conta')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Vendas a grosso
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('showrooms')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Esponjas para usos diversos
                </button>
              </li>
            </ul>
          </div>

          {/* Atendimento & Contacto */}
          <div className="space-y-3">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase text-[#1a1c1b] tracking-[0.14em] font-bold">
              Atendimento & Contacto
            </h4>
            <div className="space-y-2 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
              <p className="text-[#1a1c1b] font-medium">Espuma de Moçambique, Lda.</p>
              <p>Av. Samora Machel, Bairro Tchumene, Matola</p>
              <div className="pt-2 space-y-1">
                <p className="text-[#1a1c1b]">
                  <span className="text-[10px] text-[#7c766f] uppercase block font-semibold">Vendas a retalho:</span>
                  <a href="tel:+258870003388" className="hover:underline font-mono">+258 87 000 3388</a>
                  <span className="mx-1 text-[#cdc5bd]">•</span>
                  <a href="mailto:esales@esm.co.mz" className="hover:underline">esales@esm.co.mz</a>
                </p>
                <p className="text-[#1a1c1b]">
                  <span className="text-[10px] text-[#7c766f] uppercase block font-semibold">Vendas a grosso:</span>
                  <a href="tel:+258841110444" className="hover:underline font-mono">+258 84 111 0444</a>
                  <span className="mx-1 text-[#cdc5bd]">•</span>
                  <a href="mailto:customers@esm.co.mz" className="hover:underline">customers@esm.co.mz</a>
                </p>
                <p className="pt-1 text-[11px] text-[#7c766f]">Facebook • Instagram • LinkedIn • YouTube • WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-6 border-t border-[#e3e2e0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Eden. Todos os direitos reservados.</span>
            <span className="hidden md:inline text-[#cdc5bd]">•</span>
            <span className="hover:text-[#1a1c1b] cursor-pointer">Privacidade & Termos</span>
            <span className="hidden md:inline text-[#cdc5bd]">•</span>
            <span className="hover:text-[#1a1c1b] cursor-pointer">Políticas de Entrega & Devolução</span>
            <span className="hidden md:inline text-[#cdc5bd]">•</span>
            <span className="hover:text-[#1a1c1b] cursor-pointer">Pagamentos Seguros Criptografados</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[#7c766f] font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-widest font-semibold">
            <span>Marca registada da Espuma de Moçambique</span>
            <span>•</span>
            <span>NUIT 400309809</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
