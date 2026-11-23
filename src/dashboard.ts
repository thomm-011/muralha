export const PAGE = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Muralha</title>
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
  h1 { font-size:20px; margin:0 0 16px }
  .stats { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:8px 14px }
  .stat b { display:block; font-size:20px }
  .stat span { color:var(--mut); font-size:12px }
  .f { border:1px solid var(--line); border-left-width:4px; border-radius:8px; padding:12px 14px;
    margin-bottom:10px; background:var(--card) }
  .f h3 { margin:0 0 4px; font-size:15px }
  .meta { color:var(--mut); font-size:12px; display:flex; gap:12px; flex-wrap:wrap }
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
  <h1>Muralha</h1>
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
