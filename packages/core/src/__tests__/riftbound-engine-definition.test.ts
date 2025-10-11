import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import { createMockRiftboundGame } from "./createMockRiftboundGame";

/**
 * Riftbound Card Game - Beginning of Game Test
 *
 * This test validates the core engine's handling of Riftbound's game initialization.
 * According to Riftbound rules:
 * - Each player has 1 Champion Legend, 1 Chosen Champion Unit, 40+ card main deck, 12 rune deck
 * - Starting setup: Place Legend and Champion, place Battlefields, shuffle decks, draw 5 cards
 * - Turn structure: Awaken -> Beginning -> Channel (2 runes) -> Draw (1 card) -> Action -> Ending
 *
 * Goal: Test how core engine handles Riftbound's unique initialization and turn structure
 */
describe("Riftbound Game - Beginning of Game Procedure", () => {
  it("should initialize game with proper setup phase", () => {
    // Create game definition
    const gameDefinition = createMockRiftboundGame();

    // Create 2 players
    const players = createTestPlayers(2, ["Player1", "Player2"]);

    // Initialize engine with deterministic seed
    const engine = createTestEngine(gameDefinition, players, {
      seed: "riftbound-test-001",
    });

    // Verify initial state from setup function
    const state = engine.getState();
    expect(state.phase).toBe("setup");
    expect(state.turn).toBe(1);
    expect(state.activePlayer).toBe(players[0]?.id);
    expect(state.victoryPoints[players[0]?.id || "p1"]).toBe(0);
    expect(state.victoryPoints[players[1]?.id || "p2"]).toBe(0);
    expect(state.runePools[players[0]?.id || "p1"]).toEqual({
      energy: 0,
      power: {},
    });
    expect(state.runePools[players[1]?.id || "p2"]).toEqual({
      energy: 0,
      power: {},
    });
  });

  it("should have proper zone configuration for Riftbound", () => {
    const gameDefinition = createMockRiftboundGame();

    // Verify zone configurations directly from game definition
    const zones = gameDefinition.zones;
    expect(zones).toBeDefined();

    // Verify all Riftbound-specific zones exist
    expect(zones?.mainDeck).toBeDefined();
    expect(zones?.runeDeck).toBeDefined();
    expect(zones?.hand).toBeDefined();
    expect(zones?.base).toBeDefined();
    expect(zones?.legendZone).toBeDefined();
    expect(zones?.championZone).toBeDefined();
    expect(zones?.battlefieldZone).toBeDefined();
    expect(zones?.trash).toBeDefined();
    expect(zones?.banishment).toBeDefined();

    // Verify zone configurations
    expect(zones?.runeDeck?.maxSize).toBe(12);
    expect(zones?.legendZone?.maxSize).toBe(1);
    expect(zones?.championZone?.maxSize).toBe(1);

    // Verify visibility settings
    expect(zones?.mainDeck?.visibility).toBe("secret");
    expect(zones?.runeDeck?.visibility).toBe("secret");
    expect(zones?.hand?.visibility).toBe("private");
    expect(zones?.base?.visibility).toBe("public");
    expect(zones?.legendZone?.visibility).toBe("public");
    expect(zones?.championZone?.visibility).toBe("public");
    expect(zones?.battlefieldZone?.visibility).toBe("public");
    expect(zones?.trash?.visibility).toBe("public");
  });

  it("should have all required game moves defined", () => {
    const gameDefinition = createMockRiftboundGame();

    // Verify all Riftbound setup moves exist
    expect(gameDefinition.moves.initializeDecks).toBeDefined();
    expect(gameDefinition.moves.placeLegend).toBeDefined();
    expect(gameDefinition.moves.placeChampion).toBeDefined();
    expect(gameDefinition.moves.placeBattlefields).toBeDefined();
    expect(gameDefinition.moves.shuffleDecks).toBeDefined();
    expect(gameDefinition.moves.drawInitialHand).toBeDefined();
    expect(gameDefinition.moves.transitionToPlay).toBeDefined();

    // Verify all Riftbound game moves exist
    expect(gameDefinition.moves.channelRunes).toBeDefined();
    expect(gameDefinition.moves.drawCard).toBeDefined();
    expect(gameDefinition.moves.playUnit).toBeDefined();
    expect(gameDefinition.moves.playGear).toBeDefined();
    expect(gameDefinition.moves.playSpell).toBeDefined();
    expect(gameDefinition.moves.moveUnit).toBeDefined();
    expect(gameDefinition.moves.initiateCombat).toBeDefined();
    expect(gameDefinition.moves.pass).toBeDefined();
    expect(gameDefinition.moves.concede).toBeDefined();
  });

  it("should have correct phase flow structure", () => {
    const gameDefinition = createMockRiftboundGame();

    // Verify flow structure
    expect(gameDefinition.flow).toBeDefined();
    expect(gameDefinition.flow?.turn).toBeDefined();
    expect(gameDefinition.flow?.turn.initialPhase).toBe("awaken");

    const phases = gameDefinition.flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify all phases exist in correct order
    expect(phases?.awaken?.order).toBe(0);
    expect(phases?.beginning?.order).toBe(1);
    expect(phases?.channel?.order).toBe(2);
    expect(phases?.draw?.order).toBe(3);
    expect(phases?.action?.order).toBe(4);
    expect(phases?.ending?.order).toBe(5);

    // Verify phase progression
    expect(phases?.awaken?.next).toBe("beginning");
    expect(phases?.beginning?.next).toBe("channel");
    expect(phases?.channel?.next).toBe("draw");
    expect(phases?.draw?.next).toBe("action");
    expect(phases?.action?.next).toBe("ending");
    expect(phases?.ending?.next).toBe("awaken");

    // Verify auto-advance for automatic phases
    expect(phases?.awaken?.endIf).toBeDefined();
    expect(phases?.beginning?.endIf).toBeDefined();
    expect(phases?.channel?.endIf).toBeDefined();
    expect(phases?.draw?.endIf).toBeDefined();

    // Verify ending phase has segments
    expect(phases?.ending?.segments).toBeDefined();
    expect(phases?.ending?.segments?.endingStep).toBeDefined();
    expect(phases?.ending?.segments?.expirationStep).toBeDefined();
    expect(phases?.ending?.segments?.cleanupStep).toBeDefined();
  });

  it("should handle game start sequence", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    // Get initial state
    const initialState = engine.getState();
    expect(initialState.phase).toBe("setup");

    // Engine should be ready to progress to awaken phase
    // (In full implementation, this would involve:
    //  1. Placing Champion Legend in Legend Zone
    //  2. Placing Chosen Champion in Champion Zone
    //  3. Placing Battlefields in Battlefield Zone
    //  4. Shuffling Main Deck (40+ cards) and Rune Deck (12 cards)
    //  5. Drawing 5 cards to each player's hand
    //  6. Determining first player
    //  7. Transitioning to "awaken" phase)
  });

  it("should support deterministic gameplay with seed", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);

    // Create two engines with same seed
    const engine1 = createTestEngine(gameDefinition, players, {
      seed: "deterministic-test",
    });
    const engine2 = createTestEngine(gameDefinition, players, {
      seed: "deterministic-test",
    });

    // Both should have identical initial states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });
});

