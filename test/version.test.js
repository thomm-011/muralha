import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const pkg = read("package.json");

test("manifests de plugin têm a mesma versão do package.json", () => {
  for (const file of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
    assert.equal(read(file).version, pkg.version, `${file} diverge do package.json`);
  }
});

test("package-lock.json tem a versão do pacote", () => {
  const lock = read("package-lock.json");
  assert.equal(lock.version, pkg.version);
  assert.equal(lock.packages[""].version, pkg.version);
});

test("o exemplo de versão fixada no README usa a versão atual", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const pinned = [...readme.matchAll(/muralha@(\d+\.\d+\.\d+)/g)].map((m) => m[1]);
  assert.ok(pinned.length > 0);
  for (const v of pinned) assert.equal(v, pkg.version, "README cita uma versão antiga");
});
