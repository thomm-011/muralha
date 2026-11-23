---
name: muralha-detect
description: Mapeia o sistema e registra riscos como achados em .muralha/findings.json.
---

# Muralha Detect

1. Leia `.muralha/charter.md`.
2. Mapeie pontos de entrada, fronteiras de confiança, autenticação/autorização, manuseio de segredos, dependências e configuração de deploy.
3. Para cada risco real, com evidência no código, registre um achado em `.muralha/findings.json` seguindo `schemas/findings.schema.json`:
   `id` (F-001...), `title`, `severity`, `status: "open"`, `location` (arquivo:linha), `description`.
4. Não registre suposições sem evidência. Não corrija nada ainda.
