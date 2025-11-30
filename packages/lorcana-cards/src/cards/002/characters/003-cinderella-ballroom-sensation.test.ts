import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

describe("Cinderella - Ballroom Sensation", () => {
  it("should have Singer 3 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [cinderellaBallroomSensation],
      },
    );

    const cardUnderTest = testEngine.getCardModel(cinderellaBallroomSensation);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
