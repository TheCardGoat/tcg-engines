import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { potionOfMight } from "./132-potion-of-might";

const steadfastHero = createMockCharacter({
  id: "potion-of-might-hero",
  name: "Steadfast Hero",
  cost: 2,
  strength: 2,
});

const schemingVillain = createMockCharacter({
  id: "potion-of-might-villain",
  name: "Scheming Villain",
  cost: 3,
  strength: 2,
  classifications: ["Storyborn", "Villain"],
});

describe("Potion of Might", () => {
  it("gives a non-Villain +3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      inkwell: 1,
      play: [potionOfMight, steadfastHero],
    });

    const baseStrength = testEngine.asPlayerOne().getCardStrength(steadfastHero);

    expect(
      testEngine.asPlayerOne().activateAbility(potionOfMight, {
        targets: [steadfastHero],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(steadfastHero)).toBe(baseStrength + 3);
    expect(testEngine.asPlayerOne().getCardZone(potionOfMight)).toBe("discard");
  });

  it("gives a chosen Villain +4 strength this turn instead", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      inkwell: 1,
      play: [potionOfMight, schemingVillain],
    });

    const baseStrength = testEngine.asPlayerOne().getCardStrength(schemingVillain);

    expect(
      testEngine.asPlayerOne().activateAbility(potionOfMight, {
        targets: [schemingVillain],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(schemingVillain)).toBe(baseStrength + 4);
    expect(testEngine.asPlayerOne().getCardZone(potionOfMight)).toBe("discard");
  });
});
