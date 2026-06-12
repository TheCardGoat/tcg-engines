import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { helgaSinclairNoBackupNeeded } from "./073-helga-sinclair-no-backup-needed";

const filler1 = createMockAction({ id: "helga-filler-1", name: "Filler 1", cost: 1 });
const filler2 = createMockAction({ id: "helga-filler-2", name: "Filler 2", cost: 1 });

describe("Helga Sinclair - No Backup Needed", () => {
  describe("CRISIS MANAGEMENT - If 2 or more cards were put into your discard this turn, you pay 2 {I} less to play this character.", () => {
    it("costs 2 less when 2 cards have been put into your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [helgaSinclairNoBackupNeeded, filler1, filler2],
        inkwell: helgaSinclairNoBackupNeeded.cost - 2, // Only reduced cost available
        deck: 5,
      });

      // Move two filler cards from player one's hand to their discard so the
      // "2 or more cards put into your discard this turn" condition is satisfied.
      const filler1Id = testEngine.findCardInstanceId(filler1, "hand", PLAYER_ONE);
      const filler2Id = testEngine.findCardInstanceId(filler2, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(filler1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(filler2Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(helgaSinclairNoBackupNeeded),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(helgaSinclairNoBackupNeeded)).toBe("play");
    });

    it("does not reduce cost when only 1 card has been put into your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [helgaSinclairNoBackupNeeded, filler1, filler2],
        inkwell: helgaSinclairNoBackupNeeded.cost - 1, // Not enough without full discount
        deck: 5,
      });

      // Only one card is put into the discard this turn — condition should fail.
      const filler1Id = testEngine.findCardInstanceId(filler1, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(filler1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      const result = testEngine.asPlayerOne().playCard(helgaSinclairNoBackupNeeded);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(helgaSinclairNoBackupNeeded)).toBe("hand");
    });

    it("costs full price when no cards have been put into your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [helgaSinclairNoBackupNeeded],
        inkwell: helgaSinclairNoBackupNeeded.cost - 1, // Not enough without discount
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(helgaSinclairNoBackupNeeded);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(helgaSinclairNoBackupNeeded)).toBe("hand");
    });

    it("can be played at full cost without the discount", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [helgaSinclairNoBackupNeeded],
        inkwell: helgaSinclairNoBackupNeeded.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(helgaSinclairNoBackupNeeded),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(helgaSinclairNoBackupNeeded)).toBe("play");
    });
  });
});
