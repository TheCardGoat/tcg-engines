import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleAccomplishedMysticEnchanted } from "./226-belle-accomplished-mystic-enchanted";

const damagedAlly = createMockCharacter({
  id: "belle-enchanted-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const opposingTarget = createMockCharacter({
  id: "belle-enchanted-opponent",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 6,
});

describe("Belle - Accomplished Mystic Enchanted", () => {
  it("has Shift 3 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleAccomplishedMysticEnchanted],
    });

    expect(testEngine.hasKeyword(belleAccomplishedMysticEnchanted, "Shift")).toBe(true);
  });

  it("moves up to 3 damage from chosen character to chosen opposing character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [belleAccomplishedMysticEnchanted],
        play: [{ card: damagedAlly, damage: 3 }],
        inkwell: belleAccomplishedMysticEnchanted.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(belleAccomplishedMysticEnchanted),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMysticEnchanted),
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
        hand: [belleAccomplishedMysticEnchanted],
        play: [{ card: damagedAlly, damage: 2 }],
        inkwell: belleAccomplishedMysticEnchanted.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(belleAccomplishedMysticEnchanted),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMysticEnchanted),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly, opposingTarget] })
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(2);
  });
});
