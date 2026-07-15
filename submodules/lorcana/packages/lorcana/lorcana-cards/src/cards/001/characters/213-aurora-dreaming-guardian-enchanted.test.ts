import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { auroraDreamingGuardianEnchanted } from "./213-aurora-dreaming-guardian-enchanted";

const otherCharacter = createMockCharacter({
  id: "other-char",
  name: "Other Character",
  cost: 2,
});

const auroraShiftBase = createMockCharacter({
  id: "aurora-shift-base",
  name: "Aurora",
  cost: 2,
});

describe("Aurora - Dreaming Guardian Enchanted", () => {
  describe("PROTECTIVE EMBRACE — Your other characters gain Ward.", () => {
    it("other characters gain Ward while Aurora is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraDreamingGuardianEnchanted, otherCharacter],
      });

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(true);
    });

    it("Aurora herself does not gain Ward from her own ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraDreamingGuardianEnchanted, otherCharacter],
      });

      expect(testEngine.asPlayerOne().hasKeyword(auroraDreamingGuardianEnchanted, "Ward")).toBe(
        false,
      );
    });

    it("opponent's characters do not gain Ward", () => {
      const opponentCharacter = createMockCharacter({
        id: "opponent-char",
        name: "Opponent Character",
        cost: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [auroraDreamingGuardianEnchanted],
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(opponentCharacter, "Ward")).toBe(false);
    });

    it("Ward is removed when Aurora leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraDreamingGuardianEnchanted, otherCharacter],
      });

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(true);

      const auroraInstanceId = testEngine.findCardInstanceId(
        auroraDreamingGuardianEnchanted,
        "play",
        PLAYER_ONE,
      );
      testEngine.asServer().manualMoveCard(auroraInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(false);
    });
  });

  describe("Shift 3", () => {
    it("can be played for 3 ink on top of another Aurora character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraShiftBase],
        hand: [auroraDreamingGuardianEnchanted],
        inkwell: 3,
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(auroraShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(auroraDreamingGuardianEnchanted, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();
    });
  });
});
