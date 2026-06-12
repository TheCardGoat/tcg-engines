import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  friendsOnTheOtherSide,
  mauiHeroToAll,
  mickeyMouseTrueFriend,
  stitchNewDog,
  teKTheBurningOne,
} from "@tcg/lorcana-cards/cards/001";
import { tryEverything } from "@tcg/lorcana-cards/cards/005";
import {
  cantChallengeThisTurn,
  evasiveDefender,
  recklessCantChallengeCharacter,
} from "../rules/section-08-test-utils";

describe("Reckless - Te Kā, The Burning One - Reckless (This character can't quest and must challenge each turn if able.)", () => {
  it("Reckless characters can't quest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [teKTheBurningOne],
    });

    const result = testEngine.asPlayerOne().quest(teKTheBurningOne) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("RECKLESS_CANT_QUEST");
  });

  it("You can't end your turn while a ready Reckless character can challenge", () => {
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
  });

  it("A ready Reckless character can end the turn if the only opposing target has Evasive", () => {
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

  it("A ready Reckless character can end the turn if that character can't challenge", () => {
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

  it("A ready Reckless character can end the turn if its controller can't challenge", () => {
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

  it("Reckless doesn't stop a character from exerting to sing a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [friendsOnTheOtherSide],
      play: [{ card: teKTheBurningOne, isDrying: false }],
      deck: [stitchNewDog, mickeyMouseTrueFriend],
    });

    expect(testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, teKTheBurningOne).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().isExerted(teKTheBurningOne)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});

describe("Rush + Reckless - Maui, Hero to All - Rush, Reckless", () => {
  it("A Rush+Reckless character can challenge the turn it's played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mauiHeroToAll],
        inkwell: mauiHeroToAll.cost,
      },
      {
        play: [{ card: stitchNewDog, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(mauiHeroToAll)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(mauiHeroToAll, stitchNewDog)).toBeSuccessfulCommand();
  });
});
