# FAB Test Playbook (living)

Durable harness and AAA lessons for `fab-test-generation`. Keep this file short.

Engine and definition debt lives in
`packages/cards/scripts/card-coverage/gaps.json` (family-keyed). Wave diaries live
in `playbook-archive.md` — read that only when debugging a past batch.

## How to contribute

- **One line per lesson**, grouped under a theme below:
  ```
  - [theme] one-sentence lesson — path/to.file.ts (YYYY-MM-DD)
  ```
- Pointers cite a real test or source file.
- **Merge duplicates.** If the lesson is an engine throw, **do not** append it
  here — record a family:
  ```
  node packages/cards/scripts/card-coverage.ts --record-gap <slug> --family <id> --reason "..." --kind engine-primitive|definition|out-of-scope|harness
  ```
- Explain lesson removal or a semantic rewrite in the change description or
  commit message.
- New theme = a `##` heading and a one-line description.

## Behavior coverage and assertions

- [cases] every playable behavior needs happy (printed result) + a meaningful boundary (contrasting state); add timing only when material — never a throw/JSON/presence theater — `packages/cards/src/cards/heroes/bravo.test.ts`
- [quality] gate every `it` against `references/quality.md`; skip + `--record-gap` beats a fail-loud or stringify suite (2026-08-23)
- [assert] gameplay proof uses fluent rule-visible outcomes (life, zones, combat power/keywords, counters, color, marked, freeze, evaluated supertypes); never raw `activeLink`, logs, model shape, or private fields
- [assert] never `JSON.stringify(card)` / `toContain('"type"|"what"|"op"')` / `it("encodes …")` / per-card `*-guard.test.ts` AST round-trips or catalog disk scans — TypeScript owns the IR; proof is play. Those obsolete guard suites were removed in August 2026.
- [assert] never `getState()` in card tests — use `expectFabPlayer` / `expectFabCard` / `expectCombat` / `expectWait` / `lastDieFace` / `lastDieFaces`
- [assert] classify before banning white-box checks: legality DTO, serializer, reducer, projection, harness, and authoring-factory suites may assert the exact structure they own; card behavior and play-line suites must finish on fluent rule-visible outcomes — `references/quality.md` (2026-08-29)
- [assert] extra-die ignore-lowest is `lastDieFaces().length === 2` and `lastDieFace() === Math.max(...faces)` — a 1–6 range on `lastDieFace` cannot distinguish from a plain d6 — EVR003 (2026-08-27)
- [assert] a printed look with no follow-up (no zone change) is `lastLookedCanonicalId()` from the committed look journal, sibling of `lastDieFace`. Deck occupancy staying put is not proof of the look. — AZL004 (2026-08-30)
- [intent] Instant prevent vs a Wizard Instant on the attacker's turn is `activateAttack` then `toReaction("defender")` then opponent Instant then `activate` the equipment. No-combat Instant is `passPriorityTo`. A 2-arcane Instant (Flash Bolt Yellow) distinguishes prevent-1 vs prevent-2; a 1-arcane ping cannot. — PEN043 (2026-08-27)
- [assert] Marked is `expectFabPlayer(h).toBeMarked()` / `notToBeMarked()` — FNG016 / HNT038 (2026-08-21)
- [assert] token counts are `toHaveTokenCount(slug, n)` — do not write a local `surgeCount` / `frostbiteCount` / `runechantCount`
- [assert] freeze is `expectFabCard(h, card).toBeFrozen()` — UPR119 (2026-08-21)
- [assert] idle / pending prompt is `expectWait(game).toBeIdle()` / `.toHaveDecision(kind)` then `chooseNumeric(n)` — HVY105 (2026-08-21)
- [assert] once-per-turn Attack reuse is `expectActivationRejected(card)`, not a bare `toThrow()` — DTD008 / DYN212 (2026-08-27)
- [intent] equipment Attack Reaction is `playAttack` → `defendWith()` → `toReaction("attacker")` → `activate(equipment)`; a subject-filter miss is `expectActivationRejected` (probe, no state change) then the arms stay slotted — KSU007 / OMN242 (2026-08-27)
- [assert] Battleworn −1{d} after defending is `expectFabCard(h, card).toHaveDefenseCounters(-1)` with the equipment still in its slot — KSU007 (2026-08-27)
- [activate] “Action — Destroy this: the next AAC …” Event equipment resolves the activation to idle, then `playAttack` proves the latch; the assertion belongs on the affected attack, not the activation layer — SMP015 / SMP016 (2026-08-27)
- [weapon] “your daggers +1{p} this turn” (count all) needs two 1H Nerve Scalpels in `weapon1`/`weapon2`; with 2 seated copies every `activate` requires `{ index }` — OUT141 (2026-08-27)
- [assert] optional soul-banish arcane on-attack must assert the damaged hero's life, not only the banished zone — DTD008 (2026-08-27)
- [intent] reaction window is `game.toReaction(...)` — do not write `walkToReaction` pass loops — ELE010 (2026-08-21)
- [assert] evaluated color is `expectFabCard(h, card).toHaveColor("Red"|"Yellow"|"Blue"|null)` — Blanch MST194 (2026-08-21)
- [act] public fluent verbs only (`playAttack` / `activateAttack` / `closeCombat` / `untilIdle` / `decline` / `choose` / `target`); never private runtime methods

