# Expert Unit development

6 October 2026. One named lesson: **develop Units before surplus Gear**.
The candidate gives each Unit in the field a base value of 40, in addition to
existing power, cost, readiness, Gig-race and ability features. A Legend that
has gone Solo is also a field body; ordinary Legends and equipped Gear do not
receive this base value. The value applies equally to both players, including
lagging and spent Units. Engine commands still decide legality and outcomes.

## Research

The current live home page loads `index-BWXiUa9d.js`, which references
`bot-worker-client-BrMPzJKl.js`, which starts the
[public worker](https://choombattler.com/assets/bot.worker-DCis42UZ.js).
Inspected SHA-256:
`c834449c4463db4aa01e4ceaaa3de59afd460db90f0379a723b78a995369fa40`.

Expert still uses beam width 5, depth 12, four reply lines, reaction modeling
and deck reading. Its evaluator assigns a separate base value to field bodies,
then adds power and readiness. It also values spendable Eddies, known playable
hands, Street Cred, deck exhaustion and failed abilities. Hard and Expert have
full information. These are observations from the shipped bundle; the
[changelog](https://choombattler.com/changelog) separately reports evaluator
training through thousands of games. We did not reproduce that training or
its reported win rates.

Our existing Expert already used the same broad planning method, but inherited
an evaluator with no field-body feature. Gear could accumulate material value
without developing another attacker. This change independently implements the
missing feature using our own magnitude. It does not copy external game code
or fitted constants. Width, depth, reply count and the 768-command cap are
unchanged.

## Situation and same-seed gate

The public-engine situation test presents a lagging 3-power host, a 2-cost,
2-power Unit and a 2-cost, 3-power Gear, with only two available Eddies.
The old evaluator selects Gear; the candidate plays the second Unit. The test
executes the play and checks the player view for both Units and the new Unit's
Lag. Search does not change the live state. Rules remain authoritative:
CR 4.7 and 9.3.1.1 prevent the new Unit from attacking with Lag; CR 11.6.5
supplies Gear power. The independent body value is a strategic estimate.

The reviewed real-card dump uses `authored-ryb-low-cost-tempo`, Expert versus
Sharp, seed
`choom-study/ryb/1/authored-ryb-low-cost-tempo-vs-authored-ryb-low-cost-tempo/match-0`.
Before: step 14 plays Zetatech Faceplate on Viktor's Legend; steps 15–16 add
Mantis Blades and Kiroshi Optics to that Legend. No Unit is played that turn.
The bot loses after 66 commands.
After: step 14 plays Swordwise Huscle, then adds Mantis Blades and Kiroshi
Optics to that Unit. On the next own turn it attacks and draws through the
Swordwise trigger. The bot wins after 104 commands. These claims come from
`move.playCard`, `move.playCard.gear`, `cardMoved`, `cardAttached`, and the
attack/draw logs in the saved before/after dumps.

## Comparison

The development schedule covers all fifteen legal authored decks, in mirrors,
both seats, with the same shuffle seed for the two seat legs. There are three
30-game cells: candidate versus old Expert, old Expert versus Sharp, and
candidate versus Sharp. The old Expert is reproduced with
`unitDevelopmentWeight: 0`; a replay check also matched the frozen v9 chooser's
moves, logs, events and terminal hash.

New Expert wins **20/30 (66.7%)** against old Expert in the development cell.
The paired 95% bootstrap interval for its gain over a 50% score is +6.67 to
+30.00 percentage points.
Against Sharp, old Expert wins 18/30 (60%); new Expert wins 24/30 (80%).
All sixty games end normally. One cell regresses: Relic + Smasher falls from
2/2 wins to 0/2 against Sharp. The samples per deck are too small to establish
an individual deck win rate. These records are in
[unit-development-comparison.json](unit-development-comparison.json).
This oracle/public diagnostic does not pass the lab gate for a comparison
between bots with the same information policy.

The independent holdout freezes the same candidate settings, changes the seed
base to `choom-development-holdout-v1`, and runs two blocks per authored deck,
both seats: 60 games against old Expert. Both bots have full information.
New Expert wins **44/60 (73.3%)**, with no automation failures and sixty normal
win-condition endings. Its mean paired gain over a 50% score is +23.33
percentage points; its paired 95% bootstrap interval is +15.00 to +31.67
points. The complete record is
[unit-development-holdout.json](unit-development-holdout.json).

The benchmark stores each complete coach dump beside its match record. Replay
checks compare every move, argument, log, event, winner, termination reason,
and terminal hash. Wall time is excluded because it depends on machine load.
Reports use a seeded paired bootstrap with deck/seed blocks as sampling units;
a failed automation game receives a penalty rather than a draw.

## Reproduce

From `submodules/cyberpunk`, use fresh result directories:

```sh
bun tools/ai-runner/src/unit-development-benchmark.ts /tmp/expert-development run
bun tools/ai-runner/src/unit-development-benchmark.ts /tmp/expert-holdout run 0 6 --holdout
bun tools/ai-runner/src/unit-development-benchmark.ts /tmp/expert-development replay 2 6
bun tools/ai-runner/src/unit-development-benchmark.ts /tmp/expert-holdout replay 0 6 --holdout
```

## Checks

Before the default change, all 276 automation tests passed. The Expert situation suite and registry
checks pass 13 tests after the final edit. Format, lint and type checks pass for
the four changed TypeScript files. The baseline development replay, candidate
development replay and candidate holdout replay match all recorded commands,
logs, events and terminal hashes. The two reviewed coach dumps are saved in
this directory; their keep decision is in
[unit-development-iterations.md](unit-development-iterations.md).

The benchmark used automation revision `cyberpunk-automation-v10`.

## Limits

The user then allowed bots to use hidden information. Revision
`cyberpunk-automation-v11` selects **Expert (full information)** for bot games.
Missing strategy ids, unknown ids and the `default` alias all resolve to Expert.
Recommended and Expert descriptions disclose access to both hands, both decks
in order and face-down Legends. Sharp and Masterful remain available with public
information. The older public-information promotion record is unchanged; this
default is an explicit product choice, not a new lab audit. Public greedy
training records name `greedy` as their parent, since `default` now runs Expert.

Hidden cards remain hidden in the human and spectator views (CR 5.3.2.1).
Local practice and hosted adapter tests execute default bot commands, confirm
that Expert reads the oracle projection, and check filtered human views.
Sharp combat heuristic tests now name Sharp explicitly, so a change to the
product default does not replace their strategy under test.

No cross-site match establishes equality with Choombattler. The
matrix covers authored mirrors, not every deck pairing, all cards or human
play. Hosted deployment and browser decision latency were not verified. The in-app
browser blocked the worktree preview with `net::ERR_BLOCKED_BY_CLIENT`.
The preview server also reported an unresolved sibling FAB type dependency;
no browser UI or full hosted match is claimed for this default change.

Default-change checks: 313 engine automation and strategy tests, 19 hosted
adapter/catalog tests, 17 practice/session tests and 11 lab adapter/evaluation
tests passed. The lab mirror runs Expert through the Recommended alias for
both seats and ends with `rules-win`; it takes about 23 seconds locally, so
that full-game test has a 60-second timeout. Changed TypeScript files passed
focused format/lint/type checks where included by workspace configuration.
