// Script para testar conexão com Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');
  console.log(`📍 URL: ${process.env.SUPABASE_URL}\n`);

  try {
    // Testar conexão listando tabelas
    const tables = ['team_members', 'leads', 'sdr_daily_metrics', 'marketing_data'];
    
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Tabela '${table}': ${error.message}`);
      } else {
        console.log(`✅ Tabela '${table}': ${count || 0} registros`);
      }
    }
    
    console.log('\n✨ Teste concluído!');
    console.log('\n📋 Se todas as tabelas aparecerem com ✅, está tudo OK!');
    console.log('Se alguma tabela deu ❌, execute as migrations no SQL Editor do Supabase.\n');
    
  } catch (error) {
    console.error('\n❌ Erro na conexão:', error.message);
    console.log('\n⚠️  Verifique:');
    console.log('1. Se o arquivo .env está configurado corretamente');
    console.log('2. Se as credenciais do Supabase estão corretas');
    console.log('3. Se as migrations foram executadas\n');
  }
}

testConnection();
