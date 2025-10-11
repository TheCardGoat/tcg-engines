import { describe, expect, it } from "bun:test";
import { tobyTurtleWaryFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Toby Turtle - Wary Friend", () => {
  it("HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: tobyTurtleWaryFriend.cost,
      play: [tobyTurtleWaryFriend],
      hand: [],
    });

    expect(testEngine.getCardModel(tobyTurtleWaryFriend).hasResist).toBe(false);
    await testEngine.exertCard(tobyTurtleWaryFriend);

    expect(testEngine.getCardModel(tobyTurtleWaryFriend).hasResist).toBe(true);
  });
});
