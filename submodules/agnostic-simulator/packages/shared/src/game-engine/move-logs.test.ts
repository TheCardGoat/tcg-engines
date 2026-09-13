import { describe, expect, it } from "bun:test";
import {
  composeCanonicalMoveLogForViewer,
  createCanonicalEngineMoveLog,
  createEngineLogMessage,
  selectVisibleEngineLogForViewer,
} from "./move-logs.js";

describe("canonical engine move logs", () => {
  it("replaces a public narrative message with only the viewer's private version", () => {
    const log = {
      kind: "player-narrative" as const,
      schemaVersion: 1,
      commandId: "command-1",
      moveType: "draw",
      actorId: "player-one",
      timestamp: 10,
      turnNumber: 2,
      turnPlayerId: "player-one",
      phase: "action",
      entries: [
        {
          entryId: "command-1:entry-0",
          publicMessage: { key: "test.draw", values: { count: 1 } },
          privateMessageByPlayerId: {
            "player-one": { key: "test.draw.private", values: { cardName: "Snatch" } },
          },
        },
      ],
    };

    expect(selectVisibleEngineLogForViewer(log, "player-one")).toMatchObject({
      turnPlayerId: "player-one",
      entries: [
        {
          entryId: "command-1:entry-0",
          message: { key: "test.draw.private", values: { cardName: "Snatch" } },
        },
      ],
    });
    expect(selectVisibleEngineLogForViewer(log, "player-two")).toMatchObject({
      entries: [
        {
          entryId: "command-1:entry-0",
          message: { key: "test.draw", values: { count: 1 } },
        },
      ],
    });
    expect(selectVisibleEngineLogForViewer(log, null)).toMatchObject({
      entries: [
        {
          entryId: "command-1:entry-0",
          message: { key: "test.draw", values: { count: 1 } },
        },
      ],
    });
  });

  it("fails closed for a malformed player-narrative envelope", () => {
    const malformed = {
      kind: "player-narrative",
      entries: [
        {
          entryId: "command-1:entry-0",
          publicMessage: { key: "test.draw", values: { count: 1 } },
          privateMessageByPlayerId: {
            "player-one": { key: "test.draw.private", values: { cardName: "Snatch" } },
          },
        },
      ],
    };

    expect(selectVisibleEngineLogForViewer(malformed, "player-two")).toBeNull();
  });

  it("moves private field values into per-player appendices", () => {
    const log = createCanonicalEngineMoveLog({
      moveType: "draw",
      playerId: "player-one",
      timestamp: 10,
      sequence: 1,
      turnNumber: 2,
      messages: [
        createEngineLogMessage({
          key: "test.draw",
          values: {
            playerId: "player-one",
            count: 2,
            cardIds: { __private: true, value: ["card-a", "card-b"], visibleTo: ["player-one"] },
          },
        }),
      ],
    });

    expect(log.public).toEqual([
      {
        key: "test.draw",
        values: {
          playerId: "player-one",
          count: 2,
        },
      },
    ]);
    expect(log.sequence).toBe(1);
    expect(log.privateByPlayerId?.["player-one"]).toEqual([
      {
        key: "test.draw",
        values: {
          playerId: "player-one",
          count: 2,
          cardIds: ["card-a", "card-b"],
        },
      },
    ]);
  });

  it("composes only the viewer private appendix", () => {
    const log = createCanonicalEngineMoveLog({
      moveType: "search",
      playerId: "player-one",
      timestamp: 10,
      messages: [
        createEngineLogMessage({
          key: "test.search",
          values: {
            count: 3,
            found: { __private: true, value: "card-a", visibleTo: ["player-one"] },
          },
        }),
      ],
    });

    expect(composeCanonicalMoveLogForViewer(log, "player-one")).toEqual({
      moveType: "search",
      playerId: "player-one",
      timestamp: 10,
      public: [
        { key: "test.search", values: { count: 3 } },
        { key: "test.search", values: { count: 3, found: "card-a" } },
      ],
    });
    expect(composeCanonicalMoveLogForViewer(log, "player-two")).toEqual({
      moveType: "search",
      playerId: "player-one",
      timestamp: 10,
      public: [{ key: "test.search", values: { count: 3 } }],
    });
  });

  it("still strips private fields from legacy raw logs", () => {
    const legacy = {
      type: "mulligan",
      drawn: { __private: true, value: ["card-a"], visibleTo: ["player-one"] },
      count: 1,
    };

    expect(selectVisibleEngineLogForViewer(legacy, "player-two")).toEqual({
      type: "mulligan",
      count: 1,
    });
  });
});
