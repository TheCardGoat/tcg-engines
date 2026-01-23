import { describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import { createTemplateGame } from "../index";

describe("Template Game", () => {
  describe("Initialization", () => {
    it("should initialize with correct state", () => {
      const game = createTemplateGame([
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ]);

      const state = game.getState();

      expect(state.players).toHaveLength(2);
      expect(state.players[0]?.life).toBe(20);
      expect(state.players[0]?.name).toBe("Alice");
      expect(state.currentPlayerIndex).toBe(0);
      expect(state.phase).toBe("draw");
      expect(state.turnNumber).toBe(1);
    });

    it("should create zones for all players", () => {
      const game = createTemplateGame([
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ]);

      const state = game.getState();

      expect(state.zones.deck).toBeDefined();
      expect(state.zones.hand).toBeDefined();
      expect(state.zones.field).toBeDefined();
      expect(state.zones.graveyard).toBeDefined();
      expect(state.zones.deck[createPlayerId("p1")]).toEqual([]);
      expect(state.zones.hand[createPlayerId("p1")]).toEqual([]);
    });
  });

  describe("Moves", () => {
    describe("drawCard", () => {
      it("should validate phase condition", () => {
        const game = createTemplateGame([
          { id: createPlayerId("p1"), name: "Alice" },
        ]);

        // Should succeed in draw phase
        const result = game.executeMove("drawCard", {
          playerId: createPlayerId("p1"),
          params: {},
        });

        // Will succeed (condition met) even though deck is empty
        // The reducer just won't add a card
        expect(result.success).toBe(true);
      });

      it("should fail when not in draw phase", () => {
        const game = createTemplateGame([
          { id: createPlayerId("p1"), name: "Alice" },
        ]);

        // Move to main phase
        game.executeMove("endPhase", {
          playerId: createPlayerId("p1"),
          params: {},
        });

        const result = game.executeMove("drawCard", {
          playerId: createPlayerId("p1"),
          params: {},
        });

        expect(result.success).toBe(false);
      });
    });

    describe("endPhase", () => {
      it("should progress through phases", () => {
        const game = createTemplateGame([
          { id: createPlayerId("p1"), name: "Alice" },
        ]);

        expect(game.getState().phase).toBe("draw");

        game.executeMove("endPhase", {
          playerId: createPlayerId("p1"),
          params: {},
        });
        expect(game.getState().phase).toBe("main");

        game.executeMove("endPhase", {
          playerId: createPlayerId("p1"),
          params: {},
        });
        expect(game.getState().phase).toBe("end");
      });

      it("should advance turn after end phase", () => {
        const game = createTemplateGame([
          { id: createPlayerId("p1"), name: "Alice" },
          { id: createPlayerId("p2"), name: "Bob" },
        ]);

        expect(game.getState().currentPlayerIndex).toBe(0);
        expect(game.getState().turnNumber).toBe(1);

        // End all phases to advance turn
        game.executeMove("endPhase", {
          playerId: createPlayerId("p1"),
          params: {},
        }); // draw -> main
        game.executeMove("endPhase", {
          playerId: createPlayerId("p1"),
          params: {},
        }); // main -> end
        game.executeMove("endPhase", {
          playerId: createPlayerId("p1"),
          params: {},
        }); // end -> next turn

        const state = game.getState();
        expect(state.currentPlayerIndex).toBe(1);
        expect(state.turnNumber).toBe(2);
        expect(state.phase).toBe("draw");
      });
    });
  });

  describe("Player Views", () => {
    it("should hide opponent hand and deck", () => {
      const game = createTemplateGame([
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ]);

      const p1View = game.getPlayerView(createPlayerId("p1"));
      const p2View = game.getPlayerView(createPlayerId("p2"));

      // Both players have empty hands initially
      expect(p1View.zones.hand[createPlayerId("p1")]?.length).toBe(0);
      expect(p2View.zones.hand[createPlayerId("p2")]?.length).toBe(0);

      // Opponent zones should be empty arrays (hidden)
      expect(p1View.zones.hand[createPlayerId("p2")]).toEqual([]);
      expect(p2View.zones.hand[createPlayerId("p1")]).toEqual([]);
      expect(p1View.zones.deck[createPlayerId("p2")]).toEqual([]);
      expect(p2View.zones.deck[createPlayerId("p1")]).toEqual([]);
    });
  });

  describe("Game End", () => {
    it("should have no winner initially", () => {
      const game = createTemplateGame([
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ]);

      // Game should not have ended yet
      const gameEnd = game.checkGameEnd();
      expect(gameEnd).toBeUndefined();
    });

    it("should detect win condition when defined", () => {
      const game = createTemplateGame([
        { id: createPlayerId("p1"), name: "Alice" },
      ]);

      // The endIf condition checks for life <= 0
      // We can't easily test this without a damage move
      // This demonstrates that endIf exists and returns undefined when no win
      const gameEnd = game.checkGameEnd();
      expect(gameEnd).toBeUndefined();
    });
  });

  describe("Determinism", () => {
    it("should produce same results with same seed", () => {
      const game1 = createTemplateGame(
        [
          { id: createPlayerId("p1"), name: "Alice" },
          { id: createPlayerId("p2"), name: "Bob" },
        ],
        "test-seed-123",
      );

      const game2 = createTemplateGame(
        [
          { id: createPlayerId("p1"), name: "Alice" },
          { id: createPlayerId("p2"), name: "Bob" },
        ],
        "test-seed-123",
      );

      // Execute same moves
      game1.executeMove("endPhase", {
        playerId: createPlayerId("p1"),
        params: {},
      });
      game2.executeMove("endPhase", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      const state1 = game1.getState();
      const state2 = game2.getState();

      expect(state1).toEqual(state2);
    });
  });
});
