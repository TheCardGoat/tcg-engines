import { describe, expect, it } from "bun:test";
import {
  ladyElegantSpaniel,
  trampEnterprisingDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.", () => {
  it("should have +1 {L} with Tramp in play", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [ladyElegantSpaniel, trampEnterprisingDog],
      hand: [],
    });

    expect(testEngine.getCardModel(ladyElegantSpaniel).lore).toEqual(2);
  });
  it("should 1 {L} without Tramp in play", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [ladyElegantSpaniel],
      hand: [],
    });

    expect(testEngine.getCardModel(ladyElegantSpaniel).lore).toEqual(1);
  });
});
