# Alpha Clash bot lab

The lab now registers Alpha Clash, preserves the two selected event-winning
deck lists, checks executable card coverage, schedules paired mirrors and a
cross match, and runs the existing practice policy through `applyCommand`.
It records termination, actions, turns, illegal proposals, and a deterministic
state hash. The calibration candidate compares the same policy against itself;
it does not claim trained improvement and cannot be promoted.

## Decks

| Lab ID | Contender | Main / side | Result |
| --- | --- | --- | --- |
| `clarity-hyper-aggro` | Clarity, Ready for Trials | 50 / 10 | shane, 1st, Online League Season 3 |
| `absence-makati` | The Absence, Voice of the Void | 60 / 15 | Edison Curameng, 1st, Clashground Makati |

Clarity: [published list](https://www.deckplanet.net/alpha_clash/deck/0162d182-517c-4bdf-97a2-69c8e3520301),
[official result](https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap).
Absence: [published list](https://www.deckplanet.net/alpha_clash/deck/45fd8407-7912-4fbc-b900-6bb2dbb06216),
[official result](https://alphaclashtcg.com/news/tvg476vnbr9u595ldw7z0y1vfr63px).

These are August 2026 baselines. The September Nexus of Power release and
[LINN errata](https://alphaclashtcg.com/news/nexus-of-power-release-week)
postdate the lists. Preserve the published quantities and implement current
official behavior before interpreting match results. No card replacements,
preview Contender substitutions, or runtime text parsing are allowed.

## Engine support, 2026-10-06

Both exact lists pass admission, including all sideboard cards. No substitutes
or runtime text parsing are used. The loader has one explicit identity alias:
Zhao Li's published `Reconnaissance` spelling maps to the printed
`Reconaissance` record.

The card work implements the missing Contenders, Clash cards, Actions, Traps,
and Clashgrounds. It also completes the affected existing cards, including
LINN, Morac, Zhao Li, Death, Overseer, Trugg, and Webber's Binoculars. Printed
metadata is separate from behavior. Marcus uses the verified PG-003 card face.
Bombardment is an Action. Colorless cards and cards without an affiliation
symbol now import correctly.

Rules work uses the publisher's
[v8 rulebook](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf)
and [official errata](https://alphaclashtcg.com/banerrata). The local
Alpha Clash rules skill now contains v8.0 (refreshed October 8, 2026), including
Appendix B errata and a source review of unresolved rule conflicts.

The engine now handles declared and resolution-time targets, multi-card
choices, Foretell order, Oblivion retrieval with ownership retained, Void
ordering, Banish replacement effects, additional discards, health and
sacrifice payments, compulsory attacks, and the affected static abilities.
Turn-start choices resolve before Ready and Draw. End-of-turn choices resolve
before the next turn starts. Challenge means clash damage to an opposing
Contender. Trigger queues contain serializable data so checkpoints and copied
legality checks do not retain functions bound to another match.

Validation: 1,561 engine tests pass, including 43 focused meta-deck tests.
Printed catalog, card manifest, authoring hygiene, and package type checks pass.
The importer has 21 passing tests; the server adapter has 19; the focused lab
suite has 16. The shared evaluation gate has a regression test for a zero
regression limit: a neutral cell is allowed, and an actual loss is rejected.
These checks establish the tested behavior; they do not prove every interaction
in the full Alpha Clash catalog.

## Lab policies and results

`meta-v1` attacks before playing cards. `meta-v2` first builds its board and
attaches Weapons. Both policies use the public command boundary and copied
state for legality checks. They handle optional choices, declared targets,
Traps, Ambush, health payments, sacrifice payments, and Void replays.
`meta-v3` uses play-first order only with a Contender that has a Void replay
ability. `practice-v1` remains available as the legacy simulator policy.

The supported overrides are `playBeforeAttack`,
`playBeforeAttackWithVoidReplay`, `acceptOptionalTriggers`, and
`keepClashWeight` (0–20). The final plan compares `meta-v3` with `meta-v1`,
using the same resource preference to isolate play order. `train` writes a current manifest; it does not
optimize the policy. These are laboratory policies marked oracle, with no
production promotion target.

The saved calibration compares `meta-v1` with itself on eight games. The
iteration uses separate seeds and 12 paired blocks across both mirrors and
the cross match. Results and replay verification are recorded beside the
manifests in `tools/bot-lab/reports/alpha-clash/2026-10-06/`.

| Run | Games | Candidate wins | Hard failures | Result |
| --- | --- | --- | --- | --- |
| Calibration, meta-v1 vs itself | 8 | 5 | 0 | No improvement claim |
| meta-v2 vs meta-v1 | 16 | 10 | 0 | Rejected: cross matchup fell 12.5 percentage points |
| meta-v3 vs meta-v1 | 32 | 20 | 0 | Rejected: confidence interval includes zero |

All 56 saved games ended with rules wins and zero rejected commands in the
actual match. Every saved record reproduced exactly, including its final state
hash. `replay-verification.json` records the results. The v2 report retains its
historical policy revision; the calibration and v3 reports match the final
revision. Legality probes can fail on copied state; these do not change
the match. The final candidate's mean paired gain was 16.7 percentage points,
with a 95% bootstrap interval of 0–33.3 points. This sample does not prove an
improvement. The default remains `meta-v1`. The rejected candidates and their
reports stay available for further tests. These results apply to the saved
seeds and selected main decks.


The lists are August 2026 event baselines, evaluated with current behavior.
They do not establish the complete October metagame. Sideboards are preserved
and tested, but the lab does not sideboard between games.

## Run and iterate

Run these commands from `submodules/agnostic-simulator/tools/bot-lab`:

```sh
bun src/cli.ts doctor --game alpha-clash
bun src/cli.ts train --game alpha-clash \
  --manifest examples/alpha-clash-iteration-plan.json \
  --out /tmp/alpha-clash-candidate.json
bun src/cli.ts evaluate --game alpha-clash \
  --candidate /tmp/alpha-clash-candidate.json \
  --out /tmp/alpha-clash-report.json
bun src/cli.ts replay --game alpha-clash \
  --report reports/alpha-clash/2026-10-06/iteration-report.json \
  --match clarity-mirror/block-0/a-seat-1
```

Use new seeds after tuning. Compare each matchup, command failures, and replay
hashes. A `promote` report verdict means the lab's statistical gate passed.
It does not deploy the candidate or change the simulator bot.

## Log audit, 7 October 2026

Run `pnpm audit:alpha-clash` from the bot-lab directory to record two seeded
Clarity–Absence games with swapped seats. The script saves each accepted
command, state before the next command, new logs, and effective board stats.
It then replays and compares every frame and the final result. Cost and damage
checks use a separate bounded calculation rather than engine evaluators.

The [audit review](../tools/bot-lab/reports/alpha-clash/2026-10-07/log-audit/review.md)
records the repairs, rule references, coverage, and limits. This audit fixed
Damage-Step cleanup, Defeat zone timing, simultaneous trigger order, a Clarity
health-threshold check, and repeated log events.

Full rules readiness remains unconfirmed. General triggered-effect response
priority and player-selected ordering within same-player trigger batches still
need engine work. Two main-deck games do not cover all effects or sideboards.
Older benchmark reports remain historical; regenerate candidates after these
engine changes.
