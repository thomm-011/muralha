#!/usr/bin/env node
import { cp, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./server.js";

const here = dirname(fileURLToPath(import.meta.url));
const HELP = `bastion — copiloto de segurança para desenvolvimento com agentes de IA

Uso:
  bastion                 abre o dashboard local
  bastion install [dir]   copia as skills para <dir>/.claude/skills (padrão: projeto atual)
  bastion --port <n>      escolhe a porta (padrão 4317)
  bastion --help
`;

async function install(target: string): Promise<void> {
  const dest = join(resolve(target), ".claude", "skills");
  await mkdir(dest, { recursive: true });
  await cp(join(here, "..", "skills"), dest, { recursive: true });
  console.log(`Skills instaladas em ${dest}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
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
  console.log(`Bastion rodando em http://127.0.0.1:${actual}  (Ctrl+C para sair)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
