import { describe, expect, it } from "bun:test";
import { createTestPlayers } from "./test-player-builder";

/**
 * Tests for createTestPlayers - Player builder for tests
 *
 * Task 2.1: Write tests for test builders (createTestPlayers)
 *
 * Tests verify:
 * - Creating multiple players with default names
 * - Creating players with custom names
 * - Player IDs are unique and properly formatted
 * - Type safety for Player objects
 */

describe("createTestPlayers", () => {
  describe("Basic Functionality", () => {
    it("should create specified number of players with default names", () => {
      const players = createTestPlayers(2);

      expect(players).toHaveLength(2);
      expect(players[0]?.name).toBe("Player 1");
      expect(players[1]?.name).toBe("Player 2");
    });

    it("should create players with custom names", () => {
      const players = createTestPlayers(3, ["Alice", "Bob", "Charlie"]);

      expect(players).toHaveLength(3);
      expect(players[0]?.name).toBe("Alice");
      expect(players[1]?.name).toBe("Bob");
      expect(players[2]?.name).toBe("Charlie");
    });

    it("should handle partial custom names with defaults for remaining", () => {
      const players = createTestPlayers(4, ["Alice", "Bob"]);

      expect(players).toHaveLength(4);
      expect(players[0]?.name).toBe("Alice");
      expect(players[1]?.name).toBe("Bob");
      expect(players[2]?.name).toBe("Player 3");
      expect(players[3]?.name).toBe("Player 4");
    });

    it("should create single player", () => {
      const players = createTestPlayers(1);

      expect(players).toHaveLength(1);
      expect(players[0]?.name).toBe("Player 1");
    });

    it("should create single player with custom name", () => {
      const players = createTestPlayers(1, ["Alice"]);

      expect(players).toHaveLength(1);
      expect(players[0]?.name).toBe("Alice");
    });
  });

  describe("Player IDs", () => {
    it("should generate unique IDs for each player", () => {
      const players = createTestPlayers(3);

      const ids = players.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it("should generate properly formatted PlayerId brand", () => {
      const players = createTestPlayers(2);

      // IDs should be non-empty strings
      for (const player of players) {
        expect(player.id).toBeTypeOf("string");
        expect(player.id.length).toBeGreaterThan(0);
      }
    });

    it("should generate deterministic IDs based on index", () => {
      const players1 = createTestPlayers(2);
      const players2 = createTestPlayers(2);

      // IDs should be based on player index, so they should match
      expect(players1[0]?.id).toBe(players2[0]?.id);
      expect(players1[1]?.id).toBe(players2[1]?.id);
    });
  });

  describe("Edge Cases", () => {
    it("should handle 0 players by returning empty array", () => {
      const players = createTestPlayers(0);

      expect(players).toHaveLength(0);
    });

    it("should handle large number of players", () => {
      const players = createTestPlayers(10);

      expect(players).toHaveLength(10);
      expect(players[9]?.name).toBe("Player 10");
    });

    it("should ignore extra names beyond count", () => {
      const players = createTestPlayers(2, ["Alice", "Bob", "Charlie"]);

      expect(players).toHaveLength(2);
      expect(players[0]?.name).toBe("Alice");
      expect(players[1]?.name).toBe("Bob");
    });
  });

  describe("Type Safety", () => {
    it("should return Player objects with correct structure", () => {
      const players = createTestPlayers(1);

      expect(players[0]).toHaveProperty("id");
      expect(players[0]).toHaveProperty("name");
    });

    it("should have PlayerId branded type", () => {
      const players = createTestPlayers(1);

      // Runtime check - ID should be a string
      expect(typeof players[0]?.id).toBe("string");

      // Type-level check happens at compile time
      // The following would fail TypeScript compilation if Player.id wasn't PlayerId:
      // const playerId: PlayerId = players[0].id;
    });
  });
});
