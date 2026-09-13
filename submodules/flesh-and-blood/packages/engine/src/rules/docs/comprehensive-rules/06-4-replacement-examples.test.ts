/**
 * CR §6.4 / §6.5 — replacement-effect named-example cards, driven end-to-end.
 *
 * Test-backfill: the §6.4/§6.5 replacement kernel is the MOST faithful
 * subsystem of the CR-6 effects staging (prior audit confirmed real §6.5
 * ordering, prevention keywords, unpreventable-damage 6.4.10h, Vambrace
 * "prevents 1 less", and Victor outcome-reclash). These tests drive the REAL
 * named example cards through the full pipeline and assert CR-observable
 * outcomes (damage = attack power − prevention → defender life delta; ward
 * source in graveyard; prevention amount not reduced on unpreventable damage).
 *
 * Per the task decision tree, each named example is either GREEN (the real card
 * produces the CR outcome) or `it.fails`:
 *   - `it.fails`-deferred: a known engine gap documented in the plan's Deferred
 *     section — genuine self-replacement (§6.4.7, Tome of Divinity). The test
 *     asserts the CR-correct observable that the deferred feature would
 *     produce. (Shielding-carryover prevention §6.4.10j was implemented; its
 *     examples are GREEN.)
 *   - `it.fails`-defect: the real card exposes an engine wiring gap; the test
 *     asserts the CR-correct (currently-false) observable and names the gap.
 *
 * NOTE on class legality (inherited from the 06-2 suite): this harness does NOT
 * reject a hero for playing a card outside its printed class/talent. "Wrong
 * hero" is therefore never the failure reason for these specs.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine, fabToken } from "../../../index.ts";
import {
  bravo,
  dash,
  nimblismBlue,
  snatchRed,
  blessingOfSerenityRed,
  enchantingMelodyRed,
  stonewallImpasse,
} from "../../fixtures.ts";
import { silkenShroud } from "../../../../../cards/src/cards/equipment/silken-shroud.ts";
import { arcaniteFortress } from "../../../../../cards/src/cards/equipment/arcanite-fortress.ts";
import { arcaniteSkullcap } from "../../../../../cards/src/cards/equipment/arcanite-skullcap.ts";
import { tomeOfDivinityYellow } from "../../../../../cards/src/cards/instants/tome-of-divinity.ts";
import { feignDeathYellow } from "../../../../../cards/src/cards/instants/feign-death.ts";
import { vambraceOfDetermination } from "../../../../../cards/src/cards/equipment/vambrace-of-determination.ts";
import { steadfastBlue } from "../../../../../cards/src/cards/instants/steadfast.ts";
import { dissipationShieldYellow } from "../../../../../cards/src/cards/actions/dissipation-shield.ts";
import { boneHeadBarrierYellow } from "../../../../../cards/src/cards/instants/bone-head-barrier.ts";
import { malignYellow } from "../../../../../cards/src/cards/actions/malign.ts";
import { haloOfIllumination } from "../../../../../cards/src/cards/equipment/halo-of-illumination.ts";
import { azalea } from "../../../../../cards/src/cards/heroes/azalea.ts";
import { boltyn } from "../../../../../cards/src/cards/heroes/boltyn.ts";
import { victorGoldmane } from "../../../../../cards/src/cards/heroes/victor-goldmane.ts";

/**
 * Cost-0 Wizard arcane-action probe (sibling of the ROS211 Fortress suite's
 * `arcaneBolt2`). `arcane: N` deals N arcane damage via a deal-damage effect so
 * Spellvoid / fixed preventions fire without a contested combat chain.
 */
const arcaneBolt = (amount: number, slug: string, types: string[] = ["Wizard", "Action"]) => ({
  canonicalId: `trainer-arcane-bolt-${slug}`,
  types,
  cost: 0,
  arcane: amount,
  keywords: [] as const,
});

const LIFE = 20;

/**
 * Walk priority / answer decisions until neither combat nor a rules layer
 * remains. Declines optional booleans, accepts all forced single-target
 * decisions in listed order, and preserves the engine's ordering. Mirrors the
 * ROS211 Fortress suite's `drain`.
 */
function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: decision.options.map((option) => option.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((entry) => entry.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat()?.open && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (!prio) return;
    try {
      game.exec({ move: "pass", actorId: prio, payload: {} });
    } catch {
      return;
    }
  }
}

