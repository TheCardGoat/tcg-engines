// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  friendsOnTheOtherSide,
  mickeyMouseTrueFriend,
  stitchNewDog,
  teKTheBurningOne,
} from "@tcg/lorcana-cards/cards/001";
import { tryEverything } from "@tcg/lorcana-cards/cards/005";
import {
  cantChallengeThisTurn,
  evasiveDefender,
  recklessCantChallengeCharacter,
} from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.7. Reckless", () => {
    it("8.7.2. Reckless characters can't quest.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [teKTheBurningOne],
      });

      const result = testEngine.asPlayerOne().quest(teKTheBurningOne) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("RECKLESS_CANT_QUEST");
    });

    it("8.7.3. You can't end your turn while a ready Reckless character can challenge.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKTheBurningOne],
        },
        {
          play: [{ card: stitchNewDog, exerted: true }],
        },
      );

      const result = testEngine.asPlayerOne().passTurn() as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("PASS_TURN_RECKLESS_CHALLENGE_REQUIRED");

      // You can pass normally otherwise
      const canPassTurnEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKTheBurningOne],
        },
        {
          play: [{ card: stitchNewDog, exerted: false }],
        },
      );

      expect(canPassTurnEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    });

    it("8.7.4. Reckless doesn't stop a character from exerting to sing a song.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [friendsOnTheOtherSide],
        play: [{ card: teKTheBurningOne, isDrying: false }],
        deck: [stitchNewDog, mickeyMouseTrueFriend],
      });

      expect(
        testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, teKTheBurningOne).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(teKTheBurningOne)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    });

    it("8.7.3. A ready Reckless character can end the turn if the only opposing target has Evasive.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKTheBurningOne],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    });

    it("8.7.3. A ready Reckless character can end the turn if that character can't challenge.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tryEverything],
          inkwell: tryEverything.cost,
          play: [{ card: recklessCantChallengeCharacter, damage: 1, exerted: true }],
          deck: 1,
        },
        {
          play: [{ card: stitchNewDog, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCardTo(tryEverything, recklessCantChallengeCharacter),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    });

    it("8.7.3. A ready Reckless character can end the turn if its controller can't challenge.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cantChallengeThisTurn],
          inkwell: cantChallengeThisTurn.cost,
          play: [teKTheBurningOne],
          deck: 1,
        },
        {
          play: [{ card: stitchNewDog, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cantChallengeThisTurn)).toBeSuccessfulCommand();
      expect(testEngine.asServer().hasPlayerRestriction("player_one", "cant-challenge")).toBe(true);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    });
  });
});
