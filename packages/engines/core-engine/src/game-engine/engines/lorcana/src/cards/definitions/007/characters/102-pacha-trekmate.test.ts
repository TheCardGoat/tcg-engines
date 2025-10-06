/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { suddenChill } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { brawl } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { pachaTrekmate } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("FULL PACK While you have more cards in hand than each opponent, this character gets +2 {L}.", () => {
  it("should have +2 {L} if having more cards in hand", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: pachaTrekmate.cost,
        play: [pachaTrekmate],
        hand: [letTheStormRageOn, suddenChill],
      },
      {
        inkwell: pachaTrekmate.cost,
        play: [],
        hand: [brawl],
      },
    );

    const cardUnderTest = testEngine.getCardModel(pachaTrekmate);

    expect(cardUnderTest.lore).toBe(3);
  });
  it("should not have +2 {L} if not having more cards in hand", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: pachaTrekmate.cost,
        play: [pachaTrekmate],
        hand: [letTheStormRageOn],
      },
      {
        inkwell: pachaTrekmate.cost,
        play: [],
        hand: [brawl],
      },
    );

    const cardUnderTest = testEngine.getCardModel(pachaTrekmate);

    expect(cardUnderTest.lore).toBe(1);
  });
});
