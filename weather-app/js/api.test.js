// ============================================
// ARQUIVO: api.test.js
// FUNÇÃO: Testes para as funções da API
// ============================================

// ============================================
// FRAMEWORK DE TESTES SIMPLES
// ============================================
// Um framework básico para rodar testes no navegador

class TestRunner {
  constructor() {
    this.tests = []; // Lista de testes
    this.results = []; // Resultados dos testes
  }

  // Agrupar testes por categoria
  describe(группа, callback) {
    console.group(`📋 ${группа}`);
    callback();
    console.groupEnd();
  }

  // Definir um teste individual
  it(description, testFn) {
    this.tests.push({ description, testFn });
  }

  // Fazer assert que algo seja verdadeiro
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // Fazer assert que dois valores sejam iguais
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        `Expected ${expected}, but got ${actual}. ${message || ""}`,
      );
    }
  }

  // Fazer assert que um objeto tenha certas propriedades
  assertObjectHasProperties(obj, props, message) {
    for (const prop of props) {
      if (!(prop in obj)) {
        throw new Error(`Object missing property "${prop}". ${message || ""}`);
      }
    }
  }

  // Fazer assert que a função lance um erro
  async assertThrows(fn, message) {
    let threw = false;
    try {
      await fn();
    } catch (error) {
      threw = true;
    }
    if (!threw) {
      throw new Error(`Expected function to throw error. ${message || ""}`);
    }
  }

  // Executar todos os testes
  async run() {
    console.clear();
    console.log("🧪 INICIANDO TESTES DA API\n");
    console.log(`Total de testes: ${this.tests.length}\n`);

    let passed = 0;
    let failed = 0;

    for (const test of this.tests) {
      try {
        await test.testFn(this);
        console.log(`✅ ${test.description}`);
        passed++;
      } catch (error) {
        console.error(`❌ ${test.description}`);
        console.error(`   Erro: ${error.message}`);
        console.error(`   Stack: ${error.stack}\n`);
        failed++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMO DOS TESTES");
    console.log("=".repeat(60));
    console.log(`✅ Passaram: ${passed}`);
    console.log(`❌ Falharam: ${failed}`);
    console.log(`📈 Total:    ${passed + failed}`);
    console.log("=".repeat(60));

    if (failed === 0) {
      console.log("\n🎉 Todos os testes passaram!!!\n");
    } else {
      console.log(`\n⚠️  ${failed} teste(s) falharam\n`);
    }

    return { passed, failed, total: passed + failed };
  }
}

// Criar instância global do test runner
const TestRunnerInstance = new TestRunner();

// Registrar globalmente de modo que funcione em navegadores e Node.js
if (typeof window !== "undefined") {
  window.tester = TestRunnerInstance;
}
if (typeof global !== "undefined") {
  global.tester = TestRunnerInstance;
}
if (typeof globalThis !== "undefined") {
  globalThis.tester = TestRunnerInstance;
}

const tester = TestRunnerInstance;

// ============================================
// VERIFICAÇÃO DE CARREGAMENTO
// ============================================
console.log("✅ api.test.js carregado");
console.log(`Verificando funções disponíveis:`);
console.log(`- getCoordinates: ${typeof getCoordinates}`);
console.log(`- getWeatherData: ${typeof getWeatherData}`);
console.log(`- tester.run: ${typeof tester.run}`);

// ============================================
// MOCKS PARA FETCH
// ============================================
// Para testar sem fazer requisições reais

// Respostas simuladas para diferentes cenários
const mockResponses = {
  // São Paulo válido
  saoPauloCoordinates: {
    results: [
      {
        id: 1234,
        name: "São Paulo",
        latitude: -23.5505,
        longitude: -46.6333,
        elevation: 760,
        feature_code: "PPL",
        country_code: "BR",
        country: "Brasil",
        admin1: "São Paulo",
        timezone: "America/Sao_Paulo",
        population: 12000000,
      },
    ],
    generationtime_ms: 1.5,
  },

  // Rio de Janeiro válido
  rioCoordinates: {
    results: [
      {
        id: 3451190,
        name: "Rio de Janeiro",
        latitude: -22.9068,
        longitude: -43.1729,
        elevation: 62,
        feature_code: "PPL",
        country_code: "BR",
        country: "Brasil",
        admin1: "Rio de Janeiro",
        timezone: "America/Sao_Paulo",
        population: 6700000,
      },
    ],
    generationtime_ms: 1.5,
  },

  // Londres válida
  londonCoordinates: {
    results: [
      {
        id: 2643743,
        name: "London",
        latitude: 51.5085,
        longitude: -0.1257,
        elevation: 8,
        feature_code: "PPL",
        country_code: "GB",
        country: "United Kingdom",
        admin1: "England",
        timezone: "Europe/London",
        population: 8000000,
      },
    ],
    generationtime_ms: 1.5,
  },

  // Tokio válida
  tokyoCoordinates: {
    results: [
      {
        id: 1850144,
        name: "Tokyo",
        latitude: 35.6895,
        longitude: 139.6917,
        elevation: 40,
        feature_code: "PPL",
        country_code: "JP",
        country: "Japan",
        admin1: "Tokyo",
        timezone: "Asia/Tokyo",
        population: 13000000,
      },
    ],
    generationtime_ms: 1.5,
  },

  // Cidade inexistente
  notFound: {
    results: [],
    generationtime_ms: 1.5,
  },

  // Dados de clima para São Paulo
  saulopWeather: {
    latitude: -23.5505,
    longitude: -46.6333,
    generationtime_ms: 11.2,
    utc_offset_seconds: -10800,
    timezone: "America/Sao_Paulo",
    timezone_abbreviation: "BRST",
    elevation: 760,
    current: {
      time: "2024-02-08T15:00",
      interval: 900,
      temperature_2m: 28.5,
      relative_humidity_2m: 65,
      apparent_temperature: 31.2,
      weather_code: 1,
      weather_description: "Céu limpo",
      wind_speed_10m: 10.5,
    },
  },

  // Dados de clima para Equador
  equatorWeather: {
    latitude: 0,
    longitude: 0,
    generationtime_ms: 11.2,
    utc_offset_seconds: 0,
    timezone: "UTC",
    timezone_abbreviation: "UTC",
    elevation: -2,
    current: {
      time: "2024-02-08T15:00",
      interval: 900,
      temperature_2m: 25.0,
      relative_humidity_2m: 80,
      apparent_temperature: 26.5,
      weather_code: 80,
      weather_description: "Light rain",
      wind_speed_10m: 5.2,
    },
  },

  // Dados de clima para Sydney (hemisfério sul/leste)
  sydneyWeather: {
    latitude: -33.8688,
    longitude: 151.2093,
    generationtime_ms: 11.2,
    utc_offset_seconds: 39600,
    timezone: "Australia/Sydney",
    timezone_abbreviation: "AEDT",
    elevation: 2,
    current: {
      time: "2024-02-08T15:00",
      interval: 900,
      temperature_2m: 35.5,
      relative_humidity_2m: 45,
      apparent_temperature: 38.2,
      weather_code: 0,
      weather_description: "Clear sky",
      wind_speed_10m: 15.3,
    },
  },
};

// Função para simular fetch com respostas pré-definidas
function createMockFetch(mockData, shouldFail = false) {
  return function mockFetch(url) {
    return new Promise((resolve, reject) => {
      // Simular delay de rede
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Network error"));
          return;
        }

        // Determinar qual resposta retornar baseado na URL
        let responseData = mockData;

        // Se mockData é uma função, executá-la com a URL
        if (typeof mockData === "function") {
          responseData = mockData(url);
        }

        // Simular resposta HTTP
        const response = {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => responseData,
          text: async () => JSON.stringify(responseData),
        };

        resolve(response);
      }, 10); // 10ms de delay simulado
    });
  };
}