## Arrange defaults

- [arrange] omitted `hand` seats DEFAULT_HAND (3× Browbeat Blue + Enlightened Strike). Write `hand: []` to opt out. Empty-hand RP default is 3. — `packages/engine/src/testing/test-fixtures.ts` (2026-08-13)
- [arrange] DEFAULT_HAND Enlightened Strike is a slim stub that overwrites a seated full module of the same id — set explicit `hand: []` when that card is under test
- [arrange] `deck: [first, …, last]` is **bottom-first**; last entry is the top. Prefer `deckTop: [...]` (last = top)
- [arrange] unused `resourcePoints` reset at end of turn; seat the defender as player B to keep seeded RP on their turn
- [arrange] fixture `weapon1`+`weapon2` seating uses the same CR 8.2.2b weapon-area gate as pregame (Zane 2H-sword-as-1H is the exception). Illegal 2H+companion seats throw `two-hander-must-be-alone`. — SPW003 (2026-08-30)
- [arrange] setup `resourcePoints` defaults to the hand's cost-sum — seed `resourcePoints: 0` for pitch-payment cases
- [arrange] `FAB_MANUAL_HARNESS` when asserting state the smart harness would auto-resolve (pre-payment, on-declaration power, pitch order, reload)
- [token] created tokens are `token:<slug>` in `arena` (`toHaveTokenCount` only counts those). A seated catalog Gold module keeps its canonical id — occupancy is `expectFabCard` / `zone("arena")`, never `toHaveTokenCount("gold")`. `expectFabCard` on a created token slug will not find it. — AOL028 (2026-08-30)
- [token] Might is start-of-turn destroy-then-next-attack +1{p}; seed it in arena, then `untilIdle({ ordering: "listed" })`. The latched +1{p} participates in the next attack's resolution-time current-power checks — SUP146 (2026-08-21)
- [assert] module/canonical-id refs do not resolve implicitly from deck; capture an exact ref with `cardIn("deck", card)` / `cardsIn("deck", card)`, which can then be passed to `expectFabCard`
- [assert] module/canonical-id refs do not resolve implicitly from inventory (CR 4.1.6); capture an exact ref with `cardIn("inventory", card)` / `cardsIn("inventory", card)` for targeting or `expectFabCard` occupancy — MST226 / HNT003 (2026-08-27)
- [cost] arsenal-to-bottom additional cost is first-class `move-to-deck` `from:"arsenal"`; a unique arsenal card auto-binds. Empty arsenal reverses `/cannot be paid/` — ELE118 (2026-08-27)
- [evo] Instant Zip Line grants go again at-resolution onto `types:["Attack"]`; pause with `untilIdle({ entityTargets: "pause" })` then `.target(attack)` — EVO053 (2026-08-27)
- [restrict] Numbskull “can't be modified” is proven with Pummel +{p} staying 6 and Seismic Shelter defending +{d} staying 3 — DTD201 (2026-08-27)
- [trap] after combat the active player still holds priority; pass explicitly with `game.helpers.passPriorityTo(player)` before that player plays an Instant — HNT016 (2026-08-27)
- [search] Herald-into-soul figment search is min=0: `closeCombat({ optionals:"accept", entityTargets:"pause" })` then `.targetRequired(cardIn("deck", figment))` — DTD001 / DTD002 (2026-08-27)

