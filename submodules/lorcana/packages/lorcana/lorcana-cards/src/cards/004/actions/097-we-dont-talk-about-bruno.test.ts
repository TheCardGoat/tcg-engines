import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { weDontTalkAboutBruno } from "./097-we-dont-talk-about-bruno";

describe("We Don’t Talk About Bruno", () => {
  it("returns the chosen character to hand and makes that player discard a random card", () => {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [weDontTalkAboutBruno],
          inkwell: weDontTalkAboutBruno.cost,
        },
        {
          hand: [mickeyMouseTrueFriend, simbaProtectiveCub],
          play: [arielOnHumanLegs],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(weDontTalkAboutBruno, {
          targets: [arielOnHumanLegs],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo()).toHavePendingEffectCount(0);
      expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    } finally {
      Math.random = originalRandom;
    }
  });
});
