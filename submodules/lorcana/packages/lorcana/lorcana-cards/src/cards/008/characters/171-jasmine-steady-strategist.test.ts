import { describe, expect, it } from "bun:test";
import type { PlayerId } from "@tcg/lorcana-engine";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jasmineSteadyStrategist } from "./171-jasmine-steady-strategist";

const allyCharacter = createMockCharacter({
  id: "ally-match",
  name: "Ally Match",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

const nonMatchA = createMockCharacter({
  id: "non-match-a",
  name: "Non Match A",
  cost: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonMatchB = createMockCharacter({
  id: "non-match-b",
  name: "Non Match B",
  cost: 3,
  classifications: ["Dreamborn", "Villain"],
});
const PLAYER_ONE_ID = CANONICAL_PLAYER_ONE as PlayerId;
const PLAYER_TWO_ID = CANONICAL_PLAYER_TWO as PlayerId;

describe("Jasmine - Steady Strategist", () => {
  it("ALWAYS PLANNING - on quest, reveals an Ally character to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: jasmineSteadyStrategist, isDrying: false }],
      deck: [nonMatchA, allyCharacter, nonMatchB],
    });

    expect(testEngine.asPlayerOne().quest(jasmineSteadyStrategist)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jasmineSteadyStrategist),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [allyCharacter] },
          { zone: "deck-bottom", cards: [nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("hand");
  });

  it("ALWAYS PLANNING - revealed Ally put into hand is visible to the opponent", () => {
    // Bug: when the opponent (player two) quests Jasmine and selects an Ally
    // character from the top 3 to put into hand, the card must be revealed to
    // player one. Currently the reveal window is created but immediately cleared
    // inside resolveScryEffect, so the card is never actually visible to player one.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 5 },
      {
        play: [{ card: jasmineSteadyStrategist, isDrying: false }],
        deck: [nonMatchA, allyCharacter, nonMatchB],
      },
    );

    testEngine.asPlayerOne().passTurn();

    expect(testEngine.asPlayerTwo().quest(jasmineSteadyStrategist)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(jasmineSteadyStrategist),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        destinations: [{ zone: "hand", cards: [allyCharacter] }],
      }),
    ).toBeSuccessfulCommand();

    // Ally goes to player two's hand
    expect(testEngine.asPlayerTwo().getCardZone(allyCharacter)).toBe("hand");

    // The revealed Ally must be visible to the opponent (player one) because
    // the card's destination has reveal: true. A persistent reveal window must
    // be open so that the card's identity appears in player one's projected
    // board (not hidden behind a placeholder ID).
    const authBoard = testEngine.getStateForView("authoritative");
    const allyInstanceId = Object.entries(authBoard.cards).find(
      ([, c]) => c?.definitionId === allyCharacter.id,
    )?.[0];
    expect(allyInstanceId).toBeDefined();

    const p1Board = testEngine.getStateForView("playerOne");
    const allyInP1View = allyInstanceId ? p1Board.cards[allyInstanceId] : undefined;
    // If the reveal is working, allyInP1View should exist (real instance ID in
    // the projected board) and not be hidden. Without the fix the card is only
    // registered under a placeholder like "hidden:hand:player_two:0", so
    // allyInP1View is undefined and this assertion fails.
    expect(allyInP1View).toBeDefined();
    expect(allyInP1View?.hidden).not.toBe(true);
  });

  it("ALWAYS PLANNING - scry destination detail is appended privately while revealed cards stay public", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 5 },
      {
        play: [{ card: jasmineSteadyStrategist, isDrying: false }],
        deck: [nonMatchA, allyCharacter, nonMatchB],
      },
    );

    testEngine.asPlayerOne().passTurn();
    expect(testEngine.asPlayerTwo().quest(jasmineSteadyStrategist)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(jasmineSteadyStrategist),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        destinations: [{ zone: "hand", cards: [allyCharacter] }],
      }),
    ).toBeSuccessfulCommand();

    const scryLog = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .reverse()
      .find((log) => log.moveType === "resolveEffect");

    expect(scryLog).toBeDefined();
    expect(scryLog?.moveType).toBe("resolveEffect");

    // The Ally moved to hand is publicly revealed, so both viewers can render
    // that public destination message.
    expect(scryLog?.public).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.effect.resolve.scrySelection.detail",
          values: expect.objectContaining({
            destinations: expect.arrayContaining([expect.objectContaining({ zone: "hand" })]),
          }),
        }),
      ]),
    );

    // The complete destination detail is only appended for the chooser.
    expect(scryLog?.privateByPlayerId?.[PLAYER_TWO_ID]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.private.effect.resolve.scrySelection.detail",
          values: expect.objectContaining({
            destinations: expect.arrayContaining([expect.objectContaining({ zone: "hand" })]),
          }),
        }),
      ]),
    );
    expect(scryLog?.privateByPlayerId?.[PLAYER_ONE_ID]).toBeUndefined();
  });
});
