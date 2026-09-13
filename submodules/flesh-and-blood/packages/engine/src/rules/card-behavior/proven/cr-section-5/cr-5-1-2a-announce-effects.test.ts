/**
 * CR 5.1.2a — continuous effects apply the instant a card is announced.
 *
 * The CR 5.1.2a example has three continuous effects active at once:
 *  (a) "The next attack action card you play gains +3{p}"
 *  (b) "Action cards cost {r} less to play"
 *  (c) "Attack action cards you control have +3{p}"
 * All three begin to apply the moment an attack action card is announced
 * (moved to the stack), before the Layer Step resolves.
 *
 * Each trainer aura below mirrors a real catalog card's authoring shape — no
 * new engine vocabulary is invented:
 *  (a) static-continuous + `appliesTo.next` future-applicator — mirrors Tiger
 *      Stripe Shuko (UPR158) / Goliath Gauntlet (BVO006).
 *  (b) `property: "cost"` `op: "subtract"` play-cost reduction latched at
 *      announce — mirrors Blood of the Dracai (UPR000) / Bonds of Ancestry
 *      (OUT057).
 *  (c) static-continuous +power over Attack-Action objects on the
 *      stack/combat-chain — mirrors Seismic Shelter (MPG023) / Daily Grind
 *      (MPG022).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";

// (a) "The next attack action card you play gains +3{p}."
// Shape mirrors Tiger Stripe Shuko (UPR158-a2): a `staticKind: "continuous"`
// ability whose modify-numeric effect carries an `appliesTo.next` future
// applicator that latches at the announce-card event.
const nextAttackPowerGrant = defineFleshAndBloodCard({
  canonicalId: "trainer-cr512a-next-atk-pow",
  slug: "trainer-cr512a-next-atk-pow",
  types: ["Generic", "Action", "Aura"],
  cost: 0,
  abilities: [
    {
      id: "trainer-cr512a-next-atk-pow-a1",
      kind: "static",
      staticKind: "continuous",
      text: "The next attack action card you play gains +3{p}.",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  ],
});

// (b) "Action cards cost {r} less to play."
// Shape mirrors Blood of the Dracai (UPR000-a1): a `property: "cost"`
// `op: "subtract"` modify-numeric effect with an `appliesTo.next`
// future-applicator, which (per continuous/reconciler.ts announce-card
// latching + legality-quotes.ts:585) reduces the cost quoted at announce.
const actionCostReduction = defineFleshAndBloodCard({
  canonicalId: "trainer-cr512a-action-cost",
  slug: "trainer-cr512a-action-cost",
  types: ["Generic", "Action", "Aura"],
  cost: 0,
  abilities: [
    {
      id: "trainer-cr512a-action-cost-a1",
      kind: "static",
      staticKind: "continuous",
      text: "Action cards cost {r} less to play.",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 99,
        },
      },
    },
  ],
});

// (c) "Attack action cards you control have +3{p}."
// Shape mirrors Seismic Shelter (MPG023-a1) / Daily Grind (MPG022-a2): a
// static-continuous modify-numeric effect with an `object` target over the
// stack + combat-chain zones, filtered to Attack-Action cards the controller
// owns. It applies as soon as the announced attack enters the stack.
const attackActionPowerGrant = defineFleshAndBloodCard({
  canonicalId: "trainer-cr512a-atk-action-pow",
  slug: "trainer-cr512a-atk-action-pow",
  types: ["Generic", "Action", "Aura"],
  cost: 0,
  abilities: [
    {
      id: "trainer-cr512a-atk-action-pow-a1",
      kind: "static",
      staticKind: "continuous",
      text: "Attack action cards you control have +3{p}.",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: { type: "any-number" },
        },
        duration: "while-in-arena",
      },
    },
  ],
});

describe("CR 5.1.2a — three continuous effects apply the instant a card is announced", () => {
  it("next-card +p, action-card cost reduction, and static +p all show on the announced attack before the Layer resolves", () => {
    // brutalAssaultRed: printed cost 2, printed power 6.
    // Arrange all three continuous effects active in the arena simultaneously.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [nextAttackPowerGrant, actionCostReduction, attackActionPowerGrant],
        hand: [brutalAssaultRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      // Drive priority/pitch by hand so the announce step is observable.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Announce the attack action card → it lands on the stack as a card layer.
    Bravo.play(brutalAssaultRed, { target: Dash.id });

    // The card layer is on the stack; combat is open at the Layer Step, before
    // the layer resolves and before any priority pass.
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    expect(game.combat()?.step).toBe("layer");

    // (b) Cost reduction applied at announce: printed cost 2 − 1 = 1 paid,
    // so 3 resource points − 1 = 2 remain. (Mirrors the 5.1 pitch-test pattern.)
    expect(Bravo.resourcePoints()).toBe(2);

    // (a) + (c) Power grants applied at announce. With the card still on the
    // stack, neither combat active link nor damage exists yet — so read the
    // continuous-effect applications that target the announced object. Two
    // distinct +3 power contributions (one from the next-card grant, one from
    // the attack-actions-you-control grant) must already be present, chaining
    // printed 6 → 9 → 12.
    const announcedId = Bravo.findCardInZone("stack", brutalAssaultRed);
    const powerApps = game.getState().continuousEffectInstances.flatMap((inst) =>
      inst.applications
        .filter((a) => a.subject.kind === "object" && a.subject.ref.instanceId === announcedId)
        .flatMap((a) => {
          if (a.contribution.kind !== "numeric" || a.contribution.property !== "power") {
            return [];
          }
          return [{ delta: a.contribution.delta ?? 0, value: a.contribution.value ?? 0 }];
        }),
    );
    expect(powerApps).toHaveLength(2);
    expect(powerApps.reduce((sum, a) => sum + a.delta, 0)).toBe(6);
    // The applications chain 6 → 9 → 12; the largest reported value is the
    // announce-time effective power.
    expect(Math.max(...powerApps.map((a) => a.value))).toBe(12);

    // Resolve to confirm the announce-time grants carry through to damage:
    // 12 power, undefended → 12 damage.
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(20 - 12);
  });
});