## Intent verbs and known harness limits

- [intent] prefer `playAttack` / `activateAttack` / `closeCombat` / `untilIdle` over `passBoth` + `advanceCombatTo`
- [intent] `resolveUntilIdle` / `untilIdle` **closes combat** — assert on-link power/keywords before draining, or stop at `"defend"` / `"reaction"`. A `this-combat-chain` banished play grant expires if you drain to idle; `passBoth` then `play(..., { from: "banished" })` while the chain is open — EVR053 (2026-08-30)
- [combat] assert a destroy-self Attack Reaction's granted keyword while the chain link is live; draining with `untilIdle` first closes combat and makes a negative keyword assertion vacuous — AAZ007 / ELE225 / RNR007 (2026-08-27)
- [combat] Ward leave-arena proofs use Brutal Assault (no on-hit), not Snatch; two Ward auras both destroy — pair with a no-Ward Lightning aura. Optional banish-return-holo is the whole Blur Reality sequence inside `optional.effect` — OMN005 / AZS017 (2026-08-27)
- [delay] “their next end phase” is Stone Rain `Azalea.endTurn(); Dash.endTurn(); untilIdle`. Draw-to-intellect happens after the beginning trigger — assert the original cards in GY, not `toHaveHandCount(0)`. Two copies of one id in hand is `FabAmbiguousCardRefError` — ROS247 / AAZ016 (2026-08-27)
- [cost] printed cost X + on-stack `count:{type:x}` is `play({ xValue })` after catalog omits numeric `cost`. Seat Teklovossen so Dash start-game items do not park extras. Capture an exact deck instance before passing it to `expectFabCard`. A created 0-steam Hyper Driver self-destroys in the same drain — MST227 / MPG021 (2026-08-27)
- [harness] opponent-forced selections still use the choosing player's public `chooseTargets`; there is no controller-side intent shorthand
- [intent] chain-link resolution is `advanceUntil({ stopAt: "resolution", ordering: "listed" })` then the next `playAttack` — `closeCombat` ends this-combat-chain latches — OUT071 (2026-08-22)
- [intent] on-attack optional with no legal subject (empty ally/arsenal, unfused fusion rider) never opens a boolean — do not `.decline()`; drain to defend — AGB010 / ELE079 / ELE131 (2026-08-21)
- [target] granted “deal 1 arcane to target hero” is `any-hero` (both seated heroes). `playAttack(..., { stopAt: "on-attack" })` then `.target(Dash)` then `closeCombat({ ordering: "listed" })`. `entityTargetCanonicalId` looks up object canonical ids and misses player-id candidates — CHN014 / OMN086 (2026-08-21)
- [intent] `must.pitch(...).playAttack` consumes staged pitch; `must.pitch().activate` does not — use the activation payment decision or `game.helpers.resolveUntilIdle({ paymentCanonicalId })`
- [intent] `activateAttack` / `advanceUntil({ stopAt: "defend" })` does not invent a pitch choice; pay the weapon explicitly, then drain — `packages/cards/src/cards/tokens/agility.test.ts`
- [intent] `must.playReaction` dispatches the reaction but does not choose non-forced optionals for the test; answer pending choices explicitly with `accept`, `decline`, `choose`, or `target`
- [choose] printed “name a card” is `expectWait.toHaveDecision("effect-resolution")` then `.choose(printedName)` (catalog names, not i18n). After an Assassin contract DR, decline Arakni's look and `passBoth` the stacked trigger first. Deck occupancy is `zone("deck")`. — SUP245 (2026-08-30)
- [harness] printed `opt(N)` on `playAttack` needs an explicit `optBottom` answer; omission stays fail-loud, while legacy `attackWith` defaults to keeping the cards on top
- [opt] `play({ optBottom: N })` / `activate({ optBottom: N })` puts the first N looked cards (original top first) on the bottom. Under `FAB_MANUAL_HARNESS`, `untilIdle({ ordering: "listed" })` keeps Opt on top (CR 8.5.22). Default `untilIdle` still throws so the test can name a bottom count — ARC037 (2026-08-22)
- [combat] after `activate(weapon)` the chain is not yet on Defend — use `advanceUntil({ stopAt: "defend" })` before `defendWith` or combat assertions
- [combat] under `FAB_MANUAL_HARNESS`, a second `playAttack` at resolution remains behind the previous active link until `advanceUntil({ stopAt: "defend" })`

