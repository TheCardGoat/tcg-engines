import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { ragingStorm } from "../../011/actions/028-raging-storm";
import { swordplay } from "../../011/actions/063-swordplay";
import { snowballFight } from "../../011/actions/095-snowball-fight";
import { olafSnowmanOfAction } from "./122-olaf-snowman-of-action";

describe("Olaf - Snowman of Action", () => {
  describe("ABOUT TIME! - For each action card in your discard, you pay 1 less to play this character", () => {
    it("costs full price with no action cards in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [olafSnowmanOfAction],
        inkwell: olafSnowmanOfAction.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(olafSnowmanOfAction).playCost).toBe(
        olafSnowmanOfAction.cost,
      );
      expect(testEngine.asPlayerOne().playCard(olafSnowmanOfAction)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafSnowmanOfAction)).toBe("play");
    });

    it("reduces cost based only on action cards in discard", () => {
      const nonActionCard = createMockCharacter({
        id: "olaf-test-non-action-card",
        name: "Not An Action",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [olafSnowmanOfAction],
        inkwell: olafSnowmanOfAction.cost - 2,
        discard: [ragingStorm, swordplay, nonActionCard],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(olafSnowmanOfAction).playCost).toBe(
        olafSnowmanOfAction.cost - 2,
      );
      expect(testEngine.asPlayerOne().playCard(olafSnowmanOfAction)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafSnowmanOfAction)).toBe("play");
    });

    it("reduces cost by 3 with three action cards in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [olafSnowmanOfAction],
        inkwell: olafSnowmanOfAction.cost - 3,
        discard: [ragingStorm, swordplay, snowballFight],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(olafSnowmanOfAction).playCost).toBe(
        olafSnowmanOfAction.cost - 3,
      );
      expect(testEngine.asPlayerOne().playCard(olafSnowmanOfAction)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafSnowmanOfAction)).toBe("play");
    });

    it("cannot be played with less ink than reduced cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [olafSnowmanOfAction],
        inkwell: olafSnowmanOfAction.cost - 3,
        discard: [ragingStorm, snowballFight],
        deck: 5,
      });

      // Only 2 action cards in discard (reduction=2), but only have cost-3 ink
      expect(testEngine.asPlayerOne().playCard(olafSnowmanOfAction)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafSnowmanOfAction)).toBe("hand");
    });
  });

  describe("CHAOTIC COLLISION", () => {
    it("each opponent loses 2 lore when Olaf is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [olafSnowmanOfAction],
          inkwell: olafSnowmanOfAction.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 5,
          },
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafSnowmanOfAction)).toBeSuccessfulCommand();

      // Resolve the triggered CHAOTIC COLLISION bag effect
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(olafSnowmanOfAction),
        ).toBeSuccessfulCommand();
      }

      // Opponent should have lost 2 lore (5 -> 3)
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });

    it("opponent lore does not go below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [olafSnowmanOfAction],
          inkwell: olafSnowmanOfAction.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 1,
          },
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafSnowmanOfAction)).toBeSuccessfulCommand();

      // Resolve the triggered CHAOTIC COLLISION bag effect
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(olafSnowmanOfAction),
        ).toBeSuccessfulCommand();
      }

      // Opponent had 1 lore, loses 2, but should not go below 0
      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });
  });
});
