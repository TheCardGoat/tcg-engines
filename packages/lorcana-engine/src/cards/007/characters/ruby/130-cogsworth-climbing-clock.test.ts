/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { cogsworthClimbingClock } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
