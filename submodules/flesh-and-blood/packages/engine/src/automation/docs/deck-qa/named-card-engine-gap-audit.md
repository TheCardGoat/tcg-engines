# README-named card engine-gap audit

Date: 2026-08-11

Scope: the 26 individual card identities called out by
[`README.md`](README.md), plus the Vynnset and Oscilio hero printings requested
with their co-located AAA suites.

This document classifies the current `it.todo` scenarios. It does not treat a
todo count, an authored ability shape, or a focused green subset as gameplay
proof. A card is functional only when a real-card test reaches the behavior
through public legal moves and asserts a rule-visible outcome and boundary.

## Executive result

The remaining work is not one test-harness gap. It falls into three classes:

1. **Card-model defects**: the definition does not faithfully encode the
   ability. Examples include conditional keywords duplicated as unconditional
   root keywords, `Weapon` represented as a subtype, wrong target zones, and
   resolution abilities used where the granted text is a static ability.
2. **Engine capability gaps**: the model is meaningful but the runtime cannot
   execute it. The material gaps are first-class attack-proxies, declaration-
   time card cost evaluation, persisted play facts such as “this was fused,”
   the wager-loss outcome replacement, player-directed discard choices, and
   polymorphic any-target binding for split cards.
3. **Public AAA choreography gaps**: the production capability exists, but the
   current todo is only a title or the helper closes combat before a same-chain
   follow-up attack can be declared.

At the time of the initial audit there were 37 todos in the 29 newly co-located suites: 14 contain an
executable callback and 23 are scenario titles only. Re-enabling the executable
probes reproduces the failures described below. The prior green aggregate is
therefore a baseline for already-supported branches, not completion evidence.

## Definition-repair update

The C2 definition corrections were applied on 2026-08-11 without changing the
separately owned attack-proxy, public-driver, targeting, or shared ability-type
subsystems:

- Oaken Old and Nourishing Emptiness no longer expose unconditional dominate.
- Burning Blade Dance, Display Loyalty, and Hot on Their Heels no longer expose
  unconditional go again. Burning Blade Dance now declares a controlled dagger
  from the permanent zone and keeps damage, synthetic hit, and destruction
  inside the accepted optional branch.
- Breaking Point uses the typed `chain-link-count >= 4` condition.
- Machinations of Dominion grants a conditional static-continuous ability.
- Jagged Edge and Warrior's Valor use `Weapon` as a type; Jagged Edge's granted
  unpreventable text is static-continuous rather than a resolution ability.
- Steelblade Supremacy targets a controlled equipped weapon in the permanent
  zone, and the red Sharpen Steel synergy fixture uses the Weapon type.

The Oaken Old non-fused branch, Nourishing Emptiness false-condition branch,
and both Machinations aura/no-aura branches now execute through public AAA. At
the definition-repair checkpoint, the exact 29-suite run was green with 19
passing and 10 todo-only files, 43 passing tests, and 42 runtime-expanded todos.
After promoting Oaken Old, its focused three-suite run passed 5 tests with the
fused case remaining todo. A later 29-suite rerun was blocked by concurrent
peer drift in `DTD133-vynnset-iron-maiden.test.ts`, whose new relative import of
`CRU147-mauvrion-skies-blue.ts` cannot resolve from the DTD hero directory; that
unclaimed file was not modified here. Remaining todos continue to identify the
engine and choreography gaps below; none were weakened into definition-shape
assertions.

## Rules constraints that shape the implementation

- A weapon attack is a separate attack-proxy which inherits properties from
  its attack-source; effects specifically applying to the proxy do not apply
  to the weapon, and vice versa (CR 1.4.3a, 1.4.3d, 1.4.3e). The official
  Sharpen Steel example explicitly says its next-weapon-attack modifier applies
  only to the proxy (CR 1.4.3e).
- A proposed card moves to the stack before legality and asset-cost calculation
  (CR 5.1.1-5.1.7). Cost reductions on Terminator Tank and War Machine must be
  visible before payment is requested.
- Conditional static-continuous effects appear and cease as their condition
  changes (CR 6.2.3-6.2.3d). A keyword mentioned only inside conditional text
  is not an unconditional base keyword.
