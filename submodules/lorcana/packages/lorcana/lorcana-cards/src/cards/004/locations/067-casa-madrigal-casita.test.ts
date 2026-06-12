import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { casaMadrigalCasita } from "./067-casa-madrigal-casita";

const casitaResident = createMockCharacter({
  id: "casita-resident",
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

  it("does not gain lore if there is no character at this location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [casaMadrigalCasita],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });
});
