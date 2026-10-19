# Season 3 ranking stability — 12 October 2026

1,280 scheduled native games across ten seed blocks per matchup: 36 matchup pairs, 1,120 cross-deck games, and 160 mirrors.
The source and catalog hashes match the first sweep. Its 128 records were retained, and 1,152 new games were executed on four independent native workers. All players use unchanged `meta-v1` oracle behavior and exact stored main decks; no sideboarding.

Terminations: {'rules-win': 1280}. Hard failures: 0. Rejected command proposals: 0.
First seat won 745/1280 (58.2%). Median game length: 11 turns and 251 accepted commands.

## Do the rankings hold?

Original top-three group retained: True. Retained using only the nine new blocks: True.
Spearman rank correlation with the first sweep: 0.988; nine new blocks only: 0.988. Tied win totals use average ranks.

Valen, Death, and War retain positions 1, 2, and 3 in aggregate, including the new-only comparison. Their individual seed-block positions vary. The paired intervals for Valen versus Death and Death versus War include zero, so the exact order within that leading group is not firmly resolved.
War leads fourth-place Kilimanjaro by 20.0 percentage points; the paired seed-block interval is 13.9 to 26.1 points. Kilimanjaro and Clarity–silou form the middle group. The four original tied positions resolve into Kilimanjaro fourth, Clarity–silou fifth, Hyper Aggro sixth, and undefendable seventh.
First-seat wins rise from 51.6% in the original sweep to 58.2% in the expanded sample. All rankings use exactly equal first- and second-seat exposure.

Mirrors are excluded. Every deck has 280 cross-deck games, split 140 per seat. The new-only column uses 252 games per deck.

| Deck | Rank: first → expanded | Wins / 280 | Expanded rate | New-only rate | 95% seed-block interval | Rank range by seed block |
|---|---:|---:|---:|---:|---:|---:|
| Valen — sloppy (Season 3 link) | 1 → 1 | 220 | 78.6% | 77.8% | 75.0%–82.1% | 1–3 |
| Death — silou (Season 3 link) | 2 → 2 | 210 | 75.0% | 74.6% | 71.4%–78.6% | 1–3 |
| War — xiii (Season 3 link) | 3 → 3 | 201 | 71.8% | 71.4% | 67.9%–75.4% | 1–3.5 |
| Kilimanjaro — avalogaming (Season 3 link) | 4.5 → 4 | 145 | 51.8% | 53.2% | 47.9%–55.7% | 4–5 |
| Clarity — silou (Season 3 link) | 4.5 → 5 | 136 | 48.6% | 49.6% | 44.3%–53.2% | 3.5–5 |
| Clarity Hyper Aggro | 6.5 → 6 | 81 | 28.9% | 28.6% | 25.4%–32.1% | 6–7.5 |
| Clarity — undefendable (Season 3 link) | 6.5 → 7 | 68 | 24.3% | 23.4% | 20.4%–28.2% | 6–8 |
| Clarity — fexar (Season 3 link) | 8 → 8 | 59 | 21.1% | 21.4% | 17.1%–25.4% | 6–8 |

## Uncertainty in adjacent ranking positions

Intervals below use paired differences from the same resampled seed blocks. A range that includes zero does not support a firm ordering of those two decks under this sample.

| Higher aggregate deck | Lower aggregate deck | Win-rate gap | 95% paired interval |
|---|---|---:|---:|
| Valen — sloppy (Season 3 link) | Death — silou (Season 3 link) | 3.6 pp | -2.1 to 8.6 pp |
| Death — silou (Season 3 link) | War — xiii (Season 3 link) | 3.2 pp | -1.4 to 8.2 pp |
| War — xiii (Season 3 link) | Kilimanjaro — avalogaming (Season 3 link) | 20.0 pp | 13.9 to 26.1 pp |
| Kilimanjaro — avalogaming (Season 3 link) | Clarity — silou (Season 3 link) | 3.2 pp | -2.1 to 8.6 pp |
| Clarity — silou (Season 3 link) | Clarity Hyper Aggro | 19.6 pp | 13.6 to 26.1 pp |
| Clarity Hyper Aggro | Clarity — undefendable (Season 3 link) | 4.6 pp | -1.4 to 10.0 pp |
| Clarity — undefendable (Season 3 link) | Clarity — fexar (Season 3 link) | 3.2 pp | -3.9 to 9.6 pp |

## Seed-block results

Cells are cross-deck wins out of 28 within each complete seed block. Block 0 is the initial run.