- A replacement must exist before its event and replace that event through the
  replacement pipeline (CR 6.4.1-6.4.6). Cheating Scoundrel's errata creates a
  triggered wager on the attack and retains the later wager-loss replacement
  (Errata Bulletin #10; CR 8.5.46).
- Multi-link tests must retain the open combat chain and declare the next
  attack during the Resolution Step (CR 7.6.2-7.6.4). Closing combat and then
  starting another attack cannot prove rupture or “last attack this combat
  chain.”
- Split-card targets are declared from the chosen face's resolution ability
  (CR 5.1.4, 9.2.3); meld resolves both faces while preserving those declared
  targets (CR 8.3.38).

## Required subsystem capabilities

### C1. First-class evaluated attack-proxy objects

**Owner:** combat identity + rules view + continuous-effect applicability +
target declaration.

The engine stores an attack-proxy identity, but the rules view exposes the
weapon source as `facts.combat.attack`. Future applicability and combat-chain
target scans consequently latch modifiers onto the equipped weapon. That is
not equivalent: a next-attack modifier can persist on the weapon and leak into
a later attack.

Required behavior:

- expose the live proxy as an evaluated rules object with inherited name,
  supertypes, types, subtypes, power, and static abilities;
- keep proxy-local base/current numeric properties distinct from the weapon;
- make `this-attack`, combat-chain targets, triggers, damage source, and
  `appliesTo.next` bind the proxy when text says “attack”;
- make explicit “target weapon” effects bind the weapon source;
- expire proxy-local continuous effects with that proxy/chain link;
- retain proxy LKI for hit and delayed trigger resolution;
- add a two-attack boundary proving a “next weapon attack” modifier does not
  affect the second proxy.

Affected cards: Warrior's Valor, Unsheathed, Cleave, Jagged Edge, and parts of
Legacy of Ikaru. Steelblade Supremacy is the complementary source-object case:
it targets the weapon, whose changed power and granted static trigger are then
inherited by each proxy that it creates that turn.

The corresponding definition corrections are complete: `Weapon` is represented
as a type in Warrior's Valor and Jagged Edge, Steelblade Supremacy targets the
controlled equipped/permanent weapon, and the red Sharpen Steel synergy fixture
uses the Weapon type. C1 is still required to make proxy-local effects and their
second-attack boundaries rules-correct.

### C2. Semantic card-definition validation

**Owner:** card authoring/types/static registry validation.

The registry currently accepts shapes that typecheck but express the wrong FAB
semantics. Add fail-closed semantic validation for:

- root keywords that are only conditionally granted by an authored ability;
- type-box vocabulary in the wrong filter field (`Weapon` as subtype);
- on-stack targets whose zones cannot contain their subject;
- pseudo-subtypes such as `You` and `Control` used as English residue;
- granted abilities with an ability kind inconsistent with their text;
- a later binding reference that has no guaranteed producer on every branch.

Affected definitions:

- Oaken Old and Nourishing Emptiness no longer expose `dominate` at the root;
  Nourishing Emptiness's false branch is now public AAA evidence.
- Burning Blade Dance, Display Loyalty, and Hot on Their Heels no longer expose
  root `go again`; C7 is still required to exercise both sides on one chain.
- Burning Blade Dance now uses a controller-relative equipped dagger target and
  keeps the damage/hit/destroy sequence wholly inside the accepted optional
  branch. C6 must still preserve the selected dagger binding through resolution.
- Machinations of Dominion now grants a conditional static-continuous ability;
  its aura and no-aura public branches both pass.
- Steelblade Supremacy, Jagged Edge, Warrior's Valor, and the red Sharpen Steel
  synergy fixture now use corrected Weapon type/zone semantics. Their remaining
  proxy/source and trigger timing assertions stay under C1/C8.

### C3. Persisted declaration/play facts for static evaluation

**Status:** implemented and covered.

Fusion declarations now fail closed before payment and journaling. They require
other cards from the player's hand, reject duplicate or irrelevant reveals,
validate the keyword's `and`/`and-or` supertype requirement, and reject repeat
satisfaction of the same required element. The play object receives a typed,
incarnation-bound `{ kind: "fusion", revealedSupertypes }` declaration fact.
`has-status: fused` reads that fact rather than a transient event binding;
reset-zone moves clear it, and match snapshots preserve it.

The player-scoped `history.turn.fused` remains a fact for "you fused this turn"
triggers only. It is deliberately not a one-shot gate: every fused object in a
turn receives its own declaration fact. Public Oaken Old AAA proves valid
Earth+Ice fusion (9 power and its hit rider), no-fusion, rejected incomplete
fusion, and a second fused card in the same turn receiving its independent
fused-only modifier. The fusion keyword and Insidious Chill trigger regressions
remain green.

### C3 investigation result

The 2026-08-11 parallel investigation confirmed that the current `fused`
binding is intentionally transient: `finalize.ts` attaches it to the `play`
event and `fuse.ts` emits a fuse observation, but static reconciliation has
empty event bindings. `has-status: fused` consequently fails when Oaken Old's
continuous ability is compiled. The long-term model is an incarnation-bound,
typed declaration fact on the announced object, for example
`fusion: { revealedSupertypes } | null`; it is not a generic status marker.
That fact must persist across the card's stack/combat-chain lifetime, clear on
an object-resetting zone move, survive snapshot restore, and be queried by
`has-status: fused`. The existing player turn-history boolean remains only for
“you fused this turn,” while existing reveal/fuse events remain trigger inputs.

The same investigation found that `appendFuseEventGroups` currently accepts
any supplied in-hand cards without checking the fusion keyword's required
talents or mode. The declaration validator must reject wrong, missing,
duplicate, and over-revealed selections before payment/journaling, while
allowing one multi-talent card to cover multiple required talents when the
official fusion rule permits it. Required regressions: valid Oaken Old,
non-fused Oaken Old, invalid declarations, `and-or` fusion, object-reset
clearing/snapshot restore, and the existing Insidious Chill fuse trigger.

### C4. Quote-time self cost evaluation

**Owner:** `quotePlay` and the play transaction's announce/calculate/pay stages.

Terminator Tank and War Machine formerly modeled their equipped-count-
conditioned reduction as a continuous mutable-cost atom. The current quote
runs before announcement and must not rely on reconciliation that only sees
the atom after the card reaches the stack.

Required behavior:

- model the reduction as a typed play-static `cost-reduction`, distinct from
  the post-announcement continuous grant;
- prospectively evaluate that play-static on the announced public stack
  incarnation during quote (CR 1.7.4e), without making private hand abilities
  functional;
- collect applicable self and external play cost modifications in calculate
  order: base/set, increases, then reductions;
- use the same quoted cost in the persisted procedure and payment prompt;
- prove 0/1/2/3/4 Evo thresholds, especially that exactly two Evos makes a
  three-resource play legal and one Evo does not.

Resolved implementation: each card now has a separate typed `staticKind:
"play"` `role: "cost-reduction"` ability, and quote-time collection
prospectively evaluates that proposed card's condition. Cost-reduction
statics are explicitly excluded from the play-condition legality gate: a
false discount condition means no reduction, never that the card is illegal.
The ordinary continuous ability retains only the 1/3/4-Evo effects; neither
card declares overpower at card level. Both public AAA suites prove zero-Evo
six-resource payment, two-Evo three-resource payment with the one-Evo hit
effect but no overpower/+3, and four-Evo bonuses. Do not expand continuous
effect functional zones to `hand`, which would violate CR 1.7.4e and expose
unrelated effects prematurely.

### C5. Outcome replacement for wager loss

**Owner:** replacement compiler/registration/candidate selection/resumption.

Cheating Scoundrel currently fails while resolving its own action with
`replacement shape is not yet canonical`. The supported replacement allowlist
has no `wager-loss` + optional discard + `win-wager` shape.

Investigation result: registration is only the first defect. Combat resolution
currently computes the wager winner directly and emits `wager-win`, so it
never publishes a replaceable `wager-loss` outcome. `proposeWager()` also
discards the card's structured prize and persists only a token shortcut, while
`win-wager` hard-codes another controller-owned Gold. Persist an immutable
wager ID and typed prize on the active link; publish wager loss with that
identity; allow the replacement to rewrite the resolved winner; then award
the one stored prize in one common post-outcome path. Do not whitelist the
shape or represent `win-wager` as independent Gold creation.

Required behavior:

- represent wager loss as a replaceable outcome event at chain-link
  resolution;
- publish the optional replacement choice to the losing player;
- if accepted, publish a legal card choice/discard cost, cancel the loss, and
  emit a wager-win outcome for that player;
- award the wager's actual stored prize exactly once rather than hard-coding a
  second Gold creation in `win-wager`;
- consume “the next time” only when the replacement applies and expire it at
  end of turn;
- prove accept, decline, empty-hand/cannot-pay, hit/miss, and one-shot
  boundaries using Errata Bulletin #10's attack trigger.

### C6. Typed target and chooser semantics

**Owner:** declaration kernel + layer target keys + effect-specific decisions.

This is three related gaps that should share a typed target contract rather
than card-specific patches.

1. **Any-target hero/object identity.** Consign to Cosmos // Shock accepts the
   opposing hero selection but damages the controller instead; the existing
   engine split test currently asserts that wrong result. Preserve the chosen
   hero identity through face rebasing, layer targets, and damage proposal for
   both standalone Shock and meld.
2. **Player-directed discard.** Tempestuous Kiss was a malformed card target,
   not an engine gap: use an at-resolution hand object target with both
   `player` and `chooser` bound to `attack-target`. The existing decision
   path then lets the defending player choose while retaining combat identity.
3. **Relational object targets.** Cleave needs “another ally controlled by the
   same hero” relative to the object that was hit. Add a typed relation such as
   `other-than: attack-target` plus controller equality; do not add an opaque
   English status that silently evaluates false.

Burning Blade Dance also consumes this work: its selected controlled dagger is
the damage source and must remain bound as `it` through “damage dealt this
way,” synthetic hit, and destroy.

Investigation result: the selected-Dagger pipeline is already present and
proven by Danger Digits. An optional on-stack target is declared as zero or one
target when its triggered layer is created: selecting zero is the decline, and
selecting one persists the exact layer target through snapshot/restore. This
matches the required optional target declaration timing without reclassifying a
declaration-time target as an at-resolution choice. The public AAA suite now
proves the exact selected Dagger deals damage, hits, is destroyed, zero-target
decline preserves it, no-Dagger safely skips the effect, and an ineligible
object is rejected.

Cleave requires a separate relational target model. Its current
`hasStatus: "another-ally-of-same-hero"` filter is an inert pseudo-status and
fails closed; `damage-dealt` is controller chain-link aggregate rather than
the exact hit amount. Bind the hit event amount and target LKI, then select an
optional public opposing Ally controlled by that hit target's hero while
excluding the attacked Ally. The granted hit trigger must be source-scoped.
This composes with C1's first-class Axe attack proxy and must not use
`opponent` as a substitute for the target-relative controller relation.

### C7. Same-combat-chain public choreography

**Owner:** public test-driver ergonomics only, after coordination with the
active harness owner.

The engine has Draconic-chain counters, aura-play facts, last-attack history,
ally attack targets, and Resolution-Step continuation. The current helper
`resolveRestOfCombat()` deliberately closes combat, so it cannot build a
second, third, or fourth link in the same chain.

Investigation result: `FabTestEngine.advanceCombatTo("resolution")` already
provides the legal CR 7.6.1–7.6.3a boundary: the active link resolves, go
again restores an action point, and the combat chain remains open for the next
attack. `resolveRestOfCombat()` intentionally closes that chain, which made
the original card plans appear blocked. A future
`helpers.resolveActiveChainLink()` alias may make this intent clearer, but no
combat-engine change is required. Use real go-again attacks to prove:

- Breaking Point at link 4 and before link 4;
- Burning Blade Dance, Display Loyalty, and Hot on Their Heels after two
  controlled Draconic links and on their false branches;
- Legacy of Ikaru after Edge of Autumn was the prior attack on the same chain.

Breaking Point should use the existing typed `chain-link-count >= 4` condition;
`has-status: played-at-chain-link-4-or-higher` currently has no evaluator and
should not gain another string-status special case.

The missing Avast Ye! ally-target boundary does not need a new engine
capability. Public ally targeting is already proven elsewhere; the test should
activate the Pirate ally with an opposing ally as its target and assert that
the `hit target: hero` trigger does not fire.

### C8. Granted ability timing and event-source fidelity

**Owner:** continuous reconciler + trigger collection/layer construction.

Properties and abilities granted to a future object must be visible at the
correct event boundary:

- static triggered abilities must be present before matching the attack/hit
  event;
- static continuous abilities must be functional while the affected attack is
  on the stack/combat chain;
- resolution abilities must be frozen from the proposed card at declaration,
  not accidentally invented after resolution begins;
- hit/dealt-damage limits must key by source ability and object incarnation so
  Tempestuous Kiss discards once across its arcane and physical packets.

This capability is exercised by Cheating Scoundrel, Cleave, Warrior's Valor,
Steelblade Supremacy, Machinations of Dominion, Jagged Edge, and Tempestuous
Kiss. Several of those first need the definition corrections described in C2,
so the engine gate must be tested with both a direct synthetic rules test and a
real-card public AAA test.

Steelblade Supremacy exposes a distinct declaration-model defect: its numeric
modifier and granted hit ability each independently declare “target weapon,”
so a controller with two weapons may select different objects. Model a
single declared target alias/binding at declaration time and reuse it across
the sequence; `outputBinding` does not bind declared targets. Its per-weapon
hit trigger is otherwise correctly source-scoped and must be inherited by
each weapon attack proxy.

Jagged Edge confirms that C1 needs a first-class, evaluable combat-chain
weapon proxy: a reaction target must select the actual attack object with
inherited weapon type box, source identity, and lifecycle/LKI. It also exposes
a C8 source-relative rule requirement. Its “damage this would deal can't be
prevented” rule cannot be blanket for a chain link; represent the rule subject
as the selected host/proxy identity and compare it with the damage source.
Keep prevention application/costs intact while preventing zero damage.

## Card-by-card classification

| Identity                   | Current evidence                                                                                                             | What blocks complete public AAA                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Gold-Baited Hook           | Executable happy and boundary coverage                                                                                       | No identified engine gap                                                                                                      |
| Consign to Cosmos // Shock | Split declaration, standalone Shock target damage, Consign X, and meld all pass                                              | No identified engine gap                                                                                                      |
| Cheating Scoundrel         | Next-attack, wager, accepted/declined loss replacement, exact discard, expiry, stale-target, and snapshot branches pass      | No identified engine gap                                                                                                      |
| Avast Ye!                  | Hero-hit, fully-defended, ally-target, and granted-source boundaries pass                                                    | No identified engine gap                                                                                                      |
| Loot the Hold              | Executable hit/no-hand/blocked coverage                                                                                      | No identified engine gap                                                                                                      |
| Shadow Puppetry            | Executable modifier, trigger ordering, accept/decline coverage                                                               | No identified engine gap                                                                                                      |
| Oaken Old                  | Real Earth+Ice fusion, non-fused, and invalid-declaration branches pass                                                      | No identified gap                                                                                                             |
| Tear Asunder               | Executable power/discard/dominate coverage                                                                                   | No identified engine gap                                                                                                      |
| Cleave                     | Hero/Ally targets, exact event amount, decline, no-hit, no-other-Ally, stale-target, and snapshot branches pass              | No identified engine gap                                                                                                      |
| Breaking Point             | Link-one false, link-four hit, and fully-defended source-boundary branches pass                                              | No identified engine gap                                                                                                      |
| Burning Blade Dance        | First-link false, exact selected-Dagger, zero-target decline, no-Dagger, invalid-target, and snapshot/restore branches pass  | No identified engine gap                                                                                                      |
| Display Loyalty            | Qualified hero, qualified Ally, and false branches pass                                                                      | No identified engine gap                                                                                                      |
| Hot on Their Heels         | Qualified hit, fully defended, and false branches pass                                                                       | No identified engine gap                                                                                                      |
| Legacy of Ikaru            | Base reaction and real prior-Edge-of-Autumn same-chain hit/draw branches pass; granted hit is source-scoped                  | Shared declared-target binding for the two reaction sequence steps                                                            |
| Nourishing Emptiness       | True and false conditional branches pass                                                                                     | No identified engine gap                                                                                                      |
| Unsheathed                 | Exact-twice no-go-again and stacked-modifier go-again branches pass with Dorinthea's unrelated re-attack explicitly declined | No identified engine gap                                                                                                      |
| Blood Follows Blade        | Executable reaction and boundary coverage                                                                                    | No identified engine gap                                                                                                      |
| Jagged Edge                | Reaction-step legality, +3 weapon attack modifier, and source-scoped unpreventable damage branches pass                      | No identified engine gap                                                                                                      |
| Steelblade Supremacy       | Selected Dawnblade hit/draw, fully-defended no-draw, and Dorinthea's two-hit re-attack branches pass                         | Shared declared-target binding when more than one weapon is selectable                                                        |
| Warrior's Valor            | All colors prove next-Dawnblade power bonus, hit action-point refund, and fully-defended no-refund                           | No identified engine gap in current public coverage                                                                           |
| Teklo Leveler              | Executable 0/1/4-Evo coverage                                                                                                | No identified engine gap                                                                                                      |
| Terminator Tank            | 0/2/4-Evo public AAA, including exact pre-payment 3-resource quote                                                           | No identified gap                                                                                                             |
| War Machine                | 0/2/4-Evo public AAA, including exact pre-payment 3-resource quote                                                           | No identified gap                                                                                                             |
| Mauvrion Skies             | All colors and hit/blocked branches execute                                                                                  | No identified engine gap                                                                                                      |
| Machinations of Dominion   | Overpower and aura/no-aura go-again branches pass                                                                            | No identified engine gap in the co-located suite                                                                              |
| Tempestuous Kiss           | No-go-again and two-card go-again/arcane/physical once-only discard branches pass                                            | No identified engine gap                                                                                                      |
| Vynnset printings          | Adult/young public hero suites execute                                                                                       | No identified engine gap in the new co-located suites                                                                         |
| Oscilio printings          | Adult/young public hero suites execute                                                                                       | No identified engine gap in the new co-located suites; older OSC001 coverage still needs separate public-API migration review |

## Recommended implementation order

1. **C2 fail-closed semantic validation.** The identified definitions are
   repaired; add authoring validation to reject recurrence.
2. **C1 first-class attack-proxy evaluation.** It unlocks the largest coherent
   card family and prevents superficially green but rules-wrong weapon tests.
3. **C7 Resolution-Step public helper.** Use it immediately to turn the
   Draconic, rupture, and Legacy titles into executable falsifying tests.
4. **C6 target/chooser contract.** Fix Shock, Tempestuous Kiss, Cleave, and the
   dagger source path together.
5. **C4 quote-time self cost.** Complete the remaining generic play-static
   reduction semantics beyond the now-covered EVO self-reduction slice.
6. **C5 wager-loss replacement.** Implement as a vertical event/replacement/
   decision/prize slice after the target chooser contract is stable.
7. **C8 granted-ability timing audit.** Close the remaining Machinations,
   Steelblade, Cheating Scoundrel, and multi-packet trigger boundaries.

## Exit gates

The named-card objective is complete only when:

- every conditional root-keyword duplication and invalid type/filter/zone
  shape above is rejected or corrected;
- every one of the 37 todos is replaced by executable AAA or an explicit
  rules-cited out-of-scope decision (none currently qualifies as 1v1
  out-of-scope);
- weapon-attack tests prove proxy/source distinction and no second-attack
  leakage;
- all multi-link tests keep one combat chain open;
- split target, discard chooser, fusion, cost quote, and wager replacement
  survive serialize/restore at their persisted decision boundary;
- the exact card suites, affected engine suites, cards/engine typechecks, and
  then the owning FAB CI gate pass.
