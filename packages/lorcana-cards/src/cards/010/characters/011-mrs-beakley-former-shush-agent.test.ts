import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { mrsBeakleyFormerShushAgent } from "./011-mrs-beakley-former-shush-agent";

describe("Mrs. Beakley - Former S.H.U.S.H. Agent", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [mrsBeakleyFormerShushAgent],
    });

    const cardUnderTest = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
