/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { thievery } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe.skip("Thievery", () => {
  it("Chosen opponent loses 1 lore. Gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyBraveLittleTailor],
      hand: [thievery],
    });

    await testEngine.playCard(thievery);
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });

    expect(testEngine.getPlayerLore("opponent")).toBe(0);
    expect(testEngine.getPlayerLore()).toBe(1);
  });
});
