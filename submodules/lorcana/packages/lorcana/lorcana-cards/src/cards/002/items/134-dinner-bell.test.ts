import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy } from "../../001/characters/046-jetsam-ursulas-spy";
import { dinnerBell } from "./134-dinner-bell";

describe("Dinner Bell", () => {
  it("draws cards equal to the damage on your chosen character, then banishes them", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 5,
      inkwell: 2,
      play: [dinnerBell, jetsamUrsulasSpy],
    });

    testEngine.asServer().manualSetDamage(jetsamUrsulasSpy, 2);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toBe(2);

    const result = testEngine.asPlayerOne().activateAbility(dinnerBell, {
      targets: [jetsamUrsulasSpy],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(dinnerBell)).toBe("play");
  });

  /**
   * Fabled Release Notes Ruling:
   * You CAN choose a character with 0 damage. You draw 0 cards but still banish them.
   */
  it("draws 0 cards but still banishes when the chosen character has no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 5,
      inkwell: 2,
      play: [dinnerBell, jetsamUrsulasSpy],
    });

    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toBe(0);

    const result = testEngine.asPlayerOne().activateAbility(dinnerBell, {
      targets: [jetsamUrsulasSpy],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(dinnerBell)).toBe("play");
  });
});
