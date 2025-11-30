import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

describe("Cinderella - Ballroom Sensation", () => {
  it.skip("should have Singer 3 ability", () => {
    const testEngine = new TestEngine({
      play: [cinderellaBallroomSensation],
    });

    const cardUnderTest = testEngine.getCardModel(cinderellaBallroomSensation);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
