// ============================================
// RUNNER DE TESTES SIMPLES
// ============================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

console.log("Carregando e executando testes...\n");

try {
  // Ler os códigos
  const apiCode = fs.readFileSync(path.join(__dirname, "js", "api.js"), "utf-8");
  const testCode = fs.readFileSync(path.join(__dirname, "js", "api.test.js"), "utf-8");

  // Criar um contexto global
  const globalContext = {
    console: console,
    fetch: async (url) => ({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => "{}",
    }),
  };

  // Fazer window, global, e globalThis apontarem para o próprio contexto
  globalContext.window = globalContext;
  globalContext.global = globalContext;
  globalContext.globalThis = globalContext;

  // Executar api.js no contexto
  vm.runInNewContext(apiCode, globalContext, { filename: "api.js" });

  // Executar api.test.js no contexto
  vm.runInNewContext(testCode, globalContext, { filename: "api.test.js" });

  console.log("✅ Arquivos carregados");

  // Debug: mostrar o que existe em globalContext
  console.log("\nDebug - Verificando globalContext:");
  console.log(`- getCoordinates: ${typeof globalContext.getCoordinates}`);
  console.log(`- getWeatherData: ${typeof globalContext.getWeatherData}`);
  console.log(`- tester: ${typeof globalContext.tester}`);
  console.log(`- TestRunner: ${typeof globalContext.TestRunner}`);
  
  // listar todas as chaves
  console.log(`\nChaves em globalContext:`, Object.keys(globalContext).sort().slice(0, 20));

  // Acessar tester do contexto
  const tester = globalContext.tester;

  if (!tester) {
    console.error("❌ Erro: tester não foi criado");
    process.exit(1);
  }

  console.log(`Número de testes: ${tester.tests.length}\n`);

  console.log("=".repeat(60));
  console.log("RODANDO TESTES");
  console.log("=".repeat(60) + "\n");

  tester.run().then((result) => {
    console.log("\nTestes completados!");
    process.exit(result.failed > 0 ? 1 : 0);
  });
} catch (error) {
  console.error("❌ Erro:", error.message);
  console.error(error.stack);
  process.exit(1);
}
