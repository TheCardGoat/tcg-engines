# War and Valen mirror loss investigation

The first Expert run won 2/6 War mirrors and 3/6 Valen mirrors. All 12 original mirror games were reproduced exactly before changing the planner. Their initial native states, accepted commands, board summaries, and native logs are stored in `v1-mirror-0.json` through `v1-mirror-11.json`.

## Confirmed decision defects

| Position | v1 decision | Evidence | v2 decision at the same position |
|---|---|---|---|
| War, block 0, Expert in seat 2, before command 247 on turn 10 | End turn | Expert has 5 health; the opponent has 15. Expert has eight ready attackers, including Areson and five Minions. The search reaches its 768-node limit at depth 1. Attack lines are still in the defender-buff step, before damage. It scores end turn at 119.725 and its best unfinished attack at 116.725. | Attack, then finish a native win during turn 10. The regression test replans both seats until the win. |
| Valen, block 0, Expert in seat 1, before command 41 on turn 5 | Skip resource | Only two resources are available, while the hand contains cards that cost three or more. The last search stage compares settled positions against unresolved choices and narrowly selects pass. | Deploy a third resource. |
| Valen, block 2, Expert in seat 2, before command 219 on turn 12 | Activate Portal | Six ready resources can play LINN, Adaptable Fighter. The search spends its planning budget before completing the root branches. The old continuation activates the Portal twice on this turn, leaving only two ready resources and the threat in hand. | Play and resolve LINN while preserving the Portal state. |

The detailed v1 search snapshots are `inspect-1-247.json`, `inspect-6-41.json`, and `inspect-11-219.json`. These explain the selected action, budget, candidate count, line scores, and unresolved native phase.

## Changes

- Filter proposals by the current timing window and the activation's source zone. The native engine still checks all legality and costs. Ordinary cards no longer consume the search budget in Clash Buff windows; Counter proposals use the matching Counter tag and effect line.
- Group attack proposals by attacker. A wide board now gives each attacker a turn before spending the candidate limit on more targets for the first attacker.
- Resume partial child enumeration without repeating native legality probes. Only fully enumerated children can establish a forced action.
- Resolve forced continuations relative to the simulated turn. The old code stopped immediately on the opponent's next turn, making their plays appear to pay costs without receiving their effects.
- Increase the value of the first resources, with diminishing value for later resources. This values future access to playable costs after current-turn payments.

The search settings remain 768 native command attempts per decision, beam width 5, depth 12, and four reply lines. Both bots retain full private-state access. Native rules, meta-v1 weights, the default strategy, and casual deck validation policy are unchanged.

## Diagnostic checks

| Revision | War mirrors | Valen mirrors | Combined |
|---|---:|---:|---:|
| Archived v1 | 2/6 | 3/6 | 5/12 |
| Candidate filtering, attacker coverage, and probe reuse | 4/6 | 3/6 | 7/12 |
| Add next-turn resolution and early resource value | 5/6 | 4/6 | 9/12 |

These 12 games were used for diagnosis and adjustment. They are not holdout evidence. The development journals preserve both rounds, including the remaining losses. All 36 original/development command traces were replayed through the native engine and matched their recorded final-state hashes; phase, choice, board, and log snapshots are isolated per command. The [trace check](../normalize-traces.ts) repeats this verification.

Three regression tests recreate the original positions from match setup through the recorded public native actions. They do not seed pending choices. The tests verify War's same-turn win, Valen's third resource, and Valen's resolved LINN play. Together with the existing checks, 71 focused tests passed: 12 engine, 38 adapter/deck, and 21 bot-lab. Engine and adapter type checks, focused bot-lab type checks, automation lint, and whitespace checks passed.

## Fresh evaluation

The final source revision is recorded in the adjacent manifest. The evaluation uses a new seed base, `alpha-clash-expert-v2-season3-holdout`, with three blocks per matchup, all eight decks, fixed physical deck/shuffle assignments across controller swaps, and 384 games. The archived v1 planner also plays the 48 mirrors on these same new shuffles as a control. Two original full records verify the relocated v1 policy before the controls are accepted.

The frozen v1 source is retained under `source-v1/`. Only relative import paths were relocated. The main [comparison report](../review.md) contains the holdout results and replay verification. No further tuning will use those results in this run.

The first fresh War comparison was mixed (v2 4/6, archived v1 5/6). A fixed supplemental check adds ten new seed blocks for each of War and Valen, both versions against meta-v1, for 80 games. The code remains frozen. Its plan, results, and limitations are reported separately from the original 384-game suite.

The command traces are stored as `.json.gz` to keep the PR small. Run `bun ../unpack-traces.ts` from this directory, or run a diagnostic script, to restore local JSON copies.