// Helper para atribuir fetch globalmente com função customizada
function setGlobalFetch(fetchFn) {
  if (typeof window !== "undefined") {
    window.fetch = fetchFn;
  }
  if (typeof global !== "undefined") {
    global.fetch = fetchFn;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.fetch = fetchFn;
  }
}

// Helper para atribuir fetch globalmente (funciona no navegador e Node.js)
function setMockFetch(mockData, shouldFail = false) {
  const mockFetch = createMockFetch(mockData, shouldFail);
  setGlobalFetch(mockFetch);
}

// ============================================
// TESTES PARA getCoordinates
// ============================================

tester.describe("getCoordinates - Testes de Sucesso", () => {
  tester.it("deve retornar coordenadas para 'São Paulo'", async (assert) => {
    // Arrange
    const cityName = "São Paulo";
    setMockFetch(mockResponses.saoPauloCoordinates);

    // Act
    const result = await getCoordinates(cityName);

    // Assert
    assert.assert(result !== null, "Resultado não deve ser null");
    assert.assertEqual(result.latitude, -23.5505, "Latitude incorreta");
    assert.assertEqual(result.longitude, -46.6333, "Longitude incorreta");
    assert.assertEqual(result.name, "São Paulo", "Nome da cidade incorreto");
    assert.assertEqual(result.country, "Brasil", "País incorreto");
  });

  tester.it(
    "deve retornar coordenadas para 'Rio de Janeiro'",
    async (assert) => {
      // Arrange
      const cityName = "Rio de Janeiro";
      setMockFetch(mockResponses.rioCoordinates);

      // Act
      const result = await getCoordinates(cityName);

      // Assert
      assert.assert(result !== null, "Resultado não deve ser null");
      assert.assertEqual(result.latitude, -22.9068, "Latitude incorreta");
      assert.assertEqual(result.longitude, -43.1729, "Longitude incorreta");
    },
  );

  tester.it("deve retornar coordenadas para 'London'", async (assert) => {
    // Arrange
    const cityName = "London";
    setMockFetch(mockResponses.londonCoordinates);

    // Act
    const result = await getCoordinates(cityName);

    // Assert
    assert.assert(result !== null, "Resultado não deve ser null");
    assert.assertEqual(result.latitude, 51.5085, "Latitude incorreta");
    assert.assertEqual(result.country, "United Kingdom", "País incorreto");
  });

  tester.it("deve retornar coordenadas para 'Tokyo'", async (assert) => {
    // Arrange
    const cityName = "Tokyo";
    setMockFetch(mockResponses.tokyoCoordinates);

    // Act
    const result = await getCoordinates(cityName);

    // Assert
    assert.assert(result !== null, "Resultado não deve ser null");
    assert.assertEqual(result.latitude, 35.6895, "Latitude incorreta");
    assert.assertEqual(result.country, "Japan", "País incorreto");
  });

  tester.it("deve ter todas as propriedades obrigatórias", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saoPauloCoordinates);

    // Act
    const result = await getCoordinates("São Paulo");

    // Assert
    assert.assertObjectHasProperties(
      result,
      ["latitude", "longitude", "name", "country"],
      "Objeto faltando propriedades",
    );
  });

  tester.it("latitude e longitude devem ser números", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saoPauloCoordinates);

    // Act
    const result = await getCoordinates("São Paulo");

    // Assert
    assert.assert(
      typeof result.latitude === "number",
      "Latitude deve ser número",
    );
    assert.assert(
      typeof result.longitude === "number",
      "Longitude deve ser número",
    );
  });
});

