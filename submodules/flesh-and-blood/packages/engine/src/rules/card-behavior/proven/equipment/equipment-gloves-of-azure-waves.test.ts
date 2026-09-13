/**
 * PEN167 Gloves of Azure Waves — Pirate Arms d0.
 *
 * Printed a1: If there are 2 or more blue cards in your pitch zone, this gets
 * +3{d} and blade break.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { glovesOfAzureWaves } from "../../../../../../cards/src/cards/equipment/gloves-of-azure-waves.ts";

describe("gloves-of-azure-waves (PEN167)", () => {
  it("two blue pitch cards grant +3 defense and blade break in public combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [glovesOfAzureWaves],
        pitch: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    expect(Defender.zone("pitch")).toHaveLength(2);
    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(glovesOfAzureWaves);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(19);
    expect(Defender.zone("arms")).not.toContain(glovesOfAzureWaves.canonicalId);
    expect(Defender.zone("graveyard")).toContain(glovesOfAzureWaves.canonicalId);
  });

  it("without two blue pitch cards, defense stays at zero and blade break does not apply", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [glovesOfAzureWaves], deck: 6 },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(glovesOfAzureWaves);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(16);
    expect(Defender.zone("arms")).toContain(glovesOfAzureWaves.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(glovesOfAzureWaves.canonicalId);
  });
});
