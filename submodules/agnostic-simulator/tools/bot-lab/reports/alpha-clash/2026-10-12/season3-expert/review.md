# Alpha Clash Expert versus meta-v1 — Season 3

Expert won **332/384 valid games (86.5%)**. The 95% paired-block bootstrap interval is **83.2%–89.6%**.

All 384 scheduled games: {'rules-win': 384}. Hard failures: 0. Rejected committed proposals: 0.

Mirrors: Expert won 37/48. Cross-deck games: 295/336.

## Results by deck piloted by Expert

| Deck | Expert wins | Win rate | Mirror wins | First seat | Second seat |
|---|---:|---:|---:|---:|---:|
| Clarity Hyper Aggro | 42/48 | 87.5% | 6/6 | 22/24 | 20/24 |
| Clarity — undefendable (Season 3 link) | 45/48 | 93.8% | 5/6 | 22/24 | 23/24 |
| Clarity — fexar (Season 3 link) | 44/48 | 91.7% | 6/6 | 24/24 | 20/24 |
| War — xiii (Season 3 link) | 41/48 | 85.4% | 2/6 | 22/24 | 19/24 |
| Valen — sloppy (Season 3 link) | 40/48 | 83.3% | 3/6 | 22/24 | 18/24 |
| Death — silou (Season 3 link) | 39/48 | 81.2% | 5/6 | 19/24 | 20/24 |
| Clarity — silou (Season 3 link) | 42/48 | 87.5% | 6/6 | 22/24 | 20/24 |
| Kilimanjaro — avalogaming (Season 3 link) | 39/48 | 81.2% | 4/6 | 21/24 | 18/24 |

These are bot-comparison results. Each row measures Expert while piloting that deck against meta-v1 across the fixed opponent field. They are not a new ranking of human tournament deck strength.

## Full matchup matrix

Rows are Expert decks; columns are meta-v1 decks. Each cell has six games, including three with Expert in each seat.

| Expert deck | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Clarity Hyper Aggro | 6/6 | 6/6 | 6/6 | 4/6 | 4/6 | 5/6 | 6/6 | 5/6 |
| 2. Clarity — undefendable (Season 3 link) | 6/6 | 5/6 | 6/6 | 6/6 | 5/6 | 6/6 | 5/6 | 6/6 |
| 3. Clarity — fexar (Season 3 link) | 6/6 | 6/6 | 6/6 | 5/6 | 4/6 | 5/6 | 6/6 | 6/6 |
| 4. War — xiii (Season 3 link) | 6/6 | 6/6 | 6/6 | 2/6 | 4/6 | 6/6 | 5/6 | 6/6 |
| 5. Valen — sloppy (Season 3 link) | 6/6 | 6/6 | 6/6 | 5/6 | 3/6 | 5/6 | 4/6 | 5/6 |
| 6. Death — silou (Season 3 link) | 5/6 | 5/6 | 6/6 | 4/6 | 3/6 | 5/6 | 5/6 | 6/6 |
| 7. Clarity — silou (Season 3 link) | 6/6 | 6/6 | 6/6 | 5/6 | 3/6 | 5/6 | 6/6 | 5/6 |
| 8. Kilimanjaro — avalogaming (Season 3 link) | 6/6 | 6/6 | 5/6 | 4/6 | 5/6 | 4/6 | 5/6 | 4/6 |

## Seed blocks

| Block | Expert wins | Win rate |
|---|---:|---:|
| 0 | 111/128 | 86.7% |
| 1 | 112/128 | 87.5% |
| 2 | 109/128 | 85.2% |

## Implementation and method

- Engine-owned oracle planner; full hands, deck order, face-down identities and native RNG state are available by design. Player projections remain filtered.
- Search settings: 768 native command attempts, beam width 5, depth 12, four reply lines. Each state probes at most 96 proposals and retains up to 24 distinct accepted outcomes; combinatorial choices are bounded.
- Native forks execute the same commands as live play. Search compares board value, health, resources, hand quality, known upcoming draws, attack sequences, responses, costs, and targets. Forced continuations and per-turn live cycle history prevent repeated no-progress decisions.
- 36 matchups: eight mirrors and 28 cross-deck pairs. Three fresh seed blocks per pair; 384 games and 108 paired matchup blocks. All games use the final frozen source revision. No historical games reused.
- Adapter v4 removes the final `-seat-1`/`-seat-2` seed suffix before native shuffling. Each controller swap therefore uses the same physical deck assignment and shuffle. Cross matches also reverse the deck assignment.
- Both policies use oracle information. meta-v1 decision rules are unchanged. Exact stored main decks are used, with no sideboarding and with construction-invalid casual lists admitted.
- 20,000 deterministic bootstrap resamples of complete paired matchup blocks. This estimates uncertainty under this fixed bot/deck/seed scheme. Only three seed blocks per matchup were tested; individual six-game cells remain small samples.

## Search diagnostics

- Expert decisions: 45,944; simulated command attempts: 11,740,857; mean attempts per decision: 255.5.
- Maximum attempts in one decision: 768; detected cycle branches avoided: 0.
- Median game length: 10.0 turns, 234.5 accepted commands.

## Promotion and limits

Standard evaluator verdict: **promote**. Reasons: practical and statistical promotion gates passed.
The standard gate weights matchup blocks equally, while the headline rate counts games. Its confidence interval is in win-rate improvement over 50%, so it can differ from the headline interval.
Expert is selectable in local practice. The recommended strategy remains meta-v1. No default, deployment, matchmaking validation policy, or production promotion target was changed.
The search is bounded and can miss strong lines or card-specific plans. Opening hands keep the existing keep policy. Native completion does not prove every card rule, browser interaction, hosted transport, or deployment.

## Evidence and reproduction

[Manifest](manifest.json), [schedule](schedule.json.gz), [report](report.json.gz), [analysis](analysis.json), [matches](matches.jsonl.gz), [decks](decks.json.gz), [run metadata](run-metadata.json), and [replay checks](replay-checks.json).

From `submodules/agnostic-simulator/tools/bot-lab`: `bun reports/alpha-clash/2026-10-12/season3-expert/run.ts`, then `python3 reports/alpha-clash/2026-10-12/season3-expert/review.py`. The runner resumes native journals and rejects source/catalog drift. Replay with `bun reports/alpha-clash/2026-10-12/season3-expert/replay.ts`.

## Findings and follow-up

- The aggregate gain holds across all three seed blocks: 111/128, 112/128, and 109/128 Expert wins.
- Expert wins 37/48 mirror games (77.1%). This removes the difference in deck selection from those comparisons.
- War is the main weak spot: 2/6 mirror wins, including 0/3 from the second seat. Valen is tied at 3/6. These small samples identify cases to inspect; they do not establish the cause of the losses.
- Before changing weights, inspect the War mirror losses and the Valen mirrors, then test any adjustment with new seed blocks. Keep these results as the v1 baseline.

## Focused validation

- 68 focused tests passed: nine Expert engine tests, 38 adapter/deck tests, and 21 bot-lab tests.
- Engine and adapter type checks, focused bot-lab type checks, automation lint, and whitespace checks passed.
- Tactical tests cover lethal action order, private Counter information, multiple obstructors, resource colors, target combinations, Manifest, search isolation, and cycle handling.
- The complete suite has zero failed terminations or rejected committed commands. Rejected speculative search branches are expected and are separate from committed commands.

## Replay verification

10/10 sampled complete match records reproduced exactly. Samples cover all eight mirror decks plus the shortest and longest games, with duplicate samples removed.
