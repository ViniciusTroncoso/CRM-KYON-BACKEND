const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const migrations = [
    '001_team_members.sql',
    '002_leads.sql',
    '003_sdr_metrics.sql',
    '004_marketing_data.sql'
  ];

  console.log('🚀 Iniciando migrations...\n');

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📝 Executando: ${migration}`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        // Tentar executar diretamente via REST API
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (!response.ok) {
          console.log(`⚠️  Aviso: ${migration} - Use o SQL Editor do Supabase Dashboard`);
        } else {
          console.log(`✅ ${migration} - OK`);
        }
      } else {
        console.log(`✅ ${migration} - OK`);
      }
    } catch (err) {
      console.log(`⚠️  ${migration} - Execute manualmente no SQL Editor`);
    }
  }

  console.log('\n✨ Migrations preparadas!');
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('1. Acesse: https://nqxpmvihmxnndfxxnuqg.supabase.co');
  console.log('2. Vá em SQL Editor');
  console.log('3. Execute cada migration na ordem (001 → 004)');
  console.log('4. Copie o conteúdo de cada arquivo .sql e execute');
  console.log('\nOu execute este comando para ver as migrations:');
  console.log('cat supabase/migrations/*.sql\n');
}

runMigrations().catch(console.error);
