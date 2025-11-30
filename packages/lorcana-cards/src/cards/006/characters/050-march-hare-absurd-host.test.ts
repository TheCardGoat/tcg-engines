import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { marchHareAbsurdHost } from "./050-march-hare-absurd-host";

describe("March Hare - Absurd Host", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [marchHareAbsurdHost],
    });

    const cardUnderTest = testEngine.getCardModel(marchHareAbsurdHost);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
