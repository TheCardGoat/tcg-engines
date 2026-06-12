import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lordMacguffinCleverSwordsman } from "./078-lord-macguffin-clever-swordsman";

const damagedOpposing = createMockCharacter({
  id: "lord-macguffin-damaged-opposing",
  name: "Damaged Opposing",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const healthyOpposing = createMockCharacter({
  id: "lord-macguffin-healthy-opposing",
  name: "Healthy Opposing",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("Lord MacGuffin - Clever Swordsman", () => {
  describe("WAIT FOR IT... - This character may enter play exerted to deal 3 damage to chosen damaged character.", () => {
    it("enters play ready by default and does not deal damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lordMacguffinCleverSwordsman],
          inkwell: lordMacguffinCleverSwordsman.cost,
          deck: 3,
        },
        {
          play: [{ card: damagedOpposing, damage: 1 }],
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(lordMacguffinCleverSwordsman)).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordMacguffinCleverSwordsman)).toBe(false);

      // If the trigger enters the bag, its intervening-if condition (is-exerted) must fail,
      // so resolving it must not apply damage.
      if (playerOne.getBagCount() > 0) {
        playerOne.resolvePendingByCard(lordMacguffinCleverSwordsman);
      }

      expect(testEngine.asPlayerTwo().getCard(damagedOpposing)?.damage).toBe(1);
    });

    it("enters play exerted and deals 3 damage to a chosen damaged character when resolveOptional is true", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lordMacguffinCleverSwordsman],
          inkwell: lordMacguffinCleverSwordsman.cost,
          deck: 3,
        },
        {
          play: [{ card: damagedOpposing, damage: 1 }],
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(
        playerOne.playCard(lordMacguffinCleverSwordsman, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordMacguffinCleverSwordsman)).toBe(true);
      expect(playerOne.getBagCount()).toBe(1);

      const damagedOpposingId = testEngine.findCardInstanceId(
        damagedOpposing,
        "play",
        "player_two",
      );

      expect(
        playerOne.resolvePendingByCard(lordMacguffinCleverSwordsman, {
          targets: [damagedOpposingId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(damagedOpposing)?.damage).toBe(4);
    });

    it("cannot target an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lordMacguffinCleverSwordsman],
          inkwell: lordMacguffinCleverSwordsman.cost,
          deck: 3,
        },
        {
          play: [healthyOpposing],
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(
        playerOne.playCard(lordMacguffinCleverSwordsman, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordMacguffinCleverSwordsman)).toBe(true);

      const healthyOpposingId = testEngine.findCardInstanceId(
        healthyOpposing,
        "play",
        "player_two",
      );

      expect(
        playerOne.resolvePendingByCard(lordMacguffinCleverSwordsman, {
          targets: [healthyOpposingId],
        }),
      ).not.toBeSuccessfulCommand();

      // Healthy character still has no damage
      expect(testEngine.asPlayerTwo().getCard(healthyOpposing)?.damage ?? 0).toBe(0);
    });
  });
});
