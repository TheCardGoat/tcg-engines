# Cyberpunk mirror gauntlet after MCTS repair — 2026-10-07

All **1,194** scheduled games finished. **0** invalid games are excluded from win scores. Expert (full information) has the highest measured finalist score on these decks: **43–17 (71.7%)**. The paired holdout intervals support its lead over both finalists in this sample.

## Method

This rerun uses the same three decks as the previous other-decks gauntlet, with fresh seeds and repaired automation revision v15. Source commit: b4a247986a. Both players use an identical deck within every game. Strategies reuse common shuffle seeds, and every comparison swaps seats. No weights, game rules, or production defaults were changed during the run.

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

## Legality after the repair

The previous run on these decks had 45 invalid games. This run has 0. The seeds are fresh, so score changes do not isolate the effect of the repair.

## Native strategy screen

Competitive scores include only the eight competitive strategies. Each was scheduled for 84 competitive games, or 156 games including controls. Invalid games are removed from both players' scores, so valid-game counts can differ.

| Strategy | Wins–losses–draws | Valid/scheduled | Score | Own failures | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Expert (full information) | 72–12 | 84/84 | 85.7% | 0 | Eligible |
| Masterful | 64–20 | 84/84 | 76.2% | 0 | Eligible |
| Sharp | 62–22 | 84/84 | 73.8% | 0 | Eligible |
| Greedy | 52–32 | 84/84 | 61.9% | 0 | Eligible |
| monte-carlo-greedy | 44–40 | 84/84 | 52.4% | 0 | Eligible |
| mcts | 17–67 | 84/84 | 20.2% | 0 | Eligible |
| mcts-greedy | 15–69 | 84/84 | 17.9% | 0 | Eligible |
| monte-carlo | 10–74 | 84/84 | 11.9% | 0 | Eligible |

All-screen failures, including controls: none. Failure reasons: none.

## Fresh-seed finalists

Each finalist was scheduled for 60 games, with 20 per deck.

| Strategy | Wins–losses–draws | Valid/scheduled | Score |
| --- | ---: | ---: | ---: |
| Expert (full information) | 43–17 | 60/60 | 71.7% |
| Masterful | 25–35 | 60/60 | 41.7% |
| Sharp | 22–38 | 60/60 | 36.7% |

| Deck | Expert (full information) | Masterful | Sharp |
| --- | ---: | ---: | ---: |
| Cyberpsychosis + Deadman — Burst with Insurance | 11–9 | 9–11 | 10–10 |
| Yorinobu — Two Units for the Price of One | 14–6 | 9–11 | 7–13 |
| Red/Yellow/Green — Low-Cost Value | 18–2 | 7–13 | 5–15 |

Head-to-head intervals resample whole valid mirrored blocks (4,000 samples, 95%). Each pair has 15 scheduled deck/seed blocks. Only complete valid blocks enter the intervals. The estimates apply to these decks and shipped information policies.

| First strategy | Second strategy | First wins–second wins | Complete valid blocks | First win-rate interval |
| --- | --- | ---: | ---: | ---: |
| Expert (full information) | Masterful | 22–8 | 15 | 60.0%–86.7% |
| Expert (full information) | Sharp | 21–9 | 15 | 56.7%–83.3% |
| Masterful | Sharp | 17–13 | 15 | 50.0%–66.7% |

## Original Choombattler reference

These results use Choombattler's native reducer with the original worker and our unchanged chooser through repaired adapter v2. They are separate from our native strategy ranking. Native actions still use generic choice prompts.

| Strategy | Wins–losses–draws | Valid/scheduled | Score |
| --- | ---: | ---: | ---: |
| Original Choombattler Expert | 10–2 | 12/12 | 83.3% |
| Expert (full information) | 2–10 | 12/12 | 16.7% |

| Deck | Our adapted Expert | Original Expert |
| --- | ---: | ---: |
| Cyberpsychosis + Deadman — Burst with Insurance | 0–4 | 4–0 |
| Yorinobu — Two Units for the Price of One | 1–3 | 3–1 |
| Red/Yellow/Green — Low-Cost Value | 1–3 | 3–1 |

## Controls

Screen results against all opponents. These do not select finalists.

| Strategy | Wins–losses–draws | Valid/scheduled | Score |
| --- | ---: | ---: | ---: |
| First legal | 88–68 | 156/156 | 56.4% |
| Random | 67–89 | 156/156 | 42.9% |
| Always attack | 24–132 | 156/156 | 15.4% |
| Attack unit only | 24–132 | 156/156 | 15.4% |
| Only passes | 24–132 | 156/156 | 15.4% |
| Call legend only | 0–156 | 156/156 | 0.0% |

## Evidence

| Phase | Source/catalog provenance | Schedule hash |
| --- | --- | --- |
| strategy-screen | `fnv1a32:13b7fb99` | `fnv1a32:aecf4443` |
| finalists | `fnv1a32:13b7fb99` | `fnv1a32:65b497a9` |
| choombattler-reference | `fnv1a32:a368cab6` | `fnv1a32:d6dab2a1` |

- [Machine-readable standings and analysis](other-decks-gauntlet-v15-2026-10-07.json).
- [Previous gauntlet on these decks](other-decks-gauntlet-2026-10-07.md).
- [MCTS repair evidence](mcts-legality-repair-2026-10-07.md).
- [Adapter v2 repair and validation](adapter-omissions-2026-10-07.md).
- Raw plans, per-game records, and phase reports: `/tmp/cyberpunk-other-decks-v15-2026-10-07-v1`.
- Seed base: `cyberpunk-other-decks-v15-2026-10-07-v1`.
- Adapter: `choombattler-reference-2`; revision: `fnv1a32:a07dd203`.
- Original worker SHA-256: `c834449c4463db4aa01e4ceaaa3de59afd460db90f0379a723b78a995369fa40`.

328 automation tests passed for the repair. Before the source commit, 5 Gig tests, 32 Bot Lab tests, 19 server-adapter tests, and 11 practice tests passed. The commit hook passed focused formatting, lint, and type checks. Source drift checks passed at every phase and at completion. These are local benchmark results; this run did not promote a strategy.
