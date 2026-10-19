import { MATCH_INTRO_BOOTSTRAP, MATCH_INTRO_SHELL } from "../../src/match-intro";

// Two real documents isolate the navigation boundary without auth, a match server, or game engines.
const bundle = await Bun.build({
  entrypoints: [new URL("./client.ts", import.meta.url).pathname],
  target: "browser",
});
if (!bundle.success) throw new Error(String(bundle.logs));
const script = await bundle.outputs[0].text();
const css = await Bun.file(new URL("../../src/match-intro/styles.css", import.meta.url)).text();

Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT ?? 4198),
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/client.js")
      return new Response(script, { headers: { "Content-Type": "text/javascript" } });
    const lobby = url.pathname === "/lobby";
    const styles = url.searchParams.has("no-native")
      ? css.replace(/@view-transition\s*\{[^}]*\}/g, "")
      : css;
    return new Response(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Match intro fixture</title><style>${styles}
      *{box-sizing:border-box}body{margin:0;background:#0d1724;color:#f6f1e6;font:16px system-ui;min-height:100vh}
      main{min-height:100vh;display:grid;place-content:center;text-align:center;gap:24px;padding:32px}
      h1,p{margin:0}button,a{color:inherit}main button,main a{padding:14px 24px;border:1px solid #e5bf7260;border-radius:6px;background:#182132;font:inherit}
      .table{width:min(800px,90vw);height:55vh;border:1px solid #e5bf7250;border-radius:50%;background:radial-gradient(ellipse,#1b3643,#11242e);display:grid;place-content:center;gap:32px}
      .hand{display:flex;gap:12px;justify-content:center}.card{width:70px;height:100px;border:1px solid #e5bf7270;border-radius:6px;background:#233449;box-shadow:0 10px 20px #0004}
      [hidden]{display:none!important}</style><script>${MATCH_INTRO_BOOTSTRAP}</script></head><body>
      <div>${MATCH_INTRO_SHELL}</div><main>${
        lobby
          ? '<p>Gundam Card Game</p><h1>Matchmaking</h1><button id="start">Simulate match found</button><a href="/gundam/simulator/matches/fixture-match/games/fixture-game">Open match directly</a>'
          : '<p id="loading">Connecting to the match…</p><section id="board" hidden><div class="table"><p>Atlas</p><div class="hand"><div class="card"></div><div class="card"></div><div class="card"></div><div class="card"></div></div><p>Your opening hand</p><button>Keep hand</button></div></section>'
      }
      </main><script type="module" src="/client.js"></script></body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  },
});
console.log("Match intro fixture: http://127.0.0.1:4198/lobby");
