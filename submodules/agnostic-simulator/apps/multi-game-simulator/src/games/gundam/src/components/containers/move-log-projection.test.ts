import { describe, expect, it } from "vite-plus/test";

import type { TurnTaggedLogEntry, TurnTaggedMoveLog } from "../../game/adapter.ts";
import {
  projectGundamLegacyEventLogEntries,
  projectGundamMoveLogEntries,
} from "./move-log-projection.ts";

const VIEWER = "player_one";
const OPPONENT = "player_two";
const OPPONENT_DRAWN_CARD = "player_two_deck_ST01-001_01";

function tagged(log: TurnTaggedMoveLog["log"], turnNumber = 3): TurnTaggedMoveLog {
  return { log, turnNumber };
}

function taggedLegacy(
  entry: Partial<TurnTaggedLogEntry["entry"]>,
  turnNumber = 3,
): TurnTaggedLogEntry {
  return {
    turnNumber,
    entry: {
      id: 7,
      stateID: 1,
      timestamp: 1_700_000_000_000,
      type: "gundam.test",
      message: "",
      ...entry,
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

describe("projectGundamMoveLogEntries", () => {
  it("projects Gundam move logs into the agnostic simulator event-log contract", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "attack",
          playerId: VIEWER as never,
          timestamp: 1_700_000_000_000,
          stateID: 42,
          turnNumber: 3,
          attackerId: "attacker-1" as never,
          targetId: "target-1" as never,
          outcomes: {
            damageDealt: [
              {
                sourceCardId: "attacker-1" as never,
                targetId: "target-1" as never,
                amount: 2,
              },
            ],
          },
        }),
      ],
      VIEWER,
      "battle",
      (id) => {
        const names = new Map([
          ["attacker-1", "RX-78-2 Gundam"],
          ["target-1", "Zaku II"],
        ]);
        const name = names.get(id);
        return name ? ({ name } as never) : null;
      },
    );

    expect(entries).toEqual([
      {
        id: "gundam-move-log-42",
        turn: 3,
        phase: "battle",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Attacked Zaku II with RX-78-2 Gundam.",
        tags: ["combat"],
        entityIds: ["attacker-1", "target-1"],
      },
      {
        id: "gundam-move-log-42-outcome-0",
        turn: 3,
        phase: "battle",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Zaku II took 2 damage.",
        tags: ["combat"],
        entityIds: ["attacker-1", "target-1"],
      },
    ]);
  });

  it("marks non-viewer logs as opponent events and system-turn logs as system-tagged", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged(
          {
            type: "turnStart",
            playerId: OPPONENT as never,
            activePlayerId: OPPONENT as never,
            timestamp: 0,
            turnNumber: 5,
          },
          5,
        ),
      ],
      VIEWER,
      "start",
    );

    expect(entries[0]).toMatchObject({
      turn: 5,
      phase: "start",
      seatId: "opponent",
      message: "Opponent started the turn.",
      tags: ["system"],
    });
  });

  it("redacts opponent draw card names and skips deck-to-hand move outcomes", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
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
        }),
      ],
      VIEWER,
      "draw",
      (id) => (id === OPPONENT_DRAWN_CARD ? ({ name: "Secret Opponent Card" } as never) : null),
    );

    expect(entries.map((entry) => entry.message)).toEqual(["Passed (turn).", "Drew 1 card(s)."]);
    expect(JSON.stringify(entries)).not.toContain("Secret Opponent Card");
    expect(JSON.stringify(entries)).not.toContain(OPPONENT_DRAWN_CARD);
  });

  it("keeps drawn card names for the owner viewer", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
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
        }),
      ],
      OPPONENT,
      "draw",
      (id) => (id === OPPONENT_DRAWN_CARD ? ({ name: "Secret Opponent Card" } as never) : null),
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Passed (turn).",
      "Drew 1: Secret Opponent Card.",
    ]);
  });

  it("keeps drawn card names when private move-log fields are intentionally revealed", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          context: "turn",
          outcomes: {
            cardsDrawn: {
              playerId: OPPONENT as never,
              count: 1,
              cardIds: privateCardIds([OPPONENT_DRAWN_CARD], [OPPONENT]) as never,
            },
          },
        }),
      ],
      VIEWER,
      "draw",
      (id) => (id === OPPONENT_DRAWN_CARD ? ({ name: "Secret Opponent Card" } as never) : null),
      { revealPrivateFields: true },
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Passed (turn).",
      "Drew 1: Secret Opponent Card.",
    ]);
  });
});

describe("projectGundamLegacyEventLogEntries", () => {
  it("preserves private deck reveal and tutor details in the shared event log", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          id: 10,
          type: "gundam.effect.deckRevealed",
          data: {
            values: {
              playerId: VIEWER,
              cardIds: ["card-a", "card-b"],
            },
          },
        }),
        taggedLegacy({
          id: 11,
          type: "gundam.effect.cardTutored",
          data: {
            values: {
              playerId: VIEWER,
              cardId: "card-b",
            },
          },
        }),
      ],
      VIEWER,
      "main",
      (id) => {
        const names = new Map([
          ["card-a", "Top Deck A"],
          ["card-b", "Tutored Card"],
        ]);
        const name = names.get(id);
        return name ? ({ name } as never) : null;
      },
    );

    expect(entries).toEqual([
      {
        id: "gundam-legacy-log-10",
        turn: 3,
        phase: "main",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You revealed 2: Top Deck A, Tutored Card from deck.",
        tags: ["ability"],
        entityIds: ["card-a", "card-b"],
      },
      {
        id: "gundam-legacy-log-11",
        turn: 3,
        phase: "main",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You searched for Tutored Card.",
        tags: ["ability"],
        entityIds: ["card-b"],
      },
    ]);
  });

  it("does not duplicate legacy effects already covered by move outcomes", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          type: "gundam.effect.cardsDrawn",
          data: {
            values: {
              playerId: VIEWER,
              count: 1,
            },
          },
        }),
      ],
      VIEWER,
      "draw",
    );

    expect(entries).toEqual([]);
  });

  it("preserves setup and mulligan legacy entries in the shared event log", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          id: 20,
          type: "gundam.setup.firstPlayerChosen",
          message: "player_one chose player_two to go first.",
          data: {
            values: {
              chooser: VIEWER,
              chosen: OPPONENT,
            },
          },
        }),
        taggedLegacy({
          id: 21,
          type: "gundam.setup.mulligan",
          message: "player_two altered 5 cards.",
          data: {
            values: {
              playerId: OPPONENT,
              count: 5,
            },
          },
        }),
        taggedLegacy({
          id: 22,
          type: "gundam.setup.done",
          message: "Setup complete.",
          data: { values: {} },
        }),
      ],
      VIEWER,
      "setup",
    );

    expect(entries).toEqual([
      {
        id: "gundam-legacy-log-20",
        turn: 3,
        phase: "setup",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You chose Opponent to go first.",
        tags: ["system"],
        entityIds: undefined,
      },
      {
        id: "gundam-legacy-log-21",
        turn: 3,
        phase: "setup",
        seatId: "opponent",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Opponent altered 5 cards.",
        tags: ["system"],
        entityIds: undefined,
      },
      {
        id: "gundam-legacy-log-22",
        turn: 3,
        phase: "setup",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Setup complete.",
        tags: ["system"],
        entityIds: undefined,
      },
    ]);
  });
});
