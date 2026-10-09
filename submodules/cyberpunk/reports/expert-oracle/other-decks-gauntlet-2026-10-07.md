# Cyberpunk mirror gauntlet on other decks — 2026-10-07

All **1,194** scheduled games finished. **45** invalid games are excluded from win scores. Expert (full information) has the highest measured finalist score on these decks: **35–25 (58.3%)**. The sample does not establish a strict strength advantage over both finalists.

## Method

The user selected the next three decks from the previous local deck ranking. The earlier top three were not reused. Both players use an identical deck within every game. Strategies reuse common shuffle seeds, and every comparison swaps seats. No weights, game rules, or production defaults were changed.

- Cyberpsychosis + Deadman — Burst with Insurance: `authored-cyberpsychosis-deadman-burst-insurance`.
- Yorinobu — Two Units for the Price of One: `authored-yorinobu-two-units-for-one`.
- Red/Yellow/Green — Low-Cost Value: `authored-ryg-low-cost-value`.

Deck selection was explicit; the 420-game ranking phase was skipped.

| Phase | Games | Method |
| --- | ---: | --- |
| Strategy screen | 1,092 | All 14 strategies, 2 seeds per deck, both seats |
| Finalists | 90 | Top 3 eligible competitive strategies, 5 fresh seeds per deck, both seats |
| Choombattler reference | 12 | Adapted Expert against original Expert, adapter v2, 2 seeds per deck, both seats |

Expert keeps oracle information. Public strategies keep their public views. Monte Carlo uses 1 rollout per action and 10 rollout steps; MCTS uses 50 iterations and 200 rollout steps. The default alias counts once as Expert. Six controls participate in the screen but do not select finalists. A strategy with its own failure in competitive games cannot become a finalist.

## Native strategy screen

Competitive scores include only the eight competitive strategies. Each was scheduled for 84 competitive games, or 156 games including controls. Invalid games are removed from both players' scores, so valid-game counts can differ.

| Strategy | Wins–losses–draws | Valid/scheduled | Score | Own failures | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Expert (full information) | 73–9 | 82/84 | 89.0% | 0 | Eligible |
| Sharp | 56–24 | 80/84 | 70.0% | 0 | Eligible |
| Masterful | 56–24 | 80/84 | 70.0% | 0 | Eligible |
| monte-carlo-greedy | 43–29 | 72/84 | 59.7% | 0 | Eligible |
| Greedy | 42–37 | 79/84 | 53.2% | 0 | Eligible |
| monte-carlo | 15–65 | 80/84 | 18.8% | 0 | Eligible |
| mcts | 8–50 | 58/84 | 13.8% | 22 | Excluded |
| mcts-greedy | 5–60 | 65/84 | 7.7% | 16 | Excluded |

All-screen failures, including controls: mcts-greedy 19; mcts 26. Failure reasons: illegal 45.

The MCTS-Greedy failure in screen game 219 repeated exactly in a separate run, with the same final-state and action-trace hashes. It tried to attach Gear without enough Eddies (`INSUFFICIENT_EDDIES`). The raw replay includes the move and public game log.

## Fresh-seed finalists

Each finalist was scheduled for 60 games, with 20 per deck.

| Strategy | Wins–losses–draws | Valid/scheduled | Score |
| --- | ---: | ---: | ---: |
| Expert (full information) | 35–25 | 60/60 | 58.3% |
| Sharp | 28–32 | 60/60 | 46.7% |
| Masterful | 27–33 | 60/60 | 45.0% |

| Deck | Expert (full information) | Sharp | Masterful |
| --- | ---: | ---: | ---: |
| Cyberpsychosis + Deadman — Burst with Insurance | 8–12 | 11–9 | 11–9 |
| Yorinobu — Two Units for the Price of One | 12–8 | 9–11 | 9–11 |
| Red/Yellow/Green — Low-Cost Value | 15–5 | 8–12 | 7–13 |

Head-to-head intervals resample whole valid mirrored blocks (4,000 samples, 95%). Each pair has 15 scheduled deck/seed blocks. Only complete valid blocks enter the intervals. The estimates apply to these decks and shipped information policies.

| First strategy | Second strategy | First wins–second wins | Complete valid blocks | First win-rate interval |
| --- | --- | ---: | ---: | ---: |
| Expert (full information) | Sharp | 18–12 | 15 | 43.3%–76.7% |
| Expert (full information) | Masterful | 17–13 | 15 | 40.0%–73.3% |
| Sharp | Masterful | 16–14 | 15 | 50.0%–60.0% |

## Original Choombattler reference

These results use Choombattler's native reducer with the original worker and our unchanged chooser through repaired adapter v2. They are separate from our native strategy ranking. Native actions still use generic choice prompts.

| Strategy | Wins–losses–draws | Valid/scheduled | Score |
| --- | ---: | ---: | ---: |
| Original Choombattler Expert | 11–1 | 12/12 | 91.7% |
| Expert (full information) | 1–11 | 12/12 | 8.3% |

| Deck | Our adapted Expert | Original Expert |
| --- | ---: | ---: |
| Cyberpsychosis + Deadman — Burst with Insurance | 1–3 | 3–1 |
| Yorinobu — Two Units for the Price of One | 0–4 | 4–0 |
| Red/Yellow/Green — Low-Cost Value | 0–4 | 4–0 |

## Controls

Screen results against all opponents. These do not select finalists.

| Strategy | Wins–losses–draws | Valid/scheduled | Score |
| --- | ---: | ---: | ---: |
| First legal | 102–48 | 150/156 | 68.0% |
| Random | 64–91 | 155/156 | 41.3% |
| Always attack | 24–132 | 156/156 | 15.4% |
| Attack unit only | 24–132 | 156/156 | 15.4% |
| Only passes | 24–132 | 156/156 | 15.4% |
| Call legend only | 1–155 | 156/156 | 0.6% |

## Evidence

| Phase | Source/catalog provenance | Schedule hash |
| --- | --- | --- |
| strategy-screen | `fnv1a32:8c87d7dd` | `fnv1a32:0c9374f5` |
| finalists | `fnv1a32:8c87d7dd` | `fnv1a32:f2cc3b2b` |
| choombattler-reference | `fnv1a32:14f669e7` | `fnv1a32:d69b1697` |

- [Machine-readable standings and analysis](other-decks-gauntlet-2026-10-07.json).
- [Earlier gauntlet on the first three decks](gauntlet-2026-10-07.md).
- [Adapter v2 repair and validation](adapter-omissions-2026-10-07.md).
- Raw plans, per-game records, and phase reports: `/tmp/cyberpunk-other-decks-2026-10-07-v1`.
- Seed base: `cyberpunk-other-decks-2026-10-07-v1`.
- Adapter: `choombattler-reference-2`; revision: `fnv1a32:13c0e6d4`.
- Original worker SHA-256: `c834449c4463db4aa01e4ceaaa3de59afd460db90f0379a723b78a995369fa40`.

27 focused tests and CLI source lint/type checks passed before execution. Source drift checks passed at every phase and at completion. These are local benchmark results; this run did not promote a strategy.
