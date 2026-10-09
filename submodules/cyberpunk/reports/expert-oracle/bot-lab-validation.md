# Bot-lab validation: Expert versus Sharp

Historical v8 result. The [v9 repair and rerun](cycle-repair.md) resolves all 24
failures and completes the same 232-game matrix. The reproduction commands below
describe the pre-repair chooser; use the repair report for current commands.

3 October 2026. **The performance claim did not pass.** Expert has a higher raw
win count, but the paired interval includes zero gain and it has automation
failures. No chooser settings were changed during this benchmark.

The run uses the Cyberpunk bot-lab adapter, its complete authored deck matrix,
the bot-core paired scheduler, and its seeded 4,000-sample block bootstrap.
This is a practice diagnostic: Expert is `oracle`, Sharp is `public`.
The normal evaluator still rejects this combination for promotion.

## Fixed test plan

- 15 legal authored decks; each has 40 main-deck cards and 3 Legends.
- 15 mirror matchups and 7 adjacent cross-deck matchups.
- Four seed blocks per matchup: 88 blocks, 232 games.
- Both seats, and both deck assignments in cross-deck matchups.
- New seed base: `expert-botlab-holdout-2026-10-03-v1`.
- 82 distinct cards from 152 catalog definitions. The catalog's 304 lookup
  entries include both slug and ID aliases for each card.
- Sharp retains its authored deck profiles. Expert uses its shipped practice
  settings: 768 nodes, width 5, depth 12, four reply lines.

The scheduler uses a separate deterministic seed for each leg. It does not
reuse one shuffle across the two seats. Blocks, not individual games, are the
bootstrap sampling unit. Each block has equal weight; cross-deck blocks contain
four games and mirror blocks contain two.

## Results

| Measure | Result |
| --- | --- |
| Expert wins / losses / draws | 136 / 96 / 0 |
| Raw win rate | 58.6% |
| Expert in seat 1 | 65 / 116 wins; 15 failures |
| Expert in seat 2 | 71 / 116 wins; 9 failures |
| Normal rule endings | 208 |
| Repeated-state exits | 24 (10.3%) |
| Illegal / unsupported / action-cap exits | 0 |
| Raw mean paired gain over 50% | +5.97 percentage points |
| Raw paired 95% bootstrap interval | -1.70 to +13.35 percentage points |
| Bot-lab failure-penalized paired gain | -4.26 percentage points |
| Failure-penalized 95% interval | -14.49 to +5.40 percentage points |

For the failure-penalized score, bot lab assigns -1 to a failed game, 1 to a
candidate win, 0 to a baseline win, and 0.5 to a draw. This is an automation
acceptance score, not a win-rate estimate. All 24 failed games awarded the
baseline a win after the harness applied a concession.

Results vary by deck. Expert won 7/8 Hanako mirrors and 6/8 Overwatch mirrors,
but only 2/8 Yorinobu mirrors and 1/8 RYB mirrors. The
[full report](bot-lab-report.json) contains every matchup and match record,
including manifest, strategy policies, seed, final hash, and schedule hash.

## Confirmed defect

Three exact seeded traces (schedule indexes 57, 88 and 105) reproduced their
recorded action counts and final state hashes. In both seats, Expert repeatedly
activated **Alt Cunningham: Soulkiller Architect**, then chose
`resolveEffectTarget { pass: true }`. The engine returned to the same position.
The match harness detected the loop and conceded for Expert. The existing
small optional-replay fixture, which uses a 160-node search, did not expose
these failures at the shipped 768-node setting.

The [complete index-57 trace](bot-lab-failure-trace.json) preserves the moves
and game logs. This benchmark identifies the defect; it does not repair it or
claim that every failure has the same cause. Sharp remains the default.

## Reproduce

From the repository root:

```sh
bun submodules/cyberpunk/reports/expert-oracle/bot-lab-benchmark.ts run /tmp/expert-bot-lab-2026-10-03
bun submodules/cyberpunk/reports/expert-oracle/bot-lab-benchmark.ts replay /tmp/expert-bot-lab-2026-10-03 57
```

Use an empty directory for a fresh run. The script stores and checks the plan,
runs six isolated processes, resumes completed matches, and writes `report.json`.
It never promotes a strategy. Match wall times measured under six concurrent
processes average 28.65 seconds; these are not per-decision UI latency numbers.

The complete schedule was checked for missing or reordered records. Three
normal games (indexes 0, 1 and 2) replayed with every recorded field equal,
including their terminal hashes. The policy mismatch rejection was also checked.
The adapter/evaluator test suites pass 11 tests, and the bot-lab source check
passes with no warnings or type errors. The adapter test now checks that every
authored deck has a mirror matchup, instead of assuming an old 12-deck pool.
