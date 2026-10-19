# Background bot planning across simulators

Validated locally on 2026-10-15. Extends the [Cyberpunk performance investigation](cyberpunk-play-performance.md). Lorcana is excluded.

## Coverage

| Simulator | Previous browser execution | Current execution |
| --- | --- | --- |
| Cyberpunk | Expert search on the UI thread after pacing | Existing dedicated worker implementation from the initial change |
| Alpha Clash | Up to 200 synchronous bot actions inside the human action handler | One worker-planned, validated command per paced presentation step; preserve expert search history |
| Flesh and Blood | Synchronous strategy/line compilation after pacing | Snapshot worker planning, with RNG state returned and advanced only on a current result |
| Grand Archive | Synchronous legal-command enumeration and strategy after pacing | Clone-safe match program sent once, snapshot planning in a worker, command validation on the owning runtime |
| Gundam | Synchronous candidate enumeration/ranking after pacing | Worker ranks snapshot candidates; runtime submission reuses those candidates and preserves fallback validation and decision telemetry |
| Naruto Preview | Synchronous greedy selection inside the React state updater | Worker selects a proposed action; immutable reducer commits only against the current snapshot |
| One Piece | Synchronous setup/greedy selection after a timer | Worker selection for both setup and active-turn commands; existing engine applies the result |
| Riftbound | Manual tabletop reducer, no bot search loop | Audited: already uses authoritative/presentation state separation and queued animation plans; no worker needed for bot computation |

No game rules, strategy strength, legal-action definitions, hosted transport, or Lorcana sources were changed. Standard hosted Gundam practice is server-authoritative; its browser-local strategy bot is used by local simulator fixtures and labs. Server bot execution is already outside the browser UI thread.

## Shared browser mechanism

`apps/multi-game-simulator/src/simulator/bot/decision-worker.ts` owns a typed, game-agnostic transport. Each game's module worker owns reconstruction and planning. Shared code imports no game engines.

- Instantiate lazily and send immutable card/program context once per worker lifetime. Subsequent requests carry current snapshots and game-specific dynamic mappings.
- Start search immediately while the selected pacing timer runs. Commit waits for both. UI controls remain usable during search.
- Permit one outstanding request; request ids ignore late responses. State object identity, runtime/program identity, strategy/control scope, and current automation mode guard commit. Reused state version numbers do not authorize old results.
- Cancel obsolete searches on state/control changes and teardown; terminate workers on failure or a 15-second timeout. Errors halt automatic retry loops and are visible in the existing controls or an alert. Gundam exposes a recoverable paused error through its control provider.
- Keep command application, legality validation, history, analytics, and animation integration in the existing owning runtime. Arbitrary Gundam custom strategies retain their synchronous execution, and browsers without Worker use the existing policy locally.
- Preserve existing command gates. Alpha Clash also waits while its transient presentation is busy instead of batching the whole bot turn into one render.

The React scheduler tolerates StrictMode's setup/cleanup cycle. Gundam's imperative attachment uses the same transport and implements equivalent cancellation, pacing overlap, and runtime-state guards.

## Worker bundle admission

An optimized Vite fixture mounting the actual practice components successfully built all six new module workers. Sizes below are emitted uncompressed JavaScript, not network or startup timings:

| Worker | Emitted size |
| --- | ---: |
| Naruto | 34.41 kB |
| Gundam | 322.54 kB |
| Grand Archive | 643.32 kB |
| Flesh and Blood | 1,479.77 kB |
| Alpha Clash | 2,763.73 kB |
| One Piece | 3,695.80 kB |

Grand Archive initially emitted a 13,266.33 kB worker because its broad automation entrypoint also admitted the full fixture/deck catalog. The new public `@tcg/grand-archive-engine/automation/decision` surface exports planning only and reduces that worker by about 95%. Its match program still comes from the live match, including its actual card definitions.

The temporary production fixture used the actual game providers, `MantineProvider`, `MemoryRouter`, React's production build, and normal animation settings. One Piece used the same practice-entrypoint source alias as the app's Vite config. The fixture was served alone on port 5195; platform services were not started.

