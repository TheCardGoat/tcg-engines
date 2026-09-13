# FAB Test Playbook archive (frozen through 2026-08-27)

Historical wave diaries from `/fab-tests` (W1–W3, G1-auth, EG-\*, and the
2026-08-27 closeout waves). Durable harness lessons live in `playbook.md`.
Engine families live in `packages/cards/scripts/card-coverage/gaps.json`. Open
this file only when debugging a specific past wave.

`[worktree]` entries below (campaign-lane `node_modules` repair) are obsolete.
Work in the shared checkout; `repair-worktree-links.sh` was removed 2026-08-27.

---

## Historical wave diary (through 2026-08-20)

## Fixture authenticity

- [fixture] Tests and visual fixtures must import real authored cards and use legal public moves; if no real card can demonstrate the case, record a coverage or engine gap instead of creating a trainer, placeholder, renamed clone, or borrowed-id stand-in — `AGENTS.md`, `.agents/skills/fab-test-generation/SKILL.md` (2026-08-20)

---

## Generic action AAA (2026-08-15)

- [draw] `draw` count `{ type: "count", what: "put-on-bottom-this-way" }` is a non-constant draw and throws on resolve — Sift R/Y/B prove the throw — `packages/cards/src/cards/UPR/actions/UPR197-sift-red.test.ts` (2026-08-15)
- [cost] destroy-target `cost eq { type: "x" }` still misses number binding `x` even with `play({ xValue })` — Ransack and Raze — `packages/cards/src/cards/PEN/actions/PEN327-ransack-and-raze-blue.test.ts` (2026-08-15)
- [status] `controlled-agility-this-turn` is unhandled has-status — Beat the Same Drum — `packages/cards/src/cards/SUP/actions/SUP219-beat-the-same-drum-blue.test.ts` (2026-08-15)
- [item] Action destroy-self activations (Imperial Seal) fail payment after `play` into arena; seat the item in `arena:` then `activate` — `packages/cards/src/cards/HNT/actions/HNT228-imperial-seal-of-command-red.test.ts` (2026-08-15)
- [unless] Pay Up steal-or-ping is `unless` + boolean: `resolveUntilIdle({ optionalBoolean: true, entityTargetCanonicalId })` after `playAttack` — `packages/cards/src/cards/HVY/actions/HVY208-pay-up-red.test.ts` (2026-08-15)
- [construct] Blossom of Spring is Chest, not Head — `packages/cards/src/cards/LSS/actions/LSS010-fabric-of-blossoms-blue.test.ts` (2026-08-15)
- [status] `less-life-and-fewer-equipment-and-tokens-than-them` still throws on attack — Down But Not Out stays gapped (2026-08-15)
- [sun-kiss] printed go again is Moon Wish-only; remodeled to `played-this` `name: "Moon Wish"` (do not add `played-card-named-moon-wish-this-turn` has-status) — `packages/cards/src/cards/ARC/actions/ARC212-sun-kiss-red.ts` (2026-08-15)
- [force-sight] Opt 2 is arsenal-only; a keyword `opt(2)` would Opt from hand — `packages/cards/src/cards/ARC/actions/ARC206-force-sight-red.ts` (2026-08-15)
- [plunder] Snatch on-hit draw stacks with Plunder's delayed draw; isolate with Brutal Assault and `closeCombat({ ordering: "listed" })` — `packages/cards/src/cards/ARC/actions/ARC170-plunder-run-red.test.ts` (2026-08-15)
- [prevention] unused RP resets on end-turn — seat Voltic Bolt as player A and seed Rusted Relic / Enchanting Melody on player B — `packages/cards/src/cards/ARC/actions/ARC163-rusted-relic-blue.test.ts` (2026-08-15)
- [item] Imperial Edict name-lock is public on a Royal seat; non-Royal `name-card` wait-state after `activate` is not `decision`/`priority` — `packages/cards/src/cards/DYN/actions/DYN240-imperial-edict-red.test.ts` (2026-08-15)
- [cost] Cash In 4 Copper / 2 Silver / 1 Gold alt-cost is a parser name-filter; prove pay 4{r} draw 2 — `packages/cards/src/cards/CRU/actions/CRU188-cash-in-yellow.test.ts` (2026-08-15)

## Deck-QA playlines

- [search] Moon Wish hit-search is optional min=0; `closeCombat({ entityTargets: "maximum" })` is required to tutor Sun Kiss — `packages/cards/src/cards/ARC/actions/ARC185-moon-wish-red.test.ts` (2026-08-15)

