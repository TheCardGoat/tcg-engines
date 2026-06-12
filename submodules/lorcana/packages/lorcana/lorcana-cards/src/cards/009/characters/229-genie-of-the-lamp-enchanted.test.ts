import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { genieOfTheLampEnchanted } from "./229-genie-of-the-lamp-enchanted";

const alliedCharacter = createMockCharacter({
  id: "genie-of-the-lamp-enchanted-allied-character",
  name: "Allied Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Genie - Of the Lamp - Enchanted", () => {
  it("matches the base card's exerted strength aura for your other characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieOfTheLampEnchanted, exerted: true }, alliedCharacter],
    });

    expect(testEngine.asPlayerOne().getCardStrength(alliedCharacter)).toBe(
      alliedCharacter.strength + 2,
    );
    expect(testEngine.asPlayerOne().getCardStrength(genieOfTheLampEnchanted)).toBe(
      genieOfTheLampEnchanted.strength,
    );
  });
});
