import { describe, expect, it } from "bun:test";
import { lookAtThisFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { mirabelMadrigalCuriousChild } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mirabel Madrigal - Curious Child", () => {
  it("YOU ARE A JEWEL When you play this character, you may reveal a song card in your hand to gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: mirabelMadrigalCuriousChild.cost,
      hand: [lookAtThisFamily, mirabelMadrigalCuriousChild],
    });

    await testEngine.playCard(mirabelMadrigalCuriousChild);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [lookAtThisFamily] });

    expect(testEngine.getPlayerLore()).toBe(1);
  });

  it("YOU ARE A JEWEL No reveal, no lore", async () => {
    const testEngine = new TestEngine({
      inkwell: mirabelMadrigalCuriousChild.cost,
      hand: [lookAtThisFamily, mirabelMadrigalCuriousChild],
    });

    await testEngine.playCard(mirabelMadrigalCuriousChild);
    await testEngine.skipTopOfStack();

    expect(testEngine.getPlayerLore()).toBe(0);
  });

  it("YOU ARE A JEWEL No song in hand, no lore", async () => {
    const testEngine = new TestEngine({
      inkwell: mirabelMadrigalCuriousChild.cost,
      hand: [mirabelMadrigalCuriousChild],
    });

    await testEngine.playCard(mirabelMadrigalCuriousChild);
    await testEngine.acceptOptionalLayer();
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(testEngine.getPlayerLore()).toBe(0);
  });
});
