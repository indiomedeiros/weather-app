# 🌤️ App de Clima

Um aplicativo web simples e intuitivo para consultar informações meteorológicas de qualquer cidade do mundo usando a API Open-Meteo.

## 📋 Características

- ✅ Busca de cidades com sugestões automáticas
- ✅ Exibição de temperatura atual, sensação térmica e condições
- ✅ Informações detalhadas (umidade, vento, pressão, UV)
- ✅ Interface responsiva e moderna
- ✅ Sem necessidade de chave de API (Open-Meteo é gratuito)
- ✅ Traduzido para português brasileiro

## 🗂️ Estrutura do Projeto

```
weather-app/
├── index.html           # Arquivo HTML principal
├── css/
│   └── styles.css       # Estilos CSS
├── js/
│   ├── main.js          # Lógica principal
│   ├── api.js           # Chamadas para APIs
│   └── utils.js         # Funções utilitárias
├── assets/              # Imagens e ícones (se necessário)
└── README.md            # Este arquivo
```

## 🚀 Como Usar

1. **Clone ou baixe o projeto:**
   ```bash
   git clone <seu-repositorio>
   cd weather-app
   ```

2. **Abra o arquivo `index.html` no navegador:**
   - Clique duas vezes em `index.html`, ou
   - Clique com botão direito → "Abrir com" → Seu navegador favorito

3. **Busque uma cidade:**
   - Digite o nome da cidade no campo de busca
   - Clique em "Buscar" ou pressione Enter
   - Os dados meteorológicos serão exibidos

## 📦 Dependências

Nenhuma! Este projeto usa apenas HTML, CSS e JavaScript puro, sem dependências externas.

## 🌐 APIs Utilizadas

- **Open-Meteo Geocoding API**: Para converter nomes de cidades em coordenadas
- **Open-Meteo Weather API**: Para obter dados meteorológicos

Documentação: https://open-meteo.com/

## 🎨 Recursos de Estilo

- Cores modernas e gradientes
- Design responsivo (mobile-first)
- Animações suaves
- Ícones emoji para melhor visualização

## 💡 Possíveis Melhorias

- [ ] Salvar histórico de buscas no localStorage
- [ ] Modo escuro/claro
- [ ] Previsão do tempo para 7 dias
- [ ] Localização automática baseada em GPS
- [ ] Conversão entre Celsius/Fahrenheit
- [ ] Compartilhar clima nas redes sociais
- [ ] Notificações de alertas meteorológicos

## 🐛 Troubleshooting

**Problema:** "Cidade não encontrada"
- **Solução:** Verifique a ortografia do nome da cidade. Tente usar o nome en inglês se o português não funcionar.

**Problema:** Dados não carregam
- **Solução:** Verifique sua conexão com a internet. A API Open-Meteo pode estar temporariamente indisponível.

**Problema:** Página fica em branco
- **Solução:** Abra o console do navegador (F12) e verifique se há erros de JavaScript.

## 📝 Licença

Este projeto está disponível para uso livre e educacional.

## ✨ Autor

Developed with ❤️ by [Seu Nome]

---

**Aproveite e divirta-se explorando o clima do mundo!** 🌍
