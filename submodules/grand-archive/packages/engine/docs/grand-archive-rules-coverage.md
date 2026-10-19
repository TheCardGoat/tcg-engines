# Grand Archive Rules Coverage

This document describes the current coverage contract without duplicating thousands of lines of
source-specific audit notes. The authoritative per-rule status is
[`../reports/comprehensive-rules-audit-status.json`](../reports/comprehensive-rules-audit-status.json),
and `pnpm run audit:rules:complete` validates it against every rule-bearing section in
the official mirror.

## Review baseline

The audit records the content fingerprint of the official rule text last reviewed.
The initial fingerprints preserve the pre-refresh `5d48953d` baseline; they do not
certify later changes. A refreshed rule under the same heading becomes `stale`,
and a new section becomes `pending`, until its behavior and evidence are reviewed.
Image-only headings attach to the preceding named section; image-host changes do
not change a rule's identity. All mirrored rule pages are audited, including pages
missing from the official table of contents.

Evidence must resolve to an existing document and checkpoint label. This checks
provenance, not that a test passed: the separate gameplay suite must also pass.
Executable catalog definitions and coverage markers alone do not establish full
catalog correctness.

Run these commands instead of copying the numbers into another report:

```sh
pnpm run audit:rules
pnpm run audit:rules:complete
pnpm run ci-check
```

## What Implemented Means

A rule unit may be marked `implemented` only when the engine has all of the following:

1. A typed representation for the rule or a documented reason that no runtime state is required.
2. An authoritative production owner under `src`, rather than logic duplicated in a simulator,
   test helper, or bot.
3. Admission and failure behavior that rejects illegal commands or malformed executable data.
4. Behavior-focused evidence through the production runtime for rules that affect gameplay.

Catalog admission proves that a card is structurally executable. It does not, by itself, prove
that every sentence was compiled with perfect semantics or that every interaction among cards has
been tested.

## Coverage Owners

| Rules family | Primary engine owners | Representative evidence |
| --- | --- | --- |
| Formats, setup, players, and outcomes | `src/procedures/game-flow`, `src/game` | `pregame.test.ts`, `game-ending.test.ts` |
| Card characteristics, types, and zones | `src/game`, `src/kernel` | `catalog-admission.test.ts`, `double-faced-rules.test.ts`, `zone-operations.test.ts` |
| Hidden and public information | `src/projection`, `src/log` | `view-permissions.test.ts`, `private-zone-rules.test.ts`, `log-projection.test.ts` |
| Timing, Opportunity, phases, and turns | `src/procedures/game-flow` | `turn-phase-sequencing.test.ts`, `phase-ending.test.ts`, `phase-skips.test.ts` |
| Activation, materialization, costs, and payments | `src/procedures/activation`, `src/commands` | `activation-payment.test.ts`, `cost-rules.test.ts`, `legal-command-enumeration.test.ts` |
| Effect and Effects Stack resolution | `src/procedures/effects`, `src/procedures/decisions` | `effect-activation.test.ts`, `stack-targeting.test.ts` |
| Combat, retaliation, damage, and weapons | `src/procedures/combat` | `attack-rules.test.ts`, `retaliation-keyword-scope.test.ts`, `weapon-participation.test.ts` |
| Abilities, keywords, and triggers | `src/rules/abilities` | `ability-layer.test.ts`, `trigger-abilities.test.ts`, keyword-specific regressions |
| Continuous rules and state-based checks | `src/rules/state` | `continuous-timestamps.test.ts`, `state-based-order.test.ts`, `characteristic-layers.test.ts` |
| Replacement and prevention effects | `src/rules/replacements`, `src/kernel` | `replacement-effect-execution.test.ts`, `replacement-capacity.test.ts`, `pre-commit-replacements.test.ts` |
| Persistence and resumable choices | `src/snapshot`, `src/procedures/decisions` | `snapshot-admission.test.ts`, continuation tests, opt-in snapshot fuzzing |
| Simulator and automated-player contracts | `src/projection`, `src/testing`, `src/automation` | test-engine, catalog-match, and deterministic bench tests |

The evidence labels in `comprehensive-rules-audit-status.json` are stable historical checkpoint
names. This table maps those checkpoints to the current post-reorganization owners; file moves do
not require rewriting 300 rule statuses.

