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
