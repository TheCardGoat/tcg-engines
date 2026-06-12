import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseCompassionateFriend } from "./024-minnie-mouse-compassionate-friend";

const woundedAlly = createMockCharacter({
  id: "minnie-cf-wounded-ally",
  name: "Wounded Ally",
  cost: 2,
  willpower: 6,
});

describe("Minnie Mouse - Compassionate Friend", () => {
  describe("PATCH THEM UP - Whenever this character quests, you may remove up to 2 damage from chosen character.", () => {
    it("removes up to 2 damage from a chosen character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 5,
        play: [
          { card: minnieMouseCompassionateFriend, isDrying: false },
          { card: woundedAlly, damage: 4 },
        ],
      });

      expect(
        testEngine.asPlayerOne().quest(minnieMouseCompassionateFriend),
      ).toBeSuccessfulCommand();

      // Resolve the optional triggered ability - accept and target the wounded ally
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseCompassionateFriend, {
          resolveOptional: true,
          targets: [woundedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Resolve the amount (upTo: true means we choose how much to remove)
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        expect(testEngine.asPlayerOne().resolveNextPending({ amount: 2 })).toBeSuccessfulCommand();
      }

      // Ally should have 2 damage remaining (4 - 2 = 2)
      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(2);
    });

    it("optional - no damage removed when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 5,
        play: [
          { card: minnieMouseCompassionateFriend, isDrying: false },
          { card: woundedAlly, damage: 4 },
        ],
      });

      expect(
        testEngine.asPlayerOne().quest(minnieMouseCompassionateFriend),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseCompassionateFriend, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(4);
    });

    it("removes only available damage if less than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 5,
        play: [
          { card: minnieMouseCompassionateFriend, isDrying: false },
          { card: woundedAlly, damage: 1 },
        ],
      });

      expect(
        testEngine.asPlayerOne().quest(minnieMouseCompassionateFriend),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseCompassionateFriend, {
          resolveOptional: true,
          targets: [woundedAlly],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        expect(testEngine.asPlayerOne().resolveNextPending({ amount: 2 })).toBeSuccessfulCommand();
      }

      // Only 1 damage was present, so damage should be 0
      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(0);
    });

    it("gains lore from questing (card has lore value 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 5,
        play: [
          { card: minnieMouseCompassionateFriend, isDrying: false },
          { card: woundedAlly, damage: 4 },
        ],
      });

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().quest(minnieMouseCompassionateFriend),
      ).toBeSuccessfulCommand();

      // Resolve the ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseCompassionateFriend, {
          resolveOptional: true,
          targets: [woundedAlly],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
      }

      // Should gain 2 lore from questing (Minnie's lore value)
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });
  });
});
