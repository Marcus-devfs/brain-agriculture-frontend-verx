Brain Agriculture - Frontend



Aplicação frontend para gerenciamento de propostas de crédito rural, parte do desafio técnico para a Brain Agriculture.
🚀 Sobre o projeto

Este projeto é uma aplicação web frontend desenvolvida em React com Next.js, que consome uma API RESTful para cadastro, listagem, edição e exclusão de propostas de crédito rural.
O sistema possui:

Dashboard geral com indicadores e gráficos para visualização rápida dos dados.
Página de listagem de propostas com filtros e navegação.
Página para adicionar novas propostas com validações.
Utilização de bibliotecas modernas para formulários, gráficos e UI.
🛠️ Tecnologias utilizadas

React
Next.js
TypeScript
React Hook Form (formulários e validação)
Zod (validação de dados)
Recharts (gráficos)
Axios (requisições HTTP)
Tailwind CSS (estilização)
Jest + React Testing Library (testes)
📋 Funcionalidades

Cadastro de propostas de crédito rural com os campos:
Nome do produtor
CPF
Nome da fazenda
Cidade
Estado
Área total (calculada automaticamente)
Área agricultável
Área de vegetação
Tipo de cultivo
Valor da proposta
Listagem paginada e filtrável das propostas
Edição e exclusão de propostas existentes
Dashboard com gráficos e indicadores baseados nas propostas cadastradas
Validações de formulário robustas com feedback ao usuário
🔧 Backend

O backend está hospedado em uma instância Amazon EC2, rodando via Docker e disponível na porta 3000 no IP:
http://<IP-EXEMPLO>:3000

Exemplo: http://18.222.33.44:3000
A API RESTful está configurada para ser consumida pela aplicação frontend.

📦 Como rodar o projeto localmente

Pré-requisitos
Node.js v18 ou superior
npm ou yarn
Backend rodando e acessível (ex: na EC2 com Docker)
Passos
Clone o repositório:
git clone https://github.com/Marcus-devfs/brain-agriculture-frontend-verx.git
cd brain-agriculture-frontend-verx

Instale as dependências:
npm install

ou

yarn install

Configure a URL da API no arquivo .env.local (exemplo):
NEXT_PUBLIC_API_URL=http://<IP-EXEMPLO>:3000/api

Execute a aplicação em modo desenvolvimento:
npm run dev

ou

yarn dev

Acesse em http://localhost:3000
🧪 Testes

Para rodar os testes unitários e de integração:

npm run test

ou

yarn test

📍 Deploy

O projeto está hospedado no Vercel e pode ser acessado em:

https://brain-agriculture-frontend.vercel-verx.app

📝 Considerações finais

Este frontend faz parte do desafio técnico para a vaga de Desenvolvedor(a) Fullstack na Brain Agriculture, contemplando as funcionalidades solicitadas e buscando um código limpo e organizado.
Qualquer dúvida ou sugestão, estou à disposição!

