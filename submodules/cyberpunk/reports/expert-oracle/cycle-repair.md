# Expert repeated-state repair

3 October 2026. **All 24 failures are fixed in the same-seed regression run.**
The full bot-lab matrix also completes all 232 games without automation failures.

## Cause and repair

All 24 original failures show the same pattern: Expert activates **Alt
Cunningham: Soulkiller Architect**, then passes the target choice. The board
returns to its previous state. A new search starts at every live decision, so
its search-local ancestor set did not remember the board that opened the choice.
The bot could alternate between these two commands until the harness conceded.

The [original failure audit](cycle-repair-original-audit.json) contains all 24
seeds and their last eight actions. The pre-fix chooser was reconstructed by
removing the repair; every replay matched its saved action count and final hash.
All 24 show the Alt activation/pass pattern.

The [planner](../../packages/engine/src/automation/search/expert-oracle.ts) now
records visited live positions per engine, player, and turn. It seeds
each new search with that history. Simulated branches cannot return to an earlier
live position. History resets on a new turn or when the state revision goes
back; separate engine instances have separate histories. Search forks do not
write their positions into the live engine's history.

This changes bot planning only. Card legality, choices, costs, player views,
evaluation weights, beam width, search depth, and node budget are unchanged.
The strategy revision is `cyberpunk-automation-v9`. Sharp remains the default;
Expert remains a labelled full-information practice mode.

## Verification

| Measure | Before | After |
| --- | --- | --- |
| Games | 232 | 232 |
| Repeated-state failures | 24 | 0 |
| Other automation failures | 0 | 0 |
| Normal rule endings | 208 | 232 |
| Expert wins | 136 | 140 |
| Expert losses | 96 | 92 |
| Expert win rate | 58.6% | 60.3% |

The [failed-seed rerun](cycle-repair-failed-seeds.json) records 24 normal endings,
four Expert wins, and twenty normal losses. The
[complete repaired report](cycle-repair-report.json) uses the same schedule hash,
all 15 decks, 22 matchups, 88 blocks, and 232 seeds as the original report.
Those decks cover 82 distinct cards from 152 definitions; the catalog has 304
lookup entries because each definition has a slug alias and an ID alias.
All 208 previously normal games keep their winner, action count, and turn count.
207 also have every recorded field unchanged; game 110 has a different terminal
hash. No normal outcome regresses.

The paired mean gain over a 50% score is +7.67 percentage points. Its seeded
95% block-bootstrap interval is +0.28 to +15.06 points. With no failed games,
the raw and failure-penalized scores are identical. This is a same-seed regression
campaign, not an independent post-repair holdout. It supports an advantage on
this corpus; it does not establish general playing strength. The oracle/public
policy difference still blocks production promotion.

The [repaired seed-57 trace](cycle-repair-trace.json) preserves every move and
game log. Replay checks for games 0, 57, 94, and 110 match all recorded fields,
including terminal hashes.

The [new regression test](../../packages/engine/tests/automation/expert-live-cycle.test.ts)
reproduces the original loop position through 69
public commands with a frozen deck. It failed before the fix at the third live
state and passes with the shipped 768-node setting. Tests also check repeatable
decisions, engine immutability, and isolation between matches sharing a strategy.
The engine suites pass 80 tests; the bot-lab suites pass 11. The engine check
passes 400 files with no warnings or type errors.

The final fix retains the original handling of unfinished search lines. A
secondary change to that handling was discarded after it reduced wins in the
broader check. The main branch already contains live turn history and the initial regression
test. This PR restores its last viable search frontier, freezes the regression
deck, adds match-isolation coverage, and records the complete validation run.

## Reproduce

From the repository root, use a fresh results directory:

```sh
EXPERT_BENCHMARK_WORKERS=12 bun submodules/cyberpunk/reports/expert-oracle/bot-lab-benchmark.ts run /tmp/expert-bot-lab-cycle-fix-final
bun submodules/cyberpunk/reports/expert-oracle/bot-lab-benchmark.ts replay /tmp/expert-bot-lab-cycle-fix-final 57
```

The 24 failed seeds were checked first with six processes; the remaining games
ran with twelve. Recorded match wall times therefore measure mixed test load,
not per-decision browser latency.
