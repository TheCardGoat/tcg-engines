/**
 * Gundam Card Game - Phase Definitions
 *
 * This directory contains all phase definitions for the Gundam Card Game turn structure.
 * Each turn consists of five phases executed in order.
 *
 * Turn Structure:
 * 1. Start Phase
 *    - Active Step: Untap all cards
 *    - Start Step: Trigger "at start of turn" effects
 *
 * 2. Draw Phase
 *    - Draw one card from deck
 *    - (If deck is empty, player loses)
 *
 * 3. Resource Phase
 *    - Place one resource card from resource deck
 *
 * 4. Main Phase
 *    - Play cards from hand
 *    - Activate abilities
 *    - Attack with units
 *    - Declare end of main phase
 *
 * 5. End Phase
 *    - Action Step: Both players can play [Action] cards
 *    - End Step: Trigger "at end of turn" effects (e.g., <Repair>)
 *    - Hand Step: Discard down to 10 cards if over limit
 *    - Cleanup Step: End "during this turn" effects
 *
 * @example Phase Definition
 * ```typescript
 * import { definePhase } from "@tcg/core";
 * import type { GundamGameState } from "../types";
 *
 * export const DrawPhase = definePhase<GundamGameState>({
 *   id: "draw",
 *   name: "Draw Phase",
 *
 *   // Called when entering this phase
 *   onEnter: (state) => {
 *     const currentPlayer = state.currentPlayer;
 *     const deck = state.zones.deck[currentPlayer];
 *
 *     // Check if deck is empty (lose condition)
 *     if (deck.length === 0) {
 *       return {
 *         ...state,
 *         winner: getOpponent(currentPlayer),
 *         gameOver: true,
 *         gameOverReason: "DECK_OUT",
 *       };
 *     }
 *
 *     // Draw top card
 *     const [topCard, ...remainingDeck] = deck;
 *     const hand = state.zones.hand[currentPlayer];
 *
 *     return {
 *       ...state,
 *       zones: {
 *         ...state.zones,
 *         deck: {
 *           ...state.zones.deck,
 *           [currentPlayer]: remainingDeck,
 *         },
 *         hand: {
 *           ...state.zones.hand,
 *           [currentPlayer]: [...hand, topCard],
 *         },
 *       },
 *     };
 *   },
 *
 *   // What moves are valid during this phase?
 *   validMoves: [],  // Draw is automatic, no player actions
 *
 *   // Called when exiting this phase
 *   onExit: (state) => {
 *     // No cleanup needed for draw phase
 *     return state;
 *   },
 *
 *   // Determine next phase
 *   nextPhase: (state) => {
 *     // Always proceed to Resource Phase
 *     return "resource";
 *   },
 * });
 * ```
 *
 * @example Main Phase (Complex)
 * ```typescript
 * export const MainPhase = definePhase<GundamGameState>({
 *   id: "main",
 *   name: "Main Phase",
 *
 *   onEnter: (state) => {
 *     // Reset main phase flags
 *     return {
 *       ...state,
 *       gundam: {
 *         ...state.gundam,
 *         mainPhaseEnded: false,
 *       },
 *     };
 *   },
 *
 *   // All possible actions in main phase
 *   validMoves: [
 *     "DEPLOY_UNIT",
 *     "PAIR_PILOT",
 *     "DEPLOY_BASE",
 *     "PLAY_COMMAND",
 *     "ACTIVATE_ABILITY",
 *     "ATTACK",
 *     "END_MAIN_PHASE",
 *   ],
 *
 *   onExit: (state) => {
 *     // Clear any temporary main phase state
 *     return state;
 *   },
 *
 *   nextPhase: (state) => {
 *     // Proceed to End Phase
 *     return "end";
 *   },
 * });
 * ```
 *
 * @example Start Phase (Multiple Steps)
 * ```typescript
 * export const StartPhase = definePhase<GundamGameState>({
 *   id: "start",
 *   name: "Start Phase",
 *
 *   onEnter: (state) => {
 *     const currentPlayer = state.currentPlayer;
 *
 *     // Active Step: Untap all cards
 *     let newState = untapAllCards(state, currentPlayer);
 *
 *     // Start Step: Trigger "at start of turn" effects
 *     const startTriggers = collectTriggeredAbilities(
 *       newState,
 *       "START_OF_TURN",
 *       currentPlayer
 *     );
 *
 *     // Execute all triggered abilities
 *     for (const trigger of startTriggers) {
 *       newState = executeAbility(newState, trigger);
 *     }
 *
 *     return newState;
 *   },
 *
 *   validMoves: [],  // Start phase is automatic
 *
 *   onExit: (state) => state,
 *
 *   nextPhase: (state) => "draw",
 * });
 * ```
 */

// Phase implementations will go here
// export { StartPhase } from "./start-phase";
// export { DrawPhase } from "./draw-phase";
// export { ResourcePhase } from "./resource-phase";
// export { MainPhase } from "./main-phase";
// export { EndPhase } from "./end-phase";