- [deck-qa] Dream Weavers refunds its Action AP; Phantasmaclasm still has no go again, so prove the one-shot phantasm strip on that attack and the next-turn Spears phantasm restore — do not invent a same-turn follow-up — `packages/engine/src/acceptance/deck-qa/illusionist-play-lines.test.ts` (2026-08-15)
- [deck-qa] Iris aura-weapon needs a second `passBoth` then `advanceCombatTo("defend")` before `missBlockAndClose`; Maximum Velocity after three boosts can close the game so skip `endTurn` when `hasGameEnded()` — `packages/engine/src/acceptance/deck-qa/illusionist-play-lines.test.ts`, `packages/engine/src/acceptance/deck-qa/mechanologist-play-lines.test.ts` (2026-08-15)
- [deck-qa] TE-E4 stays `deckTodo`: Singularity's hero+weapon+four-Evo Mechropotent transform and life retargeting is still the documented implementation gate — `packages/engine/src/acceptance/deck-qa/mechanologist-play-lines.test.ts` (2026-08-15)
- [deck-qa] Fang FA-03 `play(Enlightened Strike, { targetInstanceId })` is consumed as the attack target; pass `target: Defender.id` and let the move-to-deck additional cost auto-pick — `packages/engine/src/acceptance/deck-qa/assassin-play-lines.test.ts` (2026-08-15)
- [deck-qa] Fang FA-04 seated Overpower is WTR125 Reprise, not CR 8.3.22; Decimator halves the first non-equipment defender so a Snatch block is d1 when asserting leftover life — `packages/engine/src/acceptance/deck-qa/assassin-play-lines.test.ts` (2026-08-15)
- [deck-qa] Fang Instant prevention (Oasis/Shelter/Sigil) must seat Fang as player B, then `passPriorityTo` before `playInstant`/`activate` — `packages/engine/src/acceptance/deck-qa/assassin-play-lines.test.ts` (2026-08-15)
- [deck-qa] Braveforge is an Action activation: seed leftover AP after Decimator — `packages/engine/src/acceptance/deck-qa/assassin-play-lines.test.ts` (2026-08-15)
- [gap] F0 re-prove 2026-08-15: the 9 live architecture debts now have public AAA (Oasis source-of-choice, any-target opposing hero, Fang 2-vs-3 Fealty, steal EOT reclaim, Base N=2, Excessive Bloodloss Silver); `gaps.json` is empty of stale rows — `tools/parser/card-coverage/gaps.json` (2026-08-15)
- [keyword] Heave 8.3.18 puts the card face-up (`objectState.faceDown` is unset, not `true`) — `packages/cards/src/cards/EVR/actions/EVR024-thunder-quake-red.test.ts` (2026-08-15)
- [cost] Fang dagger discount is 3+ Fealty only: seat `hand: []` and `expectActivationRejected` (`insufficient_activation_assets`) at 0/2 Fealty + 0{r}; 3 Fealty opens combat at 0{r}; a seeded 1{r} is spent at 2 and left at 3. Omitted hand + `combat()?.open` after `activate` (no `passBoth`) is theater — `packages/cards/src/cards/HNT/heroes/HNT098-fang-dracai-of-blades.test.ts` (2026-08-15)
- [duration] `advance-turn` must emit `continuous-effect-ceased` (not silently drop this-turn instances) so steal/gain-control reclaim returns the item to its owner — `packages/engine/src/rules/reducers/assets-turn.ts`, `packages/cards/src/cards/SEA/actions/SEA249-undercover-acquisition-red.test.ts` (2026-08-15)
- [prevention] on-stack prevention `source` is collected as `${path}:source`; registration must pass `declaredKey: "source"` or it reads the shielded hero player-id — `packages/engine/src/rules/proposals/continuous-rule-effects.ts`, `packages/cards/src/cards/DRO/instants/DRO027-oasis-respite-red.test.ts` (2026-08-15)
- [prevention] Voltic Bolt Red deals 5 arcane; Oasis prevents 4 so 1 leaks, then the behind-on-life optional heals 1 — `packages/cards/src/cards/DRO/instants/DRO027-oasis-respite-red.test.ts` (2026-08-15)
- [prevention] `playAttack` stops at Defend — the attacker cannot `pass` there; arm a defender Instant with `advanceCombatTo("reaction")` then attacker `pass` — `packages/cards/src/cards/OUT/instants/OUT231-peace-of-mind-red.test.ts` (2026-08-15)
- [deck-qa] Keep tournament-deck QA cases in one class file (`wizard-play-lines.test.ts`, `brute-play-lines.test.ts`, …) so the signature line, hero line, and remaining `it.todo` contracts stay together — `packages/engine/src/acceptance/deck-qa` (2026-08-15)
- [deck-qa] This-turn prevention (Cloud Cover / Twinkle Toes) must be armed on the opponent's combat; seating the defender as player B keeps seeded RP for off-turn Mitts/Voltbound — `packages/engine/src/acceptance/deck-qa/wizard-play-lines.test.ts` (2026-08-15)
- [deck-qa] Flowstate `choose-and-create-token` still auto-picks Embodiment under public `choose`; OS-05/OS-H2 stay todo on split-card side declaration — `packages/engine/src/acceptance/deck-qa/wizard-play-lines.test.ts` (2026-08-15)
- [deck-qa] Created Gold is `token:gold` / `fabToken("gold")`; `activate(gold)` on the DYN243 catalog module cannot see the created token — `packages/engine/src/acceptance/deck-qa/warrior-play-lines.test.ts` (2026-08-15)
- [deck-qa] `must.pitch(...).activate(...)` does not consume staged pitch (only play verbs do); force a pitch with `play(..., { pitch })` at 0 leftover RP — `packages/engine/src/acceptance/deck-qa/warrior-play-lines.test.ts` (2026-08-15)
- [deck-qa] Trot's next base-≤3 go-again still does not bind the Cintari Saber proxy after Raise X=1, so KA-02's Sellsword continuation has no AP; Raise X=1 itself is public (KA-E4) — `packages/engine/src/acceptance/deck-qa/warrior-play-lines.test.ts` (2026-08-15)
- [deck-qa] Grains Vigor is start-of-next-turn +1{r} (TCC107); consume it after the turn cycle, then have the original attacker act — `packages/engine/src/acceptance/deck-qa/warrior-play-lines.test.ts` (2026-08-15)
- [deck-qa] `must.pitch().activate` does not consume staged pitch; paying Gauntlets via `paymentCanonicalId` on Jarl does not stamp pitched-this-way Earth/Ice, so JA-E1 stays todo — `packages/engine/src/acceptance/deck-qa/guardian-play-lines.test.ts` (2026-08-15)
- [deck-qa] Jarl's Ice-play Frostbite trigger sits under Blizzard: `passBoth` once for the token, then the Errata Bulletin #3 pay-escape boolean; 0{r} attackers get no boolean and lose go again immediately — `packages/engine/src/acceptance/deck-qa/guardian-play-lines.test.ts` (2026-08-15)
- [deck-qa] `resolveUntilIdle` after `activate` on Titan's Fist closes combat; use `passBoth` to assert attack power while the link is open — `packages/engine/src/acceptance/deck-qa/guardian-play-lines.test.ts` (2026-08-15)
- [deck-qa] After `playAttack`, `resolveUntilIdle` closes combat — assert intimidate/power first or skip a later `toDefend`; `advanceUntil("defend")` still needs `{ ordering: "listed" }` when Pulping/Rhinar trigger together — `packages/engine/src/acceptance/deck-qa/brute-play-lines.test.ts` (2026-08-15)
- [deck-qa] `firstPlayer: dash` keeps player-A seeded RP and the documented 4-card hand (no intellect restock) so Tuffnut can defend on Dash's turn — `packages/engine/src/acceptance/deck-qa/brute-play-lines.test.ts` (2026-08-15)
- [deck-qa] Beaten Trackers does not filter `discard.random`, and the RH-E1 hand has only random discards, so the chosen-discard contrast is not executable without changing the card — `packages/engine/src/acceptance/deck-qa/brute-play-lines.test.ts` (2026-08-15)
- [deck-qa] Scabskin Action spends 1 AP then grants `floor(roll/2)`; named seeds plus the committed `roll` event prove the public leftover AP, not private PRNG state — `packages/engine/src/acceptance/deck-qa/brute-play-lines.test.ts` (2026-08-15)
- [deck-qa] Deck-QA cases are grouped by class (`wizard-play-lines.test.ts`, `brute-play-lines.test.ts`, …); Vynnset empty-hand start-phase must seat her as player B (an end-turn intellect draw restocks the hand), and catalog Jittery Bones has no watery grave so Gravy replays a seated GY ally after the blue discard — `packages/engine/src/acceptance/deck-qa/runeblade-play-lines.test.ts`, `packages/engine/src/acceptance/deck-qa/pirate-play-lines.test.ts` (2026-08-15)
- [deck-qa] BR-02/BR-D4 stay todo on the split-card side-declaration gate; `must.play` does not take `playMethod` — `packages/engine/src/acceptance/deck-qa/runeblade-play-lines.test.ts` (2026-08-15)
- [deck-qa] After a reaction-step instant, `resolveUntilIdle` closes combat; assert Flittering go-again after `passBoth` then drain — `packages/engine/src/acceptance/deck-qa/runeblade-play-lines.test.ts` (2026-08-15)
- [deck-qa] Vynnset seated as player B loses seeded RP when player A ends the turn; pitch a blue for Invert after the start-phase cycle — `packages/engine/src/acceptance/deck-qa/runeblade-play-lines.test.ts` (2026-08-15)
- [deck-qa] Spellbound Creepers end-phase destroy at 0 arcane vs 1 bind did not fire; prove the AAC gate and once-per-turn instead — `packages/engine/src/acceptance/deck-qa/runeblade-play-lines.test.ts` (2026-08-15)
- [star] CR 1.7.5 star without `upTo` is all matching (Night's Embrace stealth attacks); printed "any number" must set `upTo: true` so Base of the Mountain can choose N=2 — `packages/engine/src/procedures/layer-resolution/find-decision.ts`, `packages/cards/src/cards/MPG/equipments/MPG113-base-of-the-mountain.ts` (2026-08-15)
- [deck-qa] Duplicate hand copies need `cardsIn(...)[n]` and Fai recover must not seat the same Flame in arsenal and graveyard — `packages/engine/src/acceptance/deck-qa/runeblade-play-lines.test.ts`, `packages/engine/src/acceptance/deck-qa/ninja-play-lines.test.ts` (2026-08-15)
- [deck-qa] `playAttack` under `FAB_MANUAL_HARNESS` stays on the layer so assert power only after `advanceCombatTo("defend")`, and keep a Fai chain open with `advanceCombatTo("resolution")` or Flame is a new first link at 0{p} — `packages/engine/src/acceptance/deck-qa` (2026-08-15)
- [deck-qa] Fai FI-02: put Enflame at link 2 (its 3+ Draconic grant is an at-resolution target) and fully block Dance (2× Snatch) so the dagger optional never fires; Lava Burst rupture is 5{p} only while that same chain stays open; close with `resolveUntilIdle({ ordering: "listed" })` — `packages/engine/src/acceptance/deck-qa/ninja-play-lines.test.ts` (2026-08-15)
- [deck-qa] Pouncing Paws creates `token:crouching-tiger` in banished; accept the play-this-turn optional then `playInstance` that token id — catalog `crouchingTiger` is a different canonical id — `packages/engine/src/acceptance/deck-qa/ninja-play-lines.test.ts` (2026-08-15)
- [deck-qa] Blade Beckoner Guardwell, Glint/Reprise Saber math, and Dawnblade star-remove of +1{p} counters now execute; `powerCounterTotal: N` must seed N × +1{p} (value 1, count N) or Dawnblade end-phase remove finds nothing — `packages/engine/src/acceptance/deck-qa` (2026-08-13)
- [continuous] play+attack of the same instance is one `appliesTo.next` slot (ignore incarnation); a missing `attack` field must not consume a second ordinal — `packages/engine/src/rules/continuous/subject-key.ts` (2026-08-13)
- [continuous] `appliesTo.next` with `defending: true` observes `defend` events, not play+attack — Toughness — `packages/engine/src/acceptance/tokens/toughness-token.test.ts` (2026-08-13)
- [keyword] card-layer go again: printed keyword follows the live object (Spinal Crush); ability `layerKeywords` still refunds (Bloodrush 6+) — `packages/engine/src/rules/effect-event-proposals.ts` (2026-08-13)
- [deck-qa] omitted `appliesTo.events` defaults to play+attack (not activate); next-weapon latch stores the attack-proxy so Valor +3 / Trot go-again do not leak onto a later swing of the same weapon — `packages/engine/src/rules/grant-property-next-latch.test.ts` (2026-08-13)
- [deck-qa] CR 1.7.5 `allowRepeat` applies once per declared pick (not unique mode id); star-destroy `upTo` defaults to 0 so N>0 Copper needs `begin-play` + cost targets; a second 1H Saber (or seated Snatch) is the no-leak later attack — `packages/cards/src/cards/EVR/actions/EVR055-blood-on-her-hands-yellow.test.ts` (2026-08-13)
- [continuous] `appliesTo.attacksOf: true` latches every attack-proxy of the targeted source (not all 1H weapons); `gain-keyword` is the “got go again” observation, distinct from CR 8.3.5 `go-again` AP refund; static abilities may be modal — `packages/types/src/abilities/index.ts` (2026-08-13)
- [continuous] static “this card's attacks” is `attacksOf` on the static effect (source instance bound at generate); resolution “target weapon's attacks” uses the same flag on the declared weapon — `packages/cards/src/cards/KSU/weapons/KSU003-harmonized-kodachi.ts` (2026-08-13)

## The trio — what every card test must cover

The project's PROVEN gate (see `docs/fab-*-acceptance-status.md`): a clause is proven by
a dedicated public AAA scenario using real catalog cards and legal moves.

- [trio] every card test carries three cases — happy path (printed result) + boundary (negative/contrasting/illegal) + timing/interaction (when material) §3 (2026-08-12)
- [trio] a good boundary is the _contrasting_ case: the cost-2 attack does NOT get dominate, two Evos do NOT grant overpower — `packages/cards/src/cards/BVO/heroes/BVO002-bravo.test.ts` (2026-08-12)

## Intent verbs (2026-08-13)

- [intent] prefer `playAttack` / `activateAttack` / `closeCombat` / `untilIdle` / `decline` / `choose` / `target` over `passBoth` + `advanceCombatTo` folklore — `packages/engine/src/testing/intent.ts` (2026-08-13)
- [intent] mid-combat assertion between the on-attack layer and damage: `playAttack(..., { stopAt: "on-attack" })` → `target(...)` → `game.advanceUntil({ stopAt: "defend" })` resolves the on-attack layer while keeping combat open (no `passBoth`) — `packages/cards/src/cards/ELE/actions/ELE073-arcanic-shockwave-red.test.ts` (2026-08-13)
- [intent] known gaps that still require legacy drains: (a) Opt surfaces a `partition` decision `FabDrainPolicy` cannot auto-answer → keep `resolveUntilIdle` (foreboding bolt); (b) no intent-verb stop for the combat "resolution" step → keep `advanceCombatTo("resolution")` (DYN090 / KAT014 timing); (c) opponent-forced choices (`chooseTargets`) are not controller intent verbs → keep legacy (DYN090) — `packages/engine/src/testing/intent.ts` (2026-08-13)
- [arrange] omitted `hand` seats DEFAULT*HAND (3× Browbeat Blue + Enlightened Strike), same as `hand: "filler"`; write explicit `hand: []` to opt out (empty-hand RP default is 3). *(Supersedes the 2026-08-13 "omitted hand is empty" note — that flip broke end-turn intellect draw + RP defaults and was reverted.)\_ — `packages/engine/src/testing/test-fixtures.ts` (2026-08-13)

## Arrange — preconditions & harness config

- [arrange] seed only the preconditions the printed clause needs; minimal hand/deck/zones keeps failures legible — `packages/cards/src/cards/EVO/actions/EVO055-terminator-tank-red.test.ts` (2026-08-12)
- [arrange] use `FAB_MANUAL_HARNESS` when asserting state the harness would auto-resolve away (pre-payment cost, on-declaration power, pitch order, optional reload) — `packages/engine/src/testing/harness-config.ts` (2026-08-13)
- [arrange] smart defaults are ON — autoPitch covers unpaid costs, autoPassPriority passes only when no non-pass action is legal; opt out explicitly only when testing those mechanics — `packages/engine/src/testing/harness-config.ts` (2026-08-12)
- [arrange] do not seat Briar as the Snatch attacker — her first-AAC-damage Earth token asks an ordering decision that `resolveUntilIdle` cannot auto-answer — `packages/cards/src/cards/WTR/actions/WTR167-snatch-red.test.ts` (2026-08-13)
- [arrange] prefer `resourcePoints` seeding over pitching when you only need payment and don't want pitch side-effects — `packages/engine/src/testing/rules-aaa.ts` (`playResolve`) (2026-08-12)
- [arrange] DEFAULT_HAND includes a slim Enlightened Strike that overwrites full module abilities when the opponent omits `hand:` — always set explicit `hand: []` (or a full catalog hand) when seating that card — `packages/cards/src/cards/WTR/actions/WTR159-enlightened-strike-red.test.ts` (2026-08-13)
- [arrange] seed marked-hero hits with `marked: true` on player B; do not seat Arakni Marionette as that attacker — her stealth-vs-marked +1{p} inflates printed power — `packages/cards/src/cards/HNT/actions/HNT032-mark-of-the-black-widow-red.test.ts` (2026-08-13)
- [status] `banished-another-card-with-same-color` reads the source's turn ledger (Errata Bulletin #9: first banish does not gain {h}) — `packages/cards/src/cards/MST/actions/MST109-bonds-of-attraction-red.test.ts` (2026-08-15)
- [status] `played-or-activated-N-or-more-attack-reactions-this-chain-link` counts play+activate on the open link — Bonds of Agony / Double Trouble — `packages/engine/src/game/combat.ts` (2026-08-15)
- [status] `put-card-into-arsenal-this-way` / `2-or-more-cards-put-into-arsenals-this-way` stamp on move-card→arsenal; `drawn-this-way` accumulates on draw events — Codex / Concoct / Tectonic (2026-08-15)
- [status] `this-is-defending` still throws on activate quote — Rally the Coast Guard discard-for-+3{d} stays gapped; prove printed attack and 2{d} block — `packages/cards/src/cards/SEA/actions/SEA223-rally-the-coast-guard-red.test.ts` (2026-08-15)
- [duration] `during-own-next-end-phase` is not in `continuousDurationSupported`; Ten Foot Tall attacks throw until remodeled to `until-end-of-own-next-turn` — `packages/cards/src/cards/ROS/actions/ROS217-ten-foot-tall-and-bulletproof-red.ts` (2026-08-15)
- [status] `been-booed-this-turn` still throws — Mocking Blow / Big Bully stay gapped (2026-08-14)
- [status] `in-your-banished-zone` still throws on activate quote — Guardian of the Shadowrealm's banished return is gapped; prove the 6{d} DR and Blood Debt instead — `packages/cards/src/cards/MON/defense-reactions/MON192-guardian-of-the-shadowrealm-red.test.ts` (2026-08-15)
- [status] `the-attacking-hero-drawn-2-or-more-cards-this-turn` throws on Hold the Line resolution — `packages/cards/src/cards/DTD/defense-reactions/DTD228-hold-the-line-blue.test.ts` (2026-08-15)
- [status] condition-form `defended-by-action`, `card-put-into-your-banished-this-turn`, `power-greater-than-revealed-card`, and `attacking-or-on-the-stack` still throw; prove the throw / printed attack, do not half-fix — Feisty Locals / Tremor / Crash Down / Step Between (2026-08-15)
- [status] condition-form `attacking` does not satisfy Instant activate-while-attacking (filter-form only); Firebreathing / Exude prove printed power + `activation_condition_failed` — `packages/cards/src/cards/EVR/actions/EVR157-firebreathing-red.test.ts` (2026-08-15)
- [status] Instant item activate-conditions (`played-2-or-more-same-name-this-turn`, `havent-played-or-activated-this-turn`, `hero-targeted-by-lethal-or-more-damage`, `card-entered-graveyard-this-turn`) throw from `activate()`, not `expectActivationRejected` — `packages/cards/src/cards/EVR/actions/EVR177-amulet-of-echoes-blue.test.ts` (2026-08-15)
- [item] High Striker + Snatch hit needs `closeCombat({ ordering: "listed" })` (Copper create vs on-hit draw); created Copper is `token:copper` — `packages/cards/src/cards/EVR/actions/EVR164-high-striker-red.test.ts` (2026-08-15)
- [choice] Pick a Card / Talisman of Cremation `name-card` is an unsupported effect-resolution; under `FAB_MANUAL_HARNESS` play then `passBoth` to see the decision, do not `resolveUntilIdle` — `packages/cards/src/cards/EVR/actions/EVR167-pick-a-card-any-card-red.test.ts` (2026-08-15)
- [combat] default `playAttack` + `defendWith` auto-closes the link; assert post-block power with `FAB_MANUAL_HARNESS`, `play` + `passBoth` + `advanceCombatTo("defend")` — `packages/cards/src/cards/MON/actions/MON284-stony-woottonhog-red.test.ts` (2026-08-15)
- [keyword] DR "when this defends an attack, it gets -N{p}" binds the defended attack via `observedObject: "defended-attack"` + `binding: "it"`, not `selector: "self"` — `packages/cards/src/cards/PEN/defense-reactions/PEN331-drag-down-red.ts` (2026-08-15)
- [combat] intimidate resolves on attack and removes a hand card before Defend — do not name that card as a later blocker; assert the face-down banish while the link is still open — `packages/cards/src/cards/WTR/actions/WTR006-alpha-rampage-red.test.ts` (2026-08-14)

## Act — public moves only

- [act] drive the game with fluent verbs (`attackWith`/`defendWith`/`play`/`activate`/`pass`) or `game.helpers.*`; never call private runtime methods to make an outcome happen — `packages/engine/src/testing/player-fluent.ts` (2026-08-12)
- [act] staged payment uses the chainable surface: `handle.must.pitch(card).playAttack(card)` — `packages/engine/src/testing/player-fluent.ts` (2026-08-12)
- [act] `must.activate` does not drain a destroy-aura cost; `activate()` auto-answers the sole forced aura then `resolveUntilIdle` resolves gain {r} / go again — `packages/cards/src/cards/AUA/equipments/AUA004-bloodtorn-bodice.test.ts` (2026-08-15)
- [act] `rules-aaa.ts` composites are engine-internal (relative-path import), not in the public testing barrel — don't import them from `packages/cards` — `packages/engine/src/testing/index.ts` (2026-08-12)
- [harness] `testing/index.ts` re-exports `rules-aaa.ts`; that module must import Bravo/Dash/Nimblism from catalog modules, not `rules/fixtures.ts`, or card AAA tests load the engine barrel through production rules/ — `packages/engine/src/testing/rules-aaa.ts` (2026-08-14)

- [combat] a granted "when this attacks" on the next sword latches in the same attack window; after `activate`+`passBoth` the triggered layer sits on the stack and a second `passBoth` is required before the `wager` event commits — `packages/cards/src/cards/AOL/actions/AOL026-odds-on-favorite-blue.test.ts` (2026-08-13)
- [combat] Dawnblade Resplendent's second-attack +1{p} is a triggered layer: after the second `activate`+`passBoth`, pass again before asserting attack power 3 — `packages/cards/src/cards/DVR/weapons/DVR002-dawnblade-resplendent.test.ts` (2026-08-13)
- [choice] closed-list `choose-option` is an `effect-resolution` decision (option ids are the printed names); after `advanceToDecision(..., "boolean")` + `chooseBoolean(true)` the name list stays pending — do not `resolveUntilIdle` through it — `packages/cards/src/cards/KAT/actions/KAT014-be-like-water-red.test.ts` (2026-08-13)

## Combat sequencing

- [combat] CR 7 Layer snapshots must use `play()` + `FAB_MANUAL_HARNESS`; `attackWith` auto-advances to Defend so it cannot prove “open + Layer + stack attack + no active link” — `packages/engine/src/rules/docs/comprehensive-rules/07-combat-lifecycle.test.ts` (2026-08-16)
- [combat] the engine has no public attack-queue: Layer pass/pass atomically creates chain link 1 at Attack Step — assert `activeLink` / `combatChain` rather than a queue array — `packages/engine/src/rules/docs/comprehensive-rules/07-combat-lifecycle.test.ts` (2026-08-16)
- [combat] CR 7.7.3 would clear leftover attack/reaction layers when Close begins; forcing Close (7.7.2c) currently stamps `step:"close"` with no priority and leaves a stacked Defense Reaction in place — `packages/engine/src/rules/docs/comprehensive-rules/07-combat-lifecycle.test.ts` (2026-08-16)

- [combat] after `attackWith`, use `game.advanceCombatTo("defend")` before `defendWith` — two `passBoth()` calls often leave you off the Defend Step — `packages/cards/src/cards/MON/actions/MON101-spears-of-surreality-red.test.ts` (2026-08-13)
- [combat] `game.combat()` is `null` when closed, not `undefined` — `packages/cards/src/cards/MON/actions/MON101-spears-of-surreality-red.test.ts` (2026-08-13)
- [combat] `game.helpers.resolveRestOfCombat()` closes an open link from Defend through damage/hit/close in one call — prefer it over manual passes for happy paths — `packages/engine/src/testing/rules-aaa.ts` (2026-08-12)
- [combat] assert on-declaration attack power and keywords at `game.combat()?.activeLink?.attackPower` / `.keywords` BEFORE `resolveRestOfCombat()` — `packages/cards/src/cards/EVO/actions/EVO055-terminator-tank-red.test.ts` (2026-08-12)
- [combat] `resolveUntilIdle()` closes combat (`game.combat()` is then `null`); resolve an on-attack reveal/power trigger with `passBoth()` and assert while the link is still open — `packages/cards/src/cards/ARC/actions/ARC191-ravenous-rabble-red.test.ts` (2026-08-13)
- [combat] combat-chain-close banish/create/gain-life filters on deck/hand/arsenal must use owner/zone-player for `lost-life-this-turn` (those seats have null controllerId) — `packages/cards/src/cards/DTD/actions/DTD139-widespread-ruin-red.test.ts` (2026-08-13)
- [combat] Blizzard pay-escape is a `boolean` decision for the attacking hero; answer with `Hero.chooseBoolean(true)` while the link is open — `resolveUntilIdle` would close combat first — `packages/cards/src/cards/ELE/instants/ELE147-blizzard-blue.test.ts` (2026-08-13)
- [keyword] delayed "deal damage to any target" needs `player:"any"` + `declared:"at-resolution"`; default object scan is controller-only and will self-hit — `packages/cards/src/cards/ROS/actions/ROS010-arc-lightning-yellow.test.ts` (2026-08-13)
- [act] modular re-equip: `activate(card, { equipToZone: "head" })` then `resolveUntilIdle()` — `packages/cards/src/cards/SUP/equipments/SUP253-adaptive-alpha-mold.test.ts` (2026-08-13)
- [equipment] Off-Hand seats in `weapon2` (Stalagmite / Rampart / Testament); defend triggers still fire from that slot — `packages/cards/src/cards/EVR/equipments/EVR018-stalagmite-bastion-of-isenloft.test.ts` (2026-08-14)
- [equipment] Vest of the First Fist + Snatch on-hit draw need `resolveUntilIdle({ optionalBoolean, ordering: "listed" })` — `packages/cards/src/cards/ARC/equipments/ARC152-vest-of-the-first-fist.test.ts` (2026-08-15)
- [equipment] Gambler's Gloves reroll is an `option` (use `optionalOptions`), not a boolean — `packages/cards/src/cards/CRU/equipments/CRU179-gambler-s-gloves.test.ts` (2026-08-15)
- [equipment] Silversheen Needle grants go again on the seated Fabric construct but does not refund play AP; prove the keyword, gap the refund — `packages/cards/src/cards/LSS/equipments/LSS009-silversheen-needle.test.ts` (2026-08-15)
- [equipment] Vambrace of Determination has no printed base Blade Break — only the paid defend grant; decline leaves it seated — `packages/cards/src/cards/OUT/equipments/OUT174-vambrace-of-determination.ts` (2026-08-15)
- [equipment] Bandana of the Blue Beyond still activates with no blue in GY (at-resolution target); prove the recycle no-op, do not expectActivationRejected — `packages/cards/src/cards/SEA/equipments/SEA179-bandana-of-the-blue-beyond.test.ts` (2026-08-15)
- [equipment] weapon-hit optionals (destroy this for go again / pay {r} for Vigor): activate weapon, close to hit, then `resolveUntilIdle({ optionalBoolean: true })` — `packages/cards/src/cards/TEA/equipments/TEA007-refraction-bolters.test.ts` (2026-08-14)
- [combat] reaction priority starts with the turn player (attacker); `advanceCombatToReaction()` advances without passing them — `packages/engine/src/testing/rules-aaa.ts` (2026-08-12)
- [combat] an `appliesTo.next` buff whose `typeBox` omits `types:["Action"]` (subtype-only, e.g. Axe/Dagger) applies to a WEAPON attack — when no matching attack-action recipient exists (catalog has zero Axe attack-actions; the only Dagger attack-action is Assassin-only), equip the weapon via `weapon1:[w]`, declare with `Hero.activate(w); game.passBoth();`, and assert `game.combat()?.activeLink?.attackPower` (base `power` + N) — `packages/cards/src/cards/DYN/actions/DYN082-felling-swing-red.test.ts` (2026-08-12)

## Defense reactions & reaction priority

- [reaction] defense reactions need reaction priority as the **defender** — use `advanceToReactionAsDefender()` before `playDefenseReaction()` — `packages/engine/src/testing/rules-aaa.ts` (2026-08-12)
- [reaction] `playDefenseReaction()` walks passes until the DR resolves onto the active link; throw on a persisted decision — `packages/engine/src/testing/rules-aaa.ts` (2026-08-12)
- [reaction] attacker ARs: activate/playAttack → `advanceCombatTo("reaction")` → `playReaction` → `passBoth`, then assert `expectCombat(game)` — `packages/cards/src/cards/HVY/attack-reactions/HVY101-blade-flurry-red.test.ts` (2026-08-13)
- [reaction] `playAttack` under `FAB_MANUAL_HARNESS` has no `expectCombat` power until `advanceCombatTo("reaction")` — do not assert base power immediately after `playAttack` — `packages/cards/src/cards/AAC/attack-reactions/AAC028-night-s-embrace-blue.test.ts` (2026-08-14)
- [reaction] Unmovable Yellow's play-from-arsenal trigger needs a second `passBoth()` after `play(..., { from: "arsenal" })` before `toHaveDefense` — `packages/cards/src/cards/WTR/defense-reactions/WTR213-unmovable-yellow.test.ts` (2026-08-14)
- [reaction] `typeBox.subtypes:["Attack"]` does not match weapon-attack proxies; use an attack action as the attacking card when the AR says "target attack" — `packages/cards/src/cards/HVY/attack-reactions/HVY111-fatal-engagement-blue.test.ts` (2026-08-13)
- [reaction] Blade Runner / 1H weapon targeting: Cintari Saber CRU079 is fixture-legal; Dawnblade (2H) is the contrasting illegal target — `packages/cards/src/cards/EVR/attack-reactions/EVR062-blade-runner-blue.test.ts` (2026-08-13)
- [target] omitted `player` on public/shared zones (hero, permanent, combat-chain, stack) scans every seat — Shred defending cards and "any target" arcane sit on the opponent's zone lists — `packages/cards/src/cards/DYN/attack-reactions/DYN130-shred-red.test.ts` (2026-08-13)
- [keyword] `hasKeyword:"contract"` matches the Contract label (CR 8.4.7), not only combo/crush — `packages/cards/src/cards/DYN/attack-reactions/DYN148-cut-to-the-chase-red.test.ts` (2026-08-13)
- [reaction] Razor Reflex mode 2 grants on-hit go again; Snatch's native on-hit draw then needs `resolveUntilIdle({ ordering: "listed" })` — `resolveRestOfCombat()` throws for the ordering decision — `packages/cards/src/cards/TEA/attack-reactions/TEA016-razor-reflex-red.test.ts` (2026-08-13)
- [reprise] CR 8.4.3 Reprise _instead_ is CR 6.4.7 self-replacement on the same resolution ability (one declared weapon-attack target). Do not emit `instead: true` or fold a second static in the engine — `packages/cards/src/cards/WTR/attack-reactions/WTR124-overpower-yellow.ts` (2026-08-15)
- [reprise] Cintari Saber +1{p} when defended by an attack action stacks on Overpower; a Snatch-block reprise is saber 2 + 1 + instead amount, not base + instead — `packages/cards/src/cards/WTR/attack-reactions/WTR124-overpower-yellow.test.ts` (2026-08-15)
- [instead] Class B same-layer amount swaps are `self-replacement` of the preceding modify-numeric (same declared target / `appliesTo.next`), not `instead: true` — Auric holo +4 and Bonebreaker beaten-chest +5 — `packages/cards/src/cards/AZS/instants/AZS015-auric-shards-red.test.ts` (2026-08-15)
- [replacement] "you may play it this turn" is a this-turn play permission, not an optional to grant the permission; Trap-Door's GY→banish is a this-turn `replacement` on the bound trap. Prove it with a 0-cost DR trap after combat close, not Anaphylactic Shock's untargeted lose-life — `packages/cards/src/cards/HNT/actions/HNT013-under-the-trap-door-blue.test.ts` (2026-08-15)
- [heave] CR 8.3.18 Heave puts the card **face-up** into arsenal (not face-down); assert arsenal + arena count immediately after `chooseTargets` — `resolveUntilIdle` walks into the next action phase and the surges self-destroy — `packages/cards/src/cards/EVR/actions/EVR024-thunder-quake-red.test.ts` (2026-08-13)

## Assert — rule-visible only

- [assert] assert rule-visible state only (life, zone contents, activeLink, keywords, counters); never logs, model shape, or private fields — `packages/cards/src/cards/BVO/heroes/BVO002-bravo.test.ts` (2026-08-12)
- [assert] prefer fluent asserts: `expectFabPlayer(h).toHaveLife(n)`, `expectFabCard(h, card).toHaveKeyword(kw)/toBeIn(zone)/toHavePower(n)/toHaveDefense(n)` — `packages/engine/src/testing/fluent-assert.ts` (2026-08-13)
- [cost] optional additional-resource playEffects present a Pay/Decline option; `resolveUntilIdle({ optionalBoolean })` now maps that to pay/decline, but it also auto-passes combat — assert on-chain defense BEFORE `resolveUntilIdle`, or answer the option and pass onto the link yourself — `packages/cards/src/cards/WTR/defense-reactions/WTR051-staunch-response-red.test.ts` (2026-08-13)
- [cost] extra play-cost surcharges (Authority of Ataya +1{r} on opponent DRs) are proven by leftover RP after `must.playReaction`, or by `playReaction` throwing at 0 RP; do not assert `toBeIn("combatChain")` after `resolveUntilIdle` — `packages/cards/src/cards/SUP/resources/SUP000-authority-of-ataya-blue.test.ts` (2026-08-14)
- [block] defend-optional “reveal a crush card, create Seismic Surge”: `defendWith` then `resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" })`; created surge is `token:seismic-surge` — `packages/cards/src/cards/MPG/blocks/MPG109-crash-and-bash-red.test.ts` (2026-08-14)
- [cost] `play()` auto-declines Hurl-style optional additional {r} unless you pass `modeIds: ["pay"]` (or `["decline"]`); after pay, the granted on-attack any-hero still needs `chooseTargetPlayers(opponent)` — `packages/cards/src/cards/ARA/actions/ARA007-hurl-red.test.ts` (2026-08-13)
- [keyword] "target dagger you control" is `player:"controller"` plus `zones:["weapon","permanent","combat-chain"]` with `outputBinding:"it"` on deal-damage — combat-chain-only misses an unused equipped dagger — `packages/cards/src/cards/HNT/actions/HNT017-bite-red.ts` (2026-08-13)
- [keyword] Pain in the Backside's on-hit dagger ping is the same dagger scan as Bite; binding `it` then set-status hit — `packages/cards/src/cards/HNT/actions/HNT174-pain-in-the-backside-red.ts` (2026-08-15)
- [token] Codex "create Ponder under you and X under each opponent" is a sequence of two create-token leaves, not a malformed token id — `packages/cards/src/cards/OUT/actions/OUT159-codex-of-bloodrot-yellow.ts` (2026-08-15)
- [assert] `expectCombat(game)` IS exported from the public testing barrel (`toHaveAttackPower` / `toHaveKeyword` / `toBeAtStep`); there is no `expectFabCombat` alias — `packages/engine/src/testing/fluent-assert.ts` (2026-08-13)
- [assert] −1{d} counters are a signed total — `toHaveDefenseCounters(-1)`, not `1` — `packages/cards/src/cards/AJV/actions/AJV018-crumble-to-eternity.test.ts` (2026-08-13)
- [assert] keyword names are kebab-case (`blade-break`), not camelCase — `packages/cards/src/cards/BVO/equipments/BVO005-ironrot-plate.test.ts` (2026-08-13)
- [aura] played auras sit in `arena`, not a `permanent` zone alias — `packages/cards/src/cards/BVO/actions/BVO012-emerging-power-red.test.ts` (2026-08-13)
- [crush] crush equipment-target after damage: `resolveUntilIdle({ entityTargets: "minimum" })` then `toHaveDefenseCounters(-1)` — `packages/cards/src/cards/BVO/actions/BVO008-buckling-blow-red.test.ts` (2026-08-13)
- [crush] Spinal/Cranial use `during-their-next-action-phase` (lose+can't-gain go again / can't draw). The window stays alive through the turn change and applies only on the crushed hero's next action phase — `packages/cards/src/cards/WTR/actions/WTR044-spinal-crush-red.test.ts` (2026-08-13)
- [status] `same-name-as-card-in-defending-heros-banished` is unhandled has-status — Regicide hit-Royal / chain-close lose-game are public; record a gap for the defend restriction — `packages/cards/src/cards/DYN/actions/DYN121-regicide-blue.test.ts` (2026-08-13)
- [status] `card-with-cost-3-or-greater-card-in-pitch-zone` and `would-be-put-into-graveyard-from-anywhere` still throw — Blessing of Deliverance / Drone of Brutality stay `it.todo` (2026-08-13)
- [status] `completed-contract-this-way` still throws on resolution — Coercive Tendency — `packages/cards/src/cards/HVY/attack-reactions/HVY246-coercive-tendency-blue.test.ts` (2026-08-14)
- [status] `aura-you-control-was-destroyed-this-turn` stamps destroy of Aura types/subtypes onto the aura's controller — Ominous Aggression/Respite/Excavation — `packages/engine/src/kernel/transaction-kernel.ts` (2026-08-15)
- [continuous] Flying High go-again latches `appliesTo.next`; the color +1{p} is a consume-on-use delayed attack trigger so a non-matching first attack still consumes it — `packages/cards/src/cards/SEA/actions/SEA206-flying-high-red.ts` (2026-08-15)
- [keyword] Agility/Might next grants use `events:["attack"]` so Nimblism cannot consume them — `packages/cards/src/cards/HVY/tokens/HVY240-agility.ts` (2026-08-15)
- [keyword] Zealous Belting go again is while-static only; pitch a higher-power card to prove leftover AP — `packages/cards/src/cards/MON/actions/MON293-zealous-belting-red.test.ts` (2026-08-15)
- [status] `from-own-or-attack-reaction-effects` is unhandled — Snag's restrict gain-power is untestable; prove the 0-cost instant to GY — `packages/cards/src/cards/CRU/instants/CRU182-snag-blue.test.ts` (2026-08-15)
- [replacement] gain-{h} → lose-that-much is not a canonical replacement shape (`supportedCanonicalReplacement` rejects it) — Poison the Well stays on the stack — `packages/cards/src/cards/DTD/instants/DTD231-poison-the-well-blue.test.ts` (2026-08-15)
- [counter] `remove-all-counters` only clears named stacks; seed `namedCounters` (not `powerCounterTotal`) to prove Destructive Tendencies — `packages/cards/src/cards/PEN/instants/PEN328-destructive-tendencies-blue.test.ts` (2026-08-15)
- [status] `been-booed-this-turn` still throws when playing Mocking Blow — prove Kayo Underhanded Cheat's Instant on Snatch and Vigor via Concealed Object — `packages/cards/src/cards/SUP/heroes/SUP063-kayo-underhanded-cheat.test.ts` (2026-08-14)
- [hero] unused `resourcePoints` reset when the opponent ends the turn; adult Valda cannot spend p2-seeded RP on her following crush — `packages/cards/src/cards/MPG/heroes/MPG001-valda-seismic-impact.test.ts` (2026-08-14)
- [assert] +1{p} counters on a ward aura with no printed power: `toHaveCounters(N)`, not `toHavePower` (undefined) — `packages/cards/src/cards/MST/actions/MST134-astral-etchings-red.test.ts` (2026-08-14)
- [aura] suspense leave-arena “next attack this turn”: seed in arena (2 counters), two start-of-turn ticks, then attack that same turn — `packages/cards/src/cards/APS/instants/APS012-edge-of-their-seats-red.test.ts` (2026-08-14)
- [crush] `until-end-of-next-turn` + `appliesTo.next` ordinal-1 does not latch extra cost or −2{p} onto the crushed hero's next action/attack — `packages/cards/src/cards/BVO/actions/BVO009-cartilage-crush-red.test.ts` (2026-08-13)
- [keyword] `rule-modification lose-abilities` does not strip hero activations — crushed Bravo can still activate dominate — `packages/cards/src/cards/BVO/actions/BVO018-crush-confidence-blue.test.ts` (2026-08-13)
- [combat] `playAttack` under `FAB_MANUAL_HARNESS` stays on the layer; `passBoth()` then `advanceCombatTo("defend")` before `toHaveAttackPower` — `packages/cards/src/cards/BVO/actions/BVO012-emerging-power-red.test.ts` (2026-08-13)
- [assert] `toHaveCost` is printed/evaluated numeric cost, not play-static cost-reduction — prove a −1{r} gate by paying the reduced amount — `packages/cards/src/cards/PEN/actions/PEN293-hulk-up-blue.test.ts` (2026-08-13)
- [combat] `defendWith` of the same printing N times may only apply one instance — use distinct cards — `packages/cards/src/cards/CRU/actions/CRU026-mangle.test.ts` (2026-08-13)
- [combat] `defendWith` takes one card or an array; extra rest args are ignored (`defendWith(a, b)` only applies `a`) — `packages/cards/src/cards/MST/actions/MST237-eloquent-eulogy-red.test.ts` (2026-08-13)
- [combat] a "didn't hit" miss needs total defence ≥ printed power — 7 vs 8 still hits and leaks 1; 4× Nimblism Blue (8{d}) is the Swing Big miss fixture — `packages/cards/src/cards/EVR/actions/EVR002-swing-big-red.test.ts` (2026-08-13)
- [act] `attackWith` advances to Defend and resolves on-attack triggers first — answer an on-attack optional with `play()` then `advanceToDecision`, not `attackWith` — `packages/cards/src/cards/PEN/actions/PEN255-fire-that-burns-within-red.test.ts` (2026-08-13)
- [act] on-attack "you may discard or destroy" is boolean then `effect-resolution` (not `option`) — `packages/cards/src/cards/AGB/actions/AGB022-jittery-bones-blue.test.ts` (2026-08-13)
- [keyword] star-repeat (`times: { type: "star" }`) repeats until a terminal then-branch or the inner effect is a no-op; banish then binding-matches needs live reanchor after the preview — `packages/cards/src/cards/CRU/actions/CRU007-beast-within-yellow.test.ts` (2026-08-13)
- [keyword] empty at-resolution / missing binding is a no-op, not "move target is unresolved" — Everbloom recycle at 0{h} and empty-hand Base of the Mountain — `packages/cards/src/cards/SEA/instants/SEA258-everbloom-life-blue.test.ts` (2026-08-13)
- [status] `hero-lost-life-this-turn` is any seated hero; `has-lost-life-this-turn` reads `iteration-subject` inside for-each — `packages/engine/src/rules/evaluation/conditions/has-status.ts` (2026-08-13)
- [clone] generated color variants that grant to `self` after `choose-card`, print a gated go again as a keyword, or fragment Snapback/Chromatic/Flittering should be remapped to the hand-authored red template — `packages/cards/src/cards/DTD/actions/DTD188-beseech-the-demigon-yellow.ts` (2026-08-13)
- [clone] generated Slice and Dice Blue split a this-turn delayed trigger into a trigger with no effect plus self-buffs; remap to the EVR057 delayed-trigger (blue second-weapon +1{p}) — `packages/cards/src/cards/EVR/actions/EVR059-slice-and-dice-blue.ts` (2026-08-14)
- [keyword] printed "Whenever you attack with a sword or dagger this turn" is `delayed-trigger` + `duration:"this-turn"` + `consumeOnUse:false`; omitted duration compiles to until-triggered and never sees the second swing — `packages/cards/src/cards/EVR/actions/EVR059-slice-and-dice-blue.ts` (2026-08-14)
- [arrange] Smash Instinct intimidate banishes a hand card before Defend, so a two-card “fewer than 2 non-equipment defenders” fixture loses a blocker — use Riled Up (CRU016) for Barraging Beatdown — `packages/cards/src/cards/WTR/actions/WTR017-barraging-beatdown-red.test.ts` (2026-08-14)
- [assert] `expectFabCard` cannot resolve an instance that moved to deck; assert `hero.zone("deck")` contains the canonical id — `packages/cards/src/cards/SEA/actions/SEA013-cog-in-the-machine-red.test.ts` (2026-08-14)
- [damage] Enion Surge’s generated any-target is an object scan without `player:"any"`; prove the ping via self-target and `--record-gap` the opposing-hero target — `packages/cards/src/cards/OMN/actions/OMN112-enion-surge-red.test.ts` (2026-08-14)

## Sanctioned state seeds

- [seed] the one sanctioned exception to "no direct state mutation" is the seed helpers in `rules-aaa.ts` (e.g. `seedPitchedPower6` for the Bear Hug family) — `packages/engine/src/testing/rules-aaa.ts` (2026-08-12)
- [seed] if you must answer a persisted decision, use `game.exec({ move:"answer-decision", actorId, payload:{ decisionId, stateVersion, answer } })` — `packages/cards/src/cards/BVO/heroes/BVO002-bravo.test.ts` (`answerPaymentDecision`) (2026-08-12)

## Validation

- [validate] green tests ≠ type-safe: vitest-oxc strips types, so always run `vp run check-types` before trusting a green test run (2026-08-12)
- [validate] finish with `vp run ci-check` for the whole submodule (per `AGENTS.md`) (2026-08-12)

## Keywords & combat assertions

- [keyword] `activeLink?.keywords` contains bare keyword names (e.g. `"piercing"`, `"go-again"`), not `"piercing 1"` — check the keyword name, not the full printed text — `packages/cards/src/cards/HNT/weapons/HNT009-hunter-s-klaive.test.ts` (2026-08-12)
- [keyword] Instant Discard-this from hand is `activate(card)` (0 AP, including the opponent's turn); playing the same card as an attack does not fire that ability — `packages/cards/src/cards/HNT/actions/HNT044-reaper-s-call-red.test.ts` (2026-08-13)
- [keyword] "hit a marked hero named X" contracts complete on that hit (Defang draws); unmarked / wrong-name heroes do not — `packages/cards/src/cards/HNT/actions/HNT030-defang-the-dragon-red.test.ts` (2026-08-15)
- [combat] `resolveRestOfCombat()` throws if an on-hit optional decision is pending; use `resolveUntilIdle({ optionalBoolean: false })` to decline it — `packages/cards/src/cards/HNT/weapons/HNT010-mark-of-the-huntsman.test.ts` (2026-08-12)
- [combat] star-count destroy-on-hit can require `resolveUntilIdle({ ordering: "listed" })` — `resolveRestOfCombat()` throws for an explicit ordering answer — `packages/cards/src/cards/ARC/actions/ARC159-command-and-conquer-red.test.ts` (2026-08-13)
- [keyword] inventoried has-status markers (hero-lost-life-this-turn, last-attack-on-combat-chain-hit, boost counts, rupture chain-link-4, rune-gated, chose-war, …) now evaluate from the first-class turn/combat ledger instead of throwing — `packages/engine/src/rules/inventoried-status-facts.test.ts` (2026-08-13)
- [combat] to test "if the last attack on this combat chain **hit**" effects: open a prior link with a go-again attack, advance to resolution so the hit registers, then open the target link — `Hero.attackWith(goAgainAttack); game.advanceCombatTo("resolution"); Hero.attackWith(targetCard);` (assert the target's power at the new link; boundary = target as the FIRST link with no prior hit) — `packages/cards/src/cards/UPR/actions/UPR093-breaking-point-red.test.ts` (2026-08-12)
- [combat] weapon activations with cost-based abilities may still be accepted by the engine even with insufficient resources (engine presents a payment decision rather than rejecting outright); test boundary via power/modifier absence instead — `packages/cards/src/cards/HNT/weapons/HNT009-hunter-s-klaive.test.ts` (2026-08-12)

## Allies

- [ally] Action–Allies are permanents: an activated Attack moves the source onto the combat chain (CR 7.2.2b) and combat close must return it to the arena, not the graveyard (CR 7.7.5) — `packages/engine/src/acceptance/rules/ally-contract.test.ts` (2026-08-13)
- [ally] Necromancer Allies print `{h}` as `health`, never `defense`; catalog `types` split puts Ally on `subtypes` — `packages/engine/src/acceptance/rules/necromancer-ally-catalog.test.ts` (2026-08-13)
- [ally] "opponents must choose this as the target of attacks if able" is `rule-modification require be-attacked` on self; quote attack targets filter to that subject when it is already legal — `packages/cards/src/cards/SEA/actions/SEA050-chum-friendly-first-mate-yellow.test.ts` (2026-08-13)
- [ally] an Instant lure on the opponent's turn: seat the attacker first, `pass()` to the ally controller, activate, then the default hero attack is illegal — `packages/cards/src/cards/SEA/actions/SEA050-chum-friendly-first-mate-yellow.test.ts` (2026-08-13)
- [hero] Malice / Gravy graveyard play: a sole matching GY target is auto-bound (no entity-target decision); activate then `passBoth()` then `play(..., { from: "graveyard" })` — `packages/cards/src/cards/IAR/heroes/IAR054-malice.test.ts` (2026-08-13)
- [prevention] class-shield `prevention.shielded` object-filters ("you or a Pirate you control") persist the filter and match the damaged living object at application — `packages/cards/src/cards/AGB/actions/AGB019-sawbones-dock-hand-yellow.test.ts` (2026-08-13)
- [ally] "target hero or ally" / "destroy an aura token" must set `player: "any"`; default object scan is controller-only — `packages/cards/src/cards/SEA/actions/SEA059-kelpie-tangled-mess-yellow.ts` (2026-08-13)
- [harness] a card with the `opt(N)` keyword inserts a deck-order decision on play — `game.passBoth()` does NOT resolve it, so the card's main effect (e.g. deal-damage) never fires (life unchanged). Use `game.helpers.resolveUntilIdle({ entityTargets: "minimum" })` after `play(card, {target})` — `packages/cards/src/cards/CRU/actions/CRU168-foreboding-bolt-red.test.ts` (2026-08-13)
- [harness] `playAttack` throws on printed `opt(N)` (explicit partition); use `attackWith` so opt defaults to keep-on-top — `packages/cards/src/cards/ARC/actions/ARC182-fervent-forerunner-red.test.ts` (2026-08-15)
- [harness] optional additional-cost Pay/Decline appears when a second hand/GY card is legal; `playAttack` of Seek Horizon / Belittle with a follow-up in hand throws — use `attackWith` to auto-decline — `packages/cards/src/cards/MON/actions/MON251-seek-horizon-red.test.ts` (2026-08-15)
- [combat] Dominate allows at most one defending card from hand — miss a 3{p} Overload with one 3{d} card, not two Nimblisms — `packages/cards/src/cards/MON/actions/MON275-overload-red.test.ts` (2026-08-15)
- [status] Unwavering Resolve empty-deck +4{p} and 3+ defender go again are while-statics (not resolution, not a printed go-again keyword) — `packages/cards/src/cards/SUP/actions/SUP218-unwavering-resolve-red.ts` (2026-08-15)
- [exchange] on-attack `exchange` of `equipment-head` stays unresolved even with both heads seated — prove the throw, leftover AP is gapped — `packages/cards/src/cards/LSS/actions/LSS019-scarf-for-a-scarf-red.test.ts` (2026-08-15)
- [damage] Wizard arcane/generic-damage idiom: hero `blazeFiremind` (HER117); `FAB_MANUAL_HARNESS` preset; `Hero.play(card, { target: opponent.id }); passBoth/resolveUntilIdle`; assert `expectFabPlayer(Opp).toHaveLife(20 − amount)` and `game.combat()` null (non-attack) — `packages/cards/src/cards/ARC/actions/ARC141-scalding-rain-red.test.ts` (2026-08-13)
- [ally] enter-arena +1{p} is a numeric-counter identity replacement, not a named-counter grant — `packages/cards/src/cards/PEN/actions/PEN157-bubba-lubba-run-aground-yellow.test.ts` (2026-08-13)
- [ally] living tokens die as they cease (CR 2.5.3g / 8.2.8a) and do not enter GY/banished (CR 8.1.8a); no in-repo public play banishes a catalog Ally from the arena (Midas/Barracuda destroy) — `packages/engine/src/acceptance/rules/ally-contract.test.ts` (2026-08-13)
- [ally] "Destroy target ally" must set `player: "any"`; default object scan is controller-only — `packages/cards/src/cards/SEA/actions/SEA188-midas-touch-yellow.ts` (2026-08-13)

## Scope

- [scope] exactly two seated players (1v1); deckbuilding-only and multiplayer-only clauses are OUT_OF_SCOPE — record the reason, never implement by implication — `docs/fab-attack-actions-acceptance-status.md` (2026-08-12)

## Automation / goldfish

- [automation] Catalog text seating uses `createDefaultFabPregameSelection`; extra equipment goes to inventory, never live arena — `packages/engine/src/automation/resolve-text-deck.ts` (2026-08-14)

- [automation] `end-turn` is enumerated once with no arsenal plus once per legal hand card when arsenal has room (`payload.arsenalInstanceId`); bots must pick that payload rather than assuming an empty end-turn — `packages/engine/src/automation/heuristic/goldfish.test.ts` (2026-08-13)
- [automation] value-block compares life saved + on-hit prevented + leftover offense (arsenal counts as convert); enumerate mixed equipment+hand defend sets — `packages/engine/src/automation/heuristic/defend.test.ts` (2026-08-13)
- [automation] Rhinar masterclass: arsenal Bloodrush when the 4-card texture cannot convert; play it when a 6-power discard + blue + threat are live — `packages/engine/src/automation/heuristic/profiles/rhinar.test.ts` (2026-08-13)
- [automation] Teklo masterclass: boost before playing hand Evos; arsenal Fabricate; do not block with Singularity — `packages/engine/src/automation/heuristic/profiles/teklovossen.test.ts` (2026-08-13)
- [automation] Arakni masterclass: send stealth finishers while the opponent is marked; arsenal Toxin; do not block with reactions — `packages/engine/src/automation/heuristic/profiles/arakni.test.ts` (2026-08-13)
- [automation] Valda masterclass: Ley Line first, dominate crush off 3 Seismic Surges, arsenal Eruption, empty end-turn to heave, do not block with Pummel — `packages/engine/src/automation/heuristic/profiles/valda.test.ts` (2026-08-13)
- [automation] Aurora Zero to Eighty: Lightning go-again before Snatch, quickstrike when Embodiment is live, arsenal Fry, do not block the chain cards — `packages/engine/src/automation/heuristic/profiles/aurora.test.ts` (2026-08-13)
- [automation] Oscilio Zero to Eighty: Flow attacks before Snatch, arsenal GIAF while Greaves is live, do not block the combo cards — `packages/engine/src/automation/heuristic/profiles/oscilio.test.ts` (2026-08-13)
- [automation] Zyggy Zero to Eighty: ward aura first, Phantasmaclasm as the two-card haymaker, do not block Phantasmaclasm — `packages/engine/src/automation/heuristic/profiles/zyggy.test.ts` (2026-08-13)
- [automation] Gravy Zero to Eighty: go-again Pirates before Snatch, replay GY allies once a blue has enabled Watery Grave, do not block Tipple or Riggermortis — `packages/engine/src/automation/heuristic/profiles/gravy.test.ts` (2026-08-13)
- [automation] Marlynn Zero to Eighty: Take Aim before Snatch, arsenal King Shark, do not block the harpoon — `packages/engine/src/automation/heuristic/profiles/marlynn.test.ts` (2026-08-13)
- [automation] Puffin Zero to Eighty: Cog in the Machine then Palantir, do not block Palantir — `packages/engine/src/automation/heuristic/profiles/puffin.test.ts` (2026-08-13)
- [automation] Pleiades Zero to Eighty: What Happens Next? first, Cries of Encore once the aura is live, do not block either — `packages/engine/src/automation/heuristic/profiles/pleiades.test.ts` (2026-08-13)
- [automation] Kayo Underhanded Cheat Zero to Eighty: Mocking Blow / Big Bully before Snatch, do not apply this profile to Armed and Dangerous — `packages/engine/src/automation/heuristic/profiles/kayo.test.ts` (2026-08-13)
- [automation] Lyath Zero to Eighty: Edge of Their Seats first, Tear Asunder once an aura is live, do not block Tear Asunder — `packages/engine/src/automation/heuristic/profiles/lyath.test.ts` (2026-08-13)
- [automation] Mirror matches: same printed hero identity raises on-hit cover value and prefers disruption that attacks the shared plan; `as(hero, 1)` is required when both seats share a hero — `packages/engine/src/automation/heuristic/defend.test.ts` (2026-08-13)
- [automation] Self-play + coach: `playFabMatch` writes whole-game decision frames; keep a profile change only if situation tests stay green and bench hangs/illegals do not rise. Hangs (`max-actions`/stall/illegal/throw/unpayable-legal) are playability bugs and must be fixed even when a heuristic lesson is rejected — `packages/engine/src/automation/bench/bench.test.ts` (2026-08-13)
- [automation] A bot that cannot play still must pass priority or end the turn; if it cannot pass either, it concedes. `chooseAutomatedAction` is that last-resort path — `packages/engine/src/automation/strategies.test.ts` (2026-08-13)
- [automation] `submitAutomatedAction` retries after a rejected/thrown command; a pass or end-turn that does not advance the state also concedes — `packages/engine/src/automation/strategies.test.ts` (2026-08-13)
- [automation] Bot smoke plays full games; fail on concede/stall/illegal/throw. `max-actions` at the smoke cap is only a long game when life is still converting — a pass/overblock loop to the cap is a hang and must be fixed. Seeds are `smoke:<case>`; `FAB_SMOKE_SEED=random` redraws. Do not pair defend-only with defend-only — `packages/engine/src/automation/smoke/` (2026-08-13)
- [automation] Hero smoke seats a matching practice deck whenever one exists — all 13 heroes have one now, so every hero seat binds its own strategy with the guard active; if a deck is ever removed the seat falls back to rhinar-practice with the mismatch opt-out — `packages/engine/src/automation/smoke/helpers.ts` (2026-08-13)
- [automation] Practice-deck self-play must convert (every match ends `life`/`concede`), never `max-actions`. Two conversion traps: (1) Defense Reactions (`Sink Below`/`Unmovable`) never cycle — the goldfish can't block with them in the defend step and only plays them in the reaction step when `remainingDamage>0`, so they permanently clog the hand and starve the seat of attacks; exclude them from synthetic bot decks. (2) Recyclable blocking walls single attacks: a 4-card hand at low life full-commit-blocks lethal every turn and redraws, so with no weapon attacks and no go-again chains to exhaust the defender, the biggest attack (9) cannot beat the per-turn block budget and the game stalls to the cap. Synthetic practice cards defend for 1 and `Nimble Strike` keeps its printed go-again so damage sticks — `packages/engine/src/automation/bench/playability.test.ts` (2026-08-13)
- [automation] All-strategies playability gate: every benchable seat must convert (`life`/`concede`) within 250 actions — all 13 hero strategies on their own `<hero>-practice` deck with the hero-binding guard active (passing = correctly seated; a removed deck fails loudly, fix the deck, do not suppress), plus dispatcher/generics including passive defend-only/pass-only vs value-extract. Smoke's `max-actions` tolerance is a crash gate, not full validation — `packages/engine/src/automation/bench/all-strategies.playability.test.ts` (2026-08-13)
- [automation] Kayo go-again-opener (KEPT — fixed the only playability hang in the hero matrix): kayo was tripping the 250-action cap on 1/8 seeds because its hints prefer non-go-again signature attacks (Mocking Blow power 1, Big Bully), so it played one attack per turn and could not out-damage a turtling opponent's `Sigil of Solace` healing — a slow control game, not a stall (it converged at 278 actions/21 turns under cap 400). Fix: mirror Aurora — make a generic go-again attack (`card.isAttack && card.hasGoAgain`) the **top** active priority in `kayoRankingHint` (+170 in `kayoAdjustScore`) so Kayo opens on Nimble Strike, the AP refunds, and a second attack follows. Result: hang eliminated (8/8 `life`), win-rate 0/8→2/8 (gained 2, lost 0 vs old baseline), isolation Δ improved −5→−3, fresh-seed batch tied with value-extract (no regression); full 13-hero sweep now 100% `life`. A Mocking Blow "closeout gate" (stop setting up at low opp life) was tried first and was **empirically inert** (flipped 0 — the slow offense is about chaining, not which single card opens), so it was reverted; the go-again-opener is the real lever. Situation test: leads with a go-again attack over Mocking Blow when one is in hand (`practice-nimble-strike` + `practice-mocking-blow`) — `packages/engine/src/automation/heuristic/profiles/kayo.ts` (2026-08-13)
- [automation] Remaining hero heuristic-tuning debt (hints net-hurt vs value-extract on their own deck, same seeds): **resolved** — arakni (−3→0, mark), puffin (−5→0, crank), marlynn (−5→+1, aim), oscilio (−2→0, flow), gravy (−3→0, loot) all modeled (see lines below). Still outstanding: valda (intentional, situation-test-enforced Pummel-preserve rule — not a bug), kayo/teklovossen/zyggy (~−1, within noise), zyggy deck is weak regardless. Each needs a same-seed isolation diff + owning situation-test cross-check before promoting any change — an off-archetype flip may be intentional. Use the per-hero `<hero>-practice` deck + shared `--seed-base` for isolation — `packages/engine/src/automation/heuristic/profiles/` (2026-08-13)
- [automation] Oscilio flow + Gravy loot modeled (KEPT — closed both isolation gaps): same root cause as the others — a bare do-nothing Action the profile prefers. `practice-enion-surge` (Oscilio's Lightning flow spell) and `practice-loot-the-hold` (Gravy's pitch-3 Pirate action) each gained go-again + a "when you play this, draw a card" trigger (`{name:"play"}` → `{type:"draw",count:1,player:"controller"}`) — cantrip value for the preferred setup play. Results: oscilio 6/8 vs ref 6/8 (Δ 0, was 3 vs 5), gravy 7/8 vs ref 7/8 (Δ 0, was 4 vs 7), 8/8 `life`, situation tests intact. TDD: playing-the-card-draws — `oscilio.test.ts`, `gravy.test.ts` (2026-08-14)
- [automation] Bench max-actions calibrated 250→400 (the default; the strict `all-strategies.playability.test.ts` CI gate keeps a 250 sub-budget): legitimately slow control matchups (a `Sigil of Solace` turtling Bravo vs a moderate-damage deck) converge past 250 but are NOT infinite stalls — verified oscilio-ref (value-extract on oscilio-practice) hit 250 on 1/8 seeds but converges 8/8 `life` at 400. True exhaustion-deadlocks are already prevented by every deck carrying an activatable weapon (`practice-steadfast-saber`/dagger); the cap now just gives slow-but-converging control games room. A real infinite loop still trips 400 — `packages/engine/src/automation/bench/play-match.ts`, `scripts/bot-bench.ts` (2026-08-14)
- [automation] Puffin crank mechanic MODELED (KEPT — closed puffin's isolation gap −5→0): root cause was `practice-cog-in-the-machine` — a bare Mechanologist Action puffin's profile prefers to play first (+180, test #1) but that did nothing (no ability), wasting the turn. Fix in `sample-decks.ts`: Cog gains go-again + `PRACTICE_CRANK_DRAW` (`{kind:"static",staticKind:"triggered",trigger:{event:{name:"play"}},effect:{type:"draw",count:1,player:"controller"}}`) — a cantrip crank that reloads the hand. Now puffin's "play Cog to crank" plan yields card advantage instead of dead tempo; isolation 6/8 vs ref 6/8 (Δ 0 — was 0/8 vs 5/8), 8/8 `life`, situation tests intact. TDD: playing-Cog-draws — `packages/engine/src/automation/heuristic/profiles/puffin.test.ts` (2026-08-14)
- [automation] Marlynn aim mechanic MODELED (KEPT — closed marlynn's isolation gap −5→+1): root cause was `practice-take-aim` — a bare Ranger Action marlynn's profile prefers first (+150, test #1) but did nothing, and with go-again it chained Take Aim 3× cycling the hand for ~0 damage while value-extract attacked. Fix: make Take Aim a **3-power go-again Attack** (`types:["Ranger","Action","Attack"], power:3`) carrying the draw trigger on `{name:"attack"}` — a cantrip attack that deals damage, draws, and chains, so playing it is productive tempo (not dead cycling). Isolation 8/8 vs ref 7/8 (Δ +1, hints now help — was 1/8 vs 6/8), 8/8 `life`, cross matrix clean, situation tests intact. TDD: playing-Take-Aim-draws — `packages/engine/src/automation/heuristic/profiles/marlynn.test.ts` (2026-08-14)
- [automation] Arakni mark mechanic MODELED (KEPT — closed arakni's isolation gap −3→0): the engine already modeled `marked` (`{type:"mark"}` effect → `player.marked=true` via `proposals/effects/mark.ts` + `reducers/counters-status.ts`; clears on opposing hit, CR 9.3.3, `reducers/combat.ts`), and arakni's profile already keyed off `opponentMarked` — but no synthetic arakni card applied a mark, so those bonuses never fired and Tarantula Toxin (a bare action) was a dead hoard. Fix in `sample-decks.ts`: (1) `practice-arakni-dagger` — an activatable Assassin weapon (`PRACTICE_WEAPON_ATTACK`) that also carries `PRACTICE_MARK_ON_HIT` (`{kind:"static",staticKind:"triggered",trigger:{event:{name:"hit",target:"hero"}},effect:{type:"mark",target:{selector:"attack-target"}}}`, mirrors Hunter's Klaive), seated as arakni's `weapon1`; (2) the `practice-arakni` hero gains `PRACTICE_ARAMKNI_MARK_BONUS` — a continuous `modify-numeric +1 power` to controller attacks with `hasStatus:"attacking-a-marked-hero"` (a simplified Arakni Marionette a2). Result: arakni marks via the dagger, her existing profile logic + the +power fire, isolation 6/8 vs ref 6/8 (Δ 0, neutral — was −1 after weapons, −3 before), 8/8 `life`, cross matrix clean, situation tests intact (test #2 still arsenals Toxin — that hoard is intentional/test-enforced; the mark bonus compensates). TDD: dagger-marks-on-hit + +1-damage-vs-marked — `packages/engine/src/automation/heuristic/profiles/arakni.test.ts` (2026-08-14)
- [automation] Cross-pairing matrix (hero×hero ordered + hero×generic) is now 100% clean — 0 non-`life` terminations across all 195 pairings. The former heuristic-as-p2 loops (marlynn/gravy/puffin vs `heuristic`, 1/3 `max-actions` each) were an **exhaustion-deadlock**, not a defense/offense problem: FAB has no fatigue, and those practice decks had **no weapon**, so once the deck exhausted leaving only resource cards (Cracked Baubles) in hand the seat could not deal damage and the game froze (gravy-vs-heuristic stuck at 19-vs-2, gravy holding [Bauble, Bauble]). A weapon is the one damage source that survives hand exhaustion (it attacks from equipment). KEPT fix: added `practice-steadfast-saber` (Generic weapon, once-per-turn activated attack costing 1 resource, `PRACTICE_WEAPON_ATTACK` — mirrors a production weapon's `{kind:"activated",abilityType:"attack",effect:{type:"attack-with",target:{selector:"self"}}}`) and rolled `weapon1` to all 12 HERO_SMOKE_FILLER hero decks — eliminated every loop, no isolation regression (most heroes improved). Regression guard in `strategies.test.ts`: every hero deck has a weapon + the saber is activatable. WARNING: making rhinar/bravo's own weapons (Romping Club/Anothos) activatable was tried and reverted — it regressed the gated `defend-only`-vs-`value-extract` seat to `max-actions`; leave them decorative. The earlier `heuristicStrategy` race-when-ahead tweak (decline to block at life-lead ≥6) is kept as a sound but now-minor improvement — `packages/engine/src/automation/sample-decks.ts`, `bot-strategies.ts` (2026-08-14)

## Harness quirks

- [target] `ref(card)` is ambiguous when a second copy remains in hand; target the defending AAC with `cardIn("combatChain", card)` — `packages/cards/src/cards/CRU/instants/CRU189-reinforce-the-line-red.test.ts` (2026-08-15)
- [harness] CR 4.4.3b is a persisted up-to-one `turn-arsenal` entity-target after beginning-of-end-phase effects; with `FAB_MANUAL_HARNESS`, end the Action Phase by having both players pass, then use `target(card)` to arsenal or `target()` to decline — `packages/engine/src/acceptance/rules/end-turn-arsenal-choice.test.ts` (2026-08-15)
- [harness] `reload` is an optional discrete effect (CR 8.5.23). `resolveUntilIdle({ optionalBoolean: false })` declines it; `{ optionalBoolean: true }` accepts (the sole remaining hand card is a forced target; name `entityTargetCanonicalId` when the hand has more than one card). The loaded card sits face-down in arsenal — `packages/engine/src/rules/docs/comprehensive-rules/08-keywords.test.ts` (2026-08-13)
- [harness] CR 8.2.6a: arrows play only from arsenal and only with a bow — seed `weapon1: [deathDealer]` + `arsenal: [arrow]` and `.attackWith(arrow, { from: "arsenal" })`. Ranger heroes do not waive this. — `packages/engine/src/rules/docs/comprehensive-rules/08-keywords.test.ts` (2026-08-13)
- [keyword] "If this hits, reload" is the optional reload effect, not a keyword grant; extra power on Bolt 'n' Shot enables go again + hit-reload — `packages/cards/src/cards/ELE/actions/ELE216-bolt-n-shot-red.test.ts` (2026-08-13)
- [harness] use `FAB_MANUAL_HARNESS` from the public testing barrel instead of inlining `{ autoPassPriority:false, autoPitch:false, pitchStack:"manual" }` — `packages/engine/src/testing/harness-config.ts` (2026-08-13)
- [harness] Vynnset's "whenever you play a Shadow non-attack, you may pay {h}" is an optional boolean — `resolveUntilIdle({ optionalBoolean: false })` after Putrid Stirrings / Envelop in Darkness — `packages/cards/src/cards/DTD/actions/DTD161-putrid-stirrings-red.test.ts` (2026-08-13)
- [keyword] prove Arcane Barrier with `volticBoltRed` (ARC147 action) + `passBoth()` then `expectDecision("option")`; a resolving instant such as Comet Collision often never presents the option under `FAB_MANUAL_HARNESS` — `packages/cards/src/cards/ARC/equipments/ARC155-nullrune-hood.test.ts` (2026-08-13)
- [keyword] the "next `<typeBox>` attack action this turn gains +N{p}" effect (`appliesTo.next` + `duration:"this-turn"`) IS engine-supported; assert it at `game.combat()?.activeLink?.attackPower` right after declaring the recipient attack — `packages/cards/src/cards/ARC/actions/ARC054-take-aim-red.test.ts` (2026-08-12)
- [keyword] numeric filters on `appliesTo.next` ARE engine-supported — `cost ≥ K` (sloggism), `cost ≤ K` (nimblism), `base power ≤ K` (minnowism); the strong boundary is a recipient that fails the filter (wrong cost/power) getting NO buff — `packages/cards/src/cards/WTR/actions/WTR221-sloggism-red.test.ts` (2026-08-12)
- [keyword] when a card's printed text repeats "Your next attack this turn gets +1{p}" as multiple `abilities[]` entries (sprout-strength red=3 / yellow=2 / blue=1), the engine STACKS them on the same next attack — assert the cumulative total (base + 1×k); the `appliesTo.next` supertype filter (Lightning/Elemental) also correctly skips non-matching recipients (brutalAssaultBlue Generic gets NO buff from sizzle) — `packages/cards/src/cards/PEN/actions/PEN222-sprout-strength-red.test.ts` (2026-08-12)
- [arrange] reusable recipient library lives at `packages/cards/src/cards/shared/test-recipients.ts`: `brutalAssaultBlue` (Generic, cost 2, power 4 — IRA010), `searingShotRed` (Ranger arrow, cost 0, power 4 — ARC069), `headShotYellow` (Ranger arrow, cost 1, power 3 — ARC058), `deathDealer` (Ranger 2H Bow — ARC040, required to play arrows) (2026-08-13)
- [arrange] `briar` (ELE063 — Elemental/Runeblade with Earth+Lightning supertypes) is the universal hero for Earth/Lightning/Elemental talent-locked cards and also plays Generic — re-exported from `packages/cards/src/cards/shared/test-recipients.ts` (2026-08-13)
- [arrange] `FabPlayerSetup.deck: [first, …, last]` is bottom-first — the last entry is the top card pitched/revealed — `packages/cards/src/cards/SUP/heroes/SUP001-tuffnut-bumbling-hulkster.test.ts` (2026-08-13)
- [arrange] unused `resourcePoints` reset at end of turn — opponent-turn defend tests cannot spend the first player's seeded RP; seat the defender as player B with seeded RP — `packages/cards/src/cards/SUP/actions/SUP037-dig-in-yellow.test.ts` (2026-08-13)
- [assert] `zone()` returns canonical ids; `objectState` / `toBeFaceDown` need instance refs from `cardsIn` — `packages/engine/src/acceptance/heroes/levia-redeemed.test.ts` (2026-08-13)
- [cost] printed cost X is declared as a numeric play decision; `play(card, { xValue: N })` pays N and binds `x` for search/filters — `packages/cards/src/cards/EVR/actions/EVR022-imposing-visage-blue.test.ts` (2026-08-13)
- [cost] alternative-cost Pay/Decline is an `option` decision; `play(card, { modeIds: ["pay"] })` or `["decline"]` — `packages/cards/src/cards/OMN/instants/OMN190-stormshard-red.test.ts` (2026-08-13)
- [token] destroying a token ceases it (no graveyard instance); assert absence from arena, not `toBeIn("graveyard")` — `packages/cards/src/cards/OMN/instants/OMN190-stormshard-red.test.ts` (2026-08-13)
- [token] created Seismic Surge instances are `token:seismic-surge`; a seated WTR075 catalog copy uses the set canonical id — count both (or create via Seismic Eruption) when asserting Aftershock — `packages/cards/src/cards/MPG/actions/MPG035-aftershock-red.test.ts` (2026-08-13)
- [reaction] "target card defending an Assassin attack" (Shred) is legal in the reaction step after `defendWith` + `advanceCombatTo("reaction")` — `packages/cards/src/cards/DYN/attack-reactions/DYN130-shred-red.test.ts` (2026-08-15)
- [act] explicit `options.pitch` is ignored when the played card costs 0; use a positive-cost recipient such as `nimbleStrikeRed` to prove a resource's printed pitch value — `packages/cards/src/cards/WTR/resources/WTR000-heart-of-fyendal-blue.test.ts` (2026-08-13)
- [combat] after `Hero.activate(weapon); game.passBoth()` the chain is not yet on Defend — `game.advanceCombatTo("defend")` before `defendWith` — `packages/cards/src/cards/PEN/blocks/PEN049-blunten-yellow.test.ts` (2026-08-13)
- [reaction] weapon attack-reactions: `activate(weapon)` + `passBoth()` + `advanceCombatTo("reaction")`; Klaive mark-on-hit plus another on-hit trigger needs `resolveUntilIdle({ ordering: "listed" })` — `packages/engine/src/acceptance/heroes/arakni-agents-combat.test.ts` (2026-08-13)
- [combat] Clash prize tokens are public after `defendWith` + `resolveUntilIdle({ optionalBoolean: false })` (decline the optional bottom); seed deck tops last-is-top by power, not pitch — `packages/cards/src/cards/SUP/actions/SUP048-tough-smashup-blue.test.ts` (2026-08-13)
- [fixture] Clash Sequence Lab reveals Alpha Rampage at its effective 9{p}, not 7{p}; assert the generated comparison plan so fixture instructions cannot drift from engine values — `apps/multi-game-simulator/src/games/flesh-and-blood/engineScenarios.test.ts` (2026-08-20)
- [keyword] Scour the Battlescape has go again only if played from arsenal, not as a printed keyword — proven go-again suites must `arsenal:` + `{ from: "arsenal" }` — `packages/cards/src/cards/WTR/actions/WTR194-scour-the-battlescape-red.ts` (2026-08-16)
- [crush] Spinal Crush lose+can't-gain still uses arsenal Scour (granted go again is the live fixture); Debilitate −2{p} needs that same arsenal play so leftover AP can open Snatch — `packages/cards/src/cards/WTR/actions/WTR044-spinal-crush-red.test.ts` (2026-08-16)
- [keyword] drop stale `keywords:[goAgain]` when a conditional static already exists; Vigor Rush needs a prior NAA, arsenal-only grants need `{ from: "arsenal" }` — `packages/cards/src/cards/ARC/actions/ARC197-vigor-rush-red.test.ts` (2026-08-16)
- [continuous] `during-own-next-end-phase` is a player-end-phase window (applies only in that end phase); do not substitute `until-end-of-own-next-turn` — `packages/cards/src/cards/ROS/actions/ROS217-ten-foot-tall-and-bulletproof-red.ts` (2026-08-16)
- [continuous] Art of War +1{d} on AACs must `events:["defend"]` (or `defending:true`); play/attack defaults miss a later defending AAC — `packages/cards/src/cards/ARC/instants/ARC160-art-of-war-yellow.ts` (2026-08-16)
- [keyword] printed "next attack" (not "attack action") must omit `subtypes:["Attack"]` so Dawnblade weapon attacks match; `resolveRestOfCombat()` then needs `optionalBoolean` for Dawnblade hit optionals — `packages/cards/src/cards/HNT/actions/HNT240-trot-along-blue.test.ts` (2026-08-13)
- [keyword] `has-status chose-war` / `chose-peace` reads `history.game.diplomacyChoice` (not turn history — the choice persists) — `packages/engine/src/rules/inventoried-status-facts.test.ts` (2026-08-13)
- [keyword] printed "if it is Draconic" on a source's own attack trigger binds `it` to the source; granted Draconic is visible to `binding-matches` — `packages/engine/src/rules/grant-property-next-latch.test.ts` (2026-08-13)
- [harness] delayed-trigger on weapon attack sits on the stack after `activate`+`passBoth`; pass priority once more before asserting power — `packages/cards/src/cards/EVR/actions/EVR057-slice-and-dice-red.test.ts` (2026-08-13)
- [keyword] hand-native play permissions (as though an instant) without `fromZones` are functional in hand — Funeral Moon after life loss — `packages/engine/src/rules/continuous/reconciler.ts` (2026-08-13)
- [while] self-targeting while-static is functional in hand (No Hero Stands Alone +3{d}/ambush after a Toughness this turn) — `packages/engine/src/rules/continuous/reconciler.ts` (2026-08-13)
- [cost] self-targeting continuous cost-modify is play-time: Reduce to Runechant with a seeded Runechant plays for 0{r} — `packages/engine/src/rules/continuous/reconciler.ts` (2026-08-13)
- [count] `cards-defending` count honors `amount.filter` (Show of Strength 6+{p} only) — `packages/engine/src/rules/evaluation/amounts/count.ts` (2026-08-13)
- [replacement] registered damage +N honors `appliesTo.next` as the damage source filter (Absorb / Chromatic first-time) — `packages/engine/src/rules/replacement-engine.ts` (2026-08-13)
- [arrange] Absorb is a DR so it resolves on the opponent's turn; prove the next-arcane +2 on that same turn via Iyslander's blue arsenal-as-instant, then `passPriorityTo` the defender — `packages/cards/src/cards/ARC/defense-reactions/ARC123-absorb-in-aether-red.test.ts` (2026-08-13)
- [arrange] Jarl creates a Frostbite when you play an Ice card, so a Channel Iceloch "no Frostbite" boundary must not seat Jarl as the Channel controller — `packages/cards/src/cards/PEN/actions/PEN229-channel-iceloch-glaze-blue.test.ts` (2026-08-13)
- [freeze] continuous freeze atoms stamp `{ kind: "frozen" }` markers on apply and clear them when the last freeze application stops — `packages/engine/src/rules/reducers/continuous-effects.ts` (2026-08-13)
- [aura] "your weapon attacks get +N" is `appliesTo.next` types:["Weapon"] count:star with `while-in-arena`, not current combat-chain objects — `packages/cards/src/cards/HNT/actions/HNT118-sharpened-senses-yellow.ts` (2026-08-13)
- [keyword] "you may only play X" is `rule-modification mode:require` (not restrict); restrict+filter blocks matching cards — Warmonger's Diplomacy / Oath of Loyalty — `packages/cards/src/cards/DTD/actions/DTD230-warmonger-s-diplomacy-blue.test.ts` (2026-08-13)
- [keyword] play-static condition without `asType`/`fromZones` is an activate gate (Rok empty-hand) — `packages/engine/src/rules/activation/stages/quote.ts` (2026-08-13)
- [keyword] require+defend+filter with no subjectFilter is must-include-if-able (T-Bone equipment); require+subjectFilter is "may only defend when" (Embrace Adversity) — `packages/engine/src/rules/legality-quotes.ts` (2026-08-13)
- [equipment] Adversity token-destroy gates: seat the token on player B, player A `endTurn` then `resolveUntilIdle` so start-phase destroy stamps the attack controller, then B attacks; Might also adds +1{p} so Snatch is 5 vs d2 — `packages/cards/src/cards/HVY/equipments/HVY200-embrace-adversity.test.ts` (2026-08-15)
- [keyword] a non-permanent "at the beginning of your end phase" is a resolution `delayed-trigger`, not a static trigger after the action is in the GY — `packages/cards/src/cards/EVR/actions/EVR106-revel-in-runeblood-red.ts` (2026-08-13)
- [keyword] delayed-trigger `it` from a prior banish must follow the live incarnation (banish resets) — `packages/engine/src/rules/proposals/shared.ts` (`liveReanchorBindings`) (2026-08-13)
- [keyword] duration grant-property follows the live instance across zone-reset incarnations (Tear Through go again on a later play from banished) — `packages/engine/src/rules/continuous/runtime.ts` (2026-08-13)
- [keyword] move-zone `hasStatus:face-up` is destination visibility, not the pre-move deck LKI; self-move AP grants use `subject:"self"` — `packages/cards/src/cards/ARC/actions/ARC178-back-alley-breakline-blue.test.ts` (2026-08-13)
- [keyword] intimidate stamps `banished-by-intimidate-this-turn` on the face-down card so on-hit move filters can see it — `packages/cards/src/cards/ROS/actions/ROS243-splatter-skull-red.test.ts` (2026-08-13)
- [aura] Iris-granted aura-weapon on-attack counter needs a second `passBoth()` after `activate` so the trigger resolves while the link is open — `packages/cards/src/cards/EVR/actions/EVR140-shimmers-of-silver-blue.test.ts` (2026-08-13)
- [keyword] hit `filter` with Action/Attack types describes the hitting card, not the hero (`target:"hero"` still requires a hero hit) — `packages/cards/src/cards/ROS/actions/ROS119-succumb-to-temptation-yellow.test.ts` (2026-08-13)
- [cost] optional playEffect additional costs (Staunch pay 4{r} for +3{d}) declare via pay/decline then apply `then` as a continuous instance on the played card — `packages/engine/src/rules/play/payment.ts` (2026-08-13)
- [replacement] create-count plus/minus is one path: Mordred +1 and Ripple Away −1 of each token type; create `replaces.subject` typeBox matches the creating source — `packages/engine/src/rules/replacement-engine.ts` (2026-08-13)
- [numeric] `modify-numeric` `set` must install a missing printed property (`*` power) — characteristic-defining max (Rockyard Rodeo) used to no-op when `current === undefined` — `packages/engine/src/rules/evaluation/atoms/numeric.ts` (2026-08-13)
- [harness] `registerDef` must not let a later default-hand stub (same canonical id, no abilities) wipe a seated module — opponent `hand` omitted uses DEFAULT_HAND Enlightened Strike / Browbeat stubs — `packages/engine/src/testing/test-fixtures.ts` (2026-08-13)
- [count] `different-names-among-aura-tokens` matches Token as a metatype; do not seed Runechant for an on-attack count — it destroys itself when you play an AAC — `packages/cards/src/cards/SUP/actions/SUP216-overcrowded-blue.test.ts` (2026-08-13)
- [binding] same-face multi-resolution abilities carry prior-step event bindings (discard `it` → next ability condition) via `abilityStepContinuation.events` — `packages/cards/src/cards/WTR/actions/WTR009-sand-sketched-plan-blue.test.ts` (2026-08-13)
- [damage] optional then-branch `any-hero` is declared when the then-effect is generated (CR 1.8.5), not at play; answer with `chooseBoolean` then `chooseTargetPlayers` — `packages/cards/src/cards/OMN/actions/OMN135-nucleus-aetherbolt-red.test.ts` (2026-08-13)
- [starfall] second-ability any-hero is declared at play as `effect-N:target` and rebased onto the condition-wrapped step as `effect-0:then:target`; answer with `play(..., { target: Hero })` — `packages/cards/src/cards/OMN/instants/OMN130-constella-contemplation-yellow.test.ts` (2026-08-13)
- [damage] printed "any target" hero pings should use `selector: "any-hero"` so public `target: Dash` matches player-id candidates — `packages/cards/src/cards/OMN/actions/OMN118-meteoric-impact-red.test.ts` (2026-08-13)
- [clone] color variants of a hand-authored red often keep object-scan without `player:"any"` (or resolution +p instead of while-static); prove damage via self-target / skip the unmodeled clause and `--record-gap` — do not half-fix the definition — `packages/cards/src/cards/UPR/actions/UPR171-dampen-yellow.test.ts` (2026-08-13)
- [keyword] "the next time an attack you control hits" is a resolution `delayed-trigger` (not `ability.trigger`); answer Briar first-AAC ordering with `{ ordering: "listed" }` — `packages/cards/src/cards/AUA/instants/AUA017-burn-up-shock-red.test.ts` (2026-08-13)
- [combat] Pulsewave-style on-attack reveal/add-defending: `play()` the attack then `passBoth()` twice so the triggered layer sits, then the **defending** hero `chooseTargets` (reveal, then choose-card). Do not use `attackWith` to prove add-defending — it advances to Defend and a hand block looks identical — `packages/cards/src/cards/DYN/actions/DYN090-pulsewave-harpoon-red.test.ts` (2026-08-13)
- [combat] resolution look-at-hand (Phantasmaclasm) fires when the attack resolves onto the chain, before Defend — keep a second hand card if you still need to block; the controller chooses with `chooseTargets(defender.cardIn("hand", card))` — `packages/cards/src/cards/MON/actions/MON091-phantasmaclasm-red.test.ts` (2026-08-13)
- [damage] fused "when this attacks, deal arcane to target hero": `attackWith` auto-picks the first any-hero candidate (self). Use `play()` + `chooseTargetPlayers(opponent)` after the triggered layer is on the stack — `packages/cards/src/cards/ELE/actions/ELE073-arcanic-shockwave-red.test.ts` (2026-08-13)
- [binding] this-way LKI after a zone-reset (banish/GY) must keep the prior incarnation; same-incarnation phantoms stay excluded — Invert Existence attack+non-attack banished this way — `packages/engine/src/rules/state-rules-view.ts` (2026-08-13)
- [keyword] first-class `trigger.event.fused` plus live `declarationFacts` collect on-attack fused layers (CR 8.3.17) even when has-status fused would miss pre-fuse LKI — `packages/engine/src/rules/trigger-matcher.ts` (2026-08-13)
- [keyword] "been dealt arcane this turn" is `damage-taken`, not `damage-dealt`; prove +1{d} before Temper while the boots are still defending — `packages/cards/src/cards/OMN/equipments/OMN204-boots-of-omnis-ward.test.ts` (2026-08-13)
- [keyword] arsenal "opponent's effect puts this into the graveyard" uses zone-owner as trigger controller and ignores combat-close `cause.kind:"rule"` — `packages/cards/src/cards/HVY/actions/HVY207-nasty-surprise-blue.test.ts` (2026-08-13)
- [keyword] start-of-game seating fires `equip` subject:self (Spellbane Aegis / next-AAC boost); drain with `resolveUntilIdle` before asserting — `packages/cards/src/cards/OMN/equipments/OMN236-arcbane-grasp-blue.test.ts` (2026-08-13)
- [reaction] Provoke-style defender hand reveals: after `playReaction` + `passBoth`, the **defending** hero answers `chooseTargets`; assert the defender still on combatChain before combat closes — `packages/cards/src/cards/HNT/attack-reactions/HNT117-provoke-blue.test.ts` (2026-08-13)
- [damage] put-into-graveyard hero-sourced arcane (`source: controller`) presents `entity-target` with player-id candidates — use `chooseTargetPlayers(Dash)` then `passBoth` — `packages/cards/src/cards/OMN/instants/OMN099-echoflash-yellow.test.ts` (2026-08-13)
- [token] created tokens sit in `arena` as `token:<slug>` (`token:gold`, `token:runechant`, `token:seismic-surge`); `expectFabCard` on the catalog token module will not find them — `packages/cards/src/cards/DYN/equipments/DYN234-crown-of-dominion.test.ts` (2026-08-13)
- [prevention] a "this turn" prevention expires when that player ends the turn, so the opponent's following attack is already too late — activate on the defending player's priority in the same combat — `packages/cards/src/cards/OMN/equipments/OMN211-gloves-of-astral-sanctuary.test.ts` (2026-08-13)
- [prevention] source-of-choice Instant (Helio's Mitre) — `entityTargets: "minimum"` picks the first object (often self/hero), so name the damaging attack with `entityTargetCanonicalId` — `packages/cards/src/cards/UPR/equipments/UPR183-helio-s-mitre.test.ts` (2026-08-15)
- [choice] printed "top or bottom of your deck" is `effect-resolution` option-0 (top) / option-1 (bottom) before the hand `entity-target` — `packages/cards/src/cards/ELE/equipments/ELE233-ragamuffin-s-hat.test.ts` (2026-08-15)
- [combat] "target defending card" on-stack declarations must see the defending seat's combat-chain occupants — `legalDecisionTargets` unions active-link defenders (Decimator Great Axe) — `packages/cards/src/cards/DTD/weapons/DTD205-decimator-great-axe.test.ts` (2026-08-13)
- [status] mark applied during the reaction window is removed by the subsequent opposing hit (CR 9.3.3) — assert `players.marked` before `resolveRestOfCombat` — `packages/cards/src/cards/AAC/equipments/AAC004-prey-spotters.test.ts` (2026-08-13)
- [keyword] `this-chain-link` −1{d} expires when combat closes; prove the debuff via remaining life, not `toHaveDefense` after close — `packages/cards/src/cards/OUT/weapons/OUT005-nerve-scalpel.test.ts` (2026-08-13)
- [combo] Combo cost must be play-static cost-reduction; prove it with `FAB_MANUAL_HARNESS`, `play(lead)` then `advanceCombatTo("resolution")` then `play(combo)` at 0{r}, then `passBoth()` before asserting the new link's power — Benji's empty-hand +1{p} stacks on top — `packages/cards/src/cards/KAT/actions/KAT008-descendent-gustwave-red.test.ts` (2026-08-13)
- [status] `control-N-or-more-draconic-chain-links` counts the resolving Draconic attack still on the stack, so the second Phoenix Flame on the same open chain gets +1{p} — `packages/cards/src/cards/FAI/actions/FAI008-phoenix-flame-red.test.ts` (2026-08-13)
- [mentor] face-up arsenal Hala proves sword-hit go-again via leftover AP after close plus `toHaveCounters(1, "lesson")` — `packages/cards/src/cards/DVR/mentors/DVR007-hala-goldenhelm.test.ts` (2026-08-13)
- [mentor] The Librarian's Spectral Shield trigger is once per turn (three Blues same turn stay at 1 lesson); seed `namedCounters: { lesson: 2 }` and keep the specialization off the deck-top so the draw does not steal the 3-counter search — `packages/cards/src/cards/PSM/mentors/PSM002-the-librarian.test.ts` (2026-08-13)
- [authoring] "at the start of each other hero's turn" is 1v1-mapped once: trigger `start-phase` with `actor: {kind:"player", player:"opponent"}`; the unqualified "choose 1" modal routes to the ability controller as a kind "option" decision whose option ids equal the authored mode ids — packages/cards/src/cards/LSS/actions/LSS006-good-deeds-don-t-go-unnoticed-yellow.test.ts (2026-08-18)
- [authoring] cross-turn "if X was chosen from this" causality has no condition primitive: schedule the mirror inside each modal mode's `sequence` as `delayed-trigger` (until-triggered) on the controller's start phase — equivalent in 1v1 because exactly one opponent turn intervenes before the self-destroy — packages/cards/src/cards/LSS/actions/LSS006-good-deeds-don-t-go-unnoticed-yellow.ts (2026-08-18)
- [timing] a delayed mirror firing at the same controller turn start as a self-destroy trigger surfaces an `ordering` decision — answer it with `resolveUntilIdle({ ordering: "listed" })` — packages/cards/src/cards/LSS/actions/LSS006-good-deeds-don-t-go-unnoticed-yellow.test.ts (2026-08-18)
- [harness] turn-start intellect refill lands BEFORE start-phase triggered gifts (assert hand as refill 4 + gift), and use the draining `playAttack(card, { pitch: [...] })` verb on later turns — `must.pitch().playAttack()` only stages the move and leaves combat unopened — packages/cards/src/cards/LSS/actions/LSS006-good-deeds-don-t-go-unnoticed-yellow.test.ts (2026-08-18)
- [payment] setup `resourcePoints` defaults to the hand's cost-sum, so a staged `must.pitch(...)` never fires — seed `resourcePoints: 0` explicitly for pitch-payment cases — `packages/cards/src/cards/ELE/actions/ELE160-winter-s-grasp-red.test.ts` (2026-08-18)
- [combat] under FAB_MANUAL_HARNESS after `must.pitch().playAttack()`, insert `game.advanceUntil({ stopAt: "defend" })` before the defender's `defendWith()` — `packages/cards/src/cards/ELE/actions/ELE160-winter-s-grasp-red.test.ts` (2026-08-18)
- [zone] pitched cards cycle to the deck bottom (CR 4.4.3c), and `expectFabCard` cannot resolve deck instances — assert `zone("deck")).toContain(card.canonicalId)` after `endTurn()` — `packages/cards/src/cards/ELE/actions/ELE160-winter-s-grasp-red.test.ts` (2026-08-18)
- [payment] Chi-subtype cards are excluded from {r} payment candidates; prove a Chi card's pitch value through a {c} activation cost (Enigma {c}{c}{c} at `chiPoints: 0`) by answering the payment decision BVO002-style — `packages/cards/src/cards/ENG/resources/ENG025-inner-chi-blue.test.ts` (2026-08-18)
- [defend] cards with no printed defense are rejected by the `defend` move ("no defense property") — assert the rejection plus a `defendWith()` decline as the no-{d} boundary — `packages/cards/src/cards/LEV/actions/LEV026-smash-with-big-tree-red.test.ts` (2026-08-18)
- [token] statless Token Auras seat via `arena: [token]` and persist across `endTurn()` cycles; `playAttack`/`defendWith` rejections make the boundary — `packages/cards/src/cards/OMN/tokens/OMN203-lightning-flow.test.ts` (2026-08-18)
- [arrow] Arrows fire with `attackWith(arrow, { from: "arsenal" })` + a bow equipped (`weapon1: [deathDealer]`); a from-hand `attackWith` throws (CR 8.2.6a) while hand defense still uses the printed {d} — `packages/cards/src/cards/SEA/actions/SEA092-rusty-harpoon-blue.test.ts` (2026-08-18)
- [equip] statless equipment asserts seat (`zone("head"|"chest"|"arms"|"legs")`), turn-cycle persistence, and `activate`/`defendWith` rejections (BVO005 shape) — `packages/cards/src/cards/TCC/equipments/TCC003-proto-base-head.test.ts` (2026-08-18)
- [combat] chaining attacks under `FAB_MANUAL_HARNESS`: a second `must.playAttack` at the resolution step is an unresolved layer — call `advanceCombatTo("defend")` before `expectCombat`, or you assert the PREVIOUS link's power — `packages/cards/src/cards/ARA/actions/ARA011-prowl-red.test.ts` (2026-08-18)
- [keyword] `appliesTo.next` + `hasKeyword:"stealth"` skips non-stealth recipients without consuming the latch, and `duration:"this-combat-chain"` expires on `closeCombat` — prove with Snatch-then-Malign on one chain plus a fresh-chain contrast — `packages/cards/src/cards/ARA/actions/ARA011-prowl-red.test.ts` (2026-08-18)
- [reaction] modal attack reactions follow the TEA016 pattern: `must.playReaction(card, { modeIds: ["<mode-id>"] })`; a filter near-miss (base 3 vs "2 or less base {p}") throws and leaves the reaction in hand — `packages/cards/src/cards/ARA/attack-reactions/ARA017-short-and-sharp-red.test.ts` (2026-08-18)
- [arrange] Nerve Scalpel (OUT005 — Assassin 1H Dagger, base 1, activated attack {r}{r}) is the dagger-attack fixture; Vipox red (UPR188 — Generic base-1 attack action) is the "base power ≤ N" filter fixture — `packages/cards/src/cards/ARA/attack-reactions/ARA017-short-and-sharp-red.test.ts` (2026-08-18)
- [arrange] seed `pitch: [card, card]` directly to satisfy pitch-zone count clauses (High Tide 2+ blues) without pitching — `packages/cards/src/cards/AGB/actions/AGB008-battalion-barque-red.test.ts` (2026-08-18)
- [act] optional resolution clauses drain with `resolveUntilIdle({ optionalBoolean: true, entityTargetCanonicalId })`; declined contrast uses `optionalBoolean: false` — `packages/cards/src/cards/AAZ/actions/AAZ024-line-it-up-yellow.test.ts`, `packages/cards/src/cards/AMX/actions/AMX018-twintek-charging-station-red.test.ts` (2026-08-18)
- [act] `must.playAttack(card, { boost: true })` declares a Boost-paid attack; the unboosted contrast is the plain call — `packages/cards/src/cards/AMX/actions/AMX018-twintek-charging-station-red.test.ts` (2026-08-18)

## On-hit create-token (T:hit) (2026-08-18)

- [token] on-hit create-token trios mirror the Infect golden: single-trigger attackers use `attackWith` + `helpers.resolveRestOfCombat`, tokens assert via `zone("arena")).toContain("token:<slug>")` and stacking via `expectFabPlayer(h).toHaveTokenCount(slug, n)` — `packages/cards/src/cards/ARA/actions/ARA012-sedate-red.test.ts` (2026-08-18)
- [arrange] Briar as attacker co-triggers her first-AAC-damage Earth embodiment with the card's own on-hit token → `game.closeCombat({ ordering: "listed" })` instead of `resolveRestOfCombat` (which throws on the ordering decision) — `packages/cards/src/cards/AUA/actions/AUA012-lightning-form-red.test.ts` (2026-08-18)
- [token] a 5{p} miss needs 5{d}: `defendWith([brutalAssaultBlue, snatchRed])` as one ARRAY (extra rest args are ignored); created Runechant ping + replacement asserts via `toHaveTokenCount("runechant", 1)` after a second hit — `packages/cards/src/cards/CRU/actions/CRU151-meat-and-greet-red.test.ts` (2026-08-18)
- [gap] Meat and Greet CRU151-153 modules declare unprinted `keywords:[goAgain]` (printed text has none) so the conditional go-again clause is unverifiable in both directions until the module keyword is removed — engine-gap rows in `docs/card-implementation-plan.md` §5 (2026-08-18)
- [cost] Runechant-count cost statics (Ninth Blade / Amplify / Rune Flash): seat `fabToken("runechant")` ×N in the controller's arena, then prove `cost − N` by leftover RP under `FAB_MANUAL_HARNESS`; the AAC play destroys them (CR 8.6.3), so a second copy the same turn pays full — `packages/cards/src/cards/ARC/actions/ARC082-ninth-blade-of-the-blood-oath-yellow.test.ts` (2026-08-18)
- [cost] printed "each Runechant token you control" must filter `name: "Runechant"` (CR 8.6.3); authored `name: "Runechant Token"` never exact-matches and the discount stays 0 — ARC100/ARC102 blocked in plan §5 (2026-08-18)
- [arrange] seeded `resourcePoints` do not survive a turn-cycle test (reset at end of turn) — prove cross-turn statics another way (e.g. same-turn consumption) or pay via pitch — `packages/cards/src/cards/ARC/actions/ARC094-amplify-the-arknight-red.test.ts` (2026-08-18)
- [aura] suspense aura "first attack each turn +N{p}": play + `passBoth` then `attackWith` asserts the buffed link; a seated arena copy starts with 2 suspense counters and 4× `endTurn`/`resolveUntilIdle` exhausts it for the no-aura boundary — `packages/cards/src/cards/APS/instants/APS026-the-suspense-is-killing-me-blue.test.ts` (2026-08-18)
- [activated] `.activate()` drains only forced decisions — a pending payment (pitch) decision must be answered before any further move via `game.helpers.resolveUntilIdle({ paymentCanonicalId })` — `packages/cards/src/cards/DTD/weapons/DTD210-scepter-of-pain.test.ts` (2026-08-18)
- [activated] multi-card pitch for one activation is `oneAtATime`: answer per card with `game.answerDecision(pid, { kind: "payment", instanceIds: [handle.ref(card).instanceId] })`; banked resourcePoints spend first, remainder pitches — DYN172 engine-gap repro, plan §5 (W0-F, 2026-08-18)
- [cost] "not enough resources" boundaries must seed `hand: []` — 0 resourcePoints is still payable by pitching, so rejection asserts need an empty hand — `packages/cards/src/cards/ARA/equipments/ARA003-mask-of-malicious-manifestations.test.ts` (2026-08-18)
- [fusion] `{ fuse: true, fuseCards: [...] }` requires the played card itself to carry the Fusion keyword; the revealed fuse card stays in hand (verify gates like "Earth fused this turn" via `expectActivationRejected`) — `packages/cards/src/cards/ELE/actions/ELE143-amulet-of-earth-blue.test.ts` (2026-08-18)
- [timing] after a turn cycle, run `game.helpers.untilIdle()` before the new turn's first play or begin-play rejects "not legal in the current layer position" — `packages/cards/src/cards/ELE/actions/ELE143-amulet-of-earth-blue.test.ts` (2026-08-18)
- [gap] has-status markers can exist in the types catalog without an `evaluateHasStatus` handler — every activation throws `FabRulesEvaluationError: unhandled has-status marker`; record §5 and block, never weaken assertions — DYN172 (W0-F, 2026-08-18)
- [gap] compiled `play-card {asType:"instant"}` continuous rules are not honored by begin-play (as-though-instant still charges 1 AP, CR 1.13); read-only module delayed-triggers may also miss printed this-turn scope — EVO008 (W0-F, 2026-08-18)
- [gap-card] unparsed `types:` fragments resolve by discrimination: named tokens ("types:Frostbite") → `filter: { name }` (ELE111); supertype+subtype compounds ("types:Ice affliction") → `filter: { typeBox: { supertypes, subtypes } }` — `packages/cards/src/cards/UPR/actions/UPR086-thaw-red.test.ts` (2026-08-18)
- [fixture] self-destructing permanents (Frostbite ELE111-a2, every Affliction) die at their controller's end phase, so they cannot be seated for a turn-2 start-phase test — create the live target during the opponent's turn via a create-token vehicle (UPR146 `controller: "any"` makes one under EACH player; the mover's copy dies at her end phase) — `packages/cards/src/cards/UPR/actions/UPR086-thaw-red.test.ts` (2026-08-18)
- [modal] graveyard start-phase modal: seat via `graveyard: [card]`; turn-1 game start does NOT fire it — `endTurn() ×2 + passBoth` surfaces `kind: "option"` (answer manually: resolveUntilIdle auto-picks the FIRST mode); after answering, ONE passBoth commits a real destroy while the turn is still live, and an empty-pool mode fizzles instantly (assert immediately, no pass) — `packages/cards/src/cards/UPR/actions/UPR086-thaw-red.test.ts` (2026-08-18)
- [gap] `additionalCost` on a triggered static ability is typed but never consumed by the trigger pipeline (only play-path kind:"modal" reads it) — the cost never surfaces, the card never self-banishes, and the trigger re-fires every turn; pin with a modal-refire assertion — `packages/cards/src/cards/UPR/actions/UPR086-thaw-red.test.ts` (2026-08-18)
- [gap] "banish one of the looked cards": the at-resolution pool scans before the look event commits, so `inObjectBinding: "revealed-this-way"` matches nothing → `banish: object target is unresolved`; only an optional→choose-card prefix (DTD215) flushes look bindings — pin the throw, keep the authored shape — `packages/cards/src/cards/UPR/actions/UPR168-tome-of-duplicity-blue.test.ts` (2026-08-18)
- [gap] there is no CR 8.5 ally-attack turn action — `activate(ally)` throws "not been migrated"; pin with `expect(() => …).toThrow(/not been migrated/)` — `packages/cards/src/cards/UPR/allies/UPR008-dominia.test.ts` (2026-08-18)
- [types] card-module `.abilities` is optional in the public shape — definition guards need `(card.abilities ?? [])` or `vp run check-types` fails TS18048 even though vitest passes — `packages/cards/src/cards/UPR/actions/UPR168-tome-of-duplicity-blue.test.ts` (2026-08-18)

## Engine-gap has-status handlers (EG-1) (2026-08-18)

- [gap] play-static cost-reduction conditions evaluate with EMPTY bindings and source = the played card itself (`playStaticResourceCostReduction`), so "the weapon"-style markers must resolve the referent from `facts.combat` — weapon attacks run through an attack-proxy whose `sourceObjectId` stays pointed at the SEATED weapon, so `facts.combat.attack` already IS the marker-bearing sword (CR 7.4.1/7.4.2 chain is open at reaction play time) — `packages/engine/src/rules/evaluation/conditions/has-status.ts` `weapon-sharpened-this-turn` (2026-08-18)
- [gap] "pitched this way" conditions read payment-time string bindings stamped in `procedures/activate-ability/stages/payment.ts` (`procedure.pitchedInstanceIds`) and `procedures/play-card/finalize.ts` (pitch events), mirroring `pitched-this-way-earth/ice/lightning-card`; classify attack actions by `subtypes.includes("Attack")`, non-attack actions by `types.includes("Action")` — `pitched-attack-and-non-attack-action-to-play-this` (2026-08-18)
- [worktree] cards tests in campaign worktrees silently run the MAIN checkout's engine: the steward symlink `submodules/flesh-and-blood/node_modules → main` routes `@tcg/*` workspace links (relative `../../../engine`) into main — tell from stack traces showing `/tcgo-fab/` paths; engine-gap batches must first replace the per-package `packages/{cards,engine}/node_modules` symlinks with real dir copies of main's (relative @tcg links then resolve inside the worktree) — false-green risk: a toThrow boundary can pass for the WRONG reason (unhandled-marker error instead of the asserted rejection) (EG-1, 2026-08-18)

## Definition-fix lane (W1-FIX) (2026-08-18)

- [fix] module `keywords:` must mirror the printed keyword line only: an authored `sharpen` on Swordmaster's Path auto-sharpened on play AND pre-consumed the a2 replacement — dropping it restores latch-only behavior, proven by 0 counters post-play + 2-counter doubled sharpen + 1-counter no-Path contrast — `packages/cards/src/cards/AHA/actions/AHA014-swordmaster-s-path-red.test.ts` (2026-08-18)
- [fix] unprinted `keywords:[goAgain]` makes a conditional go-again unconditional; after removal prove BOTH directions in one game: first copy no-refund (AP 2→1), second copy refunded because the first hit's Runechant ping (1 arcane, CR 8.6.3) precedes chain-link resolution — `packages/cards/src/cards/CRU/actions/CRU151-meat-and-greet-red.test.ts` (2026-08-18)
- [fix] token filters are exact-match with NO "Token" suffix: `name:"Runechant"` (CR 8.6.3), never `"Runechant Token"` — a 0-discount cost static fails silently, so assert leftover RP, not just absence of throws — `packages/cards/src/cards/ARC/actions/ARC100-rune-flash-red.test.ts` (2026-08-18)
- [harness] `activate(hero)` auto-drains the forced single-candidate entity-target decision (the sole sword for Hala's Sharpen) — do NOT call `.target(card)` afterwards; it throws "no pending entity-target decision" — `packages/cards/src/cards/AHA/actions/AHA014-swordmaster-s-path-red.test.ts` (2026-08-18)
- [gap] the engine does NOT strip sharpen +1{p} counters at end of turn (CR 8.5.58): cross-turn counter asserts find stale counters — scope timing tests to the printed "this turn" latch expiries (attack buff + replacement), which the engine does implement — `packages/cards/src/cards/AHA/actions/AHA025-swordmaster-s-path-blue.test.ts` (2026-08-18)
- [timing] cross-turn re-activation needs a pitchable card seeded in hand, then `game.helpers.resolveUntilIdle({ paymentCanonicalId: card.canonicalId })` pays it — assert via life totals / counter counts because resolveUntilIdle closes combat — `packages/cards/src/cards/AHA/actions/AHA014-swordmaster-s-path-red.test.ts` (2026-08-18)

## Resolution-sequence engine gaps + pins (W1-A) (2026-08-18)

- [gap] an unhandled has-status marker in a conditional sequence step aborts the WHOLE resolution — leading steps never commit and later steps never run; markers hit this batch: `weapon-sharpened-this-turn`, `prevented-damage-this-way`, `discarded-this-way-attack-action-card`/`-non-attack-`, `revealed-attack-and-non-attack-action-this-way` — pin the throw or block with a §5 row, never weaken — AHA007/AHA015/AHA020/ARC083/ARC084, plan §5 (2026-08-18)
- [pin] partially-provable cards follow the UPR086 shape: header "Fragment verdicts" (RESOLVED/BLOCKED per clause) + a test named `"... (engine gap)"` asserting the CURRENT wrong behavior with an explanatory comment — ARC044/ARC046/ARC051-053/ARC083/ARC120 suites (2026-08-18)
- [gap] the search primitive rejects same-zone destinations outright: search deck → "put on top of your deck" throws `search destination must differ from the searched zone` — pin the throw, prove the no-target boundary — `packages/cards/src/cards/ARC/actions/ARC046-nock-the-deathwhistle-blue.test.ts` (2026-08-18)
- [gap] look-cohort optional move-card (`objectFrom: binding, count: 1`) moves the WHOLE "them" binding — no filter/count is honored, so "put AN arrow into arsenal, rest to deck bottom" arsenals every looked card and the rest-to-bottom step never runs — ARC051/052/053 pins, plan §5 (2026-08-18)
- [gap] `require`-play `playedFromZones` rule-modifications are NOT enforced by play legality (only by defense/trigger filters) — "you cannot play action cards from your hand this turn" still allows hand plays — ARC044 misbehavior pin (2026-08-18)
- [gap] Action-Construct transform/equip resolutions never execute: the construct seats inert in `arena` and the equip/bind step is skipped — scratch-dump `zone("arena")`/`zone("weapon1")` to characterize, then block — AMX022, plan §5 (2026-08-18)
- [gap] authored search filters containing literal placeholder text never match anything ("Mechanologist Item Card With Cost X") — follow the ARC100/102 precedent: §5 row only, no committed test — ARC009 (2026-08-18)
- [gap] on-stack targets with `count: N` auto-settle the single available hero as ONE assignment — no targeting decision is offered, and count/allow-duplicates rule-mods sequenced after the damage step are unreachable — pin the under-deal (life 18 vs errata 16, decision null) — `packages/cards/src/cards/ARC/actions/ARC120-forked-lightning-red.test.ts` (2026-08-18)
- [fixture] a mirror-match seating (same hero both sides) throws at start — seat distinct heroes (kano vs bravo) for arcane-damage repros — ARC009/ARC120 scratch probes (2026-08-18)
- [probe] characterize suspected gaps with a `__scratch-*.test.ts` probe (try/catch + console.log of `h.zone(...)`, `life()`, `getState().decision`) BEFORE authoring pins; `zone("deck")` is bottom-first and `deckTop:` seeds top cards; delete the probe before committing — W1-A discipline (2026-08-18)

## Wave 1 — R:resolution|F:grant-property (2026-08-18, W1-B)

- [gap-card] conditional-keyword hoisting dominates this group: modules declare unprinted `keywords:[goAgain]` (ASR012/022 combo, AUA015 aura, AUR011/024 Lightning Flow, BOL010 charge) or `keywords:[overpower]` (BET010/021) making printed conditional keywords unconditional — pin per the CRU151 pattern: executable playline (condition met where authorable) + misbehavior pin (AP refund / defender cap with the condition NOT met) + stats boundary; one §5 row per base — W1-B batch (2026-08-18)
- [gap] authored `additionalCost { class:"effect", type:"remove-counters" }` has no `isPayablePlayCost` variant — begin-play denies with "unmigrated effect-cost declaration" and the card stays in hand; pin the throw, block the card — AHA009, plan §5 (2026-08-18)
- [arrange] condition vehicles: "played an aura this turn" → AJV017 Channel Mount Isen (cost-0 Ice/Action/Aura, go again, via `play` + `resolveRestOfCombat`); "played a Lightning card this turn" → OMN187 Cosmic Flare (cost-0 Lightning instant "Gain {r}{r}{r}" via `play` + `resolveUntilIdle`) — AUA015, AUR011/024 (2026-08-18)
- [act] charge mechanics: `attackWith(card, { charge: true, chargeCard })` pays the optional charge; observables are `zone("soul")` for the charged card and hand-count/zone for granted on-hit effects — BOL001-boltyn.test.ts is the local exemplar — BOL010/011/014 (2026-08-18)
- [act] arrow attacks from the arsenal pay the arrow's printed cost — seed `resourcePoints` the SAME turn; the pool resets at end of turn so cost>0 arrows break turn-cycle tails (swap to a cost-0 arrow like SEA092 for next-turn asserts) — AZL027 (2026-08-18)
- [act] two simultaneous on-hit triggers (the arrow's own + a floating grant) need `game.closeCombat({ ordering: "listed" })`; `resolveRestOfCombat` throws on the ordering decision — AZL027 (2026-08-18)
- [boundary] the defend step precedes the reaction step: a mid-chain attack-reaction +{p} boost lands AFTER defenders are declared, so "{p} greater than its base" conditions evaluated for defend-time keywords are unreachable via reactions — BET010/021 (2026-08-18)
- [assert] overpower observable: `defender.expectBlockRejected([actionA, actionB]).errorCode === "overpower"` (defender may use at most ONE action card); a single action-card block stays legal — BET010/021 (2026-08-18)
- [arrange] floating `appliesTo: { next: … }` grants (AZL027 Toxicity "next Assassin or Ranger attack action card") are engine-supported: seed the arrow in `arsenal`, play the granter, then `attackWith(arrow, { from: "arsenal" })`; boundaries via a non-matching attack (Generic WTR167 Snatch) and a cost-0 arrow next turn for expiry (2026-08-18)

## Arcane-damage resolution pings (R:resolution|F:deal-damage) (2026-08-18, W1-C)

- [arcane] flat arcane pings ("Deal N arcane damage to target hero") prove with `play(card, {target: Dash.id})` + `passBoth`; the Arcane Barrier boundary answers `Dash.expectDecision("option")` + `chooseOptions(options[0]!.id)` after passBoth (prevents exactly 1, drains 1 {r}); "any hero" pings may self-target, "opposing hero" pings auto-resolve to the sole opponent — `packages/cards/src/cards/ARC/actions/ARC141-scalding-rain-red.test.ts` (2026-08-18)
- [arcane] "next arcane card this turn deals +X" replacements (Aether Flare) follow the ARC123 golden: the boost asserts on the FOLLOW-UP card's damage (the name-filtered per-turn count already holds the flare's own ping), a second arcane card is unboosted (next-only latch), and this-turn expiry needs a turn cycle with `pitch: [card]` to pay the later turn — `packages/cards/src/cards/ARC/actions/ARC132-aether-flare-red.test.ts` (2026-08-18)
- [arcane] banish→play-as-instant optionals (Reverberate) drain in order after `passBoth`: `chooseBoolean(true)` → `chooseTargets(wizardAction)` (candidate validation throws on a non-Wizard pick = the printed targeting restriction boundary) → `chooseBoolean(true)`, then `play(card, {from: "banished", target})`; the permission expires at turn cycle (`expect(() => play).toThrow()`) — `packages/cards/src/cards/ARC/actions/ARC138-reverberate-red.test.ts` (2026-08-18)
- [timing] a pending optional on the resolving card (Lesson in Lava search) blocks BOTH its own finish (card stuck on stack → GY assert fails) and the next `begin-play` ("Decision decision-1 must be answered") — answer it (`chooseBoolean(false)`) right after the damage assert — `packages/cards/src/cards/ARC/actions/ARC121-lesson-in-lava-yellow.test.ts` (2026-08-18)
- [gap] authored filters can contradict printed text silently: `subtypes:["Reaction"]` never matches action cards (ARC119), pseudo-keyword `hasKeyword:"r-cost-…"` matches nothing (ARC121), and damage-dealt counts are not target-scoped ("to that hero", ARC118) — pin the assertable clauses green, record §5, block the rest — W1-C §5 rows (2026-08-18)

## Resolution create-token (R:resolution) (2026-08-18)

- [token] resolution create-token trios: `play(card)` + `resolveUntilIdle()`, then assert `zone("arena")).toContain("token:<slug>")` + `expectFabPlayer(h).toHaveTokenCount(slug, n)`; Runechant CR 8.6.3 consumption timing = follow-up `attackWith(brutalAssaultBlue)` burns every seated Runechant (3 tokens → +3 arcane on the hit) — ARC103-105, ARC109-111 (W1-D, 2026-08-18)
- [timing] Flurry-style "when you activate a weapon attack, destroy this" triggers sit on the stack AFTER `activate(weapon)`: sequence `activate` → `passBoth()` → `decline()` → `resolveRestOfCombat()`; a bare `decline()` right after activate throws "No pending decision" — AHA024 (W1-D, 2026-08-18)
- [act] printed "+N{p} this turn" buffs on a non-attack action apply to a LATER attack: play the buff card first, then `attackWith(recipient)` and assert `expectCombat(game).toHaveAttackPower(base+N)`; mid-combat non-attack plays are illegal (CR 7.0.1a/7.6.3a encoded in rules/legality/play.ts) — DYN049 (W1-D, 2026-08-18)
- [arrange] quiet hero picks: iraScarletRevenger (ASR001 — second-attack-only buff never fires in single-attack tests), oldhimGrandfatherOfEternity (ELE001 — zero static abilities), chane (CHN001) for banished-zone plays; `playAttack(card)` + `closeCombat()` is the vanilla-attack fast path; tokens created "in your hand" assert via `zone("hand")).toContain("token:<slug>")` — DYN049, DTD141 (W1-D, 2026-08-18)
- [gap-card] compound token slugs ("might-and-a-vigor") are module authoring defects: create-token throws "absent from match program"; `splitCompoundCreateTokens` only handles the Ponder pattern — BET026, plan §5 (W1-D, 2026-08-18)
- [gap] declared-but-unhandled has-status markers make EVERY play throw `FabRulesEvaluationError` before branch selection — check CONDITION_STATUS_HANDLERS coverage when a card conditions on an exotic marker; nothing can seed statuses via FabPlayerFixture either — DYN123, plan §5 (W1-D, 2026-08-18)
- [gap] create-token + `appliesTo.next` + `controller: "attack-target"` is not a supported deferral: the layer schedules eagerly, the play is rejected with no prior combat, and after any closed combat the tokens appear immediately with no qualifying hit; author as a triggered hit event instead (ELE159 shape) — ELE163, plan §5 (W1-D, 2026-08-18)

## Engine-gap has-status handlers round 2 (EG-2) (2026-08-18)

- [handler] pick the reader archetype from the marker's evidence source: event-binding readers where the underlying effect stamps a string binding (reveal/look stamp the `revealed-this-way` cohort on every event; handler reads `context.bindings?.objects?.[name]`), turn-fact readers where the marker describes turn history (`completed-a-contract-this-turn` reads a plumbed fact keyed by controllerId) — `packages/engine/src/rules/evaluation/conditions/has-status.ts` (EG-2, 2026-08-18)
- [wiring] turn-fact plumbing checklist (cranked pattern — miss any step and it type-fails or silently reads undefined): `game/turn-history.ts` field + `emptyFabTurnHistory` default → reducer stamps `player.history.turn.X` → `rules/state-rules-view.ts` fact derivation → `rules/rules-view.ts` fact type → `rules-evaluator.ts` `EMPTY_RULES_FACTS` → the hand-built full-facts fixture in `rules-evaluator.test.ts` (enumerates EVERY key) — DYN123 (EG-2, 2026-08-18)
- [contract] contract completion already had an owning reducer: `contractCompletedByEvents` auto-commits in the transaction kernel → `complete-contract` event → `reducers/mechanics.ts` — stamp `history.turn.completedAContract` THERE (idempotent, CR 8.5.39b); contract cards complete end-to-end via Bravo Eradicate's decision loop (`chooseBoolean(true)` → `passBoth()` on the rulesStack) — DYN123 (EG-2, 2026-08-18)
- [binding] reveal/look stamp ONLY the `revealed-this-way` cohort plus an optional per-event `outputBinding`; `proposeSequence` threads event bindings into later steps' layer (`layerWithEventBindings`), so later conditionals AND `selector:"binding"` targets can read them — but a move-card targeting a binding NO step ever stamped (ARC084 `"them"` with no `outputBinding`) is a LEGAL NO-OP (CR 1.8.6/5.3.4b), not unsupported: the resolution completes and nothing moves — ARC084 pin, plan §5 (EG-2, 2026-08-18)
- [stop] markers describing POST-resolution events ("prevented damage this way") cannot be served by resolution-time sequence conditionals: CR 6.4.10h rides damage application via prevention `additionalModification` (engine already supports create-token mods, gated `preventedAmount > 0`); a fact-reading handler would evaluate once at play time and silently never fire — leave the trapdoor throwing and re-encode the module (same family OMN169/OMN170/OMN171) — AHA015 STOP, plan §5 (EG-2, 2026-08-18)
- [assert] `expectFabCard(...).toBeIn("deck")` can never pass: the fluent ref resolver refuses deck-hidden cards (`FabCardRefNotFoundError`, deck is outside FAB_CARD_REF_SCOPE) — deck asserts use `player.cardsIn("deck", card)` lengths/order instead — ARC084 (EG-2, 2026-08-18)
- [trapdoor] the unhandled-marker throw surfaces at RESOLUTION (`passBoth`/`resolveUntilIdle`), not at `play()`: the play is legal, the card reaches `zone("stack")`, and the post-throw state stays assertable (no tokens, arena checks) — pin all three observables separately — AHA015 (EG-2, 2026-08-18)
- [engine-test] handler tests should derive type-box helper types from the engine's own shape (`FabRulesBaseObject["base"]["typeBox"]["types"]`) instead of `string[]` — the `satisfies`-checked handler table rejects widened arrays — `packages/engine/src/rules/reveal-and-contract-status.test.ts` (EG-2, 2026-08-18)

## Resolution modify-numeric round 2 (W1-E, 2026-08-19)

- [latch] "next <class> attack action this turn" trios (Locked and Loaded / Oath of the Arknight): `play(buff)` + `resolveUntilIdle({entityTargets:"minimum"})`, then `must.playAttack(recipient)` + `advanceCombatTo("defend")`; with a Runechant seated (Oath a2) the burn trigger pends an `ordering` decision at the FIRST link's resolution — the next `advanceCombatTo("resolution")` dies with "Decision must be answered"; drain with `resolveUntilIdle({entityTargets:"minimum", ordering:"listed"})` between links instead — ARC091-093, ARC032-034 (W1-E, 2026-08-19)
- [fixture] two identical seeded copies make the second verb ambiguous ("Ambiguous card ref ... 2 instances"): pick a distinct sibling for second-link/consumption legs (overLoopBlue for Mechanologist, runeragerSwarmRed for Runeblade) — ARC032 (W1-E, 2026-08-19)
- [dr] a Defense Reaction played in the reaction step still blocks with its printed {d}: damage = attackPower − debuff − DR defense (ASB025 vs 6{p} Throttle: 6−2−3 = 1); and `resolveRestOfCombat()` (resolveCombatNoReactions) stalls while the reaction sits on the stack — use `resolveUntilIdle({entityTargets:"minimum", ordering:"listed"})` for full damage asserts — ASB025 (W1-E, 2026-08-19)
- [gap-card] unprinted `keywords:[opt(1)]` next to an authored conditional opt (CRU151 opt variant) has NO public discriminator: opt never changes deck count and its decision is indistinguishable from priority without private inspection — commit the provable +N{p}/go-again trio, record §5, leave the clause unasserted — ARC032-034, plan §5 (W1-E, 2026-08-19)

## Delayed triggers (R:resolution|F:delayed-trigger) (2026-08-18)

- [policy] `delayed-trigger` + `policy:{kind:"until-triggered"}` is ONE-SHOT and never time-expires: printed turn-scoped "whenever … this turn" riders (ELE044-052 bolts) neither re-fire on a second same-turn qualifying event nor expire at the turn cycle — pin the second-event symptom (token count stays / life plain / no new decision) and record §5; the engine's turn-scoped shape is windowed + `matching:"every"` + `expiresAt:"turn"` — ELE044-052, plan §5 (W1-F, 2026-08-18)
- [authoring] ability-level `condition:{type:"has-status"}` on the delayed effect is evaluated once at SCHEDULING with empty bindings → fail-closed false forever: DTD051/052 never register their trigger despite the yellow soul charge (`delayedTriggers: []`); the working shape is the ASB003 sequence — the charge observation stamps the `yellow-charged-this-way` binding and a same-sequence conditional step reads it — DTD051/052, plan §5 (W1-F, 2026-08-18)
- [playline] Guardian instants arm their delayed defend-trigger from the link-1 REACTION window: `playAttack` → `advanceCombatTo("reaction")` → attacker `pass()` → `Bravo.play(instant)` → `passBoth()` → `resolveRestOfCombat()`; the +N{d} lands on the chain-link defense AGGREGATE (temper caps the seated card's post-chain read at 1) so assert via life totals across a second defended link (control 10 vs instant 14) — DYN042-044 (W1-F, 2026-08-18)
- [arrows] fused arrow verbs: `attackWith(arrow, {from:"arsenal", fuse:true, fuseCards:[fodder]})` — the fuse card stays in hand (`expectFabCard(h,fodder).toBeIn("hand")`); the second same-turn attack for one-shot pins is `attackWith(other, {pitch:[resource]})`; from-hand `attackWith` throws (CR 8.2.6a) — ELE044-052 (W1-F, 2026-08-18)
- [unless] unless-riders inside `closeCombat()` surface serial decisions — wrap each call in try/catch: boolean "Use the optional effect …?" (= the pay escape) → `chooseBoolean(false)` → re-`closeCombat()` catch → `chooseTargets(distinctCard)` → `closeCombat()` completes; the pay branch asserts `expectFabPlayer(h).toHaveResourceCount(0)`; identical duplicate cards in hand make `chooseTargets` throw FabAmbiguousCardRefError — seed DISTINCT cards (nimblismBlue + brutalAssaultRed) — ELE050-052 (W1-F, 2026-08-18)

## Resolution damage-prevention (R:resolution) (2026-08-18)

- [priority] mid-combat defensive instants: after walking to the reaction step (`declareNoDefenseIfPending()`/pass loop until `combat()?.step === "reaction"`), call `helpers.passPriorityTo(defender)` BEFORE `.play()` — begin-play is otherwise rejected "Only the player with priority may begin this play"; main-phase defensive plays need the same `passPriorityTo` — CRU041-043, CRU125, DTD100-102, EVR033-035 (W1-G, 2026-08-18)
- [prevention] CR 6.4.10 expectations the engine honors: fixed one-off shields are consumed by the first MATCHING event (Cloud Cover 2-of-any-type; Feign Death full event-amount; BoS {p}-only; BoD latches until a Shadow source actually deals damage), non-matching damage neither prevented nor consuming (BoS vs arcane bolt, BoD vs non-Shadow attack), and the Feign-Death play gate rejects cleanly (`toThrow(/play condition is not satisfied/)` — same pattern as HNT149) — W1-G trios (2026-08-18)
- [prevention] Steadfast-style at-resolution combat-chain source binding covers only the chosen source object: post-combat instant effect damage and a second attack from a different object are NOT covered (shield 6 vs 4p attack → 20, then bolt → 17, second snatch → 16); playing it OUTSIDE combat is unresolvable ("prevention damage source is unresolved" poisons the next pass) so drive it from the reaction step — EVR033-035 (W1-G, 2026-08-18)
- [gap] conditional prevention amounts evaluated against unhandled has-status markers take the THEN-branch for a hero without the status (ENG023 `transcended-this-turn`: non-transcended hero prevents 3, not 1) — sibling of the DYN123 trapdoor; also DTD209 shows optionalCost effect-shapes outside admission.ts's whitelist (banish-from-hand-or-arsenal) + no lethal-damage primitive → "prevention shape is not yet canonical" — ENG023, DTD209, plan §5 (W1-G, 2026-08-18)
- [tooling] `vp test run` exits 0 even on suite-load errors and BSD grep silently drops `\s` in -E patterns — gate per-card commits on the captured output (`grep -q passed && ! grep -qi fail`), not the exit code — W1-G (2026-08-18)

## Resolution rule-modifications (R:resolution|F:rule-modification) (2026-08-18, W1-H)

- [gap] resolution-kind rule-modifications with action "defend" NEVER materialize a continuous rule during the defend window (continuous-rule-effects.ts compiles them at layer resolution, after the defend/reaction steps): quoteDefense sees no restrict/require rule, so "can't be defended by equipment" (EVO204-206), "can't defend with attack action cards with cost less than X" (EVO061-063) and "must defend with X equipment" (CRU103, EVO059) are all unenforced — pin the accepted-illegal block as the boundary test, keep a vacuous-rule happy (X=0, no boost/no Evo) for resolution math — W1-H §5 rows (2026-08-18)
- [act] isolate the gap with positive controls before pinning: T-Bone EVR074 (static/triggered require/defend → `restricted_by_rule` enforced) and C&C ARC159 (resolution action "play" → `defense_reactions_blocked` enforced) both bite — the defect is specific to resolution-kind defend-action rules (2026-08-18)
- [arrange] boost-chain setup for "times you have boosted this combat chain": `attackWith(zeroToSixtyRed, {boost:true})` → `advanceCombatTo("resolution")` → `attackWith(shockwave)` keeps one chain; the skipped link-1 defend window means its damage lands unblocked (20−4−2=14 with Snatch on link 2) — CRU103 (2026-08-18)
- [act] Evo-count X: equip evoCircuitBreakerRed (types include "Evo") on the attacker's head slot → "number of Evos you have equipped" = 1; -1{d} counters seed via `game.as(bravo).findCardInZone("head", card)` + `game.setCounters(id, {defenseCounterTotal:-1})` at the defend step — EVO059/EVO061-063 (2026-08-18)
- [gap] allow/activate grants ("activate bows an additional time this turn") materialize only after the chain closes and grant nothing: the second bow activation is rejected `activation_limit` (assert `expectActivationRejected(deathDealer).errorCode`); the unfused contrast proves the once-per-turn baseline behaves — ELE041-043, plan §5 (2026-08-18)
- [gap-card] exotic has-status markers keep the fail-loud trapdoor pattern: `defended-by-fewer-than-2-cards` (AZL015 +3{p} static) has no CONDITION_STATUS_HANDLERS entry, so the arrow is UNPLAYABLE at declaration — pin `expect(() => attackWith(widowmakerRed, {from:"arsenal"})).toThrow(/unhandled has-status marker/)` — AZL015, plan §5 (2026-08-18)

## W2-FIX2 definition-fix lane round 3 (2026-08-18)

- [fix] CRU151-class unprinted `keywords:[...]` removals flip the misbehavior pin into the true boundary: with the module keyword gone the card's own conditional resolution ability carries the printed clause — prove the negative direction (conditional vehicle absent → AP 0 / block legal) and the positive direction (vehicle played/charged first → AP refund) — ASR012/022, AUA015, AUR011/024, BOL010 (2026-08-18)
- [arrange] "{p} greater than its base" IS reachable at defend time: a continuous while-in-arena +1{p} aura (APS026 The Suspense Is Killing Me, played BEFORE the attack) applies at attack declaration, ahead of both the resolution-ability conditional and the defend step — reactions remain too late (W1-B lesson holds for reactions only), auras are not — BET010/021 (2026-08-18)
- [act] verify blocker defense values before computing boundary life totals: snatchRed defends 2 (not 3) — a 6{p} attack blocked by two 2{d} cards deals 2 (defender 20 → 18) — BET010 (2026-08-18)
- [gap-card] binding-matches filters for "action card" pools must use types+supertypes, never `subtypes:["Reaction"]` ("Attack Reaction"/"Defense Reaction" are types): the ARC138 golden shape `{types:["Action"], supertypes:["Wizard"]}` (+ `excludeSubtypes:["Attack"]` when printed) — ARC119 (2026-08-18)
- [gap-card] cost-ceiling search filters use the ARC138 shape `cost:{op:"lte", value:{type:"count", what:"damage-dealt", per:"turn", filter:{name:"<source card>"}}}` (Aether Spindle source-count idiom), never pseudo-keywords; the search decision pre-scopes candidates by the filter, so `expectDecision("entity-target").candidates` is the cheapest filter proof — ARC121 (2026-08-18)
- [act] deck instances are invisible to zone-less card refs: answer search target prompts with `chooseTargets(player.cardIn("deck", card))` (instance refs pass through); an empty-candidate search (mayFail) answers with a bare `target()` — ARC121 (2026-08-18)
- [gap] "shuffle your deck and put it on top" destinations remain engine-unsupported: the search primitive rejects same-zone moves ("search destination must differ from the searched zone") once a card is chosen — ARC046/ARC121 class; also prevented damage is NOT dealt, so Arcane Barrier observably shrinks a dealt-damage ceiling (3 → 2 excludes cost-3 Wizard cards) — ARC121 (2026-08-18)

## W3-C R:resolution|F:grant-property [14:28] (2026-08-19)

- [pin] CRU151-class dominate variant: pin the unprinted `keywords:[dominate]` with `expectCombat(game).toHaveKeyword("dominate")` + `Dash.expectBlockRejected([c1,c2]).errorCode === "dominate"` where the printed conditional would allow the two-card defense, then prove the single-card defense stays legal — CRU013/014/015 (2026-08-19)
- [gap] granted `name:"This"` on-attack triggers (event:"attack" + any-hero target) NEVER fire — no ping, no decision; pin the missing damage and note the untested idiom cohort (MST127-129/UPR099/MON185) — CHN014/CHN016, plan §5 (2026-08-19)
- [gap-card] `names:["<Type> Attack"]` conditions can never match: the engine matches `names` against card NAMES, so "Draconic Attack" is dead — the correct shape is typeBox supertypes:["Draconic"] — CIN024, plan §5 (2026-08-19)
- [vehicle] no implemented card is both an Angel and an attack (Angel subtypes live only on allies/weapons/instants): "next Angel attack" positives are unprovable end-to-end — author the a2 negative no-leak boundary on a non-Angel chain link and §5 the positive — DTD032/DTD033 (2026-08-19)
- [vehicle] MON008 Herald-of-Triumph family is UNPLAYABLE (`duration:"while-condition"` modify-numeric → "continuous duration is not yet canonical"); MON023-herald-of-tenacity is the playable nameContains:"Herald" attack action — MON008, plan §5 (2026-08-19)
- [act] mid-combat instants: the DEFENDER holds priority at the defend stop — `Dash.pass()` first, then the attacker plays the instant; declared-on-stack chain targets ride the play options as `targetInstanceId: Prism.cardIn("combatChain", card).instanceId` (no entity-target decision pends) — DTD032/DTD033 (2026-08-19)
- [act] hit-triggered discards surface as ORDERING decisions: `resolveRestOfCombat` throws — drive them with `resolveUntilIdle({ ordering: "listed" })` — CRU124 (2026-08-19)
- [act] arrows cannot be played without a bow: seat `weapon1: [deathDealer]` before `attackWith(searingShotRed, ...)` or begin-play rejects "An arrow can only be played if you control a bow" — CRU124 (2026-08-19)
- [act] fixture riders count toward life totals: searingShotRed carries its own printed "hits → lose 1{h}" rider (4{p} hit = 15 life from 20), and Blood Debt is ONLY a banished-zone end-phase trigger — combat resolution still lands the card in the graveyard (CR 8.3.11) — CRU124, CHN013 (2026-08-19)
- [act] "until end of turn, arrows you control gain ..." grants ARE floating: the compiled atom re-evaluates membership, so an arrow played AFTER the granting action resolves still receives the granted hit-trigger — CRU124 (2026-08-19)

## W3-FIX3 definition-fix lane round 4 (2026-08-19)

- [arrange] deck fixtures are BOTTOM-first: the top-2 cards are the LAST two deck entries — seeding the intended reveal/search pair at index 0 silently gates on the wrong cards (reveal events fire and carry bindings, but the pair-condition classifies the wrong two cards, so the gate fails with no error) — ARC084 (2026-08-19)
- [act] the opening attack must come from player 1 (the priority holder): seat the attacker as the FIRST player when a test opens with attackWith — a player-2 begin-play is rejected "Only the player with priority may begin this play"; heroes' max life differs (Hala 40, not 20) — check the hero module before writing life expectations — AHA015 (2026-08-19)
- [gap-card] the authoring shape for "If you prevent damage this way, create a token" is a SINGLE prevention effect with a create-token additionalModification (HVY140/HVY160/HVY180, CR 6.4.10h, fired only when preventedAmount>0); OMN169/OMN170/OMN171 modules are themselves mis-encoded as resolution-time sequence conditionals — do not copy them — AHA015 (2026-08-19)
- [gap-card] reveal steps must declare outputBinding for follow-up move-card bindings: the engine stamps effect.outputBinding + revealed-this-way on reveal events (CHN030 precedent) and an undeclared binding is a legal move-card no-op (CR 1.8.6/5.3.4b) — the revealed pair silently stays in the deck while the rest of the resolution completes — ARC084 (2026-08-19)
- [fix] compound token slugs (e.g. `might-and-a-vigor`) throw "absent from match program" — author one create-token leaf per printed token (TCC105 might, TCC107 vigor), LGS355 sequence-of-leaves shape — BET026 (2026-08-19)
- [gap] damage-dealt counts cannot be recipient-scoped in the module schema: the counter sums the dealer's whole-turn output (filter = source objects only) and the facts key per damage source (sourceDamageDealtToHeroThisTurn) or per recipient losing the dealer (playerDamageTaken) — "arcane damage you have dealt to that hero this turn" needs an engine count primitive; module STOP — ARC118 (2026-08-19)

## Charge / banished-play / blood-debt conditionals (W3-A resume) (2026-08-19)

- [permission] "You may play this from your banished zone" statics (`playEffect role:"permission", fromZones:["banished"]`) are functional for seated banished copies: `attackWith(card, {from:"banished"})` for attack actions and `play(card, {from:"banished"})` for non-attack actions, costs unchanged — CHN010/CHN018/CHN022 (2026-08-19)
- [blood-debt] CR 8.3.11 Blood Debt proves with an unplayed banished copy: `endTurn()` + `helpers.untilIdle()` → controller life −1 per public blood-debt card at the end phase (no play needed) — CHN010/CHN018 (2026-08-19)
- [status] `dealt-arcane-damage-to-opposing-hero-this-turn` is a handled marker (reads playerDamageDealt turn.arcane > 0); scaldingRainRed (ARC141, 4 arcane to `target: Dash.id` + `resolveUntilIdle`) is the turn-history vehicle — CHN010/CHN018 (2026-08-19)
- [gap-card] `last-attack-this-combat-chain` `names:` exact-matches the previous attack's printed card NAME — type-line pseudo-names ("Draconic Attack") never match (ARC100 class, CIN013 §5); the supported shape is `filter: { typeBox: { supertypes/subtypes } }` per MST164 (2026-08-19)
- [chain] "if <X> was the last attack this combat chain" two-link probes: `must.playAttack(link1)` + `advanceCombatTo("resolution")` + `must.playAttack(link2)` + `advanceCombatTo("defend")` — works even when link 1 has NO go again (snatchRed) as long as AP remains — CIN013 (2026-08-19)
- [combat] under FAB_MANUAL_HARNESS a `must.playAttack` opening a FRESH chain (previous one closed by `resolveRestOfCombat`) has no active link yet — insert `advanceCombatTo("defend")` before `expectCombat(...).toHaveAttackPower`, else "found none" — BOL017 (2026-08-19)

## W3-FIX4 delayed-trigger definition fixes (2026-08-18)

- [fix] dead ability-level `condition:{type:"has-status"}` on a delayed effect (charge-stamped markers) is fixed by the ASB003 SEQUENCE re-encode, not by moving the condition: optional charge as the FIRST resolution step stamps the `yellow-charged-this-way` binding, a same-sequence conditional step reads it and arms the delayed trigger — keep `label:{name:"charge"}` on the optional so the boolean prompt stays recognizable — DTD051/052 (W3-FIX4, 2026-08-18)
- [policy] the two turn-scoped delayed-trigger shapes: "The next time … this turn" = `{kind:"windowed", duration:"this-turn", matching:"first"}` (one-shot WITH turn expiry); "whenever … this turn" = `{kind:"windowed", duration:"this-turn", matching:"every"}` (multi-fire, golden AIO004 heavy-industry-power-plant) — `until-triggered` is one-shot AND never time-expires, so it fits neither printed window — DYN042-044 / ELE044-052 (W3-FIX4, 2026-08-18)
- [turn-cycle] cross-turn expiry repro: `P1.endTurn(); P2.endTurn(); game.helpers.untilIdle()` then a next-turn qualifying attack; if the defender carries live tokens (2 Frostbites raise simultaneous end-phase destroys) `untilIdle` dies on an ordering decision — pass `{ordering:"listed"}` — ELE044-046 (W3-FIX4, 2026-08-18)
- [assert] floating `resourcePoints` reset across the turn cycle (seeded 1 reads 0 after endTurn ×2) — never assert resource counts across a turn boundary; the structural no-decision proof (bare `closeCombat()` completing where a pending boolean would throw) is stronger — ELE050-052 (W3-FIX4, 2026-08-18)
- [auto] on the SECOND unless fire, a discard with a single remaining hand candidate force-resolves after the boolean — walk as `try{closeCombat()}catch{} → chooseBoolean(false) → closeCombat()` with NO chooseTargets leg — ELE050-052 (W3-FIX4, 2026-08-18)

## W3-B resolution-sequence batch (R:resolution|F:sequence, G2-auth[14:26]) (2026-08-18)

- [chain] combo ("last attack this combat chain") cards: a full `resolveUntilIdle` between links CLOSES the chain and disarms the combo (Crane Dance then resolves plain 3{p}) — chain links on an OPEN chain (`playAttack` → `passBoth()` → `advanceCombatTo("resolution")` → next `playAttack`, engine combo-suite idiom) and seat bravo so no hero passive injects hit-step decisions — CRU054/CRU055/CRU057 (W3-B, 2026-08-18)
- [chain] `resolveCombatNoReactions()` closes combat without draining the turn, so go-again AP refunds are assertable right after close (2-attack combo chain nets back to starting AP; solo no-combo contrast stays at 0) — CRU057 (W3-B, 2026-08-18)
- [deck] deck fixtures are bottom-first and the LAST array element is the look/reveal target: seed distinct cards on top to pin reveal/move defects (a revealed card that never moves stays `zone("deck")`, absent from `zone("hand")`) — CRU055, ARC135-137 (W3-B, 2026-08-18)
- [probe] resource-starved probes manufacture false engine verdicts: BOL029's dusk-path activation-limit lift and CRU009's copper-destroy BOTH work once the probe carries resources (d2 control rejected `activation_limit`, d3+dusk+optional accepted; seeded roll 3→1 destroy / 4→2 / 1→0) — re-probe rich before filing §5 — BOL029, CRU009 (W3-B, 2026-08-18)
- [seed] dice rolls are deterministic per exact fixture layout: scan seeds per fixture and read `committedEvents().find(e => e.name === "roll")?.data` (`{sides, result}`) — CRU009 (W3-B, 2026-08-18)
- [window] defender instants ride the reaction window: attacker as player-1 `playAttack` → `advanceCombatTo("defend")` → defender `defendWith()` (variadic — ONE call is the full block declaration) → attacker `pass()` → defender `play(instant)` — AZS025 (W3-B, 2026-08-18)
- [counter] counters with no public readout are provable through their printed effect: holo counters via ward value (ward 2 with counter vs 1 without → life 20−(4−2)=18 proof + shield destroyed at resolution) — AZS025 (W3-B, 2026-08-18)
- [life] hero life baselines: kano ARC114 is Young 15 (not 20), dash 20, boltyn Young 20; multi-attack fixtures need actionPoints ≥ attacks (BOL028's second attack needed 3) — BOL028 (W3-B, 2026-08-18)
- [gap] the has-status trapdoor family grows: `attacks-a-light-hero` (CHN024) wedges resolution AFTER the choose-card answer — pin the wedge observables (card not in GY, no damage, boolean decision pending) — CHN024, plan §5 (W3-B, 2026-08-18)
- [gap-card] look-cohort moves without count/filter relocate the WHOLE looked block (listed order) with zero player decisions — pin the resulting deck-order array; printed top-1/bottom-order selection unprovable — ARC135/136/137, plan §5 (W3-B, 2026-08-18)
- [gap-card] reveal-in-delayed-trigger never stamps the sibling conditional's binding ("it" dead at `binding-matches`), `move-card {selector:"self"}` targets the source card not the revealed card, and reward sequences outside `conditional.then` run unconditionally — three independent mis-encodes, all pinnable from deck-top control — CRU055, plan §5 (W3-B, 2026-08-18)

## W3-F R:resolution|F:modify-numeric [36:50] (2026-08-19)

- [act] Trade In (UPR214) is the same-turn 6+{p} discard vehicle for Brute "if you've discarded…" conditionals: `play(tradeInBlue)` + `resolveUntilIdle({optionalBoolean:true, entityTargetCanonicalId:<6p card>})` drains the on-attack optional and closes its combat — CRU016-018 (2026-08-19)
- [gap] `played-at-chain-link-3-or-higher` is declared but unhandled (only the Rupture `-4-or-higher` sibling has a handler) — the declaration throws at ANY link; pin both a link-1 and a qualifying link-3 attempt — CRU064/065, plan §5 (2026-08-19)
- [gap-card] Reprise look→banish→play chains die on `subtypes:["Reaction"]` binding filters ("Attack Reaction" is a TYPE, CR 1.3.2c — ARC119 class): the a1 weapon buff still lands; pin the never-offered optional via decision-null + deck/banished zone asserts — CRU083, plan §5 (2026-08-19)
- [act] attack-reaction power asserts need the layer RESOLVED — `must.playReaction(card)` + `passBoth()` before `expectCombat(...).toHaveAttackPower`, else you read the pre-resolution power — CRU083/088-090 (2026-08-19)
- [assert] "Target weapon attack" reactions auto-settle the sole on-chain Weapon (no entity-target decision pends); block with nimblismBlue (non-attack hand card) to keep Cintari Saber's attack-action-conditional +1{p} out of the math — CRU083/088-090 (2026-08-19)
- [act] dominate proofs: weapon attack FIRST (`activate(saber)` + `resolveRestOfCombat`), then play the granter, then `attackWith(snatch)` + `expectBlockRejected([c1,c2]).errorCode === "dominate"`; the no-weapon-attack contrast accepts the two-card block — CRU094-096 (2026-08-19)
- [act] cross-turn latch expiry with an activation payment: `activate(weapon)` + `resolveUntilIdle({paymentCanonicalId})` closes combat — read the result from life totals, not attack power (AHA014 rule) — CRU094-096 (2026-08-19)
- [count] `boosts-this-combat-chain` counts on OPEN chains stack per boosted link (`attackWith(zeroToSixtyRed, {boost:true})` + `advanceCombatTo("resolution")` each); `resolveRestOfCombat` closes the chain and resets the count — CRU112/113 (2026-08-19)

## REV-1 tail rows 316-327 (2026-08-19)

- [prevent-trigger] "whenever this prevents damage" optionals surface only after an extra passBoth lands the triggered layer — accept() right after the barrier option throws "no pending decision" — `packages/cards/src/cards/UPR/equipments/UPR166-alluvion-constellas.test.ts` (2026-08-19)
- [invocation] flip-layout invocations (transform-into-resolving-card + layout.flip family:"invocation") transform and seat end-to-end (endurance counter, go-again, ash-under-host); plain `into:"name"` invocation actions WITHOUT a layout park inert in the arena (AMX022 family) — UPR017 green vs UPR014 pinned (2026-08-19)
- [protect] the 1v1 protect playline is golden at `packages/engine/src/rules/card-behavior/proven/trigger/trigger-protect.test.ts`: attack the ally INSTANCE (`attackWith(card, { target: allyId })`), defend with the protect card via `exec({ move: "defend", payload: { instanceIds } })`; hero-target defends fire no protect event — TCC027/029/048 (2026-08-19)
- [harness] zero-cost attacks under the smart harness resolve past the layer step before attackWith's walker looks ("Expected an unresolved attack-card rules process") — use `playAttack` instead — `packages/cards/src/cards/SUP/instants/SUP097-concealed-object-blue.test.ts` (2026-08-19)
- [harness] instant-item plays spawn trigger layers (hero statics reacting to the boo) that `passBoth` does not drain — walk with `helpers.resolveUntilIdle()` before the next begin-play — SUP097 (2026-08-19)
- [suspense] suspense-exhaustion timing needs a bounded `endTurn()/untilIdle()` cycle loop keyed on the arena no longer containing the aura; red frames exhaust within 1-2 full cycles — SUP175/SUP171 (2026-08-19)
- [authoring] `declared:"on-stack"` + `zones:["combat-chain"]` is a dead-target contradiction (an attack is never on the stack AND on the chain) — the activation is rejected outright; pin + §5 — SUP097 (2026-08-19)
- [unless] unless-escapes with `payer:"opponent"` never surface a pay decision (unlike attacker pay-escape booleans) — the discard commits unconditionally; pin with banked {r} — UPR140 (2026-08-19)
- [target] sole-candidate at-resolution transform targets auto-settle (AHA014 class): after `play(invokeYenduraiRed)` with one ash, do NOT call `.target(ash)` — UPR017 (2026-08-19)
- [ap-math] instant plays cost no action point: seeded AP + trigger grants read directly (Midas Touch destroy → Cromai AP 2→3); verify the vehicle's card type before subtracting a play AP — UPR010 (2026-08-19)

## Resolution defend-window materialization — W3-EG3 engine-gap lane (2026-08-19)

- [engine-gap] resolution-kind defend/activate rule-mods now materialize DURING the CR 7 defend window (W3-EG3 predecessor: ac6557893/d0a6a30a9/ec65b7154/60ef0df38/d86bd473d): "can't be defended by equipment" (EVO204-206), cost-below-Evos bans (EVO061-063) and forced-equipment defense (CRU103/EVO059) all enforce at declaration — assert the block with `expect(() => defender.defendWith(equipmentCard)).toThrow(/continuous effect prevents this card from defending/)`, then `defendWith()` empty to decline and prove the resolution math — EVO204-206 trios (2026-08-19)
- [liveness] chainLinkNumber restarts at 1 for every NEW chain, so a combatNumber-scoped window expiry cannot distinguish chains and the rule LEAKS onto the next chain's first link: window instances must ride their EXACT attack — combatChain-zone sources project only while `activeLink.activeAttack.sourceObjectId === object.ref.instanceId` on an open link; stack-zone liveness widens to `attackAnnouncedOnStack` (same card incarnation on any stack zone) or announcement-time reconciliation flaps mid-payment — reconciler.ts + runtime.ts 9048378b6 (CR 7.3.1/7.4.2)
- [flap] combat-chain-close drops the window instance BEFORE the card leaves the combatChain zone — a zone-only projection gate re-proposes in that gap and the reconciler flaps generate/cease past its 1000-iteration limit (tests hang then throw); the projectsOwnAttackWindow identity gate closes both the flap and the cross-chain leak at once — 9048378b6 (2026-08-19)
- [handler] `transcended-this-turn` reads `facts.playerPerformedThisTurn[controllerId].transcend` (the transcend reducer stamps history.turn.transcended; state-rules-view surfaces the fact — the EG-2 cranked-pattern checklist was ALREADY complete for transcend, only the handler entry was missing); without it the conditional prevention amount takes the THEN-branch for a non-transcended hero (ENG023 prevented 3 where printed says 1) — has-status.ts 61fea9b64 (CR 8.5.48)
- [snapshot] the has-status-coverage debt-ledger snapshot SHRINKS when a handler lands — remove the marker's line from has-status-coverage.test.ts.snap in the SAME commit (deliberate shrink per the ledger's contract) or the suite fails on the stale debt entry — 61fea9b64 (2026-08-19)
- [stale-test] engine fixes can invalidate stale acceptance expectations: TE-D1's life 39 predated the CR 8.4.11 runtime evos-equipped count — a chain-defending Equipment still counts as equipped (bright-lights release notes), so 6 total {d} soaks Snatch's 4{p} → life 40; before "repairing" either side, bisect to the introducing commit and verify against the ruling text + the module's own green suite — mechanologist-play-lines.test.ts 408820883 (2026-08-19)
- [gate] restarts eat pending gates: the predecessor's 60ef0df38 sat on a failing full-suite run (TE-D1) because gates never executed before the machine died — run the FULL suite + BOTH check-types before closeout, not just per-card suites; `vp test run` exit codes lie on load errors, gate on the captured output — W3-EG3 final gates (2026-08-19)

## W3-D static/continuous modify-numeric batch (S:static/continuous|F:modify-numeric, G7-auth[8:20]) (2026-08-19)

- [arsenal] aimed-arrow statics: seed `arsenal: [{card, state: {aimCounters: 1}}]` and attack with `attackWith(card, {from: "arsenal"})` — a bow (weapon1 deathDealer) is required for arrow plays; condition true/false both assertable via `expectCombat(game).toHaveAttackPower(n)` at announce — AZL008/010/013/023, DYN165-167 (W3-D, 2026-08-19)
- [prevent] "can't be prevented" both-direction proof: link-1 damage → `passPriorityTo(defender)` → defender `play(feignDeathYellow)` → `resolveUntilIdle({optionalBoolean:false})`, then the source in question vs a contrast source through the same shield (murkmire 5 lands, snatch 4 stopped) — AZL010 (W3-D, 2026-08-19)
- [chain-cost] chain-window cost discounts (Bleed Out): open with the discount source (`activateAttack(kodachi)` → `advanceCombatTo("resolution")`) then `must.playAttack` the discounted card on the SAME open chain; weapon {r} activations SPEND resources — budget RP = activation + max cost and assert the leftover to separate discounted vs full — BEN007 (W3-D, 2026-08-19)
- [activeLink] right after a resolution-step `must.playAttack`, `combat()?.activeLink` still reports the PREVIOUS link — `advanceCombatTo("defend")` before asserting the new link's power — BEN007 (W3-D, 2026-08-19)
- [gap-dr] NEW gap family: a Defense Reaction's continuous self static is dropped on the combat chain (reconciler `staticAbilityIsFunctional` admits only Equipment / Action-Attack objects) — fused Turn Timber's declaration fact, admission, and validator all work, only the +2{d} never applies; pin with unfused-green + fused-life-pinned + invalid-declaration-rejected trio — ELE010/ELE011, plan §5 (W3-D, 2026-08-19)
- [dr-play] defense reactions are playable mid-reaction via fluent `play()` (begin-play): walkToReaction → `if (attacker.hasPriority()) attacker.pass()` → `play(dr, {fuse:true, fuseCards:[...]})`; the fuse payload and fusion validator are card-type-agnostic (Oaken Old ELE005 is the attacker-side golden) — ELE010/ELE011 (W3-D, 2026-08-19)

## W3-E hit-triggered create-token (T:hit|F:create-token, G27-auth[8:18]) (2026-08-19)

- [trio] the on-hit token signature trio (ELE157-159 / FLR021 / ROS036-037 / OUT037 / OUT040): `playAttack(card)` + assert `activeLink.attackPower` → `helpers.resolveRestOfCombat()` → `zone("arena")).toContain("token:<slug>")`; the miss boundary fully blocks with `brutalAssaultBlue` ×N (life stays 20, no token either side); the timing leg asserts the token ABSENT while `combat()?.open` is true right after `playAttack` and present only after resolve — ELE159 is the plan §5 working contrast for the ELE163 eager-deferral defect (2026-08-19)
- [controller] printed controller wording splits the arena side: "under their control" (Frostbite ELE157-159, Inertia OUT037, Frailty OUT040) seats the token in the DEFENDER's arena, "under your control" (Embodiment of Earth FLR021/ROS036-037, Gate to i'Arathael IAR166) in the ATTACKER's — assert `.toContain` on the printed side AND `.not.toContain` on the other to pin the controller — W3-E batch (2026-08-19)
- [timing] IAR166's "If this is banished from hand this turn, create a Gate" fires MID-COMBAT before damage: attacker `playAttack(alphaRampageRed, { stopAt: "on-attack" })` (intimidate banishes the defender's copy) + `game.advanceUntil({ stopAt: "defend" })` → the Gate is already in the attacker's arena while `combat()?.open` and life is untouched — IAR166 (2026-08-19)
- [hero] HNT054-class hero passives: the fixture flag `marked: true` seats the marked status on the opponent; `activate(kunaiOfRetribution)` weapon attack is the hit vehicle (Fealty on marked-hit, none on unmarked); the Once-per-Turn a2 equips up-to-2 GY daggers via `resolveUntilIdle({ entityTargets: "maximum" })` and pins once-per-turn with `expectActivationRejected(hero)`, and the Draconic-chain-link discount is provable MID-combat (`activate(weapon)` + `game.passBoth()` keeps the link open, then `activate(hero)` at {r}{r}) — HNT054 (2026-08-19)

## W3-G resolution-sequence tail (R:resolution|F:sequence, G2-auth[26:40]) (2026-08-19)

- [count-gap] unimplemented count `what`-values surface as `Unsupported FAB target count for <ability-id>` thrown from trigger-declaration inside resolveFabCombatDamage — the combo hit WEDGES combat resolution; pin with `expect(() => game.resolveCombatNoReactions()).toThrowError(/Unsupported FAB target count for CRU060-a1/)` and keep the provable fragments (combo power, keywords, solo stats) as separate tests — CRU060/061/062 Rushing River, plan §5 (2026-08-19)
- [dr-filter] `subtypes: ["Reaction"]` NEVER matches a defense reaction ("Defense Reaction" is a TYPE, CR 1.3.2c — ARC119/CRU083 class): the printed DR-ban is dead and the defender's `play(dr)` is ACCEPTED mid-reaction; pin requires `advanceCombatTo("reaction")` → attacker `pass()` → defender `play(dr)` → `passBoth()` BEFORE `toBeIn("combatChain")` (the layer sits on the stack until priority passes) — CRU135/136/137, plan §5 (2026-08-19)
- [optional-permission] `optional { play-card }` ACCEPT answers a boolean decision and GRANTS a this-turn from-banish play permission: answer via `resolveUntilIdle({ optionalBoolean: true })` then `attackWith(card, { from: "banished" })` is legal; DECLINE leaves the rejection `Playing from banished requires a migrated permission effect` as the printed-correct negative — CRU143 a1 (2026-08-19)
- [instant-permission] a printed "you may play X as though it were an instant" encoded as a resolution ability over zones ["soul"] is structurally dead (a play-timing permission must exist BEFORE playing): probe at `advanceCombatTo("reaction")` with the condition satisfied and pin the rejection `An action card is not legal in the current layer position` — CRU143 a2, plan §5 (2026-08-19)
- [reveal-binding] an unstamped reveal outputBinding makes the follow-up `binding: "them"` move-card a SILENT no-op (ARC084 class): resolution completes with NO ordering decision and deck order is unchanged; deck arrays are bottom-first so `deck[deck.length - 1]` is the top card, and `deckTop: [...]` fixtures' LAST entry seeds that top — CRU154/155 Sutcliffe's, plan §5 (2026-08-19)
- [reveal-count] `revealed-this-way` IS implemented (count.ts stamps the full reveal cohort) — token-per-revealed-card filters (supertype ∧ subtype ∧ type) evaluate green; seed the reveal cohort via `deckTop` and assert `zone("arena").filter(c => c === "token:<slug>")` — CRU154/155/156 (2026-08-19)
- [skip-covered] before writing a sibling suite, grep for the shared card name: CRU145-mauvrion-skies.test.ts already `describe.each`s red/yellow/blue, so CRU146/147 were SKIPPED + noted in the registry result instead of duplicating coverage (2026-08-19)

## W3-H R:resolution|F:grant-property G3-auth[28:42] (2026-08-19)

- [weapon-timing] `activate(weapon)` parks the attack-with ability on the stack — it does NOT advance combat: call `game.advanceCombatTo("defend")` before any `defendWith`, and assert attackPower/keywords at the "defend" step (the piercing +N bonus in `activeLink.attackPower` is observable only while a defender is declared) — DYN085 (2026-08-19)
- [rollover-payment] second-turn weapon {r} drives: turn rollover zeroes resourcePoints (`reset-turn-assets`), and `must.pitch().activate()` fails because activate ignores staged pitch — pay via `game.answerDecision(pid, {kind:"payment", instanceIds:[handle.cardIn("hand", card).instanceId]})` immediately after `activate()`; drain the first `endTurn()` with `resolveUntilIdle({optionalBoolean:false})`, then the opponent's `endTurn()` + `resolveUntilIdle()` returns the turn — DYN085 (2026-08-19)
- [banish-vehicle] "If you've banished a card with 6+{p} this turn" rides the `playerBanishedPower6` stamp (zone-moves/helpers.ts): ANY 6{p} banish qualifies — CHN004 Ebon Fold is the clean vehicle (`activate(ebonFold)` + `game.helpers.resolveUntilIdle({entityTargetCanonicalId: card.canonicalId})` → `expectFabCard(h, card).toBeBanished()`) with DYN008 skull-crack-red (6{p}) as payload — DTD115/116/117 (2026-08-19)
- [blood-debt] Blood Debt CR 8.3.11 without playing the card: fixture `banished: [card]` + `endTurn()` + `helpers.untilIdle()` → `expectFabPlayer(h).toHaveLife(19)` — DTD115-117, DTD184-186 (2026-08-19)
- [cru151-pin] CRU151-class unprinted-keyword pins (DTD063-065 charge-yellow, DTD115-117 banish-6{p}): prove the qualifying playline first, then pin with `expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower")` on a BARE turn + `expect(defender.expectBlockRejected([c1, c2]).errorCode).toBe("overpower")` where the printed card allows the two-card defense (2026-08-19)
- [trapdoor-pin] unhandled-marker pins (AZL015 discipline): `expect(() => h.attackWith(card)).toThrow(/unhandled has-status marker: <marker>/)` in BOTH directions — bare board AND with the qualifying setup seeded via fixture (`pitch:` for yellow-card-in-pitch-zone, opponent `soul:` for defending-hero-has-cards-in-soul) — proves the card unplayable rather than silently wrong; note `defending-hero-has-cards-in-soul` lacks a handler while its `opposing-hero-…` sibling is implemented — DTD091-093, DTD184-186 (2026-08-19)

## W3-I resolution create-token batch (R:resolution|F:create-token, G12-auth[9:23]) (2026-08-19)

- [family-pin] an engine-gap family row covers the sibling variants verbatim (ELE163 → ELE164/ELE165): pin BOTH misbehavior facets (no-combat throw "token controller requires a binding or outcome" + eager create after any closed combat) and prove the printed behavior exists via the working contrast card (ELE159 hit-trigger) — ELE164/ELE165, plan §5 family (2026-08-19)
- [x-boundary] X-declared cards have NO unpayable-cost throw: an out-of-range `xValue` silently defaults to `decision.min` (test-engine numeric case) — the boundary is `begin-play` → assert the numeric decision `{kind:"numeric",min,max}` → `answerDecision(id, {kind:"numeric",value})`, plus an X=0 no-op resolution — EVO238 (CR 5.1.3a) (2026-08-19)
- [throw-surface] unhandled has-status markers throw SYNCHRONOUSLY for the card being played (`expect(() => play(card)).toThrow(/unhandled has-status marker: …/)`) but escape as async evaluation errors when an ON-CHAIN static holds the marker (Wax On EVR052 state-view build) — pin the played card's trapdoor, prove the flow clean with plain attacks — EVO239 (2026-08-19)
- [random-discard] seeded-RNG random discards are deterministic and can lose a pick downstream of a correct without-replacement sampler: "discard 3 random" moved only 2 of 3 (hand 3→1) — pin hand/graveyard counts, and count hero passives before asserting token totals (Viserai ARC076-a1 adds +1 Runechant on the second Runeblade non-attack play of a turn) — EVO242, plan §5 NEW (2026-08-19)
- [instant-timing] mid-combat instant idiom (AHA015): `attackWith` from player 1 → `advanceCombatTo("reaction")` → attacker `pass()` → defender `play(instant)` → `passBoth()` → `resolveRestOfCombat()` — instants seat tokens at instant speed, cost no AP, and block nothing (ward does not prevent damage; token auras survive the closed link) — FNG020, MON092 (2026-08-19)
- [compound-slug] BET026-family compound token slugs (HVY044 `agility-and-a-might`) still throw "absent from match program": pin the trapdoor and prove the SAME flow clean through the post-fix split-leaf sibling (BET026 might+vigor) — fix precedent W3-FIX3/LGS355, two create-token leaves — HVY044, plan §5 (2026-08-19)
- [worktree] fresh batch worktrees need per-package node_modules repair before any vp run: `cards/node_modules/@tcg/flesh-and-blood-engine` → relative symlink to `../../../engine` (+ types), then rsync the per-package node_modules from the main repo (exclude `.vite`) — EG-1/W3-C protocol, rediscovered W3-I (2026-08-19)

## W3-J static/play batch (S:static/play|F:none, G8-auth[0:12]) (2026-08-19)

- [charge-opts] optional soul-charge additional costs are paid via play options: `attackWith(card, { charge: true, chargeCard: fodder })`; DECLINING is calling with no options (omission is an explicit decline, declarations.ts); an unpayable OPTIONAL cost (solo hand) auto-declines and the play stays legal — assert soul contents both ways — BOL013/015/019/020 (W3-J, 2026-08-19)
- [random-discard] a REQUIRED random-discard cost surfaces NO player decision — payment consumes the random index itself; seat exactly one other hand card so the pick is forced (CR 1.9.3, Reckless Swing precedent); solo hand = genuinely unplayable, assert with `expect(() => must.playAttack(card)).toThrow()` — CRU019-021 (W3-J, 2026-08-19)
- [go-again] AP-refund timing leg: `expectFabPlayer(X).toHaveAP(1)` before `attackWith`, again after `helpers.resolveRestOfCombat()` — go again refunds at chain-link closure — CRU019-021 (W3-J, 2026-08-19)
- [banished-permission] unconditional banished-zone permissions: `attackWith(card, { from: "banished" })` (CHN010/CHN013 goldens); the permission only EXTENDS playability so the hand copy stays ordinarily playable (both-directions boundary); Blood Debt timing = arrange banished + `endTurn()` + `helpers.untilIdle()` + life −1 — CHN021 (W3-J, 2026-08-19)
- [trapdoor-zone] unhandled has-status markers on optional banished-zone permissions are ZONE-DEPENDENT: arranged-in-banished crashes at `FabTestEngine.start` (reconciler evaluates the condition to host the CE) while a hand copy survives arrange and only crashes at the play quote — probe BOTH zones before declaring a card unprovable — DTD109 §5 (W3-J, 2026-08-19)
- [cost-whitelist] banish-from-hand effect costs are NOT in the payable whitelist (only graveyard-banish, random-discard, charge, reveal are) → REQUIRED-cost plays are denied "unmigrated effect-cost declaration" even with a payable second hand card; pin with `toThrow(/unmigrated effect-cost declaration/)` + keep the Blood Debt keyword fragment green — DTD110/124/125 §5 (W3-J, 2026-08-19)

## W3-G resolution-sequence tail (R:resolution|F:sequence, G2-auth[26:40]) (2026-08-19)

- [count-gap] unimplemented count `what`-values surface as `Unsupported FAB target count for <ability-id>` thrown from trigger-declaration inside resolveFabCombatDamage — the combo hit WEDGES combat resolution; pin with `expect(() => game.resolveCombatNoReactions()).toThrowError(/Unsupported FAB target count for CRU060-a1/)` and keep the provable fragments (combo power, keywords, solo stats) as separate tests — CRU060/061/062 Rushing River, plan §5 (2026-08-19)
- [dr-filter] `subtypes: ["Reaction"]` NEVER matches a defense reaction ("Defense Reaction" is a TYPE, CR 1.3.2c — ARC119/CRU083 class): the printed DR-ban is dead and the defender's `play(dr)` is ACCEPTED mid-reaction; pin requires `advanceCombatTo("reaction")` → attacker `pass()` → defender `play(dr)` → `passBoth()` BEFORE `toBeIn("combatChain")` (the layer sits on the stack until priority passes) — CRU135/136/137, plan §5 (2026-08-19)
- [optional-permission] `optional { play-card }` ACCEPT answers a boolean decision and GRANTS a this-turn from-banish play permission: answer via `resolveUntilIdle({ optionalBoolean: true })` then `attackWith(card, { from: "banished" })` is legal; DECLINE leaves the rejection `Playing from banished requires a migrated permission effect` as the printed-correct negative — CRU143 a1 (2026-08-19)
- [instant-permission] a printed "you may play X as though it were an instant" encoded as a resolution ability over zones ["soul"] is structurally dead (a play-timing permission must exist BEFORE playing): probe at `advanceCombatTo("reaction")` with the condition satisfied and pin the rejection `An action card is not legal in the current layer position` — CRU143 a2, plan §5 (2026-08-19)
- [reveal-binding] an unstamped reveal outputBinding makes the follow-up `binding: "them"` move-card a SILENT no-op (ARC084 class): resolution completes with NO ordering decision and deck order is unchanged; deck arrays are bottom-first so `deck[deck.length - 1]` is the top card, and `deckTop: [...]` fixtures' LAST entry seeds that top — CRU154/155 Sutcliffe's, plan §5 (2026-08-19)
- [reveal-count] `revealed-this-way` IS implemented (count.ts stamps the full reveal cohort) — token-per-revealed-card filters (supertype ∧ subtype ∧ type) evaluate green; seed the reveal cohort via `deckTop` and assert `zone("arena").filter(c => c === "token:<slug>")` — CRU154/155/156 (2026-08-19)
- [skip-covered] before writing a sibling suite, grep for the shared card name: CRU145-mauvrion-skies.test.ts already `describe.each`s red/yellow/blue, so CRU146/147 were SKIPPED + noted in the registry result instead of duplicating coverage (2026-08-19)

## W3-H R:resolution|F:grant-property G3-auth[28:42] (2026-08-19)

- [weapon-timing] `activate(weapon)` parks the attack-with ability on the stack — it does NOT advance combat: call `game.advanceCombatTo("defend")` before any `defendWith`, and assert attackPower/keywords at the "defend" step (the piercing +N bonus in `activeLink.attackPower` is observable only while a defender is declared) — DYN085 (2026-08-19)
- [rollover-payment] second-turn weapon {r} drives: turn rollover zeroes resourcePoints (`reset-turn-assets`), and `must.pitch().activate()` fails because activate ignores staged pitch — pay via `game.answerDecision(pid, {kind:"payment", instanceIds:[handle.cardIn("hand", card).instanceId]})` immediately after `activate()`; drain the first `endTurn()` with `resolveUntilIdle({optionalBoolean:false})`, then the opponent's `endTurn()` + `resolveUntilIdle()` returns the turn — DYN085 (2026-08-19)
- [banish-vehicle] "If you've banished a card with 6+{p} this turn" rides the `playerBanishedPower6` stamp (zone-moves/helpers.ts): ANY 6{p} banish qualifies — CHN004 Ebon Fold is the clean vehicle (`activate(ebonFold)` + `game.helpers.resolveUntilIdle({entityTargetCanonicalId: card.canonicalId})` → `expectFabCard(h, card).toBeBanished()`) with DYN008 skull-crack-red (6{p}) as payload — DTD115/116/117 (2026-08-19)
- [blood-debt] Blood Debt CR 8.3.11 without playing the card: fixture `banished: [card]` + `endTurn()` + `helpers.untilIdle()` → `expectFabPlayer(h).toHaveLife(19)` — DTD115-117, DTD184-186 (2026-08-19)
- [cru151-pin] CRU151-class unprinted-keyword pins (DTD063-065 charge-yellow, DTD115-117 banish-6{p}): prove the qualifying playline first, then pin with `expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower")` on a BARE turn + `expect(defender.expectBlockRejected([c1, c2]).errorCode).toBe("overpower")` where the printed card allows the two-card defense (2026-08-19)
- [trapdoor-pin] unhandled-marker pins (AZL015 discipline): `expect(() => h.attackWith(card)).toThrow(/unhandled has-status marker: <marker>/)` in BOTH directions — bare board AND with the qualifying setup seeded via fixture (`pitch:` for yellow-card-in-pitch-zone, opponent `soul:` for defending-hero-has-cards-in-soul) — proves the card unplayable rather than silently wrong; note `defending-hero-has-cards-in-soul` lacks a handler while its `opposing-hero-…` sibling is implemented — DTD091-093, DTD184-186 (2026-08-19)

## W3-I resolution create-token batch (R:resolution|F:create-token, G12-auth[9:23]) (2026-08-19)

- [family-pin] an engine-gap family row covers the sibling variants verbatim (ELE163 → ELE164/ELE165): pin BOTH misbehavior facets (no-combat throw "token controller requires a binding or outcome" + eager create after any closed combat) and prove the printed behavior exists via the working contrast card (ELE159 hit-trigger) — ELE164/ELE165, plan §5 family (2026-08-19)
- [x-boundary] X-declared cards have NO unpayable-cost throw: an out-of-range `xValue` silently defaults to `decision.min` (test-engine numeric case) — the boundary is `begin-play` → assert the numeric decision `{kind:"numeric",min,max}` → `answerDecision(id, {kind:"numeric",value})`, plus an X=0 no-op resolution — EVO238 (CR 5.1.3a) (2026-08-19)
- [throw-surface] unhandled has-status markers throw SYNCHRONOUSLY for the card being played (`expect(() => play(card)).toThrow(/unhandled has-status marker: …/)`) but escape as async evaluation errors when an ON-CHAIN static holds the marker (Wax On EVR052 state-view build) — pin the played card's trapdoor, prove the flow clean with plain attacks — EVO239 (2026-08-19)
- [random-discard] seeded-RNG random discards are deterministic and can lose a pick downstream of a correct without-replacement sampler: "discard 3 random" moved only 2 of 3 (hand 3→1) — pin hand/graveyard counts, and count hero passives before asserting token totals (Viserai ARC076-a1 adds +1 Runechant on the second Runeblade non-attack play of a turn) — EVO242, plan §5 NEW (2026-08-19)
- [instant-timing] mid-combat instant idiom (AHA015): `attackWith` from player 1 → `advanceCombatTo("reaction")` → attacker `pass()` → defender `play(instant)` → `passBoth()` → `resolveRestOfCombat()` — instants seat tokens at instant speed, cost no AP, and block nothing (ward does not prevent damage; token auras survive the closed link) — FNG020, MON092 (2026-08-19)
- [compound-slug] BET026-family compound token slugs (HVY044 `agility-and-a-might`) still throw "absent from match program": pin the trapdoor and prove the SAME flow clean through the post-fix split-leaf sibling (BET026 might+vigor) — fix precedent W3-FIX3/LGS355, two create-token leaves — HVY044, plan §5 (2026-08-19)
- [worktree] fresh batch worktrees need per-package node_modules repair before any vp run: `cards/node_modules/@tcg/flesh-and-blood-engine` → relative symlink to `../../../engine` (+ types), then rsync the per-package node_modules from the main repo (exclude `.vite`) — EG-1/W3-C protocol, rediscovered W3-I (2026-08-19)

## Shared-worktree G1-auth[50:98] (2026-08-20)

- [herald-instant] Angelic Wrath mid-combat +N{p}: `playAttack(Herald MON023)` → defender `pass()` → `play(instant, { targetInstanceId: cardIn("combatChain") })` → `passBoth()` before `toHaveAttackPower` — `packages/cards/src/cards/DTD/instants/DTD035-angelic-wrath-red.test.ts` (2026-08-20)
- [reprimand] "card defending a Herald attack −N{p} this combat chain": `defendWith` then `advanceCombatTo("reaction")` then play targeting the defender's combat-chain instance; `toHavePower` while open — `packages/cards/src/cards/DTD/instants/DTD038-celestial-reprimand-red.test.ts` (2026-08-20)
- [resolve] Herald +N{d} is `toHaveDefense` on the chain Herald and does not change attack power — `packages/cards/src/cards/DTD/instants/DTD041-celestial-resolve-red.test.ts` (2026-08-20)
- [charge-yellow] `attackWith(card, { charge: true, chargeCard: yellow })` stamps `yellow-charged-this-way`; do not `defendWith` an AAC when asserting the card's own +1{p} or Boltyn's charged-this-turn static stacks — `packages/cards/src/cards/DTD/actions/DTD057-beaming-bravado-red.test.ts` (2026-08-20)
- [definition] Prayer of Bellona a2 charge sits outside the yellow `then`, so a non-yellow reveal still charges leftover hand — pin, do not half-fix — `packages/cards/src/cards/DTD/actions/DTD053-prayer-of-bellona-yellow.test.ts` (2026-08-20)
- [status] unhandled has-status on `appliesTo.next` fail-closes (no throw, latch never matches) rather than the AZL015 trapdoor-throw — Charge of the Light Brigade `charged-to-play` — `packages/cards/src/cards/DTD/actions/DTD072-charge-of-the-light-brigade-red.test.ts` (2026-08-20)
- [cost] modal additionalCost `banish` from `soul` (up-to-N) is not in `isPayablePlayCost`; begin-play denies `unmigrated effect-cost declaration` with or without soul cards — `packages/cards/src/cards/DTD/attack-reactions/DTD080-lumina-lance-yellow.test.ts` (2026-08-20)
- [cost] required random banish-from-hand additional cost stays unmigrated on Shaden Scream / Tribute-to-\* (DTD110 class) — pin the throw with a two-card hand, keep 3{d} / Blood Debt fragments — `packages/cards/src/cards/DTD/actions/DTD118-shaden-scream-red.test.ts` (2026-08-20)
- [status] `banished-a-card-with-6-or-more-p-this-turn` IS handled (Battlefield Breaker): Ebon Fold + Skull Crack then `attackWith` + printed+1 vs bare-turn printed power — `packages/cards/src/cards/DTD/actions/DTD121-battlefield-breaker-red.test.ts` (2026-08-20)
- [trapdoor-pin] Soul Butcher DTD181-183 is the same `defending-hero-has-cards-in-soul` unplayable trapdoor as Soul Cleaver DTD184-186 — pin both empty-soul and seeded-soul `attackWith` throws — `packages/cards/src/cards/DTD/actions/DTD181-soul-butcher-red.test.ts` (2026-08-20)
- [cost] Bequest the Vast Beyond's next Runeblade attack-action cost latch: 1 seated `token:runechant` plays Spellblade Strike (cost 1) at 0{r}; a Generic Brutal Assault is not discounted — `packages/cards/src/cards/DTD/actions/DTD212-bequest-the-vast-beyond-red.test.ts` (2026-08-20)
- [act] Savage Beatdown / Rumble Grunting "discarded 6+{p} this turn" is public via Trade In (UPR214) + `resolveUntilIdle({optionalBoolean:true, entityTargetCanonicalId})`; last-turn discard fails `play condition is not satisfied` — `packages/cards/src/cards/DYN/actions/DYN007-savage-beatdown-red.test.ts` (2026-08-20)
- [random-discard] Madcap Muscle additional-cost random discard stamps `discardedCard` for the +N{p} clause: seat exactly one other hand card so the pick is forced — `packages/cards/src/cards/DYN/actions/DYN019-madcap-muscle-red.test.ts` (2026-08-20)

- [off-hand] Shield Wall's Guardian off-hand `control-object` matches seated `weapon2` Steelbraid Buckler; Generic Off-Hand (Ornate Tessen) is the no-bonus contrast — `packages/cards/src/cards/DYN/defense-reactions/DYN036-shield-wall-red.test.ts` (2026-08-20)
- [combo] Combo `names:["Crouching Tiger"]` exact-matches catalog Crouching Tiger; keep the chain open with `must.playAttack` → `advanceCombatTo("resolution")` → next `playAttack` → `advanceCombatTo("defend")` — `packages/cards/src/cards/DYN/actions/DYN059-qi-unleashed-red.test.ts` (2026-08-20)
- [status] `boosted` on `appliesTo.next` fail-closes (no throw, latch never matches) — same family as charged-to-play — `packages/cards/src/cards/DYN/actions/DYN091-bios-update-red.test.ts` (2026-08-20)
- [boost-item] Bios Update a2: a cost-1 Mechanologist item banished to boost enters the arena; seat Teklovossen so Dash start-game does not auto-place the deck item; a Generic item stays banished — `packages/cards/src/cards/DYN/actions/DYN091-bios-update-red.test.ts` (2026-08-20)
- [equip-defend] "Equipment have −1{d} while defending this combat chain" encoded as at-resolution object scan of currently-defending equipment is empty at Attack resolution — `packages/cards/src/cards/DYN/actions/DYN095-scramble-pulse-red.test.ts` (2026-08-20)

## Shared-worktree G1-auth[110:170] (2026-08-20)

- [arrow] Dead Eye next-arrow +3 is `appliesTo.next` subtypes:["Arrow"]; the aim-counter look/discard is a self-static on Dead Eye and never grants to the aimed arrow — `packages/cards/src/cards/DYN/actions/DYN155-dead-eye-yellow.test.ts` (2026-08-20)
- [cost] Frost Lock / Cold Wave “opposing heroes pay +1{r} this turn” authored as an at-resolution opponent-stack scan is a silent no-op; 0{r} Snag still resolves — `packages/cards/src/cards/ELE/actions/ELE035-frost-lock-blue.test.ts` (2026-08-20)
- [status] `appliesTo.next.hasStatus: "fused"` fail-closes like `charged-to-play` — fused Entwine Lightning stays printed 4{p} after Invigorate — `packages/cards/src/cards/ELE/actions/ELE103-invigorate-red.test.ts` (2026-08-20)
- [instead] Weave Earth / Weave Ice fused-instead (dominate / extra +N) is a sibling static on `self` with binding `"it"`; the next fused AAC still gets the unfused latch — `packages/cards/src/cards/ELE/actions/ELE122-weave-earth-red.test.ts` (2026-08-20)
- [trapdoor] Fulminate `fused-with-earth-card` throws at resolution even unfused; Lightning fuse never reaches `fused-with-lightning-card` — `packages/cards/src/cards/ELE/actions/ELE091-fulminate-yellow.test.ts` (2026-08-20)
- [target] Summerwood Shelter illegal Generic defender does not throw at begin-play; `play({ targetInstanceId })` no-ops and the instant stays in hand — `packages/cards/src/cards/ELE/instants/ELE125-summerwood-shelter-red.test.ts` (2026-08-20)
- [trapdoor] `item-or-equipment-banished-from-boosting-this` throws on Sprocket Rocket / Dumpster Dive even unboosted (Teklovossen, not Dash, for deck items) — `packages/cards/src/cards/EVO/actions/EVO192-sprocket-rocket-red.test.ts` (2026-08-20)
- [trapdoor] Big Shot `boosted-2-or-more-times-this-turn` is unhandled (only the 3+ sibling is inventoried) — `packages/cards/src/cards/EVO/actions/EVO153-big-shot-red.test.ts` (2026-08-20)
- [gap] Fire and Brimstone +1{p} scans weapon/permanent and misses the combat-chain dagger; extra-activation optional throws `activation-limit target is unresolved` — `packages/cards/src/cards/FNG/attack-reactions/FNG013-fire-and-brimstone-red.test.ts` (2026-08-20)
- [token] Outland Skirmish next-1H +N{p} is public; the windowed delayed-trigger “next weapon hit → Copper” never seats token:copper — `packages/cards/src/cards/EVR/actions/EVR067-outland-skirmish-yellow.test.ts` (2026-08-20)

## Exact target and declaration-reversal coverage (2026-08-20)

- [target-identity] Decision answers remain public instance IDs, but persisted candidates and resulting layer targets carry `{ kind: "object", ref: { instanceId, incarnation } }`; exercise leave-and-return by restoring before resolution and assert the new incarnation is not affected — Pilfer the Tomb PEN329 (2026-08-20)
- [rules-reversal] A legal decision submission can return an accepted `rules-action-reversed` outcome. Assert the typed reason plus restored cards/assets/priority, clear process/decision/stack, and prove another public move is immediately accepted; do not expect a throw or failed command — Pilfer the Tomb PEN329, Oscilio OMN095 (2026-08-20)
- [reversal-copy] Carry the public printed mode or ability instruction in `required_targets_unavailable`; player-facing adapters should not reconstruct failed target meaning from engine filters — Pilfer the Tomb PEN329 (2026-08-20)

## Shared-worktree G1-auth[170:230] (2026-08-20)

- [gap-card] `names:["Draconic Attack"]` still never matches on HNT087/088 Grow Claws (CIN013 family) — pin printed power after a Draconic last attack — `packages/cards/src/cards/HNT/actions/HNT087-grow-claws-yellow.test.ts` (2026-08-20)
- [activation] Long Whisker extra-activation scans weapon/permanent and misses the combat-chain dagger (FNG013 family) — `packages/cards/src/cards/HNT/attack-reactions/HNT102-long-whisker-loyalty-red.test.ts` (2026-08-20)
- [status] `intimidated-this-turn` throws on Beast Mode even after Trade In 6+{p} + Rhinar intimidate — `packages/cards/src/cards/HVY/actions/HVY018-beast-mode-yellow.test.ts` (2026-08-20)
- [status] play-static `wagered-this-chain-link` evaluates in hand so Take the Upper Hand crashes `FabTestEngine.start` — seat a deck copy as the contrast — `packages/cards/src/cards/HVY/attack-reactions/HVY112-take-the-upper-hand-red.test.ts` (2026-08-20)
- [gap] IRA007 Flying Kick is the same unhandled `played-at-chain-link-3-or-higher` trapdoor as CRU064/065 at link 1 and link 3 — `packages/cards/src/cards/IRA/actions/IRA007-flying-kick-red.test.ts` (2026-08-20)
- [cost] required 3-GY banish (Endless Maw / Unworldly Bellow) is unmigrated effect-cost even with 3 GY cards — `packages/cards/src/cards/LEV/actions/LEV012-endless-maw-red.test.ts` (2026-08-20)
- [status] Impenetrable Belief `3-or-more-cards-put-into-opposing-banished-this-turn` throws empty and seeded — `packages/cards/src/cards/MON/actions/MON075-impenetrable-belief-red.test.ts` (2026-08-20)
- [status] Blinding Beam play-static `targets-shadow-card` throws on Generic and Shadow targets — `packages/cards/src/cards/MON/instants/MON084-blinding-beam-red.test.ts` (2026-08-20)

## Shared-worktree G1-auth[230:290] (2026-08-20)

- [authoring] Second Swing is this-turn “attacked with a weapon,” not Combo — close the weapon link before playing the non-attack Action (CR 7.0.1a) — `packages/cards/src/cards/MON/actions/MON116-second-swing-red.test.ts` (2026-08-20)
- [trapdoor] `life-less-than-opposing-shadow-hero` throws from `play()` and reverses to hand even vs a non-Shadow hero — `packages/cards/src/cards/MON/instants/MON087-ray-of-hope-yellow.test.ts` (2026-08-20)
- [cost] MON127/128 Endless Maw and MON151 Unworldly Bellow are the same unmigrated required GY-banish as LEV012 — `packages/cards/src/cards/MON/actions/MON127-endless-maw-yellow.test.ts` (2026-08-20)
- [status] `pitched-a-blue-card-this-turn` throws at `playReaction`/`play()`, not fail-close — Hiss MST014-016, Venomous Bite MST020-022, Tiger Form MST063-065 (2026-08-20)
- [target] Assassin/Mystic AAC AR vs Generic Snatch is silent no-op (card stays in hand) — Hiss / Intimate / Stormshatter / Short and Sharp mode-2 — ELE125 family (2026-08-20)
- [look] defending-hero deck look + `add-defending` never puts a defender on the link; `+1{p}` still applies — `packages/cards/src/cards/MST/attack-reactions/MST017-intimate-inducement-red.test.ts` (2026-08-20)
- [status] unhandled resolution has-status on an AR fires inside `playReaction`; on a non-attack Action/Instant inside `play()` — MST014 / MST063 / MST079 (2026-08-20)
- [payment] `{ pitch: [blue, blue] }` on a cost-2 play only pitches until cost is covered (one pitch-3) — `packages/cards/src/cards/MST/attack-reactions/MST085-wide-blue-yonder-blue.test.ts` (2026-08-20)
- [token] Maul mode 2 `token:"crouching-tigers"` is the BET026 compound-slug trapdoor — `packages/cards/src/cards/MST/attack-reactions/MST162-maul-yellow.test.ts` (2026-08-20)
- [status] Sneak Attack `played-or-activated-this-chain-link-attack-reaction` is unhandled (N-or-more sibling is inventoried) — `packages/cards/src/cards/OUT/actions/OUT018-sneak-attack-red.test.ts` (2026-08-20)
- [arrow] aimed −1{d} / destroy-1H riders on Melting Point / Fletch are self-statics on the granter, not grants on the arrow — use SEA092 not Searing Shot for defense-rider proofs — OUT105/OUT110 (2026-08-20)
- [gap] Knives Out `moniker:"Dagger"` never matches a weapon-attack proxy — `packages/cards/src/cards/OUT/attack-reactions/OUT144-knives-out-blue.test.ts` (2026-08-20)
- [bond] Laden with Earth/Frost/Lightning are Bond, not Fusion; Earth `pitched-this-way-earth-card` works, Ice/Lightning `pitched-*-card-to-play-this` trapdoor-throws — PEN210/211/212 (2026-08-20)
- [cost] named (non-random) hand-discard additional costs are unmigrated like soul-banish — `packages/cards/src/cards/PEN/instants/PEN254-art-of-the-phoenix-war-red.test.ts` (2026-08-20)
- [timing] resolution-kind “if you’ve played an Instant this chain link” cannot see a reaction-step instant — `packages/cards/src/cards/PEN/actions/PEN243-overcharge-red.test.ts` (2026-08-20)
- [status] `created-a-card-this-turn` throws on Manifest Muscle empty and with a seated token — `packages/cards/src/cards/PEN/actions/PEN270-manifest-muscle-blue.test.ts` (2026-08-20)

## Shared-worktree G1-auth[290:364] (2026-08-20)

- [status] `been-cheered-this-turn` is handled (Empowering Ruckus); `been-booed-this-turn` still trapdoor-throws — SUP039 vs SUP110 (2026-08-20)
- [status] `has-6-or-more-power` throws at play even after a next-attack latch would put the attack at 6{p} — `packages/cards/src/cards/SUP/actions/SUP149-flex-strength-red.test.ts` (2026-08-20)
- [status] `targets-a-guardian-hero` on `appliesTo.next` fail-closes — `packages/cards/src/cards/SUP/actions/SUP167-bark-obscenities-red.test.ts` (2026-08-20)
- [token] Might’s +1{p} is start-of-next-turn after self-destroy, not a same-turn create latch — SUP119 + TCC105 (2026-08-20)
- [crowd] Instant `crowd-cheers` does not fire Tuffnut’s cheer-create Toughness; +{d} still public — `packages/cards/src/cards/SUP/instants/SUP034-shining-courage-red.test.ts` (2026-08-20)
- [tower] cost-0 Guardian Tower +1 is Nimblism then attack; Tower 13+ stays unarmed at printed 3{p} — SUP170/172/173/174 (2026-08-20)
- [trapdoor] Catch of the Day go-fish replacement throws at resolution, not `play()` — `packages/cards/src/cards/SUP/actions/SUP268-catch-of-the-day-blue.test.ts` (2026-08-20)
- [reprise] Warrior “weapons you control” on `zones:["permanent"]` + `moniker:"Weapon"` misses the combat-chain Saber — TEA008 / WTR136 (2026-08-20)
- [target] Warrior “target weapon attack” vs Generic Snatch is ELE125 silent no-op, unlike Overpower WTR124’s throw — WTR082/WTR120 (2026-08-20)
- [gap-card] Open the Center / Rising Knee Thrust WTR still hoist unprinted dominate/goAgain (KSU013 family) — WTR096/097/106 (2026-08-20)
- [arrange] `heroState: { tapped: true }` seats a tapped hero for optional `{u}` proofs — `packages/cards/src/cards/SEA/actions/SEA040-perk-up-red.test.ts` (2026-08-20)
- [latch] Chart a Course `appliesTo.next` ordinal 1|2|3 is live for first/second/third attack this turn — SEA173-175 (2026-08-20)

---

## Archived closeout wave notes (moved from the living playbook 2026-08-27)

## G-remaining-auth for-each / evo / from-banished (2026-08-27)

- [assert] `zone("deck")[0]` is the bottom canonical id; `cardsIn` returns instance refs — do not `toBe` them together — HVY253 (2026-08-27)
- [fix] for-each each-hero create-token uses `controller: "iteration-subject"` (not `each`) — HVY253 / LGS355 (2026-08-27)
- [fix] "Ponder under you and X under each opponent" is two create-token leaves, not a compound slug — OUT161 / OUT159 (2026-08-27)
- [evo] Instant Evos that transform the equipped _base_ then equip (Zoom Call / Buzz Hive / Shortcircuit / Whizz Bang) are public `play()` then `toBeIn` the slot; Zip Line `transform self` still hits occupied-seat (`engine/evo-transform-equip`) — EVO050 / EVO053 (2026-08-27)
- [play] Bounding Demigon play-static `played-non-attack-action-card-this-turn` also gates from-hand — prove the from-banished +1{p} gate, not a from-hand printed-power contrast — CHN009 (2026-08-27)
- [token] defender-seeded Seismic Surge survives P1's action phase (self-destruct is the controller's start). Destroyed Surge tokens leave the game — assert `zone("arena")` occupancy, not `toBeIn("graveyard")` / `expectFabCard` — MPG076 / MPG027 (2026-08-27)
- [cost] alternative-cost Pay/Decline at `playAttack` is `optionals:"decline"` (printed {r}) or `playInstance(..., "explicit")` then `accept()` then `.target` (banish). On-attack optional search: `optionals:"accept"` `entityTargets:"pause"` then `.target(cardIn("deck", card))` then `advanceUntil({ stopAt: "defend" })` — `resolveUntilIdle` closes combat before power asserts — CHN008 / IAR112 (2026-08-27)
- [name] name-card after a this-turn play trigger is `playAttack(..., { stopAt: "on-attack" })` then `.choose(printedName)` then `advanceUntil({ stopAt: "defend" })`. Grant the name onto binding `it`, never `self` of the resolving Action. Chi-pitch create uses `{ pitch: [innerChiBlue] }` with `resourcePoints: 0` — MST052 / PEN264 (2026-08-27)
- [freeze] unless-pay freeze is `resolveUntilIdle({ optionalBoolean: false })` when the opponent has 0{r} (escape unavailable auto-runs freeze) or `{ optionalBoolean: true }` to pay. Freeze expiry is two `endTurn`s then `notToBeFrozen` — UPR147–149 (2026-08-27)
- [combat] Instant-item Attack Reaction destroy-self +1{p} is `toReaction("attacker")` then `activate` then `passBoth` on the live chain; `untilIdle` after activate closes combat — PEN142 (2026-08-27)
- [cost] Scrap Trader `{r}{r}` per scrapped card is a resolution gain: under `FAB_MANUAL_HARNESS` RP is still 0 while the action is on the stack — EVO101 (2026-08-27)
- [combat] defending AAC +X{d} from a Seismic Surge aura is `defendWith` then `passBoth` then `toHaveDefense` before close — MPG023 (2026-08-27)

## Recipients and seats

- [arrange] `brutalAssaultBlue` (Generic 2/4), `snatchRed`, `deathDealer` + arsenal arrows, `nerveScalpel` (1H dagger), `briar` for Earth/Lightning/Elemental — `packages/cards/src/cards/shared/test-recipients.ts`
- [equipment] Off-Hand seats in `weapon2`
- [arrow] arrows play only from arsenal with a bow (CR 8.2.6a)
- [fixture] distinct heroes both sides — same-hero seating throws at start

## G37-auth[0:14] optional-permission (2026-08-23)

- [intent] "You may play your next X this turn as though it were an instant" is a floating permission, not a tutor: accept the optional, then `must.playInstant(card, { target })`; the decline boundary is `toThrow(/reject/)` on the same verb — ARC129 / CRU162 (2026-08-23)
- [intent] a permission/binding play-card with MULTIPLE legal hand candidates opens an entity chooser after the boolean — answer with `entityTargetCanonicalId` in the same `resolveUntilIdle`; a single candidate auto-binds silently — ARC129 / ELE076 (2026-08-23)
- [intent] attack cards whose resolution optional opens at layer-resolve wedge `playAttack` ("requires an explicit answer for boolean"): use `play()` + one `resolveUntilIdle({ optionalBoolean, entityTargetCanonicalId })` and prove power via life math — ELE076 (2026-08-23)
- [target] a reaction ability whose sequence target is `declared:"on-stack"` must be stamped at announce: `play(card, { target: findCardInZone("weapon1", dagger) })` — unstamped, the optional never opens and auto-executes (see §5 HNT197 pin) (2026-08-23)
- [intent] from-banished plays are `play(card, { from: "banished" })` (CHN017 idiom); a conditional from-banished permission whose condition is unmet rejects with /reject/ — CHN015 (2026-08-23)
- [assert] `zone("deck")` is bottom-first: index 0 IS the bottom (Sink Below's `at(-1)` could not distinguish — all seeded cards shared one id); bottoming asserts use `[0]` — CHN015 (2026-08-23)
- [intent] defense reactions with a damage rider need the decision chain driven in order: `play()` → `passBoth()` → `accept()` → `.target(player HANDLE, not module)` → `resolveUntilIdle({ entityTargetCanonicalId })` for the follow-up pick — PEN103 (2026-08-23)
- [intent] `playFromArsenal(card)` under `FAB_MANUAL_HARNESS` leaves the layer on the stack: `advanceUntil({ stopAt: "defend" })` before power asserts; end-of-drain ordering asks want `ordering: "listed"` — OMN237 (2026-08-23)
- [intent] printed "+X or go again" style CHOICE steps are `effect-resolution` decisions answered by `resolveUntilIdle({ effectResolution: "modify-numeric" })` (unique id/label match required) — SUP269 (2026-08-23)
- [combo] RGB sibling files generate cleanly by templating the red suite — replace export name, collector number AND the import path prefix (a missed path prefix fails suite load, which `vp test run` can still exit-0 on) — PEN104/105 (2026-08-23)

## G41-auth replacement family (2026-08-23)

- [engine] damage replacements keyed by `replaces.damageType` (Tempest Aurora, Tome of Aetherwind a1) materialize; ANY `replaces.filter` typeBox source constraint (supertypes/subtypes/controller-effect) never matches — see §5 `engine/damage-replacement-typebox-filter` — DYN209 vs ELE059/ELE186/ELE065 (2026-08-23)
- [intent] "Choose N" modal cards announce modes at play: `playInstance(..., "explicit")` then answer the N sequential "Choose mode k of N" pickers wait-gated (a `chooseMode` loop that checks `waitState` between answers — back-to-back `choose()` calls race one decision) — ARC122 (2026-08-23)
- [arrow] fused ARROWS from arsenal use the buzz-bolt idiom `attackWith(card, { from: "arsenal", fuse: true, fuseCards: [...] })`; `playFromArsenal` accepts the same opts but the fuse silently does not land through it — ELE059 / ELE048 (2026-08-23)
- [assert] gain-{p} replacements work (unlike damage replacements): Nimblism + Flourish/Thrive amp chains assert via on-link power — TER017/019/024 (2026-08-23)
- [combo] templated RGB siblings: replace BOTH the collector prefix AND every hardcoded expected number (life totals) — stale numbers from the donor suite fail confusingly — ELE060/061, ELE187/188 (2026-08-23)

## G2-auth[40:100] sequence (2026-08-20)

- [combo] keep the chain open: `playAttack` → `advanceCombatTo("resolution")` → next `playAttack`; `untilIdle` closes combo — DYN064-predatory-streak-blue.test.ts
- [combo] Combo last-attack is the previous closed link on this chain. Drain `advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" })` then `playAttack` the combo card — BEN008 (2026-08-27)
- [combo] isolate last-attack Combo +{p} on a hero without a first-hit / second-attack latch (Benji CRU047-a2, Ira IRA001-a1). Bravo is the proven seat — KSU016 / KSU024 / KSU013 (2026-08-21)
- [combat] attack cards with two same-face resolution abilities leave the stack only after the last step (CR 5.3.4 then 5.3.6); an earlier stack→combat-chain move fails the next ability's journal — SUP246-tempest-palm-gustwave-yellow.test.ts (2026-08-20)
- [cost] required play effect-costs (random hand-banish, GY-banish N, named discard, soul up-to, remove-counters, mixed alternative) are first-class in `isPayablePlayCost`; unpayable costs reverse rather than quote-deny as unmigrated — DTD110 / LEV012 / PEN254 / DTD080 / AHA009 / EVR161 (2026-08-20)
- [cost] Inner Chi may be pitched to play; it generates chiPoints that pay {r}. “If a Chi was pitched to play this” is `pitched-this-way-chi-card`. Same-layer draw-2-instead-3 is `self-replacement`, not `conditional.instead` — MST080 / MST079 (2026-08-21)
- [history] unused `resourcePoints` reset at the previous player’s end turn; Bravo as player B still needs a pitch or Vigor’s start-of-turn {r} to pay Primed after tokens leave. Simultaneous Vigor+Might start triggers need `untilIdle({ ordering: "listed" })` — HVY058 (2026-08-21)
- [target] illegal announce (no legal target, unpayable additional cost) reverses (CR 5.1.5 / 5.1.8a) and fails the fluent — `expectFabUnplayable(() => Fang.must.playReaction(card))` then assert still in hand. Silent no-op is not success. Wrap only the card under test; a setup `play()` of another card is legal. Modal reverse is the same helper, not `result.outcome.kind === "rules-action-reversed"` — PEN112 / PEN329 (2026-08-21)
- [arrow] arsenal + bow (`deathDealer`); fixture arsenal defaults **face-down** (CR 3.3). Seat `{ card, state: { faceDown: false } }` for Point the Tip / face-up arrows
- [activate] `activate()` finds a matching arena source on the other seat when this seat has none (printed “Any hero may activate”) — MON000 (2026-08-21)
- [evo] seat Teklovossen not Dash so start-game Mechanologist items do not park extras — EVO042-evo-sentry-base-head-red.test.ts
- [unless] an unless whose escape is itself `optional` needs two `accept()` then `target` — EVO245-tome-of-imperial-flame-red.test.ts
- [amount] `{ type: "roll-result" }` works; `has-status: "roll-result-*"` is fail-loud — EVR004 vs EVR014
- [target] printed “choose X [equipped]” is `count: { type: "any-number" }` plus `entityTargets: "maximum"` for the happy pick — PEN268-recede-to-mistform-blue.test.ts (2026-08-20)
- [search] deck-to-deck-top search shuffles the remainder then repositions (CR 8.5.19/8.5.20); look-cohort `them` top then bottom is choose-1 plus rest; look stamps `revealed-this-way` before the next at-resolution pick — HNT226 / ARC135 / UPR168 (2026-08-20)
- [amount] move-card onto deck bottom (or `to.shuffle`) stamps `put-on-bottom-this-way` for the follow-up draw — UPR197 / EVR187 (2026-08-20)
- [name] answer `effect-resolution` with `.choose(printedName)`; `has-status: named-card` matches the revealed `it`. choose-card must not clobber an existing `named-card` string from `name-card` — EVR167 (2026-08-23)
- [arrange] `deckTop` is bottom-first among the topped cards; the last entry is the live top — DYN159 / DYN160 (2026-08-23)
- [combat] `moniker: "Weapon"|"Dagger"` matches type-box identity; weapon scans include the open-chain source (CR 7.2.2b) — FNG013 / TEA008 (2026-08-20)
- [combat] DR "can only defend base p≤N" is a begin-play require + subjectFilter on the active attack — CIN027 (2026-08-20)
- [combat] "equipment have −1{d} while defending this chain" is a this-chain defend latch, not a Layer snapshot — DYN095 (2026-08-20)
- [combat] next-attack go again latches weapon proxies once the weapon is paid onto Defend; `notToHaveKeyword` is vacuous if combat never opened — HVY240-agility.test.ts (2026-08-20)
- [combat] granted Cintari-style “when defended by an AAC, +1{p} EOT” is a triggered layer; under `FAB_MANUAL_HARNESS`, `defendWith` then `passBoth` before the power assert — MON113-plow-through-red.test.ts (2026-08-21)
- [weapon] extra dagger activation is `modify-activation-limit` on `this-attack`, accepted after the AR resolves, then a later activation after the chain closes — HNT102-long-whisker-loyalty-red.test.ts (2026-08-20)
- [combat] Defense Reaction self-statics stay functional on the chain (fused +{d}) — ELE010-turn-timber-red.test.ts (2026-08-20)
- [trigger] start-phase `has-status: control-less-equipment-than-all-other-heroes` fail-louds on `untilIdle` after public `endTurn` — DYN029 (2026-08-21)
- [trigger] create-token + appliesTo.next is a delayed first-hit latch, not an eager create — ELE163-chill-to-the-bone-red.test.ts (2026-08-20)
- [combat] on-attack `exchange` of equipment-head is two at-resolution targets; `advanceUntil({ entityTargets: "minimum" })` picks each seat — LSS019-scarf-for-a-scarf-red.test.ts (2026-08-20)
- [ally] Dromai dragon allies have no printed Attack; seat Storm of Sandikai (`Once per Turn Action - 0: Attack`) then `activate(ally)` — UPR008-dominia.test.ts (2026-08-20)
- [cost] triggered `additionalCost` is a boolean after modes/targets; CR 6.6.5b does not re-check the trigger state at resolution (Thaw may leave GY and still destroy) — UPR086-thaw-red.test.ts (2026-08-20)
- [cost] optional destroy-any-number play cost: `play()` auto-declines Pay/Decline; `playInstance(..., "explicit")` then `accept()`/`decline()` then `.target` — EVR158-cash-out-blue.test.ts (2026-08-20)
- [steal] `until-end-of-action-phase` reclaims when `endTurn` leaves the action phase; assert `zone("arena")` occupancy — SEA202-jack-be-quick-red.test.ts (2026-08-20)
- [steal] `expectFabCard` is owner-based after control change; assert `zone("arena")` occupancy — OMN215-tempt-over-yellow.test.ts (2026-08-20)
- [construct] Fabric construct go again is a stack grant (include `zones:["stack"]`) so play refunds AP (CR 8.3.5a) — LSS009-silversheen-needle.test.ts (2026-08-20)
- [trigger] optional + `appliesTo.next` is a delayed first-hit, not a resolution-time may — EVR170-smashing-good-time-red.test.ts (2026-08-20)
- [construct] Action-Construct transform uses flip layout + `transform-into-resolving-card` (Nitro Mechanoid idiom) — AMX022-construct-bank-breaker-yellow.test.ts (2026-08-20)

## G2-auth[100:160] sequence (2026-08-20)

- [combat] simultaneous hit / extra-attack optionals: `closeCombat({ optionals: "decline", ordering: "listed" })` — HNT209-scar-tissue-yellow.test.ts
- [intent] `helpers.resolveUntilIdle` does not honor `optionals`; use `game.untilIdle({ optionals, entityTargets: "minimum" })` — HNT248-roiling-fissure-blue.test.ts
- [harness] `untilIdle({ optionals: "accept"|"decline" })` answers optional replacement choosers (min 0 option sets): accept = all ids, decline = none — PEN251 (2026-08-21)
- [intent] granted on-attack wager is public: `activateAttack(..., { stopAt: "on-attack" })` then `accept()` — HVY130-hold-em-red.test.ts
- [weapon] Take a Stab’s extra attack is a later activation after the chain closes, not a second link — HNT211-take-a-stab-red.test.ts
- [opt] `keywords: [opt(N)]` plus a resolution `opt` step runs Opt twice — LEV025-blood-tribute-blue.test.ts
- [harness] Marked is `expectFabPlayer(h).toBeMarked()` / `notToBeMarked()` — FNG016-searing-gaze-red.test.ts (2026-08-21)

## G2-auth[160:220] sequence (2026-08-20)

- [weapon] leftover AP is required before `activation_limit` can be observed; a third swing with 0 AP is `insufficient_action_points` first — MON111-dusk-path-pilgrimage-yellow.test.ts
- [opt] `untilIdle({ ordering: "listed" })` keeps Opt on top; `play`/`activate` `{ optBottom: N }` bottoms the first N looked cards when Opt is answered during that verb. Resolution Opt after `play()` needs `untilIdle({ optBottom: N })` — MON162 / ARC037 / IAR212 (2026-08-22)
- [cost] alternative-cost Gold is `modeIds: ["pay"]` / `["decline"]`, not `payWithGold` — MPW033-rake-back-blue.test.ts
- [wager] an attack-reaction `wager` with no `attacker` override uses the reaction as layer source — MPW042-donkey-blue.test.ts
- [status] sequence-step `has-status` throws on `untilIdle`, not `play()`; ability-level `condition` throws at `play()` — MST080-orihon-of-mystic-tenets-blue.test.ts
- [target] `top-or-bottom` at-resolution asks destination before the GY entity-target; use `cardsIn("graveyard", card)[0]` — OMN158-flow-through-blue.test.ts

## G2-auth[220:280] sequence (2026-08-20)

- [effect] `choose-color` is a public `effect-resolution` Red/Yellow/Blue chooser; `.choose("Blue")` then `toHaveColor("Blue")`. `playAttack` does not auto-pick when 3 options exist — PEN040-become-the-cup-red.test.ts (2026-08-21)
- [intent] under `FAB_MANUAL_HARNESS`, `play()` leaves the layer on the stack — `passBoth()` before at-resolution `.target()` — PEN113-glyph-power-spell-red.test.ts
- [meld] melded split cards open priority between faces (right then left). After Shock, `passBoth()` again before Vaporize's at-resolution destroy chooser — ROS011 (2026-08-21)
- [search] deck search targets need `cardIn("deck", card)`; `.target(module)` does not see deck instances — PEN257-phoenix-bannerman-head-red.test.ts
- [intent] `untilIdle` ignores `entityTargetCanonicalId`; search picks need `helpers.resolveUntilIdle({ entityTargetCanonicalId })` — SUP258-take-the-bait-red.test.ts
- [evo] transform of `self` with a base still seated throws occupied-seat; transform the equipped base — TCC009-evo-scatter-shot-blue.test.ts
- [assert] `expectFabCard(…).toBeIn("combatChain")` — not `"combat-chain"` — ROS086-electromagnetic-somersault-yellow.test.ts

## G2-auth[280:319] sequence (2026-08-20)

- [weapon] Cintari Saber gains +1{p} EOT when defended by an attack action — a miss setup must use non-AAC defense (Nimblism) or the "miss" still deals — TEA012-driving-blade-red.test.ts
- [search] Nature's Path on-hit reveal is at-resolution deck-top — `helpers.resolveUntilIdle({ entityTargetCanonicalId })` to land the action face-down in arsenal — TEA013-nature-s-path-pilgrimage-red.test.ts
- [token] create-then-transform up-to: `entityTargets: "maximum"` vs `"minimum"` after the create; do not assert token counts after a later sequence throw reverses the layer — UPR034-rake-the-embers-yellow.test.ts
- [status] Ice Fusion wizard riders stamp target identity at proposal time, but `dealt-damage-to-hero` only after a positive post-prevention packet (CR 6.4 / 8.5.3a). Preserve the exact `damage-target` and `target-controller`; Icevein's damaged hero chooses the non-random discard, Encase freezes that hero/equipment, and Succumb destroys the bound frozen Ally rather than combat `attack-target` — UPR104 / UPR110 / UPR113 / UPR122 (2026-08-21)
- [status] 6-power this-way riders read the discard/banish cohort (printed {p} ≥ 6). Additional-cost GY banish stamps `banished-this-way` onto the layer. Pound of Flesh is `for-each` each-hero: banish `player: "iteration-subject"` then `didnt-banish-this-way-card-with-6-or-more-p` lose-life on that subject — LEV010 / MON125 / MST236 / PEN189 (2026-08-20)
- [target] printed freeze without “target” is `at-resolution` after the damage stamp — on-stack `target-controller` at announce is illegal encoding (UPR119)
- [target] look top-N then “choose a card” opens a pick from the looked cohort; stay at reaction (`advanceUntil({ stopAt: "reaction", entityTargets: "minimum" })`) so combat does not close — MST017-intimate-inducement-red.test.ts (2026-08-21)
- [construct] no printed “target” → at-resolution subjects (CR 1.8.5c). Missing wrench does not reverse announce; transform fails and go again still refunds AP — AMX022-construct-bank-breaker-yellow.test.ts (2026-08-21)
- [phantasm] stripping the keyword after a 6{p} AAC defend does not cancel an already-stacked phantasm destroy — UPR154-semblance-blue.test.ts

## K-small-auth (2026-08-20)

Small remaining keyword groups (1–6 cards). Keyword goldens beat presence-only checks: prove the CR effect.

- [keyword] Blade Break destroys at chain close after defending, not on declaration — ELE204-rotten-old-buckler.test.ts
- [keyword] Rune Gate: `attackWith(card, { from: "banished" })` with `fabToken("runechant")` ≥ cost and RP 0; fewer tokens throw — DTD155-vantom-banshee-red.test.ts
- [history] “banished from your hand this turn” play-from-banished: pay a hand-banish additional cost (Shaden Swing) then `attackWith(..., { from: "banished" })`. Fixture-arranged banished has empty history — DTD109 (2026-08-21)
- [keyword] Blood Debt taxes at end phase only while public-banished — DTD155-vantom-banshee-red.test.ts
- [reload] DR Reload needs `playInstance(..., "explicit")` then `passBoth` then `accept()`. A singleton hand card is determined (CR 1.8.6c) — do not `.target()` it. Occupied arsenal is not overwritten — ARC048-take-cover-red.test.ts
- [target] `.target(card)` answers a pending entity-target and remains a no-op when a CR 1.8.6c determined set needs no chooser. Use `.targetRequired(card)` when the boundary assertion specifically requires a live chooser, so absence fails loudly. Default identity is `"attack"` (live attack-proxy of the named source, CR 1.4.3); `{ identity: "source" }` forces the original. Empty `.target()` is choose-none on an up-to / min=0 prompt — `packages/engine/src/testing/target-identity.ts` / HVY106 (2026-08-21)
- [combat] Snatch on-hit draw opens simultaneous-trigger ordering on `closeCombat`; for a non-ephemeral GY contrast use `brutalAssaultBlue` — DYN065-crouching-tiger.test.ts
- [keyword] Heave N at end of turn: seed N resources, `endTurn`, `entity-target` this into arsenal, create N `token:seismic-surge` — MPG082-rubble-raiser-red.test.ts
- [arcane] Voltic Bolt Red deals **5** arcane (Nullrune Hood 20→16 is prevent-1-of-5) — ARC147 / ARC155-nullrune-hood.test.ts

## T3-auth (2026-08-20)

Size-3 RGB/similar families. Pin observed engine misses; do not half-fix modules.

- [assert] `expectFabCard` is ambiguous when copies of the same id sit in GY + hand — use `zone()` length/`toContain` — TCC039-boulder-drop-yellow.test.ts
- [target] hit-discard with no at-resolution object throws `discard: object target is unresolved` — BET009-concuss-red.test.ts
- [arsenal] CR 4.4.3b end-turn arsenal is face-down; Death Dealer loads face-up for Opt — ARC063-ridge-rider-shot-red.test.ts
- [play] DR/trap from arsenal: `playInstance(..., { from: "arsenal" }, "explicit")` — default `from` is hand (`no longer in a legal play zone`) — CRU127-pitfall-trap-yellow.test.ts
- [opt] Opt X bound to boost-count can stack-overflow in `handleOpt` — CRU115-teklovossen-s-workshop-red.test.ts

## T3c-auth (2026-08-20)

Remaining exclusive size-3 groups after T3/T3b. Pin observed misses; do not half-fix modules.

- [arrow] Dreadbore optional then `self` is the bow; loaded arrow stays printed {p} — EVR087-dreadbore.test.ts
- [harness] item `activate({ optBottom })` and `untilIdle({ ordering: "listed" })` answer Opt partitions — ARC037 (2026-08-22)
- [harness] after `defendWith`, attacker still has priority. `passBoth()` then controller `.targetRequired(a, b)` then opponent `.targetRequired(a)` for choose-2 then opponent-picks-1 — MPG126 (2026-08-22)
- [harness] `closeCombat({ entityTargets: "pause" })` / `untilIdle({ entityTargets: "pause" })` stop on a non-forced entity-target so the test can `.targetRequired` — MST192 (2026-08-22)
- [prevention] equipment optionalCost `banish` `from: "arena"` does not scan Legs — DTD168-dance-of-darkness.test.ts
- [ally] Dromai dragon hits need Storm of Sandikai then `activate(ally)` — UPR016-vynserakai.test.ts
- [clash] prove crowd-cheers via Tuffnut Toughness, not presence-only — SUP043-rapturous-applause-red.test.ts

## G19-auth[0:10] (2026-08-22)

- [combat] two seeded Runechants plus an on-attack draw need `playAttack(..., { stopAt: "on-attack" })` then `advanceUntil({ stopAt: "defend", ordering: "listed" })` — ARC097 (2026-08-22)
- [weapon] Wrath’s this-chain dagger −1{r}/+1{p} is paid from leftover RP after the attack; seed 4{r} so 1 remains after the 3-cost play — CIN021 (2026-08-22)

## G21-auth[0:10] (2026-08-22)

- [assert] combat keywords use hyphenated slugs (`go-again`, not `goAgain`) — DRO017-sweeping-blow-red.test.ts (2026-08-22)
- [combat] 4{p} vs one 4{d} AAC still hits; miss Dread Triptych with two 4{d} defenders — CRU142-dread-triptych-blue.test.ts (2026-08-22)

## G18-auth[10:20] (2026-08-22)

- [token] `toHaveTokenCount` only counts arena; Crouching Tigers created in hand or banished are `zone(...).filter(id => id.startsWith("token:crouching-tiger"))` — DYN048 / DYN053 (2026-08-22)
- [weapon] Anothos payment after a start-of-turn trigger: `activate` then `answer-decision` with one Nimblism Blue, then `advanceUntil({ stopAt: "defend" })` — DYN073 (2026-08-22)

## G18-auth[20:30] (2026-08-22)

- [trigger] Blessing of Focus start-of-turn Opt 3 then reveal-top Arrow is public `endTurn` then opponent `endTurn` then `untilIdle({ ordering: "listed", optBottom: 0 })` — face-up arsenal with an aim counter — DYN159 / DYN160 / DYN161 (2026-08-27)

## G18-auth[30:40] (2026-08-22)

- [weapon] extra dagger activation still spends an action point; Nerve Scalpel go again refunds AP for the second swing, and weapon pitch is one card at a time — HNT126 (2026-08-22)

## G16-auth[10:20] (2026-08-22)

- [combat] IRA010 Brutal Assault Blue is 3{d}; 4{p} vs one copy still hits — miss with two copies — EVO201 / FAI014 (2026-08-22)
- [arrange] Golden Cog enters with a steam counter; on-hit tap-then-steam is 2 — SEA015 (2026-08-22)
- [token] seeded catalog Golden Cog is not `token:golden-cog`; created copies are. Count both with `expectFabCard` + `toHaveTokenCount` — SEA018 (2026-08-22)
- [combat] miss 5{p}/4{p} vs IRA010 with two 3{d} copies in one `defendWith` — SEA016 / SEA017 (2026-08-22)
- [status] on-hit banish-then-play this-turn from banished is still unmigrated — pin family `engine/play-card-this-turn-from-banished` — UPR054 / UPR076 / UPR081 (2026-08-22)

## G18-auth[40:49] (2026-08-22)

- [trigger] start-phase pitch of deck-top does not bind `it`; Shifting Tides always takes the destroy branch — SEA148 (2026-08-22)
- [status] GY `in-your-graveyard` start-phase is not scanned (Draco Fire copies stay in GY) — OMN245 (2026-08-22)
- [token] `confidence-and-3-might` is an absent compound slug; pin on untilIdle — SUP075 (2026-08-22)

## G14-auth[0:10] (2026-08-22)

- [combat] on-defend search (min 0) needs `helpers.resolveUntilIdle({ optionalBoolean: true, entityTargetCanonicalId })` — `untilIdle({ optionals: "accept" })` pauses — AJV013 (2026-08-22)
- [status] Unity `boltyn-in-your-party` (and party repeats) fail-loud on together-from-hand defend — DTD079 (2026-08-22)
- [status] on-defend clash `clash-has-winner` fail-loud; `hero-won-both-clashes` is a silent no-op — MPG025 / HVY061 (2026-08-22)

## G14-auth[10:20] (2026-08-22)

- [clash] Clash of Heads/Chests/Arms/Legs/Shields fire on a Guardian attack then tax the attack-target {h} instead of opening a -1{d} equipment pick — pin family `engine/clash-unless-attack-target` — MPG047–MPG051 (2026-08-22)
- [status] Induce Panic choose-color plus random reveal does not discard the matching color — pin family `engine/binding-matches-chosen-color` — OMN246 (2026-08-22)
- [combat] Collapsing Trap go-again discard-then-draw N-1 does not cycle the attacking hero's leftover hand — pin family `engine/discarded-this-way-draw` — OUT103 (2026-08-22)
- [arrange] Off-Hand seats as `weapon2: [card]`; Head/Chest/Arms/Legs are named fixture zones, not `equipment:` — MPG047 / MPG051 (2026-08-22)

## G14-auth[20:30] (2026-08-22)

- [status] on-defend galvanize `destroyed-this-way-golden-cog` fail-louds even after decline — PEN165 / SEA004 (2026-08-22)
- [guess] on-defend look/choose-color/guess is `untilIdle({ optionals:"accept", entityTargets:"pause" })` then defender `.choose` color then attacker `.choose` guess; `entityTargets:"pause"` also stops on effect-resolution — SUP077 (2026-08-27)

## G17-auth[0:10] (2026-08-22)

- [combat] `untilIdle` after `defendWith` closes combat before a power assert — accept/decline on the live chain or pin after close — AST015 (2026-08-22)
- [trigger] “When this is defended by 1 or more cards” never opens a pay optional after public `defendWith` — pin family `engine/when-this-is-defended` — AST015 / AUR022 / AUR025 (2026-08-22)
- [combat] Galvanize destroy-item +2{d} is public `defendWith` then `untilIdle({ optionals: "accept" })` then `.target(item)` — EVO117 / EVO120 (2026-08-22)

## G17-auth[10:20] (2026-08-22)

- [combat] `untilIdle` after defend closes the chain: 4{p} vs 3{d} is 19{h}, vs 2{d} is 18{h}; do not assert 20{h} after drain — HNT253 / HVY142 / SEA023 / SEA030 (2026-08-22)
- [token] seeded catalog Might is not `token:might`; assert `expectFabCard(..., might).toBeIn("arena")` — HVY142 (2026-08-22)
- [combat] DR `untilIdle` after `playReaction` puts the reaction in GY; assert face-up arsenal / token counts, not combatChain — HNT253 / OMN147 (2026-08-22)

## G17-auth[20:30] (2026-08-22)

- [combat] 1v1 Crowd Control pay-3{r} is +1{d} (one opposing hero) — TCC060 / TCC063 / TCC076 (2026-08-22)
- [token] Lost in Transit Thief remove-gold-counter creates Gold; Gravy does not — SEA151 (2026-08-22)
- [trigger] Return Fire delayed start-phase never leaves banished — pin family `engine/delayed-banish-to-arsenal` — SEA099 (2026-08-22)
- [assert] `expectFabCard(...).not.toBeTapped()` is undefined — use `toBeTapped()` or zone occupancy — SEA055 (2026-08-22)

## G30-auth[0:10] (2026-08-22)

- [trigger] start-phase steam unless is `endTurn` then `untilIdle({ optionals: "accept" })` to keep the item — AIO026 / AMX026 / EVO070 (2026-08-22)
- [weapon] 2H wrenches seat as `weapon1`; Banksy specialization needs Maxx — AMX026 (2026-08-22)
- [target] Grinding Gears mill is controller `untilIdle({ entityTargets: "pause" })` then `.targetRequired(cardsIn("deck", ...))` — EVO070 (2026-08-22)
- [fix] `name: "Mechanologist Item"` / `"Red Mechanologist Attack Action Card"` do not match type-box — pin family `definition/name-filter-type-phrase` — EVO072 / EVO081 (2026-08-22)

## G30-auth[10:20] (2026-08-22)

- [fix] Backup Protocol yellow/blue reuse the red name-filter pin — EVO082 / EVO083 (2026-08-22)
- [intent] defender Instant after `playAttack({ stopAt: "defend" })` needs `defendWith()` then attacker `pass()` before `activate` — EVO087 (2026-08-22)
- [amount] Hadron Collider if-you-do +X{p} reads steam after destroy (0) — pin family `engine/if-you-do-counters-after-destroy` — EVO090 / EVO091 (2026-08-22)

## G30-auth[20:30] (2026-08-22)

- [amount] Hadron Collider blue reuses the if-you-do steam-after-destroy pin — EVO092 (2026-08-22)
- [status] named-card restrict play-from-hand is unenforced — pin family `engine/named-card-play-restrict` — HNT251 (2026-08-22)
- [search] Assembly Module `{t}` search Hyper Driver into arena is `activate` then `resolveUntilIdle({ entityTargetCanonicalId })` with the Action Item in deck, not the token module — PEN067 (2026-08-27)

## G32-auth[0:10] (2026-08-22)

- [combat] on-hit next-attack dominate is `playAttack` then `closeCombat` then a second attack this turn; seed leftover AP — ARC011 / ARC012 / ARC013 (2026-08-22)
- [arrange] Katsu first-hit discards need `closeCombat({ ordering: "listed" })`; Ira isolates ninja on-hit go again — CRU066 (2026-08-22)
- [fix] unprinted `keywords: [goAgain]` refunds AP on a miss — pin family `definition/unprinted-go-again` — CRU066 / CRU070 (2026-08-22)
- [status] High Speed Impact next-boosted dominate fail-closes `has-status: boosted` — pin family `status/boosted` — CRU106 / CRU107 (2026-08-22)

## G32-auth[10:20] (2026-08-22)

- [status] High Speed Impact blue reuses the boosted-dominate pin — CRU108 (2026-08-22)
- [fix] Light the Way unprinted `keywords: [goAgain]` refunds AP without a yellow charge — pin family `definition/unprinted-go-again` — DTD066 / DTD067 / DTD068 (2026-08-22)
- [fix] Drill Shot yellow/blue unprinted `keywords: [piercing(1)]` grants piercing without an aim counter — pin family `definition/unprinted-piercing` — DYN157 / DYN158 (2026-08-22)
- [combat] Ride the Tailwind next AAC base-{p}≤2 go again does not land — pin family `engine/applies-to-next-base-power` — EVR044 / EVR045 / EVR046 (2026-08-22)

## G32-auth[20:25] (2026-08-22)

- [fix] Drowning Dire unprinted `keywords: [dominate]` is present with no aura — pin family `definition/unprinted-dominate` — EVR110 / EVR111 / EVR112 (2026-08-22)
- [intent] on-hit optional GY recycle is `helpers.resolveUntilIdle({ optionalBoolean: true, entityTargetCanonicalId })` — EVR110 (2026-08-22)
- [combat] unprinted dominate forbids two hand defenders on a miss setup — decline the on-hit instead — EVR110 (2026-08-22)
- [play] IAR164 has no play-static `fromZones: banished`; `attackWith` from banished is rejected — pin family `definition/play-from-banished-permission` — IAR164 (2026-08-22)
- [intent] defender DR after an attack is `toReaction("defender")` then `must.playReaction` — IAR164 (2026-08-22)

## G46-auth[0:10] (2026-08-22)

- [assert] on-hit self-to-deck-bottom is `cardsIn("deck", card)` plus `zone("deck")[0]` (bottom-first) — ARC020 / ARC066 (2026-08-22)
- [arrow] Ranger arrows use `playAttack(..., { from: "arsenal" })` with `deathDealer` and face-up arsenal seating — ARC045 / ARC066 (2026-08-22)
- [combat] Boost on Over Loop is an optional at close; `closeCombat({ optionals: "decline" })` keeps the on-hit deck-bottom — ARC020 (2026-08-22)

## G46-auth[10:20] (2026-08-22)

- [combat] Dominate on-hit soul attacks miss with one 6{d} Defense Reaction (Soul Shield), not two hand cards — MON023 / MON024 / MON025 (2026-08-22)

## G46-auth[20:22] (2026-08-22)

- [combat] 4{p} Under Loop (TCC016) still hits one IRA010 3{d}; miss with two copies — TCC016 (2026-08-22)

## G54-auth[0:10] (2026-08-22)

- [token] aura/figment enter-arena creates with public `play()` then `toHaveTokenCount` — CRU144 / DTD005 / ELE028 (2026-08-22)
- [token] Ice Fusion Emerging Avalanche `controller:any` mints Frostbite under both heroes — pin family `create-token/controller-any` — ELE025 / ELE026 / ELE027 (2026-08-22)

## G54-auth[10:18] (2026-08-22)

- [token] Solitary Companion skip-create when another Illusionist aura is already seated — ENG021 / MST149 / MST150 (2026-08-22)
- [token] start-of-turn Might destroy consumes the enter-arena pair before Channel's action-phase mint — PEN217 (2026-08-22)
- [intent] Surface Shaking action-phase destroy plus Seismic Surge start-of-turn destroy needs `untilIdle({ ordering: "listed", optionals: "decline" })` — SEA251 (2026-08-22)

## G56-auth[0:10] (2026-08-22)

- [clash] on-defend clash prize is public `defendWith` then `untilIdle`; `expectCombat.toHaveClashWinner` plus `toHaveTokenCount` — HVY137 / BDD012 (2026-08-22)
- [clash] Clash of Mountains only clashes when the defended attack is Guardian — generic Snatch is the boundary — BDD012 (2026-08-22)

## G56-auth[10:17] (2026-08-22)

- [clash] Pec Perfect “whenever a card defends this” clash never opens; pin family `engine/defend-this-clash` — MPG017 (2026-08-22)
- [clash] Clash of Bravado prize is at-resolution destroy of the other hero's aura; `untilIdle({ entityTargets: "minimum" })` — MPG015 (2026-08-22)

## G42-auth[0:10] (2026-08-22)

- [combat] on-defend this-combat-chain +{d} is `defendWith` then `passBoth` then `toHaveDefense` on the live chain — DTD094 (2026-08-22)
- [combat] Galvanize +2{d} reuses EVO117: `untilIdle({ optionals: "accept" })` then `.target(item)` — EVO105 / EVO141 (2026-08-22)
- [status] Ratchet Up / Steel Street Hoons resolution `item-you-control-destroyed-this-turn` fail-louds at `playAttack` — pin family `status/item-you-control-destroyed-this-turn` — EVO105 / EVO141 (2026-08-22)

## G42-auth[10:17] (2026-08-22)

- [combat] Teklonetic Force Field blue is 1{d}+2 vs overpower; 3{d} still takes 2 from Jolly Bludger — EVO233 (2026-08-22)
- [status] Rune Snare on-defend `attacking-hero-played-or-created-2-or-more-auras-this-turn` fail-louds — pin family `status/attacking-hero-played-or-created-2-or-more-auras-this-turn` — PEN084 (2026-08-22)
- [combat] Spellbane Trap on-defend Spellbane Aegis needs prior arcane this turn (Voltic Bolt then Snatch) — PEN089 / PEN090 / PEN091 (2026-08-22)
- [combat] Will of the Crowd +3{d} needs a cheer earlier this turn (Helm of the Adored on a prior link); same-link helm cheer is too late — SUP035 (2026-08-22)
- [combat] Sit! +3{d} only vs a Brute type-box attack (Pound Town), not Generic Snatch — SUP210 (2026-08-22)

## G40-auth[0:10] (2026-08-22)

- [trigger] action-phase-start destroy-then-next-attack: seat the controller as player B so public `endTurn` enters their action phase; unused RP resets so pay Disable with pitch, not seeded RP — CRU029 / FLR017 (2026-08-22)
- [assert] combat power is `expectCombat(game).toHaveAttackPower`, not `toHavePower` — CRU029 (2026-08-22)

## G40-auth[10:17] (2026-08-22)

- [assert] action-phase-start gain-life is `expectFabPlayer.toHaveLife` after public `endTurn` into the controller's action phase — ROS061 / ROS062 / ROS063 (2026-08-22)
- [combat] Guardian-only next-AAC +{p} reuses CRU038: Disable + pitch vs Generic Snatch boundary — WTR071 (2026-08-22)

## G31-auth[0:10] (2026-08-22)

- [contract] on-hit contract attacks mint Silver on any opponent-banish; printed cost/color/reaction/go-again task filters are not applied — pin family `engine/contract-task-filter` — DYN127 / DYN139 / DYN142 (2026-08-22)

## G31-auth[10:17] (2026-08-22)

- [hero] Assassin contract tests seat Bravo, not Arakni: Arakni's on-play look optional wedges `playAttack` under `FAB_MANUAL_HARNESS` — DYN145 / EVO236 (2026-08-22)
- [fix] Excessive Bloodloss yellow/blue bind `banished` while the red-repeat condition reads `it` — pin family `definition/binding-it` — PEN145 / PEN146 (2026-08-22)

## G39-auth[0:10] (2026-08-22)

- [fix] Angel “When Suraya/Themis/… attacks” uses a short `name:` filter that misses the printed full name, so soul-banish never opens — pin family `definition/name-filter-short-name` — DTD005–DTD010 (2026-08-22)
- [weapon] Bank Breaker’s empty-under optional still opens; `activateAttack({ stopAt: "on-attack" })` then `decline()` — AMX022 (2026-08-22)

## G39-auth[10:16] (2026-08-22)

- [fix] Angel/Demon “When Victoria/Bellona/Blasmophet attacks” reuses the short `name:` filter pin — DTD011 / DTD012 / MON219 (2026-08-22)
- [weapon] Pile Driver wager is public `activateAttack({ stopAt: "on-attack" })` then `accept()` / `decline()` — OMN230 (2026-08-22)
- [weapon] Mini-Meataxe on-attack is draw then random discard; empty hand still discards the drawn card — HVY007 (2026-08-22)

## G64-auth[0:10] (2026-08-22)

- [keyword] on-attack intimidate is public `playAttack`; empty defending hand still attacks; end-phase return plus start-of-turn draw means do not assert leftover hand count 1 — RNR009 (2026-08-22)
- [combat] Tear Down the Idols only intimidates a Revered hero; Bravo is the non-Revered boundary — SUP086 (2026-08-22)

## G57-auth[0:10] (2026-08-22)

- [combat] Brand then Art of the Dragon: Fire: prior-link 3{p} already resolved at this link's Defend; on-attack ping is 20→15 before this 5{p} — CIN007 (2026-08-22)
- [target] fused on-attack arcane is `playAttack({ fuse: true, fuseCards, stopAt: "on-attack" })` then `.target(Dash)` — ELE070 / ELE230 (2026-08-22)

## K:go-again G33-auth[0:14] (2026-08-22)

- [keyword] printed go again on attacks refunds AP after `closeCombat`, including on a miss — KSU011 / ARC072 (2026-08-22)
- [timing] Action cards are illegal as instants: `toReaction("attacker")` then `expectFabUnplayable(..., /action card is not legal/)` — do not use Snatch (on-hit arsenal wedges `toReaction`) — KSU011 (2026-08-22)
- [fix] Clearing Bellow prints Intimidate but the module omits the keyword — pin family `definition/unprinted-intimidate` — RVD025 (2026-08-22)

## K:go-again G33-auth[14:21] (2026-08-22)

- [keyword] UPR/WTR go-again reprints reuse FAI017/IRA008/KSU012 goldens: printed go again refunds AP on hit and miss — UPR067 / UPR073 / WTR099 (2026-08-22)

## A-activated remaining (2026-08-22)

- [activate] defender Instant prevention after `playAttack` is `defendWith()` then attacker `pass()` then `activate` — AUA023 / ROS104 / ROS105 (2026-08-22)
- [assert] `expectFabCard` cannot resolve deck-bottomed items — use `zone("deck")` — EVO075 / EVO076 / EVO077 (2026-08-22)
- [intent] `untilIdle({ entityTargets: "pause" })` then `.target(hero)` for staff/hero arcane — CRU160 / OMN121 (2026-08-22)

## G57-auth[10:15] (2026-08-22)

- [combat] on-defend “deal 1 arcane to target hero” is `defendWith` then `.target` then `passBoth` so the ping resolves before combat damage — OMN056 (2026-08-22)
- [ally] Burn Them All dragon ping seats Storm of Sandikai plus a Dragon ally (Yendurai); non-dragon Snatch is the boundary; a second Dragon ally this turn proves the once-per-turn cap — UPR005 (2026-08-22)

## K:boost G43-auth[0:14] (2026-08-22)

- [keyword] CR Boost is `attackWith(card, { boost: true })`: Mechanologist deck-top is banished and the attack gets go again; `{ boost: false }` leaves banished empty and no go again. `expectFabCard` cannot resolve private deck instances — use `zone("banished")` length for the unboosted contrast — ARC023 / EVO162 (2026-08-22)

## K:boost G43-auth[14:18] (2026-08-22)

- [keyword] Gas Guzzler blue and Heart Wrencher RGB reuse the Throttle/Gas Guzzler Boost golden — EVO173 / PEN075 / PEN076 / PEN077 (2026-08-22)

## W1-rm-auth[0:14] (2026-08-22)

- [combat] Lay Waste reuses Out Pace: equipment is illegal on this chain; a hand AAC still defends; the ban dies with the chain — EVO207 / EVO208 (2026-08-22)

## K:specialization G231-auth[0:2] (2026-08-22)

- [keyword] CR 8.3.7 specialization is pregame/deckbuilding; fixture `play()` still succeeds for a different seated hero — pin `keyword/specialization-play-permission` — LSS005 (2026-08-22)

## T:hit|F:banish G50-auth[0:10] (2026-08-22)

- [combat] on-hit deck-top banish is `playAttack` then `closeCombat({ ordering: "listed" })`; miss contrast uses `cardsIn("deck", card)` — MST107 / MST118 (2026-08-22)
- [play] Hungering Demigon printed soul play-from-banished is still unmigrated — pin `definition/play-from-banished-permission` — DTD172 (2026-08-22)

## T:hit|F:banish G50-auth[10:14] (2026-08-22)

- [combat] Mind's Desire on-hit life is a non-attack action deck-top (Nimblism), not a reaction — MST124 / MST125 / MST126 (2026-08-22)

## T:attack|F:grant-property G66-auth[0:10] (2026-08-22)

- [keyword] next-stealth go again is `playAttack` then `advanceCombatTo("resolution")` then the next stealth `playAttack` — AAC009 (2026-08-22)
- [keyword] marked-hero go again is public `playAttack` vs `marked: true` — HNT047 / HNT048 / HNT049 (2026-08-22)
- [fix] Hydraulic Press unprinted `keywords: [overpower]` is present with no scrap — pin family `definition/unprinted-overpower` — EVO102 / EVO103 / EVO104 (2026-08-22)
- [combat] Briar fused on-attack plus Embodiment needs `advanceUntil({ stopAt: "defend", ordering: "listed" })` — ELE064 (2026-08-22)
- [combat] equipped Head is `toBeIn("head")`, not arena — HNT076 (2026-08-22)

## T:combat-chain-close|F:create-token G60-auth[0:10] (2026-08-22)

- [token] miss-on-close defending-hero tokens are `playAttack` then `defendWith` then `closeCombat` then `toHaveTokenCount` on the defending hero — SUP052 / SUP111 / SUP152 / SUP189 (2026-08-22)

## T:combat-chain-close|F:create-token G60-auth[10:12] (2026-08-22)

- [token] Shoot Your Mouth Off yellow/blue reuse the SUP189 miss-on-close Confidence golden; 7{p}/6{p} hits are 20→13 / 20→14 — SUP190 / SUP191 (2026-08-22)

## T:attack|F:grant-property G66-auth[10:14] (2026-08-22)

- [fix] Insult to Injury unprinted `keywords: [goAgain]` is present without more {h} — pin family `definition/unprinted-go-again` — PEN303 / PEN304 / PEN305 (2026-08-22)
- [token] opponent Gold for “control less Gold than an opponent” is `arena: [fabToken("gold")]` on the defending hero — SEA162 (2026-08-22)

## T:defend|F:create-token G47-auth[0:10] (2026-08-22)

- [token] Crouching Tiger created in hand is not `toHaveTokenCount`; filter `zone("hand")` for `token:crouching-tiger` — MST050 (2026-08-22)
- [token] Ranger trap `controller:any` reuses ELE025: mint under both heroes — PEN086 / PEN087 / PEN088 (2026-08-22)
- [status] on-defend Bloodrot Pox after an attacker reaction never mints — pin family `status/attacking-hero-played-or-activated-this-chain-link-reaction` — ARA019 (2026-08-22)
- [combat] Rapid Reflex then a Trap DR: `passBoth` after the AR so +{p} is live (`toReaction("defender")` does not empty a stacked AR). Defend-trigger DRs need a second `passBoth` (Drag Down) to resolve the triggered layer. — OUT173 / HNT214 / OUT106 / PEN332 (2026-08-27)
- [fix] Brute/Guardian `typeBox.supertypes` on defended-attack still creates tokens for any defender — pin family `definition/defend-typebox-supertype` — SUP142 / SUP185 (2026-08-22)

## T:end-phase|F:sequence G49-auth[0:10] (2026-08-22)

- [assert] `expectFabCard` cannot resolve inventory Agents — use `zone("inventory")` — HNT003 / HNT004 / HNT006 (2026-08-22)
- [trigger] Channel Ice / return-to-brood / Doomsaying end-phase is public `endTurn` then `untilIdle` — ELE146 / HNT003 / PEN097 / UPR138 (2026-08-22)

## T:leave-arena|F:create-token G76-auth[0:10] (2026-08-22)

- [token] Ward aura leave-arena is public opponent `attackWith(snatchRed)` then `resolveUntilIdle`; Arcane Shelter needs Voltic Bolt, not Snatch — AZS018 / FLR026 / OSC024 (2026-08-22)
- [status] leave-arena `has-status: attacking-or-defending` does not mint on chain close — pin family `status/attacking-or-defending` — PEN133 / PEN134 / PEN135 (2026-08-22)

## T:hit|F:destroy G89-auth[0:10] (2026-08-22)

- [combat] Command Respect above-base on-hit arsenal destroy is Might then `playAttack`/`closeCombat`; printed {p} hits leave arsenal — BET008 / BET019 / HVY072 (2026-08-22)
- [token] Rift Breaker on-hit Lightning Flow is `toHaveTokenCount("lightning-flow", 0)` after `closeCombat` — OMN155 / OMN156 / OMN157 (2026-08-22)
- [fix] HMS High Tide unprinted `keywords: [overpower]` is present with empty pitch — pin family `definition/unprinted-overpower` — SEA134 / SEA135 / SEA136 (2026-08-22)
- [combat] miss vs unprinted overpower uses a 6{d} equipment (Carrion Husk), not two hand cards — SEA134 (2026-08-22)
- [intent] Bam Bam Instant discard is `activate` then `untilIdle({ ordering: "listed" })` then `activateAttack` on a Club — SEA250 (2026-08-22)

## W4-tiny-T-A (2026-08-22)

- [trigger] Ice on an opponent's turn is `playAttack({ stopAt: "reaction" })` then `toReaction("defender")` then Instant play — UPR102 (2026-08-22)
- [fixture] Hyper Driver steam from play(), not fixture-seeded arena — EVO132 (2026-08-22)

## W4-tiny-T-B (2026-08-22)

- [assert] untapped is `toBeReady()`, not `.not.toBeTapped()` — SEA107 / SEA108 (2026-08-22)
- [arrange] Quiver seats as `weapon2` — AZL003 (2026-08-22)

## W4-tiny-T-C (2026-08-22)

- [keyword] Fragment token mint is `attackWith` then `defendWith(nimblismBlue)` then `resolveUntilIdle` then `toHaveTokenCount` — AZS012 / AZS013 (2026-08-22)
- [intent] Heron's Flight combo mode is `playAttack({ stopAt: "on-attack" })` then `.choose("CRU056-a1")` — `modeIds` is ignored — CRU056 (2026-08-22)
- [solflare] charge this card as Cross the Line's additional cost (`charge: true, chargeCard`) — DTD048 / DTD049 (2026-08-22)

## W4-tiny-T-D (2026-08-22)

- [solflare] Banneret of Protection reuses DTD048 charge-to-soul Spellbane Aegis — DTD050 (2026-08-22)
- [trigger] Blessing of Bellona start-of-turn soul-put is two public `endTurn`s from the controller seat — PEN181 (2026-08-22)
- [status] Ironsong Pride end-phase `no-sword-hit-this-turn` fail-louds — pin family `status/no-sword-hit-this-turn` — DYN072 (2026-08-22)
- [status] Dimenxxional Crossroads play fail-louds `lost-life-during-your-turn` — pin family `status/lost-life-during-your-turn` — MON157 (2026-08-22)
- [effect] Electrify next-hit extra damage resolves immediately without an attack-target — pin family `engine/applies-to-next-hit-damage` — ELE198 / ELE199 / ELE200 (2026-08-22)
- [evo] Circuit Breaker does not equip after base-head transform — pin family `engine/evo-transform-equip` — EVO030 (2026-08-22)

## W4-tiny-T-E (2026-08-22)

- [evo] Atom/Face Breaker reuse EVO030: play with base chest/arms then `resolveUntilIdle`; they stay out of the slot — EVO031 / EVO032 (2026-08-22)
- [evo] Mach Breaker base-legs transform throws unresolved at-resolution X and stays on stack — pin family `engine/evo-transform-equip` — EVO033 (2026-08-22)
- [assert] Crush −1{d} counters are signed (`toHaveDefenseCounters(-1)`) — WTR058 (2026-08-22)
- [keyword] unprinted `keywords:[goAgain]` refunds AP on an unblocked Ebbing Arcstride yellow — pin family `definition/unprinted-go-again` — OMN019 (2026-08-22)
- [effect] granted AAC on-attack arcane does not ping — pin family `engine/grant-ability-on-attack` — ELE226 (2026-08-22)
- [combat] Runic Reclamation on-stack aura destroy still fires on a miss — pin family `engine/on-stack-hit-target` — EVR104 (2026-08-22)
- [mark] Smoke Out defending a red card does not mark — pin family `engine/defend-color-mark` — FNG018 (2026-08-22)

## W4-tiny-T-F (2026-08-22)

- [wager] hero wager-pay is `playAttack({ stopAt: "on-attack" })` then `.accept()` (printed wager) then `advanceUntil({ stopAt: "defend", optionals: "accept" })` — HVY045 (2026-08-22)
- [arrow] face-up Remorseless/Swift Shot seats `{ card, state: { faceDown: false } }` then `playAttack(..., { from: "arsenal" })` — CRU123 / SEA110 (2026-08-22)

## W4-tiny-T-G (2026-08-22)

- [assert] resource total is `toHaveResourceCount`, not `toHaveRP` — DTD056 / DYN111 (2026-08-22)
- [solflare] charging Banneret of Salvation/Vigor does not arm next-hit +1{h}/{r} — pin family `engine/solflare-next-hit` — DTD055 / DTD056 (2026-08-22)
- [effect] By the Book `while-condition` restrict-draw is not yet canonical — pin family `engine/while-condition-rule-mod` — PEN289 (2026-08-22)
- [fix] Meridian Pathway prints ward only after pitching Chi, but `keywords: [ward(3)]` is always on — pin family `definition/unprinted-ward` — MST027 (2026-08-22)

## W4-tiny-T-H (2026-08-22)

- [hero] Kayo AAC +1{p} is in hand, not on the chain; 6{p} discard Might needs a 6{p} draw — HVY001 (2026-08-22)
- [wager] Olympia Gold is public wager-accept then `closeCombat` — HVY092 (2026-08-22)
- [play] Malice GY Zombie is `play(..., { from: "graveyard" })` after `{r}{t}` — IAR053 (2026-08-22)
- [status] Viserai 3+ Runechants this turn does not fail-close `created-3-or-more-runechants-this-turn` — IAR106 (2026-08-22)
- [harness] Arcanic Reproach on-hit optional plus Snatch on-hit needs simultaneous-trigger ordering — OMN052 (2026-08-22)
- [play] Tarpit Trap from hand still begins play (stack) — pin family `definition/trap-play-from-hand` — OUT108 (2026-08-22)
- [modal] Levels of Enlightenment with 0 blue pitched still opens modes and rejects choosing 1 — MST077 (2026-08-22)

## W4-tiny-T-I (2026-08-22)

- [hero] Strong-arm tap is `playAttack` then `toReaction("attacker")` then `activate` the hero — SUP064 (2026-08-22)
- [token] defend-steal Token+Aura needs `fabToken("spectral-shield")`, not the catalog module — SUP069 (2026-08-22)
- [intent] staff Amp payment is `activate` then `helpers.resolveUntilIdle({ paymentCanonicalId })` — ROS015 (2026-08-22)

## W4-tiny-T-J (2026-08-22)

- [ally] Snatch targeting a 1{h} ally needs `helpers.resolveRestOfCombat` for first-player simultaneous triggers — AGB017 (2026-08-22)
- [item] Plasma Mainline is itself a cost-2 item: decline its self-enter optional before seating Hyper Driver — DYN093 (2026-08-22)

## W4-tiny-T-K (2026-08-22)

- [status] Korshem end-phase destroy fail-louds `no-resource-life-power-defense-gain-this-turn` — ELE000 (2026-08-22)
- [evo] Demolition Protocol on-attack steam strip never removes steam — pin family `engine/evo-upgrade-remove-steam` — EVO057 (2026-08-22)
- [boost] Hyper-X3 does not move a boosted Hyper Driver under itself — EVO011 (2026-08-22)
- [activate] Micro-processor Opt/draw/banish reject as unmigrated — EVR070 (2026-08-22)
- [fix] Gavel of Natural Order omits the printed first-play +1{p} counter — JDG005 (2026-08-22)

## W4-tiny-T-L (2026-08-22)

- [status] Feign Vengeance chain-link resolve fail-louds `card-defending-this` even unblocked — PEN036 (2026-08-22)
- [effect] Restless Coalescence enter-arena `move-counter` throws named-counters / unresolved from — MST133 (2026-08-22)

## W4-tiny-T-M (2026-08-22)

- [freeze] Channel Galcia enter freeze is `play` then `untilIdle({ entityTargets: "pause" })` then `.target` — PEN230 (2026-08-22)
- [token] Serpent's Kiss on-attack choice labels are `option-0`/`option-1`, not printed token names — PEN262 (2026-08-22)
- [arcane] Instant/aura enter pings and Voltic Bolt need `untilIdle({ entityTargets: "pause" })` or `{ target: hero.id }` — PEN237 / ROS033 / ROS077 (2026-08-22)
- [combat] Cogwerx Dovetail tap-a-cog +1{p} is `activate` then `.target` then `passBoth` then `.choose("option-0")` — SEA011 (2026-08-22)

## W4-tiny-T-N (2026-08-27)

- [equipment] next-from-arsenal latch: seed `arsenal: [{ card, state: { faceDown: false } }]`, `playAttack(card, { from: "arsenal" })`; boundary = same card from hand, timing = mismatched type-box from arsenal; keyword latches assert via `expectCombat(game).toHaveKeyword` / `notToHaveKeyword` — MPG007 / MPG008 (2026-08-27)
- [equipment] count-star "your weapon attacks gain" is proven with destroyed arms then two same-turn 1H weapon activations (`{ index }` per seated copy) — BOL007 (2026-08-27)
- [reaction] destroy-AR go-again latch on a live chain attack is drivable: `toReaction("attacker")` then `activate` then `resolveRestOfCombat()` — do NOT `advanceUntil({ stopAt: "resolution" })` first (defend step is skipped and `defendWith` rejects); prove the refund by playing a follow-up attack — UPR159 / PEN082 (2026-08-27)
- [arrow] Arrow attack actions only play from arsenal and only while you control a bow: seed `weapon1: [shiver]` plus face-up arsenal arrows, `playAttack(arrow, { from: "arsenal" })` — PEN082 (2026-08-27)
- [probe] Scar for a Scar Blue self-grants go again (life-comparison fires at resolution), so it is a bad no-go-again probe; Nimble Strike Blue (cost 1, 2{p}, optional-banish rider) is the clean ≤2 base-power probe — UPR159 (2026-08-27)
- [spellvoid] Runechant spellvoid grant: seed `arena: [fabToken("runechant")]`, respond to the arcane source (opponent `.play(...)` then their `.pass()` before the responder `activate`s), and count one `passBoth()` per stacked layer before the spellvoid option opens — DYN171 (2026-08-27)
- [instant] equipment instant needing a live chain-link source: `playAttack` then `toReaction("attacker")` then `activate`; arcane rider damage stacks with combat damage in the defender life math — OMN050 (2026-08-27)
- [wizard] Wizard bolts like Voltic Bolt are `["Wizard","Action"]`, not Instants: casting one in a reaction window rejects `not legal in the current layer position`; only true `"Instant"` type boxes cast there — DYN171 (2026-08-27)

## W4-tiny-T-O (2026-08-27)

- [quiver] Quivers seat in `weapon2:`, not `equipment:`; conditional prevention amounts ("prevent 2 instead if a face-up arrow") are proven by face-up vs face-down vs absent arsenal-arrow variants with per-variant life math — HNT252 (2026-08-27)
- [prevention] Arcane-prevention equipment instants reuse the DYN171 flow against Voltic Bolt: opponent `.play(bolt, { target })` → their `.pass()` → responder `activate` → one `passBoth()` → `resolveUntilIdle()`; robe + Runechant mixed destroy cost consumes both (life 16 of 5 arcane) — PEN094 (2026-08-27)
- [token] With 2+ same-name tokens a destroy-cost choice opens an `entity-target` decision; `cardIn` throws `FabAmbiguousCardRefError`, so pick via `handle.cardsIn("arena", fabToken("runechant"))[0]!` and `chooseTargets(...)` — PEN094 (2026-08-27)
- [gap] Equipment activations are admitted even when their cost cannot be paid (Runebleed Robe with zero Runechants opens an unanswerable decision); write the boundary around a payable state instead of `expectActivationRejected` — PEN094 (2026-08-27)

## PEN-batch (2026-08-27)

- [opt] `play()` auto-declines a trigger's optional mid-drain (`untilIdle({optionals})` after it is too late): `game.playInstance(handle.id, instanceId, {}, "explicit")` then `untilIdle({ optionals: "accept" })` answers it — PEN017 (2026-08-27)
- [filter] `Aura` is a normalized SUBTYPE (`FAB_SUBTYPES`) for trigger/target filters even though authored modules list it in `types:`; the destroy-target typeBox union rejects `types:["Aura"]` — PEN109 (2026-08-27)
- [staged] `FabBasePlayOptions.pitch` takes card refs on `game.playInstance(..., opts, "explicit")`, so a bolt after the end-turn RP wipe is `playInstance(..., { pitch: [a, b] }, "explicit")` — PEN058 (2026-08-27)
- [combat] equip activations at the reaction window (`defendWith` → attacker `.pass()` → `activate`) need `FAB_MANUAL_HARNESS`; the smart harness auto-passes the defender's window and closes combat — PEN060 (2026-08-27)
- [temper] Temper destroys at close when current defense ≤1, so a this-turn +1{d} grant SAVES the piece; assert survivor vs graveyard across happy/boundary — PEN002/PEN060 (2026-08-27)
- [assert] empty-hand seats default RP 3 — seed `resourcePoints: 0` before asserting grant legs (`gain {r}{r}`) — PEN108 (2026-08-27)
