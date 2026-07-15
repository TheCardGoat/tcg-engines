// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  arielSpectacularSinger,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import {
  isabelaMadrigalInTheMoment,
  restoringTheHeart,
  theFamilyMadrigal,
  thisIsMyFamily,
} from "@tcg/lorcana-cards/cards/007";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.11. Singer", () => {
    it("8.11.1 / 8.11.2. Singer lets a character pay a song's alternate cost and still resolve its pending song effect.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theFamilyMadrigal],
        play: [arielSpectacularSinger],
        inkwell: 0,
        deck: [
          arielOnHumanLegs,
          thisIsMyFamily,
          isabelaMadrigalInTheMoment,
          simbaProtectiveCub,
          restoringTheHeart,
        ],
      });

      expect(
        testEngine.asPlayerOne().singSong(theFamilyMadrigal, arielSpectacularSinger),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
        expect.objectContaining({
          type: "scry-selection",
        }),
      );
    });
  });
});
