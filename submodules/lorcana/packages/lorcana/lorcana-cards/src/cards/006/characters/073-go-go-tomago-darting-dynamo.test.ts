import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { goGoTomagoDartingDynamo } from "./073-go-go-tomago-darting-dynamo";

const damagedOpponent = createMockCharacter({
  id: "darting-dynamo-damaged-opponent",
  name: "Damaged Opponent",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const undamagedOpponent = createMockCharacter({
  id: "darting-dynamo-undamaged-opponent",
  name: "Undamaged Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Go Go Tomago - Darting Dynamo", () => {
  it("gains lore equal to the damage on the chosen opposing character when paying 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goGoTomagoDartingDynamo],
        inkwell: goGoTomagoDartingDynamo.cost + 2,
        deck: 3,
      },
      {
        play: [{ card: damagedOpponent, damage: 3 }],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goGoTomagoDartingDynamo)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goGoTomagoDartingDynamo, {
        resolveOptional: true,
        targets: [damagedOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
  });

  it("gains 0 lore if the chosen opposing character has no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goGoTomagoDartingDynamo],
        inkwell: goGoTomagoDartingDynamo.cost + 2,
        deck: 3,
      },
      {
        play: [undamagedOpponent],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goGoTomagoDartingDynamo)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goGoTomagoDartingDynamo, {
        resolveOptional: true,
        targets: [undamagedOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("gains no lore when the optional ability is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goGoTomagoDartingDynamo],
        inkwell: goGoTomagoDartingDynamo.cost + 2,
        deck: 3,
      },
      {
        play: [{ card: damagedOpponent, damage: 3 }],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goGoTomagoDartingDynamo)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(goGoTomagoDartingDynamo, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("does not trigger if player cannot pay 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goGoTomagoDartingDynamo],
        inkwell: goGoTomagoDartingDynamo.cost,
        deck: 3,
      },
      {
        play: [{ card: damagedOpponent, damage: 3 }],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goGoTomagoDartingDynamo)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toEqual([]);

    // No ink available to pay, no lore gained
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
