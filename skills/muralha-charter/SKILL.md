---
name: muralha-charter
description: Define as regras de segurança do projeto (charter). Execute antes de qualquer outra skill do Muralha.
---

# Muralha Charter

1. Leia o projeto (README, manifests, estrutura) e identifique: stack, dados sensíveis, superfícies expostas (HTTP, CLI, filas, uploads) e dependências críticas.
2. Pergunte ao usuário, em linguagem simples, apenas o que não der para inferir: quem usa o sistema, que dados são sensíveis, onde roda.
3. Escreva `.muralha/charter.md` com:
   - **Ativos**: o que precisa ser protegido.
   - **Ameaças prováveis**: quem ataca e como.
   - **Regras**: lista curta e verificável (ex.: "nenhum segredo no repositório", "toda entrada externa é validada").
   - **Fora de escopo**.
4. Não altere código nesta etapa.