| Deck | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Valen — sloppy (Season 3 link) | 24 | 20 | 21 | 19 | 24 | 23 | 21 | 23 | 22 | 23 |
| Death — silou (Season 3 link) | 22 | 19 | 22 | 22 | 21 | 22 | 24 | 20 | 19 | 19 |
| War — xiii (Season 3 link) | 21 | 22 | 18 | 22 | 20 | 17 | 22 | 21 | 19 | 19 |
| Kilimanjaro — avalogaming (Season 3 link) | 11 | 16 | 15 | 14 | 14 | 14 | 13 | 15 | 18 | 15 |
| Clarity — silou (Season 3 link) | 11 | 13 | 18 | 16 | 13 | 13 | 14 | 14 | 13 | 11 |
| Clarity Hyper Aggro | 9 | 7 | 7 | 8 | 5 | 11 | 9 | 8 | 8 | 9 |
| Clarity — undefendable (Season 3 link) | 9 | 6 | 6 | 3 | 10 | 7 | 6 | 6 | 8 | 7 |
| Clarity — fexar (Season 3 link) | 5 | 9 | 5 | 8 | 5 | 5 | 3 | 5 | 5 | 9 |

## Seat effects

| Deck | First seat wins / 140 | Second seat wins / 140 |
|---|---:|---:|
| Valen — sloppy (Season 3 link) | 121 | 99 |
| Death — silou (Season 3 link) | 110 | 100 |
| War — xiii (Season 3 link) | 115 | 86 |
| Kilimanjaro — avalogaming (Season 3 link) | 82 | 63 |
| Clarity — silou (Season 3 link) | 81 | 55 |
| Clarity Hyper Aggro | 50 | 31 |
| Clarity — undefendable (Season 3 link) | 41 | 27 |
| Clarity — fexar (Season 3 link) | 45 | 14 |

## Matchup matrix

Cells are row-deck wins out of 40 cross games; each seat has 20 games.

| Deck | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Clarity Hyper Aggro | — | 19/40 | 27/40 | 7/40 | 2/40 | 5/40 | 11/40 | 10/40 |
| 2. Clarity — undefendable (Season 3 link) | 21/40 | — | 22/40 | 2/40 | 1/40 | 5/40 | 9/40 | 8/40 |
| 3. Clarity — fexar (Season 3 link) | 13/40 | 18/40 | — | 6/40 | 1/40 | 7/40 | 7/40 | 7/40 |
| 4. War — xiii (Season 3 link) | 33/40 | 38/40 | 34/40 | — | 21/40 | 13/40 | 35/40 | 27/40 |
| 5. Valen — sloppy (Season 3 link) | 38/40 | 39/40 | 39/40 | 19/40 | — | 24/40 | 29/40 | 32/40 |
| 6. Death — silou (Season 3 link) | 35/40 | 35/40 | 33/40 | 27/40 | 16/40 | — | 33/40 | 31/40 |
| 7. Clarity — silou (Season 3 link) | 29/40 | 31/40 | 33/40 | 5/40 | 11/40 | 7/40 | — | 20/40 |
| 8. Kilimanjaro — avalogaming (Season 3 link) | 30/40 | 32/40 | 33/40 | 13/40 | 8/40 | 9/40 | 20/40 | — |

## Method and limits

20,000 paired bootstrap resamples of ten complete seed blocks; 95% percentile intervals; fixed random seed 20261012. Mirrors excluded from rankings. Original block retained; separate nine-block holdout comparison also reported.
These intervals describe variation under this fixed bot, matchup weighting, and seed scheme. They do not establish tournament or human-player deck strength. Decks differ in how well the shared heuristic uses their cards. Construction-invalid lists are allowed for this casual experiment.
Some source links changed after Season 3. These stored snapshots are not certified historical tournament submissions. Native completion is not proof of every card rule, browser prompts, hosted transport, persistence, or deployment.
Evaluator verdict: `reject` (maximum paired block count reached without proof). This is a strategy-promotion gate, not a ranking-stability or suite-completion verdict. No strategy or default was changed.

## Evidence and reproduction

[Manifest](manifest.json), [schedule](schedule.json.gz), [full report](report.json.gz), [analysis](analysis.json), [metadata](run-metadata.json), [decks](decks.json), and [combined match journal](matches.jsonl.gz). Each worker also has a native match journal and source metadata.
From `tools/bot-lab`, run `bun reports/alpha-clash/2026-10-12/season3-seeds/run-seeds.ts`, then `python3 reports/alpha-clash/2026-10-12/season3-seeds/review-seeds.py`. Journals allow the runner to resume completed native records. The standard evaluator builds the final report from those records; it does not fabricate or simulate cached outcomes.

## Replay checks

10/10 sampled complete match-record replays matched. One final-block mirror per deck, shortest and longest new games, and all abnormal new terminations. Exact match-record comparisons; not every game or frame.
[Replay evidence](replay-checks.json).
