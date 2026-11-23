import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseFindings } from "../dist/state.js";
import { startServer } from "../dist/server.js";

test("parseFindings ignora entradas inválidas", () => {
  const raw = JSON.stringify({
    findings: [
      { id: "F-001", title: "ok", severity: "high", status: "open" },
      { id: "F-002", title: "sev ruim", severity: "nope", status: "open" },
      null,
    ],
  });
  assert.equal(parseFindings(raw).length, 1);
  assert.deepEqual(parseFindings("{quebrado"), []);
  assert.deepEqual(parseFindings(null), []);
});

test("servidor expõe o estado", async () => {
  const root = await mkdtemp(join(tmpdir(), "muralha-"));
  await mkdir(join(root, ".muralha"));
  await writeFile(
    join(root, ".muralha", "findings.json"),
    JSON.stringify({ findings: [{ id: "F-001", title: "x", severity: "low", status: "open" }] }),
  );
  const s = await startServer(root, 0);
  try {
    const res = await fetch(`http://127.0.0.1:${s.port}/api/state`);
    const body = await res.json();
    assert.equal(body.findings[0].id, "F-001");
    assert.equal(body.charter, null);
  } finally {
    s.close();
  }
});

test("parseFindings mantém categoria válida e descarta a inválida sem perder o achado", () => {
  const raw = JSON.stringify({
    findings: [
      { id: "F-001", title: "a", severity: "high", status: "open", category: "A07:2025" },
      { id: "F-002", title: "b", severity: "low", status: "open", category: "A99:2025" },
      { id: "F-003", title: "c", severity: "low", status: "open", category: 42 },
      { id: "F-004", title: "d", severity: "low", status: "open" },
    ],
  });
  const out = parseFindings(raw);
  assert.equal(out.length, 4);
  assert.equal(out[0].category, "A07:2025");
  assert.ok(!("category" in out[1]));
  assert.ok(!("category" in out[2]));
  assert.ok(!("category" in out[3]));
});
