/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { showMeMore } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Show Me More!", () => {
  it("Each player draws 3 cards", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: showMeMore.cost,
        hand: [showMeMore],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    await testEngine.playCard(showMeMore);

    expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
    expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
  });
});
