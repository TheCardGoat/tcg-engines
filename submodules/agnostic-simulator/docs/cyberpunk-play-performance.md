# Cyberpunk offline play performance

Investigated and validated on 2026-10-15. Scope: the Cyberpunk local practice experience corresponding to Choombattler's offline expert mode. The change is local source code; nothing was deployed.

## Finding and measured result

The default expert bot searched synchronously on the browser's main thread. A single decision could prevent input, rendering, and animation callbacks for almost 800 ms. The existing 600 ms balanced pacing delay elapsed **before** the search started, adding latency without protecting rendering.

Bot decisions now run in a module Web Worker. Search starts during the pacing delay; the move commits only after both search and pacing complete. Command validation, board rendering, animation readiness, and human interaction remain owned by the existing simulator.

The final optimized-build comparison used the same seed, decks, expert strategy, pacing, and visible actions:

| Measurement | Synchronous control | Worker + overlapping pacing |
| --- | ---: | ---: |
| Main-thread tasks over 50 ms | 5 | 0 |
| Total blocking time within the 20 s recording | 2,167 ms | 0 ms |
| Worst animation-frame interval | 783.4 ms | 50.0 ms |
| 95th-percentile frame interval | 16.8 ms | 16.8 ms |
| Human Keep → bot turn complete | 5,701.8 ms | 3,195.3 ms |
| Keep click Event Timing duration | 128 ms | 88 ms |

The observed turn finished about 44% sooner. Both versions gained D8 (5), called Goro Takemura, sold Over the Edge, played Mandibular Upgrade on Goro, and returned control on turn 2. This is one final paired recording, not a device-wide percentile or a guarantee that every frame is under 50 ms. An earlier optimized control independently measured 2,186 ms blocking time and a 766.7 ms worst frame interval; an earlier worker build also recorded zero long tasks.

Raw final measurements: [synchronous](cyberpunk-play-performance/synchronous.json), [worker](cyberpunk-play-performance/worker.json). Total blocking time here is `sum(max(longTask.duration - 50, 0))` over the recording, not a Lighthouse page-load score. Event Timing durations are browser-quantized and include presentation time; they are not interchangeable with long-task duration.

## What Choombattler does

