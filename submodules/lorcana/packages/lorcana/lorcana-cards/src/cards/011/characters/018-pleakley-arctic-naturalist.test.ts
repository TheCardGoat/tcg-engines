import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchCarefreeSurfer } from "../../001";
import { pleakleyArcticNaturalist } from "./018-pleakley-arctic-naturalist";

describe("Pleakley - Arctic Naturalist", () => {
  it("SIGNS OF LIFE - draws a card when played with another Alien character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pleakleyArcticNaturalist],
      inkwell: pleakleyArcticNaturalist.cost,
      play: [stitchCarefreeSurfer],
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
    expect(testEngine.asPlayerOne().playCard(pleakleyArcticNaturalist)).toBeSuccessfulCommand();
    const handAfter = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;

    // Played 1 card from hand (-1) and drew 1 card (+1) = net 0 change
    expect(handAfter).toBe(handBefore);
  });

  it("should not draw a card when no other Alien character is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pleakleyArcticNaturalist],
      inkwell: pleakleyArcticNaturalist.cost,
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
    expect(testEngine.asPlayerOne().playCard(pleakleyArcticNaturalist)).toBeSuccessfulCommand();
    const handAfter = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;

    // Played 1 card from hand (-1) and drew 0 cards = net -1
    expect(handAfter).toBe(handBefore - 1);
  });
});
