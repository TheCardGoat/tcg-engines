import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { liloJuniorCakeDecorator } from "./008-lilo-junior-cake-decorator";

describe("Lilo - Junior Cake Decorator", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [liloJuniorCakeDecorator],
    });

    const cardUnderTest = testEngine.getCardModel(liloJuniorCakeDecorator);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
