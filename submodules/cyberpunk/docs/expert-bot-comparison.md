# Choombattler expert and TCG Online bots

Inspected 3 October 2026. This comparison uses the deployed public browser
bundle and our checked-out source. It is not a head-to-head match between
sites, and it does not establish equal playing strength.

## What Choombattler runs

The [deployed worker](https://choombattler.com/assets/bot.worker-DDHS6ezo.js)
contains the expert defaults: beam width 5, depth limit 12, four reply lines,
reaction modeling enabled, and deck reading enabled. SHA-256 of the inspected
bundle: `dc932c3258ee3f9d19497d4b9163a632783113e79b586702b4e53a573fa8c920`.
The asset was reached from the live home page through its index bundle and
[worker client](https://choombattler.com/assets/bot-worker-client-UiLE0A8y.js).
The minified entry symbols in this build are `Bs` (difficulty dispatcher),
`Uu` (expert), `Zr` (one-step policy), `Fs` (continuation), and `fs` (evaluation).
These symbols are build-specific.

The expert expands legal action sequences, retains a narrow set of promising
positions, models reactions with the one-step policy, and compares leading
lines after a simulated opponent continuation. It returns the first action
and searches again at the next decision. The continuation has a 60-action
cap. This is beam search with modeled replies, not exhaustive minimax or MCTS.
It runs in a Web Worker.

Both Hard and Expert enable perfect information. Expert also derives Gig-plan
value from deck information. Evaluation considers board bodies and power,
readiness, resources, known hand power and affordability, the Gig race, deck
exhaustion, and wasted abilities. The [changelog](https://choombattler.com/changelog)
says its evaluator was fitted through thousands of games. That training claim
and its reported win rates were not independently reproduced here.

## Comparison before this change

| Area | Choombattler Expert | Our Greedy | Our promoted Sharp (`tactical`) |
| --- | --- | --- | --- |
| Planning | Beam 5, depth 12, four reply lines | Immediate priorities | Depth 3, 48 simulated nodes, branch limit 12 |
| Opponent | Known private cards and modeled replies | Visible threats | Public replies and hidden-information cutoffs |
| Hidden cards | Both hands, decks, face-down Legends | Player view | Player view, with an existing explicit own-deck reveal exception |
| Candidate selection | Legal actions and expanded prompts | Fixed priorities and deck profiles | Deck and combat policies can remove actions before search |
| Evaluation | Tuned positional and hand features | Hand-authored priorities | Positional feature weights, Gig race and action bonuses |

Source: `packages/engine/src/automation/search/tactical.ts`,
`search/evaluate-board.ts`, `strategies/greedy.ts`, and `promotions/current.json`.
The current default already performs search; it is not the simple Greedy bot.
The prior [A/B campaign](../reports/heuristics-ab/README.md) rejected a depth-4
variant after repeated-state failures. Increasing depth alone is insufficient.

## Added practice mode

`expert-oracle`, labelled **Expert (full information)**, uses an independently
implemented beam planner with width 5, a 12-action horizon and four reply lines.
It retains our evaluator with a small known-hand value term. It does not copy
Choombattler's fitted weights or game code.

The planner models opponent actions and forced continuations, checks cycles,
and replans on each decision. A shared limit of 768 simulated commands bounds
work; 30% is reserved for comparing continuations. Search-local projection
caches avoid repeated view construction. This cap can shorten the horizon.
It uses the existing opening-hand policy. Deck profiles are not bound to this
new strategy; deck-derived plans remain a difference from Choombattler.

`LocalEngine.getOracleView` supplies card identities while preserving actual
face-down status. `getFilteredView` remains unchanged for player and network
views. The oracle does not change legal actions, costs, targeting or effects.
Hidden-area access is an explicit practice exception to normal information
rules (Comprehensive Rules 5.3.2.1), not a change to those rules.

The registry marks the strategy `informationPolicy: oracle` and `testOnly`.
The practice catalog explicitly includes it. The promoted default remains
Sharp, and the new strategy is not production-eligible in bot-lab metadata.
The simulator's existing practice selector shows the hidden-information
warning before starting the game. The CLI can run and replay the new strategy.

## Validation

Focused tests cover privileged projection without player-view changes,
search immutability, legal sell-then-play sequencing, deterministic decisions,
node limits, an optional-replay cycle, a four-choice plan with a rival hand
reply, and complete games in both seats. Existing tactical and boundary tests
also run. Practice-catalog coverage checks the label and disclosure.

Small real-card comparison: two authored decks, all four ordered deck pairs,
two seeds per pair, then the same schedule with strategy seats reversed.
The first-seat batch won 8/8, all by the normal win condition, with no illegal
moves. The second-seat batch won 5/8, also with eight normal endings and no
illegal moves. Combined: **13/16 wins**; see the [aggregate](../reports/expert-oracle/summary.json)
and [second-seat output](../reports/expert-oracle/second-seat-summary.txt).
This covers 26 of 124 catalog cards. It is a smoke comparison, not a promotion
or a reliable general win-rate estimate; information access differs by design.
Browser verification used the existing localhost:5174 simulator: selected the
labelled mode, checked the disclosure, started a game, and observed the bot
keep its hand, gain a Gig, call a Legend, sell a card, and pass to the human.
Opponent hidden cards remained hidden in the player view.

The [first replay](../reports/expert-oracle/first-seat-replay.json) reproduces
all 48 actions and state versions exactly. The [second replay check](../reports/expert-oracle/second-seat-replay-check.txt)
matched all 123 actions and state versions.

The subsequent [bot-lab holdout](../reports/expert-oracle/bot-lab-validation.md)
supersedes the small smoke comparison for strength claims. Across 232 games,
88 paired blocks and all 15 current authored decks, Expert won 136 (58.6%).
Its raw paired 95% interval includes zero gain. There were 24 repeated-state
failures; exact traces show an Alt activation-and-pass loop in both seats.
**The v8 run did not validate reliable improvement over Sharp.**

The subsequent [v9 cycle repair](../reports/expert-oracle/cycle-repair.md) adds
live turn history across searches. All 24 original failures then finish normally,
and the same 232-game matrix has zero automation failures. Expert wins 140 games
(60.3%); all previously normal games retain their winners. The paired 95% interval
is now positive on this corpus. This is a regression rerun of the diagnosed seeds,
not an independent new holdout. Sharp remains the default.

The [6 October Unit-development study](../reports/expert-oracle/unit-development.md)
rechecks the current worker and adds a separate value for field Units. On the
fifteen-deck, both-seat development schedule, the revised Expert wins 20/30
against old Expert. Against Sharp it wins 24/30, compared with 18/30 for old
Expert on the same schedule. The new-seed holdout is recorded in the study.
This changes the labelled Expert practice bot; it does not promote an oracle
strategy to the public default or establish equality with Choombattler.

Reproduce from `submodules/cyberpunk`:

```sh
bun tools/ai-runner/src/cli.ts --strategy-a expert-oracle --strategy-b tactical --matches 2 --seed expert-comparison --deck-source authored-botlab --deck-limit 2
bun tools/ai-runner/src/cli.ts --strategy-a tactical --strategy-b expert-oracle --matches 2 --seed expert-comparison --deck-source authored-botlab --deck-limit 2
bun tools/ai-runner/src/cli.ts replay reports/expert-oracle/first-seat-replay.json
```

Remaining limits: no cross-site match, no UI latency gate, and no
hosted deployment verification. Full-information practice must not be described
as fair competitive play. The browser still uses its existing automation
scheduler; a dedicated search worker is separate follow-up work if measured
UI latency requires it.

## Bot default with hidden information (6 October 2026)

The user permits bot games to use hidden information. Revision
`cyberpunk-automation-v11` makes Expert the bot default, including the
Recommended alias. Both descriptions state that it sees both hands, both decks
in order and face-down Legends. Expert is eligible for bot assignment. Sharp
and Masterful remain public-information choices. The older Sharp promotion
record remains historical evidence; it is not relabelled as an Expert audit.

Local practice and hosted adapter tests execute the default bot with oracle
access and check that human and spectator views keep hidden cards private.
The [Unit development report](../reports/expert-oracle/unit-development.md)
contains strength results and validation limits. No deployment was made.

## Default promotion confirmed (7 October 2026)

After the [v15 mirror gauntlet](../reports/expert-oracle/other-decks-gauntlet-v15-2026-10-07.md),
Expert remains the selected bot default. The user confirmed this promotion.
The engine registry, Recommended alias, practice configuration, and server
automation all select Expert. Revision `cyberpunk-automation-v16` also changes
the public `defaultStrategy` export to the same Expert chooser; it previously
still exported Greedy. Explicit Greedy, Sharp, and Masterful choices remain
available. Human and spectator projections keep their existing hidden-card
limits.

The gauntlet finished 1,194 games with no invalid results. Expert won 43 of
60 finalist games on Cyberpsychosis/Deadman, Yorinobu, and Red/Yellow/Green.
The paired intervals support its lead over both other finalists on that
sample. Original Choombattler Expert still won 10 of 12 reference games
against our adapted Expert. This promotion does not establish equal strength
with Choombattler. The older Sharp promotion file retains its original
public-information audit; it is not an Expert promotion record. No hosted
deployment was made.

Promotion checks passed: 299 engine automation tests, 28 server-adapter
tests, 18 practice tests, and 9 Bot Lab tests. The existing three-game
practice animation test now has a 180-second limit to cover Expert's
bounded search; its move and animation assertions remain intact. Focused
formatting, lint, and type checks also passed.
