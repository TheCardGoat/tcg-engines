/**
 * CR §6.2 / §6.3 — continuous-effect named-example cards, driven end-to-end.
 *
 * Test-backfill: the §6.2/§6.3 staging engine is the MOST faithful subsystem
 * (prior audit confirmed the 8-stage / 7-substage / timestamp model, dependency
 * hoisting, and dynamic eligibility recomputation — proven synthetically in
 * `rules-evaluator.test.ts`). These tests drive the REAL named example cards
 * through the full pipeline and assert CR-observable outcomes (damage = attack
 * power − block → defender life delta; action-point grants; block legality).
 * The staged {p}/{d} values flow through to those observables, so the tests
 * stay robust without reaching into the rules view.
 *
 * Per the task decision tree, each example is either GREEN (the real card
 * produces the CR outcome) or `it.fails`:
 *   - `it.fails`-edge: the named scenario needs setup the harness cannot
 *     provide (a mid-link base/subtype change, a reaction-step multi-mod, a
 *     simultaneous-ordering window, a random-discard gate, or a talent-locked
 *     hero/aura/equipment chain). Each points to the synthetic proof in
 *     `rules-evaluator.test.ts` that already covers the mechanism.
 *   - `it.fails`-defect: the real card exposes an engine wiring gap; the test
 *     asserts the CR-correct (currently-false) observable and names the gap.
 *
 * NOTE on class legality: this harness does NOT reject a hero for playing a
 * card outside its printed class/talent (e.g. Bravo, a Guardian, resolves Brute
 * /Warrior/Earth actions). "Wrong hero" is therefore never the failure reason
 * for these specs; every `it.fails` below fails for a real setup/wiring reason
 * documented in its comment.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine, buildFabRulesView } from "../../../index.ts";
import { bravo, dash, nimbleStrikeRed, hypothermiaBlue, threadbareTunic } from "../../fixtures.ts";
import { tearLimbFromLimbBlue } from "../../../../../cards/src/cards/actions/tear-limb-from-limb.ts";
import { bareSwingRed } from "../../../../../cards/src/cards/actions/bare-swing.ts";
import { cutDeepYellow } from "../../../../../cards/src/cards/actions/cut-deep.ts";
import { stasisCellBlue } from "../../../../../cards/src/cards/actions/stasis-cell.ts";
import { tempestAuroraYellow } from "../../../../../cards/src/cards/actions/tempest-aurora.ts";
import { aetherFlareYellow } from "../../../../../cards/src/cards/actions/aether-flare.ts";
import { comeToFightRed } from "../../../../../cards/src/cards/actions/come-to-fight.ts";
import { luminaris } from "../../../../../cards/src/cards/weapons/luminaris.ts";
import { prismSculptorOfArcLight } from "../../../../../cards/src/cards/heroes/prism-sculptor-of-arc-light.ts";
import { miragingMetamorphRed } from "../../../../../cards/src/cards/actions/miraging-metamorph.ts";
import { minnowismRed } from "../../../../../cards/src/cards/actions/minnowism.ts";
import { thumpBlue } from "../../../../../cards/src/cards/actions/thump.ts";
import { vigorRushYellow } from "../../../../../cards/src/cards/actions/vigor-rush.ts";
import { headJabYellow } from "../../../../../cards/src/cards/actions/head-jab.ts";
import { eraseFaceRed } from "../../../../../cards/src/cards/actions/erase-face.ts";
import { talismanOfFeatherfootYellow } from "../../../../../cards/src/cards/actions/talisman-of-featherfoot.ts";
import { flourishYellow as flourish } from "../../../../../cards/src/cards/actions/flourish.ts";
import { nerveScalpel } from "../../../../../cards/src/cards/weapons/nerve-scalpel.ts";
import { fangStrike } from "../../../../../cards/src/cards/attack-reactions/fang-strike.ts";

/**
 * Vigor Rush (yellow) is the workhorse follow-up attack across these suites:
 * Generic Attack-Action, base {p}=3, cost 1, and PRINTED go again (a base
 * keyword, not a granted one). That makes it a clean probe for both "next
 * attack gets +X{p}" modifiers (base 3 is small enough to clear a ≤3 gate) and
 * for the Hypothermia base-go-again case.
 *
 * Nerve Scalpel is the workhorse DAGGER: Assassin 1H Dagger weapon, base {p}=1,
 * "Once per Turn Action - {r}{r}: Attack. Go again". A weapon attack carries the
 * weapon's subtypes onto the combat chain, so it is what a "next dagger attack
 * gets +X{p}" modifier (Cut Deep) latches onto — there are no Dagger ATTACK
 * ACTION cards in the catalog (Daggers are weapons).
 */

