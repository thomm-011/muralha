# Como lançar uma versão

O pacote é publicado no npm por OIDC (*trusted publishing*): não existe token guardado no repositório. O workflow `.github/workflows/publish.yml` só **envia** a versão para a área de espera do npm, e uma pessoa aprova com 2FA.

1. **Prepare a versão em uma branch** (`npm version <patch|minor|major> --no-git-tag-version`), abra o PR e faça o merge na `main`.
2. **Crie a tag no commit mergeado** e envie:
   ```bash
   git checkout main && git pull
   git tag -a vX.Y.Z -m "muralha X.Y.Z"
   git push origin vX.Y.Z
   ```
3. **Acompanhe o workflow "Publish"** na aba Actions. Ele recusa a tag se ela não bater com a versão do `package.json` ou se o commit não estiver na `main`.
4. **Aprove no npm:** a versão aparece como pendente em npmjs.com → pacote `muralha`. Confira e aprove com a passkey. Pela CLI: `npm stage list muralha` e `npm stage approve <id>`.

A versão publicada leva *provenance*, a prova de qual commit e workflow a geraram.

## Configuração única do lado do npm

O npm precisa confiar neste workflow (feito uma vez, pelo dono do pacote):

```bash
npm trust github muralha --file publish.yml --repo thomm-011/muralha --allow-stage-publish
```

Os campos são sensíveis a maiúsculas e o npm não valida ao salvar: erros só aparecem ao publicar. Não use `--allow-publish`: sem ele, o workflow não consegue publicar direto, só enviar para aprovação.
