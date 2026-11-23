import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../skills/", import.meta.url).pathname;
const dirs = readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory());

test("existem as seis skills esperadas", () => {
  const names = dirs.map((d) => d.name).sort();
  assert.deepEqual(names, [
    "muralha", "muralha-charter", "muralha-detect", "muralha-harden", "muralha-plan", "muralha-verify",
  ]);
});

for (const d of dirs) {
  test(`skill ${d.name}: frontmatter e links válidos`, () => {
    const file = join(root, d.name, "SKILL.md");
    assert.ok(existsSync(file), "SKILL.md ausente");
    const text = readFileSync(file, "utf8");
    const m = text.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/);
    assert.ok(m, "frontmatter inválido");
    assert.equal(m[1], d.name, "name deve ser igual ao nome da pasta");
    assert.ok(m[2].length >= 40, "description curta demais para o agente decidir quando usar");
    for (const [, link] of text.matchAll(/\]\((references\/[^)]+)\)/g)) {
      assert.ok(existsSync(join(root, d.name, link)), `link quebrado: ${link}`);
    }
  });
}

test("guia OWASP cobre A01 a A10 e o Top 10 para LLMs", () => {
  const guide = readFileSync(join(root, "muralha-detect", "references", "owasp-top-10-2025.md"), "utf8");
  for (let i = 1; i <= 10; i++) {
    const code = `A${String(i).padStart(2, "0")}`;
    assert.ok(new RegExp(`\\| ${code} \\|`).test(guide), `categoria ${code} ausente no guia`);
  }
  for (const code of ["LLM01", "LLM05", "LLM06", "LLM10"]) assert.ok(guide.includes(code), `${code} ausente`);
});

test("checklist referencia as categorias novas de 2025 (A03, A06, A10)", () => {
  const checklist = readFileSync(join(root, "muralha", "references", "checklist.md"), "utf8");
  for (const code of ["A03", "A06", "A10"]) assert.ok(checklist.includes(code), `${code} ausente no checklist`);
});

test("schema aceita category OWASP e o exemplo do detect é válido", () => {
  const schema = JSON.parse(readFileSync(new URL("../schemas/findings.schema.json", import.meta.url), "utf8"));
  const pattern = new RegExp(schema.properties.findings.items.properties.category.pattern);
  for (const ok of ["A01:2025", "A10:2025", "LLM06:2025"]) assert.ok(pattern.test(ok), ok);
  for (const bad of ["A11:2025", "A01:2021", "a01:2025"]) assert.ok(!pattern.test(bad), bad);
  const detect = readFileSync(join(root, "muralha-detect", "SKILL.md"), "utf8");
  const file = JSON.parse(detect.match(/```json\n([\s\S]*?)\n```/)[1]);
  assert.ok(Array.isArray(file.findings), "o exemplo do detect deve ser o arquivo inteiro: objeto com a chave findings");
  assert.ok(pattern.test(file.findings[0].category), "exemplo do detect com category inválida");
});

test("nenhuma skill depende de um arquivo de schema que o install não copia", () => {
  for (const d of dirs) {
    const text = readFileSync(join(root, d.name, "SKILL.md"), "utf8");
    assert.ok(!text.includes("schemas/findings.schema.json"), `${d.name} cita schemas/findings.schema.json`);
  }
});

test("as skills que editam findings.json explicam o formato do arquivo", () => {
  for (const name of ["muralha-detect", "muralha-plan", "muralha-harden", "muralha-verify"]) {
    const text = readFileSync(join(root, name, "SKILL.md"), "utf8");
    assert.ok(text.includes('"findings"'), `${name} não descreve o formato { "findings": [...] }`);
  }
});