describe("CR 6.2 / 6.3 — continuous-effect named examples", () => {
  // ── 6.2.2b — X locked at first application ───────────────────────────────

  it("CR 6.2.2b — Tear Limb from Limb locks X = base {p} at first application (2×base damage)", () => {
    // CR 6.2.2b: "+X{p} where X is its base {p}" locks X at the moment the
    // modifier is first applied; a LATER base change does not alter the +X.
    // Observable: damage = base + X(=base) = 2×base.
    //
    // The real card gates the modifier behind "draw, then discard a RANDOM
    // card; if it has 6+ {p}, the next Brute attack gets +X". The random
    // discard makes a naive setup seed-fragile. To make the outcome
    // SEED-INDEPENDENT this rig ensures EVERY card in the random-discard pool
    // is a 6+ Brute attack with base 7, so (a) the gate ALWAYS fires (any
    // discarded card is 6+) and (b) whichever Brute attack survives to be
    // played always has base 7. After playing Tear Limb, hand holds one
    // bareSwingRed (base 7); the card drawn off Tear Limb is also a
    // bareSwingRed (the whole deck is bareSwingRed), so the pool is two
    // identical base-7 6+ cards — the discard is 6+ for any seed and the
    // survivor is always a base-7 Brute attack. +X (=7) → 2×7 = 14 damage.
    //
    // The "survives a LATER base change" half of 6.2.2b (X stays locked across
    // a mid-link set-base) is not exercised by this positive path; it is proven
    // synthetically in `rules-evaluator.test.ts` ("reads a continuous amount
    // from the receiving subject", which restores a locked application across a
    // later `set-base`).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tearLimbFromLimbBlue, bareSwingRed],
        deck: Array.from({ length: 4 }, () => bareSwingRed),
        actionPoints: 2,
        resourcePoints: 5,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tearLimbFromLimbBlue);
    game.helpers.resolveUntilIdle();

    // Play the surviving Brute attack undefended. The +X (X = base 7) locked
    // at first application → 2×base = 14 → Dash 6. Holds for any RNG seed.
    Bravo.attackWith(bareSwingRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(6);
  });

  // ── 6.2.2c — modifier latches onto the object, survives subtype change ───

  it("CR 6.2.2c (positive) — Cut Deep +3 latches onto the next dagger attack", () => {
    // CR 6.2.2c: a "next dagger attack gets +3{p}" modifier latches onto the
    // dagger OBJECT at first application. Daggers are WEAPONS in the catalog
    // (no Dagger attack-action cards exist), so the positive path drives a real
    // Dagger-weapon attack: play Cut Deep, then activate Nerve Scalpel (Assassin
    // 1H Dagger, base {p}=1) and let the +3 latch onto that weapon attack.
    // Observable: base 1 + 3 = 4 damage undefended → Dash 20 − 4 = 16.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        hand: [cutDeepYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cutDeepYellow);
    game.helpers.resolveUntilIdle();
    // Activate the Dagger weapon — its attack opens the combat chain and the
    // +3 "next dagger attack" modifier latches onto the Dagger object.
    Bravo.activate(nerveScalpel);
    game.helpers.resolveRestOfCombat();

    // base 1 + 3 (Cut Deep) = 4 → Dash 16.
    expect(Dash.life()).toBe(16);
  });

  it.fails("CR 6.2.2c (edge) — Cut Deep +3 survives a mid-link Dagger subtype removal", () => {
    // CR 6.2.2c edge: once the +3 has latched onto the dagger object it keeps
    // applying EVEN IF the Dagger subtype is removed from that object mid-link
    // (e.g. Take Up the Mantle) — the modifier latches the object, not the
    // eligibility predicate. The positive +3-dagger path is GREEN just above.
    //
    // Why this is `it.fails`: the harness cannot remove an object's Dagger
    // subtype mid-link (no clean Take-Up-the-Mantle setup over a weapon
    // attack). vigor-rush here STANDS IN for a former dagger whose Dagger
    // subtype was removed: per CR 6.2.2c the latched +3 would still apply to
    // it (Dash 14), but because the mid-link subtype removal is undrivable the
    // +3 cannot attach to a non-dagger (Dash 17). The subtype-latching /
    // changed-eligibility model is proven synthetically in
    // `rules-evaluator.test.ts` ("uses changed eligibility in the current
    // dependent substage and future stages").
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cutDeepYellow, vigorRushYellow],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cutDeepYellow);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(vigorRushYellow);
    game.helpers.resolveRestOfCombat();
    // Would be 14 (power 6) only if the +3 persisted onto a former dagger
    // whose Dagger subtype was removed mid-link; the real outcome is 17.
    expect(Dash.life()).toBe(14);
  });

  // ── 6.2.2a — duration fixed at generation (Stasis Cell) ──────────────────

  it("CR 6.2.2a — Stasis Cell locks target equipment's activated abilities for a fixed duration window", () => {
    // CR 6.2.2a: a continuous effect's duration is fixed when it is
    // generated. Stasis Cell's enter-arena triggered-static restricts the
    // TARGET equipment's activated abilities until end of its controller's
    // next turn. Observable target: Dash plays Stasis Cell, targets Bravo's
    // threadbareTunic, and the Tunic's activated ability is rejected for the
    // fixed window.
    //
    // The enter-arena triggered-static now authors its restriction as a
    // choosable `subject` (on-stack object target) on the rule-modification
    // effect. The engine elicits that subject declaration (collectDeclaredTargets
    // recognizes `effect.subject`), latches the chosen equipment as the
    // continuous rule's initial subject, and quoteFabActivation denies only
    // that equipment's activated abilities. (A probe without handing priority
    // over would be a false positive: the activate is rejected only because
    // Bravo lacks priority, not because of the lock — hence the Dash.pass.)
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, hand: [stasisCellBlue], deck: 4, actionPoints: 1 },
      { firstPlayer: dash, autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.play(stasisCellBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: threadbareTunic.canonicalId,
      optionalBoolean: false,
    });

    // Hand priority to Bravo so a rejection would have to come from the
    // Stasis Cell restriction, not from lacking priority.
    Dash.pass();

    // CR 6.2.2a: the Tunic's activated ability is locked for the window by
    // the latched subject, so the activation is genuinely rejected.
    expect(Bravo.expectActivationRejected(threadbareTunic).accepted).toBe(false);
  });

  // ── 6.2.2a — no explicit duration defaults to end of turn (Tempest Aurora)

  it("CR 6.2.2a — Tempest Aurora's +1 and Aether Flare's count boost both apply to arcane damage", () => {
    // CR 6.2.2a: an effect with no explicit duration lasts for the rest of the
    // turn. Tempest Aurora is a standard replacement — "the next card you play
    // this turn with cost ≤1 and an arcane damage effect instead deals that
    // much arcane damage plus 1". Observable target: Aether Flare (cost 1,
    // arcane 2) deals 3 arcane to the defender → Dash 17.
    //
    // Formerly `it.fails` blaming Tempest Aurora's `appliesTo: { next }`
    // shape, but that shape was never the blocker: the throw came from Aether
    // Flare's own a2 replacement, whose "plus X, where X is the damage dealt
    // by Aether Flare" boost amount is a `count` FabAmount
    // (`{ type: "count", what: "damage-dealt", per: "turn" }`) that the
    // damage-boost canonical gate rejected as non-canonical while resolving
    // the card. The gates now admit any evaluatable FabAmount (resolved at
    // apply time via evaluateAmount, CR 6.4.10), so a2 registers cleanly and
    // Tempest Aurora's one-use `appliesTo: { next }` boost — which already
    // worked, including consumption — lands on Aether Flare's damage.
    //
    // The scenario also drives a2's count boost end-to-end (CR 6.4.10): a2's
    // printed text is "The next card you play this turn with an effect that
    // deals arcane damage, instead deals that much arcane damage plus X, where
    // X is the damage dealt by Aether Flare." Aether Flare #1 deals 3 (its 2
    // plus Tempest Aurora's +1), fixing X = 3 for the turn; the SECOND Aether
    // Flare is the "next" arcane card, so its 2 arcane damage is replaced by
    // 2 + X(=3) = 5. Aether Flare #1 is the only damage Bravo has dealt this
    // turn, so the `damage-dealt` count equals the damage dealt by Aether
    // Flare exactly as printed.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tempestAuroraYellow, aetherFlareYellow, aetherFlareYellow],
        actionPoints: 3,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tempestAuroraYellow);
    game.helpers.resolveUntilIdle();

    // First arcane card: 2 + 1 (Tempest Aurora's one-use literal boost,
    // consumed here) = 3 → Dash 20 − 3 = 17. This damage also fixes the a2
    // count ("damage dealt by Aether Flare" this turn) at 3.
    Bravo.play(aetherFlareYellow, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expect(Dash.life()).toBe(17);

    // Second arcane card — the "next card with an effect that deals arcane
    // damage": 2 + X (X = 3, resolved from a2's count FabAmount at
    // boost-apply time) = 5 → Dash 17 − 5 = 12.
    Bravo.play(aetherFlareYellow, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expect(Dash.life()).toBe(12);
  });

  // ── 6.2.4 — future-object "next …" modifier (Come to Fight) ──────────────

  it("CR 6.2.4 — Come to Fight's +3{p} applies to the next attack action only", () => {
    // CR 6.2.4: a "next …" modifier binds to the first matching object the
    // controller creates afterwards and is consumed by it. Come to Fight grants
    // the next attack-action +3{p}. Observable: Vigor Rush (base 3) → 6, dealt
    // undefended → defender life 20 − 6 = 14.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [comeToFightRed, vigorRushYellow],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(comeToFightRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(vigorRushYellow);
    game.helpers.resolveRestOfCombat();

    // base 3 + 3 (Come to Fight) = 6 → Dash 14.
    expect(Dash.life()).toBe(14);
  });

  // ── 6.2.3d — conditional static evaluated at all times (Luminaris) ────────

  it("CR 6.2.3d — Luminaris grants Illusionist attacks go again while a yellow card is in pitch (conditional static)", () => {
    // CR 6.2.3d: a conditional static ability is evaluated at all times;
    // while its condition is true it applies, and when it becomes false it
    // stops. Luminaris a3: "if there is a yellow card in your pitch zone,
    // your Illusionist attacks get go again."
    //
    // Miraging Metamorph (Illusionist Action Attack, cost 1, power 7) has NO
    // printed go again and no play condition, so the Luminaris a3 grant is the
    // ONLY source of go again — making the AP refund a clean signal for a3.
    //
    // Positive path (condition TRUE): Prism (Illusionist) has Luminaris
    // equipped and a yellow card (Aether Flare yellow) in her pitch zone, then
    // attacks with Miraging Metamorph. a3 grants go again → on chain-link
    // resolution the AP spent on the attack is refunded.
    const gameWithYellow = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        weapon1: [luminaris],
        pitch: [aetherFlareYellow],
        hand: [miragingMetamorphRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const PrismYellow = gameWithYellow.as(prismSculptorOfArcLight);
    PrismYellow.attackWith(miragingMetamorphRed);
    gameWithYellow.helpers.resolveRestOfCombat();
    // Attack cost 1 AP; a3 grants go again → 1 AP refunded on resolution.
    expect(PrismYellow.actionPoints()).toBeGreaterThanOrEqual(1);

    // Negative path (condition FALSE): same board but NO yellow card in pitch.
    // a3's condition is false → no go again → the attack's AP cost is not
    // refunded (AP 0 after attacking).
    const gameNoYellow = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        weapon1: [luminaris],
        hand: [miragingMetamorphRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const PrismNoYellow = gameNoYellow.as(prismSculptorOfArcLight);
    PrismNoYellow.attackWith(miragingMetamorphRed);
    gameNoYellow.helpers.resolveRestOfCombat();
    expect(PrismNoYellow.actionPoints()).toBe(0);
  });

  // ── 6.3.5a — eligibility recomputed after a stage-7 base change (Minnowism)

  it("CR 6.3.5a (positive) — Minnowism grants the next ≤3-base attack-action +3{p}", () => {
    // CR 6.3.5a: a "next … with ≤3 base {p}" modifier's eligibility is checked
    // against the staged base. Positive path: Vigor Rush (base 3 ≤ 3) is
    // eligible → +3{p}. Observable: 3 + 3 = 6, undefended → Dash 14.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [minnowismRed, vigorRushYellow],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(minnowismRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(vigorRushYellow);
    game.helpers.resolveRestOfCombat();

    // base 3 + 3 (Minnowism) = 6 → Dash 14.
    expect(Dash.life()).toBe(14);
  });

  it.fails("CR 6.3.5a (edge) — Minnowism eligibility is recomputed after a stage-7 base reduction", () => {
    // CR 6.3.5a edge: a 6-base attack reduced to ≤3 in stage 7 becomes
    // Minnowism-eligible in stage 8 (+3{p} lands). The harness cannot apply a
    // stage-7 base reduction mid-link, so this spec is left failing.
    //
    // The eligibility-recompute-after-base-change mechanism is proven
    // synthetically in `rules-evaluator.test.ts` ("uses stage-7 base changes
    // when deciding stage-8 eligibility"). Here a 4-base attack (Nimble
    // Strike) is NOT eligible at face value, so Minnowism does NOT apply and
    // the +3 outcome (Dash 13) fails against the real 4-damage outcome.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [minnowismRed, nimbleStrikeRed],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(minnowismRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(nimbleStrikeRed);
    game.helpers.resolveRestOfCombat();
    // Without a stage-7 reduction Nimble Strike (base 4) is NOT eligible;
    // would be Dash 13 (power 7) only if a stage-7 reduction to ≤3 applied.
    expect(Dash.life()).toBe(13);
  });

  // ── 6.3.2a — dependency hoisting / current-vs-base (Thump) ───────────────

  it("CR 6.3.2a (positive) — Thump pumped above its base {p} gains dominate", () => {
    // CR 6.3.2a: a dependent continuous effect (current > base → grant) is
    // resolved after the numeric substage that raises current. Thump: while
    // {p} > base {p}, it gains dominate. Come to Fight raises Thump's {p} above
    // its base 4. Observable (dominate): the defender may not defend with more
    // than one card from hand → a two-card block is rejected.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [comeToFightRed, thumpBlue],
        actionPoints: 2,
        resourcePoints: 5,
        deck: 4,
      },
      { hero: dash, life: 20, hand: [nimbleStrikeRed, nimbleStrikeRed], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(comeToFightRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(thumpBlue);

    // base 4 + 3 (Come to Fight) = 7 > 4 → dominate active. A two-hand-card
    // block must be rejected (defender limited to one card from hand).
    expect(Dash.expectBlockRejected([nimbleStrikeRed, nimbleStrikeRed]).accepted).toBe(false);
  });

  it.fails("CR 6.3.2a (edge) — Thump's dominate is recomputed away when its pump is removed mid-link", () => {
    // CR 6.3.2a edge: dominate is a dependent current>base grant, so it must
    // be recomputed away if the raising pump is removed mid-link. The harness
    // cannot remove a continuous +{p} pump mid-link, so this spec is left
    // failing. The current-versus-base conditional recomputation is proven
    // synthetically in `rules-evaluator.test.ts` ("evaluates current-versus-
    // base conditions in dependent stage 8"). An UNPUMPED Thump (base 4) has
    // current == base → no dominate → a two-card block is allowed; the
    // assertion (block rejected) therefore fails, pinning the untested
    // dynamic crossing of the base boundary.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [thumpBlue],
        actionPoints: 1,
        resourcePoints: 4,
        deck: 4,
      },
      { hero: dash, life: 20, hand: [nimbleStrikeRed, nimbleStrikeRed], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(thumpBlue);

    // Unpumped: current == base → no dominate → two-card block is allowed.
    expect(Dash.expectBlockRejected([nimbleStrikeRed, nimbleStrikeRed]).accepted).toBe(false);
  });

  // ── 6.3.6 — remove ≠ delete another effect's add (Erase Face) ────────────

  it("CR 6.3.6 — Erase Face removes class/talent types from the defender's owned cards", () => {
    // CR 6.3.6: "lose all class and talent types" removes the base
    // class/talent supertypes from the defender's owned cards but does NOT
    // delete a supertype that another continuous effect ADDED (remove ≠
    // delete another effect's add).
    //
    // This spec drives the CR-observable of the hit's remove-property firing
    // end-to-end: after Erase Face hits Dash, a typed card in Dash's hand
    // (Aether Flare yellow, a WIZARD action) must have lost its class type.
    // (The prior `expect(true); throw` form could never flip; this asserts the
    // real desired observable instead.) The stricter remove≠delete retention
    // edge — a type ADDED by ANOTHER effect survives the hit — needs a
    // grant-then-observe setup that is not available in this harness; that
    // distinction is proven synthetically in `rules-evaluator.test.ts`
    // ("removes base properties without deleting another effect's
    // contribution").
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [eraseFaceRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, hand: [aetherFlareYellow], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(eraseFaceRed);
    game.helpers.resolveRestOfCombat();

    // The hit lands (6{p} undefended → Dash 14).
    expect(Dash.life()).toBe(14);

    // CR 6.3.6 desired observable: the defender's owned Wizard card must have
    // lost its class type. Read the effective type box through the rules view.
    const state = game.getState();
    const dashAetherId = Dash.findCardInZone("hand", aetherFlareYellow);
    const view = buildFabRulesView(state);
    const aether = view.object({
      instanceId: dashAetherId,
      incarnation: state.objects[dashAetherId]!.incarnation,
    });
    const box = aether?.current.typeBox;
    const allTypes = [
      ...(box?.metatypes ?? []),
      ...(box?.supertypes ?? []),
      ...(box?.types ?? []),
      ...(box?.subtypes ?? []),
    ];
    expect(allTypes).not.toContain("Wizard");
  });

  // ── 6.3.7 — explicit prevention only; base survives (Hypothermia) ────────

  it("CR 6.3.7 — Hypothermia blocks fresh go-again grants but preserves a base go-again ability", () => {
    // CR 6.3.7: a "can't gain go again" restriction prevents a later continuous
    // grant of the go-again keyword, but it does NOT delete a go-again that is
    // a BASE (printed) keyword of the attack. Hypothermia is seated in the
    // attacker's arena via the fixture; its while-in-arena restricts
    // gain-keyword go-again for attacks that player controls. Head Jab has
    // go again as a PRINTED keyword, so it survives and grants an action point
    // on chain-link resolution.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [hypothermiaBlue],
        hand: [headJabYellow],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(headJabYellow);
    game.helpers.resolveRestOfCombat();

    // The attack cost 1 AP; the surviving base go again grants 1 AP back on
    // resolution → Bravo still has an action point (≥ 1). If Hypothermia had
    // deleted the base keyword, AP would be 0.
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);
  });

  // ── 6.2.5 — first application = event (Talisman of Featherfoot) ──────────

  it("CR 6.2.5 — Talisman of Featherfoot triggers on an exactly-+1{p} application during the reaction step", () => {
    // CR 6.2.5: a "when an attack gains exactly +1{p} from an effect during
    // the reaction step" trigger keys on a single +1 APPLICATION (an event):
    // it destroys Talisman of Featherfoot and the attack gains go again.
    //
    // Positive path: attack with Vigor Rush, then in the reaction step play
    // Fang Strike (an attack reaction that grants the target attack action
    // exactly +1{p}). Two CR observables follow: the +1 lands (Vigor Rush
    // 3 + 1 = 4 damage → Dash 16) AND the Talisman self-destroys (leaves the
    // arena).
    //
    // The "net +1 from a stacked (−1 then +2) application does NOT trigger"
    // half of 6.2.5 needs a stacked reaction-step multi-mod that is undrivable
    // in this harness; it is covered synthetically by the staged numeric-
    // trigger evaluator in `rules-evaluator.test.ts`.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfFeatherfootYellow],
        hand: [vigorRushYellow, fangStrike],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(vigorRushYellow);
    // Advance past Defend (defender declares no blocks) into the Reaction step.
    game.advanceCombatTo("reaction");
    // Reaction-step +1{p} application to the attack action.
    Bravo.play(fangStrike);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // +1 reaction landed: Vigor Rush base 3 + 1 = 4 → Dash 16.
    expect(Dash.life()).toBe(16);
    // CR 6.2.5: the exactly-+1 reaction-step application destroys the Talisman
    // (it leaves the arena) and the attack gains go again.
    expect(Bravo.zone("arena")).not.toContain(talismanOfFeatherfootYellow.canonicalId);
  });

  // ── 6.2.5a — turn-player orders simultaneous applications (Flourish) ─────

  it("CR 6.2.5a — Flourish substitutes the next attack's first {p} gain (gain + 3)", () => {
    // CR 6.2.5a: a "next time an attack would gain {p}, instead it gains that
    // much plus 3" replacement (Flourish) substitutes the FIRST {p} gain.
    //
    // This spec drives the SINGLE-gain positive premise the prior `it.fails`
    // omitted: play Flourish, then grant an attack a +{p} gain via Come to
    // Fight (next attack-action +3{p}), then attack with Vigor Rush. Flourish
    // turns that +3 gain into "+3 plus 3" = +6, so Vigor Rush (base 3) deals
    // 3 + 6 = 9 → Dash 11.
    //
    // Note: for a single +3 gain, damage cannot distinguish a true replacement
    // (+3 → +6) from a stacked add (+3 + Flourish's +3 = +6); both yield 9.
    // So this green observable confirms the +3 substitution LANDS, while the
    // simultaneous-ordering sub-edge (turn player orders several simultaneous
    // +{p} applications and Flourish substitutes one of them) — which IS
    // ordering-sensitive — stays proven synthetically in
    // `rules-evaluator.test.ts` ("persists turn-player order for equal
    // timestamp atoms" / "commutes equal-timestamp pure add continuous
    // effects", ~L312/L332).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flourish, comeToFightRed, vigorRushYellow],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(flourish);
    game.helpers.resolveUntilIdle();
    Bravo.play(comeToFightRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(vigorRushYellow);
    game.helpers.resolveRestOfCombat();

    // base 3 + (Come to Fight +3 substituted by Flourish into +3 plus 3 = +6)
    // = 9 → Dash 11.
    expect(Dash.life()).toBe(11);
  });
});
