// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { flounderVoiceOfReason, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { resolveOnlyBagEffect, supportTarget } from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.13. Support", () => {
    it("8.13.1. Support can target an opposing character.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [heiheiBoatSnack],
        },
        {
          play: [{ card: flounderVoiceOfReason, exerted: false }],
        },
      );

      expect(testEngine.asPlayerOne().quest(heiheiBoatSnack)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      resolveOnlyBagEffect(testEngine, {
        resolveOptional: true,
        targets: [flounderVoiceOfReason],
      });

      expect(testEngine.asPlayerTwo().getCardStrength(flounderVoiceOfReason)).toBe(
        flounderVoiceOfReason.strength + heiheiBoatSnack.strength,
      );
    });

    it("8.13.1. Support triggers on quest and adds the quester's strength to another character this turn.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [heiheiBoatSnack, supportTarget],
        },
        {
          play: [{ card: flounderVoiceOfReason, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().quest(heiheiBoatSnack)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      resolveOnlyBagEffect(testEngine, {
        resolveOptional: true,
        targets: [supportTarget],
      });

      expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
        supportTarget.strength + heiheiBoatSnack.strength,
      );
      expect(testEngine.asPlayerOne().challenge(supportTarget, flounderVoiceOfReason).success).toBe(
        true,
      );
      expect(testEngine.asPlayerTwo().getCardZone(flounderVoiceOfReason)).toBe("discard");
    });
  });
});
