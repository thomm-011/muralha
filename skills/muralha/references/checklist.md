# Checklist por área

Use só as áreas que a mudança toca. Cada área indica a categoria do [OWASP Top 10:2025](https://top10.owasp.org/2025/) e a Cheat Sheet do OWASP para ir além deste resumo.

## Entrada e saída (A05 Injection)
- Validação no servidor por allowlist (tipo, tamanho, formato, intervalo).
- Normalize antes de validar (Unicode, caixa, espaços, `..` em caminhos).
- Escape de saída conforme o contexto: HTML, atributo, URL, JS, SQL, shell, cabeçalho, log.
- Limite o tamanho de corpo, de listas e de profundidade de JSON.
- Mais: [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## Banco de dados (A05 Injection)
- Consultas parametrizadas ou ORM; nunca concatenar entrada em SQL/NoSQL.
- Conta do app com o mínimo de privilégio (sem DDL, sem acesso a outros schemas).
- Paginação com limite máximo.
- Mais: [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

## Autenticação e sessões (A07 Authentication Failures)
- Senhas com hash lento e salgado (argon2id, bcrypt, scrypt).
- Limite de tentativas e resposta idêntica para usuário inexistente e senha errada; MFA onde o risco pedir.
- Nenhuma credencial ou senha fixa no código nem valores padrão em produção.
- Cookies de sessão com `HttpOnly`, `Secure`, `SameSite`; token aleatório e longo, renovado após o login, com expiração e revogação.
- JWT: fixe o algoritmo, valide `exp`, `iss`, `aud`; nunca aceite `alg: none`.
- Mais: [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

## Autorização (A01 Broken Access Control)
- Cheque dono/papel no servidor em **cada** rota e em cada ação sobre um recurso (evitar IDOR).
- Negue por padrão; liste explicitamente o que é permitido.
- Não confie em campos enviados pelo cliente (`isAdmin`, `userId`, `price`); evite atribuição em massa.
- Ações que mudam estado exigem proteção contra CSRF (token ou `SameSite` + verificação de origem).
- Mais: [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [IDOR Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html), [Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html), [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Rede e requisições de saída (A01, SSRF)
- URLs fornecidas pelo usuário: allowlist de hosts; bloqueie IPs privados, loopback e metadados de nuvem (SSRF).
- Timeout e limite de resposta em toda chamada externa.
- TLS com verificação ligada; nunca desligar a checagem de certificado.
- Mais: [SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## Arquivos e uploads (A01, A05)
- Valide tipo pelo conteúdo, não só pela extensão; limite de tamanho.
- Gere o nome do arquivo no servidor; nunca use o nome enviado em caminhos.
- Guarde fora da raiz pública e sirva com `Content-Type` e `Content-Disposition` corretos.
- Bloqueie travessia de diretório (`..`, caminhos absolutos, links simbólicos).
- Mais: [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## Comandos e execução (A05 Injection)
- Evite shell. Se for inevitável, passe argumentos como lista, nunca string concatenada.
- Nada de `eval`, `Function`, templates montados com entrada.
- Mais: [OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html).

## Criptografia (A04 Cryptographic Failures)
- Algoritmos e modos atuais (AES-GCM, SHA-256 ou melhor); nada de MD5, SHA-1, DES ou ECB.
- Chaves fora do código, gerenciadas e rotacionáveis; aleatoriedade criptográfica para tokens.
- TLS em todo tráfego; dados sensíveis criptografados em repouso quando o charter pedir.
- Mais: [Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).

## Segredos e configuração (A02 Security Misconfiguration)
- Sem segredo em código, repositório, imagem, log ou erro; `.env` fora do controle de versão.
- Valores diferentes por ambiente; segredo vazado exige **rotação**, não só remoção do código.
- Desligue o que não é usado (modo debug, painéis, portas, recursos de exemplo); nada de credenciais padrão.
- Cabeçalhos de segurança em apps web: CSP, `X-Content-Type-Options`, HSTS, `Referrer-Policy`.
- CORS: nunca `*` com credenciais; liste origens.
- Mais: [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).

## Dependências, build e CI/CD (A03 Software Supply Chain Failures)
- Versões fixadas por lockfile; conheça também as dependências transitivas (SBOM quando o projeto precisar).
- Revise dependências novas (mantenedor, uso real, tamanho); remova as sem uso e prefira fontes oficiais, com pacotes assinados quando existirem.
- Rode o auditor do ecossistema (`npm audit`, `pip-audit`, etc.) no CI e acompanhe pacotes sem manutenção.
- CI/CD: actions e imagens fixadas por SHA ou digest, tokens com permissão mínima, segredos fora de logs, MFA e proteção de branch no repositório.
- Atualize com critério, não em todos os ambientes ao mesmo tempo.
- Mais: [Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html), [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html), [NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html).

## Integridade de software e dados (A08)
- Nunca desserialize dados não confiáveis com formatos que executam código; prefira JSON com validação.
- Verifique a assinatura ou o hash de atualizações e artefatos antes de usá-los.
- Scripts e estilos de CDN com `integrity` (SRI); cookies e tokens com verificação de integridade.
- Mais: [Deserialization](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html).

## Projeto e abuso de fluxos (A06 Insecure Design)
- Antes de implementar um recurso novo, escreva em duas linhas como alguém abusaria dele (redefinir senha de outra pessoa, repetir um cupom, esgotar um limite).
- Limite de taxa e cotas por usuário em ações caras ou sensíveis.
- Isole dados entre usuários ou inquilinos desde o modelo de dados, não só na tela.
- Mais: [Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

## Erros e condições excepcionais (A10 Mishandling of Exceptional Conditions)
- Trate o erro **onde ele acontece**, com uma ação que resolva ou desfaça; mantenha um tratador global para o que escapar.
- **Falhe fechado:** erro na checagem de permissão, validação ou autenticação significa negar, nunca liberar.
- Transação deixada pela metade: desfaça tudo e recomece, em vez de tentar continuar de onde parou.
- Trate parâmetros ausentes ou nulos e todo recurso com limite (tamanho, tempo, memória, tentativas). Nada deve ser ilimitado.
- Erros ao cliente são genéricos; detalhes ficam no log do servidor.
- Mais: [Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html).

## Logs e alertas (A09 Security Logging and Alerting Failures)
- Registre eventos de segurança (login falho, acesso negado, mudança de permissão) sem dados sensíveis nem segredos.
- Neutralize quebras de linha da entrada antes de logar.
- Um registro que ninguém lê não protege: indique onde o alerta é gerado para eventos graves.
- Mais: [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## Aplicações com LLMs e agentes (OWASP Top 10 for LLM Applications)
- Trate todo conteúdo externo que chega ao prompt (páginas, e-mails, arquivos, resultado de ferramentas) como não confiável: ele pode conter instruções.
- Dê ao agente só as ferramentas e permissões necessárias; ações destrutivas ou irreversíveis pedem confirmação humana.
- Saída do modelo é entrada não confiável: valide antes de usar como HTML, SQL, comando ou código.
- Nunca ponha segredos nem dados de outros usuários no prompt ou no contexto.
- Limite tokens, chamadas e custo por usuário; verifique a origem de modelos, plugins e servidores MCP.
- Mais: [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html), [Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/).
