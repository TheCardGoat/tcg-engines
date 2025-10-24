/**
 * Move Enumeration System - Comprehensive Demo
 *
 * This example demonstrates all features of the move enumeration system:
 * - Card ID enumeration
 * - Target selection
 * - Numeric parameters
 * - Mode/choice selection
 * - Moves without parameters
 * - AI agent using enumeration
 * - UI integration pattern
 *
 * Run this example: `bun run docs/examples/move-enumeration-demo.ts`
 */

import {
  createPlayerId,
  type EnumeratedMove,
  type GameDefinition,
  type MoveDefinition,
  type Player,
  RuleEngine,
} from "@tcg/core";

// ============================================================================
// GAME STATE TYPES
// ============================================================================

type DemoGameState = {
  players: Array<{
    id: string;
    name: string;
    hand: string[];
    field: string[];
    deck: string[];
    life: number;
    mana: number;
    maxMana: number;
  }>;
  currentPlayerIndex: number;
  turn: number;
  phase: "draw" | "main" | "battle" | "end";
};

// ============================================================================
// MOVE PARAMETER TYPES
// ============================================================================

type PlayCardParams = {
  cardId: string;
  mode?: "normal" | "rush" | "stealth";
};

type AttackParams = {
  attackerId: string;
  targetId: string;
};

type DiscardParams = {
  count: number;
};

type DrawParams = {
  count: number;
};

type PassPhaseParams = Record<string, never>;

type DemoMoves = {
  playCard: PlayCardParams;
  attack: AttackParams;
  discard: DiscardParams;
  draw: DrawParams;
  passPhase: PassPhaseParams;
};

// ============================================================================
// MOVE DEFINITIONS WITH ENUMERATORS
// ============================================================================

/**
 * Play Card Move - Demonstrates card ID + mode enumeration
 */
const playCardMove: MoveDefinition<DemoGameState, PlayCardParams> = {
  id: "play-card",
  name: "Play Card",
  description: "Play a card from your hand",

  // Enumerate all cards in hand with all possible modes
  enumerator: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return [];

    const results: PlayCardParams[] = [];

    // For each card in hand
    for (const cardId of player.hand) {
      // Normal mode (always available)
      results.push({ cardId, mode: "normal" });

      // Special modes (conditional based on card type)
      if (cardId.includes("quick")) {
        results.push({ cardId, mode: "rush" });
      }

      if (cardId.includes("ninja")) {
        results.push({ cardId, mode: "stealth" });
      }
    }

    return results;
  },

  condition: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return false;

    // Must be in main phase
    if (state.phase !== "main") {
      return {
        reason: "Can only play cards during main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    // Must be current player
    if (state.players[state.currentPlayerIndex]?.id !== context.playerId) {
      return {
        reason: "Not your turn",
        errorCode: "NOT_YOUR_TURN",
      };
    }

    // Card must be in hand
    if (!player.hand.includes(context.params.cardId)) {
      return {
        reason: "Card not in hand",
        errorCode: "CARD_NOT_IN_HAND",
      };
    }

    // Check mana cost (example: 2 mana per card)
    const cost = 2;
    if (player.mana < cost) {
      return {
        reason: `Not enough mana. Required: ${cost}, Available: ${player.mana}`,
        errorCode: "INSUFFICIENT_MANA",
        context: { required: cost, available: player.mana },
      };
    }

    return true;
  },

  reducer: (draft, context) => {
    const player = draft.players.find((p) => p.id === context.playerId);
    if (!player) return;

    // Remove card from hand
    const index = player.hand.indexOf(context.params.cardId);
    if (index >= 0) {
      player.hand.splice(index, 1);
      player.field.push(context.params.cardId);
    }

    // Pay mana cost
    player.mana -= 2;

    // Apply mode effects
    if (context.params.mode === "rush") {
      console.log(`${context.params.cardId} played with RUSH!`);
    } else if (context.params.mode === "stealth") {
      console.log(`${context.params.cardId} played with STEALTH!`);
    }
  },

  metadata: {
    category: "action",
    tags: ["card", "play"],
    priority: 5,
  },
};

/**
 * Attack Move - Demonstrates multi-field parameters (attacker + target)
 */
