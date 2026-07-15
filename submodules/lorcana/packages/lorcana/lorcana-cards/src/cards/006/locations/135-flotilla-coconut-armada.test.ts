import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { flotillaCoconutArmada } from "./135-flotilla-coconut-armada";

const flotillaResident = createMockCharacter({
  id: "flotilla-resident",
  name: "Flotilla Resident",
  cost: 2,
});

describe("Flotilla - Coconut Armada", () => {
  it("makes opponents lose 1 lore and gains that much lore at the start of your turn if you have a character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          flotillaCoconutArmada,
          { card: flotillaResident, atLocation: flotillaCoconutArmada },
        ],
        deck: 1,
      },
      {
        deck: 2,
      },
      {
        startingLore: { [PLAYER_ONE]: 0, [PLAYER_TWO]: 1 },
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(flotillaCoconutArmada).success).toBe(true);

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);
  });
});
