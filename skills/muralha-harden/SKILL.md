---
name: muralha-harden
description: Aplica as correções planejadas, um achado por vez.
---

# Muralha Harden

1. Pegue o próximo achado `planned` de maior severidade.
2. Aplique a correção mínima que resolve a causa raiz, sem refatorações paralelas.
3. Rode os testes existentes; adicione um teste que falharia sem a correção, quando possível.
4. Mude o `status` para `fixed` em `.muralha/findings.json`.
5. Pare e relate. Um achado por execução.
