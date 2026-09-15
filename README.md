# EDEN — E-commerce de Móveis

MVP React/Vite com catálogo responsivo, autenticação, favoritos, carrinho, checkout, ordens, showrooms e administração persistidos no Supabase.

## Executar localmente

Requisitos: Node.js 20 ou superior e um projeto Supabase.

```bash
npm install
copy .env.example .env.local
npm run dev
```

A aplicação abre em `http://localhost:3001`. Preencha `.env.local` com a URL e a chave pública/publishable do Supabase. A chave `service_role` nunca deve ser usada no navegador.

Sem essas variáveis, o catálogo de demonstração só é usado durante desenvolvimento; autenticação, checkout e gravações ficam corretamente indisponíveis, sem simular sucesso.

## Preparar o Supabase

1. No SQL Editor, execute [a migração inicial](supabase/migrations/20260915170000_initial_mvp.sql).
2. Para dados de desenvolvimento, execute [o seed](supabase/seed.sql).
3. Em Authentication > URL Configuration, adicione `http://localhost:3001` aos Redirect URLs.
4. Crie uma conta normalmente na aplicação.
5. Para promover essa conta a administrador, execute no SQL Editor, substituindo o e-mail:

```sql
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id and u.email = 'admin@exemplo.co.mz';
```

O bucket público `product-media`, as políticas RLS e as funções atómicas de carrinho/pedido são criados pela migração. A função de checkout recalcula valores e cupões no servidor, bloqueia stock durante a transação e regista os movimentos de inventário.

## Verificação

```bash
npm run check
```

Esse comando executa TypeScript estrito, testes essenciais e o build de produção. As dependências são instaladas apenas em `node_modules` deste projeto.

## Estrutura principal

- `src/services`: acesso ao catálogo, comércio e administração.
- `src/context/AuthContext.tsx`: sessão e perfis do Supabase Auth.
- `supabase/migrations`: tabelas, índices, RLS, Storage e RPCs.
- `supabase/seed.sql`: catálogo, variantes, cupão e showroom para desenvolvimento.
