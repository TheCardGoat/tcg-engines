/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { cogsworthClimbingClock } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cogsworth - Climbing Clock", () => {
  it("STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.", async () => {
    const testEngine = new TestEngine({
      play: [cogsworthClimbingClock],
      discard: [dingleHopper],
    });

    await testEngine.playCard(cogsworthClimbingClock);

    expect(testEngine.getCardModel(cogsworthClimbingClock).strength).toBe(
      cogsworthClimbingClock.strength + 2,
    );
  });

  it("No item in discard", async () => {
    const testEngine = new TestEngine({
      play: [cogsworthClimbingClock],
    });

    await testEngine.playCard(cogsworthClimbingClock);

    expect(testEngine.getCardModel(cogsworthClimbingClock).strength).toBe(
      cogsworthClimbingClock.strength,
    );
  });
});
