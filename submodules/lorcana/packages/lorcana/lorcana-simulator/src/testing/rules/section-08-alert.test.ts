// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { alertAttacker, evasiveDefender } from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.2. Alert", () => {
    it("8.2.1 / 8.2.2. Alert ignores Evasive when challenging, but Alert itself doesn't grant Evasive.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [alertAttacker],
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(alertAttacker, "Evasive")).toBe(false);
      expect(
        testEngine.asPlayerOne().challenge(alertAttacker, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});
