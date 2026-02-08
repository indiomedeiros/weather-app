// ============================================
// SCRIPT DE DEBUGGING
// ============================================

console.log("Iniciando debug...\n");

// 1. Carregar api.test.js
console.log("1. Carregando api.test.js...");
try {
  // Mock global.fetch para evitar erros
  global.fetch = async () => ({
    ok: true,
    json: async () => ({}),
  });

  // Precisamos simular um navegador
  global.global = global;

  require("./api.js");
  console.log("   ✅ api.js carregado com sucesso");

  require("./api.test.js");
  console.log("   ✅ api.test.js carregado com sucesso");

  // 2. Verificar se tester existe
  console.log("\n2. Verificando objeto 'tester'...");
  if (typeof tester !== "undefined") {
    console.log("   ✅ tester está definido");
    console.log(`   - Número de testes: ${tester.tests.length}`);

    if (tester.tests.length > 0) {
      console.log(`\n3. Primeiros 5 testes:`);
      for (let i = 0; i < Math.min(5, tester.tests.length); i++) {
        console.log(`   ${i + 1}. ${tester.tests[i].description}`);
      }
    }
  } else {
    console.log("   ❌ 'tester' não está definido!");
  }

  console.log("\n✅ Debug completo!");
} catch (error) {
  console.error(`❌ Erro: ${error.message}`);
  console.error(error.stack);
}