const attackMove: MoveDefinition<DemoGameState, AttackParams> = {
  id: "attack",
  name: "Attack",
  description: "Attack with a creature",

  // Enumerate all attacker-target combinations
  enumerator: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return [];

    // Must be in battle phase
    if (state.phase !== "battle") return [];

    // Must be current player
    if (state.players[state.currentPlayerIndex]?.id !== context.playerId)
      return [];

    const results: AttackParams[] = [];

    // Get all opponent creatures
    const opponents = state.players.filter((p) => p.id !== context.playerId);

    for (const attackerId of player.field) {
      // For each opponent
      for (const opponent of opponents) {
        // Can attack opponent's creatures
        for (const targetId of opponent.field) {
          results.push({ attackerId, targetId });
        }

        // Can also attack player directly (use player ID as target)
        results.push({ attackerId, targetId: opponent.id });
      }
    }

    return results;
  },

  condition: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return false;

    // Must be in battle phase
    if (state.phase !== "battle") {
      return {
        reason: "Can only attack during battle phase",
        errorCode: "WRONG_PHASE",
      };
    }

    // Attacker must be in player's field
    if (!player.field.includes(context.params.attackerId)) {
      return {
        reason: "Attacker not on your field",
        errorCode: "INVALID_ATTACKER",
      };
    }

    // Validate target exists
    const targetIsPlayer = state.players.some(
      (p) => p.id === context.params.targetId,
    );
    const targetIsCreature = state.players.some((p) =>
      p.field.includes(context.params.targetId),
    );

    if (!(targetIsPlayer || targetIsCreature)) {
      return {
        reason: "Invalid target",
        errorCode: "INVALID_TARGET",
      };
    }

    return true;
  },

  reducer: (draft, context) => {
    console.log(
      `${context.params.attackerId} attacks ${context.params.targetId}!`,
    );

    // Check if target is a player or creature
    const targetPlayer = draft.players.find(
      (p) => p.id === context.params.targetId,
    );

    if (targetPlayer) {
      // Direct attack on player
      targetPlayer.life -= 3;
      console.log(`Player ${targetPlayer.id} takes 3 damage!`);
    } else {
      // Attack a creature (remove both)
      for (const player of draft.players) {
        const attackerIndex = player.field.indexOf(context.params.attackerId);
        const targetIndex = player.field.indexOf(context.params.targetId);

        if (attackerIndex >= 0) player.field.splice(attackerIndex, 1);
        if (targetIndex >= 0) player.field.splice(targetIndex, 1);
      }
      console.log("Creatures destroyed in battle!");
    }
  },

  metadata: {
    category: "combat",
    tags: ["battle", "attack"],
    priority: 10,
  },
};

/**
 * Discard Move - Demonstrates numeric parameters
 */
const discardMove: MoveDefinition<DemoGameState, DiscardParams> = {
  id: "discard",
  name: "Discard Cards",
  description: "Discard cards from your hand",

  // Enumerate different discard counts
  enumerator: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return [];

    const handSize = player.hand.length;
    const results: DiscardParams[] = [];

    // Generate options for discarding 1 to handSize cards
    for (let count = 1; count <= handSize; count++) {
      results.push({ count });
    }

    return results;
  },

  condition: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return false;

    if (player.hand.length < context.params.count) {
      return {
        reason: `Cannot discard ${context.params.count} cards (only have ${player.hand.length})`,
        errorCode: "INSUFFICIENT_CARDS",
        context: {
          requested: context.params.count,
          available: player.hand.length,
        },
      };
    }

    return true;
  },

  reducer: (draft, context) => {
    const player = draft.players.find((p) => p.id === context.playerId);
    if (!player) return;

    // Discard specified number of cards
    for (let i = 0; i < context.params.count; i++) {
      player.hand.pop();
    }

    console.log(`Discarded ${context.params.count} cards`);
  },

  metadata: {
    category: "action",
    tags: ["discard", "hand"],
  },
};

/**
 * Draw Move - Demonstrates numeric parameters (similar to discard)
 */