## Stable Evidence Labels

The machine-readable audit uses these labels to retain the semantic checkpoint reviewed for each
rule unit. They are grouped into the current owners in the table above.

- `Ability lifecycle, tracking, and restrictions`
- `activation and entry keyword cluster`
- `Aenean Progression`
- `Aethercalling and Loaded Cards`
- `Agility`
- `all-zone bonus restrictions`
- `all-zone bonus restrictions and Class Locked`
- `Ambush and Steadfast`
- `Brew`
- `Bulwark`
- `Card characteristics and double-faced cards`
- `Card types, functional subtypes, and supertypes`
- `Card/object information, last-known information, and copies`
- `Cascade`
- `Cleave`
- `Combat phase, declaration, retaliation, and damage`
- `Counter lifecycle and inherent counter abilities`
- `Critical, Commanded Will, and Divine Relic`
- `Damage and damage prevention`
- `Distant and durability counters`
- `Draw, Main, and End`
- `Drawing cards`
- `Efficiency`
- `Elysian Aura`
- `Ending phases and turns`
- `Exalted and Norm element enablement`
- `Facing and end-of-game disclosure`
- `Field, Effects Stack, Intent, and information visibility`
- `Foster`
- `Game, replacement, and continuous effects`
- `Glossary terminology and categorical type list`
- `Imbue`
- `Inherited Effect`
- `Inherited Effect; generated lineage; host incarnation`
- `Intercept`
- `Lineage`
- `Link`
- `Link Shield reference substitution`
- `Main Deck, Material Deck, and Pantheon`
- `Masteries and named mastery state`
- `Match formats and pre-game setup`
- `Miscellaneous rules, special actions, and state stabilization`
- `Multiple Command abilities`
- `Multiple Prepare abilities`
- `named trigger keyword family`
- `Objects, non-objects, targeting, and redirect`
- `Ordered private placements`
- `Parameterized keyword provenance`
- `Player-owned destination zones`
- `Players, objectives, and ending the game`
- `Playing cards lifecycle`
- `preservation, payment, and combat permission keyword tail`
- `Pride and obedience`
- `Printed card parts`
- `Properties, orientation, and rules-derived states`
- `restricted destinations and Renewable regression`
- `restriction, payment, and protection keyword cluster`
- `Shared game-zone and object-specific-zone contract`
- `Shroud, Stealth, and True Sight`
- `Skipping phases`
- `Statuses and Crowd's Favor`
- `Timing, Opportunity, and special play permissions`
- `Token classification, control, and lifetime`
- `Turn order and phase boundaries`
- `Vigor`
- `Wake Up, Materialize, and Recollection`

## Coverage Boundaries

The completed audit means the current local rules mirror has no known unowned rule section. It does
not mean:

- every possible combination of catalog cards has a dedicated test;
- future cards cannot require a new combination of effect primitives;
- a successful parse guarantees the intended semantic interpretation;
- official rules changes are covered before the mirror is refreshed;
- the browser simulator, networking, persistence service, or replay UI is complete;
- opt-in fuzz and performance workloads run on every ordinary CI invocation.

When a new card exposes a shared rule gap, fix the owning engine path and add the card-backed
regression together. Do not add a card-only workaround or infer behavior from Index text at runtime.

## Updating Coverage

1. Refresh the official mirror through the Grand Archive rules skill.
2. Run `pnpm run audit:rules:list` and inspect every new or changed rule-bearing section.
3. Implement the rule in its architectural owner and add behavior-focused evidence.
4. Update `comprehensive-rules-audit-status.json` only after the evidence exists.
5. Run `pnpm run audit:rules:complete` and `pnpm run ci-check`.

The roadmap strengthens this process by fingerprinting rule content, so changed prose under an
existing heading cannot retain an old status silently.

## October 2026 review

Checkpoint: `October 2026 damage and editorial review`.

Compared the previously audited `5d48953d` mirror with the refreshed official
September 17 rules. The following units were reviewed individually; other stale
or pending units retain their unresolved status.

