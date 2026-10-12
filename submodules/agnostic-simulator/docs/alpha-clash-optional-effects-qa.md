# Alpha Clash optional effects: human QA

Status: ready for human QA after local checks on 2026-10-08.

## Open the correct build

Use branch `codex/alpha-optional-effects` in the isolated checkout:
`/Users/wazar/.codex/worktrees/alpha-optional-effects/the-card-goat-online`.

The simulator is running at <http://127.0.0.1:5240/alpha-clash/simulator/tests>.
Keep this server for the QA session. If it stops, run `vp dev --host 127.0.0.1 --port 5240`
from `submodules/agnostic-simulator/apps/multi-game-simulator` in that checkout.
Do not start the platform. These fixtures use real cards, the native engine,
the server adapter, and the normal R3F board.

Select **Reset** before each branch of a test. Every fixture starts before the
action: you perform the activation yourself through the normal board, pass the
response or clash steps, and only then answer the Use/Decline prompt. Both
seats start locally controlled; switch the arena's top-bar mode to **bot**
to hand the other seat to the practice bot at any time, and the game keeps
progressing normally — the bot draws, deploys, attacks, and answers its own
steps. Switch back to **self** to play both seats. Select **Match** for the
action list, the event log, and the sound/motion controls.

## Test each effect

