# Bastion

Copiloto de segurança para quem desenvolve com agentes de IA. Skills em Markdown + dashboard local, sem chave de API.

## Fluxo

1. `/bastion-charter`: define as regras de segurança do projeto
2. `/bastion-detect`: mapeia o sistema e registra os riscos
3. `/bastion-plan`: plano de correção
4. `/bastion-harden`: aplica uma correção por vez
5. `/bastion-verify`: confirma que funcionou

`/bastion` constrói funcionalidades já com endurecimento aplicado.

## Uso

```bash
npx bastion install   # copia as skills para .claude/skills
npx bastion           # dashboard em http://127.0.0.1:4317
```

O estado fica em `.bastion/` (`charter.md`, `findings.json`).

## Desenvolvimento

```bash
npm install && npm test
```
