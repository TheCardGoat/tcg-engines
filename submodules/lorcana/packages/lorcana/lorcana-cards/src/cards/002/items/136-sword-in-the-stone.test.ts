import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../characters";
import { swordInTheStone } from "./136-sword-in-the-stone";

describe("Sword in the Stone", () => {
  it("gives the chosen character +1 strength this turn for each damage on them", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [swordInTheStone, goofyKnightForADay],
    });

    testEngine.asServer().manualSetDamage(goofyKnightForADay, 5);
    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(5);

    const baseStrength = testEngine.asPlayerOne().getCard(goofyKnightForADay).strength;
    expect(baseStrength).toBeDefined();
    const result = testEngine.asPlayerOne().activateAbility(swordInTheStone, {
      targets: [goofyKnightForADay],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(goofyKnightForADay).strength).toBe(baseStrength! + 5);
  });
});
