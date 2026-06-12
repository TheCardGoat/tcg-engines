import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { weDontTalkAboutBrunoEnchanted } from "./213-we-dont-talk-about-bruno-enchanted";

describe("We Don't Talk About Bruno (Enchanted)", () => {
  it("returns the chosen character to hand and makes that player discard a random card", () => {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [weDontTalkAboutBrunoEnchanted],
          inkwell: weDontTalkAboutBrunoEnchanted.cost,
        },
        {
          hand: [mickeyMouseTrueFriend, simbaProtectiveCub],
          play: [arielOnHumanLegs],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(weDontTalkAboutBrunoEnchanted, {
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
