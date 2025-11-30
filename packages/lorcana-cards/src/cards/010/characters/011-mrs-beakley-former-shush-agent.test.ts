import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mrsBeakleyFormerShushAgent } from "./011-mrs-beakley-former-shush-agent";

describe("Mrs. Beakley - Former S.H.U.S.H. Agent", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [mrsBeakleyFormerShushAgent],
      },
    );

    const cardUnderTest = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
