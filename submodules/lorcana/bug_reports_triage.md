# Bug-report triage — 2026-05-16

Source: `bug_reports.md` (1551 reports, all with status `open` in DB).

Method: deterministic keyword/cluster matcher applied to each description, cross-
referenced with recent fix commits and the May-15 daily triage report.
Classification confidence varies — single-word matches against popular card names
catch most card references; the `needs-card-identification` bucket holds reports
whose description names no recognizable card (often vague: "stuck", "error",
"my opponent did X").

## State summary

| Count | State | Meaning |
| ---: | --- | --- |
| 227 | `fixed-in-engine` | Likely fixed in engine (recent commit ≤ report date) |
| 1 | `fixed-in-card` | Likely fixed by card-text update |
| 1 | `verify-after-fix` | Reported AFTER a relevant fix shipped — verify resolution |
| 4 | `covered-by-test` | No engine bug confirmed; regression test added |
| 6 | `no-bug-confirmed` | Investigated, no engine bug reproduced |
| 653 | `open-card-bug` | Open: card-specific bug, no known fix yet |
| 35 | `ui-investigation-needed` | Open: UI / client surface investigation needed |
| 534 | `needs-card-identification` | Open: description references no known card by name |
| 21 | `question-or-comment` | User question or rules confusion, no engine action |
| 14 | `non-bug (comment/suggestion)` | Praise, feedback, or feature request |
| 3 | `vague-or-insufficient` | Insufficient detail to action |
| 8 | `out-of-engine-scope (network)` | Network / connection issue (out of engine scope) |
| 1 | `out-of-engine-scope (replay UI)` | Replay UI (out of engine scope) |
| 4 | `out-of-engine-scope (matchmaking)` | Matchmaking (out of engine scope) |
| 8 | `out-of-engine-scope (undo UX)` | Undo UX (out of engine scope) |
| 9 | `out-of-engine-scope (skip-ability UX)` | Skip/queue UX (out of engine scope) |
| 9 | `out-of-engine-scope (client crash)` | Client crash (out of engine scope) |
| 4 | `out-of-engine-scope (timer)` | Turn timer (out of engine scope) |
| 9 | `out-of-engine-scope (chat UX)` | Chat / free-text UX (out of engine scope) |

## Top clusters by primary card

| Reports | Card cluster |
| ---: | --- |
| 44 | cheshire cat |
| 26 | luisa madrigal |
| 23 | mulan |
| 21 | be king undisputed |
| 21 | hercules |
| 20 | genie |
| 19 | mickey mouse |
| 17 | diablo |
| 16 | mulan elite archer |
| 16 | cinderella |
| 16 | belle |
| 15 | hades |
| 15 | mr incredible |
| 15 | diablo devoted herald |
| 15 | madam mim elephant |
| 14 | demona |
| 13 | emerald chromicon |
| 13 | anna soothing sister |
| 12 | the black cauldron |
| 12 | merida |
| 11 | touch the sky |
| 10 | pete |
| 10 | hades looking for a deal |
| 9 | moana |
| 9 | hades infernal schemer |
| 9 | madam mim |
| 8 | kida |
| 7 | the leviathan |
| 6 | elsa |
| 6 | he hurled his thunderbolt |
| 6 | ohana means family |
| 5 | bibbidi bobbidi boo |
| 5 | luisa madrigal confident climber |
| 5 | let it go |
| 5 | goofy |
| 5 | strength of a raging fire |
| 5 | three arrows |
| 5 | cheshire cat inexplicable |
| 5 | the horned king triumphant ghoul |
| 5 | lilo |

## Per-report state

Reports are listed grouped by state, newest first. The `cards` column shows the
matched card cluster (if any); `rationale` summarizes why the state was assigned.

### fixed-in-engine (227) — Likely fixed in engine (recent commit ≤ report date)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 03:32 | `qWKu6CwSlF` | do it again, luisa madrigal | Wouldn't let me use Luisa Madrigal's ability to move damage in one game and then in this game it allowed me to do it once correctly, then whenever i tried to... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-15 03:26 | `fDk2OQL6iM` |  | Bomb not exploding | matches 'sacrifice-banish-trigger': Sacrificed items now banish via banishAsAbilityCost so on-banish triggers fire. |
| 2026-05-15 03:09 | `1EnfjXAcW5` | diablo, mother gothel | mother gothel didn't move the 1 damage she was supposed to when I challanged with diablo | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-15 02:33 | `LfycAdeWy-` | violet parr | violet parr doesnt move damage on come out | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-14 23:06 | `K3jeEwd8B2` | luisa madrigal | Luisa Madrigal's effect was glitching - wouldn't let me select a character with damage for her ability. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-14 19:49 | `B9I0qqhy-G` | diablo | Cant shift diablo on turn with 2 action in my hand | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-14 17:02 | `wRwOw1lp2c` | mulan injured soldier | louisa madrigal still not allowing me to move damage from mulan injured soldier after paying my 1 ink | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-14 14:48 | `dI1KXVW6ua` | luisa madrigal | luisa madrigal trigtger dsnt work | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-14 04:08 | `t7wBmkVTrJ` | luisa madrigal | Set 12 Luisa Madrigal legendary effect does not work according to official rulings | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-14 01:12 | `kZQioyvzmf` | luisa madrigal | It will not let me use luisa's ability on my damaged characters | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-13 22:22 | `VwSGzwIf08` | luisa madrigal | Luisa is not moving the counters over to target | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-13 18:33 | `1VH1UDglrI` | luisa madrigal confident climber | luisa madrigal confident climber ability is not working properly. The rule is when you move the 4th damage on her you can move all the damage from her onto o... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-13 18:21 | `wf7hBD-vFI` | belle accomplished mystic | Belle - accomplished mystic was unable to move damage from one opposing character to another | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-13 17:24 | `_pmtAzM89p` | diablo | I am unable to shift my 3 drop Diablo onto my 1 drop Diablo, despite having an Action in my hand to discard. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-13 13:26 | `rkg1TJ--nZ` | diablo | i can´t shift diablo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-13 01:06 | `oyEdzy2GWq` | cheshire cat, lilo | Lilo should have the damage moved from liquidator and been banished despite the card's affect since Cheshire doesn't deal damage, but moves damage. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-13 01:06 | `_vxyG-5nK3` | cheshire cat | Cheshire effect is being seen as damage dealt instead of damage put. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 19:45 | `Q438J5ez3K` | luisa madrigal | cant move damage to luisa from sven? | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 17:25 | `SIyCd_O5bJ` |  | Bug waiting for chesire cat to move damage. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 17:23 | `c2gumF8P-5` | luisa madrigal confident climber | Luisa Madrigal - Confident Climber: I Can Take It ability does not work correctly | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 13:15 | `WS2kiPtsHf` | luisa madrigal | Luisa does not move damage from another character to her. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 05:10 | `3NSDDfxtyI` | cheshire cat | Bot game. Cheshire Cat could not resolve effect | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 02:34 | `a1TkyjB9hM` | luisa madrigal | Luisa’s move damage ability did not take damage off the target and put it into her | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-12 02:05 | `UlSDJ3dcX_` | chernabog unnatural force | Chernabog - Unnatural Force not triggering my discard | matches 'chernabog-opponent-chooser': Chernabog opponent chooser fixed May 12. |
| 2026-05-12 01:59 | `uzlK2VZsbU` | chernabog | Chernabog is not allowing my opponant to play a card from their discard for free | matches 'chernabog-opponent-chooser': Chernabog opponent chooser fixed May 12. |
| 2026-05-11 17:50 | `8kBWLRV8aX` | luisa madrigal | Luisa should be able to take 4 damage and use her ability before a game state check to move the damage to opposing character. She should not be banished by m... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-11 17:46 | `Il11LxRUb9` | luisa madrigal, mulan | Luisa I can take it ability not working correctly. I can pay the ink cost and select mulan, but the damage does not move | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-11 15:22 | `yZkHOrX35v` | luisa madrigal | Luisa ability not able to select character to move damage from | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-11 14:34 | `_BPuVw3SPk` | omnidroid v10, omnidroid v8, omnidroid v9, syndrome out for revenge | Used Syndrome - Out for Revenge, to return Omnidroid v10 from discard to hand, and used the second half of the effect to shift Omnidroid v9 onto Omnidroid v8... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-11 11:08 | `Td6Klq6T5m` | mr incredible | Mr. Incredible shift 5 draw ability didn’t activate when my steel 1 drop drkwing challenged | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-11 07:20 | `uflH7Z3O-X` |  | confident climber ability did not resolve, refreshing, trying every combination of clicking did not move the damage successfully | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-10 23:06 | `uJZY0AHCsp` | luisa madrigal | Luisa's ability cannot activate when she is less than 3 damage if resolved. With no damage, when attempting to select a target to remove damage from, it does... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-10 22:52 | `_UnJM18QWo` | luisa madrigal | solft lock with Luisa Madrigal legendary effect | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-10 02:49 | `D12ZApA2cQ` | cheshire cat | cheshire cat is buged | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-10 00:27 | `uq-wSH5fCw` | luisa madrigal | Luisa madrigal legendary ability not working | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-08 19:02 | `ulBLpwiHWT` | cheshire cat | Bot breaks when using Cheshire Cat, activates the boost ability withouy any damage on the board and freezes | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-08 18:30 | `HIY63w49W6` | diablo devoted herald | Diablo Devoted Herald is unable to shift discard an action card. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-08 11:12 | `HerkWU6cSZ` | diablo devoted herald | i cant shift diablo devoted herald sometimes | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 22:51 | `xf5_m0H19c` | mr incredible | Shift Mr Incredible with Baloo - Old Iron Paws on the field was challenged and banished despite having 8 strength. He should be able to be dealt damage due t... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 19:34 | `B-2PWHDrZP` | diablo | when tapped diablo dies to storm rage on i'm supposed to draw a card but i don't | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 19:11 | `9EDGL3D37i` | diablo | Unable to shift diablo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 19:09 | `U_qa0kCFo7` | diablo | cant shift diablo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 18:39 | `VaU0PzeqrG` | diablo, let the storm rage on, pete, strength of a raging fire | Diablo shifting seems to be bugged when shifting after ink has been spent. I was trying to shift him onto Morph after spending 3 ink on Pete Referee. I had t... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 02:59 | `KCIZ01RBXx` | mickey mouse brave little prince | Cannot challange with a Mickey Mouse Brave Little Prince shifted onto a Mickey Mouse Brave Little Prince. Cannot quest with a Mickey Mouse Brave Little Princ... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 00:52 | `MxQ_NC7Prj` | mr incredible super strong | Cannot challenge with a shifted Mr. Incredible Super Strong. This has cost me MANY games due to my inability to clear or draw cards. Also cannot quest with a... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-07 00:30 | `iP4Bg92Z20` | luisa madrigal | unable to move Luisa damage to Luisa using her trigger.  allows me to use an ink and popup comes up but when i select target it moves forward with nothing el... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-06 21:52 | `GAOt2T_gMs` | mickey mouse | Cannot quest with a shifted Mickey Brave Little Prince without questing all glimmers | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-06 16:54 | `mGwnfdjT5Z` | mr incredible | A shifted Mr. Incredible cannot quest or challange | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-04 23:03 | `9AjOXjW7p8` | diablo, you have forgotten me | Can't shift diablo even though I have action "you have forgotten me" in hand to discard | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-04 20:22 | `rZiNgDM09Q` | diablo devoted herald | Unable to shift Diablo - Devoted Herald after using available ink | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-04 06:09 | `7NGKXWInw1` | demona, the black cauldron | It won't allow me to play Demona under the Black Cauldron | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 18:09 | `hCu0FcuX6_` |  | When i play the shift woody. i quest but the ability to play a character for cost two or less will not trigger | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-03 12:10 | `56ZKr17Spa` |  | I cant shift outdiablo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-03 11:56 | `lo48tK_fUt` | cheshire cat | Could not figure out how to change the target for Cheshire cats damage moving ability. Selected the wrong character and could not change it | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 05:08 | `sQTDBhhMZ1` | demona, the black cauldron | It won't allow to play Demona under The Black Cauldron when I have 8 available INK | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 04:52 | `hRN_4PiPnC` | cheshire cat | Cheshire broken | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 02:13 | `gwr_KvM7K9` | luisa madrigal confident climber | Luisa Madrigal Confident Climber ability was not moving damage to her. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 02:06 | `WpDTBSiyET` | bruno madrigal, luisa madrigal | I don't think Luisa works. I paid the 1 ink and it did not move it off the bruno to her | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 01:17 | `1ysvIefOiv` | belle | Belle - Mystic doesnt move damage | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-03 00:19 | `76X0IDT9HN` | luisa madrigal | Im having trouble getting Luisa Madrigral's trigger to work. Anytime i select one of my characters to move a damage onto her it doesnt resolve the ability. i... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-02 11:09 | `OIZ6vCxenh` |  | cant shift | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-02 04:20 | `NgpBphEMPP` | cheshire cat | AI Opponent tried to activate Cheshire Cat's ability and somehow the game bugged up. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-01 22:01 | `Xz7Tg9ob-m` | mulan | Attacked with shift mulan and it did not prompt me to dmg another char | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-01 20:08 | `1GrCmXWBhZ` | belle | WONT MOVE DAMAGE WITH BELLE FROM ONE OF OPONENTS CHARECTERS TO ANOTHER | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-01 19:12 | `X9buy3QJYl` | diablo devoted herald | Diablo Devoted Herald. Wont let me shift | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-01 08:43 | `I6ZzmwioBM` | cheshire cat | Cheshire cat trying to boost to move counters from location to a character, got stuck. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-01 08:27 | `T8IS5Yf47L` | mulan | Mulan shift ability didn't fire when I challenged after shifting | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-01 03:49 | `jKTgfyplPV` | cheshire cat | cheshire cat's boost can't  choose in mobile | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-05-01 00:34 | `rSN2WeATbt` | diablo | cant shift diablo on 2 cost gray dialblo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-05-01 00:25 | `tFhudZ1d0U` | roller bob | Attempted to play Roller Bob, there were not 2 toys in the discard pile, and I was not permitted to skip the triggered ability to give him rush and was force... | matches 'forfeit-phase-guard': forfeitGame allowed in every phase (May 14). |
| 2026-04-30 22:34 | `CaS44uLgfQ` |  | Shifting a character stops me from questing, challenging, or even passing turn. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-30 16:58 | `933kdGvL_G` | bibbidi bobbidi boo, diablo, diablo devoted herald | 1. sometimes diablo - devoted herald cannot shift even if i have an action card in hand and a diablo in play.  2.When I sing The song BIBBIDI BOBBIDI BOO, I ... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-30 14:50 | `z2ZSH3ed4Y` | mickey mouse | Cannot quest or challenge with shifted mickey brave little prince | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-30 12:12 | `7IfZvNhe65` | cheshire cat | cheshire cat effect | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-30 00:45 | `DVqxuzu-KY` | mr incredible | Cannot challenge or sing with a shifted Mr. Incredible both immediately on shift and on subsequent turns | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-30 00:28 | `pTooVJ6w2U` |  | woody not allowing me to see cards and then wont allow me to play a 2 cost for free like it should.  shift woody. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 23:54 | `oSnEX9SO27` | mr incredible | Cannot challenge, sing, or quest with a shifted Mr. Incredible. Can only quest if I quest with all | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 22:09 | `-1puOXvyUL` | mickey mouse brave little prince iconic, mr incredible super strong | Cannot challenge with shifted with mickey mouse brave little price. Cannot challenge or sing with Mr. Incredible super strong upon shift. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 21:33 | `Dr_z93Pp6F` | mickey mouse brave little prince | Cannot challenge with a shifted mickey mouse brave little prince | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 21:23 | `hoBmPy0Flw` | cheshire cat | Cheshire cat damage transfer still not working on my phone. I click the target for "damage from" but it doesn't go on to the box and so confirm stays unclick... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 20:09 | `y-7UQWmTCg` | edna mode | Opponent is Amber Emerald. Somehow Edna is in play. The log said they shifted a Giant Cobra on top of Woody, in log. Visual bug and it's really a shift woody? | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 20:06 | `lre42g_MdV` | luisa madrigal confident climber | Luisa Madrigal confident climber doesn't resolve properly. It only lets me move from the character not to the character. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 19:35 | `Yii7TR1_A7` |  | Played Woody Shift and game played a Troub, this led to not being able to quest or pass turn options dissapeared! | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 19:09 | `BeUtYVcH47` |  | wont let me shift. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-29 13:26 | `pceEKB-D8e` | cheshire cat | Cheshire cat boost doesn't work | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 11:41 | `jFaku25Urz` | antonio madrigal, luisa madrigal | Some bug of Antonio Madrigal and Luisa Madrigal (Shift) | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 08:46 | `G-K7wH2XYd` | cheshire cat | When playing practise match, the bot can't seem to resolve cheshire - inexplicable's boost ability | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 06:31 | `I-Cnox0kTq` | cheshire cat | Cheshire Cate can't boost on turn it's played | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 04:38 | `GaaZsTznhF` | luisa madrigal | luisa madrigal's hability "i can take it" didn't allowed me to move damage to her | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 04:25 | `JN8xDuD5m3` | belle | CANT MOVE DAMAGE FROM BELLE | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-29 02:28 | `RX7i6KY7kH` | captain hook | Couldn't move damage from captain hook to Chief Powhatin.  Everything looked correct but the damage would not move over. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-28 22:50 | `laKr6mkJRu` | mulan elite archer | Cannot challenge with a shifted mulan elite archer to get her 5 damage cleve | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-28 22:15 | `KBvYQn6CPM` | cheshire cat | AI opponent played Cheshire cat and boosted it, however, there was no damage to move. This caused the AI to be stuck and it couldn't do anything else until i... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-28 17:33 | `Tw6CCv-1KO` | mr incredible | wont let Mr incredible shift | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-28 15:17 | `Zfx_H1DyHU` | cheshire cat | CHeshire cat stuck | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-28 04:38 | `n68lMxebN8` | mr incredible | Mr. Incredible (5 drop w/shift) didn't recognize the 1 drop Mr. Incredible as a valid shift target | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-28 00:28 | `huY0OtRW5y` | mr incredible | unable to shift mr. incredible 5 drop on the 1 drop mr incredible | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-27 20:42 | `zYB2aUoUIS` | mr incredible | Cant shift Mr Incredible | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-27 20:34 | `pN-KatOE2w` | mr incredible | Ruby Bob Parr shift to Mr. incredible doesn't work with 3 ink | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-27 20:18 | `Ia5Sq7jrGq` | luisa madrigal | Luisa does not need to be exerted to user her 1 cost ability | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-27 19:56 | `GdLJdoJeUd` | luisa madrigal | luisa madrigal isn't working correcltly | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-27 11:29 | `zYXgofTc7R` | diablo | no Diablo trigger at start turn | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-27 11:12 | `Fm8sh787hM` | luisa madrigal | Luisa Madrigal effect is pay 1 ink to use effect, but in the game it say exert to use effect | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-27 10:57 | `ztWTDIv_hu` |  | Hi, The effect of Louis Madrigal - confident climber is not working correctly. The damage is not shifted and she do not become exhausted when she uses her ef... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-27 09:01 | `EuKKPejeo5` | diablo devoted herald | Diablo - Devoted Herald draw trigger doesnt work | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-27 08:53 | `Iw3kXJTmay` | cheshire cat | AI Is stuck putting damage on another chosen character with Cheshire Cat | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-26 20:00 | `CpsUNjnEbL` | luisa madrigal confident climber | Luisa Madrigal - Confident Climber ability requires exerting in game but the card states it's pay 1 ink with no exertion required | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-26 11:21 | `ZzjYmQeNeP` | diablo devoted herald | Diablo devoted herald is Not triggered by opposing Draw during Draw Phase. Critical for Infinity format | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-25 18:01 | `AfiaErZY3T` | luisa madrigal | New 5 cost Luisa madrigal does not require exertion to use her ability. Should be able to just pay the ink cost at any point | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-25 03:36 | `MukzfNgLJd` | diablo | Diablo devted herald woldn't let me shift onto little diablo. It did the turn after, but then it did not let me draw for the diablo trigger at the start of m... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-24 21:59 | `r_funMrkok` | luisa madrigal | Luisa is programmed to need to exert to use her ability when it should be just pay 1 | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-24 21:06 | `Y0IviC6rEH` | alma madrigal keeper of the flame, luisa madrigal confident climber | Luisa Madrigal - Confident Climber has the wrong cost. It shows in the system it has to exert to move damage, but the card shows just paying 1 ink to do so. ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-24 19:35 | `ogzrGcq-60` | cheshire cat | Bot played Cheshire cat and gets stuck on moving damage as there is no damage to move. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-24 06:58 | `ObNU8WzZWn` | cheshire cat | Cheshire Cat can not move damage when no damage at any character but AI not pass turn | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-23 17:21 | `hgG2mP857M` | belle | Cant move damage from character to character with Belle. I select targets and click confirm and no damage is moved. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-23 09:15 | `bzGnzRxlue` | diablo devoted herald | i can not draw cards from diablo devoted herald | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-23 09:12 | `h2V1TRzzgZ` |  | i cant shift charachters. it wont let me select them | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-22 20:53 | `YWdRgggp_U` | kuzco | Kuzco impulsive lama, when shifted i cannot target any character on the opp board nor does it give them the option to  keeps coming up error ilgeal target | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-22 00:10 | `DcayszFlSa` |  | After I played Flit for my first move, I couldn’t move forward because I could not move damage to anyone and it would not alllow me the option to pass to my ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-20 12:36 | `egLZ91CKNz` | madam mim elephant | When Madam Mim Elephant has no damage on her, the turn begins stating she needs to select an opponent to move damage to, but the fact she has 0 damage seems ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-19 23:21 | `iux-dHADLN` | chernabog | Chernabog didn't allow me to play a character for free from my discard | matches 'chernabog-opponent-chooser': Chernabog opponent chooser fixed May 12. |
| 2026-04-19 22:41 | `jOf935OpmI` | madam mim elephant | Can't resolve madam mim - elephant when she has no damage. can't skip the effect so game can't progress.    There was damage on a another character of mine  ... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-19 21:20 | `l-oBU6H9lt` | madam mim elephant | Got stuck in a screen trying to resolve the beginning of turn trigger for Madam Mim Elephant. There was no damage, and it would not let me submit 0 or skip t... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-19 18:14 | `tteJuUKk51` | madam mim elephant | madam Mim - Elephant cannot resolve the Sneaky move effect. Target is not moving to target selection box and damage is not being properly selected on slider.... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-19 18:04 | `Kkpn0MiHSr` | madam mim elephant | Madam Mim - Elephant would not resolve it's ability at start of turn. Selected Character, selected 0 damage. Confirm button would not click. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-19 18:01 | `usv7IANIeB` | madam mim elephant | Madam mim elephant will not resolve it's ability at start of turn with no damage. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-19 17:17 | `jcHI3wCEeK` | cheshire cat, genie, mickey mouse | Willow has 2 extra willpower from Mickey for total of 4. Genie attacks Willow and gets 1 damage, Cheshire moves it to Willow. Willow gets banished but should... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-19 04:51 | `5C67Ui-Yx1` | cheshire cat | I was another game on mobile, not this one, with the Cheshire Whisper card, but the game interface did not let me choose the correct card to choose damage fr... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-19 01:22 | `1oBQ3Jc3yc` | genie | i did not get my draw cards for Fred Honeywell when my boost genie (with 3) was banished or when my shift Webby was banished | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-18 22:08 | `xPR2NsweMV` | diablo | diablo does not trigger a draw on opening opponent's draw | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-18 20:48 | `oaREuptG5h` |  | I should be able to shift disablo, but can't | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-17 21:38 | `j8pkDwwVb-` | demona, genie | The match log on the left is often wrong. While the gameplay is correct, it's saying the target is a different card on the field. Other times, the number of ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-17 15:22 | `seGA2L_8-w` | madam mim | Madam Mim effect is still broken. Can't select an opponent character to move damage on to. Game locked up. Unable to resolve trigger. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-17 09:59 | `ia9PWdqGPR` | madam mim | cannot cancel the effect of madam mim elefan | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-17 06:46 | `WIJT5RPKRY` | cheshire cat inexplicable | can't skip cheshire cat - Inexplicable effect when boosting. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-16 16:57 | `r92SXib50w` | diablo devoted herald | Diablo - Devoted Herald effect does not trigger on the initial card draw for the turn. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-16 16:28 | `4_foHZ7oNh` | madam mim elephant | Madam Mim Elephant makes me remove damage from the opponent onto one of my characters | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-16 14:54 | `hV1qudvRBU` | madam mim elephant | Madam Mim - Elephant's effect to move damage does not allow to confirm without damage | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-16 02:08 | `LWaliDhmGB` | madam mim | Mim didn't move damage at start of turn | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-15 20:19 | `Bgfnwl2Gc7` | demona | Royal Guard's challenger didn't increase when drawing off of Demona | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-15 19:51 | `mWQAmPPiWO` | madam mim elephant | Madam Mim (Elephant) is still broken. Please fix! I can't select her to move damage to another character. I can only select opposing characters. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-15 19:48 | `rD1IncaRfE` | cheshire cat perplexing feline | I'm notiicing that there does not seem to be an option to skip an optional effect. For example, Cheshire Cat - Perplexing Feline is requiring that I deal dam... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-15 17:39 | `q61vljoy_k` | anna soothing sister | I cannot shift Anna Soothing sister for 0 even if a play little anna and bring back a card from the discard into a deck | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-15 11:37 | `PJmGbP07HQ` | demona | Hey,   Royal Guard did not get +Strenght when i drew cards with demona. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-15 01:50 | `3fbKU0JR2m` | mulan | Did not work triggers for shift Mulan | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-15 01:41 | `5DcrgWqMaG` | cheshire cat | bot played cheshire cat, and doesn't do anything to resolve the effect and game can't go on | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-15 01:20 | `zUMBMzQICy` | diablo, diablo devoted herald | Was not allowed to shift Diablo - Devoted Herald by discarding an action while I had Diablo in play and actions in hand. Had to ink a card for turn before I ... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-15 01:16 | `1nvaqxNcbC` | diablo, diablo devoted herald | Diablo - Devoted Herald triggers when exerted and when an opponent draws a card on their turn. The opponent drew a card for turn (on their turn) while I had ... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-14 22:59 | `0HijvqVTB1` | cheshire cat, lilo bundled up | Lilo Bundled Up is not supposed to take damage from Cheshire Cat the first time that damage is moved. This is the way the card is meant to work | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-14 22:09 | `w1Hn1vXcUJ` | cheshire cat inexplicable | Bot Opponent not resolving effect from Cheshire Cat - Inexplicable | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-14 18:42 | `dfxQvZu911` | madam mim elephant | Madam Mim - Elephant not moving damage | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-14 18:28 | `uRVEHG2IF3` | madam mim elephant | Madam Mim elephant has the wrong stats it says willpower is 6 when it's 7. Also her ability isn't working, it's not moving damage at the beginning of the turn. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-14 17:38 | `P1Tu9U8fW3` | madam mim elephant | Madam Mim Elephant seems to be working backwards.  It is asking me who I want to move damage from for its effect and only allowing me to choose my opponents ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-14 15:33 | `1weFYSrd08` |  | I can't shift Anna for 0 even if a card left the discard | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-14 14:56 | `Sxx7c3MYkr` | diablo devoted herald | diablo devoted herald triggered while it was ready | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-14 14:56 | `YKDpvqgw9W` | diablo, diablo devoted herald | diablo devoted herald did not trigger when my opponent drew for turn while diablo was exerted | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-14 13:09 | `fgfrraXNRo` | madam mim elephant | Interface with Madam Mim Elephant seems to work correctly, but the images on the screen are very misleading.  The interface indicates the damage will move fr... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-13 16:16 | `Or7aLcq0xQ` | hiro hamada armor designer | Hiro Hamada - Armor Designer's shift Floodborn ability works only sometimes, even if Floodborn character has card under them | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-13 15:56 | `OyCYetLJ4w` | cheshire cat | Cheshire cat, cant choose a character to move the damage | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-13 07:18 | `4_wLCtnKa3` | cheshire cat, stitch, stitch carefree surfer | Can't choose opponent character (Stitch carefree surfer) with cheshire cat to move the damage from stitch to another opponent character | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-13 02:52 | `PsIBNV6jvG` | diablo | It is not giving me the option to draw off of diablo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-12 19:03 | `UIT9te5qcP` | cinderella, demona | Played Demona, drew 2 cards, Royal Guard's Challenger did not increase by +2. Should have been a 4/2 challenger which would have let me banish a Cinderella o... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-12 16:33 | `zJzzH3kYYv` | cheshire cat, genie, genie wish fulfilled, mickey mouse bob cratchit, mickey mouse brave little tailor | Error on my opponent's side: they had a Mickey Mouse (Bob Cratchit) exerted after questing the previous turn so it had 1 card under it. They played a Mickey ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-12 16:14 | `owE5SZtANl` | diablo | no diablo shift possible | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-12 16:12 | `rthQqmkqXY` | madam mim, madam mim elephant | Just reporting again for posterity: the ability "Sneaky Move" of Madam Mim (Elephant) isn't working properly. At the start of my turn, a dialog comes up for ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-12 15:57 | `Wbe7387Xxf` | madam mim | The dialog between turns doesn't allow me to select my Madam Mim to move damage to an opponent. Madam Mim is only selectable as a character to move damage on... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-12 11:00 | `sDeasnO10T` | hiro hamada | hiro hamada should be evasive and ward when shifted, he is not | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-12 10:58 | `Xkt943uTIP` | diablo | Diablo's effect is notting | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-12 10:30 | `3CeZJRwlAJ` | madam mim elephant | Madam Mim Elephant's damage effect doesn't allow to choose her first | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-12 09:57 | `314OkOb779` | demona | Royal Guard didn't get attack from Demona's draw | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-12 03:13 | `QsUFcJii08` | demona | My Royal Guard should have Challenger 3 after I drew 2 with Demona, he only has Challenger 1 from turn draw. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-12 00:16 | `t9lCiuA_A1` | mulan elite archer | With Mulan Elite Archer i could only target one character when i attack when shiftet | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-11 22:30 | `l15BAGvOQx` | demona | Cards drawn from demona ability didn't trigger royal guard | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-11 19:39 | `MVEzQFgfkX` | cheshire cat, elsa | I couldn’t select my Elsa for Cheshire Cat | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-11 19:27 | `w7SfuhCtTO` | cheshire cat | cheshire cat effect don't trigger on AI. Gets stuck | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-11 16:18 | `9aKSrQmyP3` | anna soothing sister | Anna Soothing sister unusual transformation not working. Doest let me shift for free. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-11 13:51 | `kSxLQRxG6g` |  | The shift interaction with ANNA does not work the one that allows you to shift for zero.  And also the Small 2 drop anna that interacts with discard is bound... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-11 11:54 | `EOBhDvV5ER` |  | Some abilities you cannot deside wich carcter you want to use the ability on same with the shift | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-11 11:46 | `BKLWelinNs` |  | Tegensrander kan niet shifte. Op tablet | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-11 11:45 | `kST0CsDebs` |  | Ka niet shiften | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-10 21:34 | `x1KnYXpk2E` | cheshire cat inexplicable, the robot queen | Game became stuck after the AI played Cheshire Cat Inexplicable, because no targets.   Also, Darkwing Duck's ability that deals 2 damage to a chacter after b... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-10 07:03 | `w5ehsgPmiW` | cheshire cat | Cheshire cat boost ability isn't working for opponent or is unclear how to use on interface | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-10 05:07 | `ZCs_WjmSwn` | cheshire cat | Won't allow me to boost with a cheshire cat when still drying. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-10 04:17 | `8EZ2Z90ssd` | demona, iago | unable to use boost effect on chesire to move 2 damage off of demona and put onto an iago on the opponents side | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-10 02:33 | `WnymuSa7k3` | demona, kronk | I am trying to banish a Kronk that costs 5 to the green evo device to play Demona that costs 6, but it does not let me play a character after it banishes Kronk | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 23:22 | `1CANDN0lzU` | cheshire cat from the shadows | Would not allow me to properly move damage with Cheshire Cat from one opponent's character to another | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 20:26 | `VDjVgeOEVr` | cheshire cat | I cant press the Boost button on Cheshire cat | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 17:03 | `KYygii3e_X` | diablo | I can't shift diablo | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-09 15:07 | `qEJpdTJC7b` |  | Boosting Cat did not properly move damage. There is also not an option to only pick 1 damage to move | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 13:37 | `l_hThcthkZ` | cheshire cat | AI got stuck trying to activate cheshire cat ability when there was no damage on board. Turn stuck on AI | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 13:09 | `yaB7hZDaVm` | cheshire cat, diablo, ursula | Coldnt move damage with cheshire cat boost from 1opponent character (Ursula) to another (diablo) | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 13:01 | `N1jP7RZHdH` | cheshire cat | Cheshire Cat's ability didn't work. It should let you pick the first character, decide how much damage to move, then pick the second character. It just has y... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 12:29 | `0uUsOLMhye` | demona | I drew three cards with Demona but my Royal Guard did not gain the Challenger +3. He still only did 2 damage. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 11:29 | `xUFuE986K-` | cheshire cat, genie | Hello! Excellent version of lorcanito but in this game I couldnt boost (Cheshire cat, genie researcher) for some reason. Please have a look at boost mechanic... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 09:43 | `xHPyBgkzIX` | merlin intellectual visionary | Merlin - Intellectual Visionary is not looking for a card in deck when shifted | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-09 06:14 | `5aS6rdPoOI` | cheshire cat, cinderella | Opponent appeared to be unable to use Cheshire Cat's ability on my Cinderella with 2 damage to my Clarabelle with 4 while I had 2 snow forts out. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 06:03 | `3x7A30R-hn` | diablo | diablo 3 draw mecahnic trigger does not work when opponent draws for turn | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-09 05:44 | `ZEx0y8WUGJ` | demona | AI opponent used demona. exerting my cards and I draw a 3rd card. I have Goliath out. Opponent passes. It's making me choose a card to discard. I should not ... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 03:22 | `_tX_uPyZGc` | demona | Challenges in the log are inverted - it lists the challenger/challengee the wrong way around so it looks like damage being applied is wrong. The same happens... | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 01:38 | `D6gclcT1XV` | cheshire cat | Unable to use Cheshire cat boost ability moving damage from one opponent card to another. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-09 01:21 | `9XUfEfdk_o` | anna soothing sister | Couldn't shift Anna soothing sister | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-09 01:20 | `iyyC6jmdI6` | belle apprentice inventor | Can't use belle apprentice inventor's ability (tried to do so and it said no valid targets while popsickle was in play). | matches 'sacrifice-banish-trigger': Sacrificed items now banish via banishAsAbilityCost so on-banish triggers fire. |
| 2026-04-09 01:05 | `H3n7FbQlae` | belle apprentice inventor, unconventional tool | There's an option to play Belle Apprentice Inventor by sacrificing a card, but even with the Unconventional Tool on the field I get the message that there is... | matches 'sacrifice-banish-trigger': Sacrificed items now banish via banishAsAbilityCost so on-banish triggers fire. |
| 2026-04-08 22:51 | `ehwuSs98d-` | demona | Goliath. should be under stone by day and not be able to reset when I played demona and opponent doesn't get dusk to dawn effect | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 22:30 | `hahVoB0pn0` | cheshire cat | AI plays Cheshire Cat and Boosts (2) when there are no valid targets with damage. Freezes the game. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 22:05 | `K88hjVhH0l` |  | max goof the 6 cost shift does not allow you to choose the target from the discard to re play | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 19:13 | `Z3qqMs00Dd` | diablo | I can't shift Diablo? | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 18:50 | `Wvt1kk1iUq` | diablo devoted herald | diablo devoted herald draw effect not working as intended on standard card draw | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 18:34 | `_R7V_Q3zZA` | emerald chromicon | Opponent played 2 emerald chromicon and shifted lady with 3 ink available | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 16:14 | `MHgmUr5rkv` | cheshire cat | cant use dumbos effect or cheshire cat | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 16:12 | `P-WCxbMrO4` | cheshire cat | I  cant boost cheshire cat on turn played. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 15:58 | `iqj1Huf4W3` | diablo, ursula deceiver | after playing ursula deceiver, I was unable to shift my big diablo onto my smaller one | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 15:14 | `fzxnccSaly` | cheshire cat inexplicable | AI opponent played Cheshire Cat Inexplicable and the game state stuck with it selecting a target for it's effect. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 15:09 | `-UHlLB1_R2` |  | when using cat to try and move damage between two OPPOSING characters the game will not move the damage. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 14:46 | `OTjYfTV8do` | belle apprentice inventor | On turn 1 I inked 1 card and was able to play 2 of my 1 cost Unconvential Tools. Also, I was unable to play Belle Apprentice Inventor using her ability to di... | matches 'sacrifice-banish-trigger': Sacrificed items now banish via banishAsAbilityCost so on-banish triggers fire. |
| 2026-04-08 14:35 | `-LhqcZeDaU` | cheshire cat | Cheshire Cat moving damage didn't work | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 14:03 | `kx_qHkWU-R` | demona | Royal Guard did not gain challenger from Demona draw | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 13:59 | `hsUXmcuTW4` |  | The game was not correctly keeping track of my available ink. I had a Grandmother Willow and a 1 cost Rhino on board, and it let me play a 2 cost Angel; Shif... | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 13:20 | `v221p-S2jg` |  | cant shift clarabell and can play multiple spells with not enough ink | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-08 13:11 | `ZKgGcQyzB7` | demona | Royal Guard does not get the challanger + after playing demona | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-08 12:30 | `vxkcFgPhMs` |  | Can't shift my Clarabelle | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-05 05:07 | `43p7IlhW_3` | cheshire cat | AI triggered Cheshire Cat's boost when nobody on the field was damaged - it seemed to get stuck with not being able to make a choice. I resolved manually. | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |
| 2026-04-03 20:38 | `xGa1pDEf8p` |  | Carabelle 7 drop cannot shift | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-02 18:09 | `jvFM6uKyDi` | they never come back | Opponent played They Never Come Back on my 1 drop Clarabelle and now on my turn I do not get the option to shift big 7 drop Clarabelle on top of it for 5 ink. | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-04-02 03:34 | `JvMtK-qw4i` | diablo devoted herald | Diablo - Devoted Herald is not drawing a card for enemy drawing a card | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-03-31 14:23 | `qU8tGCsOop` |  | Clarabelle can't shift | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |
| 2026-03-30 17:45 | `p4vA4JfQBj` |  | Game won't let me shift Clarabelle | matches 'shift-availability': getAvailableMoves now lists shift-only cards in shiftCard bucket. |

