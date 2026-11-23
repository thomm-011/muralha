---
name: muralha
description: Constrói ou corrige funcionalidades aplicando endurecimento de segurança enquanto escreve o código. Use quando o pedido for implementar algo (endpoint, formulário, integração, upload, login) e a segurança precisar vir junto.
---

# Muralha (construir com segurança)

Implemente o que foi pedido e aplique as proteções certas **no mesmo passo**, sem pedir à pessoa que decida detalhes técnicos de segurança.

## Antes de escrever

1. Leia `.muralha/charter.md`. Se não existir, diga isso e sugira `/muralha-charter`, mas não bloqueie o trabalho: siga o checklist abaixo.
2. Identifique a **superfície nova** da mudança: de onde vêm os dados, quem pode chamar, o que ela toca (banco, arquivos, rede, comandos).
3. Consulte [references/checklist.md](references/checklist.md) para as áreas que a mudança toca. Não percorra o checklist inteiro se ele não se aplica.

## Princípios

- **Entrada é hostil.** Valide tipo, tamanho e formato no servidor, com allowlist, antes de usar. Valide de novo na fronteira de cada componente.
- **Seguro por padrão.** Consultas parametrizadas, saída escapada, APIs que não montam comandos ou SQL por concatenação.
- **Menor privilégio.** Permissões, tokens, escopos e CORS no mínimo necessário.
- **Autorização em todo acesso.** Autenticar não basta: confira se *aquele* usuário pode acessar *aquele* recurso, no servidor.
- **Segredos fora do código.** Variáveis de ambiente ou cofre; nunca em código, logs, mensagens de erro ou testes.
- **Falhe fechado.** Em dúvida ou erro, negue. Erros ao cliente não vazam detalhes internos.
- **Não invente criptografia.** Use bibliotecas e algoritmos padrão (hash de senha com argon2/bcrypt/scrypt, aleatoriedade criptográfica do sistema).

## Ao implementar

- Prefira a menor mudança que resolve o pedido. Não refatore código alheio ao pedido.
- Adicione testes para o comportamento de segurança (entrada inválida rejeitada, acesso negado a outro usuário), não só para o caminho feliz.
- Se a opção segura for mais trabalhosa ou mudar o comportamento esperado, escolha a segura e **diga que escolheu e por quê**.
- Nunca escreva código de exploração ou ataque. Esta skill só defende.

## Ao terminar

Responda em poucas linhas, em linguagem simples:
- que proteções foram aplicadas;
- o que ficou pendente ou depende de decisão (por exemplo, configuração de produção);
- se vale rodar `/muralha-detect` para uma revisão mais ampla.
