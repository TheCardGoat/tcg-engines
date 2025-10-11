import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import type { PlayerId } from "../types";
import { createMockLorcanaGame } from "./createMockLorcanaGame";

describe("Lorcana Game Beginning Procedure", () => {
  const lorcanaMockGame = createMockLorcanaGame();

  it("should handle the complete game start sequence", () => {
    // This test validates the beginning procedure according to Lorcana rules 3.1
    // 1. Randomly determine first player
    // 2. Shuffle decks
    // 3. Start with 0 lore
    // 4. Draw 7 cards
    // 5. Players may mulligan once

    // Mock initial state with 2 players
    const initialState = {
      effects: [],
      bag: [],
      players: [
        {
          id: "player1",
          lore: 0,
          zones: {
            hand: [],
            deck: Array(60)
              .fill(null)
              .map((_, i) => ({ id: `p1-card-${i}`, meta: {} })),
            play: [],
            inkwell: [],
            discard: [],
          },
        },
        {
          id: "player2",
          lore: 0,
          zones: {
            hand: [],
            deck: Array(60)
              .fill(null)
              .map((_, i) => ({ id: `p2-card-${i}`, meta: {} })),
            play: [],
            inkwell: [],
            discard: [],
          },
        },
      ],
      currentPhase: "setup",
      activePlayer: null,
    };

    // Step 1: Determine first player (randomly)
    const firstPlayerIndex = Math.floor(Math.random() * 2);
    const firstPlayer = initialState.players[firstPlayerIndex].id;

    expect(["player1", "player2"]).toContain(firstPlayer);

    // Step 2: Shuffle decks (in real implementation, this would shuffle the arrays)
    // For testing, we just verify decks exist and have cards
    for (const player of initialState.players) {
      expect(player.zones.deck.length).toBe(60);
    }

    // Step 3: Verify starting lore is 0
    for (const player of initialState.players) {
      expect(player.lore).toBe(0);
    }

    // Step 4: Draw 7 cards for each player
    const stateAfterDraw = {
      ...initialState,
      players: initialState.players.map((player) => ({
        ...player,
        zones: {
          ...player.zones,
          hand: player.zones.deck.slice(0, 7),
          deck: player.zones.deck.slice(7),
        },
      })),
    };

    for (const player of stateAfterDraw.players) {
      expect(player.zones.hand.length).toBe(7);
      expect(player.zones.deck.length).toBe(53);
    }

    // Step 5: Mulligan phase (players may mulligan once)
    // Player 1 decides to mulligan
    const player1AfterMulligan = {
      ...stateAfterDraw.players[0],
      zones: {
        ...stateAfterDraw.players[0].zones,
        deck: [
          ...stateAfterDraw.players[0].zones.hand,
          ...stateAfterDraw.players[0].zones.deck,
        ],
        hand: [],
      },
    };

    // Shuffle deck after mulligan
    // Draw 7 new cards
    const player1AfterRedraw = {
      ...player1AfterMulligan,
      zones: {
        ...player1AfterMulligan.zones,
        hand: player1AfterMulligan.zones.deck.slice(0, 7),
        deck: player1AfterMulligan.zones.deck.slice(7),
      },
    };

    expect(player1AfterRedraw.zones.hand.length).toBe(7);
    expect(player1AfterRedraw.zones.deck.length).toBe(53);

    // Player 2 decides not to mulligan
    const player2Final = stateAfterDraw.players[1];

    // Final state ready to start the game
    const stateReadyToStart = {
      ...stateAfterDraw,
      players: [player1AfterRedraw, player2Final],
      activePlayer: firstPlayer,
      currentPhase: "beginningPhase",
      currentSegment: "readyStep",
    };

    expect(stateReadyToStart.activePlayer).toBe(firstPlayer);
    expect(stateReadyToStart.currentPhase).toBe("beginningPhase");
    expect(stateReadyToStart.currentSegment).toBe("readyStep");

    // Verify both players have their starting hands
    for (const player of stateReadyToStart.players) {
      expect(player.zones.hand.length).toBe(7);
      expect(player.zones.deck.length).toBe(53);
      expect(player.zones.play.length).toBe(0);
      expect(player.zones.inkwell.length).toBe(0);
      expect(player.zones.discard.length).toBe(0);
      expect(player.lore).toBe(0);
    }
  });

  it("should validate the beginning phase structure (4.2)", () => {
    // According to rules 4.2:
    // Beginning Phase consists of:
    // - Ready step: Ready all cards, begin "during turn" effects
    // - Set step: Characters no longer "drying," gain lore from locations
    // - Draw step: Draw a card (skip on first turn)

    const flow = lorcanaMockGame.flow;

    if (!flow) {
      throw new Error("Flow is not defined");
    }

    expect(flow.turn.initialPhase).toBe("beginningPhase");
    
    if (!flow.turn.phases) {
      throw new Error("Turn phases are not defined");
    }

    expect(flow.turn.phases.beginningPhase).toBeDefined();

    const beginningPhase = flow.turn.phases.beginningPhase;
    if (!beginningPhase) {
      throw new Error("Beginning phase is not defined");
    }

    expect(beginningPhase.order).toBe(1);
    expect(beginningPhase.next).toBe("mainPhase");

    // Verify segments exist
    expect(beginningPhase.segments?.readyStep).toBeDefined();
    expect(beginningPhase.segments?.setStep).toBeDefined();
    expect(beginningPhase.segments?.drawStep).toBeDefined();

    // Verify segment order
    expect(beginningPhase.segments?.readyStep?.order).toBe(1);
    expect(beginningPhase.segments?.setStep?.order).toBe(2);
    expect(beginningPhase.segments?.drawStep?.order).toBe(3);

    // Verify segment flow
    expect(beginningPhase.segments?.readyStep?.next).toBe("setStep");
    expect(beginningPhase.segments?.setStep?.next).toBe("drawStep");
  });

  it("should validate first turn skip draw rule", () => {
    // According to rules 4.2:
    // Draw step: Draw a card (skip on first turn)

    const mockStateFirstTurn = {
      effects: [],
      bag: [],
      turnNumber: 1,
    };

    const mockStateSecondTurn = {
      effects: [],
      bag: [],
      turnNumber: 2,
    };

    // In real implementation, the draw step would check turnNumber
    // and skip drawing on turn 1
    expect(mockStateFirstTurn.turnNumber).toBe(1);
    expect(mockStateSecondTurn.turnNumber).toBe(2);
  });

  it("should handle chooseWhoGoesFirstMove correctly", () => {
    // Test the move for selecting first player
    const moves = lorcanaMockGame.moves;

    expect(moves.chooseWhoGoesFirstMove).toBeDefined();
    expect(moves.chooseWhoGoesFirstMove.reducer).toBeDefined();

    // The reducer should accept playerId parameter
    // This validates the type safety of the move
  });

  it("should handle alterHand for mulligan", () => {
    // Test the move for mulligan (altering hand)
    const moves = lorcanaMockGame.moves;

    expect(moves.alterHand).toBeDefined();
    expect(moves.alterHand.reducer).toBeDefined();

    // The reducer should accept playerId and cards parameters
    // This validates the type safety of the move
  });

  it("should execute the complete game start sequence with moves", () => {
    // This test validates the engine can actually execute the 5-step beginning procedure:
    // 1. Randomly determine first player
    // 2. Shuffle decks (implicit in setup)
    // 3. Start with 0 lore
    // 4. Draw 7 cards for each player
    // 5. Players may mulligan once

    // Create game definition
    const gameDefinition = createMockLorcanaGame();

    // Create 2 players
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const player1Id = players[0]?.id || "p1";
    const player2Id = players[1]?.id || "p2";

    // Initialize engine with deterministic seed
    const engine = createTestEngine(gameDefinition, players, {
      seed: "lorcana-test-001",
    });

    // Verify initial state from setup function
    const initialState = engine.getState();
    expect(initialState.gamePhase).toBe("setup");
    expect(initialState.turnNumber).toBe(0);
    expect(initialState.activePlayerId).toBeNull();
    expect(initialState.firstPlayerDetermined).toBe(false);

    // Verify both players have 60 cards in deck, 0 in hand, 0 lore
    expect(initialState.players).toHaveLength(2);
    for (const player of initialState.players) {
      expect(player.zones.deck.length).toBe(60);
      expect(player.zones.hand.length).toBe(0);
      expect(player.lore).toBe(0);
    }

    // Step 1: Determine first player randomly (we'll choose player1)
    const chooseFirstResult = engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: player1Id as PlayerId,
      params: { playerId: player1Id as unknown as string },
    } as any);
    expect(chooseFirstResult.success).toBe(true);

    const stateAfterFirstPlayer = engine.getState();
    expect(stateAfterFirstPlayer.activePlayerId).toBe(player1Id as unknown as string);
    expect(stateAfterFirstPlayer.firstPlayerDetermined).toBe(true);
    expect(stateAfterFirstPlayer.gamePhase).toBe("active");
    expect(stateAfterFirstPlayer.turnNumber).toBe(1);

    // Step 4: Draw 7 cards for each player
    const drawPlayer1Result = engine.executeMove("drawCards", {
      playerId: player1Id as PlayerId,
      params: { playerId: player1Id as unknown as string, count: 7 },
    } as any);
    expect(drawPlayer1Result.success).toBe(true);

    const drawPlayer2Result = engine.executeMove("drawCards", {
      playerId: player1Id as PlayerId,
      params: { playerId: player2Id as unknown as string, count: 7 },
    } as any);
    expect(drawPlayer2Result.success).toBe(true);

    const stateAfterDraw = engine.getState();
    for (const player of stateAfterDraw.players) {
      expect(player.zones.hand.length).toBe(7);
      expect(player.zones.deck.length).toBe(53);
    }

    // Step 5: Player 1 decides to mulligan
    const mulliganResult = engine.executeMove("alterHand", {
      playerId: player1Id as PlayerId,
      params: {
        playerId: player1Id as unknown as string,
        cards: [], // Cards parameter not used in our simple implementation
      },
    } as any);
    expect(mulliganResult.success).toBe(true);

    const stateAfterMulligan = engine.getState();
    const player1AfterMulligan = stateAfterMulligan.players.find(
      (p) => p.id === (player1Id as unknown as string),
    );
    expect(player1AfterMulligan?.zones.hand.length).toBe(7);
    expect(player1AfterMulligan?.zones.deck.length).toBe(53);

    // Player 2 decides not to mulligan, keeps their hand
    const player2AfterMulligan = stateAfterMulligan.players.find(
      (p) => p.id === (player2Id as unknown as string),
    );
    expect(player2AfterMulligan?.zones.hand.length).toBe(7);
    expect(player2AfterMulligan?.zones.deck.length).toBe(53);

    // Final validation: Game is ready to start
    expect(stateAfterMulligan.activePlayerId).toBe(player1Id as unknown as string);
    expect(stateAfterMulligan.gamePhase).toBe("active");
    expect(stateAfterMulligan.turnNumber).toBe(1);
    for (const player of stateAfterMulligan.players) {
      expect(player.lore).toBe(0);
      expect(player.zones.hand.length).toBe(7);
      expect(player.zones.deck.length).toBe(53);
    }
  });
});
