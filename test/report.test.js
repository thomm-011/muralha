import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  MARKER, annotations, escapeMd, failing, parseLocation, renderMarkdown,
} from "../dist/report.js";

const f = (id, severity, status, extra = {}) => ({ id, title: `t ${id}`, severity, status, ...extra });

test("failing considera só pendentes na severidade do limite ou maior", () => {
  const list = [f("F-001", "critical", "open"), f("F-002", "high", "fixed"), f("F-003", "medium", "planned"), f("F-004", "low", "open")];
  assert.deepEqual(failing(list, "high").map((x) => x.id), ["F-001"]);
  assert.deepEqual(failing(list, "medium").map((x) => x.id), ["F-001", "F-003"]);
  assert.equal(failing(list, "info").length, 3);
});

test("escapeMd neutraliza HTML, tabela, menções e links", () => {
  const out = escapeMd("<img src=x onerror=1> | [a](http://x) @octocat `c`");
  assert.ok(!out.includes("<"));
  assert.ok(!/(^|[^\\])\|/.test(out));
  assert.ok(!out.includes("@octocat"));
  assert.ok(!/\[a\]\(/.test(out));
  assert.ok(escapeMd("x".repeat(500)).length <= 200);
});

test("renderMarkdown: marcador, contagens, ordem por severidade e portão", () => {
  const md = renderMarkdown([f("F-001", "low", "open"), f("F-002", "critical", "open"), f("F-003", "high", "verified")], { failOn: "high" });
  assert.ok(md.startsWith(MARKER));
  assert.ok(md.indexOf("F-002") < md.indexOf("F-001"));
  assert.ok(md.includes("Portão: reprovado"));
  assert.ok(renderMarkdown([f("F-001", "low", "open")], { failOn: "high" }).includes("Portão: aprovado"));
  assert.ok(renderMarkdown([]).includes("Nenhum achado registrado"));
});

test("renderMarkdown limita a tabela a 50 linhas", () => {
  const many = Array.from({ length: 60 }, (_, i) => f(`F-${String(i + 1).padStart(3, "0")}`, "low", "open"));
  assert.ok(renderMarkdown(many).includes("e mais 10 achados pendentes"));
});

test("parseLocation recusa caminhos perigosos", () => {
  assert.deepEqual(parseLocation("src/a.ts:12"), { file: "src/a.ts", line: 12 });
  assert.equal(parseLocation("/etc/passwd:1"), null);
  assert.equal(parseLocation("../x.ts:1"), null);
  assert.equal(parseLocation("sem-linha"), null);
});

test("annotations escapa comandos de workflow", () => {
  const [line] = annotations([f("F-001", "high", "open", { title: "ruim\n::error::injeção %", location: "a,b:c.ts:3" })]);
  assert.ok(line.startsWith("::error file="));
  assert.ok(!line.slice(2).includes("\n"));
  // o runner termina os parâmetros no primeiro "::"; o resto é só mensagem
  const end = line.indexOf("::", 2);
  const props = line.slice(0, end);
  assert.equal(props, "::error file=a%2Cb%3Ac.ts,line=3,title=F-001 (high)");
  assert.ok(line.slice(end).includes("%0A") && line.slice(end).includes("%25"));
  assert.equal(annotations([f("F-002", "low", "verified", { location: "a.ts:1" })]).length, 0);
});

async function project(findings) {
  const dir = await mkdtemp(join(tmpdir(), "muralha-report-"));
  await mkdir(join(dir, ".muralha"));
  await writeFile(join(dir, ".muralha", "findings.json"), JSON.stringify({ findings }));
  return dir;
}
const cli = (...args) => spawnSync(process.execPath, [new URL("../dist/cli.js", import.meta.url).pathname, ...args], { encoding: "utf8" });

test("CLI report: código de saída segue o portão", async () => {
  const dir = await project([f("F-001", "high", "open")]);
  assert.equal(cli("report", "--dir", dir).status, 0);
  assert.equal(cli("report", "--dir", dir, "--fail-on", "high").status, 1);
  assert.equal(cli("report", "--dir", dir, "--fail-on", "critical").status, 0);
  assert.equal(cli("report", "--dir", dir, "--fail-on", "bogus").status, 2);
  assert.equal(cli("report", "--dir", dir, "--format", "x").status, 2);
  assert.ok(cli("report", "--dir", dir).stdout.includes(MARKER));
});

test("CLI report sem findings.json não falha", async () => {
  const dir = await mkdtemp(join(tmpdir(), "muralha-empty-"));
  const r = cli("report", "--dir", dir, "--fail-on", "low");
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes("Nenhum achado"));
});

test("relatório mostra a categoria (ou '-') e a anotação a inclui", () => {
  const md = renderMarkdown([f("F-001", "high", "open", { category: "A07:2025" }), f("F-002", "low", "open")]);
  assert.ok(md.includes("| Categoria |"));
  assert.ok(/\| F-001 \| high \| A07:2025 \|/.test(md));
  assert.ok(/\| F-002 \| low \| - \|/.test(md));
  const [line] = annotations([f("F-001", "high", "open", { category: "A07:2025", location: "a.ts:1" })]);
  assert.ok(line.includes("title=F-001 (high%2C A07%3A2025)"));
});

test("CLI report: findings.json ilegível falha fechado com --fail-on (código 2)", async () => {
  for (const content of ["{quebrado", JSON.stringify({ outra: [] }), JSON.stringify({ findings: [{ id: "F-001" }] })]) {
    const dir = await mkdtemp(join(tmpdir(), "muralha-bad-"));
    await mkdir(join(dir, ".muralha"));
    await writeFile(join(dir, ".muralha", "findings.json"), content);
    const gate = cli("report", "--dir", dir, "--fail-on", "high");
    assert.equal(gate.status, 2, `deveria falhar fechado para: ${content}`);
    assert.match(gate.stdout, /Atenção: o relatório pode estar incompleto/);
    assert.equal(cli("report", "--dir", dir).status, 0, "sem --fail-on o relatório só avisa");
    assert.match(cli("report", "--dir", dir, "--format", "annotations").stdout, /^::error title=findings.json::/);
  }
});

test("CLI report lê a lista solta no topo e aplica o portão (o bug do formato)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "muralha-array-"));
  await mkdir(join(dir, ".muralha"));
  await writeFile(join(dir, ".muralha", "findings.json"), JSON.stringify([f("F-001", "critical", "open")]));
  const r = cli("report", "--dir", dir, "--fail-on", "high");
  assert.equal(r.status, 1);
  assert.ok(r.stdout.includes("F-001"));
  assert.ok(!r.stdout.includes("Nenhum achado registrado"));
});
