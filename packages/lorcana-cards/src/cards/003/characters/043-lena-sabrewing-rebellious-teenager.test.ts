import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { lenaSabrewingRebelliousTeenager } from "./043-lena-sabrewing-rebellious-teenager";

describe("Lena Sabrewing - Rebellious Teenager", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [lenaSabrewingRebelliousTeenager],
    });

    const cardUnderTest = testEngine.getCardModel(
      lenaSabrewingRebelliousTeenager,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
