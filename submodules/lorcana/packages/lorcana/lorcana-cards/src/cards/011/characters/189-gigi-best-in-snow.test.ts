import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { gigiBestInSnow } from "./189-gigi-best-in-snow";

describe("Gigi - Best in Snow", () => {
  it("should have Alert ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [gigiBestInSnow],
    });

    const cardUnderTest = testEngine.getCardModel(gigiBestInSnow);
    expect(cardUnderTest.hasAlert()).toBe(true);
  });

  it("should have +2 strength when undamaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gigiBestInSnow],
    });

    const gigi = testEngine.getCard(gigiBestInSnow);
    expect(gigi.strength).toBe(gigiBestInSnow.strength + 2);
  });

  it("should lose +2 strength when damaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gigiBestInSnow],
    });

    testEngine.asServer().manualSetDamage(gigiBestInSnow, 1);

    const gigi = testEngine.getCard(gigiBestInSnow);
    expect(gigi.strength).toBe(gigiBestInSnow.strength);
  });
});
