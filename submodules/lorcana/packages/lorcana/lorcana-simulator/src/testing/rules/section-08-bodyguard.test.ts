// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  genieOnTheJob,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { neverLandMermaidLagoon } from "@tcg/lorcana-cards/cards/003";
import { ladyKluckProtectiveConfidant } from "@tcg/lorcana-cards/cards/007";
import { bodyguardEvasiveDefender, evasiveDefender } from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.3. Bodyguard", () => {
    it("8.3.1. A Bodyguard character may enter play exerted rather than ready.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [simbaProtectiveCub],
          inkwell: [mickeyMouseTrueFriend, stitchNewDog],
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCardOptional(simbaProtectiveCub, true),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(true);
    });

    it("8.3.1. A Bodyguard character may still enter play ready.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [simbaProtectiveCub],
          inkwell: [mickeyMouseTrueFriend, stitchNewDog],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(simbaProtectiveCub)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);
    });

    it("8.3.3. Opponents must challenge a Bodyguard character if able.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [
            { card: simbaProtectiveCub, exerted: true },
            { card: mickeyMouseTrueFriend, exerted: true },
          ],
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(stitchNewDog, mickeyMouseTrueFriend) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("DEFENDER_BODYGUARD_RESTRICTION");
    });

    it("8.3.3. If more than one Bodyguard can be challenged, the attacker may choose among them.", () => {
      const firstChoiceEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [
            { card: simbaProtectiveCub, exerted: true },
            { card: ladyKluckProtectiveConfidant, exerted: true },
            { card: mickeyMouseTrueFriend, exerted: true },
          ],
        },
      );

      expect(
        firstChoiceEngine.asPlayerOne().challenge(stitchNewDog, simbaProtectiveCub),
      ).toBeSuccessfulCommand();

      const secondChoiceEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [
            { card: simbaProtectiveCub, exerted: true },
            { card: ladyKluckProtectiveConfidant, exerted: true },
            { card: mickeyMouseTrueFriend, exerted: true },
          ],
        },
      );

      expect(
        secondChoiceEngine.asPlayerOne().challenge(stitchNewDog, ladyKluckProtectiveConfidant),
      ).toBeSuccessfulCommand();
    });

    it("8.3.3. If no Bodyguard character can be challenged, the attacker may challenge another character.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [
            { card: bodyguardEvasiveDefender, exerted: true },
            { card: mickeyMouseTrueFriend, exerted: true },
          ],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(stitchNewDog, mickeyMouseTrueFriend),
      ).toBeSuccessfulCommand();
    });

    it("8.3.3. Bodyguard does not restrict challenging locations — locations are not characters.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [{ card: simbaProtectiveCub, exerted: true }, { card: neverLandMermaidLagoon }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(stitchNewDog, neverLandMermaidLagoon),
      ).toBeSuccessfulCommand();
    });

    it("8.3.3. An attacker with Evasive still must challenge a Bodyguard with Evasive if able.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [genieOnTheJob],
        },
        {
          play: [
            { card: bodyguardEvasiveDefender, exerted: true },
            { card: evasiveDefender, exerted: true },
          ],
        },
      );

      const restrictedResult = testEngine
        .asPlayerOne()
        .challenge(genieOnTheJob, evasiveDefender) as CommandFailure;

      expect(restrictedResult.success).toBe(false);
      expect(restrictedResult.errorCode).toBe("DEFENDER_BODYGUARD_RESTRICTION");
      expect(
        testEngine.asPlayerOne().challenge(genieOnTheJob, bodyguardEvasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});