| Unit | Changed requirement and evidence |
| --- | --- |
| Counters / Damage | Rule 3.a makes damage counters on non-champions inert. `damage-counter-separation.test.ts` now exercises public actions for inert counters, separate temporary damage, moving counters, JSON restoration, and end-phase clearing. Native state, state-based actions, counter queries, and viewer projection preserve both properties. |
| Damage / General Rules | Rule 10.a.ii explicitly identifies the ally as the sole combat damage source. `proposeGrandArchiveCombatDamage` sources attack and retaliation events from their respective unit IDs; combat and keyword tests cover that path. Rules 12–13 use temporary damage for allies and permanent counters for champions, now represented separately. |
| Counters / Wither | Clarified per-object payment. `wither.test.ts` checks full payment for each object, rejects partial payment, sacrifices only the declined object, and removes surviving counters. |
| Counters / Bulwark | Changes only capitalization. Existing keyword/replacement coverage still checks mandatory prevention, one-counter consumption, and unpreventable damage. |
| Champion / General Rules | Moves the lineage element-identity rule from the Leveling Up paragraph into General Rules 9. `game/elements.ts` includes the base and inner-lineage champion elements; `element-enablement.test.ts` and `materialization-elements.test.ts` cover the lineage behavior. The Exalted change is reviewed under the separate correction checkpoint below. |
| Mastery / General Rules | Adds permission to use any physical token as a visual representation. Simulator mastery is a player-state property backed by its rules definition, not an inventory requirement; mastery direction, counters, and snapshot tests cover this representation. |
| Players / General Rules | Adds an introductory sentence without changing the operative rules. No runtime change required. |

Validation: `fix-damage-engine-2.log` records 976 passing engine tests and three
existing optional skips. `fix-damage-projection.log` additionally verifies that an
Item made into an Ally reports the current functional damage type to viewers.
These checks do not certify the remaining card coverage or hosted release gates.

Checkpoint: `October 2026 bestowment and time distortion review`.

- **Bestowing Boons:** `proposeGrandArchiveBoonBestowment` checks the face-down
  Pantheon origin, timing, elements, play/bestow restrictions, modes, variables,
  targets, cost ordering, and full payment before committing the stack item.
  Bestowment closes Opportunity; resolution returns the card face up and emits
  `boon-gained` only on success. `pregame.test.ts` covers bestowment transitions,
  atomic additional costs, timing and registration restrictions;
  `level-locked.test.ts` checks the Level Locked boundary. These suites pass in
  `current-rules-reviewed.log` (the separate duplicate-distortion assertion was
  then corrected and rerun).
- **Time Is Distorted:** `time-distortion.test.ts` now repeats the effect twice as
  well as once. It verifies that the second application emits no change, JSON
  restoration preserves the rule, the normal materialize phase is skipped,
  exactly one materialize phase follows Main, and the extra phase proceeds to
  End rather than Recollection. All three tests pass in
  `current-rules-time-distortion.log`.

Checkpoint: `October 2026 Exalted and Taunt corrections`.

- **Special Elements / Exalted and Parts of a Card / Element:** the refreshed
  rules explicitly allow an Exalted champion to enable Exalted. The previous
  helper discarded that element, and two tests encoded the old interpretation.
  Element enablement now includes every champion/lineage element and unlocks
  Exalted for any advanced element. Tests cover an Exalted current champion,
  an Exalted champion in the inner lineage, a basic-only champion, and non-champion
  lineage cards; card activation, materialization, and effect activation use the
  same helper.
- **Taunt:** the refreshed wording includes attackable objects, not just units.
  Attack declaration now includes awake Siegeable Domains with Taunt. The new
  fixture refuses bypassing the awake Domain, permits attacking it, checks the
  resulting durability loss, and permits bypassing it while rested. Stealth
  restrictions continue to apply only to units, matching ordinary attack
  target legality.

The three failing assertions were reproduced before the production corrections
(`current-rules-regressions-before.log`). The five focused engine suites then
passed all 53 tests (`current-rules-regressions-after.log`).

Checkpoint: `October 2026 Intent control correction`.

Intent rule 4 assigns every entering card/object to the host champion's
controller. The public-action regression in `game/shared-zone-control.test.ts`
previously left an action controlled by its caster after moving it into the
opponent's Intent. The effect producer now records the host's controller, and
kernel movement/creation enforce that entry rule independently of ownership.
The existing projection test now checks native control as well as viewer grouping.
The before run reproduced both failures; the corrected kernel/control/timestamp
suites pass all 106 tests (`intent-control-before.log`, `intent-control-after.log`).

