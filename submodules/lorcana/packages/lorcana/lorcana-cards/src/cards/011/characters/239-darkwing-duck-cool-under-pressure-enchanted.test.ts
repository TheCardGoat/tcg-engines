import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { darkwingDuckCoolUnderPressureEnchanted } from "./239-darkwing-duck-cool-under-pressure-enchanted";

const readyVillain = createMockCharacter({
  id: "darkwing-cool-under-pressure-enchanted-villain",
  name: "Ready Villain",
  cost: 3,
  strength: 2,
  willpower: 4,
  classifications: ["Storyborn", "Villain"],
});

describe("Darkwing Duck - Cool Under Pressure (Enchanted)", () => {
  it("can challenge ready Villain characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckCoolUnderPressureEnchanted],
      },
      {
        play: [readyVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(darkwingDuckCoolUnderPressureEnchanted, readyVillain),
    ).toBeSuccessfulCommand();
  });
});
