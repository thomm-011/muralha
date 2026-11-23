export const PAGE = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Muralha</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20role%3D%22img%22%20aria-label%3D%22Muralha%22%3E%3Cstyle%3E.b%7Bfill%3A%231E2A38%7D.a%7Bfill%3A%23E8A317%7D.w%7Bfill%3Anone%3Bstroke%3A%231E2A38%3Bstroke-width%3A5%3Bstroke-linejoin%3Amiter%3Bstroke-linecap%3Abutt%7D%40media%20%28prefers-color-scheme%3Adark%29%7B.b%7Bfill%3A%23C8D1DC%7D.w%7Bstroke%3A%23E6EBF1%7D%7D%3C%2Fstyle%3E%3Crect%20fill%3D%22%231E2A38%22%20x%3D%224%22%20y%3D%224%22%20width%3D%2226%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20fill%3D%22%231E2A38%22%20x%3D%2234%22%20y%3D%224%22%20width%3D%2226%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20fill%3D%22%231E2A38%22%20x%3D%224%22%20y%3D%2224%22%20width%3D%2211%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20fill%3D%22%23E8A317%22%20x%3D%2219%22%20y%3D%2224%22%20width%3D%2226%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20fill%3D%22%231E2A38%22%20x%3D%2249%22%20y%3D%2224%22%20width%3D%2211%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20fill%3D%22%231E2A38%22%20x%3D%224%22%20y%3D%2244%22%20width%3D%2226%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Crect%20fill%3D%22%231E2A38%22%20x%3D%2234%22%20y%3D%2244%22%20width%3D%2226%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3C%2Fsvg%3E%0A">
<style>
  :root { --bg:#fff; --fg:#16181d; --mut:#6b7280; --line:#e5e7eb; --card:#f8f9fb;
    --critical:#b91c1c; --high:#c2410c; --medium:#a16207; --low:#1d4ed8; --info:#6b7280; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0f1115; --fg:#e6e8ec; --mut:#9aa1ad; --line:#262a33; --card:#171a21;
      --critical:#f87171; --high:#fb923c; --medium:#facc15; --low:#60a5fa; --info:#9aa1ad; }
  }
  * { box-sizing: border-box }
  body { margin:0; padding:24px 16px; background:var(--bg); color:var(--fg);
    font:14px/1.5 system-ui,sans-serif }
  main { max-width:900px; margin:0 auto }
  h1 { font-size:20px; margin:0 0 16px; display:flex; align-items:center; gap:10px }
  .stats { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:8px 14px }
  .stat b { display:block; font-size:20px }
  .stat span { color:var(--mut); font-size:12px }
  .f { border:1px solid var(--line); border-left-width:4px; border-radius:8px; padding:12px 14px;
    margin-bottom:10px; background:var(--card) }
  .f h3 { margin:0 0 4px; font-size:15px }
  .meta { color:var(--mut); font-size:12px; display:flex; gap:12px; flex-wrap:wrap }
  .warn { border:1px solid var(--high); border-left-width:4px; border-radius:8px; padding:10px 14px; margin-bottom:16px; background:var(--card) }
  .cat { font-weight:600; color:var(--fg) }
  .f p { margin:8px 0 0 }
  .sev-critical{border-left-color:var(--critical)} .sev-high{border-left-color:var(--high)}
  .sev-medium{border-left-color:var(--medium)} .sev-low{border-left-color:var(--low)}
  .sev-info{border-left-color:var(--info)}
  .empty { color:var(--mut); padding:24px 0 }
  details { margin-top:24px } summary { cursor:pointer; color:var(--mut) }
  pre { white-space:pre-wrap; background:var(--card); padding:12px; border-radius:8px; border:1px solid var(--line) }
</style>
</head>
<body>
<main>
  <h1><svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true"><rect fill="currentColor" x="4" y="4" width="26" height="16" rx="2"/><rect fill="currentColor" x="34" y="4" width="26" height="16" rx="2"/><rect fill="currentColor" x="4" y="24" width="11" height="16" rx="2"/><rect fill="#E8A317" x="19" y="24" width="26" height="16" rx="2"/><rect fill="currentColor" x="49" y="24" width="11" height="16" rx="2"/><rect fill="currentColor" x="4" y="44" width="26" height="16" rx="2"/><rect fill="currentColor" x="34" y="44" width="26" height="16" rx="2"/></svg>Muralha</h1>
  <div class="warn" id="problems" hidden></div>
  <div class="stats" id="stats"></div>
  <div id="list"></div>
  <details id="charter" hidden><summary>Charter</summary><pre id="charterText"></pre></details>
</main>
<script>
const STATUS = ["open","planned","fixed","verified","rejected"];
const LABEL = { open:"Abertos", planned:"Planejados", fixed:"Corrigidos", verified:"Verificados", rejected:"Rejeitados" };
const ORDER = { critical:0, high:1, medium:2, low:3, info:4 };

function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) n[k] = v;
  for (const kid of kids) n.append(kid);
  return n;
}

function render(state) {
  const problems = document.getElementById("problems");
  problems.hidden = !(state.problems && state.problems.length);
  problems.textContent = problems.hidden ? "" : "Atenção: " + state.problems.join(" ");
  const stats = document.getElementById("stats");
  const list = document.getElementById("list");
  stats.replaceChildren(...STATUS.map(s =>
    el("div", { className: "stat" },
      el("b", { textContent: String(state.findings.filter(f => f.status === s).length) }),
      el("span", { textContent: LABEL[s] }))));

  const sorted = [...state.findings].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
  if (!sorted.length) {
    list.replaceChildren(el("div", { className: "empty",
      textContent: "Nenhum achado ainda. Rode /muralha-charter e /muralha-detect no seu agente." }));
  } else {
    list.replaceChildren(...sorted.map(f => {
      const card = el("div", { className: "f sev-" + f.severity },
        el("h3", { textContent: f.id + " · " + f.title }),
        el("div", { className: "meta" },
          el("span", { textContent: f.severity }),
          el("span", { textContent: f.status }),
          ...(f.category ? [el("span", { className: "cat", title: "Categoria OWASP", textContent: f.category })] : []),
          el("span", { textContent: f.location || "" })));
      for (const key of ["description", "fix", "verdict"]) {
        if (f[key]) card.append(el("p", { textContent: (key === "fix" ? "Correção: " : key === "verdict" ? "Veredito: " : "") + f[key] }));
      }
      return card;
    }));
  }
  const c = document.getElementById("charter");
  c.hidden = !state.charter;
  document.getElementById("charterText").textContent = state.charter || "";
}

async function load() {
  try { render(await (await fetch("/api/state")).json()); } catch {}
}
load();
const es = new EventSource("/events");
es.onmessage = load;
</script>
</body>
</html>
`;