Checkpoint: `October 2026 unresolved source and combat rules`.

The reproducible script `output/grand-archive-readiness/remaining-rules-probe.mjs`
(at repository root) records its results in the adjacent JSON file. These units
are reviewed as **partial**, not certified by their generated definitions:

- **Divine Comedy:** gaining the mastery through a public action succeeds, but
  enumeration offers no activation and using the champion as source fails.
  `activate-ability` requires an object ID and active object ability; it does not
  admit non-object mastery sources. Separately, the compiler wrongly scoped the
  first-activation discount to a turn. Compiler regressions now require game
  scope. All four pages, counters, copied activations, negation, payment and
  source identity still need public-action acceptance before this unit closes.
- **Shifting Currents:** the original probe rejected its pending trigger when
  targeted by Spell source. This is repaired in the later `October 2026 mastery
  source characteristics` checkpoint; the original failure remains in the audit
  evidence.
- **Spellshroud:** existing kernel tests cover card activations, object abilities,
  triggered Spells and resolution-time protection. The clarified inclusion of
  ability activations is already represented. Non-object mastery source subtype
  propagation for mastery triggers is repaired in the later source-characteristics
  checkpoint. Keep this broader unit partial until Divine Comedy's missing
  activation path also has public-action acceptance.
- **End of Combat Step:** the original public attack retained attacking/defending
  roles during its On Hit response window. This is repaired in the later
  `October 2026 end-of-combat cleanup` checkpoint, including Intent movement,
  replacement decisions and returning to Main only after the response window.


Checkpoint: `October 2026 Link Shield interpretation gap`.

