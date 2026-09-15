import React, { useState } from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#f4f3f1] text-[#1a1c1b] border-t border-[#e3e2e0]">
      {/* Gazette Subscription Banner */}
      <div className="bg-[#e9e8e6]/70 border-b border-[#e3e2e0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.14em] block mb-1.5">
              Aethel Gazette de Design
            </span>
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl lg:text-[28px] text-[#1a1c1b] font-normal tracking-tight">
              Receba a nossa Gazette de Design e Lançamentos Exclusivos
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
              Ensaios curatoriais, prévias de coleções limitadas e cadernos de arquitetura residencial.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto items-stretch gap-0 max-w-md">
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
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <div className="font-['Playfair_Display'] text-2xl font-normal text-[#1a1c1b]">
              Eden
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] leading-relaxed">
              Manifesto de marcenaria autoral, tapeçaria nobre e pedras raras. O mobiliário tratado como escultura habitável e legado temporal para a arquitetura contemporânea africana e internacional.
            </p>
            <div className="flex items-center gap-4 text-[#4a4640] pt-1">
              <span className="material-symbols-outlined text-[20px] hover:text-[#1a1c1b] cursor-pointer" title="Arquitetura">apartment</span>
              <span className="material-symbols-outlined text-[20px] hover:text-[#1a1c1b] cursor-pointer" title="Projetos">architecture</span>
              <span className="material-symbols-outlined text-[20px] hover:text-[#1a1c1b] cursor-pointer" title="Marcenaria">chair</span>
            </div>
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
                  Consultoria de Interiores Dedicada
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('showrooms')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Catálogo Corporativo & Hospitalidade
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('checkout')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Entrega e Montagem de Luva Branca
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('minha-conta')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Certificado de Origem & Garantia 36 Meses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('showrooms')}
                  className="hover:text-[#1a1c1b] transition-colors py-0.5 text-left"
                >
                  Caixa de Amostras de Madeiras e Tecidos
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
              <p className="text-[#1a1c1b] font-medium">Pavilhão Eden Maputo</p>
              <p>Av. Julius Nyerere, Polana Cimento • Moçambique</p>
              <p className="text-[11px] text-[#7c766f]">
                Terça a Sábado: 09h00 às 19h00 (Atendimento sob agendamento)
              </p>
              <div className="pt-2 space-y-1">
                <p className="text-[#1a1c1b]">
                  <span className="text-[10px] text-[#7c766f] uppercase block font-semibold">Linha Direta Concierge:</span>
                  <a href="tel:+258840009200" className="hover:underline font-mono">+258 84 000 9200</a>
                </p>
                <p className="text-[#1a1c1b]">
                  <span className="text-[10px] text-[#7c766f] uppercase block font-semibold">Assessoria de Projetos:</span>
                  <a href="mailto:concierge@aethelstudio.com" className="hover:underline">esm@esme.co.mz</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-6 border-t border-[#e3e2e0] flex flex-col md:flex-row items-center justify-between gap-4 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2025 Eden. Todos os direitos reservados.</span>
            <span className="hidden md:inline text-[#cdc5bd]">•</span>
            <span className="hover:text-[#1a1c1b] cursor-pointer">Privacidade & Termos</span>
            <span className="hidden md:inline text-[#cdc5bd]">•</span>
            <span className="hover:text-[#1a1c1b] cursor-pointer">Políticas de Entrega & Devolução</span>
            <span className="hidden md:inline text-[#cdc5bd]">•</span>
            <span className="hover:text-[#1a1c1b] cursor-pointer">Pagamentos Seguros Criptografados</span>
          </div>

          <div className="flex items-center gap-4 text-[#7c766f] font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-widest font-semibold">
            <span>Autenticidade Certificada</span>
            <span>•</span>
            <span>Design Escultural</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
