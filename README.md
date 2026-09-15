# EDEN — E-commerce de Móveis

MVP React/Vite com catálogo responsivo, autenticação, favoritos, carrinho, checkout, ordens, showrooms e administração persistidos no Supabase.

## Executar localmente

Requisitos: Node.js 20 ou superior e um projeto Supabase.

```bash
npm install
copy .env.example .env.local
npm run dev
```

A loja abre em `http://localhost:3001` e a administração separada em `http://localhost:3001/admin`. Preencha `.env.local` com a Project URL e a chave pública/publishable copiadas de **Supabase → Settings → API**. Uma chave válida começa normalmente por `sb_publishable_` ou, em projetos antigos, por `eyJ`. A chave `service_role` nunca deve ser usada no navegador.

Sem essas variáveis, o catálogo de demonstração só é usado durante desenvolvimento; autenticação, checkout e gravações ficam corretamente indisponíveis, sem simular sucesso.

## Preparar o Supabase

1. No SQL Editor, execute [a migração inicial](supabase/migrations/20260915170000_initial_mvp.sql).
2. Para dados de desenvolvimento, execute [o seed](supabase/seed.sql).
3. Em Authentication > URL Configuration, adicione `http://localhost:3001` aos Redirect URLs.
4. Crie primeiro a conta que será administrativa. Pode fazê-lo na loja e terminar a sessão em seguida.
5. Para promover essa conta a administrador, execute no SQL Editor, substituindo o e-mail:

```sql
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id and u.email = 'admin@exemplo.co.mz';
```

Depois da promoção, essa conta deixa de entrar na área de clientes e passa a usar exclusivamente `/admin`. Clientes nunca recebem links, formulários ou dados do painel administrativo. A ocultação visual é acompanhada por RLS e pela função `is_admin()` no banco, que impedem operações administrativas com uma sessão comum.

O bucket público `product-media`, as políticas RLS e as funções atómicas de carrinho/pedido são criados pela migração. A função de checkout recalcula valores e cupões no servidor, bloqueia stock durante a transação e regista os movimentos de inventário.

## Verificação

```bash
npm run check
```

Esse comando executa TypeScript estrito, testes essenciais e o build de produção. As dependências são instaladas apenas em `node_modules` deste projeto.

## Fotografias 360° dos produtos

O visualizador não fabrica ângulos por inteligência artificial. Ele usa exclusivamente as imagens reais cadastradas em `product_images`, ordenadas pelo campo `position`.

- Até 11 imagens: modo multiângulo, com troca de vista, zoom até 400% e pan.
- A partir de 12 imagens: modo 360°, com rotação por arrasto, rato, toque e setas do teclado.
- Recomendado: 36 ou 72 fotografias, fundo e iluminação fixos, nomes `produto-001.webp` até `produto-036.webp`.

No painel administrativo, selecione todos os frames de uma vez. Os ficheiros são ordenados numericamente pelo nome e enviados ao bucket `product-media`. Cada frame pode ter no máximo 5 MB e deve ser JPG, PNG ou WebP.

## Moedas e tradução automática

Os preços são armazenados em MZN e convertidos globalmente com taxas atuais da ExchangeRate-API. As taxas ficam em cache por 12 horas; se o serviço estiver indisponível, o site usa apenas a última taxa real guardada e nunca inventa uma cotação.

Ao selecionar inglês, o site usa primeiro a Translator API nativa do navegador, quando disponível. Nos outros navegadores, usa a API oficial do MyMemory e guarda as traduções em cache. O conteúdo é traduzido conforme cada tela aparece; nomes, e-mails e dados identificáveis marcados como privados não são enviados para tradução.

## Estrutura principal

- `src/services`: acesso ao catálogo, comércio e administração.
- `src/context/AuthContext.tsx`: sessão e perfis do Supabase Auth.
- `supabase/migrations`: tabelas, índices, RLS, Storage e RPCs.
- `supabase/seed.sql`: catálogo, variantes, cupão e showroom para desenvolvimento.
