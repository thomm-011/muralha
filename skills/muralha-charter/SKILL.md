---
name: muralha-charter
description: Define as regras de segurança do projeto (charter) em .muralha/charter.md. Use antes de qualquer outra skill do Muralha, ou quando o escopo, os dados ou o ambiente do projeto mudarem.
---

# Muralha Charter

O charter é a base de todas as outras skills: elas medem o código contra ele. Um charter vago gera achados vagos, então cada regra precisa ser curta e **verificável**.

Esta etapa não altera código.

## Passos

1. **Leia o projeto** antes de perguntar qualquer coisa: README, manifests (`package.json`, `pyproject.toml`, `go.mod`...), estrutura de pastas, Dockerfile/CI, arquivos de configuração. Identifique stack, pontos de entrada (HTTP, CLI, filas, webhooks, uploads), dependências críticas e onde o sistema roda.
2. **Pergunte só o que não dá para inferir**, em uma única mensagem e em linguagem simples (a pessoa pode não ser da área de segurança). No máximo quatro perguntas, por exemplo:
   - Quem usa o sistema e como entra (público, só equipe, só você)?
   - Que dados são sensíveis (pessoais, pagamentos, credenciais, segredos de negócio)?
   - Onde roda (máquina local, nuvem, serverless, rede interna)?
   - Existe alguma exigência externa (LGPD, PCI, contrato)?
   Se a pessoa não souber, assuma o cenário mais restritivo e registre a suposição.
3. **Se `.muralha/charter.md` já existe**, atualize em vez de sobrescrever: mantenha as regras e os IDs existentes, adicione as novas e diga o que mudou.
4. **Escreva `.muralha/charter.md`** neste formato:

```markdown
# Charter de segurança

## Contexto
Stack, onde roda, quem usa, suposições assumidas.

## Ativos
O que precisa ser protegido, em ordem de importância.

## Ameaças prováveis
Quem ataca e como, em frases curtas (ex.: "visitante anônimo explorando o formulário de upload").

## Regras
- R-01 Nenhum segredo no repositório ou nos logs. Verificação: busca por chaves/tokens; configuração vem de variáveis de ambiente.
- R-02 Toda entrada externa é validada no servidor. Verificação: cada ponto de entrada tem validação de tipo, tamanho e formato.

## Fora de escopo
O que esta revisão não cobre.
```

5. **Regras boas** são específicas ao projeto, têm ID estável (`R-01`, `R-02`...), dizem como verificar e cabem em uma linha. Entre 6 e 15 regras costuma bastar. Cubra, quando aplicável: segredos, validação de entrada, autenticação e autorização, proteção de dados, dependências, configuração e deploy, logs e erros.
6. **Termine** mostrando o resumo (ativos, ameaças, número de regras) e sugerindo `/muralha-detect`.
