// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { genieOnTheJob, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { evasiveDefender } from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.6. Evasive", () => {
    it("8.6.1. A character WITHOUT Evasive CAN'T challenge an Evasive character.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(stitchNewDog, evasiveDefender) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("DEFENDER_EVASIVE_RESTRICTION");
    });

    it("8.6.1. A character WITH Evasive CAN challenge an Evasive character.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [genieOnTheJob],
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
        },
      );

      const result = testEngine.asPlayerOne().challenge(genieOnTheJob, evasiveDefender);
      expect(result).toBeSuccessfulCommand();
    });
  });
});
