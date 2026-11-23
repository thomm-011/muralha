---
name: muralha
description: Constrói o que o usuário pede aplicando endurecimento de segurança enquanto escreve o código.
---

# Muralha (build)

Antes de escrever código, leia `.muralha/charter.md`. Se não existir, sugira `/muralha-charter`.

Ao implementar:
- Valide e normalize toda entrada externa; prefira allowlists.
- Use consultas parametrizadas, escape de saída e APIs seguras por padrão.
- Nunca coloque segredos em código ou logs; leia de variáveis de ambiente.
- Aplique menor privilégio em permissões, tokens e CORS.
- Falhe de forma fechada e sem vazar detalhes internos.

Ao final, liste em poucas linhas quais proteções foram aplicadas e o que ficou pendente.
