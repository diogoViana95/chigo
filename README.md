# chigo. Creative Studio

Loja de catálogo para peças impressas em 3D, com pedidos de contacto em vez de pagamento online, backoffice protegido, português/inglês e temas claro/escuro.

## Desenvolvimento local com Prisma Postgres

1. Instale Node.js 20 ou superior.
2. Copie `.env.example` para `.env`.
3. No Prisma Console, crie uma base dev e copie a **direct connection string**. Substitua o valor placeholder de `DATABASE_URL` em `.env`. O adapter `@prisma/adapter-ppg` comunica com essa credencial por HTTP/WebSockets.
4. Gere um segredo para Auth.js com `npm exec auth secret` e coloque-o em `AUTH_SECRET` no `.env`.
5. Execute `npm install` e `npm run db:setup` para aplicar o schema e criar o utilizador e catálogo iniciais.
6. Execute `npm run dev`.
7. Aceda a `/backoffice/login` com `admin` / `admin`; no primeiro acesso será pedida uma password nova (mínimo 10 caracteres).

`ADMIN_USERNAME` e `ADMIN_PASSWORD` são opcionais para definir credenciais iniciais diferentes antes do primeiro seed. Pode criar outros utilizadores no painel; as passwords iniciais deles também têm de ser alteradas no primeiro acesso.

## Publicação

A aplicação usa Prisma ORM 7 com `@prisma/adapter-ppg`, sem engine Rust, para ligar ao Prisma Postgres em ambientes serverless. Na Vercel, defina `DATABASE_URL` e `AUTH_SECRET` nas variáveis de ambiente. Use a direct connection string do Prisma Postgres para o adapter serverless. Não publique com as credenciais de demonstração.

A página pública usa ISR com revalidação de uma hora. Publicar um produto ou alterar o destaque invalida a página inicial. Robots e sitemap são servidos pelo App Router; rotas do backoffice têm `noindex` e são excluídas do `robots.txt`.
