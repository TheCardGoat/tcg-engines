import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { plateArmor } from "./201-plate-armor";

const armoredAlly = createMockCharacter({
  id: "plate-armor-target",
  name: "Armored Ally",
  cost: 3,
});

describe("Plate Armor", () => {
  it("gives the chosen character Resist +2 until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [plateArmor, armoredAlly],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(plateArmor, {
        targets: [armoredAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(armoredAlly, "Resist")).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(armoredAlly, "Resist")).toBe(2);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(armoredAlly, "Resist")).toBeNull();
  });
});
