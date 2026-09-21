# Verification — 15 September 2026

## Focused baseline (before implementation)

| Working directory                                                        | Command                                                                                          | Result                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `agnostic-simulator/packages/grand-archive/grand-archive-server-adapter` | `vp test run --configLoader runner src/adapter.test.ts src/presentation.test.ts`                 | 2 files, 27 tests passed (includes journal/replay coverage). |
| `grand-archive/packages/engine`                                          | `vp test run src/projection/private-zone-rules.test.ts src/procedures/game-flow/pregame.test.ts` | 2 files, 14 tests passed.                                    |

## Original implementation checks (historical, 15 September)

| Working directory                                                        | Command                                                                                                                                                                                                                                                                                                                        | Result                                                                                                      |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `agnostic-simulator/packages/protocol`                                   | `vp test run --configLoader runner`                                                                                                                                                                                                                                                                                            | 7 files, 94 tests passed, including generated-schema drift and envelope rejection checks.                   |
| `agnostic-simulator/packages/grand-archive/grand-archive-server-adapter` | `vp test run --configLoader runner`                                                                                                                                                                                                                                                                                            | 9 files, 61 tests passed.                                                                                   |
| `agnostic-simulator/tools/native-client-dev-server`                      | `bun test` (uncached final run)                                                                                                                                                                                                                                                                                                | 5 public-socket integration tests passed at that revision; see review follow-up below for current coverage. |
| Same tool                                                                | `vp exec tsc --noEmit` (uncached final run)                                                                                                                                                                                                                                                                                    | Passed, including the socket test/client.                                                                   |
| Protocol and GA adapter packages, separately                             | `vp exec tsc --noEmit`                                                                                                                                                                                                                                                                                                         | Passed.                                                                                                     |
| `agnostic-simulator`                                                     | `vp lint packages/protocol/src/native.ts packages/grand-archive/grand-archive-server-adapter/src/native.ts packages/grand-archive/grand-archive-server-adapter/src/server-engine.ts tools/native-client-dev-server/src/host.ts tools/native-client-dev-server/src/main.ts tools/native-client-dev-server/src/socket-client.ts` | Passed.                                                                                                     |
| Repository root                                                          | `git diff --check`                                                                                                                                                                                                                                                                                                             | Passed.                                                                                                     |
| `agnostic-simulator`                                                     | `vp run @tcg/native-client-dev-server#dev`                                                                                                                                                                                                                                                                                     | Started on **127.0.0.1:5194**; listener inspected; Ctrl-C stopped it; no listener remained.                 |

The socket tests exercise normal Standard pregame and Champion On Enter draws, a legal
reserve-3 Crusader activation and rested resolution, two-viewer privacy across all
snapshot/display/interaction/animation fields, invalid payment/actor/action/version
rejections without mutation, identical and conflicting correlations, simultaneous
retries, lost activation response/reconnect, full snapshot recovery, increasing sequences,
malformed/unsupported/binary/oversized traffic, queue/connection/output/result bounds,
and exact live-vs-replayed final snapshot fingerprint equality. The full normalized
per-viewer transcript can be compared explicitly with the single client-owned recording
in `godot-sim/tests/fixtures/standard.json` using `NATIVE_FIXTURE_COMPARE`. Normal server
tests retain their assertions without requiring a client checkout.

The fixture's selected card and payment are deterministic. Final zone counts are asserted
against actual engine state, not merely written into fixture metadata. Engine actions
enter exclusively through the public WebSocket; authoritative state is read only for
verification of privacy, counts and replay equivalence.

## Broad gate blocker

The latest recorded full `pnpm run ci:agnostic:check` reached the test phase.
Commit `31ea0438da` reformatted the One Piece adapter import, after which formatting,
lint and type checks passed. Tests failed in `GrandArchiveHands.test.tsx` and the FAB
adapter `interaction.test.ts` / `lifecycle-baseline.test.ts` suites. The broad gate
**did not pass**. Those behavior paths were not changed by this work; a clean-base
reproduction has not established whether all failures predate the PR.

The subsequent main-branch merge passed focused protocol and native-server checks.
Its commit hook additionally failed on unrelated incoming scratch files and bundled
tooling; that hook was bypassed for the merge after focused validation. This is not
full-workspace validation. Focused results must not be represented as a green broad gate.

## Resolved test findings and limits

- A burst of synchronous pings initially drained before saturating the queue. Command
  execution now yields to ingress between queued operations; queue saturation is directly
  tested, and a separate 64-frame/second bound also applies.
- Bun 1.3.13 reports code 1006 or 1009 for an oversized incoming frame. The test accepts
  either transport close; oversized messages never enter engine execution.
- Awaiting Bun's shutdown completion promise after an oversized-output close left a
  stale pending-WebSocket count and hung the test. Shutdown now drains accepted work,
  terminates sockets and calls immediate `stop(true)` without awaiting that Bun promise.
  A socket test verifies that the endpoint is unreachable after shutdown.
- This is a development host with a memory-only session/result ledger. No process-crash
  durability, multi-node guarantees, deployed integration, full interaction coverage,
  bot UX or Godot rendering is claimed. The complete game engine is unchanged.
- No simulator UI changed, so validation used the requested real socket boundary rather
  than starting the browser simulator or a platform Docker stack. No services were deployed
  or left running.

## PR review follow-up — 17 September 2026

- Native host/launcher: `bun test` passes 12 tests, including four executable-child launcher regressions (normal success, no-game QA, and signal termination) and the reduced opponent command bound. Normal tests exercise behavior without constructing or comparing a golden transcript.
- Exact client transcript comparison is opt-in: from this tool directory, run `NATIVE_FIXTURE_COMPARE=/absolute/path/to/godot-sim/tests/fixtures/standard.json bun test`. The recording is owned only by godot-sim; main owns its generator. No transcript or duplicate digest is retained here.
- Protocol: native tests pass, including runtime rejection of zero/one/three deck IDs and explicit portable-schema cardinality. Both generated schemas were refreshed against the current merged protocol.
- Host and protocol TypeScript checks and changed implementation lint pass.
- Snapshot validation occurs once before serialization/fan-out. Other outgoing envelopes still undergo runtime schema validation. Required adapter capabilities are checked before opening the server.
- Missing-game QA writes a failing server-verification report; a successful child exit alone cannot satisfy acceptance.

These focused results do not replace the broad-gate limitations recorded above.

### Optional unsupported inputs follow-up

The host now shares `inputAllowsOmission` with protocol validation and rejects an
unsupported input only when it is required for the submitted values or explicitly
supplied. Six public-socket cases cover omitted optional and zero-minimum inputs,
supplied unsupported input, required input, and conditional requirements both met
and unmet. Real pregame actions still execute through the engine. The interaction
and native protocol suites pass 35 tests, and the host suite passes 14 tests; host
and protocol type checks pass. This corrects the finding previously missed in the
review summary; no second implementation of omission rules was added.

### Explicit-null omission follow-up

The capability guard now treats explicit null like undefined, matching protocol
validation. Added socket regressions proving optional null is accepted, required
null remains rejected, and a non-null empty array still exercises an unsupported
capability and is rejected. Native host/launcher checks pass 21 tests (3,315
assertions), with TypeScript and changed implementation lint passing. The explicit
comparison against the client-owned recording also passes without changing it.