The current [official Link Shield entry](https://rules.gatcg.com/glossary/keywords-and-abilities#link-shield), checked live on 15 October, contains overlapping sacrifice wording: rule 1 describes both sacrifice substitution and destruction with temporary-damage removal, while rule 2 explicitly prescribes sacrificing the shield for an effect or cost. The engine currently substitutes a sacrifice for a sacrifice and clears temporary damage only for destruction. Existing reference-substitution tests pass, but they do not settle the changed sacrifice/damage wording. Keep this unit partial until the overlap is resolved and the chosen behavior has a regression; do not silently certify the old interpretation against the new fingerprint.

The same official page's Link rule 1.a explicitly designates the target of a Link as its linked object. Thus the singular subject returning C for B in A→B→C is consistent with B's own Link. The confirmed defect is the separate bilateral `linked-to` collection. The probe now arranges actual Unit Link abilities with valid field hosts, rather than only untyped host IDs.


Checkpoint: `October 2026 bilateral Link collections`.

The [Linked / Linked to rules 1–2](https://rules.gatcg.com/glossary/game-terms#linked-linked-to), checked live on 15 October 2026, define a bilateral direct relationship. The native collection now tests legal Link edges in either direction without traversing another edge. It shares the existing Link legality check, including target departure/reentry and current keyword/type legality, and carries continuous-derivation guards through that check. Loaded, Inner Lineage and Intent host relationships remain separate. The singular designated `linked-object` subject is unchanged, as required by [Link rule 1.a](https://rules.gatcg.com/glossary/keywords-and-abilities#link).

`game/linked-collection.test.ts` establishes A→B→C through public activations and proves B's effect reaches A and C, A's effect does not reach C, and B's designated-object effect reaches C alone. Further tests cover multiple incoming links, membership filtering, continuous power evaluation, unrelated hosted cards and host departure/reentry before state-based cleanup. Eight new tests pass; the focused Link/keyword set passes 54 tests, and five affected catalog files pass 52 tests (`linked-collection-focused.log`, `linked-collection-cards.log` under repository `output/grand-archive-readiness`). This closes the collection audit unit, not the separate Link Shield interpretation gap.


Checkpoint: `October 2026 mastery source characteristics`.

The official [Mastery / Shifting Currents rule 1](https://rules.gatcg.com/game-mechanics/game-mechanics-mastery#shifting-currents), checked live on 15 October 2026, identifies its Mage/Spell characteristics despite mastery being a non-object function. Source filters now read the mastery definition without creating a card instance. Composite characteristic filters work; unrelated subtypes and field-object filters do not match. Trigger announcement, resolution and copy retargeting also carry the original mastery subtype, including after the player replaces their mastery. This follows [Spellshroud rules 1–2](https://rules.gatcg.com/glossary/keywords-and-abilities#spellshroud): both initial protection and protection gained in response make the Spell target illegal.

`rules/abilities/mastery-source.test.ts` contains 11 public-action regressions: printed source classification and negative filters, protected-target rejection without mutation, removal of triggers with no legal targets, non-Spell mastery permission, resolution revalidation across snapshot restoration, source preservation after mastery replacement, and an opponent's copied trigger with optional retargeting across a JSON snapshot. The original five regressions fail before the fix (`mastery-source-before.log`); all 34 focused tests across mastery rules/counters/directions, Spellshroud and stack copies now pass (`mastery-source-focused.log`). Engine types pass (`mastery-source-types.log`), and the original probe now accepts the Spell-source target (`remaining-rules-after-mastery-source.json`). Together with existing direction/adjacency/replacement tests this closes Shifting Currents. Divine Comedy activation remains missing, so the broader Spellshroud unit remains partial pending that activation acceptance.


Checkpoint: `October 2026 end-of-combat cleanup`.

The official [End of Combat Step, General Rules 1.a–d and 2–2.a](https://rules.gatcg.com/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-end-of-combat-step), checked live on 15 October 2026, separates end-step turn-based actions from returning to Main. The runtime now announces damage triggers, completes state-based checks and their triggers, removes combat roles and processes Intent departure before players respond. It keeps the combat end step active until the stack is empty and consecutive Opportunity passes finish. Forced phase/turn ending continues through the existing immediate termination procedure.

A native `combat-cleanup-started` event persists a one-time dispatch marker in combat state. If an Intent move pauses for a replacement decision, the remaining kernel continuation resumes after restoration without replaying the cleanup. The event is deliberately omitted from player logs; existing visible card movements and combat completion remain logged.

`procedures/combat/end-combat-step.test.ts` has six public-action tests. Four reproduced the pre-fix role/Intent timing defect (`end-combat-step-before.log`). The expanded suite proves hit/death/cleanup event order, Intent departure before its own trigger resolves, JSON restoration, optional replacement acceptance and refusal, early combat termination, and both empty-stack Opportunity passes before returning to Main (`end-combat-step-expanded.log`). The full engine passes **1,007 tests with three existing skips** (`end-combat-engine-full.log`); the stronger final empty-stack assertions also pass in the focused rerun. Five affected catalog files pass **41 tests** (`end-combat-card-tests.log`); the adapter passes **107 tests** (`end-combat-adapter-tests.log`). Engine/adapter types and the engine distribution build pass. The original probe confirms cleared attacker/defender roles while On Hit remains pending (`remaining-rules-after-combat.json`). This closes the End of Combat Step audit unit; it does not prove hosted reconnect or cross-version match continuation.


Checkpoint: `October 2026 Divine Comedy page prerequisites`.

The official [Mastery / Divine Comedy rules 2.a–c](https://rules.gatcg.com/game-mechanics/game-mechanics-mastery#divine-comedy) restrict only opponents' even-reserve-cost **cards**, and rule 2.b.ii requires actual destruction directly into the graveyard before adding the separate Recover 4 trigger. The compiler now emits an opponent/card restriction and a reflexive follow-up with an explicit destruction-result requirement. Replaced banishment or prevented movement cannot satisfy that requirement. Spell classification follows the initial reflexive action; its consequence is a separate stack layer.

Generated reflexive triggers now support a native mastery source identity, without creating a card instance or substituting the champion. The mastery regression verifies separate stack timing and source preservation across JSON restoration. `rules/abilities/mastery-source.test.ts` and `kernel/engine.test.ts` pass **110 tests** (`divine-reflexive-engine-focused.log`). The new mastery regression failed before the repair with `reflexive trigger without source object` (`mastery-reflexive-before.log`).

`packages/cards/src/cards/PRD/masteries/divine-comedy-pages.test.ts` isolates actual compiled page effects in fixture actions: eight public-action cases cover opponent-only/card-only restrictions and expiration, separate recovery timing, recovery negation, Spellshroud announcement rejection, banishment replacement, and acceptance/refusal of destruction prevention across JSON restoration. Four original cases failed before the repair (`divine-pages-before.log`); the expanded eight pass (`divine-pages-expanded.log`). Two compiler regressions also pass within the 164-test compiler suite. Engine and card type checks pass.

**Divine Comedy remains partial.** These fixture actions do not establish native mastery activation, its payment and first-activation discount, once-per-turn limit, Cascade progression, page 4, or copy/negation semantics. Do not count them as complete behavior coverage for the mastery. The broader Spellshroud unit likewise remains partial until the real non-object activation path is exercised.

The final card/compiler/manifest validation passes **175 tests across four files** (`divine-pages-final.log`). Generation is reproducible across two consecutive runs at `07ab8bd52d2cb3c23bffb83f5fdeb3ef97b2b8b4ec3dad4264013790dc36276d` (`divine-pages-generation-verify.log`). The rules gate remains 302 implemented / three partial, with no stale or missing units. Refreshing the card coverage report updates the compiled effect signature without claiming new coverage: 1,337 untested abilities and seven uncovered ability-free cards remain (`divine-pages-coverage-gate.log`).


Checkpoint: `October 2026 native mastery activation`.

The official [Mastery / Divine Comedy rules 1–2.e](https://rules.gatcg.com/game-mechanics/game-mechanics-mastery#divine-comedy), [Cascade rules 1–3](https://rules.gatcg.com/glossary/keywords-and-abilities#cascade), and [Spellshroud rules 1–2](https://rules.gatcg.com/glossary/keywords-and-abilities#spellshroud) now have native activation acceptance. The existing `activate-ability` command accepts exactly one object source or named mastery. The actor must own that mastery. Shared activation processing enforces the champion restriction, slow timing, costs and modifiers, targets, and usage limit. Mastery identity and acquisition timestamp survive on stack bindings; original activations determine Cascade, while copies do not advance it. Rule collection accepts the non-object source without substituting a champion or assigning a zone. The adapter exposes a source-free action with independently selected reserve payment and native target declarations.

Native tests reproduced two additional defects beyond the absent command: page 4 attempted to read an undeclared X, and the printed non-negatable activation flag was ignored (`mastery-activation-before.log`, `mastery-activation-expanded-before.log`). Page 4 now derives X from the actual counters-removed result, and negation honors the original activation's flag while allowing its copies to be negated.

`packages/cards/src/cards/PRD/masteries/divine-comedy.test.ts` contains **12 public-action tests** covering the free first activation, paid later activation across restoration, once-per-turn restriction, Dante Bonus, slow timing, ownership and command identity, automatic Cascade mode, player-wide restrictions and costs, all four pages and no loop after page 4, original/copy negation and copy-independent progression, Spellshroud at announcement and gained in response, and unpreventable damage with zero removed counters. The eight isolated page tests continue to cover opponent/card-only restrictions and expiry, recovery timing/negation, banishment replacement, and destruction-prevention decisions across restoration. The final card/compiler/manifest run passes **186 tests** (`mastery-activation-card-final.log`).

Full engine validation passes **1,018 tests with three existing skips** (`mastery-activation-engine-full.log`); this run included ten card-specific tests before they moved to the card package, whose final focused run also includes the two added cases. The full adapter run passes its existing **107 tests**; its new test initially failed on an ambiguous fixture reference, then passes after specifying the field zone (`mastery-activation-adapter-full.log`, `mastery-activation-adapter-test.log`). That test submits the free mastery action, restores a snapshot, rejects underpayment without mutation, and submits page 2 with a target and a selected four-card payment. Engine/card/adapter types and the engine build pass.

This closes the Divine Comedy and Spellshroud rules audit units. It does not close complete player declaration discovery, full catalog coverage, or hosted match continuity.

Two consecutive regenerations reproduce `a5de5ae88ef19c364c8d67a7f583859a3d19d5948c1941c69cabc6ba0051a6cf` (`mastery-activation-generation-verify.log`). The updated original probe discovers the native ability and executes it successfully, while rejecting a false champion source (`remaining-rules-after-mastery-activation.json`). The refreshed rules gate reports **304 implemented / one partial**, with no stale or missing units (`mastery-activation-rules-audit.log`). Card coverage now records **3,208 / 4,544 abilities**, leaving **1,336** untested and seven uncovered ability-free cards (`mastery-activation-coverage-gate.log`).
