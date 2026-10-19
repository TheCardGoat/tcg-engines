# Season 3 bot-lab review — 12 October 2026

Completed 128 games: 36 paired matchup blocks, including 16 mirrors and 112 cross-deck games.
Both players used the unchanged `meta-v1` oracle heuristic. All eight exact source snapshots were used; sideboards were excluded.

Terminations: {'rules-win': 128}. Rejected command proposals: 0. Hard failures: 0.
First seat won 66/128 games (51.6%). The runner starts player one.
Median game length: 11 turns and 254.5 accepted commands. Ranges: 7–16 turns, 146–473 commands.

## Cross-deck results

Mirror games are excluded. Each deck played 28 cross-deck games, 14 from each seat.

| Deck | Wins–losses | Win rate | First seat | Second seat |
|---|---:|---:|---:|---:|
| Valen — sloppy (Season 3 link) | 24–4 | 85.7% | 12/14 | 12/14 |
| Death — silou (Season 3 link) | 22–6 | 78.6% | 11/14 | 11/14 |
| War — xiii (Season 3 link) | 21–7 | 75.0% | 12/14 | 9/14 |
| Clarity — silou (Season 3 link) | 11–17 | 39.3% | 7/14 | 4/14 |
| Kilimanjaro — avalogaming (Season 3 link) | 11–17 | 39.3% | 4/14 | 7/14 |
| Clarity Hyper Aggro | 9–19 | 32.1% | 3/14 | 6/14 |
| Clarity — undefendable (Season 3 link) | 9–19 | 32.1% | 8/14 | 1/14 |
| Clarity — fexar (Season 3 link) | 5–23 | 17.9% | 4/14 | 1/14 |

## Findings

The leading deck is Valen — sloppy (Season 3 link) at 24/28; Death — silou (Season 3 link) follows at 22/28, then War — xiii (Season 3 link) at 21/28.
Valen and Death split their direct matchup 2–2. War went 1–3 against Valen and 2–2 against Death. These small cells do not establish a stable matchup advantage.
The largest seat difference is Clarity — undefendable (Season 3 link): 8/14 wins from first seat versus 1/14 from second seat. More seed blocks are needed before interpreting that difference.
Kilimanjaro completed every scheduled game with its original construction-invalid list. No runtime exception, stalled game, unsupported prompt, or rejected command was observed in this sweep.
The next useful comparison is a larger seed sample or a different supported heuristic on the same exact deck snapshots. The present run does not identify which individual card decisions caused the deck ranking.

## Matchup matrix

Cells are row-deck wins out of four cross-deck games. Each seat occurs twice per cell.

| Deck | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Clarity Hyper Aggro | — | 1/4 | 4/4 | 0/4 | 1/4 | 0/4 | 1/4 | 2/4 |
| 2. Clarity — undefendable (Season 3 link) | 3/4 | — | 2/4 | 0/4 | 0/4 | 1/4 | 2/4 | 1/4 |
| 3. Clarity — fexar (Season 3 link) | 0/4 | 2/4 | — | 1/4 | 0/4 | 0/4 | 1/4 | 1/4 |
| 4. War — xiii (Season 3 link) | 4/4 | 4/4 | 3/4 | — | 1/4 | 2/4 | 3/4 | 4/4 |
| 5. Valen — sloppy (Season 3 link) | 3/4 | 4/4 | 4/4 | 3/4 | — | 2/4 | 4/4 | 4/4 |
| 6. Death — silou (Season 3 link) | 4/4 | 3/4 | 4/4 | 2/4 | 2/4 | — | 4/4 | 3/4 |
| 7. Clarity — silou (Season 3 link) | 3/4 | 2/4 | 3/4 | 1/4 | 0/4 | 0/4 | — | 2/4 |
| 8. Kilimanjaro — avalogaming (Season 3 link) | 2/4 | 3/4 | 3/4 | 0/4 | 0/4 | 1/4 | 2/4 | — |

## Interpretation and limits

These are bot-policy results from one full paired sweep, not tournament deck-strength estimates. Each cross matchup has only four games. Decks share one heuristic and may differ in how well that heuristic uses their cards.
The source lists are dated snapshots. Some linked pages changed after Season 3; the stored lists do not certify historical tournament submissions. Casual execution intentionally permits construction-invalid lists, including Kilimanjaro with two Endless Cycle cards.
The evaluator verdict is `reject`: maximum paired block count reached without proof. This is a strategy-promotion gate, not a suite-completion verdict. Comparing `meta-v1` with itself does not test an improved strategy. No promotion or default change was made.
Local native-engine results do not prove browser prompts, hosted transport, persistence, or deployment.

## Evidence and reproduction

- [Manifest](manifest.json), [full canonical report](report.json.gz), [deck snapshots](decks.json), [analysis](analysis.json), [match journal](matches.jsonl.gz), and [run metadata](run-metadata.json).
- Run `bun reports/alpha-clash/2026-10-12/season3-suite/run-suite.ts` from `tools/bot-lab` with the recorded source revision.
- The script uses the standard `evaluateCandidate` evaluator, with progress journaling only. Run `python3 reports/alpha-clash/2026-10-12/season3-suite/review-suite.py` to regenerate this review.

## Replay samples

9/9 sampled replays exactly reproduce their complete match records. One mirror per deck, shortest and longest games, and all abnormal terminations; exact match-record comparisons, not every frame or every suite game.
See [replay checks](replay-checks.json). Run `bun reports/alpha-clash/2026-10-12/season3-suite/replay-samples.ts` to reproduce them.
