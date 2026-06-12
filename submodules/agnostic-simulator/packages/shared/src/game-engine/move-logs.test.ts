import { describe, expect, it } from "bun:test";
import {
  composeCanonicalMoveLogForViewer,
  createCanonicalEngineMoveLog,
  createEngineLogMessage,
  selectVisibleEngineLogForViewer,
} from "./move-logs.js";

describe("canonical engine move logs", () => {
  it("moves private field values into per-player appendices", () => {
    const log = createCanonicalEngineMoveLog({
      moveType: "draw",
      playerId: "player-one",
      timestamp: 10,
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
