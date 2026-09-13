/**
 * CR 8.3.26 pairs: "Equip this only with an OBJECT."
 *
 * Unlike the start-of-game fixture seating (which the shared enforcePairsEquipment
 * helper polices), a mid-game `type: "equip"` effect must also honour the pairs
 * restriction: the partner object must already be equipped (CR 8.3.26a). These
 * tests drive a real equip proposal through the engine on a pairs object that
 * starts in a NON-equipment zone (banished), so the engine equip path — not the
 * fixture — is the sole enforcer.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { equipmentTrainer, hitTrainer } from "../../../test-trainers.ts";

// Attack whose hit trigger equips an object from the controller's banished zone
// (same real engine-supported equip driver the cloaked suite uses).
const equipFromBanishedOnHit = hitTrainer({
  slug: "pairs-equip-on-hit",
  power: 4,
  effect: {
    type: "equip",
    target: {
      selector: "object",
      declared: "at-resolution",
      zones: ["banished"],
      count: 1,
    },
  },
});

// Pairs equipment that may only be equipped alongside its partner
// (canonicalId "trainer-pairs-partner").
const pairsLegs = equipmentTrainer({
  slug: "pairs-legs",
  keywords: [{ name: "pairs", cardName: "trainer-pairs-partner" }],
  defense: 1,
  zoneSubtype: "Legs",
});

// The partner object the pairs card requires.
const partner = equipmentTrainer({
  slug: "pairs-partner",
  keywords: [],
  defense: 1,
  zoneSubtype: "Head",
});

describe("keyword: pairs", () => {
  it("AAA — CR 8.3.26a: a pairs card equipped mid-game WITHOUT its partner is rejected by the engine equip proposal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipFromBanishedOnHit],
        banished: [pairsLegs],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipFromBanishedOnHit);
    // The hit trigger offers the pairs card as the equip choice; resolving that
    // choice is rejected because no partner is equipped (CR 8.3.26a). The engine
    // equip proposal — not the fixture — is the sole enforcer here, so the
    // rejection surfaces as a layer-resolution failure.
    let rejectionMessage: string | undefined;
    try {
      game.helpers.resolveRestOfCombat();
    } catch (error) {
      rejectionMessage = (error as Error).message;
    }
    expect(rejectionMessage).toContain("pairs");

    // The illegal equip never produced its move-zone event, so the pairs card
    // stays in banished and never lands in legs.
    expect(game.as(bravo).zone("legs")).not.toContain(pairsLegs.canonicalId);
    expect(game.as(bravo).zone("banished")).toContain(pairsLegs.canonicalId);
  });

  it("AAA — CR 8.3.26a: a pairs card equipped mid-game WITH its partner equipped lands in its zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipFromBanishedOnHit],
        banished: [pairsLegs],
        // Partner is already equipped in head via start-of-game seating.
        head: [partner],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipFromBanishedOnHit);
    game.helpers.resolveRestOfCombat();

    // Partner present → the pairs equip is legal and the card lands in legs.
    expect(game.as(bravo).zone("legs")).toContain(pairsLegs.canonicalId);
    expect(game.as(bravo).zone("banished")).not.toContain(pairsLegs.canonicalId);
  });

  it("AAA — CR 8.3.26a: Gavel-style pairs cardName 'off-hand' matches an Off-Hand subtype partner", () => {
    // Catalog Gavel of Natural Order stores cardName: "off-hand" while the
    // seated partner uses a hash-like canonical id. Resolution must use the
    // definition type-line, not a substring of the id.
    const gavelLike = {
      canonicalId: "trainer-gavel-like",
      types: ["Adjudicator", "Weapon", "Hammer", "1H"],
      keywords: [{ name: "pairs" as const, cardName: "off-hand" }],
      abilities: [],
      power: 2,
    };
    const offHand = {
      canonicalId: "tpgGtDJmWntFC6QcdhhgW-partner",
      types: ["Generic", "Equipment", "Off-Hand"],
      keywords: [],
      abilities: [],
      defense: 1,
    };

    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipFromBanishedOnHit],
        banished: [gavelLike],
        weapon1: [offHand],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipFromBanishedOnHit);
    game.helpers.resolveRestOfCombat();

    expect(game.as(bravo).zone("weapon2") ?? game.as(bravo).zone("weapon1")).toEqual(
      expect.arrayContaining([gavelLike.canonicalId]),
    );
  });
});
