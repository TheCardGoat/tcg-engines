/**
 * CR 8.3.36 cloaked: "Equip this face-down."
 *
 * The production equip proposal must stamp `faceDown` on the emitted move-zone
 * event so a cloaked card equipped MID-GAME (not via start-of-game fixture
 * seating) lands face-down. These tests drive a real `type: "equip"` effect
 * through the engine on a cloaked object that starts in a NON-equipment zone
 * (banished). The start-of-game fixture fake only sets faceDown for cards
 * seated in head/chest/arms/legs, so the engine equip path is the sole source
 * of the face-down marker here — proving CR 8.3.36 is implemented by the
 * engine, not just the test fixture.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { equipmentTrainer, hitTrainer } from "../../../test-trainers.ts";

// Attack whose hit trigger equips an object from the controller's banished
// zone. Mirrors the Okana Scar Wraps printed equip-from-banished path — a real
// engine-supported equip driver — so the equip proposal branch runs against a
// cloaked object that was never touched by the fixture face-down fake.
const equipFromBanishedOnHit = hitTrainer({
  slug: "equip-on-hit",
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

describe("keyword: cloaked", () => {
  it("AAA — CR 8.3.36: a cloaked card equipped mid-game lands face-down via the engine equip proposal", () => {
    const cloakedLegs = equipmentTrainer({
      slug: "cloaked-legs",
      keywords: [{ name: "cloaked" }],
      defense: 1,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipFromBanishedOnHit],
        banished: [cloakedLegs],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipFromBanishedOnHit);
    game.helpers.resolveRestOfCombat();

    const id = game.as(bravo).findCardInZone("legs", cloakedLegs);
    // The engine equip proposal — not the fixture — must set the face-down
    // marker (CR 8.3.36).
    expect(game.objectState(id)?.faceDown).toBe(true);
    // Corroborating evidence: the equip move-zone event carries faceDown.
    const equipMove = game
      .committedEvents()
      .some(
        (event) =>
          event.name === "move-zone" &&
          event.data.reason === "equip" &&
          event.data.faceDown === true,
      );
    expect(equipMove).toBe(true);
  });

  it("AAA boundary — CR 8.3.36: a non-cloaked card equipped the same way stays face-up", () => {
    const plainLegs = equipmentTrainer({
      slug: "plain-legs",
      keywords: [{ name: "battleworn" }],
      defense: 1,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [equipFromBanishedOnHit],
        banished: [plainLegs],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(equipFromBanishedOnHit);
    game.helpers.resolveRestOfCombat();

    const id = game.as(bravo).findCardInZone("legs", plainLegs);
    expect(game.objectState(id)?.faceDown).not.toBe(true);
  });
});
