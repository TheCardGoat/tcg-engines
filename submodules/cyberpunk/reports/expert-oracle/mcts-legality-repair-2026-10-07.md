# MCTS legality repair — 2026-10-07

All **45** invalid games from the other-decks gauntlet reproduced exactly before the repair. All **45** completed as valid games after the repair. **12** additional games on fresh seeds also completed without automation failures.

## Confirmed cause

MCTS reused a stored search branch when its `stateID` and acting player matched the live game. `stateID` is a command counter, not a unique position ID. Different simulated branches can share that counter while resources, combat timing, or valid targets differ.

In every failed replay, the last reused branch had a different public position fingerprint at the failed step. The returned command matched the engine-rejected command. Baseline final-state and full action-trace hashes matched the original gauntlet records in all 45 games. The instrumentation read engine views and did not change decisions.

| Rejected move reason | Games |
| --- | ---: |
| `INSUFFICIENT_EDDIES` | 2 |
| `NOT_QUICK` | 17 |
| `ATTACK_IN_PROGRESS` | 24 |
| `INVALID_ATTACH_TARGET` | 1 |
| `NOT_YOUR_TURN` | 1 |

Screen game 219 is a concrete example: both branches had counter **38**. The real player had **0** available Eddies; the cached player had **1**. MCTS-Greedy attempted to play Mantis Blades with an attachment, and the engine rejected the payment.

## Repair

- MCTS starts each decision from a fresh live-engine fork. Tree reuse remains within a single decision. Public views alone cannot identify hidden state and RNG well enough to reuse an old fork safely.
- MCTS and Monte Carlo enumerate the current engine prompt. They check the selected command on an independent live fork before returning it. Engine checks own cost, target, and timing legality. Probes do not mutate the real game.
- Single-action and fallback paths use the same check. If every candidate is rejected, the chooser reports a visible `stuck` failure instead of returning an illegal command. Monte Carlo does not score rejected probes as tied candidates.
- Automation revision advanced from `cyberpunk-automation-v14` to `cyberpunk-automation-v15`.

The engine continues to enforce full payment and valid plays, as required by Comprehensive Rules **11.1.2** and **11.4.1.1**. No game rule, deck profile, heuristic weight, or information policy changed. This is a search-state and command-legality repair.

## Validation

The original decks, shuffle seeds, opponents, and seat assignments were preserved for the 45 repair replays. Their action traces can change because the corrected chooser now searches the live game.

| Batch | Games | Valid games | Automation failures |
| --- | ---: | ---: | ---: |
| Original failure replay | 45 | 0 | 45, reproduced exactly |
| Repaired failure replay | 45 | 45 | 0 |
| Fresh-seed mirror check | 12 | 12 | 0 |

The fresh games pair each MCTS variant against Expert on the three selected decks, with one common shuffle seed per deck and both seats. Expert keeps its oracle policy; MCTS keeps its public view. These 12 games check legality and are too small to establish strategy strength.

- **328** automation tests passed across 26 files. This includes 10 targeted legality regressions for counter collisions, single rejected actions, rejected fallbacks, stale contexts, and probe isolation. Four initial regression cases failed on the original code before the fix.
- **9** Bot Lab adapter and gauntlet tests passed across 2 files.
- Focused formatting, lint, and type checks passed for all 6 affected TypeScript files. Scoped `git diff --check` passed.
- Repair and holdout batches checked source hashes before every worker dispatch and at completion. Both used the same source SHA-256: `6f21b85ff1de08a93cccfbc0619ed2fcdad5043f2eeb14c6e324963b08d158b6`.

Fresh roots can require more search work than cached roots. The configured search budgets remain 50 MCTS iterations and 200 rollout steps. This repair does not establish a speed or strength improvement. The earlier gauntlet results remain historical; a new full run is needed to rank the repaired strategies. No deployment was performed.

## Evidence

- [Compact per-game evidence](mcts-legality-repair-2026-10-07.json).
- [Original other-decks gauntlet](other-decks-gauntlet-2026-10-07.md).
- Full move and game-log dumps: `/tmp/cyberpunk-mcts-repair-2026-10-07/{before,after,holdout}/<game-index>.json`.
- Fresh-seed mirrored plan: `/tmp/cyberpunk-mcts-repair-2026-10-07/holdout-plan/plan.json`.
