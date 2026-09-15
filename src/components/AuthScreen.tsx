import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';

interface AuthScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const { login, register, resetPassword, isAdmin, configured } = useAuth();
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
      setAuthFeedback('Sessão iniciada com segurança.');
      onNavigate(account.role === 'admin' ? 'gestao' : 'minha-conta');
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
    <div className="w-full min-h-[calc(100vh-160px)] bg-[#faf9f7] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl w-full bg-white border border-[#e9e8e6] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ==========================================
            COLUNA ESQUERDA: EDITORIAL ARQUITETÔNICO
            ========================================== */}
        <div className="relative lg:col-span-5 bg-[#1c1b1a] text-white p-5 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Foto de fundo com scrim suave */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhLlqgo3Z6Tpg1ioE_TBD6ATVxCZkqubNx0nSPWoyJRF_3EyeddV_CnxHgXUhux-YLBpCE9ZO9JuOYquZRmcfoWZCPInA9mta6uh2uiFFI3iUqe5WFqyvGG0Z8dXVwQ6EK0hsBdEyZcOaO1lvxDKSlINCRVSS8GG6Npoe-AUmUOAKdNuhAScY1OVy4y7WHmQG8jnA35FAiG6EFB2YbBGSLTgNMzvwZ7FDmYH4wI68d6GCxVv3SH-sdcA"
              alt="Atelier Aethel"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1a] via-[#1c1b1a]/80 to-transparent"></div>
          </div>

          {/* Top Monogram */}
          <div className="relative z-10">
            <span className="font-['Playfair_Display'] font-black text-3xl tracking-tight text-white block">
              A
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[9px] uppercase tracking-[0.3em] text-[#efbca1] font-semibold">
              AETHEL CONCIERGE & GESTÃO
            </span>
          </div>

          {/* Conteúdo Central */}
          <div className="relative z-10 my-8 space-y-6">
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-white font-normal leading-snug">
              O Mobiliário Autoral como Extensão da sua Visão Arquitetônica
            </h2>

            <div className="space-y-4 font-['Plus_Jakarta_Sans'] text-xs text-[#cac6c4]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#efbca1] text-[18px] shrink-0 mt-0.5">
                  admin_panel_settings
                </span>
                <p>Credenciais de Administrador com controle total de acervo e pedidos.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#efbca1] text-[18px] shrink-0 mt-0.5">
                  timeline
                </span>
                <p>Caderno de Obras & Rastreamento da linha de fabrico em tempo real.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#efbca1] text-[18px] shrink-0 mt-0.5">
                  deployed_code
                </span>
                <p>Acesso exclusivo a bibliotecas de blocos 3D BIM, Revit e SketchUp.</p>
              </div>
            </div>
          </div>

          {/* Quote Inferior */}
          <div className="relative z-10 pt-4 border-t border-white/10 font-['Playfair_Display'] italic text-xs text-[#cdc5bd]">
            “O luxo contemporâneo não grita; ele habita a matéria e acolhe o silêncio.”
          </div>
        </div>

        {/* ==========================================
            COLUNA DIREITA: FORMULÁRIO DE ACESSO VIP
            ========================================== */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em]">
                Portal do Concierge & Painel
              </span>
              {isAdmin && (
                <span className="text-[10px] font-mono font-bold bg-black text-[#fec9ae] px-2 py-0.5 uppercase">
                  Sessão Admin Ativa
                </span>
              )}
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal">
              Credenciação Segura
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#7c766f] mt-1">
              Acesse a sua conta de administrador, gabinete de arquitetura ou crie seu cadastro.
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
                  Correio Eletrónico Executivo / Admin
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@aethel.mz ou beatriz.mendes@arquitetura.co.mz"
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
                className="w-full py-4 bg-black text-white hover:bg-[#7d5540] text-[11px] uppercase font-semibold tracking-[0.16em] transition-colors shadow-sm mt-2"
              >
                {submitting ? 'A autenticar…' : 'Aceder ao Portal Concierge'}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e9e8e6]"></div>
                </div>
                <span className="relative px-3 bg-white text-[10px] uppercase font-semibold tracking-wider text-[#7c766f]">
                  Atalhos de Navegação Direta
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('gestao')}
                  className="py-2.5 px-3 border border-[#cdc5bd] hover:border-black flex items-center justify-center gap-2 transition-colors text-xs font-semibold text-[#1a1c1b]"
                >
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  <span>Gestão Acervo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="py-2.5 px-3 border border-[#cdc5bd] hover:border-black flex items-center justify-center gap-2 transition-colors text-xs font-semibold text-[#1a1c1b]"
                >
                  <span className="material-symbols-outlined text-[16px]">analytics</span>
                  <span>Painel B2B</span>
                </button>
              </div>
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
                <span>Concordo com os termos do programa curatorial e privacidade da Aethel.</span>
              </label>

              <button
                type="submit"
                disabled={submitting || !configured}
                className="w-full py-4 bg-black text-white hover:bg-[#7d5540] text-[11px] uppercase font-semibold tracking-[0.16em] transition-colors shadow-sm mt-2"
              >
                {submitting ? 'A criar conta…' : 'Concluir Cadastro VIP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
