---
name: muralha-verify
description: Confirma se cada correção realmente funciona, procura contornos e regressões, e registra o veredito. Use depois do harden.
---

# Muralha Verify

Uma correção só vale se resiste a uma segunda olhada cética. Trate cada achado `fixed` como se outra pessoa tivesse feito a correção e você precisasse convencer-se de que ela funciona.

## Passos

Para cada achado com `status: "fixed"`:

1. **Releia a descrição original e o diff da correção.** O que exatamente era explorável? A correção ataca essa causa?
2. **Tente reproduzir o problema original** de forma defensiva: rode o teste que o harden criou, ou escreva um novo; ou siga o caminho dos dados pelo código corrigido. Nunca execute ataques contra sistemas reais ou de terceiros.
3. **Procure contornos da mesma classe:**
   - outros pontos do código com o mesmo padrão que ficaram sem correção;
   - variações da entrada (codificações, maiúsculas e minúsculas, valores vazios ou muito grandes, caminhos alternativos até o mesmo recurso);
   - validação feita só no cliente, ou só em uma das rotas que chegam ao mesmo dado.
4. **Procure regressões e superfície nova:** os testes e o lint seguem passando? A correção abriu outro problema (mensagem de erro que vaza detalhe, exceção que derruba o serviço, permissão ampla demais)?
5. **Dê o veredito** em `.muralha/findings.json`:
   - tudo confere: `status: "verified"` e `verdict` com a evidência (qual teste, qual caminho conferido);
   - ainda reproduz ou há contorno: `status: "planned"` e `verdict` com o que faltou, para o próximo `/muralha-harden`;
   - achado que na verdade não procede: `status: "rejected"` e `verdict` com o motivo.
6. **Termine** com um resumo: quantos verificados, quantos voltaram ao plano, e o que ainda está `open`. Se sobrou algo, sugira repetir `/muralha-harden` e `/muralha-verify`. Se tudo fechou, sugira rodar `/muralha-detect` de novo para pegar o que a mudança possa ter exposto.

## Evite

- Marcar `verified` só porque o código "parece certo". Exija uma evidência concreta.
- Verificar apenas o ponto exato corrigido e ignorar os parecidos.
- Alterar código aqui. Se achar um problema, devolva para `planned`.
