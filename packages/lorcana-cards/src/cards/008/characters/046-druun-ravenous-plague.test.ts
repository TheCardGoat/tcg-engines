import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { druunRavenousPlague } from "./046-druun-ravenous-plague";

describe("Druun - Ravenous Plague", () => {
  it.skip("should have Challenger 4 ability", () => {
    const testEngine = new TestEngine({
      play: [druunRavenousPlague],
    });

    const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
