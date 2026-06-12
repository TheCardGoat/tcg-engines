import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scroogesCountingHouseEbenezersOffice } from "../locations";
import { lonelyGrave } from "./132-lonely-grave";

const restlessSpirit = createMockCharacter({
  id: "lonely-grave-restless-spirit",
  name: "Restless Spirit",
  cost: 1,
});

const willingSacrifice = createMockCharacter({
  id: "lonely-grave-willing-sacrifice",
  name: "Willing Sacrifice",
  cost: 2,
});

describe("Lonely Grave", () => {
  it("banishes one of your characters as the activation cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [restlessSpirit],
      play: [lonelyGrave, scroogesCountingHouseEbenezersOffice, willingSacrifice],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(lonelyGrave, {
        costs: {
          banishCharacters: [testEngine.findCardInstanceId(willingSacrifice, "play", "player_one")],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(willingSacrifice)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(lonelyGrave)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(lonelyGrave)).toBe(true);
    expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toEqual([]);
    expect(testEngine.asPlayerOne().getCardZone(restlessSpirit)).toBe("deck");
  });

  it.todo("regression: not activable when no characters or locations with Boost are in play", () => {
    const noBoostCharacter = createMockCharacter({
      id: "lonely-grave-no-boost-char",
      name: "No Boost Character",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [restlessSpirit],
      play: [lonelyGrave, noBoostCharacter, willingSacrifice],
    });

    // No Boost targets in play, so ability should not be activable
    const result = testEngine.asPlayerOne().activateAbility(lonelyGrave, {
      costs: {
        banishCharacters: [testEngine.findCardInstanceId(willingSacrifice, "play", "player_one")],
      },
    });

    expect(result.success).toBe(false);
  });
});
