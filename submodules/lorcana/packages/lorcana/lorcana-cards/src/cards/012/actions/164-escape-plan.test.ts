import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { escapePlan } from "./164-escape-plan";

const playerOneCharacterA = createMockCharacter({
  id: "escape-plan-p1-a",
  name: "Player One Character A",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const playerOneCharacterB = createMockCharacter({
  id: "escape-plan-p1-b",
  name: "Player One Character B",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const playerOneCharacterC = createMockCharacter({
  id: "escape-plan-p1-c",
  name: "Player One Character C",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
});

const playerTwoCharacterA = createMockCharacter({
  id: "escape-plan-p2-a",
  name: "Player Two Character A",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const playerTwoCharacterB = createMockCharacter({
  id: "escape-plan-p2-b",
  name: "Player Two Character B",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const playerTwoCharacterC = createMockCharacter({
  id: "escape-plan-p2-c",
  name: "Player Two Character C",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
});

const filler1 = createMockAction({ id: "escape-plan-filler-1", name: "Filler 1", cost: 1 });
const filler2 = createMockAction({ id: "escape-plan-filler-2", name: "Filler 2", cost: 1 });

describe("Escape Plan", () => {
  it("cannot be played unless 2 or more cards were put into your discard this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [escapePlan],
        inkwell: escapePlan.cost,
      },
      {},
    );

    const result = testEngine.asPlayerOne().playCard(escapePlan);
    expect(result.success).toBe(false);
  });

  it("each player chooses 2 of their characters and puts them into their inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [escapePlan, filler1, filler2],
        inkwell: escapePlan.cost,
        play: [playerOneCharacterA, playerOneCharacterB, playerOneCharacterC],
      },
      {
        play: [playerTwoCharacterA, playerTwoCharacterB, playerTwoCharacterC],
      },
    );

    // Move two filler cards from player one's hand to their discard so the play
    // condition "2 or more cards put into your discard this turn" is satisfied.
    const filler1Id = testEngine.findCardInstanceId(filler1, "hand", PLAYER_ONE);
    const filler2Id = testEngine.findCardInstanceId(filler2, "hand", PLAYER_ONE);
    expect(
      testEngine.asServer().manualMoveCard(filler1Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualMoveCard(filler2Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    // Player one plays Escape Plan and chooses 2 of their own characters first.
    expect(
      testEngine.asPlayerOne().playCard(escapePlan, {
        targets: [playerOneCharacterA, playerOneCharacterB],
      }),
    ).toBeSuccessfulCommand();

    // The chosen player one characters are put into player one's inkwell.
    expect(testEngine.asPlayerOne().getCardZone(playerOneCharacterA)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(playerOneCharacterB)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(playerOneCharacterC)).toBe("play");

    // Player two now chooses 2 of their own characters to put into their inkwell.
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        targets: [playerTwoCharacterA, playerTwoCharacterB],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(playerTwoCharacterA)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoCharacterB)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoCharacterC)).toBe("play");
  });

  it("does as much as possible when a player has fewer than 2 characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [escapePlan, filler1, filler2],
        inkwell: escapePlan.cost,
        play: [playerOneCharacterA],
      },
      {
        play: [playerTwoCharacterA, playerTwoCharacterB],
      },
    );

    const filler1Id = testEngine.findCardInstanceId(filler1, "hand", PLAYER_ONE);
    const filler2Id = testEngine.findCardInstanceId(filler2, "hand", PLAYER_ONE);
    expect(
      testEngine.asServer().manualMoveCard(filler1Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualMoveCard(filler2Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(escapePlan)).toBeSuccessfulCommand();

    const [ownSelection] = testEngine.asPlayerOne().getPendingEffects();
    expect(ownSelection?.selectionContext).toMatchObject({
      kind: "target-selection",
      minSelections: 1,
      maxSelections: 1,
      declaredMaxSelections: 2,
      autoRejected: false,
    });
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [playerOneCharacterA],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(playerOneCharacterA)).toBe("inkwell");

    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        targets: [playerTwoCharacterA, playerTwoCharacterB],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(playerTwoCharacterA)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoCharacterB)).toBe("inkwell");
  });
});
