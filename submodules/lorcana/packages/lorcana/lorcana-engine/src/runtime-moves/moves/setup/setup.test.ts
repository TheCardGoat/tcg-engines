/**
 * Runtime Core Moves Tests
 *
 * Basic tests for fixture initialization and baseline state.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId, type CardInstanceId } from "#core";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
} from "../../../testing";
import "../../../testing/register-matchers";
import { alterHand } from "./alter-hand";
import { chooseWhoGoesFirst } from "./choose-who-goes-first";
import { createSetupValidationContext, type ValidationContextFor } from "./setup-move-test-context";

const PLAYER_ONE = createPlayerId(CANONICAL_PLAYER_ONE);
const PLAYER_TWO = createPlayerId(CANONICAL_PLAYER_TWO);
const RUNTIME_PLAYERS = [PLAYER_ONE, PLAYER_TWO] as const;

type ChooseWhoValidateContext = ValidationContextFor<typeof chooseWhoGoesFirst>;
type AlterHandValidateContext = ValidationContextFor<typeof alterHand>;

describe("chooseFirstPlayer", () => {
  let engine: LorcanaMultiplayerTestEngine;

  const createChooseWhoValidationContext = (args: ChooseWhoValidateContext["args"]) =>
    createSetupValidationContext<ChooseWhoValidateContext>({
      state: engine.getAuthoritativeState(),
      args,
      playerIds: [...RUNTIME_PLAYERS],
      playerId: PLAYER_ONE,
    });

  const createAlterHandValidationContext = (args: AlterHandValidateContext["args"]) =>
    createSetupValidationContext<AlterHandValidateContext>({
      state: engine.getAuthoritativeState(),
      args,
      playerIds: [...RUNTIME_PLAYERS],
      playerId: PLAYER_ONE,
    });

  beforeEach(() => {
    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: 0, deck: 60 },
      { hand: 0, deck: 60 },
      { skipPreGame: false },
    );
  });

  afterEach(() => {
    engine?.dispose();
  });

  it("Happy Path", () => {
    expect(engine.asLorcanaPlayerOne()).toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_ONE,
      count: 0,
    });
    expect(engine.asLorcanaPlayerTwo()).toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_TWO,
      count: 0,
    });

    const chooseFirstResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_ONE);
    expect(chooseFirstResult.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_ONE,
      count: 7,
    });
    expect(engine.asLorcanaPlayerOne()).toHaveCardCountInZone({
      zone: "deck",
      player: PLAYER_ONE,
      count: 53,
    });
    expect(engine.asLorcanaPlayerTwo()).toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_TWO,
      count: 7,
    });
    expect(engine.asLorcanaPlayerTwo()).toHaveCardCountInZone({
      zone: "deck",
      player: PLAYER_TWO,
      count: 53,
    });

    const playerOneHandInstanceIdsBeforeMulligan = engine.getCardInstanceIdsInZone(
      "hand",
      PLAYER_ONE,
    );
    const playerTwoHandInstanceIdsBeforeMulligan = engine.getCardInstanceIdsInZone(
      "hand",
      PLAYER_TWO,
    );

    const playerOneMulligan = engine
      .asLorcanaPlayerOne()
      .mulligan(playerOneHandInstanceIdsBeforeMulligan);
    expect(playerOneMulligan.success).toBe(true);
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);

    const playerTwoMulligan = engine
      .asLorcanaPlayerTwo()
      .mulligan(playerTwoHandInstanceIdsBeforeMulligan);
    expect(playerTwoMulligan.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_ONE,
      count: 7,
    });
    expect(engine.asLorcanaPlayerTwo()).toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_TWO,
      count: 7,
    });

    expect(engine.asLorcanaPlayerOne()).toBeInGameSegment("mainGame");
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("main");
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
  });

  it("custom matchers should support .not and provide contextual failure messages", () => {
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([]);
    expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(undefined);
    expect(engine.asLorcanaPlayerOne()).toHaveChoosingFirstPlayer(PLAYER_ONE);

    expect(engine.asLorcanaPlayerOne()).not.toHaveCardCountInZone({
      zone: "hand",
      player: PLAYER_ONE,
      count: 1,
    });
    expect(engine.asLorcanaPlayerOne()).not.toHavePriorityPlayer(PLAYER_TWO);
    expect(engine.asLorcanaPlayerOne()).not.toHavePendingMulligan([PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).not.toHaveOpeningTurnPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).not.toHaveChoosingFirstPlayer(PLAYER_TWO);

    expect(() =>
      expect(engine.asLorcanaPlayerOne()).toHaveCardCountInZone({
        zone: "hand",
        player: PLAYER_ONE,
        count: 1,
      }),
    ).toThrow(/Expected zone 'hand' for player 'player_one' to have card count 1 but received 0\./);

    expect(() => expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO])).toThrow(
      /Expected pending mulligan to be/,
    );
    expect(() => expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(PLAYER_ONE)).toThrow(
      /Expected opening-turn player to be/,
    );
    expect(() => expect(engine.asLorcanaPlayerOne()).toHaveChoosingFirstPlayer(PLAYER_TWO)).toThrow(
      /Expected choosing-first-player to be/,
    );
  });

  it("should reject chooseFirstPlayer with a player ID outside runtime playerIds", () => {
    const invalidPlayer = createPlayerId("not-a-player");
    const validationContext = createChooseWhoValidationContext({ playerId: invalidPlayer });
    const result = chooseWhoGoesFirst.validate?.(validationContext);

    expect(result).toEqual({
      valid: false,
      error: `Invalid player ID: ${invalidPlayer}`,
      errorCode: "INVALID_PLAYER",
    });
  });

  it("should emit a public first-player-chosen game log entry when chooseFirstPlayer executes", () => {
    const runtime = engine.getServerEngine().getRuntime();
    const chooseFirstResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_ONE);
    expect(chooseFirstResult.success).toBe(true);

    const moveLogHistory = runtime.getMoveLogHistory();
    const entry = moveLogHistory.find((log) => log.moveType === "chooseFirstPlayer");

    expect(entry).toBeDefined();
    expect(entry).toMatchObject({
      moveType: "chooseFirstPlayer",
      playerId: PLAYER_ONE,
      public: [
        {
          key: "lorcana.setup.firstPlayerChosen",
          values: {
            chooser: PLAYER_ONE,
            chosen: PLAYER_ONE,
          },
        },
      ],
    });
  });

  it("should reject alterHand with a player ID outside runtime playerIds", () => {
    const validationContext = createAlterHandValidationContext({
      playerId: createPlayerId("not-a-player"),
      cardsToMulligan: [],
    });
    const result = alterHand.validate?.(validationContext);

    expect(result).toEqual({
      valid: false,
      error: "Invalid player",
      errorCode: "INVALID_PLAYER",
    });
  });

  it("should choose firstPlayer as OTP and move game to mulligan", () => {
    const chooseResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_ONE);
    expect(chooseResult.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toBeInGameSegment("startingAGame");
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("mulligan");
    expect(engine.asLorcanaPlayerOne().getTurnNumber()).toBe(0);
    expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHaveChoosingFirstPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_ONE, PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
  });

  it("should choose secondPlayer as OTP and move game to mulligan", () => {
    const chooseResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_TWO);
    expect(chooseResult.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toBeInGameSegment("startingAGame");
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("mulligan");
    expect(engine.asLorcanaPlayerOne().getTurnNumber()).toBe(0);
    expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(PLAYER_TWO);
    expect(engine.asLorcanaPlayerOne()).toHaveChoosingFirstPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO, PLAYER_ONE]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);
  });

  it("should reject a non-designated player authoritatively and keep state unchanged", () => {
    engine.asLorcanaPlayerTwo().chooseFirstPlayer(PLAYER_TWO);

    expect(engine.asLorcanaPlayerOne()).toBeInGameSegment("startingAGame");
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("chooseFirstPlayer");
    expect(engine.asLorcanaPlayerOne().getTurnNumber()).toBe(0);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHaveChoosingFirstPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([]);
    expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(undefined);
  });

  it("should hand mulligan priority to the next player and auto-advance into main", () => {
    const chooseResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_ONE);
    expect(chooseResult.success).toBe(true);

    const firstMulligan = engine.asLorcanaPlayerOne().mulligan([] as CardInstanceId[]);
    expect(firstMulligan.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toBeInPhase("mulligan");
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);

    const secondMulligan = engine.asLorcanaPlayerTwo().mulligan([] as CardInstanceId[]);
    expect(secondMulligan.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toBeInGameSegment("mainGame");
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("main");
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
  });
});