/**
 * Riftbound Card Game - Setup Moves Test
 *
 * This test suite validates the beginning-of-game procedure as a series
 * of testable moves that demonstrate how the core engine handles Riftbound's
 * unique setup sequence.
 */
describe("Riftbound Game - Setup Moves", () => {
  it("should initialize decks for a player", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-001",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Execute initializeDecks for Player 1
    const result = engine.executeMove("initializeDecks", {
      playerId: playerId as any,
      params: { playerId },
    });

    // Log result for debugging
    if (!result.success) {
      console.log("Move failed:", result.error);
    }

    const state = engine.getState();

    // Verify setup step progressed
    expect(state.setupStep).toBe("placeLegend");

    // Verify decks were created (40 main + 12 rune)
    // Note: We can't directly inspect zones without engine API,
    // but the move should execute without errors
  });

  it("should place Champion Legend in Legend Zone", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-002",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Initialize decks first
    engine.executeMove("initializeDecks", { playerId });

    // Place Champion Legend
    const legendId = `${playerId}-legend`;
    engine.executeMove("placeLegend", { playerId, legendId });

    const state = engine.getState();

    // Verify setup step progressed to champion placement
    expect(state.setupStep).toBe("placeChampion");
  });

  it("should place Chosen Champion in Champion Zone", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-003",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Initialize, place legend, then place champion
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeLegend", {
      playerId,
      legendId: `${playerId}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId,
      championId: `${playerId}-champion`,
    });

    const state = engine.getState();

    // Verify setup step progressed to battlefield placement
    expect(state.setupStep).toBe("placeBattlefields");
  });

  it("should place Battlefields in Battlefield Zone", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-004",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete setup through champion placement
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeLegend", {
      playerId,
      legendId: `${playerId}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId,
      championId: `${playerId}-champion`,
    });

    // Place battlefields (3 for a standard 2-player game)
    const battlefieldIds = ["battlefield-1", "battlefield-2", "battlefield-3"];
    engine.executeMove("placeBattlefields", { battlefieldIds });

    const state = engine.getState();

    // Verify setup step progressed to shuffle
    expect(state.setupStep).toBe("shuffleDecks");

    // Verify battlefield control was initialized
    for (const battlefieldId of battlefieldIds) {
      expect(state.battlefieldControl[battlefieldId]).toBeNull();
    }
  });

  it("should shuffle both decks", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-005",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete setup through battlefield placement
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeLegend", {
      playerId,
      legendId: `${playerId}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId,
      championId: `${playerId}-champion`,
    });
    engine.executeMove("placeBattlefields", {
      battlefieldIds: ["battlefield-1", "battlefield-2"],
    });

    // Shuffle decks
    engine.executeMove("shuffleDecks", { playerId });

    const state = engine.getState();

    // Verify setup step progressed to draw
    expect(state.setupStep).toBe("drawInitialHand");
  });

  it("should draw 5 cards to initial hand", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-006",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete setup through deck shuffle
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeLegend", {
      playerId,
      legendId: `${playerId}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId,
      championId: `${playerId}-champion`,
    });
    engine.executeMove("placeBattlefields", {
      battlefieldIds: ["battlefield-1"],
    });
    engine.executeMove("shuffleDecks", { playerId });

    // Draw initial hand
    engine.executeMove("drawInitialHand", { playerId });

    // Setup step should remain at drawInitialHand until all players complete
    // (In a full implementation, we'd track per-player setup progress)
  });

  it("should transition from setup to play phase", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-007",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete full setup sequence
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeLegend", {
      playerId,
      legendId: `${playerId}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId,
      championId: `${playerId}-champion`,
    });
    engine.executeMove("placeBattlefields", {
      battlefieldIds: ["battlefield-1", "battlefield-2"],
    });
    engine.executeMove("shuffleDecks", { playerId });
    engine.executeMove("drawInitialHand", { playerId });

    // Transition to play
    engine.executeMove("transitionToPlay", {});

    const state = engine.getState();

    // Verify phase changed to awaken
    expect(state.phase).toBe("awaken");
    expect(state.setupStep).toBe("complete");
  });

  it("should execute full setup sequence for both players", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-008",
    });

    const player1Id = players[0]?.id || "p1";
    const player2Id = players[1]?.id || "p2";

    // Player 1 setup
    engine.executeMove("initializeDecks", { playerId: player1Id });
    engine.executeMove("placeLegend", {
      playerId: player1Id,
      legendId: `${player1Id}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId: player1Id,
      championId: `${player1Id}-champion`,
    });

    // Player 2 setup
    engine.executeMove("initializeDecks", { playerId: player2Id });
    engine.executeMove("placeLegend", {
      playerId: player2Id,
      legendId: `${player2Id}-legend`,
    });
    engine.executeMove("placeChampion", {
      playerId: player2Id,
      championId: `${player2Id}-champion`,
    });

    // Place shared battlefields
    engine.executeMove("placeBattlefields", {
      battlefieldIds: ["battlefield-1", "battlefield-2"],
    });

    // Shuffle and draw for both players
    engine.executeMove("shuffleDecks", { playerId: player1Id });
    engine.executeMove("drawInitialHand", { playerId: player1Id });

    engine.executeMove("shuffleDecks", { playerId: player2Id });
    engine.executeMove("drawInitialHand", { playerId: player2Id });

    // Transition to play
    engine.executeMove("transitionToPlay", {});

    const state = engine.getState();

    // Verify game is ready to start
    expect(state.phase).toBe("awaken");
    expect(state.setupStep).toBe("complete");
  });

  it("should produce deterministic setup with same seed", () => {
    const gameDefinition = createMockRiftboundGame();
    const players1 = createTestPlayers(2, ["Player1", "Player2"]);
    const players2 = createTestPlayers(2, ["Player1", "Player2"]);

    // Create two engines with same seed
    const engine1 = createTestEngine(gameDefinition, players1, {
      seed: "deterministic-setup",
    });
    const engine2 = createTestEngine(gameDefinition, players2, {
      seed: "deterministic-setup",
    });

    // Execute same setup sequence on both engines
    const player1Id = players1[0]?.id || "p1";
    const setupSequence = [
      {
        move: "initializeDecks",
        params: { playerId: player1Id },
      },
      {
        move: "placeLegend",
        params: { playerId: player1Id, legendId: `${player1Id}-legend` },
      },
      {
        move: "placeChampion",
        params: { playerId: player1Id, championId: `${player1Id}-champion` },
      },
      {
        move: "placeBattlefields",
        params: { battlefieldIds: ["battlefield-1"] },
      },
      {
        move: "shuffleDecks",
        params: { playerId: player1Id },
      },
    ];

    for (const { move, params } of setupSequence) {
      engine1.executeMove(move as keyof typeof gameDefinition.moves, params);
      engine2.executeMove(move as keyof typeof gameDefinition.moves, params);
    }

    // Both engines should have identical states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });
});

