# @tcg/bot-lab

One deterministic interface for bot training, paired evaluation, replay, and promotion across
Lorcana, Cyberpunk, Gundam, One Piece, and Alpha Clash.

```sh
pnpm bot-lab doctor --game gundam
pnpm bot-lab train --game cyberpunk \
  --manifest submodules/agnostic-simulator/tools/bot-lab/examples/cyberpunk-train.json \
  --out /tmp/cyberpunk-candidate.json
pnpm bot-lab evaluate --game cyberpunk \
  --candidate /tmp/cyberpunk-candidate.json \
  --out /tmp/cyberpunk-report.json
pnpm bot-lab replay --game cyberpunk \
  --report /tmp/cyberpunk-report.json \
  --match 'test-mirror/block-0/a-seat-1'
pnpm bot-lab promote --game cyberpunk --report /tmp/cyberpunk-report.json --dry-run
```

`evaluate` always runs baseline and candidate together on strategy-independent seeds. It swaps
seats, applies the shared hard-failure taxonomy, and expands an inconclusive run in batches up to
the manifest cap. Public and oracle strategies cannot be compared for promotion.

`promote` refuses stale, internally inconsistent, test-only, or non-promotable reports. Production
promotion requires at least 200 paired blocks. Without `--dry-run`, it updates the game's canonical
`automation/promotions/current.json`; it never commits or pushes.

Full reports and replays belong in temporary or ignored artifact directories. The compact current
promotion record is the committed source of truth used by production registries.

## Cyberpunk decks

The Cyberpunk adapter evaluates over the authored archetype pool from
`submodules/cyberpunk/tools/ai-runner/src/authored-decks.ts`: fifteen hand-built
40-card decks (3 legends outside the main deck, 3-copy cap, per-color legend
RAM budget) resolved and validated against the real card catalog at
construction. Deck ids are prefixed `authored-`. Editing the pool changes
promotion pairings, and reports that reference removed deck ids can no longer
replay.

## Choombattler Expert reference

The Cyberpunk reference adapter executes Choombattler's original Expert worker
through its shipped message handler. It preserves the worker's search, weights,
reply model, deck reading, and tie breaking. The worker stays in an external local
fixture. Its SHA-256 is pinned in `src/adapters/cyberpunk-reference/runtime.ts`;
another worker build is rejected before execution.

Both players use Choombattler's native reducer. Our unchanged Expert chooser runs
through an `EngineHandle` adapter with every native legal action available. Both
descriptors allow hidden information. Adapter version 2 projects native modifiers,
static and aura effects, granted rules, cost changes, fight shields, delayed effects,
pending combat, and blocker redirects. Attack and Gig-steal flags come from native
events and stay isolated in search forks. Call flags and empty-Fixer turn starts are
preserved. Fight power and Go Solo costs use the native context and cost functions.
Public views use the native visibility function; full state is available only in the
oracle view.

This remains a diagnostic comparison: native actions become opaque choice options.
Generic delayed native effects retain their native keys unless the shared view has
a verified semantic equivalent. The adapter must start with native setup and retain
its event history; a raw midgame snapshot alone cannot recover past attack flags.
Results do not establish the strength of our production engine bot. Promotion is
disabled in this environment. Version 1 reports remain historical; replay requires
the recorded adapter and source hashes.

See the [adapter repair report](../../../cyberpunk/reports/expert-oracle/adapter-omissions-2026-10-07.md)
for focused tests and the same-seed reference comparison.

Run from `submodules/agnostic-simulator/tools/bot-lab`. Download the audited worker
and current public catalog outside the checkout:

```sh
fixture_dir=/tmp/choombattler-reference
mkdir -p "$fixture_dir"
curl --fail --location https://choombattler.com/assets/bot.worker-DCis42UZ.js \
  --output "$fixture_dir/worker.js"
curl --fail --location \
  'https://api.choombattler.com/trpc/cards.list?input=%7B%22json%22%3Anull%7D' \
  --output "$fixture_dir/catalog-response.json"
bun -e 'const r=await Bun.stdin.json(); const cards=Object.fromEntries(r.result.data.json.map(c=>[c.id,c.data])); console.log(JSON.stringify(cards));' \
  < "$fixture_dir/catalog-response.json" > "$fixture_dir/catalog.json"

reference_args=(--game cyberpunk --reference choombattler \
  --reference-worker "$fixture_dir/worker.js" \
  --reference-catalog "$fixture_dir/catalog.json")
bun src/cli.ts doctor "${reference_args[@]}"
bun src/cli.ts reference-manifest "${reference_args[@]}" \
  --suite reference:authored-ryb-low-cost-tempo \
  --out "$fixture_dir/candidate.json"
bun src/cli.ts evaluate "${reference_args[@]}" \
  --candidate "$fixture_dir/candidate.json" --out "$fixture_dir/report.json"
bun src/cli.ts replay "${reference_args[@]}" \
  --report "$fixture_dir/report.json" \
  --match authored-ryb-low-cost-tempo-mirror/block-0/a-seat-1
```

Omit `--suite` when generating the manifest to test all compatible authored decks
in mirrors, with both seats for each deck. The current catalog supports all 15.
Card joins use stable printing ids, then unique exact printed names; type, cost,
power, RAM, and sell eligibility must agree. Incompatible decks are excluded.
Each leg uses a recorded deterministic seed; swapped seats use separate seeds.
Keep the catalog fixture to reproduce a report. Replay rejects engine, adapter,
or catalog drift.

To run original-worker parity and adapter tests:

```sh
CHOOMBATTLER_REFERENCE_WORKER="$fixture_dir/worker.js" \
CHOOMBATTLER_REFERENCE_CATALOG="$fixture_dir/catalog.json" \
  vp test run src/adapters/cyberpunk-reference/reference.test.ts \
  src/adapters/cyberpunk-reference/projection.test.ts src/evaluate.test.ts
```

Without these fixture variables, tests that execute the external worker are
skipped. The worker hash rejection test still runs.

## Cyberpunk strategy gauntlet

The diagnostic gauntlet selects the top three local authored decks, compares
every distinct registered strategy plus the four AI-runner search strategies,
then checks the top three competitive strategies on fresh holdout seeds.

```sh
bun src/cli.ts gauntlet --game cyberpunk --workers 8 \
  --reference-worker /tmp/choombattler-reference/worker.js \
  --reference-catalog /tmp/choombattler-reference/catalog.json \
  --out /tmp/cyberpunk-gauntlet-2026-10-07
```

For a new mirror gauntlet on chosen decks, pass `--decks` and a fresh seed base.
This skips deck ranking and runs the same strategy screen, finalist holdout, and
reference phases. Deck ids must be unique authored decks. Use a fresh output
directory when the decks, seed base, or sources change.

```sh
bun src/cli.ts gauntlet --game cyberpunk --workers 8 \
  --decks authored-cyberpsychosis-deadman-burst-insurance,authored-yorinobu-two-units-for-one,authored-ryg-low-cost-value \
  --seed-base cyberpunk-other-decks-2026-10-07 \
  --reference-worker /tmp/choombattler-reference/worker.js \
  --reference-catalog /tmp/choombattler-reference/catalog.json \
  --out /tmp/cyberpunk-other-decks-2026-10-07
```

The phases are:

1. Rank all 15 authored decks with Sharp on both seats: every deck pair, two
   seeds, swapped seats (420 games). These are local benchmark rankings.
2. Use identical decks for both players on the top three decks: all 14 distinct
   strategies, two common seeds, swapped seats (1,092 games).
3. Take the top three competitive strategies into a fresh five-seed mirror
   holdout on each selected deck (90 games).
4. Run the exact Choombattler Expert versus our adapted Expert on its native
   engine, two seeds and both seats on each selected deck (12 games).

The `default` alias is recorded as Expert instead of counted twice. The six
test/control strategies compete in the screen, but their results do not select
the finalists. Monte Carlo uses the AI runner defaults (one rollout per action,
ten rollout steps). MCTS uses the shipped defaults (50 iterations, 200 rollout
steps). Other strategies keep their registered settings and information policy.
Expert has oracle information; the public strategies retain their public views.
This is a strategy diagnostic, not an equal-information promotion gate.

