import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chipTeamPlayer } from "./027-chip-team-player";

const sturdyAlly = createMockCharacter({
  id: "chip-tp-sturdy-ally",
  name: "Sturdy Ally",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const frailAlly = createMockCharacter({
  id: "chip-tp-frail-ally",
  name: "Frail Ally",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Chip - Team Player", () => {
  describe("RANGER RESOURCEFULNESS - When you play this character, if you have another character with 4 {W} or more in play, you may draw a card.", () => {
    it("draws a card when another character with 4+ willpower is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipTeamPlayer],
        play: [sturdyAlly],
        inkwell: chipTeamPlayer.cost,
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(chipTeamPlayer)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(chipTeamPlayer, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Chip left hand and one card was drawn: net hand count unchanged.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore);
    });

    it("does not draw a card when the controller declines the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipTeamPlayer],
        play: [sturdyAlly],
        inkwell: chipTeamPlayer.cost,
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(chipTeamPlayer)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(chipTeamPlayer, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Chip left hand but no card drawn: hand count decreases by 1.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore - 1);
    });

    it("does not draw when no other character has 4+ willpower", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipTeamPlayer],
        play: [frailAlly],
        inkwell: chipTeamPlayer.cost,
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(chipTeamPlayer)).toBeSuccessfulCommand();

      // Per CRD 6.2.7 the ability is still queued; condition is checked at resolution.
      expect(playerOne.getBagCount()).toBe(1);
      expect(
        playerOne.resolvePendingByCard(chipTeamPlayer, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Hand count decreases by 1 (only Chip was removed) – no card was drawn.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore - 1);
    });

    it("does not count Chip itself as the 'another character' satisfying the condition", () => {
      // Chip (willpower 7) will be the only character in play after resolving.
      // The condition requires ANOTHER character with 4+ willpower, so the draw must not fire.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipTeamPlayer],
        inkwell: chipTeamPlayer.cost,
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(chipTeamPlayer)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(chipTeamPlayer, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Chip left hand, no draw occurred.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore - 1);
    });
  });
});
