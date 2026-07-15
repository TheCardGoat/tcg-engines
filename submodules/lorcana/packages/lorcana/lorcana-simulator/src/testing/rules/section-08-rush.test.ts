// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { rushAttacker } from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.9. Rush", () => {
    it("8.9.1. Rush lets a character challenge the turn it's played.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rushAttacker],
          inkwell: rushAttacker.cost,
        },
        {
          play: [{ card: stitchNewDog, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(rushAttacker)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().challenge(rushAttacker, stitchNewDog),
      ).toBeSuccessfulCommand();
    });
  });
});
