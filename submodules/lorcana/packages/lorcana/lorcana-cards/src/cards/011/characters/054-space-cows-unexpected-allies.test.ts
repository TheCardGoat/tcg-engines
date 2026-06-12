import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { spaceCowsUnexpectedAllies } from "./054-space-cows-unexpected-allies";

const attacker = createMockCharacter({
  id: "space-cows-test-attacker",
  name: "Test Attacker",
  cost: 2,
  strength: 4,
  willpower: 3,
  lore: 1,
});

describe("Space Cows - Unexpected Allies", () => {
  it("quests and gains 3 lore with no triggered effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: spaceCowsUnexpectedAllies, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(spaceCowsUnexpectedAllies)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(3);
    expect(testEngine.isExerted(spaceCowsUnexpectedAllies)).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("survives being challenged by a weaker attacker due to high willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
        deck: 5,
      },
      {
        play: [{ card: spaceCowsUnexpectedAllies, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(attacker, spaceCowsUnexpectedAllies),
    ).toBeSuccessfulCommand();

    // Attacker (3 willpower) takes 6 damage from Space Cows' strength — banished
    expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");
    // Space Cows (8 willpower) takes only 4 damage — still in play
    expect(testEngine.asPlayerTwo().getCardZone(spaceCowsUnexpectedAllies)).toBe("play");
  });
});
