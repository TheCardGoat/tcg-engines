# Alpha Clash Expert v2 versus meta-v1 — Season 3

Expert won **347/384 valid games (90.4%)**. The 95% paired-block bootstrap interval is **87.6%–93.0%**.

All 384 scheduled games: {'rules-win': 384}. Hard failures: 0. Rejected committed proposals: 0.

Mirrors: Expert won 39/48. Cross-deck games: 308/336.

## Results by deck piloted by Expert

| Deck | Expert wins | Win rate | Mirror wins | First seat | Second seat |
|---|---:|---:|---:|---:|---:|
| Clarity Hyper Aggro | 42/48 | 87.5% | 5/6 | 23/24 | 19/24 |
| Clarity — undefendable (Season 3 link) | 45/48 | 93.8% | 6/6 | 23/24 | 22/24 |
| Clarity — fexar (Season 3 link) | 45/48 | 93.8% | 6/6 | 24/24 | 21/24 |
| War — xiii (Season 3 link) | 45/48 | 93.8% | 4/6 | 24/24 | 21/24 |
| Valen — sloppy (Season 3 link) | 42/48 | 87.5% | 3/6 | 21/24 | 21/24 |
| Death — silou (Season 3 link) | 45/48 | 93.8% | 5/6 | 23/24 | 22/24 |
| Clarity — silou (Season 3 link) | 45/48 | 93.8% | 6/6 | 22/24 | 23/24 |
| Kilimanjaro — avalogaming (Season 3 link) | 38/48 | 79.2% | 4/6 | 20/24 | 18/24 |

These are bot-comparison results. Each row measures Expert while piloting that deck against meta-v1 across the fixed opponent field. They are not a new ranking of human tournament deck strength.

## Full matchup matrix

Rows are Expert decks; columns are meta-v1 decks. Each cell has six games, including three with Expert in each seat.

| Expert deck | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Clarity Hyper Aggro | 5/6 | 6/6 | 6/6 | 4/6 | 3/6 | 6/6 | 6/6 | 6/6 |
| 2. Clarity — undefendable (Season 3 link) | 6/6 | 6/6 | 6/6 | 5/6 | 5/6 | 6/6 | 5/6 | 6/6 |
| 3. Clarity — fexar (Season 3 link) | 6/6 | 6/6 | 6/6 | 4/6 | 6/6 | 5/6 | 6/6 | 6/6 |
| 4. War — xiii (Season 3 link) | 6/6 | 5/6 | 6/6 | 4/6 | 6/6 | 6/6 | 6/6 | 6/6 |
| 5. Valen — sloppy (Season 3 link) | 6/6 | 6/6 | 6/6 | 5/6 | 3/6 | 5/6 | 5/6 | 6/6 |
| 6. Death — silou (Season 3 link) | 6/6 | 5/6 | 6/6 | 5/6 | 6/6 | 5/6 | 6/6 | 6/6 |
| 7. Clarity — silou (Season 3 link) | 6/6 | 6/6 | 6/6 | 3/6 | 6/6 | 6/6 | 6/6 | 6/6 |
| 8. Kilimanjaro — avalogaming (Season 3 link) | 5/6 | 5/6 | 6/6 | 5/6 | 3/6 | 5/6 | 5/6 | 4/6 |

## Seed blocks

| Block | Expert wins | Win rate |
|---|---:|---:|
| 0 | 118/128 | 92.2% |
| 1 | 116/128 | 90.6% |
| 2 | 113/128 | 88.3% |

## Implementation and method

- Engine-owned oracle planner; full hands, deck order, face-down identities and native RNG state are available by design. Player projections remain filtered.
- Search settings: 768 native command attempts, beam width 5, depth 12, four reply lines. Each state probes at most 96 proposals and retains up to 24 distinct accepted outcomes; combinatorial choices are bounded.
- Version 2 filters impossible timing/source-zone proposals, resumes partial probe caches, distributes candidates across attackers, resolves next-turn effects, and values early resources. See [loss investigation](investigation/review.md).
- Native forks execute the same commands as live play. Search compares board value, health, resources, hand quality, known upcoming draws, attack sequences, responses, costs, and targets. Forced continuations and per-turn live cycle history prevent repeated no-progress decisions.
- Fresh seed base: `alpha-clash-expert-v2-season3-holdout`.
- 36 matchups: eight mirrors and 28 cross-deck pairs. Three fresh seed blocks per pair; 384 games and 108 paired matchup blocks. All games use the final frozen source revision. No historical games reused.
- Adapter v4 removes the final `-seat-1`/`-seat-2` seed suffix before native shuffling. Each controller swap therefore uses the same physical deck assignment and shuffle. Cross matches also reverse the deck assignment.
- Both policies use oracle information. meta-v1 decision rules are unchanged. Exact stored main decks are used, with no sideboarding and with construction-invalid casual lists admitted.
- 20,000 deterministic bootstrap resamples of complete paired matchup blocks. This estimates uncertainty under this fixed bot/deck/seed scheme. Only three seed blocks per matchup were tested; individual six-game cells remain small samples.

## Search diagnostics