tester.describe("getCoordinates - Testes de Erro", () => {
  tester.it("deve retornar null para cidade inexistente", async (assert) => {
    // Arrange
    const cityName = "XyzAbcInvalidCity123999";
    setMockFetch(mockResponses.notFound);

    // Act
    const result = await getCoordinates(cityName);

    // Assert
    assert.assertEqual(
      result,
      null,
      "Deve retornar null para cidade inexistente",
    );
  });

  tester.it("deve retornar null para string vazia", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.notFound);

    // Act
    const result = await getCoordinates("");

    // Assert
    assert.assertEqual(result, null, "Deve retornar null para string vazia");
  });

  tester.it("deve lançar erro em caso de falha de conexão", async (assert) => {
    // Arrange
    setMockFetch(null, true);

    // Act & Assert
    await assert.assertThrows(async () => {
      await getCoordinates("São Paulo");
    }, "Deve lançar erro quando fetch falha");
  });

  tester.it(
    "deve lançar erro quando API retorna status 400",
    async (assert) => {
      // Arrange
      setGlobalFetch(function mockFetch(url) {
        return Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          json: async () => ({ error: "Bad request" }),
          text: async () => "Bad request",
        });
      });

      // Act & Assert
      await assert.assertThrows(async () => {
        await getCoordinates("São Paulo");
      }, "Deve lançar erro em status 400");
    },
  );

  tester.it(
    "deve lançar erro quando API retorna status 500",
    async (assert) => {
      // Arrange
      setGlobalFetch(function mockFetch(url) {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: async () => ({ error: "Server error" }),
          text: async () => "Internal Server Error",
        });
      });

      // Act & Assert
      await assert.assertThrows(async () => {
        await getCoordinates("São Paulo");
      }, "Deve lançar erro em status 500");
    },
  );
});