### fixed-in-card (1) — Likely fixed by card-text update

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 03:32 | `7gz9qiJ9dW` | promising lead | promising lead does not give character support | matches 'promising-lead': Promising Lead now grants +1 lore and Support to chosen character. |

### verify-after-fix (1) — Reported AFTER a relevant fix shipped — verify resolution

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-16 00:04 | `ye8Cdoy9kv` | demona, frozone | Put damage from demona onto frozone and it just took all damange off and readied | matches 'move-damage-resolver': Move-damage slot-aware resolver + target-analysis fix (May 15). |

### covered-by-test (4) — No engine bug confirmed; regression test added

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 03:11 | `5vVEOLW1HL` | hand in the box | Hand in a box cant enter for free | matches 'hand-in-the-box': Hand-in-the-Box visual fixture added May 15; no engine bug confirmed. |
| 2026-04-28 09:10 | `eRwjjOORkI` | hand in the box sids toy | Hand in the box card would not let me put a card from my discard to the bottom of my deck, so that i could play the character for free | matches 'hand-in-the-box': Hand-in-the-Box visual fixture added May 15; no engine bug confirmed. |
| 2026-04-26 16:42 | `MgrQYS0N86` | hand in the box sids toy | iwasnt given the option to play hand in the box for free by using its trigger. | matches 'hand-in-the-box': Hand-in-the-Box visual fixture added May 15; no engine bug confirmed. |
| 2026-04-24 23:01 | `5YGhGyct5l` | hand in the box | I should be able to use the ability from the card Hand in a Box to play it for free by moving a toy character from my discard to the bottom of my deck | matches 'hand-in-the-box': Hand-in-the-Box visual fixture added May 15; no engine bug confirmed. |

### no-bug-confirmed (6) — Investigated, no engine bug reproduced

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-04-29 06:26 | `b3hBJ__wVD` | mickey mouse snowboard ace | Mickey Mouse - Snowboard Ace triggers on each challenge not just when it's banished | matches 'snowboard-ace-trigger': Investigated and added regression coverage; no engine bug. |
| 2026-04-28 02:44 | `mrGp5lHN6y` | snow fort | The Card images are too small when playing on a laptop. i was not able to select indivudal cards for any actions after i got 3 characters on board with a sno... | matches 'snowboard-ace-trigger': Investigated and added regression coverage; no engine bug. |
| 2026-04-24 05:14 | `o-ESzM9XOL` | snow fort | Won't let me choose the snow fort to banish | matches 'snowboard-ace-trigger': Investigated and added regression coverage; no engine bug. |
| 2026-04-14 23:15 | `HM7z6xE0vk` | mickey mouse snowboard ace | Forced to discard a card when challenging but not banishing Mickey Mouse Snowboard Ace | matches 'snowboard-ace-trigger': Investigated and added regression coverage; no engine bug. |
| 2026-04-11 15:01 | `wNR-KZ8SG9` | snow fort | I don't think the top part of Snow Fort is being applied on my turn | matches 'snowboard-ace-trigger': Investigated and added regression coverage; no engine bug. |
| 2026-04-10 00:03 | `nIYf3DORXS` | snow fort | Snow fort does not give my characters resist when being I’m being attacked on opponents turn. | matches 'snowboard-ace-trigger': Investigated and added regression coverage; no engine bug. |

