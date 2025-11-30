import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { lenaSabrewingRebelliousTeenager } from "./043-lena-sabrewing-rebellious-teenager";

describe("Lena Sabrewing - Rebellious Teenager", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [lenaSabrewingRebelliousTeenager],
    });
    const cardUnderTest = testEngine.getCardModel(
      lenaSabrewingRebelliousTeenager,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
