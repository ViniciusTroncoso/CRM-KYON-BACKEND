# CRM Kyon Backend

Backend API REST com Supabase para o CRM Kyon. Arquitetura escalável preparada para Web e Mobile.

## 🚀 Stack

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Supabase** - Database (PostgreSQL) + Auth + Storage
- **Helmet** - Segurança HTTP
- **Morgan** - Logging
- **CORS** - Cross-origin resource sharing

## 📁 Estrutura do Projeto

```
crm-kyon-backend/
├── src/
│   ├── config/          # Configurações (Supabase, etc)
│   ├── routes/          # Rotas da API REST
│   ├── services/        # Lógica de negócio
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── supabase/
│   └── schema.sql       # Schema do banco de dados
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🛠️ Setup

### 1. Instalar dependências

```bash
cd crm-kyon-backend
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Copie as credenciais do projeto:
   - **Project URL** (Settings → API → Project URL)
   - **anon/public key** (Settings → API → anon public)
   - **service_role key** (Settings → API → service_role - **SECRETA**)

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e preencha:

```bash
PORT=4000
NODE_ENV=development

SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-publica
SUPABASE_SERVICE_KEY=sua-chave-service-role-secreta

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Rodar o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor estará rodando em `http://localhost:4000`

## 📡 Endpoints da API

### Team Members (`/api/team`)

- `GET /api/team` - Listar todos os membros
- `GET /api/team/:id` - Buscar membro por ID
- `POST /api/team` - Criar novo membro
- `PATCH /api/team/:id` - Atualizar membro
- `DELETE /api/team/:id` - Deletar membro
- `POST /api/team/:id/toggle` - Toggle ativo/inativo

### Leads (`/api/leads`)

- `GET /api/leads?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&owner=Nome&sdrName=Nome` - Listar leads (com filtros)
- `GET /api/leads/:id` - Buscar lead por ID
- `POST /api/leads` - Criar novo lead
- `PATCH /api/leads/:id` - Atualizar lead
- `DELETE /api/leads/:id` - Deletar lead

### SDR Logs (`/api/sdr-logs`)

- `GET /api/sdr-logs?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&sdrName=Nome` - Listar logs (com filtros)
- `GET /api/sdr-logs/:id` - Buscar log por ID
- `POST /api/sdr-logs` - Criar novo log
- `PATCH /api/sdr-logs/:id` - Atualizar log
- `DELETE /api/sdr-logs/:id` - Deletar log

### Marketing Data (`/api/marketing`)

- `GET /api/marketing?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&platform=Meta` - Listar dados (com filtros)
- `GET /api/marketing/:id` - Buscar item por ID
- `POST /api/marketing` - Criar novo item
- `POST /api/marketing/bulk` - Criar múltiplos itens (bulk insert)
- `PATCH /api/marketing/:id` - Atualizar item
- `DELETE /api/marketing/:id` - Deletar item

### Health Check

- `GET /health` - Status do servidor

## 🔗 Integração com o Frontend

No frontend React, configure a URL base da API:

```typescript
// .env no frontend
VITE_API_BASE_URL=http://localhost:4000
```

Exemplo de chamada:

```typescript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leads`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newLead)
});

const result = await response.json();
if (result.success) {
  console.log('Lead criado:', result.data);
}
```

## 📱 Preparação para Mobile

Esta API está pronta para ser consumida por apps mobile (React Native, Flutter, etc.):

- **REST puro** - Sem dependência de cookies/sessões
- **CORS configurável** - Adicione origins do mobile no `.env`
- **Responses padronizados** - `{ success: boolean, data?: any, error?: string }`
- **Supabase** - Suporta auth nativo em mobile

## 🔐 Segurança

- **Helmet** ativado para headers de segurança
- **CORS** restrito a origins permitidas
- **Supabase RLS** (Row Level Security) - Configure políticas no Supabase conforme necessário
- **Service Role Key** - Nunca exponha no frontend, use apenas no backend

## 🚀 Deploy

### Opção 1: Vercel / Render / Railway

1. Conecte o repositório
2. Configure as variáveis de ambiente no painel
3. Deploy automático

### Opção 2: VPS (DigitalOcean, AWS, etc.)

```bash
npm run build
pm2 start dist/index.js --name crm-kyon-backend
```

## 📝 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar validação de inputs (express-validator)
- [ ] Implementar rate limiting
- [ ] Adicionar testes (Jest)
- [ ] Implementar OAuth com Meta Ads
- [ ] Adicionar webhooks para sincronização automática
- [ ] Implementar cache (Redis)

## 📄 Licença

MIT - Kyon Agency
