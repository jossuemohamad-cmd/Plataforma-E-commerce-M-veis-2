import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product, ActiveScreen } from '../types';
import { listProducts } from '../services/catalogService';
import { deleteProduct, saveProduct } from '../services/adminService';
import { ManagementScreen } from './ManagementScreen';
import { DashboardScreen } from './DashboardScreen';
import edenLogo from '../assets/images/eden-logo-official.png';

export default function AdminPortal() {
  const { user, loading, isAdmin, configured, login, logout } = useAuth();
  const [view, setView] = useState<'gestao' | 'dashboard'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const reloadProducts = async () => setProducts(await listProducts());

  useEffect(() => {
    if (isAdmin && configured) void reloadProducts().catch((error) => setFeedback(error instanceof Error ? error.message : 'Falha ao carregar produtos.'));
  }, [isAdmin, configured]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const account = await login(email, password);
      if (account.role !== 'admin') {
        await logout();
        throw new Error('Esta conta não possui autorização administrativa.');
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Não foi possível iniciar sessão.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#132240] text-white grid place-items-center">A verificar acesso…</div>;

  if (!configured) {
    return (
      <main className="min-h-screen bg-[#132240] p-5 text-white grid place-items-center">
        <section className="w-full max-w-xl border-t-8 border-[#FDCB00] bg-white p-7 text-[#132240] shadow-2xl sm:p-10">
          <img src={edenLogo} alt="Eden" className="h-20 w-auto object-contain object-left" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#005EA4]">Portal administrativo</p>
          <h1 className="mt-2 text-3xl font-bold">Ligação ao Supabase pendente</h1>
          <p className="mt-4 text-base leading-7 text-[#2D3E50]">O endereço guardado ainda é <strong>SEU-PROJETO</strong> e a chave atual não é uma chave pública válida. O painel permanecerá bloqueado até receber as credenciais reais.</p>
          <ol className="mt-6 space-y-3 text-sm leading-6 text-[#2D3E50]">
            <li><strong>1.</strong> No Supabase, abra Settings → API.</li>
            <li><strong>2.</strong> Copie a Project URL e a chave publishable/anon.</li>
            <li><strong>3.</strong> Substitua os dois valores no ficheiro <code>.env.local</code> e reinicie o site.</li>
          </ol>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="mt-7 inline-flex bg-[#FDCB00] px-5 py-3 font-bold text-[#132240] hover:bg-[#ffd83d]">Abrir painel do Supabase</a>
        </section>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#132240] p-5 text-white grid place-items-center">
        <section className="w-full max-w-md bg-white p-7 text-[#132240] shadow-2xl sm:p-9">
          <img src={edenLogo} alt="Eden" className="mx-auto h-20 w-auto object-contain" />
          <div className="mt-7 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#005EA4]">Acesso interno</p>
            <h1 className="mt-2 text-2xl font-bold">Administração Eden</h1>
            <p className="mt-2 text-sm leading-6 text-[#2D3E50]">Área exclusiva para utilizadores previamente autorizados. Não é permitido criar contas aqui.</p>
          </div>
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-sm font-bold">E-mail administrativo</label>
              <input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-[#b8cada] bg-[#f5faff] px-4 py-3 outline-none focus:border-[#005EA4]" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-bold">Palavra-passe</label>
              <input id="admin-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#b8cada] bg-[#f5faff] px-4 py-3 outline-none focus:border-[#005EA4]" />
            </div>
            {feedback && <p role="alert" className="border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-800">{feedback}</p>}
            <button type="submit" disabled={submitting} className="w-full bg-[#005EA4] px-5 py-3 font-bold text-white hover:bg-[#132240] disabled:opacity-60">{submitting ? 'A verificar…' : 'Entrar no painel'}</button>
          </form>
          <a href="/" className="mt-5 block text-center text-sm font-semibold text-[#005EA4] hover:underline">Voltar à loja</a>
        </section>
      </main>
    );
  }

  const navigateAdmin = (screen: ActiveScreen) => {
    if (screen === 'gestao' || screen === 'dashboard') setView(screen);
  };

  const addProduct = async (product: Product) => { await saveProduct(product); await reloadProducts(); };
  const updateProduct = async (product: Product) => { await saveProduct(product); await reloadProducts(); };
  const removeProduct = async (productId: string) => { await deleteProduct(productId); await reloadProducts(); };

  return (
    <div className="min-h-screen bg-[#f5faff] text-[#132240]">
      <header className="sticky top-0 z-50 border-b border-[#dbe8f0] bg-white">
        <div className="mx-auto flex min-h-20 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <img src={edenLogo} alt="Eden" className="h-14 w-auto object-contain" />
            <span className="hidden border-l border-[#dbe8f0] pl-4 text-xs font-bold uppercase tracking-[0.16em] text-[#005EA4] sm:block">Administração</span>
          </div>
          <nav className="flex items-center gap-2">
            <button onClick={() => setView('dashboard')} className={`px-3 py-2 text-sm font-bold ${view === 'dashboard' ? 'bg-[#005EA4] text-white' : 'text-[#132240] hover:bg-[#eef7fc]'}`}>Pedidos</button>
            <button onClick={() => setView('gestao')} className={`px-3 py-2 text-sm font-bold ${view === 'gestao' ? 'bg-[#005EA4] text-white' : 'text-[#132240] hover:bg-[#eef7fc]'}`}>Produtos</button>
            <button onClick={() => void logout()} className="ml-1 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50">Sair</button>
          </nav>
        </div>
      </header>
      <main>
        {feedback && <p role="alert" className="mx-auto mt-4 max-w-[1500px] border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-800">{feedback}</p>}
        {view === 'dashboard' ? (
          <DashboardScreen onNavigate={navigateAdmin} />
        ) : (
          <ManagementScreen products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={removeProduct} onNavigate={navigateAdmin} />
        )}
      </main>
    </div>
  );
}
