import { beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "../types/branded-utils";
import { HistoryManager } from "./history-manager";
import type { HistoryEntry, VerbosityLevel } from "./types";

describe("HistoryManager", () => {
  let manager: HistoryManager;
  const PLAYER_ONE = createPlayerId("player_one");
  const PLAYER_TWO = createPlayerId("player_two");

  beforeEach(() => {
    manager = new HistoryManager();
  });

  describe("Basic Operations", () => {
    it("should start with empty history", () => {
      expect(manager.getCount()).toBe(0);
      expect(manager.getAllEntries()).toEqual([]);
    });

    it("should add entries with generated IDs", () => {
      const entry = manager.addEntry({
        moveId: "testMove",
        playerId: PLAYER_ONE,
        params: { test: true },
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: { key: "test.message" },
          },
        },
      });

      expect(entry.id).toBeDefined();
      expect(typeof entry.id).toBe("string");
      expect(manager.getCount()).toBe(1);
    });

    it("should retrieve all entries", () => {
      manager.addEntry({
        moveId: "move1",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "msg1" } },
        },
      });

      manager.addEntry({
        moveId: "move2",
        playerId: PLAYER_TWO,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "msg2" } },
        },
      });

      const entries = manager.getAllEntries();
      expect(entries.length).toBe(2);
      expect(entries[0]?.moveId).toBe("move1");
      expect(entries[1]?.moveId).toBe("move2");
    });

    it("should clear all entries", () => {
      manager.addEntry({
        moveId: "move1",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "msg1" } },
        },
      });

      expect(manager.getCount()).toBe(1);
      manager.clear();
      expect(manager.getCount()).toBe(0);
    });
  });

  describe("Public Visibility", () => {
    it("should show public entries to all players", () => {
      const timestamp = Date.now();
      manager.addEntry({
        moveId: "publicMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp,
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: { key: "public.message", values: { player: "One" } },
          },
        },
      });

      const p1History = manager.query({ playerId: PLAYER_ONE });
      const p2History = manager.query({ playerId: PLAYER_TWO });
      const allHistory = manager.query();

      expect(p1History.length).toBe(1);
      expect(p2History.length).toBe(1);
      expect(allHistory.length).toBe(1);

      expect(p1History[0]?.message.key).toBe("public.message");
      expect(p2History[0]?.message.key).toBe("public.message");
    });
  });

  describe("Private Visibility", () => {
    it("should show private entries only to specified player", () => {
      manager.addEntry({
        moveId: "privateMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PRIVATE",
          visibleTo: [PLAYER_ONE],
          messages: {
            casual: { key: "private.message" },
          },
        },
      });

      const p1History = manager.query({ playerId: PLAYER_ONE });
      const p2History = manager.query({ playerId: PLAYER_TWO });

      expect(p1History.length).toBe(1);
      expect(p2History.length).toBe(0);
    });

    it("should show private entries to multiple specified players", () => {
      manager.addEntry({
        moveId: "privateMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PRIVATE",
          visibleTo: [PLAYER_ONE, PLAYER_TWO],
          messages: {
            casual: { key: "private.message" },
          },
        },
      });

      const p1History = manager.query({ playerId: PLAYER_ONE });
      const p2History = manager.query({ playerId: PLAYER_TWO });

      expect(p1History.length).toBe(1);
      expect(p2History.length).toBe(1);
    });
  });

  describe("Player-Specific Messages", () => {
    it("should show different messages to different players (mulligan example)", () => {
      const timestamp = Date.now();
      const cardsDrawn = ["Knight", "Wizard", "Dragon"];

      manager.addEntry({
        moveId: "mulligan",
        playerId: PLAYER_ONE,
        params: { cardIds: ["card1", "card2", "card3"] },
        timestamp,
        turn: 1,
        phase: "mulligan",
        success: true,
        messages: {
          visibility: "PLAYER_SPECIFIC",
          messages: {
            [PLAYER_ONE]: {
              casual: {
                key: "mulligan.self",
                values: { cards: cardsDrawn, count: 3 },
              },
              advanced: {
                key: "mulligan.self.detailed",
                values: {
                  cardIds: ["card1", "card2", "card3"],
                  cards: cardsDrawn,
                },
              },
            },
            [PLAYER_TWO]: {
              casual: {
                key: "mulligan.opponent",
                values: { count: 3 },
              },
              advanced: {
                key: "mulligan.opponent.detailed",
                values: { count: 3, playerId: PLAYER_ONE },
              },
            },
          },
        },
      });

      // Player one sees their cards
      const p1History = manager.query({
        playerId: PLAYER_ONE,
        verbosity: "CASUAL",
      });
      expect(p1History.length).toBe(1);
      expect(p1History[0]?.message.key).toBe("mulligan.self");
      expect(p1History[0]?.message.values?.cards).toEqual(cardsDrawn);

      // Player two only sees count
      const p2History = manager.query({
        playerId: PLAYER_TWO,
        verbosity: "CASUAL",
      });
      expect(p2History.length).toBe(1);
      expect(p2History[0]?.message.key).toBe("mulligan.opponent");
      expect(p2History[0]?.message.values?.count).toBe(3);
      expect(p2History[0]?.message.values?.cards).toBeUndefined();
    });
  });

  describe("Verbosity Levels", () => {
    beforeEach(() => {
      manager.addEntry({
        moveId: "drawCards",
        playerId: PLAYER_ONE,
        params: { count: 5 },
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: {
              key: "draw.casual",
              values: { player: "One", count: 5 },
            },
            advanced: {
              key: "draw.advanced",
              values: {
                player: "One",
                count: 5,
                cardIds: ["c1", "c2", "c3", "c4", "c5"],
              },
            },
            developer: {
              key: "draw.developer",
              values: {
                playerId: PLAYER_ONE,
                params: { count: 5 },
                fullContext: {},
              },
            },
          },
        },
      });
    });

    it("should return CASUAL message at CASUAL verbosity", () => {
      const history = manager.query({ verbosity: "CASUAL" });
      expect(history[0]?.message.key).toBe("draw.casual");
    });

    it("should return ADVANCED message at ADVANCED verbosity", () => {
      const history = manager.query({ verbosity: "ADVANCED" });
      expect(history[0]?.message.key).toBe("draw.advanced");
    });

    it("should return DEVELOPER message at DEVELOPER verbosity", () => {
      const history = manager.query({ verbosity: "DEVELOPER" });
      expect(history[0]?.message.key).toBe("draw.developer");
    });

    it("should fallback to CASUAL if ADVANCED not available", () => {
      manager.clear();
      manager.addEntry({
        moveId: "simpleMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: { key: "simple.casual" },
            // No advanced or developer
          },
        },
      });

      const advancedHistory = manager.query({ verbosity: "ADVANCED" });
      const developerHistory = manager.query({ verbosity: "DEVELOPER" });

      expect(advancedHistory[0]?.message.key).toBe("simple.casual");
      expect(developerHistory[0]?.message.key).toBe("simple.casual");
    });

    it("should fallback through verbosity chain", () => {
      manager.clear();
      manager.addEntry({
        moveId: "partialMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: { key: "partial.casual" },
            developer: { key: "partial.developer" },
            // No advanced
          },
        },
      });

      const advancedHistory = manager.query({ verbosity: "ADVANCED" });
      const developerHistory = manager.query({ verbosity: "DEVELOPER" });

      expect(advancedHistory[0]?.message.key).toBe("partial.casual");
      expect(developerHistory[0]?.message.key).toBe("partial.developer");
    });
  });

  describe("Query Filtering", () => {
    beforeEach(() => {
      const baseTime = Date.now();

      manager.addEntry({
        moveId: "move1",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: baseTime,
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "msg1" } },
        },
      });

      manager.addEntry({
        moveId: "move2",
        playerId: PLAYER_TWO,
        params: {},
        timestamp: baseTime + 1000,
        success: false,
        error: { code: "ERROR", message: "Failed" },
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "msg2" } },
        },
      });

      manager.addEntry({
        moveId: "move3",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: baseTime + 2000,
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "msg3" } },
        },
      });
    });

    it("should filter by timestamp", () => {
      const baseTime = Date.now();
      const history = manager.query({ since: baseTime + 1500 });

      expect(history.length).toBe(1);
      expect(history[0]?.moveId).toBe("move3");
    });

    it("should filter by move ID", () => {
      const history = manager.query({ moveId: "move2" });

      expect(history.length).toBe(1);
      expect(history[0]?.moveId).toBe("move2");
    });

    it("should filter by success", () => {
      const successHistory = manager.query({ includeFailures: false });
      const failureHistory = manager.query({ includeSuccess: false });

      expect(successHistory.length).toBe(2);
      expect(failureHistory.length).toBe(1);
      expect(failureHistory[0]?.success).toBe(false);
    });
  });

  describe("Failed Moves", () => {
    it("should include error information in failed move entries", () => {
      manager.addEntry({
        moveId: "failedMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        success: false,
        error: {
          code: "INVALID_TARGET",
          message: "Target no longer exists",
          context: { targetId: "card-123" },
        },
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: {
              key: "move.failed",
              values: { reason: "Invalid target" },
            },
            advanced: {
              key: "move.failed.technical",
              values: {
                errorCode: "INVALID_TARGET",
                targetId: "card-123",
              },
            },
          },
        },
      });

      const casualHistory = manager.query({ verbosity: "CASUAL" });
      const advancedHistory = manager.query({ verbosity: "ADVANCED" });

      expect(casualHistory[0]?.success).toBe(false);
      expect(casualHistory[0]?.error?.code).toBe("INVALID_TARGET");
      expect(casualHistory[0]?.message.key).toBe("move.failed");

      expect(advancedHistory[0]?.message.key).toBe("move.failed.technical");
    });
  });

  describe("Metadata", () => {
    it("should include metadata in DEVELOPER mode only", () => {
      manager.addEntry({
        moveId: "metadataMove",
        playerId: PLAYER_ONE,
        params: { test: true },
        timestamp: Date.now(),
        success: true,
        metadata: { debug: "info", internal: "data" },
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: { key: "move.msg" },
            developer: { key: "move.dev" },
          },
        },
      });

      const casualHistory = manager.query({ verbosity: "CASUAL" });
      const developerHistory = manager.query({ verbosity: "DEVELOPER" });

      expect(casualHistory[0]?.metadata).toBeUndefined();
      expect(casualHistory[0]?.params).toBeUndefined();

      expect(developerHistory[0]?.metadata).toBeDefined();
      expect(developerHistory[0]?.metadata?.debug).toBe("info");
      expect(developerHistory[0]?.params).toBeDefined();
    });
  });

  describe("Turn and Phase Information", () => {
    it("should include turn and phase information", () => {
      manager.addEntry({
        moveId: "phaseMove",
        playerId: PLAYER_ONE,
        params: {},
        timestamp: Date.now(),
        turn: 3,
        phase: "main",
        segment: "step1",
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: { casual: { key: "move.msg" } },
        },
      });

      const history = manager.query();

      expect(history[0]?.turn).toBe(3);
      expect(history[0]?.phase).toBe("main");
      expect(history[0]?.segment).toBe("step1");
    });
  });
});
