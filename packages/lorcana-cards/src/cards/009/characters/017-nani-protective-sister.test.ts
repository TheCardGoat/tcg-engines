import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { naniProtectiveSister } from "./017-nani-protective-sister";

describe("Nani - Protective Sister", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [naniProtectiveSister],
      },
    );

    const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
