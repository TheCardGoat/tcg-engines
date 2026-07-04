import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import { createLorcanaGameLogEntry } from "../types/log-messages";
import type { ProjectedLogEntry } from "../core/runtime/match-runtime.types";
import { privateField } from "../core/runtime/private-field";
import { buildMoveLog } from "./move-log-factory";

const playerOneId = "player_one" as PlayerId;
const playerTwoId = "player_two" as PlayerId;
const sourceCardId = "source-card" as CardInstanceId;
const targetCardId = "target-card" as CardInstanceId;
const firstDrawnCardId = "drawn-card-1" as CardInstanceId;
const secondDrawnCardId = "drawn-card-2" as CardInstanceId;

function projectedEntry(
  key: Parameters<typeof createLorcanaGameLogEntry>[0],
  values: Parameters<typeof createLorcanaGameLogEntry>[1],
): ProjectedLogEntry {
  return {
    category: "action",
    visibility: { mode: "PUBLIC" },
    typedEntry: createLorcanaGameLogEntry(key, values, { mode: "PUBLIC" }, "action"),
  };
}

describe("buildMoveLog", () => {
  it("attributes cards-drawn outcomes to each drawing player", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.effect.resolve.optionalSelection.accepted", {
          playerId: playerOneId,
          sourceCardId,
        }),
      ],
      "resolveEffect",
      playerOneId,
      123,
      {
        cardsDrawn: [
          {
            playerId: playerTwoId,
            amount: 2,
            detail: privateField([firstDrawnCardId, secondDrawnCardId], [playerTwoId]),
          },
        ],
      },
    );

    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.cardsDrawn",
      values: { playerId: playerTwoId, amount: 2 },
    });
    expect(moveLog?.privateByPlayerId?.[playerTwoId]).toContainEqual({
      key: "lorcana.private.cardsDrawn.detail",
      values: {
        playerId: playerTwoId,
        cardIds: [firstDrawnCardId, secondDrawnCardId],
      },
    });
  });

  it("keeps banish outcomes when effect-damage messages are skipped", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.challenge", {
          playerId: playerOneId,
          attackerId: sourceCardId,
          defenderId: targetCardId,
        }),
      ],
      "challenge",
      playerOneId,
      123,
      {
        cardsBanished: [targetCardId],
        damageDealt: [
          {
            kind: "combat",
            sourceId: sourceCardId,
            targetId: targetCardId,
            amount: 2,
          },
        ],
      },
    );

    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.cardBanished",
      values: { playerId: playerOneId, cardId: targetCardId },
    });
  });

  it("preserves the reveal top card auto-bottom message key", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.effect.resolve.revealTopCard.autoBottom", {
          playerId: playerOneId,
          sourceCardId,
          targetPlayerId: playerTwoId,
          revealedCardId: targetCardId,
        }),
      ],
      "resolveEffect",
      playerOneId,
      123,
    );

    expect(moveLog?.public[0]?.key).toBe("lorcana.effect.resolve.revealTopCard.autoBottom");
  });

  it("keeps the play-from-discard message key on a play-card log", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard.fromDiscard", {
          playerId: playerOneId,
          cardId: sourceCardId,
        }),
      ],
      "playCard",
      playerOneId,
      123,
    );

    expect(moveLog?.public[0]).toEqual({
      key: "lorcana.move.playCard.fromDiscard",
      values: { playerId: playerOneId, cardId: sourceCardId },
    });
  });

  it("groups inkwell exert outcomes by player without exposing card ids", () => {
    const firstInkCardId = "ink-card-1" as CardInstanceId;
    const secondInkCardId = "ink-card-2" as CardInstanceId;
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed.named", {
          playerId: playerOneId,
          sourceId: sourceCardId,
          abilityName: "FEARSOME GLARE",
        }),
      ],
      "resolveBag",
      playerOneId,
      123,
      {
        inkwellCardsExerted: [{ playerId: playerOneId, amount: 2 }],
        cardsExerted: [targetCardId],
      },
    );

    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.inkwellCardsExerted",
      values: { playerId: playerOneId, amount: 2 },
    });
    expect(moveLog?.public).not.toContainEqual({
      key: "lorcana.outcome.cardExerted",
      values: { playerId: playerOneId, cardId: firstInkCardId },
    });
    expect(moveLog?.public).not.toContainEqual({
      key: "lorcana.outcome.cardExerted",
      values: { playerId: playerOneId, cardId: secondInkCardId },
    });
  });

  it("keeps secondary reveal details and all lore consequences on a play-card log", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard", {
          playerId: playerOneId,
          cardId: sourceCardId,
        }),
        projectedEntry("lorcana.effect.resolve.revealTopCard.autoBottom", {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        }),
      ],
      "playCard",
      playerOneId,
      123,
      {
        loreChanges: [
          { playerId: playerTwoId, amount: 1, operation: "remove" },
          { playerId: playerOneId, amount: 1, operation: "add" },
        ],
      },
    );

    expect(moveLog?.public).toEqual([
      {
        key: "lorcana.move.playCard",
        values: { playerId: playerOneId, cardId: sourceCardId },
      },
      {
        key: "lorcana.effect.resolve.revealTopCard.autoBottom",
        values: {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        },
      },
      {
        key: "lorcana.outcome.loreLost",
        values: { playerId: playerTwoId, amount: 1 },
      },
      {
        key: "lorcana.outcome.loreGained",
        values: { playerId: playerOneId, amount: 1 },
      },
    ]);
  });

  it("prefers secondary auto-bottom reveal details over the generic reveal on a play-card log", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard", {
          playerId: playerOneId,
          cardId: sourceCardId,
        }),
        projectedEntry("lorcana.effect.resolve.revealTopCard", {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        }),
        projectedEntry("lorcana.effect.resolve.revealTopCard.autoBottom", {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        }),
      ],
      "playCard",
      playerOneId,
      123,
    );

    expect(moveLog?.public).toEqual([
      {
        key: "lorcana.move.playCard",
        values: { playerId: playerOneId, cardId: sourceCardId },
      },
      {
        key: "lorcana.effect.resolve.revealTopCard.autoBottom",
        values: {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        },
      },
    ]);
  });

  it("uses the projected cancellation cause", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.effect.cancelled", {
          playerId: playerOneId,
          sourceCardId,
          cause: "condition-not-met",
        }),
      ],
      "resolveEffect",
      playerOneId,
      123,
    );

    expect(moveLog?.public[0]).toEqual({
      key: "lorcana.effect.cancelled",
      values: {
        playerId: playerOneId,
        sourceCardId,
        cause: "condition-not-met",
      },
    });
  });
});