## Definition hygiene (do not half-fix)

- [fix] module `keywords:` must equal the printed keyword line — unprinted `goAgain`/`overpower`/`dominate`/`opt` makes conditionals unconditional
- [fix] `"Attack Reaction"` / `"Defense Reaction"` are **types**, never `subtypes:["Reaction"]`
- [fix] `names:` matches card **names**, never type-line phrases (`"Draconic Attack"` → `typeBox.supertypes`)
- [fix] one catalog token slug per create-token leaf (`might` + `vigor`, never `might-and-a-vigor`)
- [fix] token name filters are exact (`"Runechant"`, never `"Runechant Token"`)
- [fix] reveal/look steps that later bind `them`/`it` must declare `outputBinding` (undeclared binding is a legal no-op)
- [fix] printed "you may attack an additional time" is CR 5.2.3c activation-limit permission, not an optional boolean; author `modify-activation-limit` without `type:"optional"` — TEA001 / TEA002 (2026-09-11)

## Status trapdoors vs fail-close

- [status] unhandled `has-status` **throws** (fail-loud) at play, activate, or resolution — record `--family status/<marker>` and skip; do not author a fail-loud AAA trio
- [status] `appliesTo.next.hasStatus` uses the condition table when a handler exists (`charged-to-play`, `fused`); unknown filter markers still fail closed so defend matching does not abort
- [status] P0 siblings are handled: `played-at-chain-link-3-or-higher`, `boosted-2-or-more-times-this-turn`, `defending-hero-has-cards-in-soul`, `been-booed-this-turn`, `yellow-card-in-pitch-zone`, `pitched-a-blue-card-this-turn`, `defended-by-action`, `defended-by-attack-action`, `played-or-activated-this-chain-link-attack-reaction`; Instant `attacking` matches the chain source by instanceId — `packages/engine/src/rules/evaluation/conditions/has-status.ts` (2026-08-21)
- [status] do not add a new `FAB_STATUS_MARKERS` slug for “N or more X this turn” — author `compare-amount` per the close-gap decision tree; grandfathered slugs are snapshotted in `packages/engine/src/rules/has-status-coverage.test.ts`

## Validation

- [checkout] stay in this checkout; do not `git worktree add` or spawn `isolation: "worktree"` for `/fab-tests` or `/fab-close-gaps` — protocol §2.4 (2026-08-27)
- [validate] `vp test run` can exit 0 on suite-load errors — gate on captured output (`passed` and not `fail`), not the exit code
- [validate] green tests ≠ type-safe (vitest-oxc strips types) — `vp run check-types` before trusting a run
- [validate] finish a cluster with submodule `vp run ci-check`
- [harness] `getRuntime().applyCommand` does not append to `game.moveLogs()`; assert `result.moveLogs` on the success receipt — DYN006 (2026-09-11)
- [bench] converting-budget gates that only count chosen passes should set `considerHeads: 0` and skip heuristic snapshots so goldfish ranking does not starve CI — `packages/engine/src/automation/bench/bench.test.ts` (2026-09-11)
- [profile] hero bindings must survive mid-match hero transforms by matching the canonical identity, not the active-face name — Viserai, the Forsaken's 3-Runechant traverse flips the twin face to "Viserai, Usurper" while keeping its canonical id, and the Between Worlds twin (and the standalone Usurper hero) share that face name with a different id, so `isViseraiForsakenHero` matches the Forsaken canonical id or the face name is wrong for two seats — `packages/engine/src/automation/heuristic/profiles/viserai-the-forsaken.ts` (2026-09-12)
