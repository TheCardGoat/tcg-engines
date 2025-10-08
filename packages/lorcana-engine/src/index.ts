/**
 * @tcg/lorcana - Disney Lorcana TCG Engine
 *
 * A complete implementation of Disney Lorcana using the @tcg/core framework.
 * This package serves as both a production-ready Lorcana engine and a reference
 * implementation demonstrating best practices for building TCG engines.
 *
 * Getting Started:
 * 1. See /GAME_ENGINE_SETUP_GUIDE.md for complete setup instructions
 * 2. See /packages/template-engine for a minimal working example
 * 3. Follow the patterns from template-engine to implement Lorcana rules
 *
 * Key Concepts:
 * - NO defineMove(), defineZone(), definePhase(), defineCard() helpers
 * - Use GameDefinition<TState, TMoves> type directly
 * - Zones are simple state arrays: Record<PlayerId, CardId[]>
 * - Cards are plain objects in lookup tables
 * - Moves use GameMoveDefinitions with condition and reducer
 * - Flow is optional - use FlowDefinition or simple state tracking
 */

// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
} from "@tcg/core";

// Game definition exports (to be implemented)
// export * from "./game-definition";

// Move exports (to be implemented)
// export * from "./moves";

// Card exports (to be implemented)
// export * from "./cards";

// Type exports (to be implemented)
// export * from "./types";

// Query exports (to be implemented)
// export * from "./queries";
