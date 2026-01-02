import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { liloJuniorCakeDecorator } from "./008-lilo-junior-cake-decorator";

describe("Lilo - Junior Cake Decorator", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [liloJuniorCakeDecorator],
    });

    const cardUnderTest = testEngine.getCardModel(liloJuniorCakeDecorator);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
