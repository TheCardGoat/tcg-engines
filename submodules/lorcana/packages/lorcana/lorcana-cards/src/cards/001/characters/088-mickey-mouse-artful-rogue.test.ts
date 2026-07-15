import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseArtfulRogue } from "./088-mickey-mouse-artful-rogue";

const opposingCharacter = createMockCharacter({
  id: "artful-rogue-opposing",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const testAction = createMockAction({
  id: "artful-rogue-test-action",
  name: "Test Action",
  cost: 1,
});

describe("Mickey Mouse - Artful Rogue", () => {
  describe("MISDIRECTION - Whenever you play an action, chosen opposing character can't quest during their next turn.", () => {
    it("applies cant-quest restriction to chosen opposing character when an action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseArtfulRogue],
          hand: [testAction],
          inkwell: mickeyMouseArtfulRogue.cost + testAction.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      const opposingInstanceId = testEngine.findCardInstanceId(
        opposingCharacter,
        "play",
        PLAYER_TWO,
      );

      expect(testEngine.asPlayerOne().playCard(testAction)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseArtfulRogue, {
          targets: [opposingInstanceId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().passTurn());

      expect(testEngine.hasRestriction(opposingCharacter, "cant-quest")).toBe(true);

      expect(testEngine.asPlayerTwo().quest(opposingInstanceId)).not.toBeSuccessfulCommand();
    });

    it("restriction does not apply during the same turn it was applied", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseArtfulRogue],
          hand: [testAction],
          inkwell: mickeyMouseArtfulRogue.cost + testAction.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      const opposingInstanceId = testEngine.findCardInstanceId(
        opposingCharacter,
        "play",
        PLAYER_TWO,
      );

      expect(testEngine.asPlayerOne().playCard(testAction)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseArtfulRogue, {
          targets: [opposingInstanceId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opposingCharacter, "cant-quest")).toBe(false);
    });

    it("does not trigger when a character is played instead of an action", () => {
      const testCharacter = createMockCharacter({
        id: "artful-rogue-test-char",
        name: "Test Character",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseArtfulRogue],
          hand: [testCharacter],
          inkwell: mickeyMouseArtfulRogue.cost + testCharacter.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(testCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      testEngine.asServer().passTurn();

      expect(testEngine.hasRestriction(opposingCharacter, "cant-quest")).toBe(false);
    });
  });
});
