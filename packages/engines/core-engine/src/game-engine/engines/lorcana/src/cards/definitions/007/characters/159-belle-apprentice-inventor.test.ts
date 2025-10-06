/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  belleApprenticeInventor,
  spaghettiDinner,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Belle - Apprentice Inventor", () => {
  it("WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: 0,
      play: [spaghettiDinner],
      hand: [belleApprenticeInventor],
    });

    await testEngine.playCard(belleApprenticeInventor, {
      alternativeCosts: [spaghettiDinner],
    });

    expect(testEngine.getCardModel(spaghettiDinner).zone).toBe("discard");
    expect(testEngine.getCardModel(belleApprenticeInventor).zone).toBe("play");
  });
});
