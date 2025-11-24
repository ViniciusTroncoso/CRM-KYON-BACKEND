# Guia de Setup Completo - CRM Kyon

## 1. Setup do Backend (Supabase + Node.js)

### 1.1 Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Preencha:
   - Nome: `crm-kyon`
   - Database Password: (escolha uma senha forte)
   - Region: `South America (São Paulo)`
4. Aguarde a criação do projeto (~2 minutos)

### 1.2 Executar Migrations

1. No dashboard do Supabase, vá em **SQL Editor**
2. Execute as migrations na ordem:
   - `supabase/migrations/001_team_members.sql`
   - `supabase/migrations/002_leads.sql`
   - `supabase/migrations/003_sdr_metrics.sql`
   - `supabase/migrations/004_marketing_data.sql`

### 1.3 Copiar credenciais

1. Vá em **Settings → API**
2. Copie:
   - **Project URL** (ex: `https://xxx.supabase.co`)
   - **anon public key**
   - **service_role key** (⚠️ SECRETA)

### 1.4 Configurar backend

```bash
cd crm-kyon-backend
npm install
cp .env.example .env
```

Edite `.env`:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_KEY=sua-chave-service-role
```

### 1.5 Rodar backend

```bash
npm run dev
```

Backend rodando em `http://localhost:4000`

## 2. Setup do Frontend

```bash
cd "crm interno da kyon"
cp .env.example .env
```

Edite `.env`:
```
VITE_API_BASE_URL=http://localhost:4000
```

```bash
npm run dev
```

Frontend rodando em `http://localhost:3000`

## 3. Testar Integração

```bash
# Health check do backend
curl http://localhost:4000/health

# Listar membros da equipe
curl http://localhost:4000/api/team
```

## 4. Deploy (Produção)

### Backend (Vercel/Render)
1. Push do código para GitHub
2. Conecte no Vercel/Render
3. Configure variáveis de ambiente
4. Deploy automático

### Frontend (Vercel/Netlify)
1. Configure `VITE_API_BASE_URL` com URL do backend em produção
2. Deploy

Pronto! 🚀
