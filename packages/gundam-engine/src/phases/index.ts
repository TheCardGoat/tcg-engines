/**
 * Gundam Card Game - Phase/Flow Definitions
 *
 * This file defines the turn structure and phase flow for the Gundam Card Game.
 * In @tcg/core, flow is managed through FlowDefinition (optional) or simple state tracking.
 *
 * Gundam Turn Structure:
 * 1. Setup Phase (turn 1 only) - Draw initial hand, deploy base, shuffle shields
 * 2. Refresh Phase - Untap units, reset abilities
 * 3. Draw Phase - Draw 1 card from deck
 * 4. Resource Phase - Play 1 resource (optional)
 * 5. Main Phase - Deploy units/bases, activate abilities, declare attacks
 * 6. End Phase - Discard to hand limit, end-of-turn effects
 *
 * @example Simple Phase Tracking (Recommended)
 * ```typescript
 * type GundamGameState = {
 *   // ... other state
 *   phase: "setup" | "refresh" | "draw" | "resource" | "main" | "end";
 *   turnNumber: number;
 *   currentPlayerIndex: number;
 * };
 *
 * // In move reducer:
 * const moves: GameMoveDefinitions<GundamGameState, GundamGameMoves> = {
 *   endPhase: {
 *     reducer: (draft) => {
 *       const phaseOrder = ["setup", "refresh", "draw", "resource", "main", "end"] as const;
 *       const currentIndex = phaseOrder.indexOf(draft.phase);
 *
 *       if (currentIndex === phaseOrder.length - 1) {
 *         // End turn - move to next player
 *         draft.currentPlayerIndex = (draft.currentPlayerIndex + 1) % draft.players.length;
 *         draft.turnNumber += 1;
 *         draft.phase = draft.turnNumber === 1 ? "setup" : "refresh";
 *       } else {
 *         draft.phase = phaseOrder[currentIndex + 1];
 *       }
 *     },
 *   },
 * };
 * ```
 *
 * @example Advanced Flow with FlowDefinition (Optional)
 * ```typescript
 * import type { FlowDefinition } from "@tcg/core";
 *
 * const flow: FlowDefinition<GundamGameState> = {
 *   turn: {
 *     onBegin: (context) => {
 *       // Start of turn actions
 *       context.state.phase = "refresh";
 *     },
 *     onEnd: (context) => {
 *       // End of turn cleanup
 *       context.state.currentPlayerIndex =
 *         (context.state.currentPlayerIndex + 1) % context.state.players.length;
 *     },
 *     phases: {
 *       refresh: {
 *         order: 0,
 *         next: "draw",
 *         onBegin: (context) => {
 *           // Untap all units
 *           for (const card of Object.values(context.state.cards)) {
 *             if (card.tapped) {
 *               card.tapped = false;
 *             }
 *           }
 *         },
 *       },
 *       draw: {
 *         order: 1,
 *         next: "resource",
 *       },
 *       resource: {
 *         order: 2,
 *         next: "main",
 *       },
 *       main: {
 *         order: 3,
 *         next: "end",
 *       },
 *       end: {
 *         order: 4,
 *         next: undefined, // End turn
 *       },
 *     },
 *   },
 * };
 * ```
 *
 * Key Points:
 * - NO definePhase() helper - use FlowDefinition type or simple state
 * - Simple approach: track phase as string in state, progress in moves
 * - Advanced approach: use FlowDefinition with lifecycle hooks
 * - Phase validation done in move conditions
 * - FlowDefinition is optional - only use if you need complex flow
 *
 * See template-engine package for simple phase management example.
 * See core integration tests for FlowDefinition examples.
 */

// Flow will be defined in game-definition.ts as part of GameDefinition
