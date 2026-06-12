// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { challengerAttacker } from "./section-08-test-utils";
import { daisyDuckDonaldsDate } from "@tcg/lorcana-cards/cards/005";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.5. Challenger", () => {
    it("8.5.1. Challenger adds strength only while this character is challenging.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [challengerAttacker],
        },
        {
          play: [{ card: daisyDuckDonaldsDate, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challengerAttacker, daisyDuckDonaldsDate).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getCard(daisyDuckDonaldsDate).damage).toBe(
        // Attacker has Challenger +2
        challengerAttacker.strength + 2,
      );
      expect(testEngine.asPlayerOne().getDamage(challengerAttacker)).toBe(
        daisyDuckDonaldsDate.strength,
      );
    });

    it("8.5.2. Challenger doesn't apply while this character is being challenged.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [stitchNewDog],
        },
        {
          play: [{ card: challengerAttacker, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(stitchNewDog, challengerAttacker).success).toBe(
        true,
      );

      expect(testEngine.asPlayerOne().getDamage(challengerAttacker)).toBe(stitchNewDog.strength);
      expect(testEngine.asPlayerOne().getDamage(stitchNewDog)).toBe(challengerAttacker.strength);
      expect(testEngine.asPlayerOne().getCardZone(challengerAttacker)).toBe("play");
    });
  });
});
