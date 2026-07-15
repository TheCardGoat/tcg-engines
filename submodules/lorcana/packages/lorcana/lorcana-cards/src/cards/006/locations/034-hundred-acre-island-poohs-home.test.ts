import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hundredAcreIslandPoohsHome } from "./034-hundred-acre-island-poohs-home";

const islandResident = createMockCharacter({
  id: "hundred-acre-resident",
  name: "Island Resident",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const islandAttacker = createMockCharacter({
  id: "hundred-acre-attacker",
  name: "Island Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Hundred Acre Island - Pooh's Home", () => {
  it("gains 1 lore when a character here is banished during an opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          hundredAcreIslandPoohsHome,
          { card: islandResident, atLocation: hundredAcreIslandPoohsHome, exerted: true },
        ],
      },
      {
        play: [islandAttacker],
      },
    );

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(islandAttacker, islandResident),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(hundredAcreIslandPoohsHome).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
