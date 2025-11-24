#!/bin/bash

# Script para executar migrations no Supabase
# Uso: ./run-migrations.sh

echo "🚀 Executando Migrations no Supabase..."
echo ""

# Carregar variáveis de ambiente
source .env

# URL base do Supabase
SUPABASE_URL="${SUPABASE_URL}"
SERVICE_KEY="${SUPABASE_SERVICE_KEY}"

echo "📍 Supabase URL: ${SUPABASE_URL}"
echo ""

# Função para executar SQL
execute_sql() {
    local file=$1
    local name=$2
    
    echo "📝 Executando: ${name}"
    
    # Ler o arquivo SQL
    sql_content=$(cat "$file")
    
    # Executar via REST API do Supabase
    response=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
        -H "apikey: ${SERVICE_KEY}" \
        -H "Authorization: Bearer ${SERVICE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"query\": $(echo "$sql_content" | jq -Rs .)}")
    
    if [ $? -eq 0 ]; then
        echo "✅ ${name} - OK"
    else
        echo "⚠️  ${name} - Execute manualmente no SQL Editor"
    fi
    echo ""
}

# Executar migrations na ordem
execute_sql "supabase/migrations/001_team_members.sql" "001 - Team Members"
execute_sql "supabase/migrations/002_leads.sql" "002 - Leads"
execute_sql "supabase/migrations/003_sdr_metrics.sql" "003 - SDR Metrics"
execute_sql "supabase/migrations/004_marketing_data.sql" "004 - Marketing Data"

echo "✨ Processo concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Verifique as tabelas no Supabase Dashboard"
echo "2. Execute: npm run dev (para iniciar o backend)"
echo ""