tester.describe("getCoordinates - Edge Cases", () => {
  tester.it("deve encontrar cidades com acentos: São Paulo", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saoPauloCoordinates);

    // Act
    const result = await getCoordinates("São Paulo");

    // Assert
    assert.assert(result !== null, "Deve encontrar cidade com acentos");
    assert.assertEqual(result.name, "São Paulo", "Nome com acentos incorreto");
  });

  tester.it(
    "deve encontrar cidades com caracteres especiais: New York",
    async (assert) => {
      // Arrange
      const nyCoordinates = {
        results: [
          {
            id: 5128581,
            name: "New York",
            latitude: 40.7128,
            longitude: -74.006,
            country: "United States",
          },
        ],
      };
      setMockFetch(nyCoordinates);

      // Act
      const result = await getCoordinates("New York");

      // Assert
      assert.assert(result !== null, "Deve encontrar cidades com espaços");
    },
  );

  tester.it(
    "deve retornar primeira ocorrência para cidades com mesmo nome",
    async (assert) => {
      // Arrange
      const multipleResults = {
        results: [
          {
            id: 1,
            name: "Springfield",
            latitude: 39.771,
            longitude: -89.6505,
            country: "United States",
            admin1: "Illinois",
          },
          {
            id: 2,
            name: "Springfield",
            latitude: 37.521,
            longitude: -121.267,
            country: "United States",
            admin1: "California",
          },
        ],
      };
      setMockFetch(multipleResults);

      // Act
      const result = await getCoordinates("Springfield");

      // Assert
      assert.assert(result !== null, "Deve retornar resultado");
      assert.assertEqual(
        result.latitude,
        39.771,
        "Deve retornar primeira ocorrência",
      );
    },
  );

  tester.it("coordenadas devem estar em intervalos válidos", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saoPauloCoordinates);

    // Act
    const result = await getCoordinates("São Paulo");

    // Assert
    assert.assert(
      result.latitude >= -90 && result.latitude <= 90,
      "Latitude deve estar entre -90 e 90",
    );
    assert.assert(
      result.longitude >= -180 && result.longitude <= 180,
      "Longitude deve estar entre -180 e 180",
    );
  });
});

// ============================================
// TESTES PARA getWeatherData
// ============================================

tester.describe("getWeatherData - Testes de Sucesso", () => {
  tester.it(
    "deve retornar dados de clima para coordenadas válidas",
    async (assert) => {
      // Arrange
      const latitude = -23.5505;
      const longitude = -46.6333;
      setMockFetch(mockResponses.saulopWeather);

      // Act
      const result = await getWeatherData(latitude, longitude);

      // Assert
      assert.assert(result !== null, "Resultado não deve ser null");
      assert.assert(
        result.current !== undefined,
        "Deve ter propriedade 'current'",
      );
    },
  );

  tester.it("deve ter propriedade 'timezone'", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.timezone !== undefined,
      "Deve ter propriedade timezone",
    );
    assert.assertEqual(
      result.timezone,
      "America/Sao_Paulo",
      "Timezone incorreto",
    );
  });

  tester.it("deve ter propriedade 'elevation'", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.elevation !== undefined,
      "Deve ter propriedade elevation",
    );
  });

  tester.it("objeto 'current' deve ter temperatura", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.temperature_2m !== undefined,
      "Deve ter temperatura",
    );
  });

  tester.it("objeto 'current' deve ter umidade", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.relative_humidity_2m !== undefined,
      "Deve ter umidade",
    );
  });

  tester.it("objeto 'current' deve ter sensação térmica", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.apparent_temperature !== undefined,
      "Deve ter sensação térmica",
    );
  });

  tester.it("objeto 'current' deve ter código de clima", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.weather_code !== undefined,
      "Deve ter código de clima",
    );
  });

  tester.it("objeto 'current' deve ter velocidade do vento", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.wind_speed_10m !== undefined,
      "Deve ter velocidade do vento",
    );
  });
});