const drawMove: MoveDefinition<DemoGameState, DrawParams> = {
  id: "draw",
  name: "Draw Cards",
  description: "Draw cards from your deck",

  enumerator: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return [];

    // Must be in draw phase
    if (state.phase !== "draw") return [];

    const deckSize = player.deck.length;
    const results: DrawParams[] = [];

    // Standard draw (1 card)
    if (deckSize >= 1) {
      results.push({ count: 1 });
    }

    // Effect-based draws (2-3 cards)
    if (deckSize >= 2) {
      results.push({ count: 2 });
    }

    if (deckSize >= 3) {
      results.push({ count: 3 });
    }

    return results;
  },

  condition: (state, context) => {
    const player = state.players.find((p) => p.id === context.playerId);
    if (!player) return false;

    if (state.phase !== "draw") {
      return {
        reason: "Can only draw during draw phase",
        errorCode: "WRONG_PHASE",
      };
    }

    if (player.deck.length < context.params.count) {
      return {
        reason: `Cannot draw ${context.params.count} cards (only ${player.deck.length} in deck)`,
        errorCode: "INSUFFICIENT_DECK",
      };
    }

    return true;
  },

  reducer: (draft, context) => {
    const player = draft.players.find((p) => p.id === context.playerId);
    if (!player) return;

    // Draw cards from deck to hand
    for (let i = 0; i < context.params.count; i++) {
      const card = player.deck.pop();
      if (card) player.hand.push(card);
    }

    console.log(`Drew ${context.params.count} cards`);
  },
};

/**
 * Pass Phase Move - Demonstrates moves without parameters
 */
const passPhaseMove: MoveDefinition<DemoGameState, PassPhaseParams> = {
  id: "pass-phase",
  name: "Pass Phase",
  description: "Move to the next phase",

  // No parameters needed - return single empty object
  enumerator: () => [{}],

  condition: (state, context) => {
    return state.players[state.currentPlayerIndex]?.id === context.playerId;
  },

  reducer: (draft) => {
    // Advance phase
    const phaseOrder: Array<DemoGameState["phase"]> = [
      "draw",
      "main",
      "battle",
      "end",
    ];
    const currentIndex = phaseOrder.indexOf(draft.phase);

    if (currentIndex === phaseOrder.length - 1) {
      // End of turn - switch players
      draft.phase = "draw";
      draft.currentPlayerIndex =
        (draft.currentPlayerIndex + 1) % draft.players.length;
      draft.turn += 1;

      // Restore mana
      const currentPlayer = draft.players[draft.currentPlayerIndex];
      if (currentPlayer) {
        currentPlayer.maxMana = Math.min(currentPlayer.maxMana + 1, 10);
        currentPlayer.mana = currentPlayer.maxMana;
      }

      console.log(`Turn ${draft.turn} begins!`);
    } else {
      // Next phase
      draft.phase = phaseOrder[currentIndex + 1];
      console.log(`Entering ${draft.phase} phase`);
    }
  },

  metadata: {
    category: "phase",
    tags: ["pass", "advance"],
  },
};

// ============================================================================
// GAME DEFINITION
// ============================================================================

const demoGameDefinition: GameDefinition<DemoGameState, DemoMoves> = {
  name: "Move Enumeration Demo Game",
  setup: (players) => ({
    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      hand: ["card1", "card2", "quickCard", "ninjaCard"],
      field: [],
      deck: [
        "card5",
        "card6",
        "card7",
        "card8",
        "card9",
        "card10",
        "card11",
        "card12",
      ],
      life: 20,
      mana: 3,
      maxMana: 3,
    })),
    currentPlayerIndex: 0,
    turn: 1,
    phase: "draw",
  }),

  moves: {
    playCard: playCardMove,
    attack: attackMove,
    discard: discardMove,
    draw: drawMove,
    passPhase: passPhaseMove,
  },

  endIf: (state) => {
    // Check if any player has 0 or less life
    const loser = state.players.find((p) => p.life <= 0);
    if (loser) {
      const winner = state.players.find((p) => p.life > 0);
      return {
        winner: winner?.id,
        reason: `${loser.name} ran out of life`,
      };
    }

    // Check if any player has no deck
    const noCards = state.players.find(
      (p) => p.deck.length === 0 && p.hand.length === 0,
    );
    if (noCards) {
      const winner = state.players.find((p) => p !== noCards);
      return {
        winner: winner?.id,
        reason: `${noCards.name} has no cards left`,
      };
    }

    return undefined;
  },
};

// ============================================================================
// AI AGENT USING ENUMERATION
// ============================================================================

/**
 * Simple AI that uses move enumeration
 */