| Fixture                                                                       | Steps                                                                                                                                                                                                                               | Expected result                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Restore](http://127.0.0.1:5240/alpha-clash/simulator/tests/optional-restore) | Open **Match**, select **Initiate a clash**, pick Warcry as attacker and the opposing contender as target, then pass the counter window and the clash steps. Answer **Restore 1?** with **Decline**. Reset and repeat with **Use**. | The clash resolves normally: the opponent drops to 29 health. Decline keeps deck 6 and Oblivion 2. Use changes deck to 7 and Oblivion to 1. The log records Restore after Use.                                                                                                                                                                                            |
| [Wrath](http://127.0.0.1:5240/alpha-clash/simulator/tests/optional-wrath)     | Open **Match** and activate Dragon's Breath (the action carries its printed text), then pass both response windows. Answer **Use** for Wrath and select a hand card. Reset and repeat with **Decline**.                             | Decline keeps deck 6 and hand 2, with no Wrath damage. After Use, only Fangyin is a legal target. Sonoro can be inspected but cannot resolve the choice. Selecting Fangyin resolves immediately: deck 7, hand 1, opposing Sonoro defeated. The log shows Fangyin revealed, put on the deck bottom, and damage to both Sonoros. The required target prompt has no Decline. |
| [Temper](http://127.0.0.1:5240/alpha-clash/simulator/tests/optional-temper)   | Open **Match**, select **Attach Heavy Metal**, and target Gearwin. The attachment pays one red resource. Answer the Temper prompt with **Decline**. Reset and repeat with **Use**.                                                  | Heavy Metal remains attached to Gearwin in both cases. Resources remain 3 ready / 4 total; Decline does not refund the paid attach cost. Use shows one Temper counter. Decline shows no Temper counter.                                                                                                                                                                   |
| [Void](http://127.0.0.1:5240/alpha-clash/simulator/tests/optional-void)       | Select **End turn** with the Portal open. The Absence then offers to banish the top card. First decline it. Reset, use the banish, then decline **Draw a card?**. Reset again and use both prompts.                                 | Declining banish leaves the original player's deck 6 / hand 2. Using banish gives deck 5 / hand 2 and a separate optional draw. Declining that draw still resolves Breach the Void's mandatory draw: deck 4 / hand 3. Using both gives deck 3 / hand 4. There is no Decline for the mandatory Void draw.                                                                  |

The Void fixture changes the viewed seat when the response ends. Track the
24-health Voice of the Void player, who becomes **Opponent**. The other player's
normal Expansion draw gives deck 2 / hand 3 in every completed branch.

## Check interaction and presentation

1. Open source-card inspection while an effect is pending. Close it with Escape.
   The prompt and card counts must remain unchanged.
2. In Wrath, open **Show choices**, minimize it, and reopen it. Select Fangyin.
   The choice must still resolve once. Non-Dragon Sonoro must never be selectable.
3. Open **Match** while a choice is pending and select **Cancel**. This clears the
   local action draft and reoffers the pending effect. It does not undo costs or
   decline the effect. Close Match, then complete the choice.
4. Focus Use or Decline with the keyboard and press Enter. The result must match
   a pointer click. It must resolve once.
5. Turn Sound off in Match and complete a choice. Repeat with Sound on. There
   must be no choice cue when muted, and one cue for a completed choice when on.
   Reset returns fixture settings to their defaults.
6. Turn Reduced motion on and complete Temper. The same counter and prompt result
   must appear. Check the prompt at desktop size and at 844 × 390 landscape.
   The source, effect text, Use, and Decline must remain readable and reachable.
7. Check the opponent's hand and deck. They must show counts or hidden cards,
   without private card names. Wrath's chosen reveal is public after resolution.
8. Repeat Reset and Use three times. The board must load, complete the choice,
   and return to the expected state without a Canvas error.

For a failure, record the route, exact steps, expected/actual counts, screenshot,
and Match log. Do not approve a case with a stuck prompt or a private-card leak.

## Agent validation and fixes

First round (2026-10-08, pre-driven fixtures):

- A missing `prompt` field on one `selectCards` effect declaration.
- Missing attach cost and widened case names in the Bounty response test fixture.
- A Canvas pointer-handler connection after its source had unmounted during Reset.
  Three consecutive reset/resolution cycles passed without console errors after
  the fix; normal Wrath target selection was also checked after the fix.

Second round (2026-10-09, start-before-action fixtures): the fixtures were
redesigned so the player performs every activation through the normal board
instead of landing mid-resolution. Fixes that came out of that redesign:

- The adapter translated the board's `attachWeapon`/`detachWeapon` submissions
  into a `weaponId` payload the command builder never read, so attaching from
  the board always failed. They now send `cardId`, which the builder maps to
  the engine command.
- Activated abilities are now offered outside counter windows (with a ready
  check for engage-self costs), so Dragon's Breath can be activated from the
  Match action list, and weapon candidates are limited to the clash zone.
- Fixture and helper type gaps: submission objects are typed as
  `InteractionSubmission`, and the Wrath log assertion narrows success before
  reading `engineLogRecords`.

Browser validation on 2026-10-09 drove the Restore fixture end to end on the
production board: Match action list → Initiate a clash → attacker/target
selection → counter and obstruct passes → the on-board "Restore 1?" prompt.
Decline kept deck 6 / Oblivion 2 with the opponent at 29 health, and the
action list offered the new attach and activated-ability actions. The
in-app browser compositor throttled mid-session (rAF starvation breaks the
projection-driven hit-target layer and Mantine transitions), so the remaining
board branches were validated by the automated checks below rather than
interactively; a human should still walk the table above.

Third round (2026-10-09, later): fixture states must be real, continuable game
states — the right cards in the right places, with normal play able to proceed.

- Fixture tables now run on the practice page's runtime mode switch: **self**
  plays both seats, **bot** hands the other seat to the practice bot (the same
  `takeAutomatedAction` loop as a normal practice match).
- A headless proof now plays every fixture state for at least three turn
  changes: Player One answers its prompts and passes steps while the practice
  bot drives Player Two — no fixture-specific shortcuts.
- The same flow was verified interactively on the Restore board: with the bot
  enabled, Player Two drew, deployed a resource, attacked, resolved the clash
  after the human declined to obstruct, and the game reached Turn 7 on the
  human's Expansion step.

Fresh automated results: engine catalog suites 475 passed (including the
optional-Temper and updated authored regressions), simulator optional-fixture,
prompt, and visual-fixture suites 34 passed, adapter suites 31 passed with the
same 5 failures that already fail on main (distract, discard-choices,
oblivion-play, trap-responses; unrelated to this branch). Adapter TypeScript
checks passed, and app TypeScript is clean for every Alpha Clash file.
Changed files pass `vp fmt`.

Focused automated checks cover native choice results for all four effects
(both branches), actor-only prompts, hidden information, invalid/stale input
rejection, and rejected-submit retry. Do not use browser offline mode as a
retry test: these local fixtures do not send their choice through a network
transport.

## Scope limits

These checks prove local native-engine/adapter/board behavior. They do not prove
hosted multiplayer, gateway delivery, reconnect, deployment, or production.
A separate two-player hosted test is needed before release.

The current real-card catalog has no authored paid optional Void effect.
This fixture covers optional banish and draw beside mandatory Void. It does
not claim to cover a paid optional Void card.
