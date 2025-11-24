# Migrations do CRM Kyon

Migrations organizadas por funcionalidade/menu do sistema.

## Ordem de Execução

Execute as migrations na ordem numérica no SQL Editor do Supabase:

1. **001_team_members.sql** - Gestão de Equipe
   - Tabela `team_members`
   - Gerencia Admins, Closers e SDRs
   - Inclui metas individuais

2. **002_leads.sql** - Gestão de Closers
   - Tabela `leads`
   - Pipeline de vendas completo
   - Tracking de calls, reuniões e conversões

3. **003_sdr_metrics.sql** - Gestão de SDRs
   - Tabela `sdr_daily_metrics`
   - Métricas diárias de produtividade
   - Contatos, calls, agendamentos e no-shows

4. **004_marketing_data.sql** - Criativos & Ads
   - Tabela `marketing_data`
   - Dados de campanhas do Facebook/Meta
   - Métricas de performance (spend, impressions, clicks, etc.)

## Como Executar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo de cada migration na ordem
5. Clique em **Run** para executar

### Opção 2: Via CLI do Supabase

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link com seu projeto
supabase link --project-ref seu-project-ref

# Executar migrations
supabase db push
```

## Estrutura das Tabelas

### team_members
- Membros da equipe (Admin, Closer, SDR)
- Controle de status ativo/inativo
- Metas individuais de receita

### leads
- Leads e oportunidades de venda
- Histórico de calls e reuniões
- Pipeline completo (R1, R2, R3, Fechado, etc.)
- Tracking de UTM para atribuição de marketing

### sdr_daily_metrics
- Métricas diárias por SDR
- Leads contatados, calls feitas
- Reuniões agendadas e no-shows

### marketing_data
- Dados de campanhas publicitárias
- Métricas de performance (CPM, CTR, etc.)
- Integração com Facebook Ads via API

## Seed Data

Cada migration inclui dados de exemplo (seed data) para facilitar o desenvolvimento e testes. Em produção, você pode remover as seções `INSERT INTO` se preferir começar com tabelas vazias.

## Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com políticas permissivas (`USING (true)`). 

**⚠️ IMPORTANTE**: Em produção, ajuste as políticas de RLS conforme suas necessidades de segurança:

```sql
-- Exemplo: Permitir apenas leitura para role 'SDR'
CREATE POLICY "SDRs can only read their own data" ON sdr_daily_metrics
FOR SELECT USING (auth.jwt() ->> 'role' = 'SDR' AND sdr_name = auth.jwt() ->> 'name');
```

## Indexes

Todas as migrations incluem indexes otimizados para:
- Filtros por data
- Buscas por nome/owner
- Queries de relatórios e dashboards

## Triggers

Todas as tabelas têm trigger `update_updated_at_column` que atualiza automaticamente o campo `updated_at` em cada UPDATE.
