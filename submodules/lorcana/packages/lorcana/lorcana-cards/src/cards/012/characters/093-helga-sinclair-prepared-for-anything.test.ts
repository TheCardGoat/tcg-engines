import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { helgaSinclairPreparedForAnything } from "./093-helga-sinclair-prepared-for-anything";

const opposingTarget = createMockCharacter({
  id: "helga-prepared-target",
  name: "Opposing Target",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const discardFodder = createMockCharacter({
  id: "helga-prepared-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const discardFodder2 = createMockCharacter({
  id: "helga-prepared-fodder-2",
  name: "Discard Fodder 2",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Helga Sinclair - Prepared for Anything", () => {
  describe("COMBAT TRAINING - Whenever this character quests, deal 1 damage to chosen opposing character. If 2 or more cards were put into your discard this turn, deal 2 damage instead.", () => {
    it("deals 1 damage to chosen opposing character when fewer than 2 cards entered your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: helgaSinclairPreparedForAnything, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: opposingTarget, isDrying: false }],
          deck: 1,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.quest(helgaSinclairPreparedForAnything)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(helgaSinclairPreparedForAnything, {
          targets: [opposingTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(1);
    });

    it("deals 2 damage to chosen opposing character when 2 or more cards were put into your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: helgaSinclairPreparedForAnything, isDrying: false }],
          hand: [discardFodder, discardFodder2],
          deck: 1,
        },
        {
          play: [{ card: opposingTarget, isDrying: false }],
          deck: 1,
        },
      );

      // Put two of Player One's cards into their discard this turn so the metric
      // condition (2+ cards put into discard this turn) is satisfied.
      const fodder1Id = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      const fodder2Id = testEngine.findCardInstanceId(discardFodder2, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodder1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodder2Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.quest(helgaSinclairPreparedForAnything)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(helgaSinclairPreparedForAnything, {
          targets: [opposingTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(2);
    });
  });
});
