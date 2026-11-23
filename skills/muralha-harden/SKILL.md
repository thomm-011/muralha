---
name: muralha-harden
description: Aplica a correção de um achado planejado por vez, com teste e mudança mínima. Use depois do plan; repita até fechar todos os achados.
---

# Muralha Harden

Corrija **um** achado por execução. Isso mantém cada mudança pequena, revisável e fácil de desfazer.

## Passos

1. **Escolha o próximo achado** `planned` de maior severidade (respeitando as dependências do plano). Leia o `fix` e o local indicado.
2. **Entenda a causa raiz** no código antes de mexer. Corrija a causa, não só o sintoma: se o mesmo padrão aparece em outros pontos, trate todos os que pertencem ao mesmo achado e liste-os.
3. **Escreva primeiro um teste** que falharia sem a correção, quando for viável (entrada maliciosa rejeitada, acesso a recurso alheio negado). Rode-o e veja falhar.
4. **Aplique a correção mínima.** Sem refatorações paralelas, sem renomear coisas, sem "aproveitar para melhorar".
5. **Rode as verificações do projeto**: testes, lint e checagem de tipos, o que existir. O teste novo deve passar e nada que passava pode quebrar. Se algo quebrar, resolva ou reverta a mudança.
6. **Atualize `.muralha/findings.json`**: `status: "fixed"` e preencha `fix` com o que foi feito de fato (arquivos tocados). **Nunca** marque `verified` aqui; quem confirma é `/muralha-verify`.
7. **Pare e relate**: o que mudou, quais testes foram adicionados, o que a pessoa precisa fazer à mão (por exemplo, rotacionar um segredo, aplicar uma migração, reiniciar um serviço) e o próximo passo, `/muralha-verify`.

## Regras

- Se a correção exigir uma decisão ou uma mudança maior que a planejada, **pare**, mantenha o achado `planned` e explique o impasse.
- Segredo vazado: remover do código não resolve. Lembre a rotação e, se o segredo foi commitado, que ele continua no histórico do git.
- Não faça commit sem a pessoa pedir. Se pedir, uma correção por commit, com o ID do achado na mensagem.
- Nunca enfraqueça uma proteção existente para fazer um teste passar.