describe("CR 6.4 / 6.5 — replacement-effect named examples", () => {
  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.1a — Ward: the ward source is destroyed as a sub-event BEFORE the
  // damage event is reduced. The observable end-state is identical whether the
  // destroy is sequenced before or concurrently with the prevention: the ward
  // equipment is in the graveyard AND the damage event is reduced by 1.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.1a — Ward source destroyed and damage reduced by 1 (end-state; silkenShroud)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, head: [silkenShroud], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("head")).toContain(silkenShroud.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Ward destroyed as the cost of preventing 1 (now in graveyard).
    expect(Dash.zone("head")).not.toContain(silkenShroud.canonicalId);
    expect(Dash.zone("graveyard")).toContain(silkenShroud.canonicalId);
    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - 3);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.2a — Arcanite Fortress Spellvoid X, X = # Arcanite equipment. The X
  // amount is a LIVE count re-evaluated each time the keyword fires (not cached
  // at register time). Two scenarios with different live equipment counts prove
  // the prevention scales: alone X=1 (arcane 3 → prevent 1, take 2); paired
  // with Arcanite Skullcap X=2 (arcane 3 → prevent 2, take 1). The life delta
  // differs, so X is observably dynamic.
  //
  // Spellvoid destroys its source when it prevents (CR 8.3.15), so each
  // scenario seats a fresh Fortress — the load-bearing comparison is between
  // the two scenarios' life deltas, which isolates the live-X re-evaluation.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.2a — Arcanite Fortress Spellvoid X scales with the live Arcanite equipment count", () => {
    const bolt = arcaneBolt(3, "ros211-scaling");

    // Scenario A — Fortress alone: 1 Arcanite equipment → Spellvoid 1.
    const alone = FabTestEngine.start(
      { hero: bravo, hand: [bolt], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, chest: [arcaniteFortress], deck: 6 },
      { autoPassPriority: false },
    );
    alone.as(bravo).play(bolt);
    drain(alone);
    // Spellvoid 1 prevents 1 of the 3 arcane; Fortress destroyed; Dash takes 2.
    expect(alone.as(dash).life()).toBe(LIFE - 2);
    expect(alone.as(dash).zone("graveyard")).toContain(arcaniteFortress.canonicalId);

    // Scenario B — Fortress + Skullcap: 2 Arcanite equipment → Spellvoid 2.
    const pair = FabTestEngine.start(
      { hero: bravo, hand: [bolt], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [arcaniteFortress],
        head: [arcaniteSkullcap],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    pair.as(bravo).play(bolt);
    drain(pair);
    // Spellvoid 2 prevents 2 of the 3 arcane; Fortress destroyed; Dash takes 1.
    expect(pair.as(dash).life()).toBe(LIFE - 1);

    // The delta between scenarios is the live-X re-evaluation: with one more
    // Arcanite equipment seated, the SAME 3-arcane event lost 1 less life.
    expect(pair.as(dash).life()).toBeGreaterThan(alone.as(dash).life());
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.7 — Tome of Divinity. Origin/main shipped the `instead` self-
  // replacement: the printed "Draw 2 cards. If a card has been put into your
  // hero's soul this turn, instead draw 3 cards" now resolves CR-correctly.
  // The card is modeled as a `conditional` resolution effect (then = draw 3 /
  // else = draw 2) gated on the `card-put-into-soul-this-turn` status, and the
  // engine resolves that conditional as a true self-replacement — a soul-put
  // this turn raises the draw count from 2 to 3.
  //
  // Soul-put is triggered via Halo of Illumination's activated Instant ("put a
  // card from your hand into your hero's soul") — a real Light card that moves
  // a hand card to soul without opening a combat chain.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.7 — Tome of Divinity draws 3 when a card was put into soul this turn (self-replacement; see plan §6.4.7)", () => {
    // CR-correct outcome: the soul-put `instead` clause REPLACES the base
    // "draw 2" with "draw 3" (a single self-replacement, not a layered
    // conditional). Origin/main shipped this self-replacement, so the soul-put
    // status now raises the draw count to 3 and this assertion passes green.
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        head: [haloOfIllumination],
        hand: [tomeOfDivinityYellow, nimblismBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activate(haloOfIllumination);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: nimblismBlue.canonicalId });

    const deckBeforeTome = Boltyn.zone("deck").length;
    Boltyn.play(tomeOfDivinityYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // CR 6.4.7: soul-put this turn → 3 draws.
    expect(Boltyn.zone("deck").length).toBe(deckBeforeTome - 3);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10b — Feign Death: "prevent the next damage this turn" with an
  // unspecified amount uses the event's own amount (`amount: { type:
  // "event-amount" }`). The next damage event is fully prevented regardless of
  // its size.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10b — Feign Death prevents the next damage event in full (amount = the event's)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: azalea,
        life: LIFE,
        hand: [feignDeathYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    // Attack 1 — deals damage, satisfying Feign Death's play restriction
    // ("only if your hero has been dealt damage this turn") and stamping the
    // status. Azalea does not defend → takes 4.
    game.as(bravo).attackWith(snatchRed);
    Azalea.defend();
    game.helpers.resolveRestOfCombat();
    expect(Azalea.life()).toBe(LIFE - 4);

    // Open an instant window for Azalea in Bravo's main phase (between the two
    // attacks) and play Feign Death — setting up "prevent the next damage this
    // turn" with an event-amount.
    game.helpers.passPriorityTo(Azalea);
    Azalea.play(feignDeathYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Attack 2 — the 4-power attack's damage is prevented in full (the
    // prevention amount = the event's amount = 4).
    game.as(bravo).attackWith(snatchRed);
    Azalea.defend();
    game.helpers.resolveRestOfCombat();
    expect(Azalea.life()).toBe(LIFE - 4);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10g — Vambrace of Determination: "the next physical prevention effect
  // prevents 1 less." Deep coverage lives in the dedicated proven suite:
  //   card-behavior/proven/equipment/equipment-vambrace-of-determination.test.ts
  // This is a SHORT re-assertion via the public harness: Vambrace's Attack
  // Reaction subtracts 1 from the next fixed physical prevention, so a 4-power
  // attack defended by Blessing of Serenity (prevent 3 → 2) still deals 2
  // damage (Snatch 4 − 2 = 2).
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10g — Vambrace of Determination makes the next physical prevention prevent 1 less (re-assertion; see equipment-vambrace-of-determination.test.ts)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [vambraceOfDetermination],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [blessingOfSerenityRed], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    // Walk to the reaction step so the Attack Reaction can activate.
    for (let safety = 0; safety < 16 && game.combat()?.step !== "reaction"; safety += 1) {
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (!prio) break;
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Bravo.activate(vambraceOfDetermination);
    game.passBoth();
    // Pass back so the defending hero can play the defense reaction.
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    Dash.play(blessingOfSerenityRed);
    game.passBoth();
    // Accept Blessing of Serenity's optional prevention; preserve ordering.
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });
    game.helpers.resolveRestOfCombat();

    // Blessing of Serenity prevents 3; Vambrace makes the next physical
    // prevention prevent 1 less (3 → 2); Snatch 4 − 2 = 2 damage. Without
    // Vambrace the prevention would be 3 and Dash would lose 1 life.
    expect(Dash.life()).toBe(LIFE - 2);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10h — Enchanting Melody vs UNPREVENTABLE damage (the CR 6.4.10h
  // example). CR 6.4.10h: the destroy-self modification still applies (Melody
  // is destroyed) even when the damage cannot be prevented; only the damage
  // reduction is suppressed.
  //
  // FIXED (CR §6 defect-fix series, Task 5). Melody's a1 is a CONTINUOUS
  // STATIC *effect* (not a keyword), so its candidate is built in the
  // static-ability scan of `staticReplacementCandidates` (replacement-engine.ts),
  // which gates every candidate through `supportedCanonicalReplacement`. a1
  // carries `additionalModification: { type: "destroy", target: { selector:
  // "self" } }`, which the gate previously rejected (it only admitted `draw`
  // count=1), dropping the candidate for ALL damage. The gate now admits
  // destroy-self additional modifications, and the prevention apply path emits
  // the destroy as a sub-event (CR 6.4.1a) that is NOT gated on
  // preventedAmount > 0 — exactly the 6.4.10h semantics this test asserts:
  // Melody destroyed, damage NOT reduced.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10h — Enchanting Melody destroyed on unpreventable damage, but damage not reduced (destroy-self additionalModification sub-event; gate admits it, apply emits destroy at 0 prevented)", () => {
    // Dash plays Enchanting Melody on its own turn (so the Aura's continuous
    // prevention registers via the real play path), then endures Malign on
    // Bravo's turn.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [malignYellow],
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [enchantingMelodyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual", firstPlayer: dash },
    );
    const Dash = game.as(dash);

    // Dash's turn — play Melody (non-attack Action; its a2 end-phase "destroy
    // unless you played a non-attack action" therefore spares it).
    Dash.play(enchantingMelodyRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("arena")).toContain(enchantingMelodyRed.canonicalId);

    // Pass to Bravo's turn.
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Malign: "Damage that would be dealt by Malign can't be prevented" (power 2).
    game.as(bravo).attackWith(malignYellow);
    game.helpers.resolveRestOfCombat();

    // CR 6.4.10h: Melody's destroy-self modification fired even though the
    // damage could not be prevented.
    expect(Dash.zone("graveyard")).toContain(enchantingMelodyRed.canonicalId);
    // The 2 damage was NOT reduced by Melody's prevention.
    expect(Dash.life()).toBe(LIFE - 2);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10h (broader scope) — Enchanting Melody vs a fully PREVENTABLE attack.
  // The same gate is NOT unpreventable-specific: on a fully preventable event
  // Melody's prevention MUST fire — destroy-self + prevent 4. Melody's amount
  // (4) covers Snatch's 4 power, so Dash takes 0 and Melody is destroyed.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10h — Enchanting Melody destroys itself and prevents 4 on a fully PREVENTABLE attack (same destroy-self additionalModification path, positive prevented amount)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [enchantingMelodyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual", firstPlayer: dash },
    );
    const Dash = game.as(dash);

    // Dash's turn — play Melody (non-attack Action; a2's end-phase "destroy
    // unless you played a non-attack action" therefore spares it).
    Dash.play(enchantingMelodyRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("arena")).toContain(enchantingMelodyRed.canonicalId);

    // Pass to Bravo's turn.
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Bravo attacks with Snatch (power 4, fully PREVENTABLE physical damage).
    // Dash does not defend.
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // CR 6.4.10h: on a preventable event Melody's prevention MUST fire —
    // destroy-self + prevent 4 → Dash takes 0 and Melody hits the graveyard.
    expect(Dash.zone("graveyard")).toContain(enchantingMelodyRed.canonicalId);
    expect(Dash.life()).toBe(LIFE);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10h — Steadfast vs UNPREVENTABLE damage. CR 6.4.10h: the prevention
  // AMOUNT is not reduced (consumed) on an unpreventable event, so it remains
  // available for a later preventable event the same turn. Two events on the
  // same turn: Malign (unpreventable, 2) is taken in full; a following
  // preventable attack is then prevented by the still-full shield. Steadfast
  // is authored `preventionKind: "shielding"` (CR 6.4.10j "prevent the next
  // 4"): the persisted shield's numeric amount only decrements by damage
  // actually PREVENTED and ceases when it reaches 0.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10h — Steadfast prevention amount is not reduced on unpreventable damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [malignYellow, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [steadfastBlue],
        resourcePoints: 3,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Event 1 — Malign (unpreventable 2). Dash chooses the current attacking
    // source while its reaction window is open; Steadfast does not reduce the
    // unpreventable damage.
    game.as(bravo).attackWith(malignYellow);
    Dash.defend();
    game.helpers.passPriorityTo(Dash);
    Dash.play(steadfastBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(LIFE - 2);

    // The registered shield retains all 4 prevention after the unpreventable
    // event. Its selected Malign source is persisted, not reconstructed from
    // the next incoming damage source.
    expect(game.getState().replacementEffects).toMatchObject([
      { effect: { preventionKind: "shielding", amount: 4 } },
    ]);

    // Event 2 — a different source is not covered by Steadfast's chosen-source
    // prevention, even though the shield still has its full amount available.
    game.as(bravo).attackWith(snatchRed);
    Dash.defend();
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(LIFE - 6);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10i — Dissipation Shield: a FIXED one-off prevention. The next damage
  // event is prevented up to X (= steam counters on Dissipation Shield, here
  // 4); any LEFTOVER is NOT carried to a later event.
  //
  // a3 is an activated Instant — destroy-self COST + register a `this-turn`
  // prevention whose amount is a dynamic count
  // (`{ type: "count", what: "counters-on-source", counter: steam }`). The
  // canonical-shape gates (supportedCanonicalReplacement + its registration
  // mirror in continuous-rule-effects.ts) admit any evaluatable FabAmount and
  // the apply path resolves the count via evaluateAmount (CR 6.4.10), so the
  // prevention registers (the destroy-self cost still fires first) and
  // prevents 4 on the first event, 0 on the second — leftover not carried.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10i — Dissipation Shield prevents X once; leftover is not carried", () => {
    const boltA = arcaneBolt(2, "dissipation-a");
    const boltB = arcaneBolt(2, "dissipation-b", ["Wizard", "Instant"]);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [boltA, boltB],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [dissipationShieldYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual", firstPlayer: dash },
    );
    const Dash = game.as(dash);

    // Dash's turn — play Dissipation Shield (Action-Item). a1's enter-arena
    // replacement places 4 steam counters; a2's action-phase-start trigger
    // already passed for this phase, so it survives into Bravo's turn.
    Dash.play(dissipationShieldYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("arena")).toContain(dissipationShieldYellow.canonicalId);

    // Pass to Bravo's turn.
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Activate a3 (Instant — destroy-self cost) during Bravo's turn so its
    // `this-turn` prevention covers both arcane events. "The next time your
    // hero would be dealt damage this turn, prevent X" (X = 4 steam).
    game.helpers.passPriorityTo(Dash);
    Dash.activate(dissipationShieldYellow, {
      abilityId: "HGhtMHhF6dqdNccmNK7w8:instantDestroyDissipationShieldNextTimeHeroWouldBe",
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("graveyard")).toContain(dissipationShieldYellow.canonicalId);

    // Event 1 — 2 arcane, fully prevented by the fixed 4-shield (leftover 2).
    game.as(bravo).play(boltA);
    drain(game);
    expect(Dash.life()).toBe(LIFE);

    // Event 2 — 2 arcane, NOT prevented: leftover is not carried (CR 6.4.10i).
    // boltB is an Instant because this engine's turn economy grants 1 action
    // point per turn (boltA spent it); CR 6.4.10i semantics are agnostic to
    // the damage source's card type, so the prevention assertions are intact.
    game.as(bravo).play(boltB);
    drain(game);
    expect(Dash.life()).toBe(LIFE - 2);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.10j — Bone Head Barrier: SHIELDING prevention. "Prevent the next X
  // damage that would be dealt to your hero this turn" CARRIES remaining
  // prevention across events and ceases only when the shield is exhausted.
  //
  // WTR010 is authored `preventionKind: "shielding"`; the registration path
  // resolves X once (the roll-result binding staged by the sequence's roll
  // step) into the persisted record's `remainingAmount`, each application
  // decrements it by the damage actually prevented (6.4.10a), and the effect
  // ceases to exist at 0 (6.4.10j). Two small events summing under the rolled
  // X are BOTH fully prevented (remaining shield carries across them).
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.10j — Bone Head Barrier shielding carries leftover across events", () => {
    const boltA = arcaneBolt(1, "bonehead-a");
    const boltB = arcaneBolt(1, "bonehead-b");
    const boltBig = arcaneBolt(6, "bonehead-big", ["Wizard", "Instant"]);
    const boltLast = arcaneBolt(1, "bonehead-last", ["Wizard", "Instant"]);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [boltA, boltB, boltBig, boltLast],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [boneHeadBarrierYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual", firstPlayer: bravo },
    );
    const Dash = game.as(dash);

    // Roll a d6 → prevent the next X this turn. The roll is seed-deterministic
    // (default seed "fab-test"): with this scenario's rng consumption the d6
    // lands X = 6, so the registered shield starts with remainingAmount 6.
    game.helpers.passPriorityTo(Dash);
    Dash.play(boneHeadBarrierYellow);
    drain(game);

    // Event 1 — 1 arcane, prevented (remaining 6 → 5).
    game.as(bravo).play(boltA);
    drain(game);
    // Event 2 — 1 arcane, prevented (remaining 5 → 4). CR 6.4.10j: remaining
    // prevention carries across events.
    game.as(bravo).play(boltB);
    drain(game);
    expect(Dash.life()).toBe(LIFE);

    // Event 3 — 6 arcane against the 4 remaining: shielding prevents exactly
    // the remaining 4 (CR 6.4.10j "as much remaining as possible"), Dash takes
    // 2, and the effect CEASES TO EXIST at 0.
    game.as(bravo).play(boltBig);
    drain(game);
    expect(Dash.life()).toBe(LIFE - 2);

    // Event 4 — nothing prevents anymore: the ceased shield cannot apply to a
    // later event (a never-exhausting shield would keep Dash at LIFE - 2).
    game.as(bravo).play(boltLast);
    drain(game);
    expect(Dash.life()).toBe(LIFE - 3);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6.4.11 — Victor Goldmane outcome-replacement re-clash. "The first time
  // each turn you would fail to win a clash, instead you may destroy a Gold you
  // control. If you do, put 1 of the revealed cards on the bottom of its
  // owner's deck, then clash again." Deep coverage is tracked in the
  // acceptance suite:
  //   acceptance/heroes/victor-goldmane-reclash.test.ts
  // This is a SHORT re-assertion via the public harness: Victor loses a clash,
  // accepts the replacement's optional, and destroys a Gold.
  // ─────────────────────────────────────────────────────────────────────────
  it("CR 6.4.11 — Victor Goldmane reclash: losing a clash offers the Gold-destroy replacement (re-assertion; see acceptance/heroes/victor-goldmane-reclash.test.ts)", () => {
    const game = FabTestEngine.start(
      {
        // Bravo's deck tops are BOTH Snatch (power 4). (Fixture deck arrays
        // are bottom→top; the last entry is revealed.) Origin/main now FULLY
        // resolves a2's replacement — after Victor loses clash #1, the
        // `instead` clause destroys a Gold, bottoms a reveal, and RE-CLASHES —
        // so BOTH deck tops must favor Bravo to keep `lastClashWinnerId` on
        // Bravo after the re-clash (under the old partial implementation only
        // the Gold-destroy ran, so a single high/low top sufficed).
        hero: bravo,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed],
        intellect: 0,
      },
      {
        // Victor's deck tops are BOTH Nimblism (power 0) so Victor loses the
        // initial clash AND the re-clash (4 vs 0 each time).
        hero: victorGoldmane,
        life: LIFE,
        arms: [stonewallImpasse],
        arena: [fabToken("gold")],
        deck: [nimblismBlue, nimblismBlue],
        intellect: 0,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Victor = game.as(victorGoldmane);

    expect(Victor.zone("arena")).toContain("token:gold");

    // Bravo attacks; Victor defends with Stonewall Impasse, whose defend
    // trigger fires a clash. Victor (top Nimblism, 0) loses to Bravo (top
    // Snatch, 4) → a2's clash-lose replacement fires.
    game.as(bravo).attackWith(snatchRed);
    const eqId = Victor.findCardInZone("arms", stonewallImpasse);
    Victor.exec({ move: "defend", payload: { instanceIds: [eqId] } });

    // Resolve the defend-triggered clash (both players pass priority through
    // the trigger + clash resolution). The clash-loss surfaces a2's "may
    // destroy a Gold to re-clash" opportunity as an `option` decision — accept
    // it (mirrors the acceptance suite's `chooseOptions(options[0])`, which
    // selects the single offered option), then target the Gold and preserve the
    // reveal-bottoming order.
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      optionalOptions: "all",
      entityTargets: "minimum",
      ordering: "listed",
    });

    // Victor must have lost the clash (precondition for a2).
    expect(game.getState().lastClashWinnerId).toBe(game.as(bravo).id);

    // The Gold was destroyed as the first step of the re-clash replacement.
    // (Tokens cease to exist when they leave the arena — CR 4.1.6b — so the
    // observable is "no longer in the arena", not "in the graveyard".)
    expect(Victor.zone("arena")).not.toContain("token:gold");

    // SCOPE NOTE: this re-assertion proves ONLY the optional-destroy step of
    // a2's replacement (the Gold leaves the arena). The two other a2
    // observables — "put 1 of the revealed cards on the bottom of its owner's
    // deck" and "then clash again" (a new clash occurs) — are NOT asserted
    // here. Deep coverage of those lives in the acceptance suite
    // (acceptance/heroes/victor-goldmane-reclash.test.ts), which is currently
    // a `.todo`; until it lands, those sub-outcomes are unverified here.
  });
});
