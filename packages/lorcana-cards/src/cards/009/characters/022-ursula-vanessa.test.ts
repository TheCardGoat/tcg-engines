import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { ursulaVanessa } from "./022-ursula-vanessa";

describe("Ursula - Vanessa", () => {
  it.skip("should have Singer 4 ability", () => {
    const testEngine = new TestEngine({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
