import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { marchHareAbsurdHost } from "./050-march-hare-absurd-host";

describe("March Hare - Absurd Host", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [marchHareAbsurdHost],
    });
    const cardUnderTest = testEngine.getCardModel(marchHareAbsurdHost);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