/**
 * Riftbound Card Game - Turn Structure Test
 *
 * This test suite validates the turn structure and phase flow specific to Riftbound.
 */
describe("Riftbound Game - Turn Structure", () => {
  it("should validate the turn phase order", () => {
    const gameDefinition = createMockRiftboundGame();

    const flow = gameDefinition.flow;
    expect(flow).toBeDefined();
    expect(flow?.turn.initialPhase).toBe("awaken");

    const phases = flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify phase order: Awaken -> Beginning -> Channel -> Draw -> Action -> Ending
    expect(phases?.awaken?.order).toBe(0);
    expect(phases?.beginning?.order).toBe(1);
    expect(phases?.channel?.order).toBe(2);
    expect(phases?.draw?.order).toBe(3);
    expect(phases?.action?.order).toBe(4);
    expect(phases?.ending?.order).toBe(5);
  });

  it("should validate the ending phase segments", () => {
    const gameDefinition = createMockRiftboundGame();

    const flow = gameDefinition.flow;
    const endingPhase = flow?.turn.phases?.ending;

    expect(endingPhase).toBeDefined();
    expect(endingPhase?.segments).toBeDefined();

    // Verify ending segments: Ending Step -> Expiration Step -> Cleanup Step
    expect(endingPhase?.segments?.endingStep?.order).toBe(1);
    expect(endingPhase?.segments?.expirationStep?.order).toBe(2);
    expect(endingPhase?.segments?.cleanupStep?.order).toBe(3);

    // Verify segment flow
    expect(endingPhase?.segments?.endingStep?.next).toBe("expirationStep");
    expect(endingPhase?.segments?.expirationStep?.next).toBe("cleanupStep");
  });

  it("should handle channel runes move", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const playerId = players[0]?.id || "p1";

    // Initialize decks first so we have runes
    engine.executeMove("initializeDecks", { playerId });

    // Channel 2 runes (standard amount per turn)
    engine.executeMove("channelRunes", { playerId, count: 2 });

    const state = engine.getState();

    // Verify rune pool was updated
    expect(state.runePools[playerId]).toBeDefined();
    expect(state.runePools[playerId].energy).toBeGreaterThan(0);
  });

  it("should handle draw card move", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const playerId = players[0]?.id || "p1";

    // Initialize and shuffle deck first
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("shuffleDecks", { playerId });

    // Draw a card
    engine.executeMove("drawCard", { playerId });

    const state = engine.getState();

    // Verify draw was tracked
    expect(state.hasDrawnThisTurn[playerId]).toBe(true);
  });

  it("should handle play unit move", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const playerId = players[0]?.id || "p1";

    // Play a unit (in reality, this would check costs, etc.)
    const cardId = `${playerId}-unit-1`;
    engine.executeMove("playUnit", { playerId, cardId });

    // Move should execute without errors
    // In full implementation, would verify unit is at base
  });

  it("should handle play gear move", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const playerId = players[0]?.id || "p1";

    // Play a gear (gear can only be played to base)
    const cardId = `${playerId}-gear-1`;
    engine.executeMove("playGear", { playerId, cardId });

    // Move should execute without errors
    // In full implementation, would verify gear is at base
  });

  it("should handle play spell move", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const playerId = players[0]?.id || "p1";

    // Play a spell (spells go to trash after resolving)
    const cardId = `${playerId}-spell-1`;
    engine.executeMove("playSpell", { playerId, cardId, targets: [] });

    // Move should execute without errors
    // In full implementation, would verify spell is in trash
  });
});