- Expert decisions: 43,617; simulated command attempts: 11,712,976; mean attempts per decision: 268.5.
- Maximum attempts in one decision: 768; detected cycle branches avoided: 0.
- Median game length: 10.0 turns, 220.0 accepted commands.

## Promotion and limits

Standard evaluator verdict: **promote**. Reasons: practical and statistical promotion gates passed.
The standard gate weights matchup blocks equally, while the headline rate counts games. Its confidence interval is in win-rate improvement over 50%, so it can differ from the headline interval.
Expert is selectable in local practice. The recommended strategy remains meta-v1. No default, deployment, matchmaking validation policy, or production promotion target was changed.
The search is bounded and can miss strong lines or card-specific plans. Opening hands keep the existing keep policy. Native completion does not prove every card rule, browser interaction, hosted transport, or deployment.

## Evidence and reproduction

[Manifest](manifest.json), [schedule](schedule.json.gz), [report](report.json.gz), [analysis](analysis.json), [matches](matches.jsonl.gz), [decks](decks.json.gz), [run metadata](run-metadata.json), and [replay checks](replay-checks.json).

From `submodules/agnostic-simulator/tools/bot-lab`: `bun reports/alpha-clash/2026-10-12/season3-expert-v2/run.ts`, then `python3 reports/alpha-clash/2026-10-12/season3-expert-v2/review.py`. The runner resumes native journals and rejects source/catalog drift. Replay with `bun reports/alpha-clash/2026-10-12/season3-expert-v2/replay.ts`.

## Archived v1 controls on the same fresh mirrors

v1 won **36/48**; v2 won **39/48**. v2 changed 7 losses to wins and 4 wins to losses. The paired-block bootstrap interval for the win-rate difference is -8.3% to +20.8%.

| Deck | Archived v1 | Expert v2 |
|---|---:|---:|
| Clarity Hyper Aggro | 5/6 | 5/6 |
| Clarity — undefendable (Season 3 link) | 5/6 | 6/6 |
| Clarity — fexar (Season 3 link) | 6/6 | 6/6 |
| War — xiii (Season 3 link) | 5/6 | 4/6 |
| Valen — sloppy (Season 3 link) | 3/6 | 3/6 |
| Death — silou (Season 3 link) | 1/6 | 5/6 |
| Clarity — silou (Season 3 link) | 5/6 | 6/6 |
| Kilimanjaro — avalogaming (Season 3 link) | 6/6 | 4/6 |

The aggregate mirror interval includes zero, so this sample does not establish a clear overall mirror improvement.

These controls compare the two planners against meta-v1 with identical decks, shuffle seeds, and seats. Each individual deck still has only six mirror games. The old 332/384 headline used different seeds and is historical context, not a matched estimate of improvement.

[Control records](controls-v1.json.gz), [War archived-policy replay proof](controls-v1-proof-0.json), and [Valen archived-policy replay proof](controls-v1-proof-1.json).

## Additional fresh War and Valen mirrors

The first fresh War sample was 4/6 for v2 versus 5/6 for v1. This prompted a fixed additional check of ten new seed blocks for each named deck, with no code or weight changes. The 80 supplemental games are separate from the original 384-game suite and its promotion gate.

| Deck | Archived v1 | Expert v2 | Losses turned into wins | Wins turned into losses |
|---|---:|---:|---:|---:|
| War — xiii (Season 3 link) | 15/20 | 18/20 | 4 | 1 |
| Valen — sloppy (Season 3 link) | 11/20 | 13/20 | 3 | 1 |

[Fixed supplemental plan](confirm-plan.json.gz) and [all supplemental records](confirm-report.json.gz). Each version uses the same decks, seeds, and seats against meta-v1. No tuning used these results.

## Focused validation

All 512 evaluation, control, and supplemental games ended normally, with zero rejected committed commands and a maximum of 768 search attempts per decision. See [validation summary](validation-summary.json).

71 focused tests passed: 12 engine, 38 adapter/deck, and 21 bot-lab. Engine and adapter type checks, focused bot-lab type checks, automation lint, and whitespace checks passed. The three new regressions replay accepted native commands from setup to the original bad positions.

[Investigation, confirmed causes, changes, and development results](investigation/review.md).

## Replay verification

10/10 sampled complete match records reproduced exactly. Samples cover all eight mirror decks plus the shortest and longest games, with duplicate samples removed.

## PR publication check

The PR is based on `a8d37bf911` and preserves the benchmark manifest and its original source hash. Current main includes the card database and deck-builder integration, and the commit formatter changes source text. The [publication source record](publication-source.json) identifies both revisions. All ten original complete match records reproduced exactly against the scoped PR source, including diagnostics: [publication replay checks](publication-replay-checks.json). This verifies those samples after integration; the full 512-game run remains evidence from its recorded revision.

The 1,124 focused tests passed in the clean publication worktree: 1,006 engine/card tests, 54 importer tests, 38 adapter/deck tests, 21 lab tests, and five local-practice setup tests. Catalog, manifest, authoring, engine and adapter type checks passed. The staged formatting, lint, and type gate passed.

Large generated records and traces are compressed in Git. Run the TypeScript scripts to unpack them automatically. The Python review scripts unpack their required record files.
