/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:modular
 * Representative card: packages/cards/src/cards/equipment/adaptive-plating.ts
 * Canonical id: mkTDPKqkm7cprrDzWbF9z
 *
 * CR 8.3.30 modular: "This may be equipped to any of your equipment zones.
 * It has the subtype of the zone it's equipped to." CR 8.3.30c: "A card with
 * modular does not have any of the equipment subtypes until it is equipped to
 * a zone."
 *
 * The previous version of this suite seated the card via start-of-game fixture
 * placement and asserted a fixture-stamped field — it never exercised the
 * engine. These tests instead drive a real `type: "equip"` effect (with an
 * explicit destination zone, standing in for the player's modular zone choice)
 * on a modular object that starts in a NON-equipment zone (banished) and has
 * NO printed equipment subtype, then assert the engine-derived subtype matches
 * the zone it was equipped to.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, buildFabRulesView } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

// A modular equipment with NO printed Head/Chest/Arms/Legs subtype (CR
// 8.3.30c: it has no equipment subtype until equipped to a zone).
const modularAny = {
  canonicalId: "trainer-modular-any",
  types: ["Generic", "Equipment"],
  defense: 1,
  keywords: [{ name: "modular" }],
  abilities: [],
};

// A non-modular equipment with no printed zone subtype, as a control.
const plainAny = {
  canonicalId: "trainer-plain-any",
  types: ["Generic", "Equipment"],
  defense: 1,
  keywords: [],
  abilities: [],
};

const subtypesOf = (game: FabTestEngine, instanceId: string): readonly string[] => {
  const state = game.getState();
  const object = state.objects[instanceId];
  if (!object) return [];
  return (
    buildFabRulesView(state).object({ instanceId, incarnation: object.incarnation })?.current
      .typeBox.subtypes ?? []
  );
};

describe("keyword: modular", () => {
  it("AAA — CR 8.3.30c: a modular card equipped mid-game to head gains the Head subtype via the engine", () => {
    const equipToHeadOnHit = hitTrainer({
      slug: "modular-equip-head",
      power: 4,
      effect: {
        type: "equip",
        // Explicit destination zone stands in for the player's modular choice.
        zone: "equipment-head",
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["banished"],
          count: 1,
        },
      },
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipToHeadOnHit],
        banished: [modularAny],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipToHeadOnHit);
    game.helpers.resolveRestOfCombat();

    const id = game.as(bravo).findCardInZone("head", modularAny);
    expect(id).toBeDefined();
    // The engine — not the fixture — must grant the zone's subtype (CR 8.3.30c).
    expect(subtypesOf(game, id!)).toContain("Head");
    // CR 8.3.30c: a modular card has no OTHER equipment subtype — only the one
    // for the zone it occupies.
    expect(subtypesOf(game, id!)).not.toContain("Legs");
  });

  it("AAA — CR 8.3.30c: the same modular card equipped to legs gains the Legs subtype", () => {
    const equipToLegsOnHit = hitTrainer({
      slug: "modular-equip-legs",
      power: 4,
      effect: {
        type: "equip",
        zone: "equipment-legs",
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["banished"],
          count: 1,
        },
      },
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipToLegsOnHit],
        banished: [modularAny],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipToLegsOnHit);
    game.helpers.resolveRestOfCombat();

    const id = game.as(bravo).findCardInZone("legs", modularAny);
    expect(id).toBeDefined();
    expect(subtypesOf(game, id!)).toContain("Legs");
    expect(subtypesOf(game, id!)).not.toContain("Head");
  });

  it("AAA boundary — CR 8.3.30c: a non-modular card equipped the same way gains no zone subtype", () => {
    const equipToHeadOnHit = hitTrainer({
      slug: "plain-equip-head",
      power: 4,
      effect: {
        type: "equip",
        zone: "equipment-head",
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["banished"],
          count: 1,
        },
      },
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipToHeadOnHit],
        banished: [plainAny],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipToHeadOnHit);
    game.helpers.resolveRestOfCombat();

    const id = game.as(bravo).findCardInZone("head", plainAny);
    expect(id).toBeDefined();
    // No modular keyword → the engine grants no zone subtype.
    expect(subtypesOf(game, id!)).not.toContain("Head");
  });
});
