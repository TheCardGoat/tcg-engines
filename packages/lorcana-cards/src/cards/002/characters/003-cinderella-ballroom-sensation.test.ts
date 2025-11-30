import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

describe("Cinderella - Ballroom Sensation", () => {
  it("should have Singer 3 ability", () => {
    const testEngine = new TestEngine({
      play: [cinderellaBallroomSensation],
    });
    const cardUnderTest = testEngine.getCardModel(cinderellaBallroomSensation);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
