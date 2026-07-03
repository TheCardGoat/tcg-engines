import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateCondition } from "../../condition-evaluator";
import { PLAYER_ONE } from "../../../testing/unit-harness/fixtures";

const playedCardId = "played-song" as CardInstanceId;
const triggerSourceCardId = "trigger-source-song" as CardInstanceId;

function createContext(
  keyword: string | undefined,
  options?: { triggerSourceKeyword?: string | undefined },
) {
  return {
    playerId: PLAYER_ONE as PlayerId,
    framework: {
      state: {
        currentPlayer: PLAYER_ONE,
        playerIds: [PLAYER_ONE],
      },
      zones: {
        getCards: () => [],
      },
    },
    cards: {
      getDefinition: (cardId: CardInstanceId) =>
        cardId === playedCardId
          ? {
              id: playedCardId,
              cardType: "action",
              abilities: keyword ? [{ type: "keyword", keyword }] : [],
            }
          : cardId === triggerSourceCardId
            ? {
                id: triggerSourceCardId,
                cardType: "action",
                abilities: options?.triggerSourceKeyword
                  ? [{ type: "keyword", keyword: options.triggerSourceKeyword }]
                  : [],
              }
            : undefined,
      require: () => ({}),
    },
    cardPlayed: {
      playerId: PLAYER_ONE,
      cardId: playedCardId,
      cardType: "action",
      costType: "singTogether",
    },
    resolutionInput:
      options && "triggerSourceKeyword" in options
        ? { eventSnapshot: { triggerSourceCardId } }
        : undefined,
    G: {},
  } as unknown as Parameters<typeof evaluateCondition>[1];
}

describe("played-card-has-keyword", () => {
  it("passes when the played card has the requested keyword", () => {
    const condition: Condition = {
      type: "played-card-has-keyword",
      keyword: "SingTogether",
    };

    expect(evaluateCondition(condition, createContext("SingTogether"))).toBe(true);
  });

  it("fails when the played card lacks the requested keyword", () => {
    const condition: Condition = {
      type: "played-card-has-keyword",
      keyword: "SingTogether",
    };

    expect(evaluateCondition(condition, createContext(undefined))).toBe(false);
  });

  it("checks the trigger source card when available", () => {
    const condition: Condition = {
      type: "played-card-has-keyword",
      keyword: "SingTogether",
    };

    expect(
      evaluateCondition(
        condition,
        createContext(undefined, { triggerSourceKeyword: "SingTogether" }),
      ),
    ).toBe(true);
  });
});
