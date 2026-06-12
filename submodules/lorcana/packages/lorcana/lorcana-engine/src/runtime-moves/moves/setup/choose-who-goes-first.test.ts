import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "#core";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
} from "../../../testing";
import "../../../testing/register-matchers";
import { chooseWhoGoesFirst } from "./choose-who-goes-first";
import { createSetupValidationContext, type ValidationContextFor } from "./setup-move-test-context";

const PLAYER_ONE = createPlayerId(CANONICAL_PLAYER_ONE);
const PLAYER_TWO = createPlayerId(CANONICAL_PLAYER_TWO);
type ChooseWhoValidateContext = ValidationContextFor<typeof chooseWhoGoesFirst>;

describe("chooseWhoGoesFirst", () => {
  let engine: LorcanaMultiplayerTestEngine;
  const runtimePlayerIds = [PLAYER_ONE, PLAYER_TWO];

  const createValidationContext = (args: ChooseWhoValidateContext["args"]) =>
    createSetupValidationContext<ChooseWhoValidateContext>({
      state: engine.getAuthoritativeState(),
      args,
      playerIds: runtimePlayerIds,
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

  it("validates false for players outside runtime playerIds", () => {
    const invalidPlayer = createPlayerId("not-a-player");
    const validationContext = createValidationContext({
      playerId: invalidPlayer,
    });

    const result = chooseWhoGoesFirst.validate?.(validationContext);

    expect(result).toEqual({
      valid: false,
      error: `Invalid player ID: ${invalidPlayer}`,
      errorCode: "INVALID_PLAYER",
    });
  });

  it("validates true for valid players during opening phase", () => {
    const validationContext = createValidationContext({
      playerId: PLAYER_ONE,
    });

    const result = chooseWhoGoesFirst.validate?.(validationContext);

    expect(result).toEqual({ valid: true });
  });

  it("sets chosen first player and initializes mulligan state", () => {
    const chooseResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_ONE);
    expect(chooseResult.success).toBe(true);

    const runtime = engine.getServerEngine().getRuntime();

    expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_ONE, PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toHaveChoosingFirstPlayer(PLAYER_ONE);
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("mulligan");
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

    const moveLogHistory = runtime.getMoveLogHistory();
    expect(moveLogHistory.find((log) => log.moveType === "chooseFirstPlayer")).toMatchObject({
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

  it("starts pending mulligan with the chosen first player", () => {
    const chooseResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_TWO);
    expect(chooseResult.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toHaveOpeningTurnPlayer(PLAYER_TWO);
    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO, PLAYER_ONE]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);
    expect(engine.asLorcanaPlayerOne()).toBeInPhase("mulligan");
  });
});
