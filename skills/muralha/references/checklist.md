# Checklist por área

Use só as áreas que a mudança toca.

## Entrada e saída
- Validação no servidor por allowlist (tipo, tamanho, formato, intervalo).
- Normalize antes de validar (Unicode, caixa, espaços, `..` em caminhos).
- Escape de saída conforme o contexto: HTML, atributo, URL, JS, SQL, shell.
- Limite o tamanho de corpo, de listas e de profundidade de JSON.

## Banco de dados
- Consultas parametrizadas ou ORM; nunca concatenar entrada em SQL/NoSQL.
- Conta do app com o mínimo de privilégio (sem DDL, sem acesso a outros schemas).
- Paginação com limite máximo.

## Autenticação e sessões
- Senhas com hash lento e salgado (argon2id, bcrypt, scrypt).
- Limite de tentativas e resposta idêntica para usuário inexistente e senha errada.
- Cookies de sessão com `HttpOnly`, `Secure`, `SameSite`; token aleatório e longo, expiração e revogação.
- JWT: fixe o algoritmo, valide `exp`, `iss`, `aud`; nunca aceite `alg: none`.

## Autorização
- Cheque dono/papel no servidor em **cada** rota e em cada ação sobre um recurso (evitar IDOR).
- Negue por padrão; liste explicitamente o que é permitido.
- Não confie em campos enviados pelo cliente (`isAdmin`, `userId`, `price`).

## Arquivos e uploads
- Valide tipo pelo conteúdo, não só pela extensão; limite de tamanho.
- Gere o nome do arquivo no servidor; nunca use o nome enviado em caminhos.
- Guarde fora da raiz pública e sirva com `Content-Type` e `Content-Disposition` corretos.
- Bloqueie travessia de diretório (`..`, caminhos absolutos, links simbólicos).

## Rede e requisições de saída
- URLs fornecidas pelo usuário: allowlist de hosts; bloqueie IPs privados, loopback e metadados de nuvem (SSRF).
- Timeout e limite de resposta em toda chamada externa.
- TLS com verificação ligada; nunca desligar a checagem de certificado.

## Comandos e execução
- Evite shell. Se for inevitável, passe argumentos como lista, nunca string concatenada.
- Nada de `eval`, `Function`, desserialização de dados não confiáveis.

## Segredos e configuração
- Sem segredo em código, repositório, imagem, log ou erro; `.env` fora do controle de versão.
- Valores diferentes por ambiente; segredo vazado exige **rotação**, não só remoção do código.
- Cabeçalhos de segurança em apps web: CSP, `X-Content-Type-Options`, HSTS, `Referrer-Policy`.
- CORS: nunca `*` com credenciais; liste origens.

## Dependências e build
- Versões fixadas por lockfile; revise dependências novas (mantenedor, uso real, tamanho).
- Rode o auditor do ecossistema (`npm audit`, `pip-audit`, etc.).
- CI com permissões mínimas e sem segredos em logs.

## Logs e erros
- Registre eventos de segurança (login falho, acesso negado) sem dados sensíveis.
- Erros ao cliente são genéricos; detalhes ficam no log do servidor.
