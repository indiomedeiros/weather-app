// Script para rodar os testes de cache
console.log("📦 Carregando arquivos...\n");

// Carregar API (que tem as funções de cache)
require('./js/api.js');

// Carregar teste (que usa as funções de cache)
require('./js/api.test.js');

// Rodar testes
console.log("\n🚀 Rodando testes...\n");
tester.run().then(result => {
  console.log("\n📊 Resultado final:", result);
  process.exit(result.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error("❌ Erro ao rodar testes:", err);
  process.exit(1);
});
