/**
 * DTD164 Levia, Redeemed — demi-hero acceptance.
 *
 * a1: Action — Turn ALL cards in your banished zone face-down: Transform into
 *     Levia, Redeemed. Activate this ability only while this is in your
 *     inventory and you have 13 or more cards with blood debt in your
 *     banished zone.
 *
 * a2: Continuous — Cards you own lose blood debt.
 *     remove-property keyword:blood-debt, targeting all zones.
 */
import { describe, expect, it } from "vitest";
import { listLegalCommands } from "../../rules/legal-commands/index.ts";

import { expectFabCard, FabTestEngine, buildFabRulesView } from "../../index.ts";
import { bravo } from "../../rules/fixtures.ts";
import { levia } from "../../../../cards/src/cards/heroes/levia.ts";
import { leviaRedeemed } from "../../../../cards/src/cards/demi-heroes/levia-redeemed.ts";
import { dabbleInDarknessRed } from "../../../../cards/src/cards/actions/dabble-in-darkness.ts";

describe("Levia, Redeemed demi-hero (DTD164)", () => {
  it("a1: transforms from inventory into hero zone", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        inventory: [leviaRedeemed],
        banished: Array.from({ length: 13 }, () => dabbleInDarknessRed),
        deck: 4,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);

    // Verify leviaRedeemed starts in inventory
    expect(Levia.zone("inventory")).toContain(leviaRedeemed.canonicalId);

    // Verify 13 blood-debt cards are in the banished zone
    expect(Levia.zone("banished").length).toBe(13);

    // Activate leviaRedeemed from inventory — the action cost turns all
    // banished cards face-down, and the effect transforms it into the hero.
    const command = listLegalCommands(game.getRuntime(), Levia.id).find(
      (command) =>
        command.move === "activate" &&
        command.payload.instanceId === Levia.findCardInZone("inventory", leviaRedeemed),
    );
    expect(command).toBeDefined();
    if (!command) throw new Error("Inventory transformation must be offered to the player");
    const result = game.getRuntime().dispatch(command.move, Levia.id, command.payload);
    expect(result.accepted).toBe(true);

    // Resolve the activation and any triggered effects
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // After transformation, the card should no longer be in inventory
    expect(Levia.zone("inventory")).not.toContain(leviaRedeemed.canonicalId);

    // The hero zone should now contain the transformed leviaRedeemed
    const heroZone = Levia.zone("heroZone");
    expect(heroZone).toContain(leviaRedeemed.canonicalId);

    // All banished cards should be face-down (cost of the ability).
    // `zone()` returns canonical ids — assert against instance refs.
    const banished = Levia.cardsIn("banished", dabbleInDarknessRed);
    expect(banished).toHaveLength(13);
    for (const card of banished) {
      expectFabCard(Levia, card).toBeFaceDown();
    }
  });

  it("a1 boundary: cannot transform without enough blood-debt cards", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        inventory: [leviaRedeemed],
        // Only 12 blood-debt cards — one short of the 13 threshold
        banished: Array.from({ length: 12 }, () => dabbleInDarknessRed),
        deck: 4,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);

    // Verify leviaRedeemed is in inventory
    expect(Levia.zone("inventory")).toContain(leviaRedeemed.canonicalId);

    // Verify only 12 blood-debt cards
    expect(Levia.zone("banished").length).toBe(12);

    // Activation should be rejected — condition requires 13+ blood-debt cards
    const rejected = Levia.expectFailure({
      move: "activate",
      payload: {
        instanceId: Levia.findCardInZone("inventory", leviaRedeemed),
      },
    });
    expect(rejected.accepted).toBe(false);
  });

  it("a1 boundary: cannot activate from arena (inventory-only condition)", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        // Placed in arena instead of inventory — "in-your-inventory" condition fails
        arena: [leviaRedeemed],
        banished: Array.from({ length: 13 }, () => dabbleInDarknessRed),
        deck: 4,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);

    // Verify leviaRedeemed is in arena, not inventory
    expect(Levia.zone("arena")).toContain(leviaRedeemed.canonicalId);

    // Activation should be rejected — condition requires "in-your-inventory"
    const rejected = Levia.expectActivationRejected(leviaRedeemed);
    expect(rejected.accepted).toBe(false);
  });

  it("card loads into inventory without errors", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        inventory: [leviaRedeemed],
        deck: 8,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    expect(game.as(levia).zone("inventory")).toContain(leviaRedeemed.canonicalId);
  });

  it("a2: blood-debt keyword removed after transformation", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        inventory: [leviaRedeemed],
        // Blood-debt cards in banished (qualify for transform) + one in hand for verification
        banished: Array.from({ length: 13 }, () => dabbleInDarknessRed),
        hand: [dabbleInDarknessRed],
        deck: [dabbleInDarknessRed, dabbleInDarknessRed, dabbleInDarknessRed, dabbleInDarknessRed],
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);

    // Verify dabbleInDarknessRed in hand has blood-debt before transformation
    const handCardBefore = Levia.findCardInZone("hand", dabbleInDarknessRed);
    const rulesBefore = buildFabRulesView(game.getState());
    const evalBefore = rulesBefore.object({
      instanceId: handCardBefore,
      incarnation: game.getState().objects[handCardBefore]!.incarnation,
    });
    const hasBloodDebtBefore = evalBefore?.current.keywords.some((kw) => kw.name === "blood-debt");
    expect(hasBloodDebtBefore).toBe(true);

    // Transform leviaRedeemed into hero zone
    Levia.activate(leviaRedeemed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(Levia.zone("heroZone")).toContain(leviaRedeemed.canonicalId);

    // After transformation, a2 continuous effect removes blood-debt from owned cards.
    // Check the hand card again — it should no longer have blood-debt.
    const rulesAfter = buildFabRulesView(game.getState());
    const evalAfter = rulesAfter.object({
      instanceId: handCardBefore,
      incarnation: game.getState().objects[handCardBefore]!.incarnation,
    });
    const hasBloodDebtAfter = evalAfter?.current.keywords.some((kw) => kw.name === "blood-debt");
    expect(hasBloodDebtAfter).toBe(false);
  });
});
