import { describe, expect, it } from "bun:test";
import { arielSpectacularSinger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { outOfOrder } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Out Of Order", () => {
  it("Banish chosen character", async () => {
    const testEngine = new TestEngine({
      inkwell: outOfOrder.cost,
      hand: [outOfOrder],
      play: [arielSpectacularSinger],
    });

    await testEngine.playCard(outOfOrder, {
      targets: [arielSpectacularSinger],
    });

    expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe(
      "discard",
    );
  });
});
