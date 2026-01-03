import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { druunRavenousPlague } from "./046-druun-ravenous-plague";

describe("Druun - Ravenous Plague", () => {
  it("should have Challenger 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [druunRavenousPlague],
    });

    const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
