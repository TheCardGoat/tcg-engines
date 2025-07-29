/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { outOfOrder } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
