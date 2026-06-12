import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  minnieMouseAlwaysClassy,
  simbaProtectiveCub,
  stitchCarefreeSurfer,
} from "@tcg/lorcana-cards/cards/001";

/**
 * THE-953: Stitch – Carefree Surfer (Ohana) — count other characters at bag resolution.
 * Printed: "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards."
 */
describe("THE-953 Stitch Carefree Surfer Ohana", () => {
  it("draws 2 when two other characters are still in play when Ohana resolves", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stitchCarefreeSurfer],
      inkwell: stitchCarefreeSurfer.cost,
      deck: 2,
      play: [simbaProtectiveCub, minnieMouseAlwaysClassy],
    });

    expect(engine.asPlayerOne().playCard(stitchCarefreeSurfer)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      engine.asPlayerOne().resolvePendingByCard(stitchCarefreeSurfer, {
        resolveOptional: true,
      }).success,
    ).toBe(true);

    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });
});
