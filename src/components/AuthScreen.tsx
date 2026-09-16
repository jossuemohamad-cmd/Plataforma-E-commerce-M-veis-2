import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import edenLogo from '../assets/images/eden-logo-official.png';

interface AuthScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const { login, register, resetPassword, logout, configured } = useAuth();
  const { t } = useLocalization();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'residential' | 'architect'>('architect');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthFeedback(null);
    try {
      const account = await login(email, password);
      if (account.role === 'admin') {
        await logout();
        throw new Error('Contas administrativas devem entrar exclusivamente pelo portal de administração.');
      }
      setAuthFeedback('Sessão iniciada com segurança.');
      onNavigate('minha-conta');
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : 'Não foi possível iniciar sessão.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regEmail) return;
    setSubmitting(true);
    setAuthFeedback(null);
    try {
      const result = await register({
        name,
        email: regEmail,
        password: regPassword,
        firmName: accountType === 'architect' ? firmName : undefined,
        accountType
      });
      if (result.needsEmailConfirmation) {
        setAuthFeedback('Conta criada. Confirme o endereço através do e-mail enviado.');
        setMode('login');
      } else {
        setAuthFeedback('Conta criada e sessão iniciada.');
        onNavigate('minha-conta');
      }
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setAuthFeedback('Informe primeiro o seu e-mail.');
      return;
    }
    try {
      await resetPassword(email);
      setAuthFeedback('Enviámos as instruções de recuperação para o seu e-mail.');
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : 'Falha ao solicitar recuperação.');
    }
  };

  return (
    <div className="w-full min-h-[calc(100dvh-96px)] sm:min-h-[calc(100dvh-116px)] lg:h-[calc(100dvh-116px)] bg-white flex items-stretch justify-center overflow-x-hidden lg:overflow-hidden">
      <div className="eden-card max-w-[1600px] mx-4 sm:mx-6 lg:mx-10 my-3 sm:my-5 w-full bg-white border border-[#dedede] shadow-[0_24px_80px_rgba(19,34,64,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ==========================================
            COLUNA ESQUERDA: EDITORIAL ARQUITETÔNICO
            ========================================== */}
        <div className="eden-dark-surface relative hidden lg:flex lg:col-span-5 bg-[#132240] text-white p-8 xl:p-10 flex-col justify-between overflow-hidden">
          {/* Foto de fundo com scrim suave */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/catalog/a23cd55efff9293df9de.jpg"
              alt="Quarto Eden"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#132240] via-[#132240]/80 to-transparent"></div>
          </div>

          {/* Top Monogram */}
          <div className="relative z-10">
            <div className="inline-flex rounded-[10px] bg-white p-2.5 shadow-lg">
              <img src={edenLogo} alt="Eden — Colchões e Mobília" className="h-12 w-auto object-contain" />
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[9px] uppercase tracking-[0.3em] text-white font-semibold">
              CONTA DE CLIENTE
            </span>
          </div>

          {/* Conteúdo Central */}
          <div className="relative z-10 my-8 space-y-6">
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-white font-bold leading-snug">
              A sua conta Eden, simples e segura
            </h2>

            <div className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs text-[#cac6c4]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#FDCB00] text-[18px] shrink-0 mt-0.5">
                  shopping_bag
                </span>
                <p>Consulte pedidos, favoritos e dados de entrega num só lugar.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#FDCB00] text-[18px] shrink-0 mt-0.5">
                  timeline
                </span>
                <p>Acompanhe encomendas e mantenha o carrinho sincronizado.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#FDCB00] text-[18px] shrink-0 mt-0.5">
                  deployed_code
                </span>
                <p>Conta residencial ou profissional para arquitectos e empresas.</p>
              </div>
            </div>
          </div>

          {/* Quote Inferior */}
          <div className="relative z-10 pt-4 border-t border-white/10 font-['Playfair_Display'] italic text-xs text-[#cdc5bd]">
            “Mais do que uma marca, a escolha para um sono saudável.”
          </div>
        </div>

        {/* ==========================================
            COLUNA DIREITA: FORMULÁRIO DE ACESSO VIP
            ========================================== */}
        <div className="scrollbar-hidden lg:col-span-7 p-5 sm:p-8 xl:p-10 flex flex-col justify-center overflow-y-auto overscroll-contain">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em]">
                Área reservada ao cliente
              </span>
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-bold">
              Entre na sua conta Eden
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#7c766f] mt-1">
              Inicie sessão ou crie uma conta para comprar e acompanhar as suas encomendas.
            </p>
          </div>

          {/* Feedback message banner */}
          {authFeedback && (
            <div className="mt-4 p-3 bg-[#f4ede7] border border-[#7d5540]/30 text-[#7d5540] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{authFeedback}</span>
            </div>
          )}

          {!configured && <div className="mt-5 p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7c766f] mb-2">
              Configuração necessária
            </span>
            Defina as variáveis públicas do Supabase em <code>.env.local</code> para ativar autenticação e dados reais.
          </div>}

          {/* Abas Iniciar Sessão vs Criar Conta */}
          <div className="flex border-b border-[#e9e8e6] mt-6 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`pb-3 font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold mr-6 border-b-2 transition-colors ${
                mode === 'login' ? 'border-black text-[#1a1c1b]' : 'border-transparent text-[#7c766f] hover:text-[#1a1c1b]'
              }`}
            >
              {t('btn.login', 'Iniciar Sessão')}
            </button>
            <button
              onClick={() => setMode('register')}
              className={`pb-3 font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                mode === 'register' ? 'border-black text-[#1a1c1b]' : 'border-transparent text-[#7c766f] hover:text-[#1a1c1b]'
              }`}
            >
              {t('btn.register', 'Criar Conta Exclusiva')}
            </button>
          </div>

          {/* FORM: INICIAR SESSÃO */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs">
              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Correio eletrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seunome@email.com"
                  className="w-full bg-[#f4f3f1] px-4 py-3 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px]">
                    Palavra-passe
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleResetPassword()}
                    className="text-[11px] text-[#7d5540] hover:underline"
                  >
                    Esqueceu a palavra-passe?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#f4f3f1] px-4 py-3 pr-10 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#7c766f] hover:text-[#1a1c1b]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" defaultChecked className="accent-black" id="remember" />
                <label htmlFor="remember" className="text-[#7c766f] text-xs cursor-pointer">
                  Manter sessão iniciada neste dispositivo
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || !configured}
                className="w-full py-4 bg-[#005EA4] text-white hover:bg-[#132240] text-[11px] uppercase font-semibold tracking-[0.16em] transition-colors shadow-sm mt-2"
              >
                {submitting ? 'A autenticar…' : 'Entrar na minha conta'}
              </button>

            </form>
          )}

          {/* FORM: CRIAR CONTA EXCLUSIVA (CADASTRO TOTALMENTE FUNCIONAL) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs">
              {/* Seletor de Tipo de Conta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setAccountType('residential')}
                  className={`py-2 text-center text-xs border transition-colors ${
                    accountType === 'residential'
                      ? 'border-black bg-[#faf9f7] font-bold text-black'
                      : 'border-[#cdc5bd] text-[#7c766f]'
                  }`}
                >
                  Cliente Residencial
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('architect')}
                  className={`py-2 text-center text-xs border transition-colors ${
                    accountType === 'architect'
                      ? 'border-black bg-[#faf9f7] font-bold text-black'
                      : 'border-[#cdc5bd] text-[#7c766f]'
                  }`}
                >
                  Arquiteto / B2B
                </button>
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nome do titular ou arquiteto"
                  className="w-full bg-[#f4f3f1] px-4 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                />
              </div>

              {accountType === 'architect' && (
                <div>
                  <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                    Gabinete de Arquitetura / Empresa
                  </label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="Ex: Studio Maputo Design"
                    className="w-full bg-[#f4f3f1] px-4 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Correio Eletrónico
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="contato@empresa.co.mz"
                  className="w-full bg-[#f4f3f1] px-4 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Definir Palavra-passe
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#f4f3f1] px-4 py-2.5 text-[#1a1c1b] border border-[#e9e8e6] focus:bg-white focus:outline-none"
                />
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer text-[#7c766f]">
                <input type="checkbox" defaultChecked required className="accent-black mt-0.5" />
                <span>Concordo com os termos e a política de privacidade da Eden.</span>
              </label>

              <button
                type="submit"
                disabled={submitting || !configured}
                className="w-full py-4 bg-black text-white hover:bg-[#7d5540] text-[11px] uppercase font-semibold tracking-[0.16em] transition-colors shadow-sm mt-2"
              >
                {submitting ? 'A criar conta…' : 'Criar a minha conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
