import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { druunRavenousPlague } from "./046-druun-ravenous-plague";

describe("Druun - Ravenous Plague", () => {
  it("should have Challenger 4 ability", () => {
    const testEngine = new TestEngine({
      play: [druunRavenousPlague],
    });
    const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
