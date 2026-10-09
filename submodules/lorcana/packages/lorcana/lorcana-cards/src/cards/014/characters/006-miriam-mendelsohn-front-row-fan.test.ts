// CR 2.2.0: 8.13.1 Support and 6.6.1.2 combined modifiers.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { miriamMendelsohnFrontrowFan } from "./006-miriam-mendelsohn-front-row-fan";

const supportTarget = createMockCharacter({
  id: "miriam-support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Miriam Mendelsohn - Front-Row Fan", () => {
  it("can decline Support without adding strength", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: miriamMendelsohnFrontrowFan, isDrying: false }, supportTarget],
      deck: 6,
    });
    expect(game.asPlayerOne().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolveOnlyBag({ resolveOptional: false })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(2);
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().isExerted(miriamMendelsohnFrontrowFan)).toBe(true);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("adds her strength to a chosen character when questing (Support)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: miriamMendelsohnFrontrowFan, isDrying: false }, supportTarget],
      deck: 6,
    });

    expect(testEngine.asPlayerOne().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      (supportTarget.strength ?? 0) + (miriamMendelsohnFrontrowFan.strength ?? 0),
    );
  });

  it("support bonus expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: miriamMendelsohnFrontrowFan, isDrying: false }, supportTarget],
        deck: 6,
      },
      { deck: 6 },
    );

    expect(testEngine.asPlayerOne().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(supportTarget)).toBe(2);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });

  it("rejects herself but can support an opposing character until turn end", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [miriamMendelsohnFrontrowFan], deck: 6 },
      { play: [supportTarget], deck: 6 },
    );
    expect(game.asPlayerOne().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [miriamMendelsohnFrontrowFan],
      }).success,
    ).toBe(false);
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(game.asPlayerOne().getCardStrength(miriamMendelsohnFrontrowFan)).toBe(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardStrength(supportTarget)).toBe(3);
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardStrength(supportTarget)).toBe(2);
  });
  it("quests and supports another character for Player Two", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { play: [miriamMendelsohnFrontrowFan, supportTarget], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(1);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().getCardStrength(supportTarget)).toBe(3);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(2);
  });
});

it.each([2, -1])(
  "Player Two Support reads current strength after a %s change in the bag",
  (modifier: number) => {
    const observer = createMockItem({
      id: `miriam-current-${modifier}`,
      name: "Current Strength Observer",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [supportTarget], deck: 6 },
      { play: [miriamMendelsohnFrontrowFan, observer], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(2);
    expect(
      game.asPlayerTwo().resolvePendingByCard(observer, { targets: [miriamMendelsohnFrontrowFan] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardStrength(miriamMendelsohnFrontrowFan)).toBe(1 + modifier);
    expect(
      game.asPlayerOne().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      game.asPlayerTwo().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [miriamMendelsohnFrontrowFan],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      game.asPlayerTwo().resolvePendingByCard(miriamMendelsohnFrontrowFan, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(3 + modifier);
    expect(game.asPlayerTwo().getCardStrength(miriamMendelsohnFrontrowFan)).toBe(1 + modifier);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(2);
    expect(game.asPlayerTwo().getCardStrength(miriamMendelsohnFrontrowFan)).toBe(1);
  },
);

it("exact Miriam copies transfer increased strength and combine Support bonuses until turn end", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [supportTarget], deck: 6 },
    {
      play: [miriamMendelsohnFrontrowFan, miriamMendelsohnFrontrowFan, miriamMendelsohnFrontrowFan],
      deck: 6,
    },
  );
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(copies[0])).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(copies[0], { resolveOptional: true, targets: [copies[1]] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(copies[1])).toBe(2);
  expect(game.asPlayerTwo().getCardStrength(copies[2])).toBe(1);
  expect(game.asPlayerTwo().quest(copies[1])).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(copies[1], { resolveOptional: true, targets: [supportTarget] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(4);
  expect(game.asPlayerTwo().quest(copies[2])).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(copies[2], { resolveOptional: true, targets: [supportTarget] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(5);
  expect(game.getLore(PLAYER_TWO)).toBe(3);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(2);
  for (const copy of copies) expect(game.asPlayerTwo().getCardStrength(copy)).toBe(1);
});

it("Support with only Miriam in play completes without a target or strength change", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [miriamMendelsohnFrontrowFan],
    deck: 6,
  });
  expect(game.asPlayerOne().quest(miriamMendelsohnFrontrowFan)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardStrength(miriamMendelsohnFrontrowFan)).toBe(1);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  expect(game.getLore(PLAYER_ONE)).toBe(1);
});
