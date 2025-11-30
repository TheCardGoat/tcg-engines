import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { liloJuniorCakeDecorator } from "./008-lilo-junior-cake-decorator";

describe("Lilo - Junior Cake Decorator", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [liloJuniorCakeDecorator],
    });
    const cardUnderTest = testEngine.getCardModel(liloJuniorCakeDecorator);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
