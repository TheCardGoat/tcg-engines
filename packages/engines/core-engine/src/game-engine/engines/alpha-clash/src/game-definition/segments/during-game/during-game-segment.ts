/**
 * During Game segment for Alpha Clash
 *
 * Handles the main game flow including:
 * - Turn structure (Start, Expansion, Primary, Clash, End phases)
 * - Expansion phase steps (Ready, Draw, Resource)
 * - Clash phase steps (Attack, Counter, Obstruct, Clash Buffs, Damage)
 * - Priority windows and effect resolution
 */

import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { AlphaClashGameState } from "../../../../alpha-clash-engine-types";
import { alphaClashMoves } from "../../../moves/moves";

export const duringGameSegment: SegmentConfig<AlphaClashGameState> = {
  next: "endGame",

  onBegin: ({ G }) => {
    logger.info("==== MAIN GAME PHASE ====");

    const gameState: AlphaClashGameState = {
      ...G,
      currentPhase: "startOfTurn",
    };

    return gameState;
  },

  endIf: ({ ctx }) => {
    // End when game has a winner
    return !!ctx.gameOver;
  },

  onEnd: ({ G }) => {
    logger.info("Main game phase complete");
    return G;
  },

  turn: {
    phases: {
      // Start of Turn Phase
      startOfTurn: {
        start: true,
        next: "expansion",

        onBegin: ({ G, ctx, coreOps }) => {
          const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
          logger.info(`=== START OF TURN: ${currentPlayer} ===`);

          const updatedState: AlphaClashGameState = {
            ...G,
            currentPhase: "startOfTurn",
          };

          // Trigger start of turn effects
          // TODO: Implement triggered ability system

          return updatedState;
        },

        endIf: () => true, // Always move to next phase immediately

        moves: {
          // No moves available during start of turn - automatic phase
        },
      },

      // Expansion Phase (Ready, Draw, Resource steps)
      expansion: {
        next: "primary",

        onBegin: ({ G, ctx, coreOps }) => {
          const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
          logger.info(`=== EXPANSION PHASE: ${currentPlayer} ===`);

          // Ready Step - ready all cards (except first turn for first player)
          const isFirstTurn =
            ctx.numTurns === 1 && currentPlayer === ctx.playerOrder[0];
          if (!isFirstTurn) {
            // TODO: Ready all engaged cards for current player
            logger.info("Ready step: readying all engaged cards");
          }

          // Draw Step - draw a card (except first turn for first player)
          if (!isFirstTurn) {
            coreOps.moveCard({
              playerId: currentPlayer,
              from: "deck",
              to: "hand",
              destination: "end",
            });
            logger.info(`${currentPlayer} drew a card`);
          }

          // Resource Step - may place a card in resource zone
          logger.info("Resource step: may place a card in resource zone");

          const updatedState: AlphaClashGameState = {
            ...G,
            currentPhase: "expansion",
            currentExpansionStep: "resource",
          };

          return updatedState;
        },

        endIf: ({ G }) => {
          // End when player has finished resource step
          return G.currentExpansionStep !== "resource";
        },

        moves: {
          // placeResource: alphaClashMoves.placeResource,
          // endPhase: alphaClashMoves.endPhase,
        },
      },

      // Primary Phase - main phase for playing cards
      primary: {
        next: "endOfTurn", // Default to end turn, can be changed to clash

        onBegin: ({ G, ctx }) => {
          const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
          logger.info(`=== PRIMARY PHASE: ${currentPlayer} ===`);

          const updatedState: AlphaClashGameState = {
            ...G,
            currentPhase: "primary",
          };

          return updatedState;
        },

        endIf: ({ G }) => {
          // End when player ends phase or initiates clash
          return G.currentPhase !== "primary";
        },

        moves: {
          // playCard: alphaClashMoves.playCard,
          // setTrap: alphaClashMoves.setTrap,
          // attachWeapon: alphaClashMoves.attachWeapon,
          // activateAbility: alphaClashMoves.activateAbility,
          // initiateClash: alphaClashMoves.initiateClash,
          // endPhase: alphaClashMoves.endPhase,
        },
      },

      // Clash Phase - combat resolution
      clash: {
        next: "endOfTurn",

        onBegin: ({ G, ctx }) => {
          const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
          logger.info(`=== CLASH PHASE: ${currentPlayer} ===`);

          const updatedState: AlphaClashGameState = {
            ...G,
            currentPhase: "clash",
            currentClashStep: "attack",
            clashState: {
              attackers: [],
              defenders: [],
              obstructors: {} as Record<string, string>,
              clashBuffs: {},
              damage: {} as Record<string, number>,
            },
          };

          return updatedState;
        },

        endIf: ({ G }) => {
          // End when damage step is complete
          return G.currentClashStep !== "damage" && G.currentPhase === "clash";
        },

        onEnd: ({ G, coreOps }) => {
          // Clean up clash state
          const updatedState: AlphaClashGameState = {
            ...G,
            clashState: undefined,
            currentClashStep: undefined,
          };

          // Remove clash damage from cards
          // TODO: Implement damage cleanup

          logger.info("Clash phase complete");
          return updatedState;
        },

        moves: {
          // declareAttackers: alphaClashMoves.declareAttackers,
          // counterAttack: alphaClashMoves.counterAttack,
          // declareObstructors: alphaClashMoves.declareObstructors,
          // playClashBuff: alphaClashMoves.playClashBuff,
          // passPriority: alphaClashMoves.passPriority,
        },
      },

      // End of Turn Phase
      endOfTurn: {
        onBegin: ({ G, ctx, coreOps }) => {
          const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
          logger.info(`=== END OF TURN: ${currentPlayer} ===`);

          // Trigger end of turn effects
          // Remove "until end of turn" effects
          // Remove non-clash damage from Clash cards

          const updatedState: AlphaClashGameState = {
            ...G,
            currentPhase: "endOfTurn",
          };

          return updatedState;
        },

        endIf: () => true, // Always end turn

        onEnd: ({ G, ctx, coreOps }) => {
          // Move to next player's turn - this is handled automatically by the framework
          logger.info(`Turn ${ctx.numTurns} complete, moving to next player`);
          return G;
        },

        moves: {
          // No moves available during end of turn - automatic phase
        },
      },
    },
  },
};
