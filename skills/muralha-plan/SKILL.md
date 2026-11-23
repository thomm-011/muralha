---
name: muralha-plan
description: Cria o plano de defesa: ordem de correção e abordagem concreta para cada achado aberto. Use depois do detect e antes de corrigir.
---

# Muralha Plan

Transforme os achados em um plano que dê para executar uma correção por vez, sem surpresas.

Esta etapa não altera código, só `.muralha/findings.json`.

O arquivo `.muralha/findings.json` é um objeto `{ "findings": [ ... ] }`. Ao editá-lo, mantenha essa estrutura e altere só os campos do achado em questão.

## Passos

1. **Leia `.muralha/findings.json` e o charter.** Considere só os achados `open`. Se não houver, diga isso e pare.
2. **Ordene** por severidade primeiro e, dentro dela, por **menor esforço e maior efeito**. Uma correção que fecha vários achados vem antes. Se um achado depende de outro (por exemplo, trocar o mecanismo de sessão antes de ajustar os cookies), coloque a dependência primeiro e diga isso.
3. **Para cada achado**, preencha `fix` com a abordagem concreta, em uma a três frases:
   - o que muda e onde (arquivos ou módulos);
   - como será testado (qual teste falharia sem a correção);
   - risco de regressão, se houver (comportamento que pode mudar para usuários).
   Depois mude o `status` para `planned`.
4. **Separe o que o código não resolve.** Alguns achados exigem ação humana além do código. O caso clássico: **segredo vazado** precisa ser **rotacionado** no provedor, e remover do código não basta. Registre isso no `fix` como passo manual explícito.
5. **Levante decisões da pessoa.** Quando existir mais de um caminho razoável com custo diferente (por exemplo, quebrar compatibilidade de uma API), pergunte antes de marcar `planned`. Deixe o achado `open` até a resposta.
6. **Termine** com a ordem de execução numerada, os passos manuais e as decisões pendentes. Sugira `/muralha-harden`.

## Evite

- Planos vagos como "melhorar a validação". Diga qual campo, qual regra, qual arquivo.
- Mudar a severidade ou descartar achados sem explicar. Se um achado não procede, marque `rejected` e escreva o motivo em `verdict`.
- Propor refatorações amplas. O plano cobre a menor mudança que remove a causa raiz.
