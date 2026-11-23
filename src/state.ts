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
  description?: string;
  fix?: string;
  verdict?: string;
}

export interface State {
  charter: string | null;
  findings: Finding[];
}

export const STATE_DIR = ".bastion";

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
    return list.filter(
      (f): f is Finding =>
        !!f &&
        typeof (f as Finding).id === "string" &&
        typeof (f as Finding).title === "string" &&
        SEVERITIES.includes((f as Finding).severity) &&
        STATUSES.includes((f as Finding).status),
    );
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
