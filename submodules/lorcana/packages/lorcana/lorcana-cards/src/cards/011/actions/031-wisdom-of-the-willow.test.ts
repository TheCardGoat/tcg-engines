import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub, mickeyMouseTrueFriend } from "../../001";
import { wisdomOfTheWillow } from "./031-wisdom-of-the-willow";

describe("Wisdom of the Willow", () => {
  it("offers an optional draw when one of your characters quests this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wisdomOfTheWillow],
        inkwell: wisdomOfTheWillow.cost,
        play: [simbaProtectiveCub],
        deck: [mickeyMouseTrueFriend],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(wisdomOfTheWillow)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(wisdomOfTheWillow, {
        resolveOptional: true,
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wisdomOfTheWillow],
        inkwell: wisdomOfTheWillow.cost,
        play: [simbaProtectiveCub],
        deck: [mickeyMouseTrueFriend],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(wisdomOfTheWillow)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    const handBeforeQuest = testEngine.asPlayerOne().getZonesCardCount().hand;
    expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBeforeQuest);
  });
});