Shuffle seeds do not depend on strategy names. Each mirror block reuses its seed
after swapping the strategies' seats. Automation failures are excluded from valid
win scores and recorded separately; a strategy with its own failures cannot enter
the holdout. Source and catalog hashes guard resumable phase plans and results.
Re-run the same command and directory to resume. Each game has a numbered JSON
record; each phase has its plan and report, with a final summary at `report.json`.

The Choombattler scores stay separate from our native-engine scores because its
comparison has the adapter limits described above. The gauntlet does not change
the default, commit code, or promote a strategy.

## Alpha Clash

The `meta` suite preserves two published winning lists: Clarity Hyper Aggro
(50 main / 10 side) and The Absence from Makati (60 main / 15 side). It includes
both mirrors and the cross match; the shared scheduler swaps strategy seats
and deck assignments. Sideboards are stored and audited but are not used in
matches. Source links and exact quantities are in
`src/adapters/alpha-clash/decks.ts`.

```sh
pnpm bot-lab doctor --game alpha-clash
pnpm bot-lab train --game alpha-clash \
  --manifest submodules/agnostic-simulator/tools/bot-lab/examples/alpha-clash-calibration-plan.json \
  --out /tmp/alpha-clash-calibration.json
pnpm bot-lab evaluate --game alpha-clash \
  --candidate /tmp/alpha-clash-calibration.json \
  --out /tmp/alpha-clash-calibration-report.json
```

The default lab baseline is `meta-v1`. `meta-v2` plays cards and attaches
Weapons before attacks. `meta-v3` applies this order only to Contenders with
a Void replay ability. These policies resolve real choices, declare targets,
use counters and alternate costs, and check commands on an isolated state
copy before applying them to the match. The legacy `practice-v1` simulator
policy remains available.

Use `examples/alpha-clash-iteration-plan.json` to compare `meta-v3` with
`meta-v1`. Supported overrides are `playBeforeAttack`,
`playBeforeAttackWithVoidReplay`, `acceptOptionalTriggers`, and
`keepClashWeight` (0–20). `train` builds a
versioned candidate manifest; it does not run an optimizer. Engine, policy,
evaluation core, catalog, and deck changes invalidate manifests.

All Alpha Clash lab strategies are marked oracle and are not eligible for
production promotion. A report verdict of `promote` means the statistical
lab gate passed; it does not change the simulator's policy.

Admission rejects missing definitions and nested `kind: "unparsed"` behavior.
Both main decks and sideboards now pass. Matches use main decks only.
See [`../../docs/alpha-clash-bot-lab.md`](../../docs/alpha-clash-bot-lab.md)
for sources, rule coverage, saved results, and replay commands.

Run `pnpm audit:alpha-clash` for two traced main-deck games, independent cost
and damage checks, and frame-by-frame replay comparison. See the
[7 October audit](reports/alpha-clash/2026-10-07/log-audit/review.md) for repairs
and remaining rules limitations.

## One Piece suites

Adapter v2 uses ST01 plus the six mono-color automation archetypes from
`@tcg/op-engine` (`test-decks.ts`):

| suiteId      | Purpose                                                               |
| ------------ | --------------------------------------------------------------------- |
| `smoke`      | Fast multi-deck sanity (3 pairs)                                      |
| `promotion`  | Full mirror + cyclic cross matrix (14 pairs)                          |
| `tournament` | Fixed randomized cross pairings (7 pairs), Gundam-style holdout shape |

Example manifests: `examples/one-piece-smoke.json`,
`examples/one-piece-tournament-*.json`. Regenerate manifests after engine or
catalog changes so `engineRevision` / `cardCatalogHash` match `doctor`.

```sh
pnpm bot-lab doctor --game one-piece
pnpm bot-lab evaluate --game one-piece \
  --candidate submodules/agnostic-simulator/tools/bot-lab/examples/one-piece-tournament-heuristic-vs-value.json \
  --out /tmp/op-tournament-report.json
```