### open-card-bug (653) — Open: card-specific bug, no known fix yet

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-16 02:59 | `f3sVwWB7yT` | right behind you | I played Right Behind You but was not allowed to play a Seven Dwarfs Character for free | references right behind you; not covered by recent triage fixes |
| 2026-05-16 01:45 | `cHn1tDcsmc` | malicious means, mrs incredible | Malicious mean etc can’t kill Mrs incredible she has resist plus 1 | references malicious means, mrs incredible; not covered by recent triage fixes |
| 2026-05-16 00:32 | `G_rKnff1Yv` | the leviathan | You lose, the oponent player the leviathan the cost 10 for 5 in 3 play  Perdí,  el oponente jugo the leviathan de coste 10 por 5 en las 3 partidas y eso con ... | references the leviathan; not covered by recent triage fixes |
| 2026-05-15 23:57 | `3-TkVs2GTg` | julieta arepas, julieta madrigal | Julieta's Arepas won't let me choose a character who has no damage to resolve the effect (no characters have damage) so I get stuck and can't continue playing. | references julieta arepas, julieta madrigal; not covered by recent triage fixes |
| 2026-05-15 23:57 | `iimxAEvJ8J` | julieta arepas, julieta madrigal | No le deja elegir personaje para remover daños con las arepas de julieta | references julieta arepas, julieta madrigal; not covered by recent triage fixes |
| 2026-05-15 21:01 | `C51U8XdrVq` | horseman's strike | Played horseman's strike on a character that was supposed to be evasive until the start of their next turn and I was not able to banish it. | references horseman's strike; not covered by recent triage fixes |
| 2026-05-15 18:26 | `V3bAYMNZnz` | bruno madrigal | I played bruno returns and selected a character to returm to my hand but it did not work | references bruno madrigal; not covered by recent triage fixes |
| 2026-05-15 16:40 | `3LgbcwiclL` | right behind you | RIGHT BEHIND YOU If you have a Seven Dwarfs character "and" a Princess character in play, you may play a Seven Dwarfs character for free.  But now only have ... | references right behind you; not covered by recent triage fixes |
| 2026-05-15 16:04 | `AfXMVNB8nE` | roller bob | The card "roller bob" should have let me put 2 character cards from my discards on the bottom of my deck to give this character "rush", but the app wouldn't ... | references roller bob; not covered by recent triage fixes |
| 2026-05-15 15:12 | `xzaCnYZyVq` | bibbidi bobbidi boo | Bibbity boppity boo does not work | references bibbidi bobbidi boo; not covered by recent triage fixes |
| 2026-05-15 10:18 | `kSUCmdchQv` | elsa | was not able to use elsa's effect  — Chosen character gains Challenger +2 and Rush this turn. (They get +2 while challenging. They can challenge the turn the... | references elsa; not covered by recent triage fixes |
| 2026-05-14 20:58 | `lCIqCt_saL` | how far i'll go, sapphire coil | sang "how far i'll go" with grama tala and had an sapphire coil. could not target an opponents character to reduce the attack | references how far i'll go, sapphire coil; not covered by recent triage fixes |
| 2026-05-14 19:20 | `nHVSpQ6QMV` | peter pan | Not letting me gain lore after challening peter pan. also not sure if I am always getting SIDS double prize lore.. | references peter pan; not covered by recent triage fixes |
| 2026-05-14 18:37 | `QVBQ8vFgO7` | sail the azurite sea | Wouldnt let me ink the second time for sail the azurite sea | references sail the azurite sea; not covered by recent triage fixes |
| 2026-05-14 16:17 | `M-gi4Vj9AL` | desperate plan | the action card "desperate plan" does not let you discard when you have cards in your hand | references desperate plan; not covered by recent triage fixes |
| 2026-05-13 22:20 | `hdiYN7hwG5` | captain hook | Captian Hook Underhanded   can't quest for whatever reason | references captain hook; not covered by recent triage fixes |
| 2026-05-13 20:52 | `g2OcxZ71M4` | bibbidi bobbidi boo | Bibbidi Bobbidi Boo still doesn't work | references bibbidi bobbidi boo; not covered by recent triage fixes |
| 2026-05-13 19:31 | `iTy_83Tdk2` | mulan, mulan injured soldier | louisa madrigal will not allow me to move my damage from mulan injured soldier to her. i paid the 1 ink and clicked mulan, louisa did not take her damage | references mulan, mulan injured soldier; not covered by recent triage fixes |
| 2026-05-13 18:34 | `s-MwcLXxfh` | the family scattered | The Family Scattered doesn't work properly. | references the family scattered; not covered by recent triage fixes |
| 2026-05-13 17:09 | `5wr-Vwp7vg` | sword of shan yu | unable to use sword of shan yu item, played but no action | references sword of shan yu; not covered by recent triage fixes |
| 2026-05-13 16:10 | `ybfHRLaHKa` | beast | rush not working on beast | references beast; not covered by recent triage fixes |
| 2026-05-13 15:21 | `dzF2V4-GB7` | captain hook underhanded | Captain Hook - Underhanded can never quest | references captain hook underhanded; not covered by recent triage fixes |
| 2026-05-13 13:30 | `IenLR8ysez` | bibbidi bobbidi boo | i cant play with bibbidi bobbidi boo the same card | references bibbidi bobbidi boo; not covered by recent triage fixes |
| 2026-05-13 13:12 | `GzE9gCGWNV` | mickey mouse expedition leader | Mickey Mouse - Expedition Leader doesn't give you the option to enter the field tapped. | references mickey mouse expedition leader; not covered by recent triage fixes |
| 2026-05-13 12:10 | `CdRpTtw9C0` | mickey mouse | de mickey mouse expidition don't turned | references mickey mouse; not covered by recent triage fixes |
| 2026-05-13 11:04 | `XzHkFbf_cS` | let it go | Hi can't hold it back any more do not work | references let it go; not covered by recent triage fixes |
| 2026-05-13 04:37 | `Jd_HXuTMKP` | alien | Alien effect is not working. Card is not returning back to hand. | references alien; not covered by recent triage fixes |
| 2026-05-13 02:28 | `ogcHcoBZdG` | baymax, hiro hamada | Baymax triggered Hiro when it shouldn't have | references baymax, hiro hamada; not covered by recent triage fixes |
| 2026-05-12 19:17 | `mLFQGWk542` | hades | hades could choose an Ward hades as target | references hades; not covered by recent triage fixes |
| 2026-05-12 18:52 | `kFpGx_znuv` | mickey mouse | mickey mouse let my opponent discard a card afte a challenge, while he was still in play | references mickey mouse; not covered by recent triage fixes |
| 2026-05-12 16:59 | `AAAu_6oEQz` | mickey mouse | The new *mickey *Amber can't enter exhausted | references mickey mouse; not covered by recent triage fixes |
| 2026-05-12 11:32 | `imeVQmGYoR` | mickey mouse | can't play mickey mouse exerted | references mickey mouse; not covered by recent triage fixes |
| 2026-05-12 09:55 | `jjAMSsDDlm` | mushu majestic dragon | Mushu - Majestic Dragon - the resist effect appears to have stacked with every challenge | references mushu majestic dragon; not covered by recent triage fixes |
| 2026-05-12 04:42 | `I1tcOR50dh` | mickey mouse amber champion | Mickey Mouse - Amber Champion Effect “Friendly Chorus” is not activating upon conditions met for neither solo singer nor when singing together. | references mickey mouse amber champion; not covered by recent triage fixes |
| 2026-05-12 00:44 | `rWvVNnomM5` | this growing pressure | "this growing pressure" song is not working the opposing character is not being forced to quest, it only says they cant challenge | references this growing pressure; not covered by recent triage fixes |
| 2026-05-11 19:47 | `xqni_EXTx9` | syndrome | I can't pass turn if i quest with Syndrome Out of Revenge without Robots on the discard | references syndrome; not covered by recent triage fixes |
| 2026-05-11 19:42 | `HUCa69XfZI` | merryweather | Card Log is still incorrect. played Merryweather, but read as Cincerella - among other | references merryweather; not covered by recent triage fixes |
| 2026-05-11 19:05 | `93K7Jcxhg7` | fergus | when fergus quested while at a locvation i didnt get to choose what location to play. it auto chose for me | references fergus; not covered by recent triage fixes |
| 2026-05-11 19:04 | `FB7qbH43Va` | fergus | fergus didnt get to deal damage when a location he was at was challanged and banished | references fergus; not covered by recent triage fixes |
| 2026-05-11 03:07 | `YxThjHEssf` | fergus | Can't choose which location to play from Fergus's ability | references fergus; not covered by recent triage fixes |
| 2026-05-11 02:23 | `_asW9i6WVW` | donald duck, mirabel madrigal | daisy donald's date sent mirabel, family gatherer to the bottom of the deck rather than into my hand. | references donald duck, mirabel madrigal; not covered by recent triage fixes |
| 2026-05-10 20:55 | `rMiMTQhxJ_` | down in new orleans | could not play bodyguard character exerted after revealing from Down in New Orleans | references down in new orleans; not covered by recent triage fixes |
| 2026-05-10 20:11 | `vz-NThWSP8` | julieta madrigal | When Julieta gives the option to remove up to 2 damage, there doesn't seem to be a way to choose removing just 1 damage instead of 2. | references julieta madrigal; not covered by recent triage fixes |
| 2026-05-10 17:53 | `NyKm12vam3` | horseman's strike, minnie mouse daring defender | Minnie Mouse daring defender did not register as having 3 strength when she had 3 damage and was banished by headless horseman even though she had more than ... | references horseman's strike, minnie mouse daring defender; not covered by recent triage fixes |
| 2026-05-10 17:28 | `6AEQc-p_FG` | robin hood desert wanderer | Robin hood-Desert Wanderer was unable to attack Locations. | references robin hood desert wanderer; not covered by recent triage fixes |
| 2026-05-10 08:42 | `Ga0yworvAT` | moana | Moana not inking from discard | references moana; not covered by recent triage fixes |
| 2026-05-10 07:30 | `3EkG10q1EI` | pete | Can't pay 1 ink to boost Pete | references pete; not covered by recent triage fixes |
| 2026-05-10 04:49 | `zAgA5SalYZ` | merida, moana curious explorer | merida comes up as moana curious explorer | references merida, moana curious explorer; not covered by recent triage fixes |
| 2026-05-10 03:27 | `O_x9cas5PK` | horseman's strike, mrs incredible | Horseman Strikes does not work on Mrs. Incredible if the opponent chose to make her evasive until the start of their turn | references horseman's strike, mrs incredible; not covered by recent triage fixes |
| 2026-05-10 01:01 | `4KEImzvEr_` | firefly swarm | firefly swarm not working as intented. I select the 2nd option and nothing happens, I select the first option and it only lets me banish a character with 2 s... | references firefly swarm; not covered by recent triage fixes |
| 2026-05-10 00:54 | `wptdN8EJIT` | moana curious explorer | Moana Curious Explorer wasn't letting me ink from my inkwell... or at least I can't figure out how it's supposed to work. | references moana curious explorer; not covered by recent triage fixes |
| 2026-05-09 15:17 | `dXJRLCRJ0D` | syndrome out for revenge | Syndrome, Out for Revenge I was unable to put a robot from my hand into play unless there was one in the graveyard to start. | references syndrome out for revenge; not covered by recent triage fixes |
| 2026-05-09 08:54 | `n1RuWcZJM_` | goofy | goofy groundbreaking chefs is removing damage and readying opponents exerted damaged cards. | references goofy; not covered by recent triage fixes |
| 2026-05-09 08:12 | `cK1F3sdqO_` | bibbidi bobbidi boo, bounce | Early access is gone but Bibbidi Bobbidi Boo still doesn't work. It lets me bounce a character back but won't let me replay them for free. | references bibbidi bobbidi boo, bounce; not covered by recent triage fixes |
| 2026-05-08 23:09 | `rY0Djh-VIl` | scrump | Scrump ability not working? mowgli is availble... | references scrump; not covered by recent triage fixes |
| 2026-05-08 22:08 | `HScSXng8sd` | we know the way | We Know the Way did not resolve properly. I was playing Monstro Combo and shuffled a card into my empty deck, it should have them played for free due to the ... | references we know the way; not covered by recent triage fixes |
| 2026-05-08 18:10 | `aBj_n2mOz6` | sugar rush speedway finish line, tuk tuk lively partner | When I used Tuk Tuk - Lively Partner to move a character from a location into Sugar Rush Speedway - Finish Line, "Bring it Home, Kid!" was resolved for both ... | references sugar rush speedway finish line, tuk tuk lively partner; not covered by recent triage fixes |
| 2026-05-08 18:04 | `_atTJYPLY1` | mickey mouse pirate captain, winnie the pooh hunny pirate | Mickey Mouse - Pirate Captain quested and gave Winnie the Pooh Hunny Pirate +2 strength but did not give the "this character takes no damage from challenges ... | references mickey mouse pirate captain, winnie the pooh hunny pirate; not covered by recent triage fixes |
| 2026-05-08 17:38 | `NLew5qeP6Q` | the sword of shan yu | The Sword of Shan-Yu does not work | references the sword of shan yu; not covered by recent triage fixes |
| 2026-05-08 14:42 | `HpBWXzkUqI` | mr incredible super strong | On several occassions I could not challange with calhoun and Mr. Incredible super strong | references mr incredible super strong; not covered by recent triage fixes |
| 2026-05-07 22:33 | `egnGaxK4bL` | hades looking for a deal, nani stage manager | Hamish, Hubert and Harris doesn't allow exert on play.  Nani - Stage Manager doesn't reveal the selected card.  Hades - Looking for a Deal doesn't show which... | references hades looking for a deal, nani stage manager; not covered by recent triage fixes |
| 2026-05-07 20:26 | `j5rVcCdWo_` | mrs incredible | I wasn't able to ready mrs incredible after a second challenge. You should be able to ready mrs incredible any amount of times, including when she banishes a... | references mrs incredible; not covered by recent triage fixes |
| 2026-05-07 17:25 | `OXXmNdW5Wc` | the black cauldron | I cannot play cards from under the Black Cauldron. It shows them in my hand, but does not give me the option to play those cards (I have enough ink). | references the black cauldron; not covered by recent triage fixes |
| 2026-05-07 16:28 | `ZRGbvob19s` | he hurled his thunderbolt | Unable to sing He Hurled His Thunderbolt on any opposing characters | references he hurled his thunderbolt; not covered by recent triage fixes |
| 2026-05-07 16:16 | `1j5UszNmel` | potion of might | Potion of Might didn't give Taursa Bulba, a Villain plus 4 strength | references potion of might; not covered by recent triage fixes |
| 2026-05-07 16:07 | `VYZVq5Sgch` | be king undisputed | Be king undisputed won't let me choose a target and confirm? | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 15:57 | `sgL5YX7vG5` | be king undisputed | wont let be king undisputed resolve | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 15:52 | `DrRWt7bSt0` | willie the giant ghost of christmas present | Willie the giant is not usable. | references willie the giant ghost of christmas present; not covered by recent triage fixes |
| 2026-05-07 15:38 | `xOtyJhW8bH` | be king undisputed | Be King Undisputed doesn't allow opponent to choose target | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 15:08 | `6MgLeNLfUD` | be king undisputed, maui | Opponent played be king undisputed with maui shark in play.  Game would not let me select my character to banish from be king with the shark trigger on the s... | references be king undisputed, maui; not covered by recent triage fixes |
| 2026-05-07 15:07 | `6uVoLkdN0v` | fergus outpost builder | Fergus - Outpost Builder's abilities are not working properly | references fergus outpost builder; not covered by recent triage fixes |
| 2026-05-07 13:28 | `Dr11Hu_hdl` | be king undisputed | I can't confirm "be king undisputed" | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 12:24 | `xZbLXSA4FY` | im stuck | cant choose a target for king undisputed now im stuck | references im stuck; not covered by recent triage fixes |
| 2026-05-07 12:00 | `0JkN9Jzzr8` | be king undisputed | When trying to resolve the be king disputed, I selected which character I wanted to banish but it wouldn't let me hit the confirm | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 09:37 | `Hr1IGVgMdG` | be king undisputed | I can't select a target for be king undisputed | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 08:29 | `bEIauc_U6S` | be king undisputed | be king undisputed is not selecting car | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 07:58 | `1Tas9itK8s` | dash parr, mickey mouse | wrong artwork for dash - comes up as mickey | references dash parr, mickey mouse; not covered by recent triage fixes |
| 2026-05-07 04:57 | `FfHhPweeJ4` | be king undisputed | I was unable to confirm my selection when my opponent played “Be King Undesputed” | references be king undisputed; not covered by recent triage fixes |
| 2026-05-07 03:54 | `9Qi8SC6To1` | beast | Beast challenged my Pizza Planet location.  I lost one Lore and my opponent gained one Lore.  Since Beast challenged a location, this should not have happened. | references beast; not covered by recent triage fixes |
| 2026-05-07 01:10 | `YFjryjxplj` | he hurled his thunderbolt, john silver alien pirate | Cannot sing He Hurled His Thunderbolt on John Silver Alien Pirate when playing the song with ink | references he hurled his thunderbolt, john silver alien pirate; not covered by recent triage fixes |
| 2026-05-07 00:52 | `H-7on3vHBx` | card advantage | I used "Card Advantage" and banished a card, but I didn't draw 2 after that | references card advantage; not covered by recent triage fixes |
| 2026-05-06 23:05 | `0BjUIMnisw` | cinderella dream come true | Cinderella - Dream Come True allowed the opponent to draw a card even when they could not ink because they no cards in hand | references cinderella dream come true; not covered by recent triage fixes |
| 2026-05-06 22:00 | `UmUOTUcEWb` | kida | Wont let me put cards into my inkwell from my opponents Kida's ability. | references kida; not covered by recent triage fixes |
| 2026-05-06 20:26 | `SfP17tv6px` | mulan elite archer | The Mulan Elite Archer trigger has not been happing when she dies in a challenge. | references mulan elite archer; not covered by recent triage fixes |
| 2026-05-06 19:45 | `l_CdN-T2gJ` | jasmine | When I choose Jasmine's ability to discard a card and give her Challenger +3, it is exerting her. She should not be exerted | references jasmine; not covered by recent triage fixes |
| 2026-05-06 19:04 | `z7NLhAf8cS` | kristoffs lute | Kristoffs Lute Doesn t work | references kristoffs lute; not covered by recent triage fixes |
| 2026-05-06 18:38 | `voGtfeKA5i` | belle accomplished mystic | Belle Accomplished Mystic is not moving damage. You select both targets and then nothing happens. | references belle accomplished mystic; not covered by recent triage fixes |
| 2026-05-06 16:11 | `BgA4nPpN5r` | be king undisputed | Opponent played Be King Undisputed and I cannot choose a character. I am locked in trying to choose the effect but it not letting me. The same thing happened... | references be king undisputed; not covered by recent triage fixes |
| 2026-05-06 15:54 | `T-y-y-2D_a` | the leviathan | Leviathan selected 4 targets to banish but only 2 of the 4 were banished. the strength of the characters was not above 10 | references the leviathan; not covered by recent triage fixes |
| 2026-05-06 13:21 | `kyx-kcewrF` | kida | kida error | references kida; not covered by recent triage fixes |
| 2026-05-05 19:29 | `0J_EUtpilB` | brawl, maui | can not cast brawl for some reason . and maui with rush couldnt challenge | references brawl, maui; not covered by recent triage fixes |
| 2026-05-05 11:34 | `e44EbnVXb4` | fergus outpost builder | Neither of Fergus - Outpost Builder effects are working properly | references fergus outpost builder; not covered by recent triage fixes |
| 2026-05-05 09:04 | `GNPPCGsaKv` | touch the sky | Touch the Sky allows targets to be chosen, but unable to confirm choices | references touch the sky; not covered by recent triage fixes |
| 2026-05-05 08:52 | `ZpNv-cEI7X` | lilo bundled up, tinker bell | tinkerbell puts damage on lilo bundled up, was the first time during my opponents turn that damage was dealt | references lilo bundled up, tinker bell; not covered by recent triage fixes |
| 2026-05-05 08:43 | `fNkETf7IRv` | minnie mouse | Cannot enter minnie mouse exerted | references minnie mouse; not covered by recent triage fixes |
| 2026-05-05 08:31 | `BrZhUdqw8V` | touch the sky | could not hit confirm button when using Touch the Sky | references touch the sky; not covered by recent triage fixes |
| 2026-05-05 06:52 | `cZE0Eborf3` | alien, alien true believer | Alien - True Believer I understand that when is banoshed it should allow ANOTHER Alien to be returned, instead it is allowing to return the same card that is... | references alien, alien true believer; not covered by recent triage fixes |
| 2026-05-05 01:24 | `CD5WAu5leP` | touch the sky | cannot resolve effect for Touch the Sky | references touch the sky; not covered by recent triage fixes |
| 2026-05-05 00:29 | `fF4AAVmQtt` | lucifer cunning cat | The bot is not discarding due the effect of Lucifer - Cunning Cat | references lucifer cunning cat; not covered by recent triage fixes |
| 2026-05-04 23:47 | `C0ZXt9gnUb` | sugar rush speedway finish line enchanted | Sugar rush speedway isn't working properly.  It is making there be multiple characters to trigger the effect to move from the one drop location to another | references sugar rush speedway finish line enchanted; not covered by recent triage fixes |
| 2026-05-04 20:36 | `7_0JEeJkI1` | mulan | Mulan did not trigger | references mulan; not covered by recent triage fixes |
| 2026-05-04 20:27 | `yLhBM03SsT` | goofy | using Goofy to move another character to a location, but its not letting me select the location to move to. | references goofy; not covered by recent triage fixes |
| 2026-05-04 19:02 | `op8qcTdlpT` | mulan | Mulan skill did not work during challenge | references mulan; not covered by recent triage fixes |
| 2026-05-04 18:32 | `rCHOdM3X-5` | touch the sky | touch the sky - action song - it would not allow me to choose character to move to which location or confirm | references touch the sky; not covered by recent triage fixes |
| 2026-05-04 18:31 | `n5my4-MAHK` | goofy | cant use goofy effekt to take character to a location | references goofy; not covered by recent triage fixes |
| 2026-05-04 17:45 | `xP_gw_9apm` | goofy, goofy set for adventure | Goofy - Set For Adventure doesn't work. The game lets me select a character to move, but won't let me actually move them to the location Goofy just moved to.... | references goofy, goofy set for adventure; not covered by recent triage fixes |
| 2026-05-04 16:20 | `vKi07vEdWz` | goofy, goofy set for adventure | Goofy - Set for Adventure's ability doesnt work properly, player can choose character to move but not location indicated in Goofy's text | references goofy, goofy set for adventure; not covered by recent triage fixes |
| 2026-05-04 15:54 | `HfYh8Yv9xM` | emerald chromicon | emerald chromicon Rarely triggers its ability for the player, but consistently triggers for the Practice AI | references emerald chromicon; not covered by recent triage fixes |
| 2026-05-04 15:14 | `v-c-hQ95ng` | mad hatter eccentric host | Mad Hatter Eccentric Host effect is not resolving. It should allow you to look at the top of either player's deck and then discard or keep the card there. | references mad hatter eccentric host; not covered by recent triage fixes |
| 2026-05-04 11:31 | `LiNTvBD-FH` | merida, three arrows | After playing Three Arrows with Merida in play, the two damage counters from Three arrows shows on the characters banished after Merida's trigger resolves. | references merida, three arrows; not covered by recent triage fixes |
| 2026-05-04 04:30 | `5PHvTPzgVy` | elsa | Can’t use characters to sing second star. Selected two 5 cost Elsa’s unable to activate second star. Just says no card’s available. Tried different combo of ... | references elsa; not covered by recent triage fixes |
| 2026-05-04 04:22 | `_1lbOtC8F8` | woody jungle guide | Set 12 Woody Jungle Guide when he quests his ability Let s Get Moving doesnt allow you to progress and tha game hangs. | references woody jungle guide; not covered by recent triage fixes |
| 2026-05-04 01:55 | `OX5VvcPIvg` | alice growing girl | I had Alice Growing Girl and Gadget Hackwrench Resourcefull Mechanic in Play.   Alice gives all my characters Support and Gadget should then give all Charect... | references alice growing girl; not covered by recent triage fixes |
| 2026-05-04 00:24 | `39PGIqCuy1` | the horned king, the horned king triumphant ghoul | the horned king - triumphant ghoul: hei hei persistent presence returned to hand from discard but does not give extra lore to horned king | references the horned king, the horned king triumphant ghoul; not covered by recent triage fixes |
| 2026-05-03 23:13 | `6uCbONhCzn` | anna soothing sister, the horned king | Anna Soothing Sister doesnt give extra lore. Horned King Triumphant Ghoul is not triggered when anna's ability fails to work properly on her- it also fails t... | references anna soothing sister, the horned king; not covered by recent triage fixes |
| 2026-05-03 21:52 | `TVI0pUai1W` | the glass slipper | The glass slipper doent’t work | references the glass slipper; not covered by recent triage fixes |
| 2026-05-03 21:19 | `NcmKSFRFU-` | touch the sky | touch the sky isnt working, im trying to sing it and put that character at a location but will not confirm | references touch the sky; not covered by recent triage fixes |
| 2026-05-03 21:11 | `xLjYlmL8Kc` | mickey mouse | mickey mouse does not enter exerted | references mickey mouse; not covered by recent triage fixes |
| 2026-05-03 21:10 | `EH3HBIkwji` | kida | Kida doesnt resolve | references kida; not covered by recent triage fixes |
| 2026-05-03 20:05 | `B_4A0zjSAF` | the queen jealous beauty | [The Queen - Jealous Beauty]  Player was able to target three cards from their own discard for the lore gain despite The Queen only being able to target the ... | references the queen jealous beauty; not covered by recent triage fixes |
| 2026-05-03 19:46 | `1uLjaCd0xh` | alien, alien true believer | hello, please check the card effect "Alien - true believer" i used this card effects successful whether i dont had another "alien" in discard. I think it nee... | references alien, alien true believer; not covered by recent triage fixes |
| 2026-05-03 19:02 | `2p9HRE04nG` | mickey mouse | Mickey expedition leafer doesn't have a trigger to enter exerted | references mickey mouse; not covered by recent triage fixes |
| 2026-05-03 17:49 | `M4s0EKa0kO` | ranger plane | Ranger plane is not giving characters support. or gadget hackwrench's ability of your characters with support gain +1 lore | references ranger plane; not covered by recent triage fixes |
| 2026-05-03 17:40 | `oY5T4NOXeo` | three arrows | When I played Three Arrows, I clicked the first target, and skipped the second target, it ended up skipping the first target and applied 1 damage instead of ... | references three arrows; not covered by recent triage fixes |
| 2026-05-03 16:37 | `kCHbiozJfw` | medallion weights | Hamish, Harris, and Hubert - Making Mischief doesn't present the option to exert on play.  With no cards in their hand, opponent uses medallion weights on th... | references medallion weights; not covered by recent triage fixes |
| 2026-05-03 15:56 | `B5cQw8MAmE` | bounce | Bibbido Bobbido Boo won't let me target the same character for the return to hand and the play for free effects. It says "return to hand, then you can [...]"... | references bounce; not covered by recent triage fixes |
| 2026-05-03 15:54 | `yHUYTGXrZ8` | transport pod | transport pod is not allowing me to move characters. the confirm button acknowledges the selection but stays grayed out. | references transport pod; not covered by recent triage fixes |
| 2026-05-03 15:49 | `eeciawkAUV` | goofy set for adventure | I am trying to activate goofy set for adventure, but when i selected a character, the confirm button acknowledges the selection, but stays grayed out. | references goofy set for adventure; not covered by recent triage fixes |
| 2026-05-03 15:30 | `dgTszlzeZW` | transport pod | Transport pod doesn't work, there is the confirmation button with 2/2 but it doesn't allow me to click on it. | references transport pod; not covered by recent triage fixes |
| 2026-05-03 13:26 | `zbFHQ_8M_D` | genie | cant boost genie | references genie; not covered by recent triage fixes |
| 2026-05-03 12:19 | `VR-nRFilwF` | cinderella | my opponenet draw with empty had with cinderella  effect  the  blue  4 unink one | references cinderella; not covered by recent triage fixes |
| 2026-05-03 10:57 | `mVrfeh_u5N` | touch the sky | touch the sky is broken. it wont let me choose which location to play and it wont let me move carachters to draw cards | references touch the sky; not covered by recent triage fixes |
| 2026-05-03 06:04 | `2Y_8cpWAYi` | king candy royal racer | King Candy - Royal racer effect allow me to choose which character I want to banished instead of allowing my opponent to choose. | references king candy royal racer; not covered by recent triage fixes |
| 2026-05-03 04:27 | `3onZi6jN2k` | touch the sky | I can't select "confirm 2/2" using Touch the Sky | references touch the sky; not covered by recent triage fixes |
| 2026-05-03 04:25 | `sC_oqqk0mT` | touch the sky | Touch the Sky does not allow you to move a character after singing | references touch the sky; not covered by recent triage fixes |
| 2026-05-03 04:21 | `ba_HZYARxk` | emerald chromicon | Emerald chromicon is not working/trigggering | references emerald chromicon; not covered by recent triage fixes |
| 2026-05-03 03:51 | `dkbhozu66d` | woody jungle guide | Woody - Jungle Guide trigger bug where I drew a card but am now stuck where I cannot play a 2 cost or less character, let alone do anything else. | references woody jungle guide; not covered by recent triage fixes |
| 2026-05-03 03:12 | `vCR1LmH7_n` | mr incredible, the thunderquack | Mr Incredible did not work because the Thunderquack is bugged and didn't give my opponents characters villain classification | references mr incredible, the thunderquack; not covered by recent triage fixes |
| 2026-05-03 02:15 | `DWMyrX2j4o` | mickey mouse expedition leader | Mickey Mouse Expedition Leader  Long Journey ability does not trigger when entering play | references mickey mouse expedition leader; not covered by recent triage fixes |
| 2026-05-03 01:32 | `WZxtFOmpkz` | mrs incredible | My opponent just challenged and banished Mrs. Incredible. But she should have had Resist +1 and not have gotten banished in the challengr | references mrs incredible; not covered by recent triage fixes |
| 2026-05-03 01:27 | `xcGtCANRKy` | lilo | Lilo died on first challenge | references lilo; not covered by recent triage fixes |
| 2026-05-02 23:49 | `TZE5IlCrVg` | mulan | When I play actions like Triple Shot or Mulan Archer the game will not allow me to choose ready characters. | references mulan; not covered by recent triage fixes |
| 2026-05-02 23:06 | `GHSzI0-044` | the leviathan | Leviathan's effect doesn't work | references the leviathan; not covered by recent triage fixes |
| 2026-05-02 22:40 | `E1n-Z2nkY2` | the leviathan | The Leviathan's effect is broken. It will often fail to destroy all characters that you target, even when they have 10 or less attack in total | references the leviathan; not covered by recent triage fixes |
| 2026-05-02 21:39 | `OY9F_PytDz` | pongo dear old dad | Pongo - Dear old dad ability does not works right | references pongo dear old dad; not covered by recent triage fixes |
| 2026-05-02 21:12 | `NlK3qVukSu` | the leviathan | The Leviathan often doesn't work. It will let you target properly but then randomly leave some characters alive. I think there's something wrong with the way... | references the leviathan; not covered by recent triage fixes |
| 2026-05-02 20:59 | `-N1ftGBOmN` | the leviathan | Leviathan and Dale have glitched interaction | references the leviathan; not covered by recent triage fixes |
| 2026-05-02 20:58 | `u9DAaZrxwC` | dale ready for his shot, someone will lose his head, the leviathan | The Leviathan's interaction with Dale - Ready for his Shot and Someone Will Lose Their Head is glitched. It seems like it counts their health instead of thei... | references dale ready for his shot, someone will lose his head, the leviathan; not covered by recent triage fixes |
| 2026-05-02 19:49 | `PkmzRI2CcM` | anna soothing sister | Anna Soothing Sister gives no extra lore when she uses her questing ability. | references anna soothing sister; not covered by recent triage fixes |
| 2026-05-02 19:28 | `v8Q8AaZ7iz` | the glass slipper | The glass slipper is broken. | references the glass slipper; not covered by recent triage fixes |
| 2026-05-02 19:27 | `GVL091HUfk` | simba | For 4 games in a row I can’t use my glass slipper. I am winning if the app let me use it with simba and after I play Cindy. | references simba; not covered by recent triage fixes |
| 2026-05-02 19:14 | `JiM1hVVjZD` | fergus outpost builder | Fergus Outpost Builder's effect doesn't allow to play a location from discard | references fergus outpost builder; not covered by recent triage fixes |
| 2026-05-02 19:07 | `p8MrBPJZXG` | bibbidi bobbidi boo, bounce | Bibbidi Babbido Boo won't let me bounce and replay the same card | references bibbidi bobbidi boo, bounce; not covered by recent triage fixes |
| 2026-05-02 16:14 | `6xiDSjy3Pa` | genie | Returning Genie to hand from discard, damage is still on him in hand. | references genie; not covered by recent triage fixes |
| 2026-05-02 15:40 | `W8D2pMN-VJ` | cinderella | I played Mowgli to reveal their hand. Then on their turn, when they played Cinderella, it revealed their hand again. | references cinderella; not covered by recent triage fixes |
| 2026-05-02 14:20 | `jMRb2YipWO` | hades | Purple Hades does not let you see what card they selected. | references hades; not covered by recent triage fixes |
| 2026-05-02 13:36 | `PnD_9s-_N9` | mickey mouse amber champion | Mickey Mouse Amber Champion isn't able to be Singer 8 when I have 2 other amber characters in play. Please fix. | references mickey mouse amber champion; not covered by recent triage fixes |
| 2026-05-02 13:18 | `JSxMa_igTC` | mr incredible | I have Thunderquack item in play that makes every character a Villain classification. So when I play the 4-cost Mr. Incredible, he should be able to deal 2 d... | references mr incredible; not covered by recent triage fixes |
| 2026-05-02 09:01 | `bgU6a9LGhW` | touch the sky | Touch the sky was working properly, but now it doesn't allow to move | references touch the sky; not covered by recent triage fixes |
| 2026-05-01 23:21 | `w7ncUPv8GL` | anna soothing sister | Anna Soothing Sister's Warm Heart ability gives no extra lore after selecting a character from my discard with the effect. please fix asap | references anna soothing sister; not covered by recent triage fixes |
| 2026-05-01 23:19 | `eo43-7pHIu` | jasmine fearless princess | When i use Jasmine Fearless Princess ability, she stays exerted and cant challenge | references jasmine fearless princess; not covered by recent triage fixes |
| 2026-05-01 21:46 | `w-Wty9geDo` | the horned king triumphant ghoul | the horned king - triumphant ghoul. ability gives no extra lore despite condition being met. | references the horned king triumphant ghoul; not covered by recent triage fixes |
| 2026-05-01 20:12 | `Sz9SlQKhNe` | touch the sky | I can't use a card"touch the sky" | references touch the sky; not covered by recent triage fixes |
| 2026-05-01 19:29 | `mtIcwQ1F_9` | mr incredible | My Thunderquack item should give all opposing characters the Villain classification. So then when I play Mr. Incredible, his ability allows me to deal 2 dama... | references mr incredible; not covered by recent triage fixes |
| 2026-05-01 18:05 | `O1joBXGS-y` | second star to the right | can't choose player with Second Star to the Right | references second star to the right; not covered by recent triage fixes |
| 2026-05-01 17:42 | `-um02Q2f-y` | emerald chromicon | emerald chromicon not working | references emerald chromicon; not covered by recent triage fixes |
| 2026-05-01 16:31 | `VpfvdS2P-M` | minnie mouse drum major | Minnie Mouse - Drum Major won't let me select any characters. It says they are all invalid targets. This freezes up the game until skip is selected. | references minnie mouse drum major; not covered by recent triage fixes |
| 2026-05-01 14:15 | `OrGcG-wZ-D` | ichabod crane scared out of his mind, mickey mouse bob cratchit, olaf helping hand | Some thing strange happened with Olaf He triggered although he was not banished   Challenged Ichabod Crane - Scared Out of His Mind with Olaf - Helping Hand.... | references ichabod crane scared out of his mind, mickey mouse bob cratchit, olaf helping hand; not covered by recent triage fixes |
| 2026-05-01 13:53 | `wSOR7kX5j1` | mr incredible | Mr. Incredible is incorrectly drawing cards when Supers are challenging locations. | references mr incredible; not covered by recent triage fixes |
| 2026-05-01 12:59 | `jf-5vBVBSU` | touch the sky | Wont allow me to confirm moving a character to a location with Action Touch the Sky | references touch the sky; not covered by recent triage fixes |
| 2026-05-01 06:04 | `fxPSSELBty` | belle | belle didn't work | references belle; not covered by recent triage fixes |
| 2026-05-01 01:11 | `V6O60lS2q3` | mulan elite archer | When I attack with Mulan Elite Archer, I should do the same damage to 2 other characters | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-30 20:57 | `9UkAHtL46g` | donald duck, donald duck fred honeywell, genie, genie magical researcher | When Donald Duck - Fred Honeywell is on the field, you are allowed to draw cards when a character or location with cards under it is banished during an oppon... | references donald duck, donald duck fred honeywell, genie; not covered by recent triage fixes |
| 2026-04-30 20:44 | `2gQskAmG7l` | roller bob sids toy | I went to play roller bob - sids toy but it forces you to resolve the trigger of his "Time to Move" ability even though it is a 'may' effect to place to toys... | references roller bob sids toy; not covered by recent triage fixes |
| 2026-04-30 20:21 | `BbGjA04AZh` | desperate plan | Desperate plan wont let me discard | references desperate plan; not covered by recent triage fixes |
| 2026-04-30 19:59 | `4zndVY411-` | the horned king triumphant ghoul | The Horned King - Triumphant Ghoul Ability does not give extra lore after I use Hei Hei to challenge - which dies and comes back to hand after hitting discar... | references the horned king triumphant ghoul; not covered by recent triage fixes |
| 2026-04-30 19:46 | `ZufF4P5pdS` | syndrome out for revenge | Syndrome - Out for Revenge's ability allows you to choose supers too on accident. only robot characters are written | references syndrome out for revenge; not covered by recent triage fixes |
| 2026-04-30 19:14 | `i7OEAzU5Eq` | anna soothing sister, the horned king, work together | Anna Soothing Sister's "Warm Heart" ability is bugged: 1. Cannot choose non character cards 2. Gives no extra lore please remedy this, horned king and anna b... | references anna soothing sister, the horned king, work together; not covered by recent triage fixes |
| 2026-04-30 18:30 | `w6vjuxCYC6` | dolores madrigal | \|It was presenting cards as the wrong card during gameplay, i.e. saying kuzko was dolores madrigal | references dolores madrigal; not covered by recent triage fixes |
| 2026-04-30 17:30 | `qDN3axTXQG` | beast aggressive lord, kida discovering the unknown | Kida: Discovering the Unknown. She she quests and two cards have been placed in the discard, put a card facedown in your inkwell from the top of your deck. D... | references beast aggressive lord, kida discovering the unknown; not covered by recent triage fixes |
| 2026-04-30 15:48 | `P1aql8Kv6M` | heihei expanded consciousness | heihei expanded consciousness will not ink all cards in the hand like it should | references heihei expanded consciousness; not covered by recent triage fixes |
| 2026-04-30 15:35 | `2wlven23-Z` | jessie lively cowgirl | I paid two or less for a character while having Jessie - Lively Cowgirl in play and it didn't let choose a character two get one less attack. It just showed ... | references jessie lively cowgirl; not covered by recent triage fixes |
| 2026-04-30 15:09 | `BQIuk77UOo` | syndrome | Syndrome 6 can add non robot creature back to hand | references syndrome; not covered by recent triage fixes |
| 2026-04-30 15:01 | `0-rWSBsR2i` | mickey mouse expedition leader | Mickey Mouse - Expedition Leader Its not possible to play this card exerted. | references mickey mouse expedition leader; not covered by recent triage fixes |
| 2026-04-30 07:32 | `mHHr76-foJ` | lady family dog | When playing a bodyguard for free from Lady Family Dog trigger, it didn't give the option to play the bodyguard exerted | references lady family dog; not covered by recent triage fixes |
| 2026-04-30 06:25 | `cPJVKqEW5j` | syndrome | Syndrome can get back any characters of the discard not only robot | references syndrome; not covered by recent triage fixes |
| 2026-04-30 03:47 | `t_O1Es1Wm_` | woody jungle guide | Woody - Jungle Guide doesn't allow for on play effects of the card that is played off of the on-quest ability. Also, can't choose whether or not to play the ... | references woody jungle guide; not covered by recent triage fixes |
| 2026-04-30 02:12 | `POs7ufoe2n` | elsa | Cost 2 purple Elsa did not gain another lore when an Anna was in play | references elsa; not covered by recent triage fixes |
| 2026-04-29 23:45 | `RN5_gi-JOx` | anna soothing sister | Anna Soothing Sister does not give any additional lore when i select a character from my discard with her effect. | references anna soothing sister; not covered by recent triage fixes |
| 2026-04-29 21:20 | `5f2DIJs7MX` | robin hood sharpshooter | when questing with robin hood - sharpshooter and finding an action, sometimes it goes into the ink well | references robin hood sharpshooter; not covered by recent triage fixes |
| 2026-04-29 20:46 | `EcVUqKL_A7` | max goof chart topper | Max Goof - Chart Topper ability does not work, when i click accept when he quests it doesnt let me choose a song from discard | references max goof chart topper; not covered by recent triage fixes |
| 2026-04-29 18:31 | `TGkl5RRpGV` | fire the cannons | Fire the cannons did not banish Palace guard | references fire the cannons; not covered by recent triage fixes |
| 2026-04-29 16:13 | `kwkpNiEI4y` | ariel, let it go | The card underneath my Ariel was revealed when Let It Go put both in the inkwell. It should have remained hidden | references ariel, let it go; not covered by recent triage fixes |
| 2026-04-29 15:42 | `SyHQJSPnqd` | mr incredible | Mr. Incredible challenging a location allows to draw cards | references mr incredible; not covered by recent triage fixes |
| 2026-04-29 15:42 | `rgwcOg2nY4` | mr incredible | Mr Incredible drew a card when challenging my location | references mr incredible; not covered by recent triage fixes |
| 2026-04-29 15:31 | `GTZaqXVmd9` | moana | Can't use the effect of moana | references moana; not covered by recent triage fixes |
| 2026-04-29 15:29 | `HktJEv8WD-` | ranger plane | the effect from trixie (your characters with Support get +1 lore) doesn't work in comination with the item Ranger Plane | references ranger plane; not covered by recent triage fixes |
| 2026-04-29 13:43 | `fdBbuKjsmp` | ranger plane | Ranger plane gives all of my characters support  Gadget Hackwrench gives all of my characters with support plus one lore  The characters are not questing for... | references ranger plane; not covered by recent triage fixes |
| 2026-04-29 13:03 | `LrpRNkM95c` | pull the lever | In the game log is another card name than the picture of the one that as put in the inkwell (white rabbit vs pull the lever) | references pull the lever; not covered by recent triage fixes |
| 2026-04-29 11:43 | `CbakXXTns8` | captain hook | Captain hook can't quest for no reason | references captain hook; not covered by recent triage fixes |
| 2026-04-29 10:27 | `pGcfdtuPXC` | lady miss park avenue | Picked 2 cards with "Lady - Miss Park Avenue" but only 1 went to hand. Browser Firefox | references lady miss park avenue; not covered by recent triage fixes |
| 2026-04-29 09:47 | `LT2usM-X8v` | the horned king | Horned king effect says during your turn if card left discard gain Two lore.  Why is he triggering when half shark is bringing back actions during my turn. | references the horned king; not covered by recent triage fixes |
| 2026-04-29 04:14 | `LF_Q6Enbc_` | mulan | Mulan's effect didn't hit more than one target. | references mulan; not covered by recent triage fixes |
| 2026-04-29 03:57 | `XaSm2AlRPl` | mickey mouse expedition leader | Mickey Mouse Expedition Leader doesn't have the choice to enter exerted when you cast him. | references mickey mouse expedition leader; not covered by recent triage fixes |
| 2026-04-29 01:29 | `DNzqDMI2fB` | down in new orleans, robin hood sharpshooter | Robin Hood Sharpshooter cannot play Down in New Orleans when triggering his ability via questing. | references down in new orleans, robin hood sharpshooter; not covered by recent triage fixes |
| 2026-04-29 00:30 | `2HoyCIZwJI` | emerald chromicon | emerald chromicon not working | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-28 23:44 | `pYYfyWjNZD` | moana | ancestral legeend moana does not work | references moana; not covered by recent triage fixes |
| 2026-04-28 22:47 | `pBd1lYbB3A` | merida | when using the Merida effect I think the character I choose is just getting banished no matter what. even if they were not dealt enough damage to banish them. | references merida; not covered by recent triage fixes |
| 2026-04-28 22:23 | `S8jkCpGjGS` | anna soothing sister | Anna - soothing sister doesn't allow you to pick from your own discard | references anna soothing sister; not covered by recent triage fixes |
| 2026-04-28 22:22 | `9p-qhXljDf` | vision of the future | when robin hood quests and finds vision of the future and plays it, it doesn't give you the options to play it and pick a card, just goes straight into the d... | references vision of the future; not covered by recent triage fixes |
| 2026-04-28 21:32 | `1ZR9W8LUo-` | kida | I am confused as to why Kida was banished here. | references kida; not covered by recent triage fixes |
| 2026-04-28 21:25 | `_hLlUyBozq` | anna soothing sister | anna soothing sister not giving additional lore when questing despite me choosing a character card with positive lore from my own discard. ie soothing sister... | references anna soothing sister; not covered by recent triage fixes |
| 2026-04-28 21:24 | `XdGd_ntnYb` | anna little sister | anna little sister seems to not allow me to choose opponent discarded cards when only one card is in each discard, thus forcing me to choose my own card (thu... | references anna little sister; not covered by recent triage fixes |
| 2026-04-28 21:19 | `3ByIxnRIJ6` | moana, moana island explorer, mulan | Moana Island explorer boosted Mulan eventhough Moana didn't challenge a character | references moana, moana island explorer, mulan; not covered by recent triage fixes |
| 2026-04-28 20:52 | `IJpsG4ppej` | the leviathan | Leviathan should be attack not total cost | references the leviathan; not covered by recent triage fixes |
| 2026-04-28 20:01 | `-sEjUFBRrS` | anna soothing sister | Anna Soothing Sister's effect gives no extra lore when i choose my character and put it on the bottom of the deck. breaks anna entirely. | references anna soothing sister; not covered by recent triage fixes |
| 2026-04-28 19:05 | `MJL-qtCj1P` | woody jungle guide | I quested with Woody Jungle Guide and played Rex using Woody's ability. I wasn't able to play Rex exerted, even though he's a bodyguard | references woody jungle guide; not covered by recent triage fixes |
| 2026-04-28 18:44 | `2v-Ne8Htsi` | max goof chart topper | when i quest with Max Goof - chart topper i cant play a song from discard | references max goof chart topper; not covered by recent triage fixes |
| 2026-04-28 18:37 | `wtqfVF-g7L` | alice growing girl | Gadget Hackwrench is supossed to give characters with support +1 lore. I have an Alice Growing Girl on the board, but Gadget wasn't seeing that the other cha... | references alice growing girl; not covered by recent triage fixes |
| 2026-04-28 18:29 | `qvAmHF4cGf` | merida, three arrows | Three Arrows does not do the extra damage when Merida is in play | references merida, three arrows; not covered by recent triage fixes |
| 2026-04-28 17:58 | `xke4udxiao` | kida crystal scion | Kida Crystal Scion did not give me the option to ink from discard. I was not the player with the card | references kida crystal scion; not covered by recent triage fixes |
| 2026-04-28 17:24 | `pYnjZPC1qY` | scrooges counting house ebenezers office | I have transportation pod in play and scrooges counting house. At the start of my turn it wants me to resolve transportation pod but there is no target so I ... | references scrooges counting house ebenezers office; not covered by recent triage fixes |
| 2026-04-28 16:47 | `Eg9Y80zhcf` | merida | Merida doesn't work | references merida; not covered by recent triage fixes |
| 2026-04-28 16:38 | `RSbs-h1ZAq` | kida crystal scion | Kida Crystal Scion does not allow opponent to choose cards from discard to inkwell | references kida crystal scion; not covered by recent triage fixes |
| 2026-04-28 16:15 | `oWaCmJpj2M` | sugar rush speedway finish line enchanted | can not use sugar rush speedway | references sugar rush speedway finish line enchanted; not covered by recent triage fixes |
| 2026-04-28 16:08 | `MQ-S8hda6V` | merida formidable archer, strength of a raging fire, three arrows | Merida - Formidable Archer is not applying her additional damage effect. I didn't get additional damage off of Strength of a Raging Fire or Three Arrows. | references merida formidable archer, strength of a raging fire, three arrows; not covered by recent triage fixes |
| 2026-04-28 15:01 | `GGNSg_ZGQQ` | right behind you | the card Right behind you is triggering even without having the Princess / Dwarf in play | references right behind you; not covered by recent triage fixes |
| 2026-04-28 14:21 | `5T3epIciJw` | kida creative thinker | Kida - Creative thinker isn't putting the correct card onto the top of the deck when you use her ability Key to the Puzzle. | references kida creative thinker; not covered by recent triage fixes |
| 2026-04-28 14:07 | `wcTWiVuqM5` | kida | New Kida from set 12 is not letting opponent put discard into ink | references kida; not covered by recent triage fixes |
| 2026-04-28 13:49 | `u2gwfCegIR` | kida, merida | Merida's +2 damage ability didn't trigger after using thunderbolt and strength. Also the new Kida's ability only worked for my opponent which makes the card ... | references kida, merida; not covered by recent triage fixes |
| 2026-04-28 12:35 | `tqcl1V3RhR` | kida | New Legendary Kida, doesnt let the opponent ink 5 cards | references kida; not covered by recent triage fixes |
| 2026-04-28 09:18 | `8aoijc3hBe` | merida | Steel Merida's affect doesnt seem to work | references merida; not covered by recent triage fixes |
| 2026-04-28 01:18 | `lYTscAInfg` | emerald chromicon | emerald chromicon not working | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-27 23:11 | `2Da1uaB6V7` | merida | Merida's Steady Aim ability is not activating when I play an action that deals damage. | references merida; not covered by recent triage fixes |
| 2026-04-27 23:05 | `hLD60d5HwX` | the horned king | cards returning to hand after being banished in a challenge (eg will o wisp, heihei) dont trigger the 2 cost horned king for the extra lore. ruins my deck. | references the horned king; not covered by recent triage fixes |
| 2026-04-27 22:49 | `YdOAgRGE-D` | alien | the card Alien triggered itself and returned back to hand. it should be another Alien, there were 0 Alien in discard at the time it was banished | references alien; not covered by recent triage fixes |
| 2026-04-27 22:30 | `dmkCW4Yk_k` | the horned king | heihei returning to hand doesnt trigger my horned king for the extra lore. losing repeatedly when deck doesnt work ruins my record and experience. | references the horned king; not covered by recent triage fixes |
| 2026-04-27 22:28 | `M9VN_N-FmV` | merida | Merida's ability to do 2 extra damage from Actions, is not triggering on Card 2 Arrows | references merida; not covered by recent triage fixes |
| 2026-04-27 21:49 | `-URmInBx9A` | kida | New saphire Kida effect only triggered the person itself, not the enemey (me). | references kida; not covered by recent triage fixes |
| 2026-04-27 21:33 | `8F8UaFn6w-` | violet parr | violet par ability did not work | references violet parr; not covered by recent triage fixes |
| 2026-04-27 21:18 | `piX-8R1voO` | belle | i can only see the first 3 items i play so when i play blue green items and have 20ish i cant use scrooge mc duck or belle or fish bone quill | references belle; not covered by recent triage fixes |
| 2026-04-27 20:26 | `EZbVKPAUw9` | merida | Merida - Former acher isn't implemented yet. Second ability doens't work | references merida; not covered by recent triage fixes |
| 2026-04-27 20:24 | `wpSZlaiBio` | desperate plan | Desperate plan is not functioning correctly. It is not letting me discard cards to draw cards. | references desperate plan; not covered by recent triage fixes |
| 2026-04-27 20:00 | `S05XlsdcfN` | moana | Moana is drawing cards instead of inking them. | references moana; not covered by recent triage fixes |
| 2026-04-27 20:00 | `HGZuSMdM6g` | cinderella | Cinderella trigger let me draw a card without inking a card. I had no cards in hand at the time and the trigger resolved | references cinderella; not covered by recent triage fixes |
| 2026-04-27 18:40 | `G_l_XQDVOT` | violet parr | violet par ability did not work correctly. Damage was not moved | references violet parr; not covered by recent triage fixes |
| 2026-04-27 16:11 | `y6LA4_0ujD` | card advantage | Lord mcgruffen doesn't work at all.  Card advantage doesn't work at all. | references card advantage; not covered by recent triage fixes |
| 2026-04-27 16:02 | `ITNzvrrqQH` | card advantage | Card Advantage card is not drawing cards after opponent creature died | references card advantage; not covered by recent triage fixes |
| 2026-04-27 16:02 | `gZxh7Aru7l` | what else can i do | trying to use what else can i do no effect happens wether i sing it or hard cast it just goes straight to discard with no draw no ink | references what else can i do; not covered by recent triage fixes |
| 2026-04-27 15:58 | `LQJ2Bawn4T` | merida | Merida effect of doing two more damage is not applying | references merida; not covered by recent triage fixes |
| 2026-04-27 15:36 | `7venc1Wn01` | broadway sturdy and strong | Broadway Sturdy and Strong still isn't registering as having bodyguard. | references broadway sturdy and strong; not covered by recent triage fixes |
| 2026-04-27 13:45 | `Z6dM8Ur1kY` | willie the giant ghost of christmas present | Willie the Giant - Ghost of Christmas Present  when played it erros out and will not allow any games moves | references willie the giant ghost of christmas present; not covered by recent triage fixes |
| 2026-04-27 13:40 | `CxE6tO2Z7s` | hercules | My 1 cost Hercules will not let me boost it | references hercules; not covered by recent triage fixes |
| 2026-04-27 11:25 | `sZ-jn8Bex_` | metamorphosis | metamorphosis broken didn't let me play the character | references metamorphosis; not covered by recent triage fixes |
| 2026-04-27 10:16 | `ETmIF4LH23` | mulan | when mulan is banished in a challenge she makes, it is not allowing me to deal the damage to 2 other characters as per her ability | references mulan; not covered by recent triage fixes |
| 2026-04-27 09:59 | `sFVNzFw2Us` | merida, three arrows | Merida's ability to deal 2 extra damage is no activated when I play three arrows | references merida, three arrows; not covered by recent triage fixes |
| 2026-04-27 09:03 | `HYGcLyqXqB` | bruno madrigal | We Don’t Talk About Bruno trigger Discard a card doesnt work | references bruno madrigal; not covered by recent triage fixes |
| 2026-04-27 07:15 | `dQ0E4B4y9B` | anna soothing sister | Anna Soothing Sister Effect did not resolve correctly. I did not gain the amount of lore I should have when I chose a character from my discard to put at the... | references anna soothing sister; not covered by recent triage fixes |
| 2026-04-27 03:07 | `GmprHGSzaL` | sugar rush speedway starting line | Can't use sugar rush speedway starting line to select a character at the location to move them | references sugar rush speedway starting line; not covered by recent triage fixes |
| 2026-04-27 01:35 | `RahXq-7Hrl` | he hurled his thunderbolt | He hurled his thunderbolt.  If chosen by accident, and no choice on the oppoents side is choosable, it forces you to choose your own target. | references he hurled his thunderbolt; not covered by recent triage fixes |
| 2026-04-26 20:44 | `EwNm94tEOk` | he hurled his thunderbolt, merida | Merida, Steady Aim did not trigger after playing He Hurled His Thunderbolt | references he hurled his thunderbolt, merida; not covered by recent triage fixes |
| 2026-04-26 19:35 | `qgnyxqJpVq` | daisy duck donalds date | Daisy Duck - Donalds Date does not reveal the card to the opponent | references daisy duck donalds date; not covered by recent triage fixes |
| 2026-04-26 13:50 | `nluakDwEQg` | medallion weights | I activated two medallion weights, but when my character challenged I only drew 1 card, not 2 from both effects. | references medallion weights; not covered by recent triage fixes |
| 2026-04-26 05:27 | `Lohltn4D1h` | he hurled his thunderbolt | He hurled his thunderbolt is giving resist two to all characters not just deitiies | references he hurled his thunderbolt; not covered by recent triage fixes |
| 2026-04-26 05:15 | `xTruWp0y3X` | merida | Merida's effect not implemented yet! | references merida; not covered by recent triage fixes |
| 2026-04-26 04:48 | `k-Hv3GB14w` | merlin crab | merlin crab is giving the challenger three on attack as well as enter and leave | references merlin crab; not covered by recent triage fixes |
| 2026-04-26 04:13 | `WOE3dYiyic` | merida, three arrows | merida did not do extra dmg on three arrows | references merida, three arrows; not covered by recent triage fixes |
| 2026-04-26 03:14 | `QQhsPBhcXR` | emerald chromicon | Emerald chromicon not working! | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-25 16:50 | `lcfS8aXsko` | mickey mouse | Not letting the set 12 mickey enter play exerted | references mickey mouse; not covered by recent triage fixes |
| 2026-04-25 16:26 | `fCPeN1KTck` | elsa, genie, genie wish fulfilled, horseman's strike | AI played Horseman Strikes. I had two evasive characters on the board (Genie - Wish Fulfilled, Elsa - Fifth Spirit). They chose to not banish either of them.... | references elsa, genie, genie wish fulfilled; not covered by recent triage fixes |
| 2026-04-25 15:14 | `-wCBIRxLqD` | merida | Merida legendary second ability "Stready aim" doesn't trigger at all | references merida; not covered by recent triage fixes |
| 2026-04-25 11:21 | `i0jCGtf6bA` | merida | Merida doesnt deal extra damage | references merida; not covered by recent triage fixes |
| 2026-04-25 07:59 | `ATN-RVI32O` | stitch | game gets stuck on if a trigger can't be resolved (stitch surfer with 1 charecter) | references stitch; not covered by recent triage fixes |
| 2026-04-25 04:01 | `cxVhWJG9K3` | ariel, the headless horseman terror of sleepy hollow enchanted | After playing the Headless horseman, my alladin and pluto should've had enough strength to banish the opponents Ariel and Goliath. I was unable to challenge ... | references ariel, the headless horseman terror of sleepy hollow enchanted; not covered by recent triage fixes |
| 2026-04-25 03:58 | `iZ80YioGvy` | horseman's strike | Can't challenge after playign horseman | references horseman's strike; not covered by recent triage fixes |
| 2026-04-25 03:44 | `StJEMvLjPY` | cinderella | cinderella drew without inking a card/ no cards in hand | references cinderella; not covered by recent triage fixes |
| 2026-04-25 03:40 | `yg728V7pQB` | the black cauldron | black cauldron can't work | references the black cauldron; not covered by recent triage fixes |
| 2026-04-25 03:31 | `TRasFz5kDk` | clarabelle light on her hooves | opponent cannot resolve Clarabelle - Light on Her Hooves KEEP IN STEP  Not actionable from this view right now.  Waiting for opponent. so we have to wait 2 m... | references clarabelle light on her hooves; not covered by recent triage fixes |
| 2026-04-25 02:00 | `62g4Qp8iMU` | tamatoa happy as a clam | tamatoa happy as a clam won't get the items from the discard | references tamatoa happy as a clam; not covered by recent triage fixes |
| 2026-04-25 01:40 | `0Dh2HR0xiM` | maui, maui half shark | Player quested with Maui - Half Shark, then readied and challenged my location without playing anything that would ready Maui, | references maui, maui half shark; not covered by recent triage fixes |
| 2026-04-25 01:08 | `Dc7Gawus41` | stitch carefree surfer | Stitch carefree surfer was getting stuck, unable to resolve the effect when I had just 1 other character in play | references stitch carefree surfer; not covered by recent triage fixes |
| 2026-04-24 23:06 | `sVeSc6hqC3` | merida | Merida Effekt did not Trigger. So the Strenght Effekt just deal the normal amount of Damage instead of the +2 Dmg | references merida; not covered by recent triage fixes |
| 2026-04-24 22:21 | `q4OPtr-5W6` | magica de spell shadowy and sinister | magica de spell didn't seem to  be removing damage points from one opponent to another. Also, I kept getting stuck after playing meeko. | references magica de spell shadowy and sinister; not covered by recent triage fixes |
| 2026-04-24 21:46 | `OSdOHsU4z2` | lilo bundled up, strength of a raging fire | lilo bundled up seems broken. challenged with a mowgli then attempted to strength of a raging fire and it did not remove. | references lilo bundled up, strength of a raging fire; not covered by recent triage fixes |
| 2026-04-24 17:17 | `-ly3Jx2NAK` | scar | wont let me skip scar's trigger | references scar; not covered by recent triage fixes |
| 2026-04-24 17:00 | `BXfKWfEixM` | donald duck along for the ride | Played Donald Duck - Along for the ride coming through.  It would not select the item in play. | references donald duck along for the ride; not covered by recent triage fixes |
| 2026-04-24 15:58 | `VdNc-p_ZBQ` | belle | when I used unconvetional tool banning it to play belle, i must use the ability where I would play an item paying 2 inks less, but the game not permited/acti... | references belle; not covered by recent triage fixes |
| 2026-04-24 14:55 | `CYCpxg3egg` | develop your brain, robin hood sharpshooter | Robin Hood Sharpshooter reveals develop your brain when questing to play it for free. Develop your brain effect is skipped and does not resolve | references develop your brain, robin hood sharpshooter; not covered by recent triage fixes |
| 2026-04-24 09:25 | `uvauFa3SD7` | hades | Hades sapphire card, ability interaction is wrong, the game let me chose the card to be inked rather than the player choosing | references hades; not covered by recent triage fixes |
| 2026-04-24 04:56 | `Kj2V7tbUuQ` | hades | Hades made me choose the target rather than the person who played Hades | references hades; not covered by recent triage fixes |
| 2026-04-24 04:38 | `tXalXZ6DxM` | hades | blue hades effect not letting you select player to put into inkwell | references hades; not covered by recent triage fixes |
| 2026-04-24 02:43 | `Asp4iPnVda` | megara | megara did not trigger a discard | references megara; not covered by recent triage fixes |
| 2026-04-24 02:32 | `0xdXH9C0b8` | hades infernal schemer | Hades Infernal Schemer blue is not allowing one to choose the character to banish. it allows opponent to choose. | references hades infernal schemer; not covered by recent triage fixes |
| 2026-04-24 02:09 | `kCbVvXoFsh` | hades | 7 drop blue hades has oppnent choose which card when it should be the player that played the hades that chooses the card to go into inwell | references hades; not covered by recent triage fixes |
| 2026-04-24 01:34 | `raqBUI97HQ` | pluto steel champion | Pluto (Steel Champion)'s effect is not working properly. When another Steel character is played, I should have the option to banish chosen item. The dialog t... | references pluto steel champion; not covered by recent triage fixes |
| 2026-04-24 01:10 | `kj7tzLR3wc` | hades | hades notworking right | references hades; not covered by recent triage fixes |
| 2026-04-23 21:43 | `8Qep0w617J` | hades | Opponent played hades and it let me choose what to ink | references hades; not covered by recent triage fixes |
| 2026-04-23 20:31 | `ZgZ5rGvOuO` | hades | When played, Sapphire hades. I wasn't able to pick the opponent's character. They picked. | references hades; not covered by recent triage fixes |
| 2026-04-23 19:27 | `-4iMLBkWM0` | hades | I played hades 7drop but the computer let the oppenet choose whom to ink? | references hades; not covered by recent triage fixes |
| 2026-04-23 18:33 | `_HLsA7vM7D` | hades | i cannot target with the effect from hades ( blue 7 ink). only my opponent move itself his charackter in the ink | references hades; not covered by recent triage fixes |
| 2026-04-23 18:27 | `8BHMddqsLq` | pluto steel champion | pluto steel champion effect to banish item would not resolve | references pluto steel champion; not covered by recent triage fixes |
| 2026-04-23 17:41 | `0FrWOIQ0tY` | hades infernal schemer | Hades Infernal Schemer has been letting the opponent pick which character to banish rather than the person who plays it, which isn't correct. | references hades infernal schemer; not covered by recent triage fixes |
| 2026-04-23 16:11 | `rODzCNPBnf` | lilo | YOU CANNOT PUT DMG ON LILO WITHOUT DAMAGING HER FIRST IT IS ALLOWING DMG TO BE PUT ON LILO EVEN THOUGH THE WORDING IS ''TAKE'' | references lilo; not covered by recent triage fixes |
| 2026-04-23 15:10 | `KQCiu3hKV7` | hades infernal schemer | When I played Hades Infernal Schemer my opponent got to choose the card affected instead of me choosing. | references hades infernal schemer; not covered by recent triage fixes |
| 2026-04-23 14:58 | `aBtMZ0bHQZ` | let it go | Opponent was just able to use "Let It Go" on cards with ward | references let it go; not covered by recent triage fixes |
| 2026-04-23 14:56 | `yiNxloLUU7` | hades infernal schemer | Hades - Infernal Schemer just allowed the  opponent to choose which card to banish when it should be the players choice. | references hades infernal schemer; not covered by recent triage fixes |
| 2026-04-23 14:54 | `S2orHyniLJ` | hades infernal schemer | When I play Hades-Infernal Schemer, my opponent can choose the character | references hades infernal schemer; not covered by recent triage fixes |
| 2026-04-23 14:46 | `xOWZAYbAtD` | emerald chromicon | emerald chromicon didn't go off | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-23 13:50 | `A6znQZVPn9` | hades | Robin Sharpshooter was readied after question for no reason. When I played Hades I could not target anything, and the game targeted their Tipo without any in... | references hades; not covered by recent triage fixes |
| 2026-04-23 13:45 | `RGbrKVZwZ6` | hades infernal schemer | I was able to resolve the effect of hades - infernal schemer instead of my opponent who played it | references hades infernal schemer; not covered by recent triage fixes |
| 2026-04-23 13:14 | `oRUzXENEDS` | hades, hades infernal schemer | When an opponent plays Hades - Infernal Schemer, it has me choose the target, when it should be the player who played the Hades | references hades, hades infernal schemer; not covered by recent triage fixes |
| 2026-04-23 02:10 | `X56FwjJA4z` | the black cauldron | Can't play cards from under cauldron | references the black cauldron; not covered by recent triage fixes |
| 2026-04-23 01:28 | `003cmvBKJx` | mickey mouse trumpeter | mickey mouse- trumpeter ability is auto playing the charater furtherst right in my hand instead of letting me pick | references mickey mouse trumpeter; not covered by recent triage fixes |
| 2026-04-23 00:45 | `hEt_DNY3sB` | mulan | Mulan 6 drop doesnt take out 2 characters after the challenge | references mulan; not covered by recent triage fixes |
| 2026-04-22 20:27 | `8l8KPdMj5s` | mulan | Big mulan can just choose 1 target after trigger ability | references mulan; not covered by recent triage fixes |
| 2026-04-22 20:24 | `iW9C8OhQCC` | goofy emerald champion | Goofy Emerald Champion didn't give my character ward. | references goofy emerald champion; not covered by recent triage fixes |
| 2026-04-22 19:16 | `3DD_KyyfLU` | be king undisputed | Be King Undisputed sometimes requires me to choose an opponent BUT the card states that the opponent gets to chose who goes, which means that it causes an er... | references be king undisputed; not covered by recent triage fixes |
| 2026-04-22 18:50 | `pyscpSFAoM` | and then along came zeus | And then along came zeus can't select locations. | references and then along came zeus; not covered by recent triage fixes |
| 2026-04-22 16:53 | `EHBlNEfME1` | sugar rush speedway finish line enchanted | Sugar Rush Speedway (Yellow) don't proc if the character, moved from Sugar Rush Speedway (Red) with the effect,  have only 1 hp left. | references sugar rush speedway finish line enchanted; not covered by recent triage fixes |
| 2026-04-22 16:33 | `7Fhmi2dZY2` | hades, prince phillip, stitch rock star | The Ward seemed broken for Prince Phillip ward to heroes card. Opponent was able to use Hades to banish both Stitch Rock Star (hero) and another Prince Phill... | references hades, prince phillip, stitch rock star; not covered by recent triage fixes |
| 2026-04-22 16:28 | `z6iAKIMSTw` | hades, prince phillip warden of the woods, stitch | I had a prince phillip warden of the woods out that should have given my Stitch Rock Start ward, but opponent was able to use Hades to remove it. | references hades, prince phillip warden of the woods, stitch; not covered by recent triage fixes |
| 2026-04-22 06:21 | `fAlul4AKWt` | aurora | Aurora didn't give my other characters ward | references aurora; not covered by recent triage fixes |
| 2026-04-22 04:19 | `7HGMmqLxDi` | be king undisputed, mulan elite archer | mulan elite archer card, when you do damage to 1 charecter you can do the same damage to up to 2 other chosen charecters. it only allows you to select one ot... | references be king undisputed, mulan elite archer; not covered by recent triage fixes |
| 2026-04-22 03:12 | `LZdNFipNLa` | the black cauldron | It won't allow me to play a card under the Cauldron | references the black cauldron; not covered by recent triage fixes |
| 2026-04-22 02:19 | `XK7nDhJoUC` | simba pride protector | Simba pride protector is giving the option to ready my opponents cards at the end of their turn and at the end of my turn. it should only ready my exerted ca... | references simba pride protector; not covered by recent triage fixes |
| 2026-04-22 01:47 | `byHIwlJeCQ` | jafar aspiring ruler | Jafar aspiring ruler automatically giving himself challenger 2 rather than allowing the player to choose. | references jafar aspiring ruler; not covered by recent triage fixes |
| 2026-04-21 23:35 | `8SU9iPaVlI` | flynn | cant boost flynn rider? when i try to click the green boost tag it does nothing. | references flynn; not covered by recent triage fixes |
| 2026-04-21 17:44 | `1x-4AmFwVS` | mulan elite archer | Mulan - Elite Archer only gives option to deal damage to only one additional character instead of two. | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-21 17:28 | `bx6TlqOcRX` | mulan ready for battle, namaari single minded rival | Mulan - Ready for battle only gave 1 discount even though I had Namaari - Single-Minded Rival with damage on board  with poer +5 and 3 damage | references mulan ready for battle, namaari single minded rival; not covered by recent triage fixes |
| 2026-04-21 16:54 | `S9bPEXXcNZ` | donald duck | I passed my turn, accepted opponent's Donald Duck card draw option. Game locked up. It said I had priority but had no way to pass turn (again). | references donald duck; not covered by recent triage fixes |
| 2026-04-21 13:18 | `FN8f85nJEQ` | dinky has the brains | Dinky - Has the Brains continues to appear to be broken. It is supposed to cause the opponent to deal damage to one  of their characters, but opponents seem ... | references dinky has the brains; not covered by recent triage fixes |
| 2026-04-21 12:41 | `flqURxUjpn` | fa zhou war hero | Fa Zhou, War Hero, the text says when a character banishes another character in a challenge, if it was the second challenge, gain 3 lore.  I had the characte... | references fa zhou war hero; not covered by recent triage fixes |
| 2026-04-21 08:14 | `ROLCIyFmA9` | and then along came zeus | and then along came Zeus wasn't able to target the library | references and then along came zeus; not covered by recent triage fixes |
| 2026-04-21 05:13 | `-hwuv11NKx` | goofy emerald champion | Goofy emerald champion effect doesnt work giving all emerald characters ward. | references goofy emerald champion; not covered by recent triage fixes |
| 2026-04-21 00:36 | `wExoAkOTmy` | jafar aspiring ruler | Jafar aspiring ruler didn't give me an option to choose a character. It just chose itself immediately when I played it | references jafar aspiring ruler; not covered by recent triage fixes |
| 2026-04-20 13:02 | `r_ipeaBGG9` | next stop olympus | Won't allow me to play next stop Olympus for free when I have 2 characters in play with 5 attack | references next stop olympus; not covered by recent triage fixes |
| 2026-04-20 11:14 | `S_wzZ96D62` | maui, maui half shark | I challenged a location with maui half shark and game made me do the maui trigger, but i couldnt even select a card | references maui, maui half shark; not covered by recent triage fixes |
| 2026-04-20 10:46 | `R7VGz4qhGF` | aurora dreaming guardian, rapunzel, they never come back | ai targeted Rapunzel with they never come back although ward active from aurora dreaming guardian | references aurora dreaming guardian, rapunzel, they never come back; not covered by recent triage fixes |
| 2026-04-20 06:13 | `YeTS_c_bDQ` | dinky has the brains | Dinky Has the Brains has a bug -opponent cant select target for 1 damage | references dinky has the brains; not covered by recent triage fixes |
| 2026-04-20 05:57 | `uk5njLcUQM` | mulan elite archer | Mulan - Elite Archer can only select (1) target with her effect. | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-20 02:32 | `z4WfGsQuVS` | be king undisputed | Be king undisputed didnt activated opponent to discard a character | references be king undisputed; not covered by recent triage fixes |
| 2026-04-20 02:22 | `vRzKvoF_f4` | pete | Pete - Ghost did not trigger even with a boost. | references pete; not covered by recent triage fixes |
| 2026-04-20 02:11 | `kUUJqGhIwY` | elsa | Elsa (one which causes two characters to tap down ) was selected by their own player and then readied at the beginning of their turn. | references elsa; not covered by recent triage fixes |
| 2026-04-20 01:49 | `22UWb0cUKP` | aurora dreaming guardian, horseman's strike | I had a Grandmother Willow in play and it somehow went to my discard when my opponent played Headless Horseman when Grandmother Willow received Ward from Aur... | references aurora dreaming guardian, horseman's strike; not covered by recent triage fixes |
| 2026-04-19 22:33 | `0r2BrzGfhV` | elsa | pluto whit damage still killing my elsa 5th spirit | references elsa; not covered by recent triage fixes |
| 2026-04-19 19:04 | `8GnaSW_RP4` | be king undisputed | Be King Undisputed is not working. It's asking me to select a target (which shouldn't) and nothing happens. | references be king undisputed; not covered by recent triage fixes |
| 2026-04-19 17:46 | `tOf1pEEiSF` | elsa, tinker bell | my tinkerbell was beaten by elsa but thats not right. my opponet readyd elsa again after that .. | references elsa, tinker bell; not covered by recent triage fixes |
| 2026-04-19 07:29 | `Om06ohTxLO` | lilo | lilo ability layers; does not work she should not take damgage the first time she is supposed to | references lilo; not covered by recent triage fixes |
| 2026-04-19 05:19 | `x0NzNifRqr` | mulan | Mulan's Triple Arrow effect is not working correctly. She should be able to pick two targets to also deal damage to. However the resolution screen only allow... | references mulan; not covered by recent triage fixes |
| 2026-04-19 03:35 | `l2GBoufoHN` | iago, pull the lever | I played "pull the lever" on an Iago. He has Vanish. He should have been removed but went to the players hand instead. | references iago, pull the lever; not covered by recent triage fixes |
| 2026-04-19 02:50 | `6lkZBmo6Za` | education or elimination | Tod did not ready when targeted by Education or Elimination | references education or elimination; not covered by recent triage fixes |
| 2026-04-19 02:25 | `RwRsfqQ5lf` | maui half shark | Maui Half Shark Challenged a location and got an action card back from discard. It should only be a character. | references maui half shark; not covered by recent triage fixes |
| 2026-04-18 18:36 | `y6Zx4-5cHs` | the black cauldron | not allowing card to be played from under cauldron | references the black cauldron; not covered by recent triage fixes |
| 2026-04-18 16:36 | `B8d67C9twB` | madam mim | Mim Elephant wont let me past the pop up.  no damage to move but wont let me past the option.  Mim has 0 damage so nothing to move! | references madam mim; not covered by recent triage fixes |
| 2026-04-18 09:54 | `CE3MytTMcn` | graveyard of christmas future lonely resting place, lilo | when Another Chance from Graveyard of Christmas Future is activated, the log showed it as being an activation of 2-cost Lilo | references graveyard of christmas future lonely resting place, lilo; not covered by recent triage fixes |
| 2026-04-18 08:39 | `dFnB7xTKg8` | tinker bell | Tinkerbell banished an opponents only character and could not resolve effect. | references tinker bell; not covered by recent triage fixes |
| 2026-04-18 07:59 | `IDfJBTPs6o` | mulan | mulan archer effect | references mulan; not covered by recent triage fixes |
| 2026-04-18 05:32 | `oGoLNliukz` | mulan | Could not target 2 with the mulan effect | references mulan; not covered by recent triage fixes |
| 2026-04-18 03:25 | `CAVvUrpOXM` | strength of a raging fire | Whenever I have to "choose a character" like choosing a character to deal damage to from Strength of a Raging Fire, or moving damage with Chesire Cat, it is ... | references strength of a raging fire; not covered by recent triage fixes |
| 2026-04-18 02:19 | `kpTh7ueIMW` | mickey mouse | Opponent discarded when mickey challenged another character | references mickey mouse; not covered by recent triage fixes |
| 2026-04-18 01:58 | `z9BTiDVBhT` | kuzco | The kuzco's effect is wrong I cannot be able to select | references kuzco; not covered by recent triage fixes |
| 2026-04-17 22:57 | `97ksKJP266` | madam mim | Mim elephant, cant select target or skip | references madam mim; not covered by recent triage fixes |
| 2026-04-17 20:49 | `65GdN_EInp` | darkwing duck cool under pressure enchanted, darkwings chair set | Darkwings chair set. effekt heals 4 damage it it is a Darkwing duck charakter. in my game against bot banishing the item only heald 2 damage from my Darkwing... | references darkwing duck cool under pressure enchanted, darkwings chair set; not covered by recent triage fixes |
| 2026-04-17 20:27 | `360zCSDiEZ` | meeko skittish scrounger | meeko - skittish scrounger ability: bottomless pit, is triggering even though the character is still drying and not exerted. | references meeko skittish scrounger; not covered by recent triage fixes |
| 2026-04-17 15:44 | `sjm35BKQKT` | we know the way | We know the way does not see itself | references we know the way; not covered by recent triage fixes |
| 2026-04-17 12:54 | `VXXUjES81W` | jasmine fearless princess | When using the Now's My Chance ability with Jasmine Fearless Princess, she automatically exerts.  This is incorrect.  She should not exert when using that ab... | references jasmine fearless princess; not covered by recent triage fixes |
| 2026-04-17 11:51 | `wNU7wDlqmn` | donald duck perfect gentleman | when donald duck - perfect gentlemen triggers start at the start of my turn its causing my opponent to have to ink, playand quest with all cards before it pa... | references donald duck perfect gentleman; not covered by recent triage fixes |
| 2026-04-17 10:27 | `u0I06vlJTu` | donald duck fred honeywell | Donald Duck fred Honeyhail draw does not Activate Robin Hood with boost on steel, we cant target 2 characters with abilities, | references donald duck fred honeywell; not covered by recent triage fixes |
| 2026-04-17 06:26 | `V_ke-csEKq` | be king undisputed | playing instead of singing be king undisputed doesn't let the opponent vhoose the card, it asks me instead | references be king undisputed; not covered by recent triage fixes |
| 2026-04-17 05:28 | `ogA0p6YSro` | mulan elite archer | Mulan elite archer cannot choose 2 characters, it only allows you to choose one | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-17 03:28 | `fGsyilLdkx` | heihei persistent presence, the horned king triumphant ghoul | Heihei - Persistent Presence should mechanically pass through discard before being returned to hand - so should trigger The Horned King - Triumphant Ghoul's ... | references heihei persistent presence, the horned king triumphant ghoul; not covered by recent triage fixes |
| 2026-04-17 03:23 | `NYKfJO4Z0L` | the black cauldron | It could be UI or it could be a bug. If UI - I can't find how to play a character from The Black Cauldron. I have successfully exerted the item, and I can se... | references the black cauldron; not covered by recent triage fixes |
| 2026-04-17 03:02 | `mgSu-VwZxo` | meeko skittish scrounger | Meeko - Skittish Scrounger's effect has been triggered, even though he wasn't exerted. | references meeko skittish scrounger; not covered by recent triage fixes |
| 2026-04-17 02:26 | `v_i3R2iQz_` | mulan elite archer | Mulan Elite Archer - when she challenges, she should be able to deal damage to TWO characters not just one. | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-17 00:38 | `m-KJKeuCWA` | dinky has the brains | Whenever I play Dinky - Has the Brains, my opponent is unable to choose a character for their ability | references dinky has the brains; not covered by recent triage fixes |
| 2026-04-16 23:14 | `ilQofbfC88` | mulan | Mulan archer didn't give me trigger to do damage to other 2 characters | references mulan; not covered by recent triage fixes |
| 2026-04-16 22:12 | `3BYfjMDc5B` | dinky has the brains | Dinky - Has The Brains when played triggers his ability but the opponent cannot select a target with the current UI so they are stuck and cannot proceed with... | references dinky has the brains; not covered by recent triage fixes |
| 2026-04-16 20:17 | `nRfZ6OUq7V` | madam mim | Can’t ignore Mim ability but can’t confirm without damage | references madam mim; not covered by recent triage fixes |
| 2026-04-16 19:38 | `xUIYMkgJyd` | mulan elite archer | Mulan - Elite Archer's Triple Shot ability triggers and once selected 0 characters cannot be chosen and their is no way to cancel accepting the trigger. | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-16 19:36 | `OLIudkkmpL` | mulan elite archer | Mulan - Elite Archer's triple shot ability only allowed me to target one character and not two. | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-16 18:24 | `0Trx8Bs8OG` | queens sensor core | could get daisy duck with queens sensor core | references queens sensor core; not covered by recent triage fixes |
| 2026-04-16 15:44 | `jgqdXX7Zr1` | belle accomplished mystic | Used Belle, Accomplished Mystic to move one damage. Selected both targets and hit confirm, but the damage didn't actually move from one target to the other. | references belle accomplished mystic; not covered by recent triage fixes |
| 2026-04-16 13:32 | `IcotEz1obw` | tamatoa happy as a clam | when playing tamatoa happy as a clam and you do not have items, you don't have the options to cancel your effect succesfully | references tamatoa happy as a clam; not covered by recent triage fixes |
| 2026-04-16 11:03 | `8nlb6jzm2Q` | the black cauldron | I was not able to play my character from cauldron | references the black cauldron; not covered by recent triage fixes |
| 2026-04-16 11:00 | `V_Lx-_1Luk` | maui, raging storm | played "raging storm" with two maui sharks on board for the win, but it didnt give me any lore when i played it | references maui, raging storm; not covered by recent triage fixes |
| 2026-04-16 02:12 | `cXPzNXQu4S` | madam mim | Mim shouldnt allow a player to choose a target.  the source of the damage removal is always herself.  also- the way it is coded now it is backwards. | references madam mim; not covered by recent triage fixes |
| 2026-04-16 00:56 | `seFAaF5XRT` | moana, pete | moana ancestral legacy not working  Not allowing to boost pete | references moana, pete; not covered by recent triage fixes |
| 2026-04-16 00:15 | `mQCOqFa-jK` | be king undisputed | Be King Undisputed will not execute. It says it cannot be played right now even when characters are out to be banished and the cost is played for the song. H... | references be king undisputed; not covered by recent triage fixes |
| 2026-04-15 23:16 | `PMQVDTBMDt` | ariel ethereal voice | Ariel Ethereal Voice allows you to draw a card even if there isn't a card under her | references ariel ethereal voice; not covered by recent triage fixes |
| 2026-04-15 21:10 | `A8nwTGg7eR` | mulan | I was not able to select targets using Mulan Elite | references mulan; not covered by recent triage fixes |
| 2026-04-15 20:55 | `PhOZZbjX1b` | mickey mouse | Ember Champion Mickey is removed but a card isn't banished when they have 5 willpower and 5 damage | references mickey mouse; not covered by recent triage fixes |
| 2026-04-15 18:06 | `Qo1rV6VDY0` | genie, hades infernal schemer | When my boosted Genie was put into the inkwell by Hades - Infernal Schemer, I could see the card that was under Genie. I believe that should be unknown infor... | references genie, hades infernal schemer; not covered by recent triage fixes |
| 2026-04-15 17:29 | `6g7pv_R-tM` | angel experiment 624, lady miss park avenue, lilo escape artist, mickey mouse amber champion | Mickey Mouse - Amber Champion is not giving +2 health to characters. Managed to banish Lady - Miss Park Avenue with Seven Dwarfs' Mine and Lilo - Escape Arti... | references angel experiment 624, lady miss park avenue, lilo escape artist; not covered by recent triage fixes |
| 2026-04-15 17:19 | `2ulsT4obDF` | mulan | mulan doesnt work | references mulan; not covered by recent triage fixes |
| 2026-04-15 16:54 | `mJTvaUzaGM` | lilo, robin hood sharpshooter | 5 cost red legendary lilo was not able to be played even though I played 3 actions in the turn. 2 I played using ink and 1 I played for free using robin hood... | references lilo, robin hood sharpshooter; not covered by recent triage fixes |
| 2026-04-15 16:11 | `dP3DVKbpWq` | mickey mouse | Angel 2c has 3 damage counters after Mickey Amber Champion dies. Angel should die. | references mickey mouse; not covered by recent triage fixes |
| 2026-04-15 15:33 | `wvNpBmk2Cs` | lilo, mickey mouse | Lilo has 2 damage but was buffed by mickey amber champion.  When he was removed she did not die | references lilo, mickey mouse; not covered by recent triage fixes |
| 2026-04-15 14:56 | `53m8GBTzns` | mulan | Couldn't choose 2 characters when activating Mulan- Skilled Archer's effect of banishing a character and dealing damage up to 2 other characters | references mulan; not covered by recent triage fixes |
| 2026-04-15 13:45 | `txVTF0rjcH` | ed hysterical partygoer | Opponent has a tapped ed hysterical partygoer and i have a liquidator with one damage. The app will not let me pass turn because it want me to challenge even... | references ed hysterical partygoer; not covered by recent triage fixes |
| 2026-04-15 13:00 | `3lADhcpaYM` | ohana means family | Ohana means family removes all damage from all characters instead of chosen character. | references ohana means family; not covered by recent triage fixes |
| 2026-04-15 12:59 | `rW-bOR2isR` | belle | wont let me banish item belle ability | references belle; not covered by recent triage fixes |
| 2026-04-15 09:42 | `jamVzPUezc` | mulan elite archer | Mulan Elite Archer really won't let me target a 2nd target for triple shot | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-15 02:59 | `fiC23gYolP` | vision of the future | I quested with Robin Hood Sharp shooter and chose Vision of the future and it didn't trigger | references vision of the future; not covered by recent triage fixes |
| 2026-04-15 02:35 | `55MmMyc1Qj` | max goof chart topper enchanted | max goof chart toppers ability won't let me pick a card to use from discard | references max goof chart topper enchanted; not covered by recent triage fixes |
| 2026-04-15 00:28 | `GsCuD0rHAY` | ohana means family | Ohana Means Family healed all damage on the board and drew that many cards. | references ohana means family; not covered by recent triage fixes |
| 2026-04-14 22:57 | `WkIKI4jB4j` | the black cauldron, the horned king triumphant ghoul | I exerted The Black Cauldron and put a character from my discard under it. It didn't trigger The Horned King Triumphant Ghoul's extra lore bonus due to a car... | references the black cauldron, the horned king triumphant ghoul; not covered by recent triage fixes |
| 2026-04-14 22:51 | `puEyz2R8ld` | kristoff icy explorer | Kristoff Icy Explorer's "Hidden Depths" triggered and was able to be resolved without having an Anna in play. (There is an Anna in my inkwell). | references kristoff icy explorer; not covered by recent triage fixes |
| 2026-04-14 19:04 | `JdcCIKNTmI` | mulan | Mulan only selects one unit  support in Mulan did not trigger | references mulan; not covered by recent triage fixes |
| 2026-04-14 15:36 | `kZxHTADSCU` | cinderella | On turn 5 I played 4 drop Cinderella. I skipped her effect (put a card from my hand into my inkwell to draw another card) on purpose. The bug happened in the... | references cinderella; not covered by recent triage fixes |
| 2026-04-14 14:54 | `pCeN90ibIr` | under the sea | under the sea triggered the library, under the sea is not a banish effect | references under the sea; not covered by recent triage fixes |
| 2026-04-14 13:48 | `YVsAVJkmOo` | scrooge mcduck reformed ebenezer | Scrooge McDuck - Reformed Ebenezer does not trigger his effect when he is played. I should be able to put a card under each one of my characters but I get no... | references scrooge mcduck reformed ebenezer; not covered by recent triage fixes |
| 2026-04-14 12:57 | `7qAf6_fd3Z` | ohana means family | Ohana means family, healed everyone on the board, even opponents.... then gave me that amount of cards.... should only by 1 character and my own | references ohana means family; not covered by recent triage fixes |
| 2026-04-14 09:33 | `6i8VhBipy5` | beast | I couldn't attack with my Beast that had rush | references beast; not covered by recent triage fixes |
| 2026-04-14 08:27 | `bAZWqTauGV` | hercules | boosted hercules and did no dmg | references hercules; not covered by recent triage fixes |
| 2026-04-14 01:46 | `1wc8EvsKBP` | the islands i pulled from the sea | Playing "The Islands I Pulled From The Sea" didn't give me a choice of location from my deck - it autoselected one for me (no idea if random or if just 'the ... | references the islands i pulled from the sea; not covered by recent triage fixes |
| 2026-04-13 17:53 | `2_6A6xRNWm` | the black cauldron | The second effect of the Black Cauldron doesn't apply, it only selects the card but you can't summon it. | references the black cauldron; not covered by recent triage fixes |
| 2026-04-13 17:32 | `Kqq2g5UQ84` | megabot | Megabot doesnt work | references megabot; not covered by recent triage fixes |
| 2026-04-13 16:00 | `X8x3lYUD_W` | food fight | Food Fight's ability can't be triggered after activation, even if the ink cost is met | references food fight; not covered by recent triage fixes |
| 2026-04-13 09:57 | `ZuLbNin-V-` | moana kakamora leader | Moana - Kakamora Leader can only move 1 character to a location | references moana kakamora leader; not covered by recent triage fixes |
| 2026-04-13 09:40 | `5Gne4PG2I9` | goliath clan leader, next stop olympus | I was unable to select Goliath clan leader as a target when I played the card, Next stop Olympus to ready him. | references goliath clan leader, next stop olympus; not covered by recent triage fixes |
| 2026-04-13 09:08 | `4meujpIklP` | cinderella | Cinderella dream comes true triggers every turn | references cinderella; not covered by recent triage fixes |
| 2026-04-13 09:02 | `hISpSwlSxD` | ohana means family | Ohana means family heals and draws for all damage | references ohana means family; not covered by recent triage fixes |
| 2026-04-13 04:07 | `WLL4X0Qn2m` | mickey mouse amber champion, the mob song | Mickey Mouse (amber champion) ability-when 2 other amber characters in play this character gets singer 8--doesn't take effect   The Mob Song-- should be able... | references mickey mouse amber champion, the mob song; not covered by recent triage fixes |
| 2026-04-13 04:06 | `raDdsd0-0H` | cinderella | I just ended up being allowed to do a Cinderella ramp twice while only having played her once, last turn. | references cinderella; not covered by recent triage fixes |
| 2026-04-13 03:00 | `Yb3oSlTDn1` | hercules | Boost Hercules had a card under him (gets +*3 when boosted) and challenged Prince Philip - Prince Philip should  have been banished but did not sustain any d... | references hercules; not covered by recent triage fixes |
| 2026-04-13 01:51 | `C1MHZTfynL` | ariel | can't boost ariel for draw 1 card when singing | references ariel; not covered by recent triage fixes |
| 2026-04-13 01:51 | `7n72itLuqK` | cinderella | Cinderella was able to boost even when I didnt play a princess | references cinderella; not covered by recent triage fixes |
| 2026-04-13 01:47 | `hXMWbz12Db` | pete | Cant boost pete :( | references pete; not covered by recent triage fixes |
| 2026-04-13 01:24 | `w7psTqcSBp` | mulan elite archer | Mulan Elite Archer doesn't perform the double attack. | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-13 01:16 | `wJVWf_u_9s` | basil disguised detective | Basil Disguised Detective can't do the twist and turns ability system doesn't let me select the ink to pay nor an opponent's hand trigger doesn't work | references basil disguised detective; not covered by recent triage fixes |
| 2026-04-12 22:47 | `VlILC4KgGa` | cinderella | Cinderella activating every time whitout a princess being played, Lady tremaine boost activating even if she did not boost that turn, Kristoff's lute Singing... | references cinderella; not covered by recent triage fixes |
| 2026-04-12 21:52 | `nwctC0vuv0` | emerald chromicon | Emerald Chromicon doesnt trigger on my opponents turn as Expected | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-12 21:41 | `K5_fGTIHi5` | cinderella | I could do the ability of cinderella every turn | references cinderella; not covered by recent triage fixes |
| 2026-04-12 19:08 | `N08cEorJhg` | cinderella | Cinderella's effect to ink a card triggerred after every turn even when I did not play a princess card. | references cinderella; not covered by recent triage fixes |
| 2026-04-12 18:18 | `pJnHS16fT8` | hercules | The Boost on the 1 cost Hercules to give him +3 challenge did not work. | references hercules; not covered by recent triage fixes |
| 2026-04-12 18:02 | `HjnxiOeikR` | horseman's strike | playing vincenzo causes horseman strikes and not his ability | references horseman's strike; not covered by recent triage fixes |
| 2026-04-12 16:56 | `MZtLQuHrdv` | emerald chromicon | Emerald Chromicon doesnt trigger if more then 2 effects take action after a banish | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-12 16:55 | `DLSJRzV4Pd` | emerald chromicon | The emerald chromicon doesnt trigger every time | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-12 16:35 | `9FjTqJLJuT` | anastasia bossy stepsister | The Anastasia - Bossy Stepsister ability is triggering on the wrong player. The opponent challenged my Anastasia, therefore, they should discard a card. Howe... | references anastasia bossy stepsister; not covered by recent triage fixes |
| 2026-04-12 16:30 | `RowMtVW61b` | mickey mouse brave little prince | Mickey Mouse - Brave Little Prince had a card underneath it but was taken out with 2 damage even tho it had higher stats because of the card under it. When S... | references mickey mouse brave little prince; not covered by recent triage fixes |
| 2026-04-12 15:31 | `1ajClfXRym` | elsa, hades looking for a deal | Match log said I played Elsa - Fifth Spirit when I actually played Hades - Looking for a Deal | references elsa, hades looking for a deal; not covered by recent triage fixes |
| 2026-04-12 14:48 | `SbpnJ1ks1C` | cinderella dream come true | Cinderella Dream Come True's effect is triggered by legendary clarabelle | references cinderella dream come true; not covered by recent triage fixes |
| 2026-04-12 14:04 | `_92x10FhuJ` | hercules | Hercules is not getting strength gain from boost | references hercules; not covered by recent triage fixes |
| 2026-04-12 13:03 | `xfiXDGOGtJ` | kuzco, pete ghost of christmas future | Pete - Ghost of Christmas referred to as kuzco in text report | references kuzco, pete ghost of christmas future; not covered by recent triage fixes |
| 2026-04-12 11:05 | `opYCQuE-gW` | emerald chromicon | Emerald Chromicon not working, When opponent is banishing my characters, it is not giving me the option to return one of their characters to hand. | references emerald chromicon; not covered by recent triage fixes |
| 2026-04-12 10:41 | `3PzMMfX3s-` | cinderella | 4 Coste Saphhire Cinderella effect Trigger showed up at each round. Even, if no Princess was played. | references cinderella; not covered by recent triage fixes |
| 2026-04-12 09:56 | `CaxKw8qAyd` | donald duck | Donald effect along with guard royal blocked the game | references donald duck; not covered by recent triage fixes |
| 2026-04-12 07:56 | `55TA5BDRDe` | hercules | when i boost my hercules he does not get the plus 3 attack | references hercules; not covered by recent triage fixes |
| 2026-04-12 06:14 | `3B5Kzv0q5b` | cinderella | Blue Cinderella triggers every end of turn for no reason | references cinderella; not covered by recent triage fixes |
| 2026-04-12 05:03 | `y0Hp-ssckp` | cinderella | Cinderella wish fufil shouldn't be asking for an effect each turn when no princess is played | references cinderella; not covered by recent triage fixes |
| 2026-04-12 03:47 | `ma1LcFCDRN` | horseman's strike, prince phillip vanquisher of foes, prince phillip warden of the woods | Prince Phillip - Warden of the Woods did not give Ward to my Prince Phillip - Vanquisher of Foes despite the Hero classification. My opponent was able to tar... | references horseman's strike, prince phillip vanquisher of foes, prince phillip warden of the woods; not covered by recent triage fixes |
| 2026-04-12 02:21 | `DE0jMtIzxN` | mulan | Mulan Archer is supposed to ping damage to 2 additional characters. It only allowed me to do one. | references mulan; not covered by recent triage fixes |
| 2026-04-12 00:27 | `RjlPKIDMVE` | mulan, mushu majestic dragon | Mulan took 5 damage, from a character with 5 strength, while Mushu Majestic dragon was on the table | references mulan, mushu majestic dragon; not covered by recent triage fixes |
| 2026-04-12 00:26 | `SvzjUZPuuQ` | mulan elite archer | Mulan Elite archer not having choices causes the game to glitch out and not fully resolve | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-11 22:41 | `OynYwrRFE8` | sugar rush speedway finish line | Islands I Pulled from the Sea did not let me choose which location card from my deck to reveal and add to my hand. It just gave me Sugar Rush Speedway Finish... | references sugar rush speedway finish line; not covered by recent triage fixes |
| 2026-04-11 21:02 | `q95A252WO5` | nani stage manager | The card chosen for Nani Stage Manager is not revealed to opponent | references nani stage manager; not covered by recent triage fixes |
| 2026-04-11 20:49 | `ae_bPNT5Xz` | bounce, emerald chromicon | Emerald Chromicon bounce effect unavailable unless Scrooge bounces himself back. | references bounce, emerald chromicon; not covered by recent triage fixes |
| 2026-04-11 20:12 | `N4E6mq1c4v` | mulan | Mulan's splash damage did not used the boosted attack strength. | references mulan; not covered by recent triage fixes |
| 2026-04-11 20:09 | `-U_IruadcL` | hercules | Hercules whisper does not gain attack strength when boosted | references hercules; not covered by recent triage fixes |
| 2026-04-11 19:06 | `_V2YKbRi5N` | mulan | I cant choose opponents for Mulan archers effect | references mulan; not covered by recent triage fixes |
| 2026-04-11 18:54 | `Q4QzP5DpNh` | aurora, elsa | While having a Aurora (161EN9) in play, a Penny (17EN7) was tarjgeted by an elsa an exerted If there is an Hero she has Ward and should not be able to be tar... | references aurora, elsa; not covered by recent triage fixes |
| 2026-04-11 18:37 | `eUmbrpLwgX` | strength of a raging fire | The game wouldn’t let me select a target for strength of a raging fire. Then suddenly it played all the cards from my hand and skipped my turn. | references strength of a raging fire; not covered by recent triage fixes |
| 2026-04-11 18:37 | `hHytxhmCLp` | donald duck flustered sorcerer | Game ended when oponent hit 20 lore but donald duck flustered sorcerer was in play | references donald duck flustered sorcerer; not covered by recent triage fixes |
| 2026-04-11 17:48 | `hgZGdk5_KN` | hercules | When hercules 1 drop was boosted it attacked for 0 instead of 3. | references hercules; not covered by recent triage fixes |
| 2026-04-11 17:46 | `f4_lWXjeob` | be king undisputed | Be King Undisputed wont work | references be king undisputed; not covered by recent triage fixes |
| 2026-04-11 17:01 | `-nLyIyuceY` | swooping strike | swooping strike wont work | references swooping strike; not covered by recent triage fixes |
| 2026-04-11 16:21 | `8bka6iJoLJ` | anna soothing sister, prince phillip | Anna soothing sister questing effect not working. Targeted prince phillip in discards, but still only quested for 1 | references anna soothing sister, prince phillip; not covered by recent triage fixes |
| 2026-04-11 16:15 | `f4Oa74sLP7` | anna little sister | Anna little sister not allowing me to choose cards from my opponent's discard | references anna little sister; not covered by recent triage fixes |
| 2026-04-11 14:59 | `EQU2Uullp_` | basil disguised detective | Basil disguised detective doesn't allow me to choose my opp to discard a card when inking | references basil disguised detective; not covered by recent triage fixes |
| 2026-04-11 14:49 | `OTLIFoT77u` | mulan elite archer | Could only select 1 additional target for Mulan Elite Archer | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-11 12:41 | `YnVGrIFZB_` | mulan elite archer | when using mulan elite archer's ability you can only select 1 opposing character not the max 2 that the ability allows | references mulan elite archer; not covered by recent triage fixes |
| 2026-04-11 10:50 | `CZErtu18dv` | hercules | Hercules Migjty Leader still Buggy. Its impossble to play the Deck right, if he gets damage while he Attacked. Hercules only gets Damaged when he is Attacked... | references hercules; not covered by recent triage fixes |
| 2026-04-11 10:37 | `YAHZE9CFLR` | hercules | AI Duel. Chemie Cat Effekt cant be Resolved by AI.  Hercules Effect still Buggy. Hercules gets Damaged , if he Attacks. | references hercules; not covered by recent triage fixes |
| 2026-04-11 08:12 | `10foYRxsjd` | hercules | My Hercules died when challenging. | references hercules; not covered by recent triage fixes |
| 2026-04-11 08:06 | `oP47RkpjRV` | hercules mighty leader | Hercules mighty leader take damage when he challenge. | references hercules mighty leader; not covered by recent triage fixes |
| 2026-04-11 08:03 | `DgkQqnKgxH` | mickey mouse | Nanie should have died when Mickey died | references mickey mouse; not covered by recent triage fixes |
| 2026-04-11 07:16 | `WCV-Ko3GxP` | maui half shark, raging storm | Maui Half Shark did not trigger after a raging storm | references maui half shark, raging storm; not covered by recent triage fixes |
| 2026-04-11 01:21 | `k6-7Dr4hMw` | ariel, i2i | Sang I2I with ariel out. shows as a pending effect but cant do anything | references ariel, i2i; not covered by recent triage fixes |
| 2026-04-11 01:03 | `tbxGLndteb` | mickey mouse | scrooge putting card under mickey brave little prince triggered ward but not mickey effect | references mickey mouse; not covered by recent triage fixes |
| 2026-04-10 21:48 | `M2Q8dw2Vgz` | infra pink ultra scan specs | Infra-Pink Ultra Scan Specs allowed me to play them for 0 ink. | references infra pink ultra scan specs; not covered by recent triage fixes |
| 2026-04-10 20:24 | `79FronTTMt` | hercules | The card "Hercules-Sectral Demi-God" will not do damage even though the card is boosted. It should gave 3 power and be able to challenge and banish "Christop... | references hercules; not covered by recent triage fixes |
| 2026-04-10 19:51 | `AbgX4ZMpAn` | cinderella dream come true | The Cinderella Dream Come True is bugged, she's activating the ability every turn even if i dont play any princess | references cinderella dream come true; not covered by recent triage fixes |
| 2026-04-10 19:16 | `heVVRE_Zuz` | sail the azurite sea | The sidebar of what has happened is calling Sail the Azurite Sea a different card. | references sail the azurite sea; not covered by recent triage fixes |
| 2026-04-10 18:56 | `zV23IXUDD7` | ohana means family | Ohana means family works on all my characters not just 1 | references ohana means family; not covered by recent triage fixes |
| 2026-04-10 18:00 | `5HtfJZYAfZ` | donald duck | The Daisy Duck - Donald's Date is not showing the card at the top of the deck. | references donald duck; not covered by recent triage fixes |
| 2026-04-10 16:43 | `XJazDGE3Cw` | hercules | Hercules Set 10 was Banned, when I Attack opponent. Hercules gets no Damage unless he is Challanged | references hercules; not covered by recent triage fixes |
| 2026-04-10 05:59 | `Ffi-kwTDmx` | scrooges counting house ebenezers office | scrooges counting house location is not gaining the bonus lore for having cards under it. | references scrooges counting house ebenezers office; not covered by recent triage fixes |
| 2026-04-10 05:15 | `AwQrSzcCUc` | genie | Won't allow me to Boost Genie | references genie; not covered by recent triage fixes |
| 2026-04-10 03:11 | `vVpRF93nYm` | lilo escape artist | Lilo Escape Artist is not coming out for 1 ink when Grandmother Willow is out. | references lilo escape artist; not covered by recent triage fixes |
| 2026-04-10 02:53 | `zEXNrIBjj-` | tiana | Tiana's pay 3 does not trigger when you attack her | references tiana; not covered by recent triage fixes |
| 2026-04-10 02:47 | `BIHAzk5g3M` | mickey mouse | I had a yellow mickey that gives 2 extra health to all yellow characters. Opponent placed it in my inkwell. My other characters had enough damage they should... | references mickey mouse; not covered by recent triage fixes |
| 2026-04-10 02:15 | `PGC4JrS_-Y` | mulan, nala | I just found this button, but in my previous game my opponent challenged with Mulan archer and it incorrectly killed my 2-cost Nala that had resist because i... | references mulan, nala; not covered by recent triage fixes |
| 2026-04-10 00:46 | `cG5URNH37d` | moana | Moana Ancestry Ability did not proc | references moana; not covered by recent triage fixes |
| 2026-04-10 00:40 | `4xRvfs5r24` | belle snowfield strategist | Belle Snowfield Strategist did not proc for herself. | references belle snowfield strategist; not covered by recent triage fixes |
| 2026-04-10 00:37 | `oHv_Z00v4j` | belle snowfield strategist, he hurled his thunderbolt | Belle - Snowfield Strategist was banished by a song (He Hurled His ThunderBolt) and she went into the discard. I wasn't given the option to turn her into ink. | references belle snowfield strategist, he hurled his thunderbolt; not covered by recent triage fixes |
| 2026-04-10 00:25 | `aoq1EBcwtO` | genie | I can't boost Genie  Magical | references genie; not covered by recent triage fixes |
| 2026-04-10 00:23 | `lRtMGIR_Q9` | how far i'll go | How Far I'll go, pops up a window to choose between Hand and Inkwell, but does not show the two top cards from the deck | references how far i'll go; not covered by recent triage fixes |
| 2026-04-10 00:18 | `HvYcIczLlJ` | how far i'll go | I was not able to see cards from How Far I'll Go. It wanted me to select but I could not see them. | references how far i'll go; not covered by recent triage fixes |
| 2026-04-09 23:10 | `zylIz1FxnR` | genie magical researcher | I wasn't allowed to boost Genie - Magical Researcher on play with 1 ink available. | references genie magical researcher; not covered by recent triage fixes |
| 2026-04-09 20:54 | `gAkd1PhSj2` | the horseman strikes | the horseman strikes effect does not work on removing an evasive character | references the horseman strikes; not covered by recent triage fixes |
| 2026-04-09 20:50 | `EZfHsalN5k` | olaf snowman of action | Olaf, Snowman of Action is not being discounted by actions in the discard pile. Still costs 9 | references olaf snowman of action; not covered by recent triage fixes |
| 2026-04-09 20:48 | `9ueXLjG2JT` | down in new orleans | The Powerline World's Greatest Rock Star ability won't let me choose the song "Down in New Orleans". | references down in new orleans; not covered by recent triage fixes |
| 2026-04-09 20:28 | `3i_A8xDdtJ` | hercules mighty leader | Hercules Mighty Leader does not take damage when being challenged | references hercules mighty leader; not covered by recent triage fixes |
| 2026-04-09 20:28 | `My5Mf_ImwV` | li shang newly promoted | Li Shang - newly promoted, starts off with 4 attack rather then gaining 4 attack when damaged | references li shang newly promoted; not covered by recent triage fixes |
| 2026-04-09 19:42 | `MeOPQ2drg8` | hercules mighty leader | Hercules - mighty leader. takes no damage when challenged and prevents other cards being damaged when challenged | references hercules mighty leader; not covered by recent triage fixes |
| 2026-04-09 19:42 | `TcMD2bozZD` | hercules mighty leader | Hercules - Mighty Leader when exerted prevents ANY damage dealt to all cards, even damage dealt by Challenge. | references hercules mighty leader; not covered by recent triage fixes |
| 2026-04-09 19:25 | `e5raRWjtSC` | nick wilde persistent investigator | During this game, Nick Wilde - Persistent Investigator wasn't triggering the draw when I challenged and banished Cursed Merfolk. The merfolk trigger forced m... | references nick wilde persistent investigator; not covered by recent triage fixes |
| 2026-04-09 19:13 | `-PRqWO6TvD` | hercules | hercules effect is working wrong | references hercules; not covered by recent triage fixes |
| 2026-04-09 18:54 | `sOtaJwjlj0` | how far ill go, maui | sung how far ill go with 5c maui and it dindnt show any cards to pick for the effect | references how far ill go, maui; not covered by recent triage fixes |
| 2026-04-09 18:49 | `DexGd_te5U` | hercules | After being challenged hercules doesn't get banished | references hercules; not covered by recent triage fixes |
| 2026-04-09 18:33 | `tpsXi45Q-O` | you came back | I have a card 'you came back'  which allows me to ready a character - it readied the character but then would not allow me to quest | references you came back; not covered by recent triage fixes |
| 2026-04-09 18:27 | `F5uN-KQIrx` | flynn | Could not use boost on flynn Ryder | references flynn; not covered by recent triage fixes |
| 2026-04-09 18:11 | `MiLtnJdZsN` | genie | could not boost genie | references genie; not covered by recent triage fixes |
| 2026-04-09 17:44 | `lur8RRo1ea` | ariel | Boost does not work on 4 drop Ariel - Etheral Voice | references ariel; not covered by recent triage fixes |
| 2026-04-09 17:43 | `SfZn4sYRnI` | stitch carefree surfer | played stitch carefree surfer with 2 characters in play and did not draw 2 | references stitch carefree surfer; not covered by recent triage fixes |
| 2026-04-09 17:36 | `akqzgdip5O` | belle | He killed my Belle and it didn't allow me to put her in my inkwell. | references belle; not covered by recent triage fixes |
| 2026-04-09 16:38 | `VgBMKxYVeD` | winnie the pooh having a think | Winnie the Pooh - Having a think should send a card to inkwell ready to be used, not exerted. | references winnie the pooh having a think; not covered by recent triage fixes |
| 2026-04-09 16:28 | `ucRpUPMHuD` | lonely grave, wreck it ralph ham hands enchanted | wreck it Ralph bugged. opponent boosted Ralph and used lonely grave and my two 4 cost characters did not banish. | references lonely grave, wreck it ralph ham hands enchanted; not covered by recent triage fixes |
| 2026-04-09 16:26 | `c2fL6nbUOr` | lilo | quand je joue 3 action je ne peut pas jouer la lilo gratuitement | references lilo; not covered by recent triage fixes |
| 2026-04-09 16:22 | `pFdssl5qeF` | mulan | Mulan no effect no trigger | references mulan; not covered by recent triage fixes |
| 2026-04-09 16:21 | `DW3k_Q_lWN` | genie | can't boost with genie | references genie; not covered by recent triage fixes |
| 2026-04-09 16:11 | `ZBgKfYeKMa` | belle snowfield strategist | belle snowfield strategist is not counting herself for ink. it does not trigger for herself. | references belle snowfield strategist; not covered by recent triage fixes |
| 2026-04-09 14:39 | `ZGsvenfsTD` | let it go, mickey mouse | Let it Go was used mickey amber champion but still kept chief pow in play with 5 damage on him | references let it go, mickey mouse; not covered by recent triage fixes |
| 2026-04-09 13:13 | `95KIwLWoXJ` | belle | Belle should trigger herself and go to ink when she is banished, she does not. | references belle; not covered by recent triage fixes |
| 2026-04-09 13:08 | `iVqZgpkC5B` | hercules | Hercules ability gliched. it prevents all damage even if hes challanged | references hercules; not covered by recent triage fixes |
| 2026-04-09 12:57 | `mdo6y18ryZ` | belle | When Belle is banished, she doesn't go to the Ink Zone. | references belle; not covered by recent triage fixes |
| 2026-04-09 12:54 | `K1QWWLDqwk` | genie | It will not let me boost genie | references genie; not covered by recent triage fixes |
| 2026-04-09 12:35 | `WzOJx-B8Z3` | genie | wont let me boost genie | references genie; not covered by recent triage fixes |
| 2026-04-09 09:10 | `0jpQTM-6Ua` | into the unknown | into the unknown my ready merfolk | references into the unknown; not covered by recent triage fixes |
| 2026-04-09 08:47 | `Ts3raAVPmE` | down in new orleans, kuzco selfish emperor | Played Kuzco - Selfish Emperor from Down in New Orleans and didn't get the choice to put a location or item into the inkwell | references down in new orleans, kuzco selfish emperor; not covered by recent triage fixes |
| 2026-04-09 07:35 | `IVNhZVL5SQ` | pete | Pete will not boost! | references pete; not covered by recent triage fixes |
| 2026-04-09 07:27 | `Jn2XIa-K9y` | circle of life | When activating circle of life it automatically selects the first character in the discard and won’t let you select a character | references circle of life; not covered by recent triage fixes |
| 2026-04-09 05:29 | `7PXrYCbQfo` | moana, sail the azurite sea | Unable to ink from discard, possibly tied to when I have no cards in hand, with Moana on board and having played sail the azurite sea. | references moana, sail the azurite sea; not covered by recent triage fixes |
| 2026-04-09 05:11 | `ZSK537NuXG` | genie magical researcher, lonely grave | Genie Magical Researcher is not able to use his boost ability while in play. I had to use Lonely Grave in order to put cards under it. | references genie magical researcher, lonely grave; not covered by recent triage fixes |
| 2026-04-09 04:44 | `3G_j8F6uMe` | you came back | Using You Came Back doesnt allow the character to quest. It should. It only gives you the option to challenge. | references you came back; not covered by recent triage fixes |
| 2026-04-09 04:31 | `wg7U1b-haq` | tod knows all the tricks | Tod - Knows All the Tricks : Does not ready when targeted by Item. | references tod knows all the tricks; not covered by recent triage fixes |
| 2026-04-09 04:26 | `SHCbpms0Yq` | lady tremaine sinister socialite, you came back | Lady Tremaine - Sinister Socialite - Does not let you choose the action from the discard.  You Came Back - Ready's character but does not allow to quest again. | references lady tremaine sinister socialite, you came back; not covered by recent triage fixes |
| 2026-04-09 04:13 | `DM_36Pc6s6` | genie | Can't Boost my genie | references genie; not covered by recent triage fixes |
| 2026-04-09 03:17 | `yJ4pvqneFH` | the horseman strikes | The Horseman Strikes is, according to the log, drawing two cards, not one. | references the horseman strikes; not covered by recent triage fixes |
| 2026-04-09 03:09 | `QemQW-JK0A` | mickey mouse | After amber mickey was destroyed, characters weren't taken off even though they had more damage then health | references mickey mouse; not covered by recent triage fixes |
| 2026-04-09 03:08 | `bTazTcrM5B` | worlds greatest criminal mind | When a support character quests they cannot support opposing characters (which is desirable with cards like worlds greatest Criminal Minds) | references worlds greatest criminal mind; not covered by recent triage fixes |
| 2026-04-09 02:53 | `D10PvuwV0y` | tug of war | The options for 'Tug of War' aren't clear on the UX - it just says "opetion 1" and "option 2" - need to refer back to card to understand what you're selecting. | references tug of war; not covered by recent triage fixes |
| 2026-04-09 00:54 | `xv9r9qQVBR` | goliath clan leader | Goliath - Clan Leader from opponent did not trigger at the end of my turn, I did not draw the 2 mandatory cards since my hand was empty. | references goliath clan leader; not covered by recent triage fixes |
| 2026-04-09 00:25 | `PC5kfslvxD` | wreck it ralph raging wrecker | Wreck it Ralph Raging wrecker only banished characters 3 strength or less even though he had a card under him when he was banished (total strength was 4, sho... | references wreck it ralph raging wrecker; not covered by recent triage fixes |
| 2026-04-08 23:52 | `dCQrT1u5i3` | lilo | Charged me the 2 for lilo with a willow in play | references lilo; not covered by recent triage fixes |
| 2026-04-08 23:34 | `FXegyaGIWo` | ariel, be king undisputed | Cannot play 'Be King Undisputed' on an Ariel because she is uninked. Needs fixing. | references ariel, be king undisputed; not covered by recent triage fixes |
| 2026-04-08 23:24 | `Azpx_pzvU8` | hades | the abilty from  resloving  hades doesnt work | references hades; not covered by recent triage fixes |
| 2026-04-08 23:19 | `61pwVZhoQ-` | let it go, ohana means family | Let it go is not resolving. I am able to target a valid opossing character, but get a -cannot resolve- error. The same hapened with Ohana Means Family. I am ... | references let it go, ohana means family; not covered by recent triage fixes |
| 2026-04-08 23:19 | `hRNHjFOIJb` | hercules | 1 cost Hercules doesn't get the benefit of his boost | references hercules; not covered by recent triage fixes |
| 2026-04-08 23:16 | `9HI92sjuhi` | genie | we cannot boost the genie | references genie; not covered by recent triage fixes |
| 2026-04-08 23:10 | `8bm2AufmZa` | hercules | Hercules did not get +3 attack after getting his boost | references hercules; not covered by recent triage fixes |
| 2026-04-08 22:42 | `IvJk3goJOu` | stitch carefree surfer | Goliath not triggering in opponents turn of bot play, stitch-carefree surfer not triggering for draw, and other draw effects not triggering on play | references stitch carefree surfer; not covered by recent triage fixes |
| 2026-04-08 22:30 | `VPx6kQfC9S` | genie | cant boost the genie when you play him? | references genie; not covered by recent triage fixes |
| 2026-04-08 22:26 | `1zQ5q4xrtA` | hades looking for a deal | The dialogue prompt for Hades - Looking For a Deal doesn't indicate which target the active player selected, which makes the dialogue confusing. | references hades looking for a deal; not covered by recent triage fixes |
| 2026-04-08 22:19 | `TffbFv4GdQ` | genie magical researcher | Boost didn't work for Genie - Magical Researcher. Can't click to boost | references genie magical researcher; not covered by recent triage fixes |
| 2026-04-08 22:17 | `5kSVuoGPYP` | be king undisputed | hard casting BE KING UNDISPUTED makes the active play choose... that is not how it works | references be king undisputed; not covered by recent triage fixes |
| 2026-04-08 22:17 | `THTW7KxszS` | cinderella, elsa, prince phillip | Prince Phillip did not give ward to other Cinderella. Elsa was able to exert her. | references cinderella, elsa, prince phillip; not covered by recent triage fixes |
| 2026-04-08 22:15 | `KY6cxbh0w-` | genie | Boost with genie does not work | references genie; not covered by recent triage fixes |
| 2026-04-08 22:09 | `JtBLlTyqaX` | moana | Having issues with inking from Discard with Moana on the board. Currently is wet, with Malicous mean and Scary in discard and no hand. Unable to ink from dis... | references moana; not covered by recent triage fixes |
| 2026-04-08 22:07 | `CUpkmrVAUq` | genie | Have 4 ink. Played genie for 3. Tried to boost -- it wouldn't let me do so. | references genie; not covered by recent triage fixes |
| 2026-04-08 21:46 | `zWs85lcRR6` | genie | Boost does not work on genie | references genie; not covered by recent triage fixes |
| 2026-04-08 21:24 | `5_N7PXZP3K` | donald duck | Opponents cards are not being revealed when I quest with Daisy Duck - Donald's Date | references donald duck; not covered by recent triage fixes |
| 2026-04-08 21:14 | `0I7KNpEYJK` | belle | Belle damage moving is not working | references belle; not covered by recent triage fixes |
| 2026-04-08 21:07 | `newHWbt7tE` | goliath clan leader | Goliath clan leader effect not triggering | references goliath clan leader; not covered by recent triage fixes |
| 2026-04-08 20:26 | `wThXLThXlm` | scrump | There is no way to activate Scrump's ability. | references scrump; not covered by recent triage fixes |
| 2026-04-08 20:24 | `sOvmo2mjyY` | pull the lever, royal guard octopus soldier | ROYAL GUARD OCTOPUS DOESNT GET +1 CHALLENGE WHEN I DRAW THE FIRST CARD OF THE TURN BUT ONLY WITH DRAW ACTIONS LIKE PULL THE LEVER | references pull the lever, royal guard octopus soldier; not covered by recent triage fixes |
| 2026-04-08 19:58 | `Ajg0bh0wPA` | tiana | NEVER LET ME USE MY INK TO PAY FOR OPPONENTS TIANA EFFECT , NOT ONCE AND LOST DUE TO THAT BUG, WOULDVE WON AGES AGO IF IT NOT FOR THAT | references tiana; not covered by recent triage fixes |
| 2026-04-08 19:56 | `4_IvgT4c_k` | tiana | DOESNT LET ME PAY INK FOR TIANA EFFECT WHEN I ATTACK | references tiana; not covered by recent triage fixes |
| 2026-04-08 19:09 | `sqaffc-BnN` | belle | Can't play Belle for free banishing an item | references belle; not covered by recent triage fixes |
| 2026-04-08 18:53 | `az14sUV4iT` | how far i'll go | How Far I'll Go Doesnt reveal cards | references how far i'll go; not covered by recent triage fixes |
| 2026-04-08 18:53 | `v4JRirgmxr` | tiana natural talent, under the sea | Tiana -Natural Talent effect is not allowed to be first in the bag to lower attack before under the sea gets played | references tiana natural talent, under the sea; not covered by recent triage fixes |
| 2026-04-08 18:38 | `jrRasFFAh8` | goofy | goofy is broken and making it so every character only has 1 strength despite all the strength buff modifiers put on him | references goofy; not covered by recent triage fixes |
| 2026-04-08 18:32 | `_c8Dmjsymc` | ursula | Opponent inked for 2, played Ursula - Deciever and 2 1-cost Lady on the same turn | references ursula; not covered by recent triage fixes |
| 2026-04-08 18:21 | `JVe3umd3PV` | olaf snowman of action | Olaf Snowman of Action  Ability doesn't work, doesn't reduce his total cost with actions in the discard | references olaf snowman of action; not covered by recent triage fixes |
| 2026-04-08 17:55 | `FPqD8sXb8r` | maui | Maui ability triggered when challenging a location and banishing it gave him a action back, this shouldn't happen and should only trigger when banishing a ch... | references maui; not covered by recent triage fixes |
| 2026-04-08 16:54 | `WqdB3iI1h_` | be king undisputed | It's trying to get me to pick a target for Be King Undisputed when my opponent has to pick | references be king undisputed; not covered by recent triage fixes |
| 2026-04-08 16:45 | `YVb2-T9Ri4` | genie, winterspell | Can't Boost 3 drop Genie from winterspell | references genie, winterspell; not covered by recent triage fixes |
| 2026-04-08 16:36 | `0tUQIkq7Us` | akood et emuti | Opponent sang Akood Et Emuti, and the discounted ink cost applied to every charachter played, not just one. | references akood et emuti; not covered by recent triage fixes |
| 2026-04-08 15:45 | `WPKXApdPZG` | donald duck perfect gentleman | Donald Duck Perfect Gentleman allowed for my opponent to also draw at the start of my turn, but it should not. | references donald duck perfect gentleman; not covered by recent triage fixes |
| 2026-04-08 15:44 | `Z4YFSNoZl9` | let it go | I was able to play more ink that what I had. I was able to play a 7 cost surfer sitch, and a 5 cost let it go witih 10 ink. | references let it go; not covered by recent triage fixes |
| 2026-04-08 15:43 | `lDNG0ZIcPY` | goliath clan leader | Goliath Clan Leader is forcing me to discard at the end of my opponent's turn - it should not. | references goliath clan leader; not covered by recent triage fixes |
| 2026-04-08 15:38 | `TbDByZ6UBg` | he hurled his thunderbolt | I played "He hurled his thunderbolt" on turn 5 without singing or paying Ink | references he hurled his thunderbolt; not covered by recent triage fixes |
| 2026-04-08 15:16 | `AZezwaKxNW` | eilonwy | Eilonwy is showing fresh ink on 2nd turn when she was played on turn 1 | references eilonwy; not covered by recent triage fixes |
| 2026-04-08 14:55 | `IYuPwuREkL` | pete | it doesnt let me make the pete action with the boost | references pete; not covered by recent triage fixes |
| 2026-04-08 14:51 | `YWuZfsP05Y` | the black cauldron | Can't play card from under The Black Cauldron | references the black cauldron; not covered by recent triage fixes |
| 2026-04-08 14:39 | `k68GXTFK-E` | pete ghost of christmas future | Could not resolve effect for Pete - Ghost of Christmas Future. It says arrange cards but won't let me click on it. | references pete ghost of christmas future; not covered by recent triage fixes |
| 2026-04-08 14:36 | `KFXTBDlKGw` | pete | Pete's ability not working with boost | references pete; not covered by recent triage fixes |
| 2026-04-08 14:36 | `pR_5L9L8HT` | pete ghost of christmas future | I had 5 ink available and played Pete, ghost of christmas future, and it still said I had 5 ink available to play another card. This also happened when I pla... | references pete ghost of christmas future; not covered by recent triage fixes |
| 2026-04-08 14:35 | `FPCTKjHyPd` | pete ghost of christmas future | Will not allow Pete - Ghost of Christmas Future ability Foreboding Glance to resolve | references pete ghost of christmas future; not covered by recent triage fixes |
| 2026-04-08 14:31 | `cxB4IgsOTK` | moana | Cannot Ink with Moana ink from discard card, lost me the game | references moana; not covered by recent triage fixes |
| 2026-04-08 14:22 | `jMOPL2j1nX` | bambi ethereal fawn | Cannot resolve Bambi - Ethereal Fawn's pending effect after questing with 2 cards underneath. | references bambi ethereal fawn; not covered by recent triage fixes |
| 2026-04-08 14:19 | `98r2fTdbyr` | goliath clan leader | goliath clan leader if active player has 3 cards in hand it will untap | references goliath clan leader; not covered by recent triage fixes |
| 2026-04-08 14:17 | `4FvQv3Vyyt` | genie | i dont think 3 drop boost 1 genie is letting me boost on the turn i play it | references genie; not covered by recent triage fixes |
| 2026-04-08 14:11 | `r8F_L9Yxdg` | hercules | Opponent doesnt deal damage to my hercules even tho he should be able to. since his ability only sais he cant be damaged unless hes being challanged. which h... | references hercules; not covered by recent triage fixes |
| 2026-04-08 14:11 | `hVdJqL6u2z` | lonely grave, wreck it ralph ham hands enchanted | Wreck-It Ralph not banishing characters when banished with Lonely Grave | references lonely grave, wreck it ralph ham hands enchanted; not covered by recent triage fixes |
| 2026-04-08 14:10 | `eF7ky9BwA8` | scrooges counting house ebenezers office | scrooges counting house only giving one lore each turn no matter how many cards under | references scrooges counting house ebenezers office; not covered by recent triage fixes |
| 2026-04-08 14:06 | `jtEJBXN6VT` | ariel | ariel couldnt boost | references ariel; not covered by recent triage fixes |
| 2026-04-08 14:02 | `dfX1hMeWYz` | judy hopps lead detective | Judy Hopps - Lead Detective is failing to give other detectives challenger +2. Her ability does work with giving them Alert. | references judy hopps lead detective; not covered by recent triage fixes |
| 2026-04-08 13:53 | `noufyNmoFe` | develop your brain | Develop Your Brain is getting played for free and ink is not being used. | references develop your brain; not covered by recent triage fixes |
| 2026-04-08 13:51 | `1x1ulD37wl` | belle | can't play belle with her alternativge cost | references belle; not covered by recent triage fixes |
| 2026-04-08 13:49 | `mKJoZ_ABIr` | pete | Cannot resolve Pete's effect | references pete; not covered by recent triage fixes |
| 2026-04-08 13:45 | `tupPFyZ1cS` | we know the way | had a we know the way in the discard and one on the stack the we know the way on the stack woudnt show the we know the way in the discard | references we know the way; not covered by recent triage fixes |
| 2026-04-08 13:33 | `s0mOdBYWjM` | king candy royal racer | King Candy: Royal Racer is not working as it should - players should be forced to banish a character of their choice. | references king candy royal racer; not covered by recent triage fixes |
| 2026-04-08 13:32 | `ApGnLaYhaQ` | pete | Pete effect is not trigger correctly | references pete; not covered by recent triage fixes |
| 2026-04-08 13:22 | `pOFOlrSo2v` | the black cauldron | Couldn't use black cauldron cards | references the black cauldron; not covered by recent triage fixes |
| 2026-04-08 13:12 | `nU72XjnHhK` | ariel | Not showing the song they found when they play ariel, also I had qued for core contructed BO! not infinity and this was infinity. | references ariel; not covered by recent triage fixes |
| 2026-04-08 13:11 | `UwQI5j4U5e` | let it go | Looks like I played a let it go for free | references let it go; not covered by recent triage fixes |
| 2026-04-08 12:58 | `7JhfTj7a4y` | pawpsicle | Turn 1 in this Match logs stated that opponent played Pawpsicle, Banished it to draw 2 Cards, then proceeded to play a 1 Cost 2/2 1 Lore Robin Hood | references pawpsicle; not covered by recent triage fixes |
| 2026-04-08 12:57 | `s5iHtSth0t` | lantern | ITEM EFFECT LASTS FOR MY ENTIRE TURN. LANTERN | references lantern; not covered by recent triage fixes |
| 2026-04-08 12:41 | `NXfbNqUi9U` | genie | Couldn't boost my genie with my remaining ink | references genie; not covered by recent triage fixes |
| 2026-04-08 12:38 | `EzgFApCGev` | hercules | He challenged my Hercules with a Sven, the sven was banished but herc should have been banished too since he was dealt damage in a challenge, herc didnt chal... | references hercules; not covered by recent triage fixes |
| 2026-04-08 12:34 | `B0pEHaRu1M` | hercules | Sven challenged hercules dealing 5 damage, but hercules didnt die? | references hercules; not covered by recent triage fixes |
| 2026-04-08 12:22 | `O22urzd6rn` | just in time | Just In time wont let me play a bodyguard. | references just in time; not covered by recent triage fixes |
| 2026-04-05 08:29 | `jHzfPivY7P` | grab your bow | V small thing - AI keeps playing "Grab Your Bow" when there are no relevant targets on the field. | references grab your bow; not covered by recent triage fixes |
| 2026-04-05 05:27 | `tnVTgjMohx` | beast | Ignore that last bug report, re Beast not being able to challenge - I'm an idiot. | references beast; not covered by recent triage fixes |
| 2026-04-05 05:27 | `B6A8UQ098q` | beast, beast snowfield troublemaker | Have just played Beast - Snowfield Troublemaker, and system isn't allowing me to challenge, despite Beast having Rush. | references beast, beast snowfield troublemaker; not covered by recent triage fixes |
| 2026-04-04 06:26 | `U7ghDho3bn` | circle of life | Circle of life is supposed to be a single song.It won't let me sing it | references circle of life; not covered by recent triage fixes |
| 2026-04-04 05:31 | `_9LmjYr1Ov` | belle | cant banish an item to play belle acomplished mystic | references belle; not covered by recent triage fixes |
| 2026-04-03 09:43 | `Ky_fSs1Ziz` | hades | AI plays Hades what da ya say, I can't resolve the effect | references hades; not covered by recent triage fixes |
| 2026-04-03 00:37 | `If9Qukp2tl` | let the storm rage on, mr smee bumbling mate, piglet pooh pirate captain | Game Log just displayed "Piglet - Pooh Pirate Captain" in text, when it was referring to "Mr Smee Bumbling Mate". Also it just played "Let The Storm Rage On"... | references let the storm rage on, mr smee bumbling mate, piglet pooh pirate captain; not covered by recent triage fixes |
| 2026-04-02 19:16 | `997ogYYh4_` | pete | Quested with everyone at once, and Pete trigger cannot resolve | references pete; not covered by recent triage fixes |
| 2026-04-02 18:33 | `ix2vzOS9ck` | pete | Cant resolve effects on boosted characters. Pete is the main on having issues | references pete; not covered by recent triage fixes |
| 2026-04-02 17:42 | `haGCH2utJc` | pete ghost of christmas future | Using Pete Ghost of Christmas Future always gives an error and doesn't let you look at cards and select them.  Then times out the game.  I can't use or play ... | references pete ghost of christmas future; not covered by recent triage fixes |
| 2026-04-02 14:36 | `G6W4YSIwg0` | bambi ethereal fawn | Challenging with Bambi - Ethereal Fawn triggers his effect but does not allow me to select cards to put in my hand. The game gets stuck. | references bambi ethereal fawn; not covered by recent triage fixes |
| 2026-04-02 06:13 | `vuMdKuq77O` | anna little sister | Couldn't resolve effect of anna little sister to put an opponent's card from their discard to the bottom of their deck | references anna little sister; not covered by recent triage fixes |
| 2026-04-02 03:53 | `0H-hpauZ5J` | elsa ice artisan, hades looking for a deal | Hades Looking for a Deal (AI) attempted to target Elsa Ice Artisan (me). A dialogue asking me to resolve, however unable to as it's looking for something in ... | references elsa ice artisan, hades looking for a deal; not covered by recent triage fixes |
| 2026-04-01 22:44 | `ZNrSOJe2zB` | genie | Genie cannot boost. | references genie; not covered by recent triage fixes |
| 2026-04-01 19:27 | `YN93izJkEq` | genie | Not able to boost a genie character | references genie; not covered by recent triage fixes |
| 2026-04-01 17:53 | `fF-KMg6zqm` | be king undisputed | Be KIng Undisputed doesnt work properly. forces player selection that isnt possible per the cards effect | references be king undisputed; not covered by recent triage fixes |
| 2026-04-01 16:18 | `xn1RSLzeE1` | grandmother willow ancient advisor, hades looking for a deal | Resolving Hades - Looking for a Deal: WHAT D'YA SAY? targeting Grandmother Willow - Ancient Advisor. | references grandmother willow ancient advisor, hades looking for a deal; not covered by recent triage fixes |
| 2026-04-01 15:54 | `oSiH91BY0s` | how far ill go | cant play How Far Ill go | references how far ill go; not covered by recent triage fixes |
| 2026-04-01 11:21 | `1A7EdT6kMM` | keep the ancient ways | couldn't sing keep the ancient ways | references keep the ancient ways; not covered by recent triage fixes |
| 2026-04-01 09:09 | `oElPOzn0H1` | akood et emuti, ariel | I'm playing steel song, I play the ariel and draw akood et emuti but couldn't drag it to my hand | references akood et emuti, ariel; not covered by recent triage fixes |
| 2026-04-01 07:33 | `wU-HEVW1aU` | hades looking for a deal | "Hades - Looking for a deal" effect won't resolve. | references hades looking for a deal; not covered by recent triage fixes |
| 2026-03-31 21:55 | `Tr4S4_tfOk` | hades looking for a deal | Every time that Hades -  Looking for a deal there's no way to resolve the effect | references hades looking for a deal; not covered by recent triage fixes |
| 2026-03-31 14:39 | `WsMYaFdfeg` | genie magical researcher, lilo escape artist | I wasn't allowed to Boost Genie - Magical Researcher upon play even though I had 1 ink left to use. Royal Guard also acted like a 2/2 when challenged by a Li... | references genie magical researcher, lilo escape artist; not covered by recent triage fixes |
| 2026-03-31 13:25 | `q7SUUVzR-3` | genie | Royal Guard did not gain extra attack for draw with genie | references genie; not covered by recent triage fixes |
| 2026-03-31 12:40 | `wEZyiONMjy` | hades looking for a deal | Hades - Looking for a Deal effect stalls. AI does not make a selection. Effect doesn't process and the game is halted.  Royal Guard's Challenger effect doesn... | references hades looking for a deal; not covered by recent triage fixes |
| 2026-03-31 11:29 | `d44jjscYxs` | hades looking for a deal | AI played Hades looking for a deal no character on my board, can't seem to skip the effect | references hades looking for a deal; not covered by recent triage fixes |
| 2026-03-31 11:17 | `iMojSp10xP` | tamatoa happy as a clam | can't skip resolving tamatoa happy as a clam cooles collection there arent any items in the discard | references tamatoa happy as a clam; not covered by recent triage fixes |
| 2026-03-31 04:47 | `6D5rwgPywK` | elsa | I just played Elsa and I seem to be unable to move her to a location while she's drying - hovering the mouse over the card doesn't bring up the dialogue box ... | references elsa; not covered by recent triage fixes |
| 2026-03-31 04:30 | `qyDKbr5FGy` | hades looking for a deal | AI Played 'Hades Looking for a Deal' targeting 'Scrooge McDuck SHUCH Agent'. When player selects 'resolve effect' error message "resolveEffect requires choic... | references hades looking for a deal; not covered by recent triage fixes |
| 2026-03-31 01:07 | `A5lh80BU8h` | belle | can use belle to banish an item to play her for free | references belle; not covered by recent triage fixes |
| 2026-03-30 23:24 | `lFZPzArs9N` | belle, pawpsicle | cant play Belle after playing a pawpsicle | references belle, pawpsicle; not covered by recent triage fixes |
| 2026-03-30 22:38 | `uRX_FtOeQE` | belle apprentice inventor | Belle - Apprentice Inventor's "What a Mess" Ability is not able to be used in AI game | references belle apprentice inventor; not covered by recent triage fixes |
| 2026-03-30 22:08 | `7e5LMZ6OMl` | moana | could not use Ancestral legacy from Moana and Ink from Discard? | references moana; not covered by recent triage fixes |
| 2026-03-30 19:23 | `S6E8gFnRMh` | hades looking for a deal | unable to resolve or proceed after  Hades - Looking for a Deal: WHAT D'YA SAY? on play effect activated | references hades looking for a deal; not covered by recent triage fixes |
| 2026-03-30 19:16 | `u7VprYpRx-` | hercules spectral demigod | Hercules - Spectral Demigod Boost ability isnt triggered, despite having a card under him | references hercules spectral demigod; not covered by recent triage fixes |
| 2026-03-30 18:48 | `2O5OezOQpe` | mickey mouse giant mouse | Mickey Mouse - Giant Mouse Body guard ability not triggered on play | references mickey mouse giant mouse; not covered by recent triage fixes |
| 2026-03-30 18:47 | `KvWdJh2nPg` | mickey mouse trumpeter | Mickey Mouse - Trumpeter not allowing me to select the target of its effect | references mickey mouse trumpeter; not covered by recent triage fixes |
| 2026-03-30 18:09 | `RlF-e66ECW` | genie magical researcher | can't boost genie magical researcher | references genie magical researcher; not covered by recent triage fixes |
| 2026-03-30 17:50 | `P2rRY9bNJx` | hades | Hades tried to target a warded character and the action can't be resolved | references hades; not covered by recent triage fixes |
| 2026-03-30 16:55 | `iXAt6HM6cT` | genie, into the unknown | AI used Into the Unknown on readied Genie. | references genie, into the unknown; not covered by recent triage fixes |

### ui-investigation-needed (35) — Open: UI / client surface investigation needed

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 21:12 | `WCA7-p-SRv` |  | Game disconnected me.  Have internet and everything | UI keywords ['disconnect', 'disconnected'] |
| 2026-05-14 02:07 | `pBjVShP3Ei` |  | Can't drop opponent who disconnected. | UI keywords ['disconnect', 'disconnected'] |
| 2026-05-13 19:18 | `xph1XkcZxH` |  | When client times out when on the main menu it takes you back to the last game you played but gets stuck. | UI keywords ['stuck'] |
| 2026-05-12 22:34 | `9v2JkWtez8` |  | The AI opponent got stuck trying to resolve the effect of a card | UI keywords ['stuck'] |
| 2026-05-12 14:47 | `4kVrqlfBYr` |  | when cards are played, they show up on the screen too small to click on for challenges or actions | UI keywords ['click'] |
| 2026-05-12 14:06 | `FqkHWbTmNQ` |  | Ranked game. Opponent disconnected after game 1 and it won't let me drop them. It states that Drop is not valid in the current game state. There is no indica... | UI keywords ['disconnect', 'disconnected'] |
| 2026-05-12 10:56 | `rN6yJSXf_Q` |  | The app says my opponent disconnected and suggest if  I want to claim victory. But he is still playing and online. The overlay however makes it harder to play. | UI keywords ['disconnect', 'disconnected'] |
| 2026-05-11 15:24 | `eL9gi5zF4o` |  | disconnected after singing you've got a friend then attempting to sing akood et | UI keywords ['disconnect', 'disconnected'] |
| 2026-05-04 22:04 | `j4Qlks0LZz` |  | My opponent made a mistake and instead of undoing the action, they just disconnected, now the app wont let me drop the player. | UI keywords ['disconnect', 'disconnected', 'undo'] |
| 2026-05-04 18:56 | `7it6F33kpb` |  | I have altered hand and I get stuck in the " my turn" phase unable to ink or have opp. alter hand. | UI keywords ['stuck'] |
| 2026-05-02 19:51 | `cUWkxxEuRf` |  | Cannot click some cards because the status stay in front of them | UI keywords ['click'] |
| 2026-04-30 18:15 | `VcqisEEhpH` |  | match gets stuck after questing with big Woody and after the Let’s Get Movin’ ability triggers. I draw a card and the system automatically plays a 2 cost cha... | UI keywords ['stuck'] |
| 2026-04-29 10:02 | `ote85r8c7S` |  | I used a boost effect with Webby's diary in play but had no ink to pay for it. i couldn't pass turn or skip the effect | UI keywords ['skip'] |
| 2026-04-28 22:41 | `FU39KKi2zj` |  | doesn't let me click on anything to resolve webby's diary | UI keywords ['click'] |
| 2026-04-28 18:08 | `-9_mSPwnII` |  | Got stuck on Clarabelle's (1 drop) effect. It said I had an action pending but it never let me deny or allow her ability. | UI keywords ['stuck'] |
| 2026-04-28 01:06 | `JYShXbpHep` |  | Cards show up small, can't click on them to activate challenge | UI keywords ['click'] |
| 2026-04-27 03:49 | `1OAKXJQAAl` |  | doesnt work.. it kicked us both out of the next match, for game 2 | UI keywords ['kicked'] |
| 2026-04-27 01:05 | `Tc7_nNme_O` |  | Anytime Ai plays a booster card it doesn't play the ability and times out. Then you're stuck in the game and can't exit. | UI keywords ['stuck'] |
| 2026-04-25 06:56 | `3c36uevQNU` |  | Cant confirm/deny Bambi effect after questing with 0 cards under Bambi. Stuck at screen and cant pass turn. | UI keywords ['stuck'] |
| 2026-04-25 04:41 | `WgiEtkoeO0` |  | Leviathon appearing to have issues.  my opponent is stuck on it. | UI keywords ['stuck'] |
| 2026-04-24 23:54 | `0kR94Bq_AY` |  | Clarabelle 7 stuck again after I pass | UI keywords ['stuck'] |
| 2026-04-24 23:34 | `8YX0q0g_u4` |  | Clarabelle 7 ability not allowing me to pass turn when I do not draw cards... just stuck | UI keywords ['stuck'] |
| 2026-04-23 20:49 | `KX8KKQiznH` |  | I have Pluto in play. I just played a Steel character, so the game is asking me to select an item to banish, but the game wont let me select this item for so... | UI keywords ['click'] |
| 2026-04-19 21:47 | `6kQkAc0NOh` |  | did the opponent really drop? I'm trying to complete and move on but says conditions not met to drop, even if in game it shows player disconnected | UI keywords ['disconnect', 'disconnected'] |
| 2026-04-16 18:45 | `jrKmrLFpib` |  | When loading into the next match for BO3 it will not take you to next one without refreshing screen. | UI keywords ['loading'] |
| 2026-04-16 06:56 | `HAxo8P18rp` |  | I cannot quest individual characters by tapping on them | UI keywords ['tap'] |
| 2026-04-14 21:03 | `e9iucsYrqh` |  | Opponent dropped but client says they have reconnected and dropping them isnt a legal action | UI keywords ['reconnect'] |
| 2026-04-12 11:35 | `l8tjaxP8dU` |  | It keeps me disconnected from the playboard, i can do everything except use the boarded cards, challenge for example | UI keywords ['disconnect', 'disconnected'] |
| 2026-04-12 03:53 | `TSXR3nd2IO` |  | Wouldn't let me pass turn after questing with emerald John Silver. Opponent had an empty board so I couldn't resolve or skip his effect | UI keywords ['skip'] |
| 2026-04-08 17:43 | `fI7CZ24AVa` |  | When the opponent drops the game I get stuck in a loop where the game doesn't end and I can't leave to the main menu without waiting forever or conceding. Th... | UI keywords ['stuck'] |
| 2026-04-08 17:30 | `oAKe9wL72P` |  | The "pass turn" button disappeared even with several refreshes. I was not able to do anything but concede. | UI keywords ['button'] |
| 2026-04-08 16:28 | `WmJqRStfFB` |  | My opponent drop without conceding gamen, I push drop button but nothing happen. I can't go out from match, only closing the window. | UI keywords ['button'] |
| 2026-04-08 13:35 | `HW3-vsDn5P` |  | Opponent's character has an ability: I have to banish one of my characters. I had multiple characters available, but I was only offered a yes/no choice. The ... | UI keywords ['click'] |
| 2026-04-05 03:49 | `qm0y_qPm8c` |  | it says i have lost authentication but is letting me play. I just cant click on my played cards to challenge or use abilities | UI keywords ['click'] |
| 2026-04-02 18:09 | `kHYZuBySdc` |  | How the heck do you even do anything thing? This new UI is so confusing I cant even make a move or finish my turn. Im having to quit games cause I cant make ... | UI keywords ['click', 'stuck'] |

### needs-card-identification (534) — Open: description references no known card by name

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-14 20:46 | `-bpJ9lhlDp` |  | Opponent was able to kill some of my characters and there was no indication to me how. Reading the playback was no help. | no card or UI keyword detected |
| 2026-05-13 21:00 | `lUZi7DfHvy` |  | Die familie zerstört. es wird nur eine karte weg gelegt.... | no card or UI keyword detected |
| 2026-05-13 08:23 | `7WjMaGXelc` |  | I believe my item was not working properly. I was drawing cards instead of putting them on my inkwell facedown and exerted. | no card or UI keyword detected |
| 2026-05-13 02:02 | `dZFjUt-L41` |  | the drop opponent wouldn't work | no card or UI keyword detected |
| 2026-05-13 00:48 | `lxzM7XRTrd` |  | I had a character with bodyguard and they challenged a different character first | no card or UI keyword detected |
| 2026-05-13 00:22 | `Id8-e2nBJa` |  | The strength on my characters is not correct | no card or UI keyword detected |
| 2026-05-12 20:18 | `Wk6FllHHLl` |  | It is not dropping the other person when I request the game to end after their time has run out. | no card or UI keyword detected |
| 2026-05-12 20:09 | `gU29jn-xZn` |  | error out | no card or UI keyword detected |
| 2026-05-12 00:41 | `lNJWd3so6v` |  | opposing character didnt quest when it was required through the song | no card or UI keyword detected |
| 2026-05-12 00:11 | `4ihGLY9hAC` |  | I can not see the cards to challenge and boost. I can not see the cards played | no card or UI keyword detected |
| 2026-05-11 23:15 | `updFGzY9v_` |  | Legendary Lusia effect didnt trigger properly but still took the ink for the pay effect | no card or UI keyword detected |
| 2026-05-11 22:45 | `hEIS0IYWgB` |  | the tianas affect didnt stack | no card or UI keyword detected |
| 2026-05-11 22:02 | `cs7qn2syGe` |  | The Wyvern Castle card is glitching when more than one character is placed in the area; it prevents you from selecting cards within that area. Another bug is... | no card or UI keyword detected |
| 2026-05-11 21:54 | `g9ohorZBHs` |  | The Wyvern Castle card is glitching when more than one character is placed in the area; it prevents you from selecting cards within that area. Another bug is... | no card or UI keyword detected |
| 2026-05-11 21:54 | `y5nMoZ9dOp` |  | The Wyvern Castle card is glitching when more than one character is placed in the area; it prevents you from selecting cards within that area. Another bug is... | no card or UI keyword detected |
| 2026-05-11 21:50 | `IfDsbdsXvS` |  | I banished someone in a challenge while being in the location "Island of Nomanisan" and i couldn't deal 2 extra damage to another character | no card or UI keyword detected |
| 2026-05-11 20:01 | `zrhByvHuai` |  | Hjo | no card or UI keyword detected |
| 2026-05-11 19:41 | `9V-jHn33Bk` |  | Anna trusted sisther we can do this together ability not resolving | no card or UI keyword detected |
| 2026-05-11 17:39 | `yi4VHkdRtp` |  | Non vedo i punti lore | no card or UI keyword detected |
| 2026-05-11 13:57 | `MTPx9-dQSv` |  | Tamatoa did not bring my item from discard! \ | no card or UI keyword detected |
| 2026-05-11 11:55 | `-WbMJZU5zO` |  | melicious means with marida damaged both chracters with her ability | no card or UI keyword detected |
| 2026-05-11 09:36 | `KVHBJ9valQ` |  | alma madrigal doesnt trigger | no card or UI keyword detected |
| 2026-05-11 08:54 | `Za2FCUNoLK` |  | chica not drawing | no card or UI keyword detected |
| 2026-05-11 02:24 | `nQQ7jpQvCM` |  | Montory Jack cant quest by himself if he has more than 4 hp | no card or UI keyword detected |
| 2026-05-11 00:02 | `QYPlBUSXIC` |  | card 78 set 12 - Clever Swordsman does not activate the trigger to come in exerted to deal damage to damaged charcter :( | no card or UI keyword detected |
| 2026-05-10 23:48 | `AffX46UWdG` |  | Hamish, Hurbert, and Harris Making Mischief I can't trigger the may enter into play exerted abilty | no card or UI keyword detected |
| 2026-05-10 19:29 | `EtgO1VXRAx` |  | I can't select the cards to put in my inkt | no card or UI keyword detected |
| 2026-05-10 18:19 | `xvtGxGbUtg` |  | ma chity | no card or UI keyword detected |
| 2026-05-10 14:57 | `lASbzgkeJI` |  | Discard was shaking most of the screen when I hovered over it. | no card or UI keyword detected |
| 2026-05-10 12:42 | `B81_iRfCF4` |  | When I try to move a character to a location, I can't scroll without deselecting them so it won't let me move any characters. | no card or UI keyword detected |
| 2026-05-10 11:41 | `t5fm0eVi8-` |  | location lore doesn't ping at start of turn | no card or UI keyword detected |
| 2026-05-10 04:29 | `Yp_VK0E5OA` |  | I do not like to new lorcanito. It is not user friendly | no card or UI keyword detected |
| 2026-05-10 04:21 | `WQt0n5Qv7P` |  | Would not let me look at discard. Would not let me ask to take back move. | no card or UI keyword detected |
| 2026-05-09 16:53 | `CpoMQYhIV_` |  | Couldn't play the top card with kristof's luth | no card or UI keyword detected |
| 2026-05-09 11:54 | `G0C-OGUVnn` |  | 4 ink open and 2 grandmothers. game wont let me cast lady for 5 (3 with reductions) | no card or UI keyword detected |
| 2026-05-09 11:11 | `b6G3YorZq4` |  | help!!!!! lore (0) | no card or UI keyword detected |
| 2026-05-09 04:27 | `XLu-q0Xy1O` |  | Não consigo clicar em um personagem com muito efeitos para fazer missoes ou ativar suas  Habilidades | no card or UI keyword detected |
| 2026-05-08 15:57 | `rPf19Bo420` |  | he played a 4 cost card with only 1 ink | no card or UI keyword detected |
| 2026-05-08 01:32 | `cDfImgIRAI` |  | Cannot pass turn | no card or UI keyword detected |
| 2026-05-08 01:18 | `uvSwzLcp2v` |  | Was unable to continue game because I was unable to banish a character as a result of sid effect | no card or UI keyword detected |
| 2026-05-07 17:01 | `s6C9LvUgLz` |  | can’t use my discardpile on iphone | no card or UI keyword detected |
| 2026-05-07 16:46 | `Krc1blU4pJ` |  | can’t switch to next game on mobile | no card or UI keyword detected |
| 2026-05-07 16:38 | `xaO31LHtJL` |  | ant resolve side effect | no card or UI keyword detected |
| 2026-05-07 12:28 | `dkxJI0n4RG` |  | Whenever I play Sid and activate his ability, the opposing player seems to not be able to select a target and choose a character to banish | no card or UI keyword detected |
| 2026-05-07 11:39 | `p5g7lWw0CP` |  | dingy again | no card or UI keyword detected |
| 2026-05-07 11:33 | `3u1aT9rOEj` |  | The dingy effect blocked me (could not confirm) | no card or UI keyword detected |
| 2026-05-07 11:31 | `0atvMpxYz1` |  | can't confirm | no card or UI keyword detected |
| 2026-05-07 10:22 | `Prt0OE2Q8n` |  | Games just keep ending after 1 or 2 turns. | no card or UI keyword detected |
| 2026-05-07 09:48 | `noeK9vz_K3` |  | PLAYING KING UNDISPUTED SEEMS TO BE UNRESOLVABLE AND LEADS TO EITHER TIME OUTS OR THE PLAYER UNABLE TO CHOOSE A TARGET FOR THE EFFECT, WHICH ENDS THE GAME. H... | no card or UI keyword detected |
| 2026-05-07 04:53 | `gHQg44ttrJ` |  | Quando o personagem tem 3 bolinhas enbaixo da carta eu não consigo encostar na hit box dele, não consigo seleciona-lo | no card or UI keyword detected |
| 2026-05-07 03:08 | `wAK0TLvM13` |  | can't select my character for sid's edict effect | no card or UI keyword detected |
| 2026-05-07 01:51 | `cuJcR4ruW5` |  | SID ability does not allow you to discard a card and resolve trigger. it has happened twice now. hope this helps | no card or UI keyword detected |
| 2026-05-06 23:43 | `mJz3c9xjw3` |  | Shows my Life as 3 when I won. | no card or UI keyword detected |
| 2026-05-06 23:03 | `qvrbwVr-Eh` |  | cards are incorrectly mapped going to the Ink as displayed in Log. I put a Tipo it says in Log is visions of the future | no card or UI keyword detected |
| 2026-05-06 21:20 | `8Gyxe8JMXG` |  | Sid istn working | no card or UI keyword detected |
| 2026-05-06 20:17 | `m2o8BkLUiY` |  | cant confirm banish off sid | no card or UI keyword detected |
| 2026-05-06 19:04 | `KxW7BurcuZ` |  | Not letting me confirm | no card or UI keyword detected |
| 2026-05-06 18:57 | `I5eSp-gY0t` |  | After playing Sid i cannot select a character to banish and cannot progress the game | no card or UI keyword detected |
| 2026-05-06 18:44 | `zrxP2fz1lQ` |  | i chose effect but cant confirm | no card or UI keyword detected |
| 2026-05-06 18:33 | `NtYyKbBiP-` |  | Could not properly fulfill the Character banishment requirement when opponent played Sid Phillips. | no card or UI keyword detected |
| 2026-05-06 18:23 | `zNRX52rj_F` |  | I could not select a card to banish after I banished leviathans lair. | no card or UI keyword detected |
| 2026-05-06 18:15 | `fWH9_l0ZWw` |  | Can't choose a character to banish | no card or UI keyword detected |
| 2026-05-06 17:59 | `Zb9F86Y4W_` |  | lol cant take a target from the new sid phillips. my opponent play him i cant cant confirm a target... i lost in time then... | no card or UI keyword detected |
| 2026-05-06 17:18 | `-SRr4_1tmQ` |  | syd philips - to surgeon is not working, I couldnt choose a character to banish | no card or UI keyword detected |
| 2026-05-06 16:20 | `_-3bvogAAJ` |  | I tried to select a character to banish and it wouldn't let me choose and confirm | no card or UI keyword detected |
| 2026-05-06 14:12 | `qopmuV0aEy` |  | lore (0) please help!!!!!! | no card or UI keyword detected |
| 2026-05-06 14:07 | `5M9EhwaPea` |  | I played two sapphire coils and only one showed up. So I could not play my Scrooge for free. I will lose now. I am very unhappy. | no card or UI keyword detected |
| 2026-05-06 12:51 | `rju9QP7Mh_` |  | Dinky ability after select the target it doenst advance | no card or UI keyword detected |
| 2026-05-05 14:57 | `FOFFGvoFL_` |  | Issues with sugar rush locations effect. Can't apply it. | no card or UI keyword detected |
| 2026-05-05 13:59 | `J5LhCAwI3r` |  | the bot wont stop thinking | no card or UI keyword detected |
| 2026-05-05 12:20 | `ujtwYaEd8A` |  | Chief Bogo won't play the character for free | no card or UI keyword detected |
| 2026-05-05 12:11 | `LXib4WYUsw` |  | I attack with mirage on judy hops but only do 1 damage, the resist would only be on my opponents turn | no card or UI keyword detected |
| 2026-05-05 01:42 | `AK_LvXx7xq` |  | cards are tiny and my characters won't ready despite no effects that would cause that. | no card or UI keyword detected |
| 2026-05-05 01:40 | `Pk5G-OwTVk` |  | the preview popup in the  top left corner sometimes wont go away on its own.  it pops up and stays until i close it.  even after a game has ended. | no card or UI keyword detected |
| 2026-05-05 01:01 | `mMgL0D2SB9` |  | Second star doesn’t work still | no card or UI keyword detected |
| 2026-05-04 20:09 | `3nMgRUmZUC` |  | Fix your shit | no card or UI keyword detected |
| 2026-05-04 18:44 | `Cln3LBwfkS` |  | lore (0) not level hup | no card or UI keyword detected |
| 2026-05-04 18:05 | `V7UbMAaYcc` |  | Lady's effect isn't working properly. | no card or UI keyword detected |
| 2026-05-04 17:58 | `caTGOt1u33` |  | i don't look my lore (0) | no card or UI keyword detected |
| 2026-05-04 12:51 | `94Z2DAy7oA` |  | Problem on mobile when you have more than 3 charaxters on a location to choose then | no card or UI keyword detected |
| 2026-05-04 11:16 | `ffcZmXTZOg` |  | The match was totally hacked, i was playing triyng to win anyway but in every turn opposing player did something to change the stats on the field. Please ban... | no card or UI keyword detected |
| 2026-05-04 03:12 | `-t0e3WqzB4` |  | Woody's ability would not resolve | no card or UI keyword detected |
| 2026-05-04 02:56 | `b9X9SZyKHA` |  | The computer did not make next move and went over time when i tired to drop opponenet it wouldnt work and i had to concede myself | no card or UI keyword detected |
| 2026-05-04 01:58 | `MiXHliwgNf` |  | There is a glitch when you quest 5 cost Woody. When you play Rex with Woody's ability it doesn't give you the option of putting him exerted/bodyguard | no card or UI keyword detected |
| 2026-05-04 00:43 | `jKg7cxD0St` |  | I drew RC car when I quested with Woody the Jungle Guide.  I am now unable to make any play other than to concede the game.  There is still a horrible bug wi... | no card or UI keyword detected |
| 2026-05-04 00:40 | `_YQdUa96zC` |  | Woody Legendary Set 12 trigger didn't pop up to be resolved. Had to refresh to be able to resolve the trigger. When trying to play a character for free with ... | no card or UI keyword detected |
| 2026-05-04 00:03 | `Rz_7-O-Bi7` |  | It wont let me resolve woody's ability. This is the second game in a row it wont let me, | no card or UI keyword detected |
| 2026-05-03 20:14 | `gEaoV3G-Nw` |  | Cant play a 2 cost character for free when questing woody | no card or UI keyword detected |
| 2026-05-03 18:59 | `nS1X4aWHnm` |  | Using Woody Legendary effect playing Character with 2 or  less for free doesnt work | no card or UI keyword detected |
| 2026-05-03 16:29 | `LTllgDIq32` |  | Not allowing me to use sugar rush start line ability to move locations | no card or UI keyword detected |
| 2026-05-03 16:01 | `keo4fwiTvW` |  | woody can not summon woody | no card or UI keyword detected |
| 2026-05-03 00:58 | `nS1xCgNZv2` |  | it won't let me select 2 cards to rush | no card or UI keyword detected |
| 2026-05-03 00:07 | `KY-SNCsjiD` |  | the locattion cant be challengurd | no card or UI keyword detected |
| 2026-05-02 23:59 | `PIiVrxwUZi` |  | i cant challengue the location so y loose all my time of the turn | no card or UI keyword detected |
| 2026-05-02 23:58 | `Mkl-DN3krs` |  | i cant challengue the location | no card or UI keyword detected |
| 2026-05-02 23:55 | `ODnsxm9Ew4` |  | i cant attack the location | no card or UI keyword detected |
| 2026-05-02 22:59 | `PBhLIkKDia` |  | Both You've got a Friend in Me and the Woody that let's you search for other toys don't reveal the cards that are put into the hand, even though they must be... | no card or UI keyword detected |
| 2026-05-02 21:14 | `a4df-d6RGy` |  | Can't see/access more than 4 items in game. | no card or UI keyword detected |
| 2026-05-02 19:44 | `LJTDsRBFOS` |  | My woody doesnt give the option to challenge | no card or UI keyword detected |
| 2026-05-02 18:13 | `efjxeJz5do` |  | Gadget's ability isn't giving lore pip bonus to everyone with support when plane is in play | no card or UI keyword detected |
| 2026-05-02 16:57 | `CvxmK3C1eP` |  | The cursor isn't always able to choose a certain card | no card or UI keyword detected |
| 2026-05-02 15:41 | `BORB7ORcQ8` |  | lore est toujours à 0 même si je quête | no card or UI keyword detected |
| 2026-05-02 15:20 | `XGd5Pa4C6-` |  | While using Ham's ability to reduce a 3 cost character to 2, it wouldn't trigger Jessie's ability to allow me to reduce an opponents strength by 1. | no card or UI keyword detected |
| 2026-05-02 10:56 | `ru8CvwDvBR` |  | Grand mother Fa spirited elder effect persists "until the start of your next turn" instead of "this turn" as written on the card | no card or UI keyword detected |
| 2026-05-02 08:02 | `PRuVDODzdC` |  | I can draw cards even without sacrificing an item | no card or UI keyword detected |
| 2026-05-02 00:27 | `ir-_t7Jor3` |  | slushy got boosted to 8 strength with ruby champion on the board and only quested for 1 instead of 2 | no card or UI keyword detected |
| 2026-05-02 00:02 | `5h5wCWeV03` |  | I just banished a character with Ms. Incredible, so I should be able to ready any Super charavter including her. But it wont let me ready her | no card or UI keyword detected |
| 2026-05-01 21:30 | `4I7wUa-3-h` |  | You've Got A Friend In Me does not reveal the toys chosen. | no card or UI keyword detected |
| 2026-05-01 19:40 | `MiPfAlwM2e` |  | Not revealing the character card drawn from the top of the deck for 1 cost Daisy Duck's questing ability | no card or UI keyword detected |
| 2026-05-01 19:22 | `bY3LdHW6PX` |  | The cards are SO SMALL!! | no card or UI keyword detected |
| 2026-05-01 19:09 | `ToI7UW7max` |  | I jusbanished a character with Ms. Incredible. I should be able to ready chosen "Super" character, but I wasn't given the option | no card or UI keyword detected |
| 2026-05-01 17:56 | `MW4fK0ESVg` |  | gadget not working with support plane to increase lore value | no card or UI keyword detected |
| 2026-05-01 15:51 | `AsM6Wvuzix` |  | Icons too small.  Can't challenge locations | no card or UI keyword detected |
| 2026-05-01 05:14 | `nx_tIGNg29` |  | Charater should not have died because he had 2 resist. | no card or UI keyword detected |
| 2026-05-01 01:53 | `FHdimLmay3` |  | Fire the cannon is only dealing one damage | no card or UI keyword detected |
| 2026-05-01 00:34 | `ZLpQRYMDFJ` |  | locked up | no card or UI keyword detected |
| 2026-04-30 23:17 | `rkGd6PFvIO` |  | scrooge agent of shush not returned to hand when challenged | no card or UI keyword detected |
| 2026-04-30 22:22 | `yZNaP8o5Qt` |  | opponent was able to challenge my characters through the rex bodyguard while he was exerted. | no card or UI keyword detected |
| 2026-04-30 20:38 | `TxxWwNKE2l` |  | Mirage dealt 4 damage in challenge, but I don't see in the log why. | no card or UI keyword detected |
| 2026-04-30 16:23 | `X-ZkmpcYYZ` |  | 3 arrows was able to choose the same character for both damage instances | no card or UI keyword detected |
| 2026-04-30 16:13 | `rH5rFWLXcL` |  | Cards that are supposed to reveal, like Woody and You've got a friend in me, are not revealing. | no card or UI keyword detected |
| 2026-04-30 15:32 | `jkL1DBwwkS` |  | cant sing together | no card or UI keyword detected |
| 2026-04-30 15:28 | `lleciLLdsq` |  | After playing lady david could not enter play exerted, he should be able to as he is entering play | no card or UI keyword detected |
| 2026-04-30 14:32 | `G4Rw_F78NL` |  | gadgets ability giving all suppo9rt characters extra lore did not work | no card or UI keyword detected |
| 2026-04-30 14:23 | `w25CkX8D5p` |  | Effects that require a card to be revelaed to an oppenent (Ex friend in me or judy detetive) are not revelaing info | no card or UI keyword detected |
| 2026-04-30 03:41 | `D1J9h2vTMW` |  | Woody on quest effect does not allow for bodyguard to enter play exerted | no card or UI keyword detected |
| 2026-04-30 01:32 | `VjBbQsAsPu` |  | couldn't play after 5 coast woody summoned a card | no card or UI keyword detected |
| 2026-04-30 00:36 | `VGOaTUIfGK` |  | cannot progress past woody.  bugged second trigger.  cannot play character of 2 cost and cannot move past. | no card or UI keyword detected |
| 2026-04-29 23:45 | `gbVcvE7IQa` |  | when woody brings out a character, i am not able to select to bring them exerted (bodyguard ability) | no card or UI keyword detected |
| 2026-04-29 23:17 | `fY3VehJdDE` |  | Friends in me is not revealing the chosen cards | no card or UI keyword detected |
| 2026-04-29 21:43 | `JA7aG5cHd6` |  | Could not use boost mechanic | no card or UI keyword detected |
| 2026-04-29 21:28 | `AOXDfcc7bF` |  | Emerald Chromoticon is not working as intended. My opponent banished a character and the item did not trigger. | no card or UI keyword detected |
| 2026-04-29 21:26 | `hBeBYlgjWK` |  | bug ability jessi | no card or UI keyword detected |
| 2026-04-29 21:24 | `zNK5n8ZCz5` |  | error effect jessie | no card or UI keyword detected |
| 2026-04-29 20:51 | `CVzl5T4Ctc` |  | Maximus doesn't gove me 5 lore gor ma m. Indestructible with 14 strong.... | no card or UI keyword detected |
| 2026-04-29 20:07 | `7BMnqUknV6` |  | i play mad heir and damage wass not put onto angle it should not me effect by resist | no card or UI keyword detected |
| 2026-04-29 18:13 | `Bj4tIZEvXp` |  | max goof trigger not working | no card or UI keyword detected |
| 2026-04-29 17:45 | `dsvD2onjAl` |  | no se ve el lore | no card or UI keyword detected |
| 2026-04-29 16:24 | `qKxrcSYPeF` |  | AI stalled when dealing with big tramp and choosing cards | no card or UI keyword detected |
| 2026-04-29 16:01 | `zrDeHt3Yky` |  | I am unable to quest with Montegory Jack even though he is now at a location and has 6 shield so should be able to. | no card or UI keyword detected |
| 2026-04-29 15:29 | `mAfXG38vZd` |  | Can't swing with reckless. | no card or UI keyword detected |
| 2026-04-29 14:45 | `WJeMSDbC8Z` |  | hei hei expanded consciousness does not ink all cards when played | no card or UI keyword detected |
| 2026-04-29 10:07 | `G_4Vn8_2cO` |  | No card images and or text | no card or UI keyword detected |
| 2026-04-29 05:10 | `INIl1-Rl5b` |  | wont allow to refuse webys diary when not having ink | no card or UI keyword detected |
| 2026-04-29 04:36 | `CZjEAHrX0H` |  | Hei Hei Expanded consciousness: the card states all cards in your hand get put into your ink well, but I was only able to put 1 card into my inkwell, it woul... | no card or UI keyword detected |
| 2026-04-29 00:17 | `JYWopNahRU` |  | I cannot put multiple characters into a character or location with damage | no card or UI keyword detected |
| 2026-04-28 22:34 | `QOoNCZvNFz` |  | computer notes, says opp plaed stregnth of raging fire, but actually played zeus lighting bolt, in play by play notes | no card or UI keyword detected |
| 2026-04-28 20:25 | `U656XA8_8L` |  | unable to select any of my characters to banish to trigger Sid's trigger | no card or UI keyword detected |
| 2026-04-28 20:06 | `kDor_0JmVg` |  | with woody, it's a MAY play a character 2 cost or less for free. it keeps automatically playing a character. | no card or UI keyword detected |
| 2026-04-28 20:03 | `G3mxcpSJb-` |  | My opponent ran out of cards and was able to continue playing. I believe the correct ruling is if you cannot complete a draw action, you lose. | no card or UI keyword detected |
| 2026-04-28 19:30 | `A9r71qvP-2` |  | sid. I banished a toy on play and it did not make my opponent banish a character. | no card or UI keyword detected |
| 2026-04-28 19:24 | `meiOJAkhT4` |  | Boost Mechanic is not working on Chesire Cat, Inexmplicable or Scrooge | no card or UI keyword detected |
| 2026-04-28 17:56 | `VvprHBa914` |  | I can't see some of the items I played. I suspect there should be a scroll bar somewhere. Maybe I missed it | no card or UI keyword detected |
| 2026-04-28 15:15 | `4ekmcYHUK6` |  | Lady Misparker Ave - Something Wonderful only allows you to bring back 1 not 2 cards into hand. only allowed to select 1 | no card or UI keyword detected |
| 2026-04-28 13:34 | `q1RlnE8FVC` |  | Sugar rush speed way starting line was not functioning properly. I had a character there and when i activated its ability it said i needed to select two of s... | no card or UI keyword detected |
| 2026-04-28 05:26 | `4A0xlcWvVT` |  | Bodyguards aren't getting the option to enter play exerted. | no card or UI keyword detected |
| 2026-04-28 03:28 | `AClOMywF9F` |  | Buzz Lightyear does not cycle cards | no card or UI keyword detected |
| 2026-04-28 01:29 | `e02DnjK4Xh` |  | cat didnt know what to do at the end | no card or UI keyword detected |
| 2026-04-28 00:52 | `KATsv_GoXs` |  | unable to play a toy for free when questing woody | no card or UI keyword detected |
| 2026-04-27 22:28 | `Ovxg4gSnxl` |  | Marshmellow Cranky Climber, prevented my Lanterns from readying on my turn | no card or UI keyword detected |
| 2026-04-27 20:03 | `HoLp9B2TO8` |  | Pocahontas disallowed characters to challenge and then Boost on Chesire Cat is not allowed | no card or UI keyword detected |
| 2026-04-27 18:48 | `Biov8kzGnQ` |  | Louisa madrigal ability did not work correctly | no card or UI keyword detected |
| 2026-04-27 18:08 | `5VfksGoNb7` |  | most of my cards do not work | no card or UI keyword detected |
| 2026-04-27 17:26 | `Txs9WrrEO4` |  | Daisey Paranoid Investigator does not apply the proper strength as support. Causing me to lose the game | no card or UI keyword detected |
| 2026-04-27 16:17 | `kUjni4qtP9` |  | supporting from Daisey Duck internal investigator does not provide the correct amount of willpower to another character. In this case Tip only got +3 instead... | no card or UI keyword detected |
| 2026-04-27 16:05 | `MPnS6J5QQ5` |  | Lord McGuffin is not triggering exert to deal 3 damagae | no card or UI keyword detected |
| 2026-04-27 15:47 | `4XVSH05Yab` |  | Dragonfly swarm isn't working | no card or UI keyword detected |
| 2026-04-27 15:34 | `5BIkboyLBo` |  | Firefly does not work | no card or UI keyword detected |
| 2026-04-27 14:25 | `vxvNuK-OWj` |  | John silver one does 1 turn damage to every character. Next turn not anymore. | no card or UI keyword detected |
| 2026-04-27 14:09 | `3YsDAAjx9l` |  | I can't see the cards, just their names. | no card or UI keyword detected |
| 2026-04-27 07:06 | `hlHV04oYaD` |  | Set12 Raya During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn.  Resist not work. | no card or UI keyword detected |
| 2026-04-27 03:57 | `oKC6vM65JV` |  | Cant boost with Bambi same turn played | no card or UI keyword detected |
| 2026-04-27 00:51 | `92SJza00SO` |  | New Sid is targeting my characters not letting me choose which to banish. games busted til fixed. | no card or UI keyword detected |
| 2026-04-27 00:51 | `ynsRhFSs6S` |  | when I use Sid ability it does not give me the lore | no card or UI keyword detected |
| 2026-04-26 22:35 | `fn8wmXgLN3` |  | also Sid Phillips character when triggering the Sca ability my opponent is choosing my character to sac, but should be me | no card or UI keyword detected |
| 2026-04-26 22:28 | `W6w6IXY9XP` |  | Sid Philips did not enable ability after Toy banished | no card or UI keyword detected |
| 2026-04-26 20:43 | `tAJeTzAqhp` |  | Pepa Madrigal 2nd effect didnt work, when i move 1 damage i draw a card | no card or UI keyword detected |
| 2026-04-26 20:30 | `6yS_vNTFD-` |  | Alma Madrigal cost 5 effect does not trigger when i move 1 damage from and exert a character | no card or UI keyword detected |
| 2026-04-26 19:02 | `kt_IcTEEFx` |  | Gadget support characters get +1 lore didn’t wok | no card or UI keyword detected |
| 2026-04-26 15:24 | `S60ts438vW` |  | Opponent gain lore with playing 2 cards per turn for the inkcaster abilities | no card or UI keyword detected |
| 2026-04-26 15:08 | `mNHkQUt_Hc` |  | Daisy (donalds date) doesn't reveal the card when offered to opponent. | no card or UI keyword detected |
| 2026-04-26 10:07 | `GZh4P2iuZx` |  | when you can play a dwarf for free, i could not choose which one on my hand | no card or UI keyword detected |
| 2026-04-26 09:24 | `SeqACGgIjI` |  | Pluto Bodyguard has damage but still does 5 damage what the f**k | no card or UI keyword detected |
| 2026-04-26 03:17 | `EauQ5WSbB8` |  | The chat box where it says what happened during the match is listing the wrong item when something is inked or played. | no card or UI keyword detected |
| 2026-04-25 21:53 | `eo01P7uorY` |  | Pass turn did not work | no card or UI keyword detected |
| 2026-04-25 19:40 | `IpnQJ3LHYs` |  | Opponent timed out , but I couldn't drop him. Said match already ended. | no card or UI keyword detected |
| 2026-04-25 13:25 | `LSIzxufNYW` |  | Again it wont let me end my turn after questing webby forcing the match to be dropped | no card or UI keyword detected |
| 2026-04-25 13:14 | `aOuJ3e4bNK` |  | Wont let me end my turn after questing webby | no card or UI keyword detected |
| 2026-04-25 05:21 | `qw2cw1tT26` |  | Can't see the cards in play, and can't select them for Boost ability. | no card or UI keyword detected |
| 2026-04-25 03:06 | `5v0ZMwDunm` |  | unless im confused i cannot cancel elinors ability if there are not targets | no card or UI keyword detected |
| 2026-04-25 02:37 | `429PoJwMMt` |  | my 6 cost tomatoa wouldnt let me grab the two popcicles in my discard | no card or UI keyword detected |
| 2026-04-25 02:14 | `A0jtEsTwxl` |  | Your still using a true ranom learn to write a simulated shulle instead of a true ranom this is not 1980 anymore | no card or UI keyword detected |
| 2026-04-25 01:41 | `Q-yRwsbdbQ` |  | Not letting me pass my turn | no card or UI keyword detected |
| 2026-04-25 01:09 | `vfMIBoVFGe` |  | clarabelle trigger won't resolve | no card or UI keyword detected |
| 2026-04-25 01:08 | `f_fFLhEJcW` |  | cant end my turn or resolve effect on clarabelle 7 | no card or UI keyword detected |
| 2026-04-25 00:59 | `uIN9X8W8B8` |  | slow | no card or UI keyword detected |
| 2026-04-25 00:41 | `43ZJ8iW7op` |  | The game won't let me do anything.  I can't mulligan any cards and it says that it's on my time clock even though the opponent has "turn".  I'll upload a pos... | no card or UI keyword detected |
| 2026-04-24 23:21 | `9zsPNoW45l` |  | again a bug with meeko | no card or UI keyword detected |
| 2026-04-24 23:15 | `X09wY79wP1` |  | Meeko is buggy | no card or UI keyword detected |
| 2026-04-24 22:50 | `WcM_ogkSpn` |  | Archemdes can't destroy woodchuck | no card or UI keyword detected |
| 2026-04-24 15:10 | `SAw1H5RYpQ` |  | pluto doesnt lose strength when he takes damage. | no card or UI keyword detected |
| 2026-04-24 11:56 | `dwI6Y6-ak6` |  | blue steel 4 cost yasmin. if my oppoenent used her effect i cant see the card wich she takes in her hand.. | no card or UI keyword detected |
| 2026-04-24 08:56 | `i6zM4mgofK` |  | cannot choose an item to banish while using pluto effect | no card or UI keyword detected |
| 2026-04-24 06:57 | `ICimhng8gX` |  | she | no card or UI keyword detected |
| 2026-04-24 04:35 | `3Ygz9bX71Q` |  | Please fix the robinhood trigger when picking visions of the future.   This has cost me the game many times | no card or UI keyword detected |
| 2026-04-24 04:28 | `uQrv3pTdfm` |  | benja effect of discarding item not working. | no card or UI keyword detected |
| 2026-04-24 00:15 | `qR688GpObJ` |  | I can not see an option to exert a bodyguard character when played | no card or UI keyword detected |
| 2026-04-23 23:39 | `PFAniOyRMM` |  | When i quest with Robin hood, i selected visions of future to play free and it did not play. | no card or UI keyword detected |
| 2026-04-23 21:50 | `iv7okgWURw` |  | I can’t scroll up to see all enemy cards on mobile | no card or UI keyword detected |
| 2026-04-23 21:45 | `AUs73cR0jV` |  | OPPONENT NEEDS TO REVEAL KEPT CARDS OFF OF DAISY TRIGGERS | no card or UI keyword detected |
| 2026-04-23 21:18 | `KH0BT0O0e4` |  | winner of game one was allowed to pick to start game two | no card or UI keyword detected |
| 2026-04-23 17:04 | `1lo_ivLbTI` |  | There was not an option to exert a character with Alma when I moved damage | no card or UI keyword detected |
| 2026-04-23 16:11 | `O6-VP2nWxr` |  | flickering when trying to resolve challenge or quest | no card or UI keyword detected |
| 2026-04-23 15:08 | `qND7s54H-4` |  | On the mobile version, when my opponent has more than 3 characters I cannot scroll to see them all. This means I can only challenge or choose characters for ... | no card or UI keyword detected |
| 2026-04-23 13:52 | `1LlJgXUvjM` |  | WET characters attacking on turn they are played | no card or UI keyword detected |
| 2026-04-23 01:31 | `phBK6TOEzO` |  | mob song only allows targeting of 1 opposing character not upto 3 characters/ locations | no card or UI keyword detected |
| 2026-04-23 00:32 | `gGWfT2yOm-` |  | Opponent won game 2 and was given the option of selecting who went first in game 3 | no card or UI keyword detected |
| 2026-04-23 00:32 | `y4ZYMK6gNj` |  | giant tink cant choose ward and there isnt a way around it | no card or UI keyword detected |
| 2026-04-22 23:01 | `aVULD5lVw4` |  | It would not let me "resolve" a damage | no card or UI keyword detected |
| 2026-04-22 22:43 | `417BKMd1uP` |  | Doing best of three but second game always ends immediately | no card or UI keyword detected |
| 2026-04-22 22:28 | `soKSt5laRf` |  | The game is telling me to discard a card but meeko is not exerted, i just played it | no card or UI keyword detected |
| 2026-04-22 19:53 | `5NJ8FV12wV` |  | It keeps saying authentication lost but the message never goes away after refreshing. | no card or UI keyword detected |
| 2026-04-22 19:20 | `Yr4F9iIO3K` |  | i couldnt choose which to ready versus a marshmallow. it readied the first char on the board, i had 5 or 6 chars. | no card or UI keyword detected |
| 2026-04-22 18:34 | `ixGyaKs3Ns` |  | i banished a 2 cost uninkable scrooge with 1 damage on it and 2 boosts with only a good aim from angel (4 cost steel). i think it thought it had its original... | no card or UI keyword detected |
| 2026-04-22 17:01 | `YIaBgUbM9_` |  | rush isnt working | no card or UI keyword detected |
| 2026-04-22 14:03 | `K0lhtUyFE1` |  | Meeko rtriggering when not exerted a | no card or UI keyword detected |
| 2026-04-22 12:04 | `iHwdcud-zk` |  | It doesn’t let me choose a target for actions when im in a vertical display on mobile. I need to orient my phone horizontally to select. | no card or UI keyword detected |
| 2026-04-22 10:36 | `nf2Zktm64D` |  | i HAVE PLAYED DINKY, GOT THE BRAINS SEVERAL TIMES AND MY OPONENT CAN NEVER CHOOSE A CAHRACTER TO ADD THE DAMAGE TOO | no card or UI keyword detected |
| 2026-04-22 10:36 | `rQm5HaVyts` |  | Dinky on opp side - not allowing me to select one of my characters to deal damage to, even though I have multiple valid options | no card or UI keyword detected |
| 2026-04-22 10:17 | `hd55KWKQp8` |  | dinky is bugged doesnt let you select glimmer to deal damage to | no card or UI keyword detected |
| 2026-04-21 18:57 | `ogekZlcALV` |  | Would not advance to game 2 in a private BO3 match | no card or UI keyword detected |
| 2026-04-21 13:37 | `CZkhDOa9lZ` |  | AI is unable to resolve chershire cat boost trigger due to no damaged characters being in play. | no card or UI keyword detected |
| 2026-04-21 05:32 | `AaifF8VRy4` |  | can't play song even though i have enough ink | no card or UI keyword detected |
| 2026-04-21 02:51 | `gKdAH1BTvh` |  | vincenzo must deal 3 damage instead of it being optional | no card or UI keyword detected |
| 2026-04-21 00:30 | `2V_pLhihOS` |  | i received a loss but the opponent played a card to gain two lore- but still didnt gain twenty lore and received a win | no card or UI keyword detected |
| 2026-04-20 22:13 | `hebDPc-fkZ` |  | rush powerline did not work after playing a song | no card or UI keyword detected |
| 2026-04-20 20:17 | `wsuCTIJz46` |  | it is not letting me pick a card to resolve an effect of DINKY | no card or UI keyword detected |
| 2026-04-20 18:21 | `ofqba8bQao` |  | Would not let me resolve Dinky to select herc or olaf on my board. No options showed up. | no card or UI keyword detected |
| 2026-04-20 16:28 | `qq6-q_YV5h` |  | couldn't place a damage with Dinky.  said no valid target | no card or UI keyword detected |
| 2026-04-20 13:09 | `MsQ-L2Cpk9` |  | won't let me choose action from discard | no card or UI keyword detected |
| 2026-04-20 12:50 | `TVoOMaS1FJ` |  | Bagheera on the ohter side, I had library with damage - banished bagheera but then it banished my library as it did damage to everything | no card or UI keyword detected |
| 2026-04-20 03:22 | `323gcyg90f` |  | Anastasias "Oh I hate this" appears bugged. Once challenged instead of making my opponent discard a card it was asking me to discard a card from his hand but... | no card or UI keyword detected |
| 2026-04-20 02:20 | `tZ14KFEpnp` |  | I can't resolve King Undisputed action. It wants me to target but the action doesn't allow for that. | no card or UI keyword detected |
| 2026-04-20 01:56 | `CYEGfNta5a` |  | Maxgoof top chart quest and didn’t play the song from discard | no card or UI keyword detected |
| 2026-04-19 23:50 | `78OtcIgC_e` |  | Webby's diary did not activate with scrooge putting a card under a character | no card or UI keyword detected |
| 2026-04-19 23:21 | `mg7uuSa2r_` |  | When playing in Samsung Galaxy tab, some cards are not able to be selected to interact ie. To challenge or individual lore | no card or UI keyword detected |
| 2026-04-19 21:46 | `F9zwVCcbW4` |  | When playing Scrooge, it did not give the option to put a card under each character. It does appear they were given ward, so it seems like that worked, but t... | no card or UI keyword detected |
| 2026-04-19 17:20 | `--s6kRv0qb` |  | could not past turn | no card or UI keyword detected |
| 2026-04-19 12:55 | `GfLd3UBQdf` |  | i couldnt challenge with powerline's powerstar rush ability after singing a song | no card or UI keyword detected |
| 2026-04-19 11:50 | `vyamrpKNky` |  | Challenge nao eliminou oponente | no card or UI keyword detected |
| 2026-04-19 02:09 | `OLVC3xJ4bL` |  | Best of 3, the second game never loaded and there wasn't any way to get back to the main area. | no card or UI keyword detected |
| 2026-04-19 01:58 | `Oaars903MB` |  | This guy @callmejames keeps quitting.  over and over. | no card or UI keyword detected |
| 2026-04-18 22:17 | `C5zkpart4l` |  | Should be able to challenge a location even if my opp has bodyguard but the client does not allow me to challenge the location | no card or UI keyword detected |
| 2026-04-18 21:21 | `aokluR2CEn` |  | Glitches every time I hover over characters on the board. Keeps flashing as if I’m taking the pointer on and off really quickly. Makes it really hard to sele... | no card or UI keyword detected |
| 2026-04-18 07:11 | `PXYfbS4gK_` |  | Playmats and Sleeves can't be selected | no card or UI keyword detected |
| 2026-04-18 07:09 | `T3a726qoZy` |  | no Mulligan | no card or UI keyword detected |
| 2026-04-18 04:36 | `5NVXziS4Hu` |  | Boost on cat is messed up.  I can boost and not move | no card or UI keyword detected |
| 2026-04-17 23:26 | `TYpaLzrM7S` |  | Mob song only allows the selection of one character | no card or UI keyword detected |
| 2026-04-17 21:01 | `rCBlrRHy-u` |  | I have 4 ink and a randmother willow out but iut wont let me play by 5 cost Lady (with grandmother willow it sould be possible) | no card or UI keyword detected |
| 2026-04-17 20:44 | `kx1TX2NX8b` |  | Was asked to resolve royal guard trigger for strength at start of turn from draw but game interpreted it as marshmallow trigger | no card or UI keyword detected |
| 2026-04-17 19:12 | `D6pfZaeK0_` |  | Scrooge McDuck card did not return to hand when challenged by opponent | no card or UI keyword detected |
| 2026-04-17 19:05 | `o_xZBx2jH4` |  | I played King Undisputed and the game made me select the opponent's card i want to remove. Then game dont let me use the card. | no card or UI keyword detected |
| 2026-04-17 17:49 | `RPvmx7jUyi` |  | Meeko effects trigers when up | no card or UI keyword detected |
| 2026-04-17 14:53 | `zEYX92di0g` |  | can't play the second game in a BO3 | no card or UI keyword detected |
| 2026-04-17 13:37 | `h76rZ6zHUi` |  | I don't know for sure, but I think there might be a bug with Dinky - Had the Brains. I've played it in two matches and the opponent has not resolved the acti... | no card or UI keyword detected |
| 2026-04-17 12:35 | `G__YVR1WXj` |  | I don't think Broadway is registering as having bodyguard. I didn't get the option to exert him when played, and the opponent challenged my other characters ... | no card or UI keyword detected |
| 2026-04-17 10:01 | `R_pkHo6WK3` |  | Habe verloren weil ich die gesammelten Legenden nicht sehen konnte, es stand die ganze Zeit 0 zu 0 | no card or UI keyword detected |
| 2026-04-17 09:59 | `I2bozoAQ3R` |  | Keine Legenden punkte | no card or UI keyword detected |
| 2026-04-17 02:39 | `If5isbFIHs` |  | Pluto (steel bodiguard) is keeping the +4 strength even after receiving damage. | no card or UI keyword detected |
| 2026-04-17 01:58 | `NCZxTvfznQ` |  | boost only cost 1 and it charged me 2 ink | no card or UI keyword detected |
| 2026-04-16 20:43 | `QyN52I4rOW` |  | Meeko should check if it is exerted before making you choose Currently it makes you choose between discarding and banishing and then checks if it is exerted | no card or UI keyword detected |
| 2026-04-16 19:51 | `5ODKlwLcHS` |  | While using MMM on boost charactrers somethimes they die without proper hp loss | no card or UI keyword detected |
| 2026-04-16 19:16 | `eg64sJ3tLt` |  | wont let me pick a character for effect none appear | no card or UI keyword detected |
| 2026-04-16 15:36 | `gcLbIxGvPT` |  | The action log is one turn behind for ink.  Also opponents cards are showing right across the middle of the board, not in the center of their section. | no card or UI keyword detected |
| 2026-04-16 09:24 | `64U6y5rQ2J` |  | Cannot select 2 cards | no card or UI keyword detected |
| 2026-04-16 07:48 | `AJgkYsjxGr` |  | pluto bodygaurd still does damge with damage on him he should do 0 damage | no card or UI keyword detected |
| 2026-04-16 07:13 | `YGtROuPjNq` |  | can't resolve effect | no card or UI keyword detected |
| 2026-04-16 06:00 | `KCLEs2ve_d` |  | bo3 doesnt progress to second match | no card or UI keyword detected |
| 2026-04-16 04:07 | `c-KMK0AymL` |  | Unable to sing | no card or UI keyword detected |
| 2026-04-16 02:39 | `egN-BH3GJK` |  | When I quested with Robin Hood Sharp shooter, develope your brain didn't work | no card or UI keyword detected |
| 2026-04-16 00:44 | `zDvlivPxfz` |  | new game wont load | no card or UI keyword detected |
| 2026-04-16 00:43 | `-yo-lUKjlp` |  | game would not go to next game | no card or UI keyword detected |
| 2026-04-15 23:52 | `jaNObp1qRS` |  | On Samsung tablet 8 left side of the cards when in a game will not open menu to see card details to quest use ability or challenge.  The right side is fine a... | no card or UI keyword detected |
| 2026-04-15 21:50 | `aRwocvHYwY` |  | Can not access the controls on ios. | no card or UI keyword detected |
| 2026-04-15 20:13 | `UhJKSmqONI` |  | Royal Guard should have more damage since 2 extra cards were drawn this turn. | no card or UI keyword detected |
| 2026-04-15 17:08 | `5sv327YU4V` |  | Both players see it as opponents turn with neither able to play | no card or UI keyword detected |
| 2026-04-15 17:07 | `QlJKpzMnhx` |  | cant send turn | no card or UI keyword detected |
| 2026-04-15 16:41 | `YIu9pjdBTH` |  | Wasabi is not allowed to use Dumbo's ability to draw and gain lore | no card or UI keyword detected |
| 2026-04-15 16:14 | `zIR6CyXaaG` |  | When my opponent plays more than 8 cards, the top row disappears.  I can’t scroll to see them | no card or UI keyword detected |
| 2026-04-15 15:17 | `Qf3_yIJ-1z` |  | Character did not banish after willpower boost was removed. | no card or UI keyword detected |
| 2026-04-15 13:39 | `T7io-_jvxi` |  | Swords released did not trigger when I have the largest character on the board. | no card or UI keyword detected |
| 2026-04-15 13:25 | `NFEAJLogHA` |  | dumbo effect on Wasabi was not possible | no card or UI keyword detected |
| 2026-04-15 09:07 | `aG34U8ehOQ` |  | elite archer only allowed for 1 additional target | no card or UI keyword detected |
| 2026-04-15 03:38 | `sakQJlqMOi` |  | Player has challenged my ready characters twice... | no card or UI keyword detected |
| 2026-04-15 03:32 | `MwaU-viEQb` |  | 7 cost Tod ability does not work | no card or UI keyword detected |
| 2026-04-15 02:30 | `C6V_mtSqk1` |  | Would not let me pass a trigger that no longer met criteria | no card or UI keyword detected |
| 2026-04-15 02:16 | `VZLKB8VjbA` |  | Gothels trigger is supposed to allow me to move any damage regardless of if it’s my character or opposing character to an opposing character. It does not let... | no card or UI keyword detected |
| 2026-04-15 02:16 | `Sd4FMm_Ct_` |  | Madam Nim Elephant works Backwards | no card or UI keyword detected |
| 2026-04-15 02:10 | `WdFvKO6UXm` |  | Damage counters did not move with the Gothenburg trigger | no card or UI keyword detected |
| 2026-04-15 00:29 | `WFsJgqX48p` |  | when using ohana mean family it remove all damages from all my charaters and darwd card for all damages | no card or UI keyword detected |
| 2026-04-14 22:52 | `Zk3UbvC20x` |  | Oh, I can see now from the log that it triggered and was able to be selected - but still registered in the log (and game state) as condition not met. So not ... | no card or UI keyword detected |
| 2026-04-14 22:10 | `ybHDhPPlGX` |  | Apparently I also can't drop my bot opponent from the match | no card or UI keyword detected |
| 2026-04-14 22:02 | `dtIFIm6Si3` |  | Marshmellow didn't let me choose which character to ready | no card or UI keyword detected |
| 2026-04-14 16:46 | `-7ae8Mksun` |  | The cards listed in the log do not match the actual cards played. | no card or UI keyword detected |
| 2026-04-14 14:49 | `-GodKByz03` |  | scrooge got banished with 3 damage and 6 willpower when he only had 3 damage | no card or UI keyword detected |
| 2026-04-13 22:45 | `CnCWpXtNCq` |  | When Olaf leaves play, it causes the trigger to happen twice, letting you return two characters if you want | no card or UI keyword detected |
| 2026-04-13 19:27 | `tjZ33n9yBp` |  | je ne peux pas choisir quelle carte j'envoie à l'aventure | no card or UI keyword detected |
| 2026-04-13 15:51 | `yEgnoP5EEd` |  | ITU playable on ready characters | no card or UI keyword detected |
| 2026-04-13 10:00 | `Lwa4NYvnVL` |  | can we make it so when you go to quest or challenge it doesn't highlight the unit makes it hard to resolve it flickers overtop the card | no card or UI keyword detected |
| 2026-04-13 03:49 | `Pq8lnARL3H` |  | Robin Hood sharp shooter doesnt resolve small spells like visions of the future | no card or UI keyword detected |
| 2026-04-13 03:37 | `2EeJaMCiQ6` |  | Won’t let me select target for Angel | no card or UI keyword detected |
| 2026-04-13 02:18 | `j4kbm6EENR` |  | computer quested, and then played a character but never passed turn, unable to continue the match | no card or UI keyword detected |
| 2026-04-13 02:11 | `F5UpnyLRiy` |  | Cant boost :( | no card or UI keyword detected |
| 2026-04-13 02:00 | `MJV42_CjvS` |  | Meeko is not exerted and the game asks for me to discard. | no card or UI keyword detected |
| 2026-04-13 01:52 | `k7zvz86pTd` |  | Playing best of 3.  Went to go to the 2nd game and it would not load. | no card or UI keyword detected |
| 2026-04-13 00:21 | `IcTjvZBKf5` |  | Angel had resist even though the opponent had a card in hand | no card or UI keyword detected |
| 2026-04-12 21:25 | `ErK2VhvF-b` |  | Max goof ability to quest and play a song from discard for free does not work | no card or UI keyword detected |
| 2026-04-12 17:50 | `j_k-EboXi-` |  | Played Ohana and healed all of my characters. Draw cards for all healed characters. | no card or UI keyword detected |
| 2026-04-12 14:51 | `1ULae_ELFC` |  | Can't end turn, can't resolve clarabelle's effect when opponent has an empty hand | no card or UI keyword detected |
| 2026-04-12 14:48 | `FFZw6icC7r` |  | Scrooge was banished with 4 damage when he had 7 resist | no card or UI keyword detected |
| 2026-04-12 13:02 | `4S1EKzDPJ4` |  | Rolly ability (support) triggered with quest all even though the card was wet | no card or UI keyword detected |
| 2026-04-12 12:41 | `c8kHSRAb0A` |  | Olaf dies but can't activate effect | no card or UI keyword detected |
| 2026-04-12 09:44 | `Lz9Rxunfq1` |  | Op tablet modes kan je NIETS DOEN | no card or UI keyword detected |
| 2026-04-12 02:46 | `GpLuExj28X` |  | i mulliganed 3 and it took the 4 i asked to keep | no card or UI keyword detected |
| 2026-04-12 02:11 | `v4g9udANdj` |  | I selected amethyst steel deck and was put up against a saphire deck. | no card or UI keyword detected |
| 2026-04-12 01:39 | `-mw0CdoGdn` |  | Max trigger didn’t activate to bring back song | no card or UI keyword detected |
| 2026-04-12 00:19 | `6rfcawqHWJ` |  | Cannot remove the Ai control popup on mobile | no card or UI keyword detected |
| 2026-04-11 23:58 | `uIuJfYtvPn` |  | Lore for the opponent went to 20, but the game shouldn't end like it did in my match. My turn should have passed, then end of turn game state is triggered to... | no card or UI keyword detected |
| 2026-04-11 23:47 | `iLQ2GjzPM9` |  | cannot use basil distinguished detectives ability | no card or UI keyword detected |
| 2026-04-11 23:26 | `9AGDUm5o-G` |  | Terror that flaps through the night (3 damage) banished my scrooge that had 3 cards underneath (he had 6 resist) | no card or UI keyword detected |
| 2026-04-11 19:15 | `K9EZ9-ZWUK` |  | I can't pass. | no card or UI keyword detected |
| 2026-04-11 18:57 | `ORx_pWgT4k` |  | Ohana healed all characters and drew for each damage instead of having me choose 1 character | no card or UI keyword detected |
| 2026-04-11 18:19 | `K3mALwNs7F` |  | Opponent didn't get lore when banishing one of my characters with their character that was in Thebes. | no card or UI keyword detected |
| 2026-04-11 16:27 | `muIJkD9LjR` |  | cant challenge or sing | no card or UI keyword detected |
| 2026-04-11 13:51 | `2R605-7r9_` |  | The octopus challenger did not work correctly. | no card or UI keyword detected |
| 2026-04-11 13:49 | `eI-qEjAA8c` |  | Ohana mean family creat bug | no card or UI keyword detected |
| 2026-04-11 13:00 | `JxPVl4b9_E` |  | Ohana Means Familie Remove all damage is Fail. Fault. The text is fault. Chosen charachters. | no card or UI keyword detected |
| 2026-04-11 12:27 | `-g6CluBoSq` |  | broke ai | no card or UI keyword detected |
| 2026-04-11 11:54 | `BeMAD0Mf1A` |  | Retro Evolution doesn't allow me to play the next character after banishing the first one. | no card or UI keyword detected |
| 2026-04-11 08:55 | `YjJGZG8_dG` |  | cant ink second card after playing sail | no card or UI keyword detected |
| 2026-04-11 08:55 | `MQmtnE5gmH` |  | cant ink a second card after playing sail | no card or UI keyword detected |
| 2026-04-11 08:44 | `aFVh0sokM9` |  | goliath trigger | no card or UI keyword detected |
| 2026-04-11 01:30 | `7MEIHL7xiK` |  | Yellow 1-cost daisy- opposing player's drawn card is not revealing. | no card or UI keyword detected |
| 2026-04-11 01:08 | `eeQqiRZAVn` |  | System isn't prompting for Alice's "Ahoy" ability when questing. | no card or UI keyword detected |
| 2026-04-10 21:43 | `stV0kfdwkD` |  | Darkwing's Chair Set showing as playable for 2 ink. | no card or UI keyword detected |
| 2026-04-10 21:37 | `WC-nYvVcxA` |  | Cinderellas ability popped up for me without me playing a princess | no card or UI keyword detected |
| 2026-04-10 21:11 | `L-j-vOBJkN` |  | Darkwing's Chair Set only healed Darkwing Duck for 2 instead of 4. | no card or UI keyword detected |
| 2026-04-10 20:22 | `3c21dKrNCc` |  | got the choice to use cindi wo playing a princess | no card or UI keyword detected |
| 2026-04-10 18:43 | `cBsUjxEHZQ` |  | Couldn't select boost and slow | no card or UI keyword detected |
| 2026-04-10 17:30 | `CkL-4NvKdj` |  | White Hot Agony Plains effect doesnt work | no card or UI keyword detected |
| 2026-04-10 16:53 | `7kLJSbGGel` |  | Cinderela's effect triggered without princess played this turn | no card or UI keyword detected |
| 2026-04-10 16:24 | `uEeTEgAuCb` |  | testing 123 | no card or UI keyword detected |
| 2026-04-10 05:11 | `ofV2FtfG7Q` |  | Anna the ice breakers play event is targeting her instead of letting me choose a target | no card or UI keyword detected |
| 2026-04-10 04:38 | `g2fDL5s14C` |  | I attaacked with 2 genies into a location with 4 HP and it's not registering the 2nd atack so it wont die | no card or UI keyword detected |
| 2026-04-10 03:48 | `VV8J2ca53s` |  | When my opponent played a Goliath, it did not force me to discard down to 2 at the end of my turn. I was able to retain 3+ cards in my hand. | no card or UI keyword detected |
| 2026-04-10 03:37 | `4z1BRRAI6y` |  | Goliath should have made me discard | no card or UI keyword detected |
| 2026-04-10 03:27 | `0qLmNdjeNM` |  | I think it's the opponent's turn but because it triggered a draw for me it thinks it's my turn | no card or UI keyword detected |
| 2026-04-10 00:03 | `OpA_AGMSnq` |  | Hudson, doesn't draw card, but still forces discard | no card or UI keyword detected |
| 2026-04-09 21:34 | `WIcO6wlkw1` |  | - Can't use my Boost abilities; - Some actions aren't clear and the log is full or errors | no card or UI keyword detected |
| 2026-04-09 21:08 | `Ux9XzffSV_` |  | It did not let me boost the chesire cat. | no card or UI keyword detected |
| 2026-04-09 21:02 | `iM1TgmLmlW` |  | Not letting me boost | no card or UI keyword detected |
| 2026-04-09 20:42 | `dJdjub7pWd` |  | Underdog ability doesnt work | no card or UI keyword detected |
| 2026-04-09 20:38 | `SBu-5Fgkj0` |  | Ratigan's Party Location is not giving lore at the beginning of a turn when I have a damaged character | no card or UI keyword detected |
| 2026-04-09 20:02 | `FsjYtJeUKq` |  | Hello challenging doesn't work properly and when playing on a tablet I cannot choose a character because the preview is flickering | no card or UI keyword detected |
| 2026-04-09 18:59 | `VUxW4cKfyO` |  | Meeko end of turn checks even if not exerted | no card or UI keyword detected |
| 2026-04-09 18:52 | `VfI1RlUpcH` |  | honey maren effect isn't functionning | no card or UI keyword detected |
| 2026-04-09 18:38 | `cDEOTMh4Er` |  | Support didnt trigger | no card or UI keyword detected |
| 2026-04-09 18:28 | `scmyo7-s4s` |  | when they delt damage to hydra i wasnt able to deal damage back | no card or UI keyword detected |
| 2026-04-09 18:23 | `iYFdpV-mfg` |  | Cannot boost characters | no card or UI keyword detected |
| 2026-04-09 18:20 | `ych9KcHvCo` |  | When I quest and my character has 'support' - it only allows me to target my own characters, but I should also be able to give support to opposing characters | no card or UI keyword detected |
| 2026-04-09 18:17 | `5FEKYsPrqU` |  | Auf dem iPad kann ich einzelne Karten nicht auswählen.. je mehr Karten ich lege und sie nach links rutschen flackert die Karte und sie ist nicht nutzbar. Son... | no card or UI keyword detected |
| 2026-04-09 18:15 | `V1sIkD1Sba` |  | Alin quest but support can't target opponent card | no card or UI keyword detected |
| 2026-04-09 18:08 | `92tZH5uYPn` |  | Support on opposing character | no card or UI keyword detected |
| 2026-04-09 18:01 | `UruxJBY3mW` |  | goliath in play and opponent did not discard down to 2 cards | no card or UI keyword detected |
| 2026-04-09 17:19 | `5lz11dytSu` |  | Goliaths ability did not trigger for me with an empty hand at end of turn. | no card or UI keyword detected |
| 2026-04-09 16:34 | `QgmZUHYp9Z` |  | It's not possible to use the boost ability of cards | no card or UI keyword detected |
| 2026-04-09 16:25 | `rJGdPTJvQX` |  | todd not be able to quest | no card or UI keyword detected |
| 2026-04-09 16:23 | `6MMOT_lTsZ` |  | todd not ready | no card or UI keyword detected |
| 2026-04-09 16:00 | `ehLKX1v1hQ` |  | Goliath give my opponents cards at the end of their turn but did not give me 2 cards even with an empty hand at the end of my turn. | no card or UI keyword detected |
| 2026-04-09 15:59 | `DqID9DIOcK` |  | My opponent is not always having to discard when using good aim, also the chat log does not list the card they discarded for using the skill. | no card or UI keyword detected |
| 2026-04-09 15:27 | `kCBtYqjJfA` |  | honeymaren gain 1 lore on play mechanic does not trigger when opponent character exerted | no card or UI keyword detected |
| 2026-04-09 15:19 | `I9i1T2ycO5` |  | AHOY! from Alice - Savvy Saliror does not ask for target, it atutomatically self-targets | no card or UI keyword detected |
| 2026-04-09 14:05 | `tSmtw7DOqo` |  | When I passed turn My opponents goliath trigger was not working didnt have an oppertunity to resolve the trigger | no card or UI keyword detected |
| 2026-04-09 13:59 | `ZT4Z3iGuzp` |  | I dont think willow works when she has been bounced | no card or UI keyword detected |
| 2026-04-09 13:33 | `h-2kUaHD9I` |  | Chicha's effect does not work. I should be drawing a card for 2nd ink | no card or UI keyword detected |
| 2026-04-09 13:07 | `qJg0s8ua-g` |  | When readying little john, it doesnt let you quest again | no card or UI keyword detected |
| 2026-04-09 12:54 | `hlMjhMsO4_` |  | HAD 3 INK TO PAY FOR TIANNAS EFFECT AND IT DIDNT ASK ME TO PAY IT | no card or UI keyword detected |
| 2026-04-09 12:34 | `tF-AGHUN9i` |  | i didn't get any cards when my hand was empy from goliath at my turn | no card or UI keyword detected |
| 2026-04-09 11:23 | `Oxd2hytQFY` |  | can not boost character | no card or UI keyword detected |
| 2026-04-09 10:47 | `il7MCNYgl7` |  | Honeymaren ability isn't working | no card or UI keyword detected |
| 2026-04-09 10:39 | `MMqd4iv6um` |  | Freshly played characters cant boost | no card or UI keyword detected |
| 2026-04-09 10:29 | `3UhbSy2CF-` |  | Cannt do anything | no card or UI keyword detected |
| 2026-04-09 10:02 | `455WLDUThl` |  | the abilaty of honeymary Northuldra Guide doesnt work | no card or UI keyword detected |
| 2026-04-09 07:44 | `45yTCNIHrk` |  | Angela doesn't appear to be working. I couldn't select this character to sing or to attack. | no card or UI keyword detected |
| 2026-04-09 07:04 | `e0MtT1ChNk` |  | i am accessing new.lorcanito via chrome under ubuntu, and textures are not rendered properly, e.g in game i only saw card names but no images | no card or UI keyword detected |
| 2026-04-09 06:30 | `-Sn9CbfcQ2` |  | I can’t challenge anyone. I just get cards flashing and can’t do anything. | no card or UI keyword detected |
| 2026-04-09 05:54 | `81aJ7RlwAL` |  | can not boost | no card or UI keyword detected |
| 2026-04-09 04:26 | `GK7sgJ1mWb` |  | Goliath was played on my opponent's board and I never drew cards at the end of my turn even though my opponent did | no card or UI keyword detected |
| 2026-04-09 03:27 | `SRoNkmeivi` |  | Card draw is being reported in the log as doubled - can't tell if it's being doubled in practice, but it shows as twice the number of cards elegible to be dr... | no card or UI keyword detected |
| 2026-04-09 03:08 | `rmOlYJDHl_` |  | Didn’t get my draw 2 trigger with Goliath all game | no card or UI keyword detected |
| 2026-04-09 03:05 | `fDnIfT-54A` |  | Didn’t get my draw off galitath | no card or UI keyword detected |
| 2026-04-09 03:04 | `upM6Ct9hFZ` |  | Palace guard does not gain strength when drawing cards | no card or UI keyword detected |
| 2026-04-09 02:24 | `pO4Rxqqe3l` |  | Honeymaren gain 1 lore ability didn't trigger when she entered while opponent had exerted characters in play | no card or UI keyword detected |
| 2026-04-09 01:29 | `ylSP7b-5rx` |  | Unable to banish Darkwing's Chairs to use the healing ability. | no card or UI keyword detected |
| 2026-04-09 01:24 | `SM0lFGpthk` |  | Honker Muddlefoot's ability of giving Darkwing Duck Resist +1 didn't take effect. | no card or UI keyword detected |
| 2026-04-09 00:26 | `fpoyoH24c_` |  | Kristoff's Lute did not reveal the card before asking option 1/2. I had no idea what card I was playing until it was played | no card or UI keyword detected |
| 2026-04-08 23:59 | `rULWNuXa1H` |  | Opp. was able to target my charcters with ward from Aura on this turn. | no card or UI keyword detected |
| 2026-04-08 23:37 | `LErHOKM_CY` |  | Uninkable Cards seem to circumvent a few actions. Need to be fixed. | no card or UI keyword detected |
| 2026-04-08 23:22 | `uKK4XrSJOl` |  | couldnt select a card for develope your brain. | no card or UI keyword detected |
| 2026-04-08 23:15 | `9VPk4R28Aw` |  | the abil;ety of Scrooge's Counting House  doesnt  work  i had 5 card under it and it gives me 1 lore  but i need to get 6 lore  1 lore from the card and 5 fr... | no card or UI keyword detected |
| 2026-04-08 23:07 | `rhMXN3OQf8` |  | can quest another time with little john | no card or UI keyword detected |
| 2026-04-08 22:53 | `02Xj9uOQfx` |  | Won’t let me pick charters they just blink | no card or UI keyword detected |
| 2026-04-08 22:52 | `NRratgWBD8` |  | At the end of my opponents turn, it made me discard one of my cards instead of my opponent discarding. | no card or UI keyword detected |
| 2026-04-08 22:48 | `Ri_VTq7tLS` |  | Goliath is not giving opponent their two cards. Empty hand I see the Goliath trigger for my opponent who seems to get the choice of allowing me to draw inste... | no card or UI keyword detected |
| 2026-04-08 22:42 | `ykjkghD1wx` |  | Scrooge Ebinezer wont boost | no card or UI keyword detected |
| 2026-04-08 21:59 | `0d0Q4M0yxw` |  | boosted location everyturn and only recieved 1 lore per turn. I lost due to no addtional lore being added by boost | no card or UI keyword detected |
| 2026-04-08 21:53 | `zQ56Sr20w5` |  | wasn't gaining lore from passive card effects | no card or UI keyword detected |
| 2026-04-08 21:53 | `lpKifdX1_D` |  | banished card with calhoun and steel champ pluto and sword of herc - didnt gain a lore | no card or UI keyword detected |
| 2026-04-08 21:40 | `sxDDfrCZi5` |  | Cant boost characters | no card or UI keyword detected |
| 2026-04-08 21:40 | `K4l95B2Crf` |  | I cant boost characters fix this | no card or UI keyword detected |
| 2026-04-08 21:38 | `YTjBlnJkpw` |  | Cant boost characters | no card or UI keyword detected |
| 2026-04-08 21:37 | `7xJ6orkuz1` |  | I cant draw cards due to Goliath ability from my opponent, only he can draw | no card or UI keyword detected |
| 2026-04-08 21:29 | `IM4zk8RZne` |  | Didn't get cards from Goliath as the opponent. | no card or UI keyword detected |
| 2026-04-08 21:06 | `3fVtUQjZDX` |  | palace gaurd (octopus) doesn't gain challenger +1 when drawing card for turn | no card or UI keyword detected |
| 2026-04-08 21:04 | `JEkJx5Gw7Q` |  | Ancestral Legacy Not working | no card or UI keyword detected |
| 2026-04-08 19:46 | `trJ0NTyj6G` |  | Match dropped | no card or UI keyword detected |
| 2026-04-08 19:11 | `I5UY8JeLM6` |  | I cannot select my opponent for Support effect to use World's Greatest Criminal Mind | no card or UI keyword detected |
| 2026-04-08 19:10 | `xHJpS-8_ii` |  | couldn't play "fire the canon" although I had enough ink. | no card or UI keyword detected |
| 2026-04-08 19:08 | `eljlx2QUX1` |  | New lorcanito sucks. Please fix it, it's impossible to play. | no card or UI keyword detected |
| 2026-04-08 18:58 | `WdimWBCeUd` |  | I could not play my underdog christopher robin while going second | no card or UI keyword detected |
| 2026-04-08 18:42 | `Lk4-oScHhS` |  | enemy was able to play 9 ink worth of cards with no effect on board | no card or UI keyword detected |
| 2026-04-08 18:36 | `8NKFpoJpCD` |  | My ink is notering reduceert when playing cards | no card or UI keyword detected |
| 2026-04-08 18:34 | `GlIuD7t5Il` |  | Ink dont exerce | no card or UI keyword detected |
| 2026-04-08 18:14 | `c8I7fo__dq` |  | Game is not using up ink and is allowing unlimited card plays | no card or UI keyword detected |
| 2026-04-08 18:10 | `Os-Q5f5KS8` |  | Olaf ability doesn't work, for each action in your graveyard reduced the cost of this character by 1, doesn't apply to him | no card or UI keyword detected |
| 2026-04-08 18:00 | `IofIN6AYq9` |  | They just played 2 items and a character at 3 cost with only 3 ink. | no card or UI keyword detected |
| 2026-04-08 17:42 | `i_8e71UQGi` |  | unlimited ink to play characters | no card or UI keyword detected |
| 2026-04-08 17:37 | `InsmkuAZrr` |  | they used 7 ink with 5 in the inkwell | no card or UI keyword detected |
| 2026-04-08 17:35 | `Ckqetbk5ld` |  | 7-cost tramp doesnt cost correct ink. | no card or UI keyword detected |
| 2026-04-08 17:35 | `1bX5anba_j` |  | ink dosent exert | no card or UI keyword detected |
| 2026-04-08 17:25 | `Z5TrIHffFN` |  | the other player dropped and it won't end the game | no card or UI keyword detected |
| 2026-04-08 17:10 | `RmYcnUfXVI` |  | Cards chosen by Nani were not revealed. Opponent played multipled cards without paying ink. | no card or UI keyword detected |
| 2026-04-08 17:07 | `T-dxPINnzG` |  | I'm able to play multiple cards with the same amount of lore. It should not be possible. | no card or UI keyword detected |
| 2026-04-08 17:05 | `PLuGKrF1lU` |  | genit can't boost first turn played need to fix | no card or UI keyword detected |
| 2026-04-08 17:04 | `32wuifDi3U` |  | Turn 15 gave him way more ink then he should have rightfully had. Was at 7 ink, but used around 15. | no card or UI keyword detected |
| 2026-04-08 17:04 | `_VwcZl2yAk` |  | already played Trobedeur and its letting me play grandmother willow still | no card or UI keyword detected |
| 2026-04-08 17:03 | `_ZHefY4rDJ` |  | My inkwell didn't go down and I was able to illegally play a character that I didn't have the ink requirements for. | no card or UI keyword detected |
| 2026-04-08 16:59 | `c892DQSU5D` |  | I don't think paying less lore is working correctly | no card or UI keyword detected |
| 2026-04-08 16:48 | `xGa_IIMy-J` |  | Can’t boost | no card or UI keyword detected |
| 2026-04-08 16:44 | `OkRb_16g8m` |  | I reported a bug about ink that start again and can use all of them, I thik it's de actions/songs that cause the bug, cause at this match I played again some... | no card or UI keyword detected |
| 2026-04-08 16:27 | `E1SHOVKARD` |  | Monstro + Library COMBO The order in which cards are drawn and discarded is relevant | no card or UI keyword detected |
| 2026-04-08 16:26 | `tjYrRL7V21` |  | Able to play cards without spending ink | no card or UI keyword detected |
| 2026-04-08 16:26 | `tvl7zTXhxH` |  | Was able to play cards even without ink | no card or UI keyword detected |
| 2026-04-08 16:11 | `BIQVQ2BAAg` |  | Yeha boost and playing cards isn't using up ink | no card or UI keyword detected |
| 2026-04-08 16:10 | `Qd10VbbZmh` |  | I don't think ink is calculating correctly. I am able to play more than Ink I have | no card or UI keyword detected |
| 2026-04-08 16:09 | `1iwDnFbeK8` |  | not letting me boost aerial with ink available on the turn i play her | no card or UI keyword detected |
| 2026-04-08 15:59 | `RJsWswum5q` |  | When trying to select a character on the field to perform an action or sing a song, the image of the enlarged card flashes on the screen making it impossible... | no card or UI keyword detected |
| 2026-04-08 15:43 | `HLulyUGdC0` |  | The ink did not exert to play characters from my side. | no card or UI keyword detected |
| 2026-04-08 15:39 | `GC7YKhw0kz` |  | As I have previously reported, the ink doesn't exert after a player's like 3rd or 4th turn, meaning you can play infinite cards. | no card or UI keyword detected |
| 2026-04-08 15:31 | `Uf7FNMBt5I` |  | ink was not exerted after playing sven | no card or UI keyword detected |
| 2026-04-08 15:29 | `K6wkgpEtvz` |  | There is no ink useage. It will let you play unlimited cards from your hand as long as the ink cost meets the amount of ink in your inkwell (Does not exert) | no card or UI keyword detected |
| 2026-04-08 15:28 | `J-0Qe4-v2y` |  | opponent has infinite ink | no card or UI keyword detected |
| 2026-04-08 15:25 | `V8RsUWDIP5` |  | Can play without exerting ink | no card or UI keyword detected |
| 2026-04-08 15:20 | `mn7hqsRKM1` |  | It is not consuming my ink when I play a card | no card or UI keyword detected |
| 2026-04-08 15:13 | `QgeG45NwdQ` |  | Bambi boost locks up the game, only option is to arrange the cards but unable to use. | no card or UI keyword detected |
| 2026-04-08 15:12 | `E-Pv2ldmEY` |  | For most of the game, it wasn't exerting my ink when I played characters. I was definitely able to play more characters than I had ink for on some turns. | no card or UI keyword detected |
| 2026-04-08 15:11 | `MOl6kTlfXT` |  | Attacked with boosted Bambi, no damage done in combat and boost effect did not trigger | no card or UI keyword detected |
| 2026-04-08 15:07 | `UWPjsQQbjd` |  | Able to use ink infinitely. | no card or UI keyword detected |
| 2026-04-08 15:02 | `MQqzujXwGY` |  | turn one after inking allowed me to play two one drops | no card or UI keyword detected |
| 2026-04-08 14:52 | `8EX93bwkxd` |  | was able to play another 2 cost character with no ink after mowgli ability resolved | no card or UI keyword detected |
| 2026-04-08 14:45 | `Xsis-p87m5` |  | ink is not reduced after play a card | no card or UI keyword detected |
| 2026-04-08 14:45 | `LBV1hWjFK9` |  | Lady Tremain - Sinister socialite triggers the last action in my discard, not one i can choose :) | no card or UI keyword detected |
| 2026-04-08 14:44 | `WNt8t92LKU` |  | ink doesnt work | no card or UI keyword detected |
| 2026-04-08 14:38 | `dsoGb7Hmj9` |  | Another thing I can see at chat, it's that cards name are wrong some of them. | no card or UI keyword detected |
| 2026-04-08 14:35 | `Nl05QPjzT2` |  | Meeko, just played, ask for resolution (not exhausted) | no card or UI keyword detected |
| 2026-04-08 14:32 | `0maEfUvKuh` |  | Can't boost cards | no card or UI keyword detected |
| 2026-04-08 14:31 | `DHwXBmSkT0` |  | can not boost | no card or UI keyword detected |
| 2026-04-08 14:29 | `El710dYY_v` |  | opponent played 2 1 drops turns 1 with only 1 ink and no cantrips to assist | no card or UI keyword detected |
| 2026-04-08 14:25 | `VEUFHDaFUP` |  | Bambi Ertheral fawn trigger not working | no card or UI keyword detected |
| 2026-04-08 14:23 | `Ky7Ih2TQ1j` |  | royal gaurd missed a trigger, i drew a card for turn then for dumbo but when i challenged he only did two damage. it should have been three | no card or UI keyword detected |
| 2026-04-08 14:17 | `jSX5Bbkeka` |  | Using ink isn't permanent for some reason. When a card is played, ink isn't being exerted properly. It seems that when a card is played, you just need to hav... | no card or UI keyword detected |
| 2026-04-08 14:16 | `oZlQ-a55_M` |  | golith clan leader at active players end step does not make them discard to 2 | no card or UI keyword detected |
| 2026-04-08 14:13 | `K-gOPhGDp9` |  | After you play a card and use ink, the ink doesnt go used. and you can play as many cards as you want for the same amount of ink in your inkwell. | no card or UI keyword detected |
| 2026-04-08 14:09 | `ry3jzcFYVI` |  | Scrooge's Counting house only gave 1 lore, even though it had been boosted | no card or UI keyword detected |
| 2026-04-08 14:07 | `xYtaxa9lF8` |  | cant boost | no card or UI keyword detected |
| 2026-04-08 13:59 | `jsbaqUo1A8` |  | This is allowing me multiple moves when i dont have ink | no card or UI keyword detected |
| 2026-04-08 13:58 | `K9cMnXsxd4` |  | I was able to play all of my cards and didn't run out of lore. | no card or UI keyword detected |
| 2026-04-08 13:57 | `L3hrLX7V7W` |  | People are able to play characters and not pay ink at all. | no card or UI keyword detected |
| 2026-04-08 13:56 | `XNR_8hn_Zk` |  | laggy | no card or UI keyword detected |
| 2026-04-08 13:56 | `9sd9xB5hAh` |  | other player used his 4 ink in his 3rd turn without expaning it. he played 2 cindy and two visions | no card or UI keyword detected |
| 2026-04-08 13:55 | `Z82bHRtUU4` |  | you cannot play scrooge by exerting 4 items either | no card or UI keyword detected |
| 2026-04-08 13:44 | `9A6TWRfLIz` |  | i cant boost my characters in lorcanito V2 | no card or UI keyword detected |
| 2026-04-08 13:39 | `vPJXAU5CQM` |  | Picutres of the card are not shown | no card or UI keyword detected |
| 2026-04-08 13:33 | `_k9iG8FTsV` |  | Royal Guard did not gain challenger one when the card was drawn for the turn. | no card or UI keyword detected |
| 2026-04-08 13:31 | `qV3CZ8gRJB` |  | Royal Guard is not gaining challenger from drawing a card at the beginning of your turn | no card or UI keyword detected |
| 2026-04-08 13:16 | `PnoAdrVs_4` |  | I'm not able to boost at all | no card or UI keyword detected |
| 2026-04-08 13:13 | `NzJE8_Vl_u` |  | I was not able to boost with Jimmy Cricket | no card or UI keyword detected |
| 2026-04-08 13:06 | `90J6U_T0xB` |  | I don't believe the inkwell was exerting ink properly when playing a card. I believe my 2nd to last turn I was able to 18 ink worth of cards with just 11 ink... | no card or UI keyword detected |
| 2026-04-08 13:05 | `9sOkrQs7Tv` |  | Playing cards does not exert ink | no card or UI keyword detected |
| 2026-04-08 13:01 | `pB-ZSxcBcS` |  | Letting me use ink after I've already used it once. | no card or UI keyword detected |
| 2026-04-08 12:56 | `tFxW-tOLK5` |  | unable to use dumbos breaking records ability on my other evasive characters, royal guard is not getting +1 attack for drawing a card. | no card or UI keyword detected |
| 2026-04-08 12:55 | `QRJr3obEqr` |  | The opponent played 2 2 ink cards on turn 2 | no card or UI keyword detected |
| 2026-04-08 12:54 | `FXJUQJucDR` |  | Can keep playing card when all the ink should be used | no card or UI keyword detected |
| 2026-04-08 12:49 | `5pNZ7cTSKm` |  | Playing Alice did not cost ink. Questing with Alice I her effect automatically applied to herself. Readying Alice in the next to last round did not allow her... | no card or UI keyword detected |
| 2026-04-08 12:49 | `EthHaHvEVU` |  | ink counter is wrong theres a bug. upon using all inks, i can still continue playing my other cards | no card or UI keyword detected |
| 2026-04-08 12:40 | `DxxBWbLnRf` |  | Boost does not work correctly. | no card or UI keyword detected |
| 2026-04-08 12:38 | `ReVWfuNzVV` |  | Opponent can play multiple cards without ink: Example: turn 1 puts one card into inkwell and plays two vanilla charakters (each costing one ink) | no card or UI keyword detected |
| 2026-04-08 12:36 | `nz55__qwe3` |  | If you play 1 ink you can keep plaing 1 ink cards | no card or UI keyword detected |
| 2026-04-08 12:34 | `g4aib1J1mh` |  | I can keep inking the ink s not good | no card or UI keyword detected |
| 2026-04-08 12:27 | `TsEOqWS8j5` |  | I was able to play more cards than I had ink to play every turn. As long as I played a card that didnt use all of my ink, I could keep playing cheaper cards. | no card or UI keyword detected |
| 2026-04-08 07:21 | `8JrLDAxCYP` |  | Buuuuuuug | no card or UI keyword detected |
| 2026-04-06 18:38 | `9ImrWgn_9b` |  | Cannot do anything, always says authentication lost and refreshing doesn't change it. Unplayable | no card or UI keyword detected |
| 2026-04-06 02:30 | `FpjrkomurL` |  | cannot quest,only quest with all available | no card or UI keyword detected |
| 2026-04-06 00:12 | `W2ofU7VYNc` |  | It keeps saying Authroization Lost even though I keep refreshing the page. It will not let me interact with my own characters on the board. | no card or UI keyword detected |
| 2026-04-05 20:15 | `2rOBBJjEDK` |  | ´your session expired´mesassage displayed , not allowing to continue | no card or UI keyword detected |
| 2026-04-05 05:32 | `2_pmLgA6Ik` |  | Resist +1 doesn't appear to be applying to Calhoun - keeps taking damage from opponents with 1 strength. | no card or UI keyword detected |
| 2026-04-05 05:22 | `pX4vkjTwz3` |  | Last turn, AI played Akood et Amuti for three ink, and then played three characters costing one each. There was only 3 ink in AI's inkwell - it should only h... | no card or UI keyword detected |
| 2026-04-04 18:53 | `hKQGkrQ4Fk` |  | Authentication lost message will not go away. Have closing all tabs and starting a new window and the same thing is happening. Also will not let me concede. ... | no card or UI keyword detected |
| 2026-04-04 16:36 | `Zg92yPsfum` |  | refresh to server. Cant make any moves other than questing | no card or UI keyword detected |
| 2026-04-04 15:37 | `7kFJPsLNu_` |  | Authentication lost message keeps showing up despite refreshing and starting a new game | no card or UI keyword detected |
| 2026-04-04 15:12 | `KrMK2b26-N` |  | "authentication lost " | no card or UI keyword detected |
| 2026-04-04 12:15 | `cpCVR9ig9H` |  | i cant choose my own cards as it shows a message saying that my session has expired. The UI is very pretty, ut not being able to choose the AI deckk and this... | no card or UI keyword detected |
| 2026-04-04 08:35 | `V-1L8Lg7c1` |  | Goliath isn't triggering properly at end of turn - it only draws the player who owns it (in this case, the AI) up to 2, not both sides. | no card or UI keyword detected |
| 2026-04-04 08:24 | `bBRvnwB9w1` |  | My side of the board keeps showing an overlay saying “AUTHENTICATION LOST Your session expired” requesting to refresh in order to reload. The refresh doesn’t... | no card or UI keyword detected |
| 2026-04-03 11:43 | `ovI-tQLNZB` |  | Royal guard automatic +1 for draw isn't working. | no card or UI keyword detected |
| 2026-04-02 22:25 | `1QDqnRBEXS` |  | Bambi effect isn't work, you can't get cards!!  Goliath only work's for person which play the goliath | no card or UI keyword detected |
| 2026-04-02 03:26 | `QfEjaYs4w0` |  | cannot move second character  prince john into location hidden cove, option is not available to "move to location" under prince john highlight | no card or UI keyword detected |
| 2026-04-01 18:28 | `iI6DC5la-U` |  | White Hot Agony Plains - Effect isnt working | no card or UI keyword detected |
| 2026-04-01 02:24 | `m4gCWt-B5M` |  | Couldn't resolve Angel Effect after playing her. Also couldn't choose a target after questing with Mad Hatter. | no card or UI keyword detected |
| 2026-03-31 01:59 | `ybMyGjytPZ` |  | Unable to boost cards | no card or UI keyword detected |
| 2026-03-30 22:19 | `SyXeR-Elk9` |  | cannot target opponent with Basil - Detective | no card or UI keyword detected |
| 2026-03-30 18:05 | `AJdOgFSkzr` |  | won't let me use angels good aim ability | no card or UI keyword detected |
| 2026-03-30 14:50 | `WM8YzEDmJz` |  | Buuugggg | no card or UI keyword detected |
| 2026-03-24 15:18 | `tjaB7-q9Xl` |  | THe very first bug repot!!!! | no card or UI keyword detected |

### question-or-comment (21) — User question or rules confusion, no engine action

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-14 19:21 | `rwlpiUgEY4` |  | i quested B.E.N. but am unable to give his support to tipo??  thank  you | looks like a question or rules confusion |
| 2026-05-13 05:43 | `1caGEbeedS` |  | shouldnt mrs.icredible be able to re ready herself off the banish? | looks like a question or rules confusion |
| 2026-05-09 22:25 | `Fp6UpMtbWJ` |  | He didn’t play 2 card so how did he got the 4th lore. Could you fix those type of things its kind of frustrating | looks like a question or rules confusion |
| 2026-05-06 16:19 | `tA8BHO8qrM` |  | server lag ? | looks like a question or rules confusion |
| 2026-05-06 16:02 | `pJRKaPw8WM` |  | I believe Sid is broken. I have had 2 opponents not make moves after I played him. I'm not sure why they can't select a character to banish. | looks like a question or rules confusion |
| 2026-05-01 13:49 | `9KzISA2zVW` |  | Cards are too small to select after adding support. How do I enlarge the cards in the playing area? | looks like a question or rules confusion |
| 2026-04-27 16:21 | `Fzftb_3rwG` |  | Pluto has damage on him yet when i attack him it still says he has 5 strength?? | looks like a question or rules confusion |
| 2026-04-22 04:47 | `jYoNupb3YE` |  | all charecters vanished on both sides, they did not play any actions and i should have won my following turn, i still won but why did all 4 of my cards and 2... | looks like a question or rules confusion |
| 2026-04-21 18:24 | `O4YsORScjf` |  | When questing with Pocahontas (Amethyst 2) it lets me choose Flinheartt (Emerald 2-3?) even  although it had Ward | looks like a question or rules confusion |
| 2026-04-18 18:21 | `JCbdHh-TG6` |  | How did i löss? | looks like a question or rules confusion |
| 2026-04-09 16:03 | `R9Yn1Qtx5P` |  | Can't figure out how to boost | looks like a question or rules confusion |
| 2026-04-09 08:15 | `PWHMtOItng` |  | game history isn't shown on the side, don't know how some cards were removed from my field | looks like a question or rules confusion |
| 2026-04-09 07:12 | `c2TzeaV9od` |  | u cant even boost and this is supposed to be the new version? | looks like a question or rules confusion |
| 2026-04-09 03:11 | `-ebQmh6jL_` |  | Tried to play Chief Powhatan with 5 ink available. When it asked how do I want to play him exerted or ready neither option worked. Was forced to play a diffe... | looks like a question or rules confusion |
| 2026-04-08 18:56 | `B7TtrpztZu` |  | when I play a card its not subtracting how much ink it had cost to play that card. Honeymarons ability is not activating correctly giving me +1 lore when opp... | looks like a question or rules confusion |
| 2026-04-08 16:27 | `ZOOTUkrJpa` |  | Used discard option on Anna, and I think my opponent can't select? | looks like a question or rules confusion |
| 2026-04-08 15:08 | `4pxEu_KkcG` |  | On turn two my opponent on green blue played two sails and then two donalds??? | looks like a question or rules confusion |
| 2026-04-08 14:33 | `KwI3FCTgU8` |  | Turn before my last turn, my ink doesn't count down, so I can use 13 ink every time. I don't know how many ink use so I pass my turn cause I don't want cheat... | looks like a question or rules confusion |
| 2026-04-08 13:45 | `5hG4zoGwVq` |  | How to boost? Cant get my guinie to boost | looks like a question or rules confusion |
| 2026-04-08 12:37 | `x5KhWQEVoN` |  | Alice - Savvy Salior bonus for questing not implemented, yet? | looks like a question or rules confusion |
| 2026-04-06 19:06 | `q54-vOesvo` |  | I cannot selecct the cards on my side of the game because a banner appears stating that my session has expired. This appears since the beginning of the game,... | looks like a question or rules confusion |

### non-bug (comment/suggestion) (14) — Praise, feedback, or feature request

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-14 23:48 | `hzzKjSxyPO` | omnidroid | i noticed that the omnidroid shift works now.  thanks! or sorry if it was already ok. | positive/feedback message or feature request |
| 2026-05-14 18:49 | `JgBFadPO53` | omnidroid, syndrome | i wasn't given an option to shift out the 4 cost uninkable omnidroid when i pulled him back with the big syndrome trigger.  i should be able to shift.  thank... | positive/feedback message or feature request |
| 2026-05-14 18:13 | `ymyk7GenaS` |  | i hope this makes sense.  it has come up a couple of times where the undo move button doesn't work because it only undoes the choice that pops-up.  I want to... | positive/feedback message or feature request |
| 2026-05-07 19:40 | `EgHiwiTyDb` |  | thank you! for your help | positive/feedback message or feature request |
| 2026-05-06 23:51 | `Hen4CJy2cA` |  | When I try to move to a location, if I tap on the character first, command cancels out when I try to scroll. If I click and drag, I have to drag along the lo... | positive/feedback message or feature request |
| 2026-05-06 19:38 | `9-p6Xc2cMT` |  | opponent using sid phillips ruby card.  when i was supposed to banish my own character i could not progress past the popup (the choice to confirm was greyed ... | positive/feedback message or feature request |
| 2026-05-04 18:57 | `g-JlsZw0d0` |  | i should be able to shift out a robot char with syndromes quest ability.  but it plays out on its own instead of allowing me the shift opportunity.  thank you! | positive/feedback message or feature request |
| 2026-04-27 03:28 | `yTJ8yR7m7z` | metamorphosis, three arrows | Metamorphosis does not work correctly. Please fix this. It does not shift or play without a shift with a shift Character. Also Three arrows gives 3 damage an... | positive/feedback message or feature request |
| 2026-04-26 20:37 | `2SNjDpSfON` | metamorphosis | Metamorphosis did not trigger an effect. I played 1 cost Woody, and I had the cost 5 Woody shift in my discard. The game did not shift my 1 cost Woody.  Than... | positive/feedback message or feature request |
| 2026-04-25 14:11 | `r3DgGMR4lp` | luisa madrigal | Alma, Pepa and Luisa do not trigger properly.   Alma should trigger an exert any time damage is moved.   Pepa should do the same for drawing.   Luisa should ... | positive/feedback message or feature request |
| 2026-04-24 13:32 | `i1UYPVJeIr` | diablo | i love lorcanito thanks  for developer - ability of 322 Diablo dose not trigger in opponent's ture - 322 Diablo cant shift until put ink(shift button is invi... | positive/feedback message or feature request |
| 2026-04-24 01:18 | `syxze0ASqn` | donald duck fred honeywell | Hello. Just wanted to report that an issue with Donald Duck Fred Honeywell. Its second ability where you a card for each card under a character when that cha... | positive/feedback message or feature request |
| 2026-04-20 22:46 | `bRWjwfXy9A` |  | Dinky card wont work it freezes the game. It happened for 2 games. Thank you | positive/feedback message or feature request |
| 2026-04-14 09:53 | `5AUlFpzDSP` | hercules spectral demigod, scrooge mcduck reformed ebenezer | Hey,  during the game two mechanics did not work as i would expect: * Hercules - Spectral Demigod --&gt; After i boosted him, he did not get the +3 Strenght ... | positive/feedback message or feature request |

### vague-or-insufficient (3) — Insufficient detail to action

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-12 20:17 | `FcVYxbu-Gs` |  | error | description has no actionable detail |
| 2026-05-12 20:13 | `2kTs0gBWXg` |  | error | description has no actionable detail |
| 2026-04-07 18:44 | `7NDsfi_3rm` |  | TEst | description has no actionable detail |

### out-of-engine-scope (network) (8) — Network / connection issue (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-14 08:56 | `ShKcI0k1B2` |  | "Drop opponent" after disconnect does not work. He has no time left and still nothing happens when clicking "Drop opponent"... | matches non-engine surface |
| 2026-04-30 01:39 | `2lzXNzncuP` |  | No connection lost , but booted from game for connecting loss | matches non-engine surface |
| 2026-04-18 19:21 | `SgQf6OyhxA` |  | authentication connection | matches non-engine surface |
| 2026-04-08 23:51 | `jnC9I68G6e` |  | Opponent loses connection and I am unable to leave match. | matches non-engine surface |
| 2026-04-08 14:26 | `7EMbtURs1o` |  | Disconnect screen is on and player is still connected | matches non-engine surface |
| 2026-04-08 02:26 | `mxz04RzOyS` |  | I'm getting an error that says need to reconnect via refresh and I cannt play my hand. | matches non-engine surface |
| 2026-04-07 14:10 | `weVp0MVGOU` |  | game keeps losing connection to the server but the game seems to still play, able to ink and play cards but cannot use characters abilities | matches non-engine surface |
| 2026-04-04 22:38 | `3f822X-cSE` |  | Cannot get rid of the authentication lost please refresh error. Have tried different devices different internet connection logging out and in and refreshing | matches non-engine surface |

### out-of-engine-scope (replay UI) (1) — Replay UI (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 02:14 | `8aNmUG8o6c` |  | Save Replay and Download replay buttons not working at the end of the game | matches non-engine surface |

### out-of-engine-scope (matchmaking) (4) — Matchmaking (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-04 06:07 | `LJjkHys5wj` | cheshire cat inexplicable, copper hound pup | Copper- Hound Pup will not resolve and ends up in an endless loop. The pop-up says no cards are available (even when the opponent has an almost full hand). T... | matches non-engine surface |
| 2026-04-26 04:39 | `Vku3gIUhLs` |  | Mobile version stuck at end of match won’t give option to return to matchmaking | matches non-engine surface |
| 2026-04-15 01:33 | `xp1gQk4ucj` |  | Not letting me back onto matchmaking | matches non-engine surface |
| 2026-04-08 14:21 | `TvpTGK9OzA` |  | opponent dc'd and i dont see a "return to matchmaking button" | matches non-engine surface |

### out-of-engine-scope (undo UX) (8) — Undo UX (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 23:26 | `kAbZSMCD9g` | luisa madrigal | Unable to select Luisa for her ability as the target. Forces me to pick another character on my board. Even then I still can't resolve by moving damage betwe... | matches non-engine surface |
| 2026-04-27 23:18 | `Cl5kbfxKpR` |  | unable to undo whole turne | matches non-engine surface |
| 2026-04-27 14:18 | `3Lq-Yz1SFq` | cinderella | Can't undo a move. Sang MMS with Cinderella and it didn't work. Then played Philip and I tried undoing it but it wouldn't work | matches non-engine surface |
| 2026-04-22 06:56 | `DZopjrkkqd` | prince phillip | game played my prince phillip and wouldn't undo to let me shift him | matches non-engine surface |
| 2026-04-20 07:46 | `PHQ9BeqSlQ` |  | wrong level doesn't explain which is option 1 and option 2 and if you use it wrong, undo won't undo using the card entirely, only half way. | matches non-engine surface |
| 2026-04-18 07:14 | `ds8JNpK1Sp` |  | Can't undo my turn completely | matches non-engine surface |
| 2026-04-16 04:26 | `ptPc9sxqqq` |  | Cannot undo when an action/ability has been used. example laid willow, triggered +1 strength to lady, hit undo to not lay willow and it would not let me beca... | matches non-engine surface |
| 2026-04-13 03:35 | `uct3LZgCAE` |  | Will not pop up for me to confirm an undo for opponent | matches non-engine surface |

### out-of-engine-scope (skip-ability UX) (9) — Skip/queue UX (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-15 18:06 | `ENdmvxnHxI` |  | Can't skip ability | matches non-engine surface |
| 2026-05-11 22:06 | `1649dELkLg` | syndrome out for revenge | Unable to skip effect of Got me Monologuing from Syndrome - Out for Revenge, no targets in discard and could not resolve effect or pass turn | matches non-engine surface |
| 2026-05-02 06:28 | `uLP9v6flbm` | goofy | When Goofy moves and his ability to move another character is triggered. Another character can be selected, but the location cannot be selected. Only clickin... | matches non-engine surface |
| 2026-04-28 07:19 | `L4RQOCh7_T` | roller bob | Cannot skip effect on Roller Bob - Sid's Toy and stuck on resolve screen | matches non-engine surface |
| 2026-04-25 08:13 | `hoUr9S7GKt` |  | When passing turn with new elenor card, it wouldn't let me pass turn at all even though the effect of her card couldn't work  No ability to skip effect or an... | matches non-engine surface |
| 2026-04-22 20:31 | `qillZINjZZ` | cheshire cat | Wrack it ralph with a boost did not kill opponent ISIS on 4 strength.  Cheshire cat can't resolve ability when opponent has no character, can not skip effect | matches non-engine surface |
| 2026-04-21 21:28 | `JcCMoKmGrs` |  | Won't let me skip effect | matches non-engine surface |
| 2026-04-18 17:12 | `Kvm6Ncwp8P` |  | Tips is not a required effect.  Skip effect is not working | matches non-engine surface |
| 2026-04-14 17:43 | `HI88mQN1LD` | belle, madam mim | belle accomplish mystic, i dont have decision to skip trigger. also same as madam mim, i don't have option to skip trigger | matches non-engine surface |

### out-of-engine-scope (client crash) (9) — Client crash (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-12 17:46 | `12kjwa8za6` |  | i think the bot boosted it's Chesire cat but had no means to use its ability and i think it crashed and wouldn't let me dismiss the bot so i had to concede | matches non-engine surface |
| 2026-05-11 02:53 | `LYYXvDy5Os` |  | Frozen can't ink a card? | matches non-engine surface |
| 2026-05-03 04:26 | `xnpRZGGGtj` | cheshire cat | Game froze on Cheshire | matches non-engine surface |
| 2026-04-28 22:13 | `08sXbsckWK` | the frozen vine monstrous plant | Have not been gaining lore from my location, should have lore from The frozen vine, have been at 9 lore for a while, even after questing. | matches non-engine surface |
| 2026-04-22 01:26 | `YuUAnkViq6` | cheshire cat | After playing the Cheshire Cat the bot crashed and didn't end it's turn. | matches non-engine surface |
| 2026-04-16 12:34 | `Tu9I5rhWXE` | elsa, elsa spirit of winter, freeze | Elsa Spirit of Winter isn't working correctly. Opponent has nothing on the board, when i play Elsa it still wants me to freeze and exert 2 characters when th... | matches non-engine surface |
| 2026-04-15 01:48 | `C-cYufhhvW` | cheshire cat | Cheshire cat trigger froze in Bot mode | matches non-engine surface |
| 2026-04-14 10:44 | `8siKmOSMQ3` | elsa, freeze | Big elsa, says exert and freeze up to one. Ward on the other side, won't let me skip the effect when I should be able to. I can't move the game on | matches non-engine surface |
| 2026-04-09 18:10 | `LDKbPI4jdK` | freeze | Goliath does not trigger draw card for the adverse player and is not affected by the « freeze » if the player has 3 cards in his hand at the beginning of the... | matches non-engine surface |

### out-of-engine-scope (timer) (4) — Turn timer (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-07 17:36 | `miKi1v0Sr4` | kida | Opponent's are not able to resolve Kida's FLOOD OF POWER ability. It causes them to time out and lose the game instead of being resolved. | matches non-engine surface |
| 2026-05-06 18:17 | `cYvQBPP5FG` |  | Time out due to Sid triggering and could not choose my own character to banish. | matches non-engine surface |
| 2026-05-06 16:34 | `ntGAVoPm3h` | be king undisputed | Be king undisputed wont let opponent choose a card. It makes it so they have to time out because they cant do anything. | matches non-engine surface |
| 2026-04-08 22:54 | `uLHKrmk8LD` |  | Am I missing something? Did i just wait 10  mins for his timer to run out so I cant actually drop him for being over on time? Where is the button to drop the... | matches non-engine surface |

### out-of-engine-scope (chat UX) (9) — Chat / free-text UX (out of engine scope)

| Created | id | Cards | Description | Rationale |
| --- | --- | --- | --- | --- |
| 2026-05-13 09:52 | `5JszXsQOH0` |  | the free text mode isn't there after the request | matches non-engine surface |
| 2026-05-12 02:03 | `JtkAAyrE9l` |  | The free chat doesnt allow any typing..... | matches non-engine surface |
| 2026-05-08 00:29 | `BCGjbrWQ3l` |  | There is no where to type when free text mode is enabled | matches non-engine surface |
| 2026-05-07 15:56 | `tdRX1OixFN` |  | Free chat is not working | matches non-engine surface |
| 2026-05-06 19:47 | `XvN8gzNsPY` |  | Text free chat (and the normal preset chat buttons) are not working. | matches non-engine surface |
| 2026-04-28 00:18 | `8zb3lc6xkm` |  | free chat enablement not really working. i requeted it, it popped up saying enabled, but is not really enabled | matches non-engine surface |
| 2026-04-27 18:40 | `zOi0nc2jvM` |  | My opponent is trying to request free chat, but when I hit accept, it will not allow us to connect and talk. | matches non-engine surface |
| 2026-04-26 22:42 | `AZwvn8W_u_` |  | cannot use Free Text mode anymore. opponnet accepted, but then there's no box to it | matches non-engine surface |
| 2026-04-23 18:50 | `YaAr3HZ6_a` | hades infernal schemer | Can't type into the text box after free chat was enabled. Will try rebooting client as Giratinna suggested. Game locked up when using Hades - Infernal Scheme... | matches non-engine surface |
