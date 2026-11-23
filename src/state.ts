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
  problems: string[];
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

export interface ParseResult {
  findings: Finding[];
  /** Problemas que tornam o relatório incompleto ou não confiável. */
  problems: string[];
}

const isFinding = (f: unknown): f is Finding =>
  !!f &&
  typeof (f as Finding).id === "string" &&
  typeof (f as Finding).title === "string" &&
  SEVERITIES.includes((f as Finding).severity) &&
  STATUSES.includes((f as Finding).status);

// categoria inválida não derruba o achado: só é descartada
function cleanCategory(f: Finding): Finding {
  if (f.category === undefined || (typeof f.category === "string" && CATEGORY_PATTERN.test(f.category))) return f;
  const { category: _invalid, ...rest } = f;
  return rest;
}

/**
 * Lê o conteúdo de findings.json. Aceita `{ "findings": [...] }` e também uma lista no topo
 * (formato que agentes costumam gerar). Nunca devolve "vazio" em silêncio: tudo que não
 * puder ser lido vira um problema explícito.
 */
export function readFindings(raw: string | null): ParseResult {
  if (raw === null) return { findings: [], problems: [] };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { findings: [], problems: ["findings.json não é um JSON válido."] };
  }
  const wrapped = (data as { findings?: unknown } | null)?.findings;
  const list: unknown[] | null = Array.isArray(data) ? data : Array.isArray(wrapped) ? wrapped : null;
  if (!list) {
    return { findings: [], problems: ['findings.json deve ser um objeto com a chave "findings" (uma lista de achados).'] };
  }
  const findings = list.filter(isFinding).map(cleanCategory);
  const skipped = list.length - findings.length;
  return {
    findings,
    problems: skipped
      ? [`${skipped} achado(s) ignorado(s) por campos inválidos (id, title, severity e status são obrigatórios).`]
      : [],
  };
}

export function parseFindings(raw: string | null): Finding[] {
  return readFindings(raw).findings;
}

export async function loadState(root: string): Promise<State> {
  const dir = join(root, STATE_DIR);
  const [charter, findings] = await Promise.all([
    readOptional(join(dir, "charter.md")),
    readOptional(join(dir, "findings.json")),
  ]);
  const read = readFindings(findings);
  return { charter, findings: read.findings, problems: read.problems };
}