tester.describe("getWeatherData - Validação de Tipos", () => {
  tester.it("temperatura deve ser número", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      typeof result.current.temperature_2m === "number",
      "Temperatura deve ser número",
    );
  });

  tester.it("umidade deve ser número", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      typeof result.current.relative_humidity_2m === "number",
      "Umidade deve ser número",
    );
  });

  tester.it("umidade deve estar entre 0 e 100", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.relative_humidity_2m >= 0 &&
        result.current.relative_humidity_2m <= 100,
      "Umidade deve estar entre 0 e 100",
    );
  });

  tester.it("vento deve ser número", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      typeof result.current.wind_speed_10m === "number",
      "Velocidade do vento deve ser número",
    );
  });

  tester.it("vento deve ser não negativo", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.current.wind_speed_10m >= 0,
      "Velocidade do vento deve ser >= 0",
    );
  });

  tester.it("código de clima deve ser número", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      typeof result.current.weather_code === "number",
      "Código de clima deve ser número",
    );
  });
});

tester.describe("getWeatherData - Testes de Erro", () => {
  tester.it("deve lançar erro em falha de conexão", async (assert) => {
    // Arrange
    setMockFetch(null, true);

    // Act & Assert
    await assert.assertThrows(async () => {
      await getWeatherData(-23.5505, -46.6333);
    }, "Deve lançar erro em falha de conexão");
  });

  tester.it(
    "deve lançar erro quando API retorna status 400",
    async (assert) => {
      // Arrange
      setGlobalFetch(function mockFetch(url) {
        return Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          json: async () => ({ error: "Bad request" }),
          text: async () => "Bad request",
        });
      });

      // Act & Assert
      await assert.assertThrows(async () => {
        await getWeatherData(-23.5505, -46.6333);
      }, "Deve lançar erro em status 400");
    },
  );

  tester.it(
    "deve lançar erro quando API retorna status 500",
    async (assert) => {
      // Arrange
      setGlobalFetch(function mockFetch(url) {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: async () => ({ error: "Server error" }),
          text: async () => "Internal Server Error",
        });
      });

      // Act & Assert
      await assert.assertThrows(async () => {
        await getWeatherData(-23.5505, -46.6333);
      }, "Deve lançar erro em status 500");
    },
  );

  tester.it("deve lançar erro com JSON inválido", async (assert) => {
    // Arrange
    setGlobalFetch(function mockFetch(url) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
        text: async () => "Invalid JSON",
      });
    });

    // Act & Assert
    await assert.assertThrows(async () => {
      await getWeatherData(-23.5505, -46.6333);
    }, "Deve lançar erro com JSON inválido");
  });
});

