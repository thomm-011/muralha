import type { Finding, Severity } from "./state.js";

export const MARKER = "<!-- muralha-report -->";
export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "info"];
const STATUSES = ["open", "planned", "fixed", "verified", "rejected"] as const;
const LABEL: Record<(typeof STATUSES)[number], string> = {
  open: "Abertos",
  planned: "Planejados",
  fixed: "Corrigidos (aguardando verificação)",
  verified: "Verificados",
  rejected: "Rejeitados",
};
const MAX_ROWS = 50;

const rank = (s: Severity): number => SEVERITIES.indexOf(s);
const isPending = (f: Finding): boolean => f.status === "open" || f.status === "planned";

export function isSeverity(value: string): value is Severity {
  return (SEVERITIES as string[]).includes(value);
}

/** Achados pendentes (abertos ou planejados) com severidade igual ou maior que o limite. */
export function failing(findings: Finding[], threshold: Severity): Finding[] {
  return findings.filter((f) => isPending(f) && rank(f.severity) <= rank(threshold));
}

/** O conteúdo de findings.json vem do PR: nunca vai cru para o Markdown. */
export function escapeMd(text: string | undefined, max = 200): string {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  const cut = flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
  return cut
    .replace(/[\\`*_{}[\]()#+!|~]/g, "\\$&")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/@/g, "@​");
}

export function escapeCommandData(text: string): string {
  return text.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

export function escapeCommandProperty(text: string): string {
  return escapeCommandData(text).replace(/:/g, "%3A").replace(/,/g, "%2C");
}

/** "caminho/arquivo.ts:12" -> { file, line }; recusa caminhos absolutos e com "..". */
export function parseLocation(location: string | undefined): { file: string; line: number } | null {
  const m = /^(.+?):(\d+)$/.exec(location ?? "");
  if (!m) return null;
  const file = m[1];
  if (file.startsWith("/") || file.split(/[\\/]/).includes("..")) return null;
  return { file, line: Number(m[2]) };
}

/** Comandos de workflow do GitHub Actions, uma anotação por achado pendente com local. */
export function annotations(findings: Finding[]): string[] {
  const lines: string[] = [];
  for (const f of findings.filter(isPending)) {
    const loc = parseLocation(f.location);
    if (!loc) continue;
    const level = rank(f.severity) <= rank("high") ? "error" : rank(f.severity) <= rank("medium") ? "warning" : "notice";
    const title = escapeCommandProperty(`${f.id} (${f.severity}${f.category ? `, ${f.category}` : ""})`);
    const file = escapeCommandProperty(loc.file);
    lines.push(`::${level} file=${file},line=${loc.line},title=${title}::${escapeCommandData(f.title)}`);
  }
  return lines;
}

export function renderMarkdown(findings: Finding[], opts: { failOn?: Severity } = {}): string {
  const out: string[] = [MARKER, "## Muralha: relatório de segurança", ""];
  if (findings.length === 0) {
    out.push("Nenhum achado registrado em `.muralha/findings.json`.");
    return out.join("\n") + "\n";
  }

  out.push("| Status | Quantidade |", "| --- | ---: |");
  for (const s of STATUSES) out.push(`| ${LABEL[s]} | ${findings.filter((f) => f.status === s).length} |`);
  out.push("");

  const pending = findings.filter(isPending).sort((a, b) => rank(a.severity) - rank(b.severity));
  if (pending.length) {
    out.push("### Achados pendentes", "", "| ID | Severidade | Categoria | Título | Local | Status |", "| --- | --- | --- | --- | --- | --- |");
    for (const f of pending.slice(0, MAX_ROWS)) {
      out.push(`| ${escapeMd(f.id, 20)} | ${f.severity} | ${escapeMd(f.category, 20) || "-"} | ${escapeMd(f.title)} | ${escapeMd(f.location, 80)} | ${f.status} |`);
    }
    if (pending.length > MAX_ROWS) out.push("", `… e mais ${pending.length - MAX_ROWS} achados pendentes.`);
    out.push("");
  } else {
    out.push("Nenhum achado pendente.", "");
  }

  if (opts.failOn) {
    const blocking = failing(findings, opts.failOn);
    out.push(
      blocking.length
        ? `**Portão: reprovado.** ${blocking.length} achado(s) pendente(s) com severidade \`${opts.failOn}\` ou maior.`
        : `**Portão: aprovado.** Nenhum achado pendente com severidade \`${opts.failOn}\` ou maior.`,
      "",
    );
  }
  return out.join("\n");
}
