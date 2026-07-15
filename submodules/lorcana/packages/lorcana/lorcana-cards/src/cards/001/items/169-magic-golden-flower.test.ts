import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy } from "../characters";
import { magicGoldenFlower } from "./169-magic-golden-flower";

describe("Magic Golden Flower", () => {
  it("banishes itself to remove up to 3 damage from the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [magicGoldenFlower, jetsamUrsulasSpy],
    });

    testEngine.asServer().manualSetDamage(jetsamUrsulasSpy, 2);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toBe(2);

    const result = testEngine.asPlayerOne().activateAbility(magicGoldenFlower, {
      ability: "HEALING POLLEN",
      targets: [jetsamUrsulasSpy],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(magicGoldenFlower)).toBe("discard");
  });
});
