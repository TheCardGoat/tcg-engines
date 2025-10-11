import { describe, expect, it } from "bun:test";
import { amethystChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Amethyst Chromicon", () => {
  it.skip("**AMETHYST LIGHT** {E}− Each player may draw a card.", () => {
    const testEngine = new TestEngine(
      {
        play: [amethystChromicon],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    testEngine.activateCard(amethystChromicon);

    testEngine.acceptOptionalLayer();
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 1, hand: 1 }),
    );

    testEngine.changeActivePlayer("player_two");
    testEngine.acceptOptionalLayer();
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 1, hand: 1 }),
    );
  });
});
