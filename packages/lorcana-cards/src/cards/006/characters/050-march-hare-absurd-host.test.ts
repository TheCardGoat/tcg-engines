import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { marchHareAbsurdHost } from "./050-march-hare-absurd-host";

describe("March Hare - Absurd Host", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [marchHareAbsurdHost],
    });

    const cardUnderTest = testEngine.getCardModel(marchHareAbsurdHost);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
