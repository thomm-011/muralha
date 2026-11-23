# Muralha

Copiloto de segurança para quem desenvolve com agentes de IA. Skills em Markdown + dashboard local, sem chave de API.

## Fluxo

1. `/muralha-charter`: define as regras de segurança do projeto
2. `/muralha-detect`: mapeia o sistema e registra os riscos
3. `/muralha-plan`: plano de correção
4. `/muralha-harden`: aplica uma correção por vez
5. `/muralha-verify`: confirma que funcionou

`/muralha` constrói funcionalidades já com endurecimento aplicado.

## Uso

```bash
npx muralha install   # copia as skills para .claude/skills
npx muralha           # dashboard em http://127.0.0.1:4317
```

O estado fica em `.muralha/` (`charter.md`, `findings.json`).

## Desenvolvimento

```bash
npm install && npm test
```

## Instalação como plugin

```bash
# Claude Code
claude plugin marketplace add thomm-011/muralha
claude plugin install muralha@muralha
```

Manifests para Codex e Cursor ficam em `.codex-plugin/` e `.cursor-plugin/`.
