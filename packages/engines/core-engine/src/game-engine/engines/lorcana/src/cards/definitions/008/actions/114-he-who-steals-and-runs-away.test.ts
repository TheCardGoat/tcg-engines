import { describe, expect, it } from "bun:test";
import {
  atlanteanCrystal,
  heWhoStealsAndRunsAway,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("He Who Steals And Runs Away", () => {
  it("Banish chosen item. Draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: heWhoStealsAndRunsAway.cost,
        hand: [heWhoStealsAndRunsAway],
        deck: 10,
      },
      {
        play: [atlanteanCrystal],
      },
    );

    await testEngine.playCard(heWhoStealsAndRunsAway, {
      targets: [atlanteanCrystal],
    });

    expect(testEngine.getCardModel(atlanteanCrystal).zone).toBe("discard");
    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
