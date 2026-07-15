import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { demonaBetrayerOfTheClan } from "./040-demona-betrayer-of-the-clan";

describe("Demona - Betrayer of the Clan", () => {
  it("has Challenger +2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [demonaBetrayerOfTheClan],
      deck: 2,
    });

    expect(testEngine.getKeywordValue(demonaBetrayerOfTheClan, "Challenger")).toBe(2);
  });

  it("STONE BY DAY - does not ready if you have 3 or more cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [
          demonaBetrayerOfTheClan,
          demonaBetrayerOfTheClan,
          demonaBetrayerOfTheClan,
          demonaBetrayerOfTheClan,
        ],
        inkwell: demonaBetrayerOfTheClan.cost,
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(demonaBetrayerOfTheClan)).toBeSuccessfulCommand();
    const demonaId = testEngine.findCardInstanceId(demonaBetrayerOfTheClan, "play", PLAYER_ONE);
    testEngine.asServer().manualExertCard(demonaId);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(demonaBetrayerOfTheClan)).toBe(true);
  });
});
