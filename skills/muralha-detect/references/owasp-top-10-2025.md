# Guia de caça: OWASP Top 10:2025

Use este guia no passo 3 do `/muralha-detect`. Para cada categoria: o que procurar no código e que evidência registrar. Só abra as categorias que se aplicam ao projeto; o charter diz quais.

Fonte: [OWASP Top 10:2025](https://top10.owasp.org/2025/). Ao registrar um achado, preencha o campo `category` com o código (por exemplo, `A01:2025`).

| Código | Categoria | O que procurar |
| --- | --- | --- |
| A01 | Broken Access Control | Rotas ou ações sem checagem de dono/papel (IDOR); autorização só no cliente; campos como `isAdmin` ou `userId` aceitos do cliente; CORS permissivo; **CSRF** em ações que mudam estado; **SSRF** (URL de entrada usada em requisição de saída sem allowlist) |
| A02 | Security Misconfiguration | Modo debug ligado; credenciais padrão; portas, painéis ou recursos desnecessários; cabeçalhos de segurança ausentes; permissões de nuvem amplas; parser XML com entidades externas; mensagens de erro detalhadas |
| A03 | Software Supply Chain Failures | Dependências desatualizadas, sem manutenção ou sem lockfile; pacotes de fontes não oficiais; **pipelines de CI/CD** (actions por tag em vez de SHA, tokens com permissão ampla, segredos em logs, scripts de instalação); falta de SBOM e de controle de mudanças no build |
| A04 | Cryptographic Failures | Algoritmos fracos ou obsoletos (MD5, SHA-1, DES, ECB); **chave criptográfica fixa no código**; aleatoriedade não criptográfica para tokens; dados sensíveis sem TLS ou sem criptografia em repouso; hash de senha rápido |
| A05 | Injection | Concatenação de entrada em SQL/NoSQL, comando de sistema, template, LDAP ou cabeçalho; XSS (saída sem escape no contexto certo); injeção em logs |
| A06 | Insecure Design | Fluxos de negócio abusáveis (redefinição de senha, cupons, limites, transferências); ausência de limite de taxa e de cotas; isolamento fraco entre usuários ou inquilinos; falta de modelo de ameaças para o recurso. **É falha de projeto, não de linha de código**: descreva o cenário de abuso |
| A07 | Authentication Failures | **Credenciais ou senhas fixas no código**; sem limite de tentativas; sem MFA onde o risco pede; política de senha fraca; sessão não renovada após login (fixation); tokens de sessão em URL |
| A08 | Software or Data Integrity Failures | **Desserialização de dados não confiáveis**; atualizações ou artefatos sem verificação de assinatura; scripts de CDN sem SRI; pipelines que aceitam artefatos não verificados; JWT ou cookies sem verificação de integridade |
| A09 | Security Logging and Alerting Failures | Eventos de segurança sem registro (login falho, acesso negado); logs com segredos ou dados pessoais; ausência de alerta; logs que aceitam quebra de linha da entrada |
| A10 | Mishandling of Exceptional Conditions | `catch` que engole o erro; **falha aberta** (erro na checagem de permissão resulta em acesso liberado); transação deixada pela metade; parâmetro ausente ou nulo não tratado; recursos sem limite (tamanho, tempo, memória); erro que vaza dados internos |

## Aplicações que usam LLMs e agentes

Se o projeto chama um modelo ou executa um agente, considere também o [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/):

- **LLM01 Prompt Injection**: entrada externa (páginas, e-mails, arquivos, resultados de ferramentas) que chega ao prompt sem separação ou limite.
- **LLM02 Sensitive Information Disclosure** e **LLM07 System Prompt Leakage**: segredos ou dados de outros usuários dentro de prompts ou contexto.
- **LLM05 Improper Output Handling**: saída do modelo usada como HTML, SQL, comando ou código sem validação.
- **LLM06 Excessive Agency**: o agente tem ferramentas, permissões ou autonomia além do necessário (escrever em disco, executar comandos, chamar APIs sem confirmação).
- **LLM03 Supply Chain**: modelos, plugins e servidores MCP de origem não verificada.
- **LLM10 Unbounded Consumption**: sem limite de tokens, de chamadas ou de custo.

Registre esses achados com `category` no formato `LLM06:2025`.

## Severidade: probabilidade e impacto

O OWASP avalia risco como **probabilidade × impacto**. Ao classificar, pergunte as duas coisas: *quão fácil é de explorar a partir de quem tem acesso?* e *o que se perde se for explorado?* Alto nos dois é `critical` ou `high`. Alto impacto com exploração difícil costuma ser `medium`.
