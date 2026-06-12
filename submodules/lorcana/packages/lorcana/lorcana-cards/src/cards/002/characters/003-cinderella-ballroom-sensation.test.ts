import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

describe("Cinderella - Ballroom Sensation", () => {
  it("Singer", () => {
    const testEngine = new LorcanaTestEngine({
      play: [cinderellaBallroomSensation],
    });

    const cardUnderTest = testEngine.getCardModel(cinderellaBallroomSensation);

    expect(cardUnderTest.hasSinger()).toBe(true);
    expect(cardUnderTest.singerCost).toBe(3);
  });
});
