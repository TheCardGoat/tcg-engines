# Beta test conversion — delegation list

Mechanics that could not be verified end-to-end through the current engine, along with the beta tests left `it.skip` and the 2-3 other cards that would benefit from the same engine work.

## 1. ~~Command-card `【Burst】` not fired~~ (unblocked in `feat/command-card-burst-dispatch`)

**Status**: investigation showed the dispatch path was already card-type-
agnostic — `resolve-direct.ts` enqueues `shieldDestroyed` for every
destroyed shield, and `enqueueOwnCardTriggers` iterates `def.effects`
regardless of `def.type`. The tests were skipped as a tracking TODO, not
because the pipeline actually gated on card type. Converted all five
beta command-card `【Burst】` tests to real scenarios using
`engine.fireShieldBurst(shieldId)`, plus the same pattern across
gd01 / gd02 / st0x command-card Burst tests.

~~**Cards left skipped**~~

- ~~`packages/cards/src/cards/beta/command/099-intercept-orders.test.ts`~~
- ~~`packages/cards/src/cards/beta/command/105-citizens-take-a-stand.test.ts`~~
- ~~`packages/cards/src/cards/beta/command/107-first-contact.test.ts`~~
- ~~`packages/cards/src/cards/beta/command/117-the-witch-and-the-bride.test.ts`~~
- ~~`packages/cards/src/cards/beta/command/120-naval-bombardment.test.ts`~~

## 2. ~~`placeResource` on a command card clobbered by play-command cleanup~~ (resolved in `fix/activate-targets-placeresource-resource-dsl`)

~~**Cards left skipped**~~

- ~~`packages/cards/src/cards/beta/command/107-first-contact.test.ts` — `【Main】Place 1 rested Resource.`~~

**Fix**: `pending-effects.ts#runPostActions` now checks the card's current
zone before executing a `moveToTrash` postAction — if the command card's
own effect moved it out of `removalArea` (e.g. into `resourceArea` via
`placeResource`), the trash step is skipped. `executor.ts#placeResource`
honours `action.state === "rested"` and marks the placed resource as
exhausted. Unblocks beta/gd01 `107-first-contact`, gd02 `103-age-device`,
and any future EX-resource-from-command card.

## 3. ~~Base `【Burst】Deploy this card` from a shield~~ (unblocked in `feat/deploy-self-tutor-actions`)

**Status**: `deploySelf` now moves the card from trash back into
`baseSection` after `resolve-direct` destroys the shield, and enqueues the
card's own `【Deploy】` triggers so the rider effect (add-a-shield, etc.)
still fires. Converted: `beta/base/015-saint-gabriel-institute.test.ts` —
others in the archetype can be converted identically via the
`seedBaseAsShield` helper on the gd02 base tests.

~~**Cards left skipped**~~

- ~~`beta/base/015-archangel.test.ts`~~
- ~~`beta/base/015-saint-gabriel-institute.test.ts`~~
- ~~`beta/base/015-white-base.test.ts`~~
- ~~`beta/base/016-asticassia-school-of-technology-earth-house.test.ts`~~
- ~~`beta/base/016-falmel.test.ts`~~
- ~~`beta/base/124-side-7.test.ts`~~

## 4. ~~`setActive` on a rested resource from pilot `【Attack】`~~ (resolved in `fix/activate-targets-placeresource-resource-dsl`)

~~**Cards left skipped**~~

- ~~`beta/pilot/011-suletta-mercury.test.ts` — `【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.`~~