The live [offline expert experience](https://choombattler.com/play?mode=offline&opponent=expert) and its public browser-delivered bundles were inspected:

- [Bot worker client](https://choombattler.com/assets/bot-worker-client-DkqZ9Hsf.js) creates a dedicated module worker, sends catalog/state, and receives asynchronous decisions. The referenced worker asset is `bot.worker-D4vV8c2B.js`.
- [Hotseat game controller](https://choombattler.com/assets/useHotseatGame-C-T4yVGO.js) manages displayed-state progression separately and uses nonblocking timers for pacing. This allows the UI to present transitions while computation proceeds elsewhere.
- A reference expert-turn recording contained zero main-thread tasks over 50 ms. Its worst frame interval was 216.6 ms, so the observation does not establish literally stall-free rendering. The reference has different decks, game state, and a 50.6 s recording window; do not compute comparative percentages from it. [Reference data](cyberpunk-play-performance/choombattler.json).

The main transferable architectural lesson is to keep expensive decisions off the UI thread and separate intentional pacing from computation. This implementation uses our own engine and existing presentation queue; no competitor source or assets were copied. Asset hashes identify what was observed and may disappear on future deployments. Earlier motion-specific work is documented in [Choombattler motion and sound validation](choombattler-three-validation.md).

## Implementation and safety

- `AIPlayer.decide()` produces a serializable proposed command without changing authoritative state. `executeDecision()` uses the existing command processor. `step()` retains synchronous behavior for non-browser callers.
- The browser creates one lazy worker per AI seat/strategy lifetime. The worker retains seeded strategy RNG between decisions and receives immutable state snapshots plus only new or changed card definitions, including overlays.
- Built-in strategy identity and deck profiles are recorded explicitly. Arbitrary custom strategy functions stay on the existing synchronous path; matching a built-in's name alone does not substitute its behavior. Browsers without Worker retain the synchronous path.
- Only one request may be in flight. Commit requires the original engine, state object, AI instance, mode, and human seat still to match. Restart, state replacement, pause/mode changes, takeover, strategy changes, and unmount cancel obsolete work. Numeric state versions alone are insufficient because undo/restart can reuse them.
- Search and balanced/fast/slow pacing run concurrently. Changing speed takes effect on subsequent scheduling; the in-flight decision retains its selected delay. Existing animation command gates are preserved.
- Worker errors surface through existing bot error handling. A 15 s decision timeout terminates the worker and permits retry; disposal settles pending callers. The normal stall watchdog remains available.

The engine's seeded parity test compares 40 deferred decision opportunities with ordinary synchronous steps, asserting equal commands and committed states. Deferred commands still undergo normal legality validation.

## Validation

34 focused tests passed across the engine and simulator:

- Engine `tests/automation/ai-player.test.ts`: 6 tests, including seeded snapshot parity and rejection of an invalid deferred command.
- Simulator `EngineProvider.worker.test.tsx`: 7 tests covering responsive controls during pending work, exactly-once commit, stale results after restart/mode/takeover/state changes, unmount, and search/pacing overlap.
- Simulator `ai-worker-client.test.ts`: 3 tests covering structured-clone-safe payloads, definition caching, request serialization, old replies, disposal, error recovery, and timeout.
- Existing practice engine (9), provider initialization/responsiveness (4), and bot stall watchdog (5) tests passed. The watchdog test wrapper now includes its required `MemoryRouter`.

Engine type checking, focused simulator source/test dependency-graph type checking, changed simulator-file lint, and optimized worker + real-practice-UI fixture builds passed. Full-app type checking was attempted but is not green: it reports existing errors across unrelated fixtures and other game workspaces. It is not claimed as validation of this change.

Browser checks used the actual practice board: opening hand, the full first expert turn, human Gig gain, hand inspection, card sale, program play and optional target resolution, and bot pause/step/resume controls. Automated race tests cover late-result cancellation. Standalone fixture console errors came from unavailable external auth/audio resources; no hosted/auth flow was exercised.

## Reproduce the optimized comparison

Use Chrome, a fixed 1280×720 viewport, and seed `smoothness-2026-10-15`. Defaults select Street Heat versus Corpo Ops, `expert-oracle`, and balanced pacing. The recorded browser was Chrome 155 on macOS ARM64. Background machine load was not controlled. Run builds/tests before recording and record only one game at a time.

From `apps/multi-game-simulator`, create the following temporary files. This mounts the existing practice UI with its providers and normal animation speed; it avoids development React overhead and does not require platform services. Do not deploy these fixture files.

`smoothness.tmp.html`:

```html
<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cyberpunk performance fixture</title></head><body><div id="root"></div><script type="module" src="/smoothness.tmp.tsx"></script></body></html>
```

`smoothness.tmp.tsx`:

```tsx
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { CyberpunkSimulatorProviders } from './src/games/cyberpunk/App';
import { ReadyPracticeMatch } from './src/games/cyberpunk/pages/PracticeMatch.page';
import { createPracticeMatchConfig } from './src/games/cyberpunk/engine/practice/sessionStorage';
import './src/app.css';
const config=createPracticeMatchConfig({seed:'smoothness-2026-10-15'});
createRoot(document.getElementById('root')!).render(
  <MemoryRouter><CyberpunkSimulatorProviders><ReadyPracticeMatch config={config}/></CyberpunkSimulatorProviders></MemoryRouter>
);
```

`vite.smoothness.fixture.tmp.ts`:

```ts
import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
 plugins: [react(),tailwindcss()],
 resolve:{dedupe:['react','react-dom','react-router','immer','@mantine/core','@mantine/hooks']},
 build:{rolldownOptions:{input:'smoothness.tmp.html'},outDir:'/tmp/tcg-smoothness/production-fixture',emptyOutDir:true},
 worker:{format:'es'}
});
```

Build and serve only this fixture (check that the chosen port is free first):

```sh
pnpm exec vp build --config vite.smoothness.fixture.tmp.ts
python3 -m http.server 5195 --bind 127.0.0.1 --directory /tmp/tcg-smoothness/production-fixture
```

Open `http://127.0.0.1:5195/smoothness.tmp.html` with Playwright CLI in Chrome. Dismiss the introductory guide, allow the bot to choose first and keep its hand, and leave the human Keep prompt visible. The fixture uses public UI actions; do not call engine/debug globals.

For the synchronous control, use a separate browser context and, **before navigation**, run:

```js
async page => {
  await page.addInitScript(() => { window.Worker = undefined; });
  await page.goto('http://127.0.0.1:5195/smoothness.tmp.html');
}
```

This selects the original synchronous fallback without changing cards, bot strength, state, or animation speed. The worker session uses an ordinary browser context. On a fresh document in each session, run the saved [recording script](cyberpunk-play-performance/record-turn.js) with `playwright-cli -s=<session> run-code --filename=<absolute-path-to-script>`. It clicks the visible Keep button, records long tasks/frame intervals/click timing for 20 seconds, and observes the rendered “Turn 2 started.” log to time completion. Reload before every recording so observers do not accumulate. Keep the tab foreground and avoid other active games.

The temporary fixture and config were removed from the source checkout after validation. Stop only the servers and browser sessions created for this comparison.

## Limits and follow-up measurements

This removes the measured Cyberpunk local-bot stall. It does not prove hosted match latency, network/reconnect behavior, other games, low-end mobile performance, cold-load performance, or all late-game board states. No shared transport boundary or game rule changed. Development builds still showed roughly 90–140 ms React rendering tasks; optimized measurements were used to avoid treating development overhead as shipped performance.

For release validation, run the same visible flow in the deployed simulator and confirm the worker asset loads under its final routing/CSP. For a separate hosted-lag report, trace input → transport → authoritative response → committed board → animation readiness, then fix the measured owner. Keep the two measurements distinct: instantaneous rendering during bot search does not imply instantaneous server responses.
