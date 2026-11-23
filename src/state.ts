import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type Status = "open" | "planned" | "fixed" | "verified" | "rejected";

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  status: Status;
  location?: string;
  category?: string;
  description?: string;
  fix?: string;
  verdict?: string;
}

export interface State {
  charter: string | null;
  findings: Finding[];
}

export const STATE_DIR = ".muralha";

/** Categorias OWASP: A01:2025..A10:2025 (Top 10) e LLM01:2025..LLM10:2025 (Top 10 para LLMs). */
export const CATEGORY_PATTERN = /^(A(0[1-9]|10)|LLM(0[1-9]|10)):2025$/;

const SEVERITIES = ["critical", "high", "medium", "low", "info"];
const STATUSES = ["open", "planned", "fixed", "verified", "rejected"];

async function readOptional(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return null;
  }
}

export function parseFindings(raw: string | null): Finding[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const list: unknown[] = Array.isArray(data?.findings) ? data.findings : [];
    return list
      .filter(
        (f): f is Finding =>
          !!f &&
          typeof (f as Finding).id === "string" &&
          typeof (f as Finding).title === "string" &&
          SEVERITIES.includes((f as Finding).severity) &&
          STATUSES.includes((f as Finding).status),
      )
      .map((f) => {
        // categoria inválida não derruba o achado: só é descartada
        if (f.category === undefined || (typeof f.category === "string" && CATEGORY_PATTERN.test(f.category))) return f;
        const { category: _invalid, ...rest } = f;
        return rest;
      });
  } catch {
    return [];
  }
}

export async function loadState(root: string): Promise<State> {
  const dir = join(root, STATE_DIR);
  const [charter, findings] = await Promise.all([
    readOptional(join(dir, "charter.md")),
    readOptional(join(dir, "findings.json")),
  ]);
  return { charter, findings: parseFindings(findings) };
}
