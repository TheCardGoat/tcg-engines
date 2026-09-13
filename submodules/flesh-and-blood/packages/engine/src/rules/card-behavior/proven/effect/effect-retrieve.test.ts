/**
 * CR 8.5.51 Retrieve (effect keyword): pay {cost} then equip the target. If the
 * target cannot be equipped, the effect fails (8.5.51a) and no payment is
 * produced. Composes proposePay + proposeEquip.
 *
 * NOTE: this is the Retrieve *effect keyword* (`type: "retrieve"`), distinct
 * from the Retrieve *label keyword* used by graveyard→hand `move-card` cards.
 * No catalog card currently emits `type: "retrieve"`, so this exercises the
 * proposer directly via a synthetic attack that retrieves on hit — forward
 * coverage for the first consuming card.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("effect: retrieve (CR 8.5.51)", () => {
  it("pays a resource to equip a weapon from the graveyard on hit", () => {
    const retrieveAttack = hitTrainer({
      slug: "fx-retrieve-probe",
      power: 4,
      effect: {
        type: "retrieve",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          filter: { typeBox: { types: ["Weapon"] } },
          count: 1,
        },
        cost: { class: "asset", type: "resources", amount: 1 },
        zone: "weapon",
      },
    });

    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [retrieveAttack],
        graveyard: [dawnblade],
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Attack hits (Dash does not block) → the on-hit retrieve fires.
    Bravo.attackWith(retrieveAttack);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.51: paid 1 resource and equipped the graveyard weapon. The equip
    // came from the graveyard (the pre-fix reviewer risk was that an equip-probe
    // would reject a graveyard source zone — verified here not to).
    expect(Bravo.zone("weapon1")).toContain(dawnblade.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(dawnblade.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
  });

  it("8.5.51a: produces no payment when no equippable target is in the graveyard", () => {
    const retrieveAttack = hitTrainer({
      slug: "fx-retrieve-empty",
      power: 4,
      effect: {
        type: "retrieve",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          filter: { typeBox: { types: ["Weapon"] } },
          count: 1,
        },
        cost: { class: "asset", type: "resources", amount: 1 },
        zone: "weapon",
      },
    });

    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [retrieveAttack],
        // No weapon in the graveyard → retrieve target is unresolved.
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(retrieveAttack);
    // CR 8.5.51a: with no equippable target, the retrieve effect cannot resolve,
    // so the resolving layer is rejected (an unresolved leaf effect blocks the
    // layer). Crucially this fires BEFORE payment, so no resources are spent.
    expect(() => game.helpers.resolveRestOfCombat()).toThrow(/retrieve target does not exist/);
    expect(Bravo.zone("weapon1")).not.toContain(dawnblade.canonicalId);
  });
});
