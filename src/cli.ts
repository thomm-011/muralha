#!/usr/bin/env node
import { cp, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { startServer } from "./server.js";
import { loadState } from "./state.js";
import { annotations, failing, isSeverity, renderMarkdown, SEVERITIES } from "./report.js";

const here = dirname(fileURLToPath(import.meta.url));
const HELP = `muralha — copiloto de segurança para desenvolvimento com agentes de IA

Uso:
  muralha                 abre o dashboard local
  muralha install [dir]   copia as skills para <dir>/.claude/skills (padrão: projeto atual)
  muralha --port <n>      escolhe a porta (padrão 4317)
  muralha report          resume .muralha/findings.json (para CI e PRs)
      --format <markdown|annotations>   formato da saída (padrão markdown)
      --fail-on <severidade>            sai com código 1 se houver achado pendente
                                        nessa severidade ou maior (critical|high|medium|low|info)
      --dir <pasta>                     projeto a ler (padrão: pasta atual)
  muralha --help
`;

async function install(target: string): Promise<void> {
  const dest = join(resolve(target), ".claude", "skills");
  await mkdir(dest, { recursive: true });
  await cp(join(here, "..", "skills"), dest, { recursive: true });
  console.log(`Skills instaladas em ${dest}`);
}

async function report(argv: string[]): Promise<number> {
  const { values } = parseArgs({
    args: argv,
    options: {
      format: { type: "string", default: "markdown" },
      "fail-on": { type: "string" },
      dir: { type: "string", default: process.cwd() },
    },
  });
  const failOn = values["fail-on"];
  if (failOn !== undefined && !isSeverity(failOn)) {
    console.error(`--fail-on inválido: use ${SEVERITIES.join(", ")}.`);
    return 2;
  }
  if (values.format !== "markdown" && values.format !== "annotations") {
    console.error("--format inválido: use markdown ou annotations.");
    return 2;
  }
  const { findings } = await loadState(resolve(values.dir));
  if (values.format === "annotations") {
    for (const line of annotations(findings)) console.log(line);
  } else {
    process.stdout.write(renderMarkdown(findings, { failOn }));
  }
  return failOn && failing(findings, failOn).length > 0 ? 1 : 0;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return;
  }
  if (args[0] === "report") {
    process.exitCode = await report(args.slice(1));
    return;
  }
  if (args[0] === "install") {
    await install(args[1] ?? process.cwd());
    return;
  }
  const i = args.indexOf("--port");
  const port = i >= 0 ? Number(args[i + 1]) : 4317;
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error("Porta inválida.");
    process.exit(1);
  }
  const { port: actual } = await startServer(process.cwd(), port);
  console.log(`Muralha rodando em http://127.0.0.1:${actual}  (Ctrl+C para sair)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
