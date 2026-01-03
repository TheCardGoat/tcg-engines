import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { thunderboltWonderDog } from "./023-thunderbolt-wonder-dog";

describe("Thunderbolt - Wonder Dog", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thunderboltWonderDog],
    });

    const cardUnderTest = testEngine.getCardModel(thunderboltWonderDog);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thunderboltWonderDog],
    });

    const cardUnderTest = testEngine.getCardModel(thunderboltWonderDog);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
