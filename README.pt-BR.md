# Clipboard History

Extensão Chrome que salva automaticamente o que você copia no navegador e exibe o histórico no popup.

## Funcionalidades

- Captura **texto** e **imagens** ao copiar em qualquer site
- Histórico persistente com `chrome.storage.local`
- Popup para visualizar, recopiar, excluir itens ou limpar tudo
- Deduplicação de entradas repetidas
- Limite de 100 itens no histórico

## Instalação (desenvolvimento)

```bash
npm install
npm run build
```

1. Abra `chrome://extensions`
2. Ative o **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `dist`

## Uso

1. Copie texto ou imagem em qualquer página
2. Clique no ícone da extensão
3. Selecione um item para recopiar para a área de transferência

## Scripts

| Comando                | Descrição                      |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Desenvolvimento com hot reload |
| `npm run build`        | Gera a extensão em `dist/`     |
| `npm test`             | Testes em watch (Vitest)       |
| `npm run test:run`     | Testes uma vez                 |
| `npm run lint`         | ESLint                         |
| `npm run format`       | Prettier (escreve)             |
| `npm run format:check` | Verifica formatação            |
| `npm run typecheck`    | TypeScript                     |

## Arquitetura

```
src/
├── content/      # Escuta eventos de copy nas páginas
├── background/   # Persiste histórico no storage
├── popup/        # UI do histórico (Tailwind CSS)
└── shared/       # Lógica testável (history, parser, storage)
```

## Arquivos locais (`file://`)

Para copiar de HTML aberto no disco (ex.: `file:///Users/.../pagina.html`), o Chrome exige uma permissão manual:

1. Abra `chrome://extensions`
2. Encontre **Clipboard History**
3. Ative **Permitir acesso a URLs de arquivos**
4. Recarregue a página HTML

O popup mostra um aviso amarelo quando você está em um arquivo local sem essa permissão.

## Limitações

- Não funciona em páginas restritas (`chrome://`, Chrome Web Store, etc.)
- Não captura cópias feitas fora do navegador
- Imagens maiores que 500 KB são ignoradas
- Alguns sites não expõem imagem no evento `copy`

## Qualidade

- Testes com Vitest (TDD)
- ESLint + Prettier
- Pre-commit com Husky e lint-staged
- CI no GitHub Actions

## Licença

MIT
