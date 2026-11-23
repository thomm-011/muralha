---
name: bastion-plan
description: Cria o plano de defesa: ordem de correção e abordagem para cada achado aberto.
---

# Bastion Plan

1. Leia `.bastion/findings.json` e o charter.
2. Ordene os achados `open` por severidade e esforço.
3. Para cada um, preencha `fix` com a abordagem concreta e mude `status` para `planned`.
4. Aponte achados que dependem uns dos outros e quaisquer decisões que cabem ao usuário.
