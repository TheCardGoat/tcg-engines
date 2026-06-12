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
