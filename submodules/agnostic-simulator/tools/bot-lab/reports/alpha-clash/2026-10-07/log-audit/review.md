# Alpha Clash log audit — 7 October 2026

Two engine games completed with Clarity Hyper Aggro and Absence Makati, with
seats swapped. Absence won both. The replay matched every command, log entry,
and state frame. There were no rejected match commands and no failures in
182 bounded rules checks. **This is a limited pass, not full rules readiness.**

| Game | Player one | Player two | Winner | Turns | Accepted actions |
| --- | --- | --- | --- | --- | --- |
| game-1 | clarity-hyper-aggro | absence-makati | Absence | 10 | 236 |
| game-2 | absence-makati | clarity-hyper-aggro | Absence | 9 | 215 |

Both players used the lab-only oracle `meta-v3` policy. These were public-command
engine games, not browser games. No Docker daemon was available. Main decks
were used; no sideboarding took place. This sample does not measure deck strength.

## Sources

The publisher's [Comprehensive Rulebook v8.0](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf)
was fetched on 7 October 2026. Its SHA-256 was
`a3632de79af874065733fffdf999edb0b40adf4e25e83ceacf6f95ad31336590`.
It matched the previously downloaded copy. The local rules skill refers to
v5.3, so v8.0 controlled this audit. The [publisher's errata](https://alphaclashtcg.com/banerrata)
and printed card faces were also checked. Bombardment is a Basic Action;
Zhao Li excludes Relics from his first-Accessory trigger.

## Confirmed defects and repairs

1. Damage-Step choices occurred after the Clash had ended. Game 1, frame 23,
   originally returned to Primary before the Absence Challenge choice.
   The engine now keeps the Damage Step open until its triggers and choices
   finish. End-of-Clash grants and damage clear afterward. Rules 504.2g.1–2,
   500.3. A public-command test also checks Clarity's temporary attack grant
   through the Challenge choice and its later expiry.
2. Death, the Dreadful moved into Oblivion before its Defeat target choice.
   Game 1, frame 65, now keeps Death in the Clash Zone; frame 66 applies the
   chosen two-health loss and draw, then moves Death into Oblivion.
   Rule 504.2g. Cards pending defeat do not deal a later damage assignment
   or count as surviving Victory sources.
3. Simultaneous triggers resolved in insertion order. Game 1, frame 126,
   originally offered the active player's Absence Challenge first.
   New trigger batches now use APNAP placement and resolve from the top;
   new Portal triggers go above older unresolved effects. Rules 603.3b,
   409.5. Tests cover both Challenges and simultaneous Defeat/Victory.
4. A separate public-command reproduction found a Clarity threshold error.
   Starting at 16 health, Clarity deals damage and takes a simultaneous
   one-damage counterstrike. Her 15-health Challenge was checked before
   the full damage assignment. It is now checked after that assignment,
   before defeated sources leave play. Rules 504.2g, 116.7, 603.1b.
5. The log repeated every damage event and repeated the game-end event.
   It now emits one damage entry per assignment and one terminal entry.
   Draw, health-effect, and Defeat entries were added so these transitions
   can be reviewed without inferring them from missing log messages.

The original traces remain in [before-fix/](before-fix/). No card text was
changed to accommodate these errors; repairs are in the owning engine.

## What these games checked

The independent checker uses printed stat lines, literal temporary grants,
Denver's affiliation bonus, and Lord Krung's friendly Discarded bonus. It does
not call engine cost, stat, damage, or legality evaluators. It checked 26
normal play payments, 39 Clash damage resolutions, 78 Contender
health totals, three free setting actions, eight Clarity reveal-to-hand
choices, seven simultaneous Challenge orderings, and Bombardment's
three-card diminish and damage. Other checks cover Damage-Step choices,
Defeat zone timing, and terminal log uniqueness. Structural checks ran after
all accepted commands for deck order, owner zones, health caps, Clashground
uniqueness, and Clash cleanup.

The trace review also checked: first-player restrictions; Absence's start-of-turn
banish/draw before Ready/Draw; free Portal toggles; the Portal attack grant and
expiry; Clarity's Foretell and legal Oblivion retrieval; Denver's draw two/discard
one; Colonel's free Weapon attachment; Webber's engage cost, selected cheap
card, and ordering of the remaining cards on the bottom; and Shadow Incarnate's
one-health Enter cost. Clarity's revealed card enters hand by its effect;
it does not generate a draw event (v8 FAC, VTD1-001).

Fourteen distinct main-deck card names were played, plus both Contenders.
Playing a card does not exercise every ability. Zhao's observer abilities,
New Host's Victory, Rizlac's Oblivion replay, Trugg's Defeat/retrieval, and
Shadow Incarnate's forced attack and Void were not all exercised here.
Morac and Sacrificial Strength were set, but no Trap/Ambush was activated.
Resources deployed from a card do not count as testing that card's abilities.
The focused engine tests cover additional branches; the complete game sample
alone cannot prove every card or keyword.

## Open engine issues

General triggered effects still resolve through the command-boundary queue
rather than the complete Standby priority/response protocol. A player cannot
make every response that rules 603.3 and 605.1 permit before a queued trigger
resolves. Players also cannot select the order of every same-player trigger
batch; only some dedicated choices, such as Void ordering, exist. These need
engine work before a claim of full rules readiness. The ordering repair above
covers deterministic placement and cascades, not that complete protocol.

These games do not verify all sideboard cards, response branches, Superspeed,
all replacement interactions, hidden-information bot play, or the browser UI.
Existing benchmark reports are historical after this engine revision; they
must not be treated as current rules certification or promotion evidence.
The default remains `meta-v1`.

## Validation and artifacts

- Engine: 1568 tests passed, including seven new timing/log regressions.
- Alpha Clash server adapter: 19 tests passed.
- Bot lab and registry: 16 tests passed.
- Engine and adapter TypeScript checks passed; bot-lab source and audit-script
  checks passed with no warnings.
- Two full command/state/log replays matched exactly.
- Engine revision: `fnv1a32:497198d2`; catalog hash: `fnv1a32:de23a4df`.

[Summary and check counts](summary.json), [game 1 log](game-1.log.txt),
[game 2 log](game-2.log.txt). Full snapshots are in `game-1.json.gz` and
`game-2.json.gz`; both contain the initial state, commands, card definitions,
new logs, and runtime state after every command.

From `submodules/agnostic-simulator/tools/bot-lab`, run:

```sh
pnpm audit:alpha-clash
```

The command exits with an error if a scoped check or replay fails. A successful
exit does not remove the open engine issues above.

## PR verification

The isolated PR branch passed all checks again. Both saved full traces, including
card definitions, commands, state and logs, matched exactly.
[PR verification](pr-verification.json) records the branch revision and checks.
