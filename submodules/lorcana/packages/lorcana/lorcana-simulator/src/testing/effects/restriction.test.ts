import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  mickeyMouseTrueFriend,
  stitchNewDog,
  suddenChill,
} from "@tcg/lorcana-cards/cards/001";
import { cantChallengeThisTurn } from "../rules/section-08-test-utils";

const singer3 = createMockCharacter({
  id: "restriction-singer-3",
  name: "Singer Helper",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "restriction-singer-3-singer",
      type: "keyword",
      keyword: "Singer",
      value: 3,
      text: "Singer 3",
    },
  ],
});

describe("Restriction - Ariel, On Human Legs - VOICELESS: This character can't sing songs.", () => {
  it("should prevent Ariel from singing songs", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [suddenChill],
      inkwell: suddenChill.cost,
      play: [{ card: arielOnHumanLegs, isDrying: false }],
    });

    // Ariel has cost 4, which is >= Sudden Chill cost 2, so she would normally qualify as a singer
    // But she has cant-sing restriction
    const result = testEngine
      .asPlayerOne()
      .singSong(suddenChill, arielOnHumanLegs) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("should still allow Ariel to quest normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielOnHumanLegs, isDrying: false }],
      lore: 0,
    });

    expect(testEngine.asPlayerOne().quest(arielOnHumanLegs)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(arielOnHumanLegs.lore);
  });

  it("should still allow Ariel to challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: arielOnHumanLegs, isDrying: false }],
      },
      {
        play: [{ card: stitchNewDog, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(arielOnHumanLegs, stitchNewDog),
    ).toBeSuccessfulCommand();
  });
});

describe("Restriction - Temporary cant-challenge restriction", () => {
  it("should prevent challenging for this turn only", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantChallengeThisTurn],
        inkwell: cantChallengeThisTurn.cost,
        play: [
          { card: singer3, isDrying: false },
          { card: stitchNewDog, isDrying: false },
        ],
      },
      {
        play: [{ card: mickeyMouseTrueFriend, exerted: true }],
      },
    );

    // Play the "can't challenge this turn" song by singing with singer3
    expect(
      testEngine.asPlayerOne().singSong(cantChallengeThisTurn, singer3),
    ).toBeSuccessfulCommand();

    // Should not be able to challenge this turn
    const result = testEngine
      .asPlayerOne()
      .challenge(stitchNewDog, mickeyMouseTrueFriend) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("should allow challenging again next turn after restriction expires", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantChallengeThisTurn],
        inkwell: cantChallengeThisTurn.cost,
        play: [
          { card: singer3, isDrying: false },
          { card: stitchNewDog, isDrying: false },
        ],
        deck: 2,
      },
      {
        // Exerted so can be challenged; needs to stay exerted across turns
        play: [{ card: mickeyMouseTrueFriend, exerted: true }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().singSong(cantChallengeThisTurn, singer3),
    ).toBeSuccessfulCommand();

    // Pass turn to opponent, then pass back
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // Mickey readies at start of P2's turn, then we need to exert him again
    // Actually, characters ready at start of their owner's turn
    // Mickey is P2's card, so he readies at start of P2's turn
    // Let's quest him to exert him
    expect(testEngine.asPlayerTwo().quest(mickeyMouseTrueFriend)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Now on our next turn, restriction should have expired
    // Mickey should be exerted from questing
    expect(
      testEngine.asPlayerOne().challenge(stitchNewDog, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();
  });
});
