import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { negaduckEvilDoppelganger } from "./115-negaduck-evil-doppelganger";

describe("Negaduck - Evil Doppelganger", () => {
  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [negaduckEvilDoppelganger],
      inkwell: negaduckEvilDoppelganger.cost,
    });

    expect(testEngine.asPlayerOne().playCard(negaduckEvilDoppelganger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(negaduckEvilDoppelganger)).toBe("play");
  });
});