function simpleAI(
  engine: RuleEngine<DemoGameState, DemoMoves>,
  playerId: string,
) {
  console.log(`\n🤖 AI (${playerId}) is thinking...`);

  // Get all valid moves
  const moves = engine.enumerateMoves(createPlayerId(playerId), {
    validOnly: true,
    includeMetadata: true,
  });

  if (moves.length === 0) {
    console.log("❌ AI has no valid moves");
    return false;
  }

  console.log(`🔍 Found ${moves.length} possible moves`);

  // Score each move
  const scoredMoves = moves.map((move) => ({
    move,
    score: scoreMove(engine.getState(), move),
  }));

  // Sort by score (descending)
  scoredMoves.sort((a, b) => b.score - a.score);

  // Execute best move
  const bestMove = scoredMoves[0]?.move;
  if (bestMove) {
    console.log(
      `✅ AI chooses: ${bestMove.metadata?.displayName || bestMove.moveId}`,
    );
    console.log("   Params:", bestMove.params);

    const result = engine.executeMove(bestMove.moveId, {
      playerId: createPlayerId(playerId),
      params: bestMove.params,
    });

    return result.success;
  }

  return false;
}

/**
 * Score a move for AI decision making
 */
function scoreMove(state: DemoGameState, move: EnumeratedMove<any>): number {
  let score = 0;

  // Prioritize attacks
  if (move.moveId === "attack") {
    score += 100;
  }

  // Playing cards is good
  if (move.moveId === "playCard") {
    score += 50;
  }

  // Drawing cards is okay
  if (move.moveId === "draw") {
    score += 30;
  }

  // Passing phase is last resort
  if (move.moveId === "passPhase") {
    score += 1;
  }

  // Random tiebreaker
  score += Math.random() * 10;

  return score;
}

// ============================================================================
// UI PATTERN DEMONSTRATION
// ============================================================================

/**
 * Simulate a UI component using enumeration
 */
function displayAvailableMoves(
  engine: RuleEngine<DemoGameState, DemoMoves>,
  playerId: string,
) {
  console.log(`\n🎮 Available moves for ${playerId}:`);
  console.log("━".repeat(50));

  const moves = engine.enumerateMoves(createPlayerId(playerId), {
    validOnly: true,
    includeMetadata: true,
  });

  // Group by category
  const grouped = moves.reduce(
    (acc, move) => {
      const category = move.metadata?.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(move);
      return acc;
    },
    {} as Record<string, EnumeratedMove<any>[]>,
  );

  // Display grouped moves
  for (const [category, categoryMoves] of Object.entries(grouped)) {
    console.log(`\n📂 ${category.toUpperCase()}`);
    for (const move of categoryMoves) {
      const name = move.metadata?.displayName || move.moveId;
      const params = JSON.stringify(move.params);
      console.log(`  ▸ ${name} ${params}`);
    }
  }
}

// ============================================================================
// DEMO EXECUTION
// ============================================================================

function runDemo() {
  console.log("🎮 Move Enumeration System Demo");
  console.log("=".repeat(60));

  // Create game
  const players: Player[] = [
    { id: "player1", name: "Alice" },
    { id: "player2", name: "Bob" },
  ];

  const engine = new RuleEngine(demoGameDefinition, players, {
    seed: "demo-seed",
  });

  console.log("\n✅ Game created with 2 players");
  console.log("   Alice: 4 cards in hand, 8 in deck");
  console.log("   Bob: 4 cards in hand, 8 in deck");

  // Display available moves for player 1
  displayAvailableMoves(engine, "player1");

  // AI plays a few turns
  console.log("\n🤖 Running AI simulation...");
  console.log("=".repeat(60));

  for (let i = 0; i < 5; i++) {
    const state = engine.getState();
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) break;

    console.log(`\n[Turn ${state.turn}, Phase: ${state.phase}]`);
    console.log(
      `Current Player: ${currentPlayer.name} (Life: ${currentPlayer.life}, Mana: ${currentPlayer.mana})`,
    );

    const success = simpleAI(engine, currentPlayer.id);

    if (!success) {
      console.log("❌ AI move failed, ending demo");
      break;
    }

    // Check for game end
    const gameEnd = engine.checkGameEnd();
    if (gameEnd) {
      console.log("\n🏆 GAME OVER!");
      console.log(`   Winner: ${gameEnd.winner}`);
      console.log(`   Reason: ${gameEnd.reason}`);
      break;
    }
  }

  // Final stats
  console.log("\n📊 Final Game State:");
  console.log("=".repeat(60));
  const finalState = engine.getState();
  for (const player of finalState.players) {
    console.log(`\n${player.name}:`);
    console.log(`  Life: ${player.life}`);
    console.log(`  Mana: ${player.mana}/${player.maxMana}`);
    console.log(`  Hand: ${player.hand.length} cards`);
    console.log(`  Field: ${player.field.length} creatures`);
    console.log(`  Deck: ${player.deck.length} cards`);
  }

  console.log("\n✅ Demo Complete!");
}

// Run the demo
runDemo();