tester.describe("getWeatherData - Edge Cases", () => {
  tester.it(
    "deve funcionar com coordenadas no Equador (0, 0)",
    async (assert) => {
      // Arrange
      setMockFetch(mockResponses.equatorWeather);

      // Act
      const result = await getWeatherData(0, 0);

      // Assert
      assert.assert(result !== null, "Deve retornar dados");
      assert.assertEqual(result.latitude, 0, "Latitude deve ser 0");
      assert.assertEqual(result.longitude, 0, "Longitude deve ser 0");
    },
  );

  tester.it(
    "deve funcionar com coordenadas negativas (hemisfério sul)",
    async (assert) => {
      // Arrange
      setMockFetch(mockResponses.sydneyWeather);

      // Act
      const result = await getWeatherData(-33.8688, 151.2093);

      // Assert
      assert.assert(result !== null, "Deve retornar dados");
      assert.assertEqual(result.latitude, -33.8688, "Latitude incorreta");
    },
  );

  tester.it(
    "deve funcionar com coordenadas negativas (hemisfério oeste)",
    async (assert) => {
      // Arrange
      const newyorkWeather = {
        ...mockResponses.saulopWeather,
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
      };
      setMockFetch(newyorkWeather);

      // Act
      const result = await getWeatherData(40.7128, -74.006);

      // Assert
      assert.assert(result !== null, "Deve retornar dados");
      assert.assertEqual(result.longitude, -74.006, "Longitude incorreta");
    },
  );

  tester.it("coordenadas do Pólo Norte devem ser tratadas", async (assert) => {
    // Arrange
    const poleWeather = {
      ...mockResponses.saulopWeather,
      latitude: 90,
      longitude: 0,
      timezone: "UTC",
    };
    setMockFetch(poleWeather);

    // Act
    const result = await getWeatherData(90, 0);

    // Assert
    assert.assert(result !== null, "Deve retornar dados ou erro gracefully");
  });

  tester.it("coordenadas do Pólo Sul devem ser tratadas", async (assert) => {
    // Arrange
    const poleWeather = {
      ...mockResponses.saulopWeather,
      latitude: -90,
      longitude: 0,
      timezone: "UTC",
    };
    setMockFetch(poleWeather);

    // Act
    const result = await getWeatherData(-90, 0);

    // Assert
    assert.assert(result !== null, "Deve retornar dados ou erro gracefully");
  });

  tester.it("timezone deve ser preenchido corretamente", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.saulopWeather);

    // Act
    const result = await getWeatherData(-23.5505, -46.6333);

    // Assert
    assert.assert(
      result.timezone && result.timezone.length > 0,
      "Timezone deve ser preenchido",
    );
  });
});

// ============================================
// TESTES DE INTEGRAÇÃO (Fluxo Completo)
// ============================================

tester.describe("Integração Completa", () => {
  tester.it("deve buscar coordenadas e depois clima", async (assert) => {
    // Arrange
    setGlobalFetch(function (url) {
      // Se for geocoding
      if (url.includes("geocoding-api")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockResponses.saoPauloCoordinates,
          text: async () => JSON.stringify(mockResponses.saoPauloCoordinates),
        });
      }
      // Se for weather
      else if (url.includes("api.open-meteo.com")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockResponses.saulopWeather,
          text: async () => JSON.stringify(mockResponses.saulopWeather),
        });
      }
    });

    // Act
    const coordinates = await getCoordinates("São Paulo");
    assert.assert(coordinates !== null, "Deve obter coordenadas");

    const weather = await getWeatherData(
      coordinates.latitude,
      coordinates.longitude,
    );
    assert.assert(weather !== null, "Deve obter dados de clima");

    // Assert
    assert.assertEqual(
      coordinates.latitude,
      weather.latitude,
      "Latitudes devem bater",
    );
    assert.assertEqual(
      coordinates.longitude,
      weather.longitude,
      "Longitudes devem bater",
    );
  });

  tester.it("deve parar em erro se cidade não encontrada", async (assert) => {
    // Arrange
    setMockFetch(mockResponses.notFound);

    // Act
    const coordinates = await getCoordinates("CidadeInvalida123");

    // Assert
    assert.assertEqual(
      coordinates,
      null,
      "Deve retornar null e parar no fluxo",
    );
  });

  tester.it(
    "deve retornar dados consistentes para mesma cidade",
    async (assert) => {
      // Arrange
      setMockFetch(mockResponses.saoPauloCoordinates);

      // Act
      const result1 = await getCoordinates("São Paulo");
      const result2 = await getCoordinates("São Paulo");

      // Assert
      assert.assertEqual(
        result1.latitude,
        result2.latitude,
        "Latitude deve ser idêntica",
      );
      assert.assertEqual(
        result1.longitude,
        result2.longitude,
        "Longitude deve ser idêntica",
      );
    },
  );
});

// ============================================
// EXECUTAR TESTES
// ============================================
// Chamar: await tester.run();
