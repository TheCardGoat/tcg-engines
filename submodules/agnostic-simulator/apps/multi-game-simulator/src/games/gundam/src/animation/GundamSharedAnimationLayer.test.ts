import { describe, expect, it } from "vite-plus/test";

import type { GundamMoveLog } from "@tcg/gundam-engine";

import type { BoardProjection } from "../game/index.ts";
import { gundamMoveLogToCardMoveRecords } from "./GundamSharedAnimationLayer.tsx";

const VIEWER = "player_one";
const OPPONENT = "player_two";
const OPPONENT_DRAWN_CARD = "player_two_deck_ST01-001_01";

const view = {
  players: [{ playerId: VIEWER }, { playerId: OPPONENT }],
  zones: { zones: {} },
} as BoardProjection;

describe("gundamMoveLogToCardMoveRecords", () => {
  it("redacts opponent draw animation records even when the move log contains real card ids", () => {
    const records = gundamMoveLogToCardMoveRecords(opponentDrawLog(), view, VIEWER);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      ownerId: OPPONENT,
      fromZoneId: "deck",
      toZoneId: "hand",
      reason: "draw",
    });
    expect(records[0]?.cardId).not.toBe(OPPONENT_DRAWN_CARD);
    expect(records[0]?.cardId).toContain("__gundam_hidden_draw__");
  });

  it("keeps the actual drawn card id for the owner viewer", () => {
    const records = gundamMoveLogToCardMoveRecords(opponentDrawLog(), view, OPPONENT);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      cardId: OPPONENT_DRAWN_CARD,
      ownerId: OPPONENT,
      fromZoneId: "deck",
      toZoneId: "hand",
      reason: "draw",
    });
  });

  it("keeps the actual drawn card id for spectator-visible private fields", () => {
    const records = gundamMoveLogToCardMoveRecords(opponentDrawLog(), view, VIEWER, true);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      cardId: OPPONENT_DRAWN_CARD,
      ownerId: OPPONENT,
      fromZoneId: "deck",
      toZoneId: "hand",
      reason: "draw",
    });
  });
});

function opponentDrawLog(): GundamMoveLog {
  return {
    type: "pass",
    playerId: OPPONENT as never,
    timestamp: 1,
    context: "turn",
    outcomes: {
      cardsMoved: [
        {
          cardId: OPPONENT_DRAWN_CARD as never,
          from: "deck",
          to: "hand",
        },
      ],
      cardsDrawn: {
        playerId: OPPONENT as never,
        count: 1,
        cardIds: privateCardIds([OPPONENT_DRAWN_CARD], [OPPONENT]) as never,
      },
    },
  };
}

function privateCardIds(value: readonly string[], visibleTo: readonly string[]) {
  return {
    __private: true,
    value,
    visibleTo,
  };
}
