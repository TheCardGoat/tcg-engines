# Source scenario and evidence boundaries

Derived on 2026-09-13 from session
`01a099d5-3b8a-7842-9a14-7df4c2440b13`, titled
“You goal is to use the local simulator (submodules/agnostic…”.
The session was still active when inspected. This is a handoff of its scenario
and investigation patterns, not a claim that all repairs were completed.
Do not take over its live game or inherit its clean streak without an explicit
handoff and matching evidence. A new invocation starts its own run at zero.

## Requested scenario

Play full games in the local agnostic simulator through real point-and-click
controls. Plan both heroes' newly drawn hands, including attack, defense,
pitch, arsenal, and board resources. Fix discovered bugs after each game and
continue until three consecutive games have no rules, interaction, POM, or
log issues.

- Malice, Domina of the Dead: **Domina on my Corpse until I'm Dead**.
  [Supplied FaBrary list](https://fabrary.net/decks/01M23JMY0AY27JRGGJKYTRMS15).
- Viserai, the Forsaken: **Shadow Sun Kissed Technique - WIP, closer**.
  [Supplied FaBrary list](https://fabrary.net/decks/01KXRC4HN9QZ1SKVWPYYXV1290).
- Format: Classic Constructed. Preserve chosen equipment versus inventory;
  the exported arena list is not permission to equip every listed item.

At inspection, the shared checkout had fixture
`practice-matchup-malice-vs-viserai`, with deck IDs
`cc-2026-09-12-domina-on-my-corpse-malice` and
`cc-2026-09-13-shadow-sun-kissed-technique-viserai`, and seed
`fixture:malice-vs-viserai:1`.
These files were dirty and belong to ongoing work; verify them before reuse.
The original pasted list named blue Shadowrealm Strength. The session reported
using red after a printing check. Reverify and document that discrepancy in the
new run; do not silently claim an exact match to the original export.

## Current source entry points

Paths below are relative to the repository root. Recheck symbols before use.

| Concern                         | Entry point                                                                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Matchup IDs, decks, seed        | `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/flesh-and-blood/practice-matchup-fixtures.ts`                   |
| Setup, automation, seat control | `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/flesh-and-blood/Practice.page.tsx`                              |
| Reusable DOM POM                | `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/flesh-and-blood/testing/fab-simulator-pom.ts`                   |
| POM integration proof           | `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/flesh-and-blood/testing/fab-simulator-pom.integration.test.tsx` |
| Deck materialization            | `submodules/flesh-and-blood/packages/engine/src/automation/deck-text-fixtures.ts`                                                  |
| Bot advice/strategy dispatch    | `submodules/flesh-and-blood/packages/engine/src/automation/strategy-registry.ts` and `heuristic/` beside it                        |
| Paired strategy evaluation      | `submodules/flesh-and-blood/packages/engine/src/automation/bench/paired-evaluation.ts`                                             |
| FAB projection and interaction  | `submodules/agnostic-simulator/packages/flesh-and-blood/flesh-and-blood-server-adapter/src/`                                       |
| Authored cards / engine rules   | `submodules/flesh-and-blood/packages/cards/src/cards/` and `packages/engine/src/rules/`                                            |

The session used
`/flesh-and-blood/simulator/tests/practice-matchup-malice-vs-viserai?ai=off`
on a local preview. Discover the currently supported route and port. The old
5196 port and `run=2` cache-buster do not establish build identity or a new deal.

## What to carry forward

| Session observation                                                                                  | Reusable investigation lesson                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HMR erased an in-progress game's history                                                             | Treat reloads as invalidation; use a stable local build when the shared dev server cannot preserve a game.                                                                                                |
| Equipment clicks looked successful but defender count stayed unchanged                               | Verify staged selection and post-confirmation state; an action-panel workaround does not prove the board click works.                                                                                     |
| Ally-target combat looked stuck with no priority holder                                              | Check the interaction/defense actor and current rules before blaming legal-move generation.                                                                                                               |
| An optional effect had misleading zero-target controls                                               | Audit acceptance and decline separately, including the actual effect and next actor.                                                                                                                      |
| Cull, hero transformation, and transformed-face logs needed investigation                            | Trace the owner boundary and real authored-card regression; verify every affected seat and destination face.                                                                                              |
| Apparently duplicated Gates, banish triggers, and Decay counters were questioned and later explained | Consult exact text, errata and timing; retract mistaken bug reports and update the lesson explicitly.                                                                                                     |
| The latest commentary called an ally-damage on-hit trigger a defect                                  | Keep this **unresolved historical claim** until the exact trigger text and authoritative current definition of hit are checked. UI reminder text and earlier assistant certainty are not rules authority. |

No earlier match is certified clean by this reference. The retrieved session
ended mid-game 6 with an ongoing investigation. Fresh browser evidence is
required to establish the current simulator's behavior.
