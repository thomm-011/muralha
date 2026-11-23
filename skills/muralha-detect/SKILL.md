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
3. **Procure por categoria**, usando o charter para decidir quais se aplicam e o guia [references/owasp-top-10-2025.md](references/owasp-top-10-2025.md) para saber o que procurar em cada uma (OWASP Top 10:2025, A01 a A10, e o Top 10 para LLMs quando o projeto usa modelos ou agentes). Três áreas que costumam ficar de fora se ninguém lembrar:
   - **Cadeia de suprimentos (A03):** além das dependências, leia os workflows de CI/CD, os scripts de build e as permissões dos tokens.
   - **Projeto (A06):** pergunte como um usuário mal-intencionado abusaria do fluxo de negócio, mesmo que cada linha de código esteja correta.
   - **Condições excepcionais (A10):** procure `catch` que engole erros, checagens que liberam o acesso quando falham (falha aberta) e operações deixadas pela metade.
4. **Exija evidência.** Um achado só entra se você consegue apontar `arquivo:linha` e explicar o caminho: de onde vem a entrada, por que ela chega ao ponto perigoso, o que um atacante ganha. Se não conseguir completar o caminho, não registre como achado confirmado; registre como `info` com "não confirmado" na descrição e diga o que faltou verificar.
5. **Classifique a severidade** pensando em **probabilidade × impacto** (quão fácil é explorar, e o que se perde):
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
  "category": "A07:2025",
  "location": "src/config.ts:12",
  "description": "A chave da API de pagamentos está em texto puro e é commitada. Qualquer pessoa com acesso ao repositório pode usá-la. Viola R-01."
}
```

   Use IDs sequenciais (`F-001`, `F-002`...). Escreva `title` e `description` em linguagem simples, citando a regra do charter violada. Preencha `category` com o código OWASP (`A01:2025` a `A10:2025`, ou `LLM01:2025` a `LLM10:2025`); se nenhuma categoria couber, omita o campo.
7. **Termine** com uma tabela curta (ID, severidade, título, local) e sugira `/muralha-plan`.

## Evite

- Achados genéricos ("falta validação") sem local nem caminho.
- Tratar a lista do OWASP como checklist a preencher. Ela orienta onde olhar; só entra achado com evidência no código.
- Ruído: padrões que parecem perigosos mas não são alcançáveis (entrada constante, código de teste).
- Corrigir qualquer coisa agora. Detectar e corrigir são etapas separadas.
- Escrever código de exploração. Descreva o risco; não produza o ataque.
