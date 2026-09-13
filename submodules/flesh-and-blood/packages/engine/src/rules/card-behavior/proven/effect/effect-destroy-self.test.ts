/**
 * AAA test for effect:destroy-self.
 * Representative card: Garland of Spring (SUP212) — Generic Chest Equipment.
 * Activated ability: "Action - Destroy this: Gain {r}. Go again"
 * The cost type is destroy-self; the effect is gain-resources 1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, garlandOfSpring } from "../../../fixtures.ts";

describe("effect: destroy-self", () => {
  it("Arrange/Act/Assert: activating Garland of Spring destroys it from chest zone to graveyard", () => {
    // Arrange — Garland of Spring equipped in the chest zone.
    const game = FabTestEngine.start(
      { hero: bravo, chest: [garlandOfSpring], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("chest")).toContain(garlandOfSpring.canonicalId);

    // Act — Activate the "Destroy this: Gain {r}" ability (costs 1 AP).
    Bravo.activate(garlandOfSpring);

    // Assert — The destroy-self cost moved the card from chest to graveyard.
    expect(Bravo.zone("chest")).not.toContain(garlandOfSpring.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(garlandOfSpring.canonicalId);
  });

  it("AAA boundary: before activation the equipment remains in the chest zone", () => {
    // Arrange — Garland of Spring equipped but no ability activated.
    const game = FabTestEngine.start(
      { hero: bravo, chest: [garlandOfSpring], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Assert — Without activation the card stays in chest.
    expect(Bravo.zone("chest")).toContain(garlandOfSpring.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(garlandOfSpring.canonicalId);
  });
});
