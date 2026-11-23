---
name: muralha-detect
description: Mapeia o sistema e registra riscos reais, com evidência, em .muralha/findings.json. Use depois do charter para auditar um projeto existente ou antes de um release.
---

# Muralha Detect

Encontre riscos **reais** e registre-os. Poucos achados confirmados valem mais que uma lista longa de suspeitas.

Esta etapa não altera código do projeto, só `.muralha/findings.json`.

## Passos

1. **Leia `.muralha/charter.md`.** Sem ele, sugira `/muralha-charter` primeiro.
2. **Mapeie o sistema** antes de caçar problemas:
   - pontos de entrada (rotas HTTP, CLI, filas, webhooks, jobs, uploads);
   - fronteiras de confiança (o que vem de fora e por onde entra);
   - autenticação e autorização (onde é feita, onde é pulada);
   - manuseio de segredos e dados sensíveis (de onde vêm, onde são gravados ou logados);
   - dependências e configuração de build, CI e deploy.
   Em projetos grandes, comece pelos pontos de entrada e siga os dados até onde são usados.
3. **Procure por categoria**, usando o charter como guia: injeção (SQL, comando, template), XSS, autenticação e sessão, autorização (IDOR, ausência de checagem), segredos expostos, criptografia fraca, upload e travessia de caminho, SSRF, desserialização insegura, configuração (CORS, cabeçalhos, debug ligado), dependências vulneráveis, vazamento em logs e erros.
4. **Exija evidência.** Um achado só entra se você consegue apontar `arquivo:linha` e explicar o caminho: de onde vem a entrada, por que ela chega ao ponto perigoso, o que um atacante ganha. Se não conseguir completar o caminho, não registre como achado confirmado; registre como `info` com "não confirmado" na descrição e diga o que faltou verificar.
5. **Classifique a severidade:**
   - `critical`: explorável sem autenticação, com impacto grave (execução de código, vazamento amplo, tomada de conta).
   - `high`: explorável com acesso comum ou exposição séria de dados.
   - `medium`: exige condições específicas ou tem impacto limitado.
   - `low`: endurecimento recomendado, sem caminho claro de abuso.
   - `info`: observação ou suspeita não confirmada.
6. **Registre em `.muralha/findings.json`** seguindo `schemas/findings.schema.json`. Crie o arquivo se não existir; se existir, **não duplique** achados já registrados (reaproveite o ID) e nunca altere o `status` de um achado existente.

```json
{
  "id": "F-001",
  "title": "Segredo no repositório",
  "severity": "critical",
  "status": "open",
  "location": "src/config.ts:12",
  "description": "A chave da API de pagamentos está em texto puro e é commitada. Qualquer pessoa com acesso ao repositório pode usá-la. Viola R-01."
}
```

   Use IDs sequenciais (`F-001`, `F-002`...). Escreva `title` e `description` em linguagem simples, citando a regra do charter violada.
7. **Termine** com uma tabela curta (ID, severidade, título, local) e sugira `/muralha-plan`.

## Evite

- Achados genéricos ("falta validação") sem local nem caminho.
- Ruído: padrões que parecem perigosos mas não são alcançáveis (entrada constante, código de teste).
- Corrigir qualquer coisa agora. Detectar e corrigir são etapas separadas.
- Escrever código de exploração. Descreva o risco; não produza o ataque.
