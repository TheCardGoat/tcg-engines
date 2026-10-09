# One Piece Stage Behavior Inventory

Generated from the exported card catalog in canonical ID order. Re-running
`bun scripts/generate-card-behavior-queue.ts stage` preserves reviewed
verified evidence and unresolved gap notes, refreshes pending timing hints, and
reconciles catalog entries.

| Canonical ID | Card                                            | Status  | Behavior or next evidence                                                |
| ------------ | ----------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| EB01-011 | Mini-Merry | verified | Rested-Stage plus self-owned base-power Character payment, candidate filtering, attached-DON!! cleanup, deck-bottom movement, and draw |
| EB01-030 | Loguetown | verified | Ordered Stage-and-hand deck-bottom payment before draw 2; Life Trigger replaces the prior Stage and plays without DON!! payment |
| EB02-009 | Thousand Sunny | verified | Rested Stage activation and physical given-DON!! redistribution to one inclusive Straw Hat Crew Character target |
| EB02-041 | Merry Go | verified | Included Straw Hat Crew Leader On Play draw; rested Stage cost and temporary +2 cost on an included Character through the opponent's next turn |
| EB02-060 | Merry Go | verified | Rested Stage plus top-Life face-up payment; included Straw Hat Crew Character +1000 power through the opponent's next turn |
| EB04-010 | Lulucia Kingdom | verified | Paid Stage play sets power to zero with turn expiry and decline; opponent-turn aura uses base cost despite live cost reduction |
| OP02-024 | Moby Dick | verified | Dynamic low-Life turn power and Life Trigger play |
| OP02-048 | Land of Wano | verified | Paid filtered power boost, up-to DON!! attachment, and unpayable boundary |
| OP02-070 | New Kama Land | verified | Rest Stage, then Leader gate covers draw and both hand-trash choices |
| OP02-092 | Impel Down | verified | Paid reveal, eligible play, illegal candidate rejection, and remainder order |
| OP03-020 | Striker | verified | DON!! and Stage-rest costs, Leader gate, Event search, and remainder order |
| OP03-075 | Galley-La Company | verified | Leader-gated optional Stage rest and rested-DON!! reactivation |
| OP03-098 | Enies Lobby | verified | CP Leader branches, scoped power modifier, and Life Trigger play |
| OP04-096 | Corrida Coliseum | verified | Leader and trait gates with Character-only attack restriction |
| OP05-021 | Revolutionary Army HQ | verified | Paid inclusive Revolutionary Army search and ordered remainder |
| OP05-040 | Birdcage | verified | Both-player refresh prevention, cost boundary, and mandatory 10-DON!! cleanup |
| OP05-097 | Mary Geoise | verified | Celestial Dragons eligibility, cost floor, action availability, and duration |
| OP05-117 | Upper Yard | verified | Inclusive Sky Island search, excluded candidates, and remainder order |
| OP06-041 | The Ark Noah | verified | Cost-free Life Trigger play and automatic all-opponent rest |
| OP06-079 | Kingdom of GERMA | verified | Paid inclusive GERMA search and ordered remainder |
| OP06-098 | Thriller Bark | verified | Optional paid Leader-gated rested Character play from Trash |
| OP06-117 | The Ark Maxim | verified | Stage and filtered Enel rest costs, including the Leader; automatic cost-threshold K.O. sweep |
| OP07-058 | Island of Women | verified | Alternative exact and composite trait filtering in one target choice |
| OP07-117 | Egghead | verified | Either-owner filtered End Phase reactivation and Life Trigger play |
| OP08-020 | Drum Kingdom | verified | Dynamic exact-or-composite trait permanent power modifier |
| OP08-039 | Zou | verified | Paid Stage activation, post-cost Minks gate, DON!! and Character choices |
| OP08-056 | Moby Dick | verified | Controller-owned inclusive leave-field reaction, draw, hand placement, once-per-turn, and Life Trigger |
| OP09-021 | Red Force | verified | Paid post-cost Leader gate, filtered negative modifier, and duration |
| OP09-060 | Emptee Bluffs Island | verified | Ordered hand-to-deck and Stage-rest costs before post-cost Cross Guild draw |
| OP09-080 | Thousand Sunny | verified | Opponent-effect controller-owned trait reaction, optional Stage rest, and DON!! gain |
| OP09-099 | Fullalead | verified | Compound costs, inclusive Blackbeard Pirates search, and ordered remainder |
| OP10-021 | Punk Hazard | verified | Stage-rest cost, numeric DON!! source choice, and post-cost Caesar gate |
| OP11-117 | Fish-Man Island | verified | Shirahoshi activation gate, face-up Life cost, alternative traits, duration, and once-per-turn |
| OP12-080 | Baratie | verified | Self-to-deck cost, post-cost Sanji search gate, ordered remainder, and Life Trigger |
| OP13-022 | Windmill Village | verified | Command-driven activated Stage behavior and printed boundaries |
| OP13-078 | Oro Jackson | verified | Inclusive Roger Pirates leave-field reaction and once-per-turn DON!! choice |
| OP13-099 | The Empty Throne | verified | Non-selective 19-trash Leader boost; Stage and 3-DON!! rest costs; black inclusive Five Elders Character play with live DON!! cost ceiling |
| OP14-039 | Coffin Boat | verified | Dracule Mihawk identity gate, On Play draw, and controller-owned end-turn 0–1 rested-DON!! reactivation |
| OP15-057 | Dressrosa Kingdom | verified | Dressrosa Leader On Play draw; optional Stage-rest and Event-or-Stage discard before battle power; decline pays neither cost |
| OP16-021 | Moby Dick | verified | Private unfiltered look/add and ordered remainder; activation trashes Stage before rested DON assignment; payable decline |
| OP16-078 | Marineford | verified | Navy search and ordered remainder; activation returns DON and rests Stage before draw/discard; repeat rejected and decline preserved |
| OP17-057 | Fullalead | verified | Opponent-attack Stage rest and hand-trash payment boosts Rocks Character; payable decline keeps Stage active and hand intact |
| P-142 | Merry Go | verified | Optional Stage payment for battle and effect K.O.; base-power versus DON power, high-base and wrong-trait exclusions, retained Stage after decline |
| ST01-017 | Thousand Sunny | verified | Stage-rest activation; inclusive Straw Hat Crew Leader-or-Character candidates; exclusion, power, and duration boundaries |
| ST04-017 | Onigashima Island | verified | Optional Stage rest and Animal Kingdom Pirates Leader gate for rested DON addition; decline |
| ST06-017 | Navy HQ | verified | Separate On Play and Activate Main cost-minus-one targets; Navy Leader gate after rest, decline and expiry |
| ST07-017 | Queen Mama Chanter | verified | Stage-rest and Life payment before exact-cost-three Character-to-Life choice; face-up result, zero target and decline |
| ST14-017 | Thousand Sunny (Pirate Foil) | verified | On Play Leader power and permanent trait-based cost modifier with canonical default duration |
| ST31-005 | Thousand Sunny | verified | Top-five exact Straw Hat Character/Event search and saved bottom order; optional Stage-rest cost and rested DON to Luffy Leader/Character |

## Progress

- Canonical stages: 49.
- Verified rows: 49.
- Structured pending rows: 0.
- Printed but unstructured rows: 0.
- Canonical vanilla rows: 0.

Counts reflect current row labels, not a new semantic audit. See the October 7,
2026 audit checkpoint in `card-behavior-inventory.md` for confirmed corrections
and remaining limits.