**Root cause (debunked)**: there was no missing resource-zone path in
the DSL — `evaluateTargetFilter` does filter the pool it's given, and
executor's `gatherAllCards` already includes `resourceArea`. What
actually gated Suletta was (a) pilot 【Attack】 trigger routing (fixed in
PR #128) and (b) the Wave-8 chosenTargets plumbing. A dedicated
pilot-attack-setActive-on-resource regression test is now in
`packages/engine/src/gundam/moves/core/pilot-trigger-routing.test.ts`.

## 4b. Hand-cost reduction via Constant `stat-modifier { stat: "cost" }`

**Cards left skipped**

- ~~`beta/unit/016-jegan.test.ts`~~ ✅ Converted (Wave 10) — cost -1 while 2+ (Earth Federation) units in play.
- ~~`beta/unit/070-gundam-aerial.test.ts`~~ ✅ Converted (Wave 10) — cost -2 while 4+ Command cards in trash.

**What is missing**: deploy validation (`play-card-shared.ts`) compares `definition.cost` against available resources, bypassing Constant-effect cost modifiers that target `zone: "hand"`. Needs an effective-cost helper alongside `getEffectiveStats` or plumbing the continuous-effects scan through play-card validation.

**Other cards with the same need**: `gd01/unit/070-gundam-aerial.ts`, `gd02/unit/118-gundam-barbatos.ts`, plus any future cost-reduction-in-hand card.

## 5. `cantAttack` as a directive with self-condition + handCount gating

**Cards left skipped**

- `beta/pilot/097-guel-jeturk.test.ts` — `【Activate·Main】【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can't attack during this turn.`

**What is missing**: `condition: { type: "handCount" }` is a condition shape not yet recognised by `effectConditionsMet` / the directive-level condition evaluator. The `setActive` + `cantAttack` pair both need the branch to resolve to skip when opponent hand count is below 8, and the `cantAttack` duration needs to flow into the targeting context for the same unit.

## 6. Pilot-card `【When Paired】` / `【Attack】` triggers not fired on pairing

**RESOLVED** — `executePilotPairing` now also enqueues the pilot card's
own WhenPaired/WhenLinked triggers (rule 3-3-9-1), and the attack-step
observer scan already picks up 【Attack】 triggers on paired pilots because
they sit in `battleArea` next to the unit. Fixed in `fix(engine): route
pilot-resident triggers through enqueueOwnCardTriggers`.

Unskipped:

- ~~`beta/pilot/010-kira-yamato.test.ts` — `【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.`~~
- ~~`beta/pilot/088-banagher-links.test.ts` — `【When Paired】If this is a Link Unit, draw 1.`~~ Link gating now encoded: timing is `whenLinked`, gated by rule 3-2-6; test asserts only Link Unit pairing draws a card.

Still skipped (blocked on _other_ mechanics, not trigger routing):

- `beta/pilot/010-amuro-ray.test.ts` — needs `rest` action on a filtered opponent-unit target (HP ≤ 5).
- `beta/pilot/011-char-aznable.test.ts` — blocked by §6b attributeFilters data-quality.
- `beta/pilot/011-suletta-mercury.test.ts` — blocked by §4 (`setActive` on resource target resolution).
- `beta/pilot/089-riddhe-marcenas.test.ts` — nested 【Burst】 + conditional `selfHasKeyword: Repair`; shield-burst pipeline still missing. (The `selfHasKeyword` gate itself is unblocked by `fix(engine): apply pilot identity rebind to self* conditions` — condition now resolves through the paired unit.)

## 6b. Card defs whose `attributeFilters` embed keyword reminder text (data-quality)

**RESOLVED** in `fix/card-data-quality-sweep` — reminder-text
`attributeFilters` entries have been dropped on all affected cards
(including M1 Astray, Gundam Heavyarms, Char Aznable, Cagalli Yula
Athha, Sayla Mass, M'Quve, Duel Gundam, ZnO, Red Gundam, Spallow,
Kikeroga, Hyaku-Shiki, Lafter Frankland, Gaelio's Schwalbe Graze,
Carta's Graze Ritter, Buster Gundam, G-Exes).

~~**Cards left skipped**~~

- ~~`beta/unit/081-m1-astray.test.ts` — While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and <Blocker>.~~
- ~~`beta/unit/034-gundam-heavyarms.test.ts` — 【During Pair】This Unit gains <Breach 3>.~~
- ~~`beta/pilot/011-char-aznable.test.ts` — 【Attack】 AP+1 + grant <High-Maneuver> if Link Unit.~~

~~**What is missing**: the generated card definitions contain `attributeFilters: [{ attribute: "trait", value: "rest this unit to change the attack target to it." }]` (or similar reminder-text strings) on the constant/triggered effect target. Target DSL then tries to match the literal reminder text and finds nothing. The card-generator needs a fix to drop those junk filters; the engine itself resolves trait filters correctly for well-formed cards.~~

## 6c. Optional deploy from hand recurses into itself

**Cards left skipped**

- `beta/unit/028-gundam-sandrock.test.ts` — `【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.`

**What is missing**: the `deploy` action handler re-enters the deploy move for the target card without excluding the triggering source or honoring an `optional: true` flag. On Sandrock (whose only qualifying hand cards for the demo trait are the default mock), the handler overflows the stack. Needs an `optional: true` gate and `excludeSource` target filter (similar to what was added for `excludeSelf` on Constant-effect targets).

## 6d. During-Pair gates for destroyed effects

**Cards left skipped**

- `beta/unit/005-unicorn-gundam-unicorn-mode.test.ts` — `【During Pair】【Destroyed】...`
- `beta/unit/026-char-s-zaku.test.ts` — `【During Pair】【Destroyed】Deploy 1 rested token.`
- ~~`beta/unit/034-gundam-heavyarms.test.ts` — `【During Pair】This Unit gains <Breach 3>.`~~ ✅ Converted (`fix/constant-effect-state-reeval`) — derived-state duringPair gate re-evaluates on every getEffectiveStats call.

**What is missing**: destroyed-event triggers now use an event timing such as
`["destroyed"]` and keep the "is currently paired" requirement in
`activation.conditions`. Older combined timing shapes such as
`["duringPair", "destroyed"]` are no longer valid. Remaining coverage should
exercise the pair condition at the moment the destroyed event is emitted.

## 7. `preventDamage` with unitFilter (conditional damage immunity)

**Cards left skipped**

- `beta/pilot/091-chang-wufei.test.ts` — `【Burst】... During your turn, if this Unit has <Breach>, it can't receive battle damage from enemy Units with 3 or less AP.`

**What is missing**: the `preventDamage` action with a `unitFilter` (filter on the incoming attacker) is not wired into the battle-damage pipeline — it currently short-circuits all incoming damage rather than scoping by filter.
