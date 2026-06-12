import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { casaMadrigalCasita } from "./068-casa-madrigal-casita";

const casitaResident = createMockCharacter({
  id: "set9-casita-resident",
  name: "Casita Resident",
  cost: 2,
});

describe("Casa Madrigal - Casita", () => {
  it("gains 1 lore at the start of your turn if you have a character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [casaMadrigalCasita, { card: casitaResident, atLocation: casaMadrigalCasita }],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(casaMadrigalCasita).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