## Validation and reproducibility

48 focused tests passed across the rollout: six game-owned snapshot contracts, 20 shared/Gundam scheduling cases, eight Grand Archive practice flows, six Naruto practice flows, three Alpha Clash controls/endgame cases, one FAB control-lock regression, and four existing Gundam submission-boundary cases. The focused changed-source/test dependency graph typecheck, changed-file lint, and optimized actual-practice-UI build passed. This is focused validation, not a full-platform check.

The shared scheduler tests exercise immediate start, pacing overlap, exactly-once commit, same-version state replacement, pre-render authoritative changes, pause, takeover, strategy changes, explicit stepping, StrictMode/unmount, timeout, and one-time context transfer. Gundam additionally tests its imperative worker path, fallback submission, error recovery, and telemetry.

The game-owned `bot-decision.test.ts` suites own snapshot/command transport contracts, not card-behavior coverage. They compare serialized planning against the original policies, checks state remains unchanged during planning, and verifies runtime command application. FAB uses seeded real-deck practice matches and checks both command and RNG state; Alpha Clash retains one expert instance per planning lifetime.

Focused commands from `apps/multi-game-simulator`:

```sh
pnpm exec vp test run --configLoader runner src/simulator/bot/use-background-bot.test.tsx src/games/gundam/src/game/bot/strategy-bot.test.ts
pnpm exec vp test run --configLoader runner src/games/*/bot-decision.test.ts src/games/gundam/src/game/bot/bot-decision.test.ts
pnpm exec vp test run --configLoader runner src/games/grand-archive/Practice.test.tsx
pnpm exec vp test run --configLoader runner src/games/naruto/__tests__/PracticePage.test.tsx
pnpm exec vp test run --configLoader runner src/games/alpha-clash/pages/Practice.undo.test.tsx src/games/alpha-clash/pages/Practice.endgame.test.tsx src/games/flesh-and-blood/practice-undo-control-lock.test.tsx
```

From `submodules/gundam/packages/engine`, the existing `src/automation/submission-boundary.test.ts` covers normal fallback command submission. The app's existing One Piece board suite was also exercised: 17 tests passed; two unchanged setup-fixture assertions fail (history length and the default hand count). Those fixtures are separate from worker scheduling. Naruto's test wrapper now provides the Mantine theme used by its undo modal, and Grand Archive's step assertion waits for asynchronous completion.

Browser checks in optimized Chrome builds verified module workers actually load and commands reach each real board:

| Simulator | Visible interaction checked |
| --- | --- |
| Naruto | Human End turn; bot summons Jugo, sets supports, resolves leader search, returns human turn 3 |
| One Piece | Human Jo Ken Po and Keep Hand; bot chooses first, keeps, enters its turn, plays Karoo, and activates Luffy |
| Gundam | Real-card main-phase fixture; bot deploys/attacks and returns control; Step and Take control controls respond |
| Grand Archive | Confirm preparation, human Pass Opportunity; bot resolves pregame and plays response cards, then returns Opportunity |
| Alpha Clash | Human Keep, Skip resource, End turn; bot deploys a resource, deals damage, and returns human turn 3 |
| Flesh and Blood | Real Rhinar versus Tuffnut matchup; human pass/arsenal choice and worker-driven opponent commands; control and error checks |

Screenshots and temporary build source are retained locally under `artifacts/background-bot-rollout/`. The build source is a validation fixture, not a production route. Browser interactions use visible controls, not engine/debug globals.

## Limits

The original Cyberpunk before/after recordings remain the only paired performance measurements. Their 2,167 → 0 ms blocking result must not be attributed to every game. This rollout verifies off-thread planning, production worker builds, cancellation contracts, and selected browser flows. It does not establish sustained frame rates across all cards, late-game board sizes, mobile devices, or hosted network flows. Card projection and validated command execution still run on the UI thread and may require separate profiling if they produce long tasks.

The standalone fixture lacks deployed routing, CSP, authenticated APIs, and the full audio asset environment. Release validation must confirm worker URLs load under the deployed simulator configuration. No deployment was performed.
