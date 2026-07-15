import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { type CardInstanceId, createPlayerId } from "#core";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
} from "../../../testing";
import "../../../testing/register-matchers";
import { alterHand } from "./alter-hand";
import { createSetupValidationContext, type ValidationContextFor } from "./setup-move-test-context";

const PLAYER_ONE = createPlayerId(CANONICAL_PLAYER_ONE);
const PLAYER_TWO = createPlayerId(CANONICAL_PLAYER_TWO);

type AlterHandValidateContext = ValidationContextFor<typeof alterHand>;

describe("alterHand", () => {
  let engine: LorcanaMultiplayerTestEngine;

  const createValidationContext = (args: AlterHandValidateContext["args"]) => {
    return createSetupValidationContext<AlterHandValidateContext>({
      state: engine.getAuthoritativeState(),
      args,
      playerIds: [PLAYER_ONE, PLAYER_TWO],
      playerId: PLAYER_ONE,
    });
  };

  beforeEach(() => {
    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: 0, deck: 60 },
      { hand: 0, deck: 60 },
      { skipPreGame: false },
    );

    // We don't have direct board setup in the mulligan phase, so seed the flow
    // from the authoritative startup path.
    const chooseResult = engine.asLorcanaPlayerOne().chooseFirstPlayer(PLAYER_ONE);
    expect(chooseResult.success).toBe(true);
  });

  afterEach(() => {
    engine?.dispose();
  });

  it("validates false for players outside runtime playerIds", () => {
    const validationContext = createValidationContext({
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

  it("validates false when any mulligan card is not in the player's hand", () => {
    const validationContext = createValidationContext({
      playerId: PLAYER_ONE,
      cardsToMulligan: ["not-a-card" as CardInstanceId],
    });

    const result = alterHand.validate?.(validationContext);

    expect(result).toEqual({
      valid: false,
      error: "Card not-a-card not in hand",
      errorCode: "CARD_NOT_IN_HAND",
    });
  });

  it("validates true when all selected cards are in hand", () => {
    const handCards = engine.getCardInstanceIdsInZone("hand", PLAYER_ONE);

    const validationContext = createValidationContext({
      playerId: PLAYER_ONE,
      cardsToMulligan: handCards,
    });

    const result = alterHand.validate?.(validationContext);

    expect(result).toEqual({ valid: true });
  });

  it("validates true for a valid player when cards to mulligan are empty", () => {
    const validationContext = createValidationContext({
      playerId: PLAYER_ONE,
      cardsToMulligan: [],
    });

    const result = alterHand.validate?.(validationContext);

    expect(result).toEqual({ valid: true });
  });

  it("moves selected cards to the deck and redraws the same number", () => {
    const handCards = engine.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    const cardsToMulligan = [...handCards] as CardInstanceId[];

    const result = engine.asLorcanaPlayerOne().mulligan(cardsToMulligan);
    expect(result.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);
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
  });

  it("emits a mixed-visibility mulligan log entry with public count and private detail", () => {
    const handCards = engine.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    const cardsToMulligan = handCards.slice(0, 2);

    const result = engine.asLorcanaPlayerOne().mulligan(cardsToMulligan);
    expect(result.success).toBe(true);

    const moveLogHistory = engine.getServerEngine().getRuntime().getMoveLogHistory();
    const mulliganEntry = [...moveLogHistory].reverse().find((log) => log.moveType === "alterHand");

    expect(mulliganEntry).toBeDefined();
    expect(mulliganEntry).toMatchObject({
      moveType: "alterHand",
      playerId: PLAYER_ONE,
      public: [
        {
          key: "lorcana.setup.mulligan.count",
          values: {
            playerId: PLAYER_ONE,
            count: 2,
          },
        },
      ],
      privateByPlayerId: {
        [PLAYER_ONE]: [
          {
            key: "lorcana.private.setup.mulligan.detail",
            values: {
              playerId: PLAYER_ONE,
              mulliganed: cardsToMulligan,
            },
          },
        ],
      },
    });
    expect(mulliganEntry?.privateByPlayerId?.[PLAYER_TWO]).toBeUndefined();
  });

  it("draws mulligan replacements from the top of deck", () => {
    const handCards = engine.getCardInstanceIdsInZone("hand", PLAYER_ONE);

    const result = engine.asLorcanaPlayerOne().mulligan(handCards);
    expect(result.success).toBe(true);

    const newHand = engine.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    const overlap = newHand.filter((cardId) => handCards.includes(cardId));

    expect(overlap).toEqual([]);
  });

  it("advances priority to the next player after a mulligan", () => {
    const firstMulligan = engine.asLorcanaPlayerOne().mulligan([] as CardInstanceId[]);
    expect(firstMulligan.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([PLAYER_TWO]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);

    const secondMulligan = engine.asLorcanaPlayerTwo().mulligan([] as CardInstanceId[]);
    expect(secondMulligan.success).toBe(true);

    expect(engine.asLorcanaPlayerOne()).toHavePendingMulligan([]);
    expect(engine.asLorcanaPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
  });
});
