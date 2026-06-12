import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleAccomplishedMystic } from "./036-belle-accomplished-mystic";

const damagedAlly = createMockCharacter({
  id: "belle-mystic-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const opposingTarget = createMockCharacter({
  id: "belle-mystic-opponent",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 6,
});

const anotherOpponent = createMockCharacter({
  id: "belle-mystic-opponent-2",
  name: "Another Opponent",
  cost: 2,
  strength: 2,
  willpower: 6,
});

describe("Belle - Accomplished Mystic", () => {
  it("has Shift 3 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleAccomplishedMystic],
    });

    expect(testEngine.hasKeyword(belleAccomplishedMystic, "Shift")).toBe(true);
  });

  it("moves up to 3 damage from chosen character to chosen opposing character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [belleAccomplishedMystic],
        play: [{ card: damagedAlly, damage: 3 }],
        inkwell: belleAccomplishedMystic.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMystic),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly, opposingTarget] })
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(3);
  });

  it("moves only available damage when source has less than 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [belleAccomplishedMystic],
        play: [{ card: damagedAlly, damage: 2 }],
        inkwell: belleAccomplishedMystic.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMystic),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly, opposingTarget] })
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(2);
  });

  it("moves 1 damage when multiple own characters could be the source and multiple opponents are valid destinations", () => {
    const extraAlly = createMockCharacter({
      id: "belle-mystic-ally-2",
      name: "Extra Ally",
      cost: 2,
      strength: 2,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [belleAccomplishedMystic],
        play: [{ card: damagedAlly, damage: 1 }, extraAlly],
        inkwell: belleAccomplishedMystic.cost,
      },
      {
        play: [opposingTarget, anotherOpponent],
      },
    );

    expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMystic),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly, opposingTarget] })
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(1);
    expect(testEngine.asPlayerOne().getCard(extraAlly)?.damage).toBe(0);
    expect(testEngine.asPlayerTwo().getCard(anotherOpponent)?.damage).toBe(0);
  });

  it("can choose to move fewer than 3 damage using amount parameter", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [belleAccomplishedMystic],
        play: [{ card: damagedAlly, damage: 4 }],
        inkwell: belleAccomplishedMystic.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMystic),
    ).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolveNextPending({ targets: [damagedAlly, opposingTarget], amount: 2 }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(2);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(2);
  });
});
