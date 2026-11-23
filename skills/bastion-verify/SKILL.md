---
name: bastion-verify
description: Confirma se cada correção realmente funciona e registra o veredito.
---

# Bastion Verify

Para cada achado `fixed`:
1. Releia o código corrigido e tente reproduzir o problema original.
2. Se não reproduz: `status: "verified"` e `verdict` com a evidência.
3. Se ainda reproduz: volte para `planned` e explique em `verdict` o que faltou.
4. Verifique também se a correção não criou um problema novo.
