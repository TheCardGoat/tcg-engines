import { type PlayerId, RuleEngine } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../types";
import type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveValidationError,
} from "../types/move-enumeration";

/**
 * Lorcana Engine
 *
 * Extended RuleEngine with move enumeration capabilities for AI agents
 * and UI components.
 *
 * Provides APIs to:
 * - Discover available moves at any game state
 * - Enumerate valid parameters for moves
 * - Get detailed move information with metadata
 * - Understand why moves cannot be executed
 *
 * @example
 * ```typescript
 * const engine = new LorcanaEngine(gameDefinition);
 *
 * // Get available moves for a player
 * const moves = engine.getAvailableMoves(playerId);
 *
 * // Enumerate parameters for a specific move
 * const params = engine.enumerateMoveParameters("playCard", playerId);
 *
 * // Get detailed info about available moves
 * const detailedMoves = engine.getAvailableMovesDetailed(playerId);
 *
 * // Understand why a move is invalid
 * const error = engine.whyCannotExecuteMove("playCard", { cardId: "card1" });
 * ```
 */
export class LorcanaEngine extends RuleEngine<
  LorcanaGameState,
  LorcanaMoveParams,
  any,
  LorcanaCardMeta
> {
  /**
   * Get all available moves for a player
   *
   * Returns move IDs that:
   * 1. Pass their condition checks
   * 2. Are appropriate for current phase
   * 3. Can be executed by the given player
   *
   * @param playerId - Player to check moves for
   * @returns Array of available move IDs
   *
   * @example
   * ```typescript
   * const moves = engine.getAvailableMoves("player_one");
   * // => ["chooseWhoGoesFirstMove"]
   * ```
   */
  getAvailableMoves(playerId: PlayerId): string[] {
    // Delegate to base RuleEngine implementation
    // This provides condition-based move filtering
    return this.getValidMoves(playerId);
  }

  /**
   * Get detailed information about available moves
   *
   * Includes move metadata, display information, and parameter hints.
   * Useful for UI to show rich move information to players.
   *
   * @param playerId - Player to check moves for
   * @returns Array of move information objects
   *
   * @example
   * ```typescript
   * const moves = engine.getAvailableMovesDetailed("player_one");
   * // => [
   * //   {
   * //     moveId: "chooseWhoGoesFirstMove",
   * //     displayName: "Choose First Player",
   * //     description: "Select which player goes first",
   * //     paramSchema: { required: [...] }
   * //   }
   * // ]
   * ```
   */
  getAvailableMovesDetailed(playerId: PlayerId): AvailableMoveInfo[] {
    // Get available move IDs
    const moveIds = this.getAvailableMoves(playerId);

    // Enrich each move with detailed metadata
    return moveIds.map((moveId) => this.getMoveInfo(moveId));
  }

  /**
   * Enumerate valid parameters for a specific move
   *
   * Returns all valid parameter combinations for the given move and player.
   * Returns null if the move is not available for the player.
   *
   * @param moveId - Move to enumerate parameters for
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   *
   * @example
   * ```typescript
   * const params = engine.enumerateMoveParameters(
   *   "chooseWhoGoesFirstMove",
   *   "player_one"
   * );
   * // => {
   * //   validCombinations: [
   * //     { playerId: "player_one" },
   * //     { playerId: "player_two" }
   * //   ],
   * //   parameterInfo: {
   * //     playerId: {
   * //       type: "playerId",
   * //       description: "Player who will go first",
   * //       validValues: ["player_one", "player_two"]
   * //     }
   * //   }
   * // }
   * ```
   */
  enumerateMoveParameters(
    moveId: string,
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Switch statement with exhaustive check for each move type
    switch (moveId) {
      case "chooseWhoGoesFirstMove":
        return this.enumerateChooseFirstPlayerParams(playerId);

      case "playCard":
        return this.enumeratePlayCardParams(playerId);

      case "quest":
        return this.enumerateQuestParams(playerId);

      case "challenge":
        return this.enumerateChallengeParams(playerId);

      case "alterHand":
        return this.enumerateAlterHandParams(playerId);

      case "putACardIntoTheInkwell":
        return this.enumerateInkwellParams(playerId);

      default:
        // For moves not yet implemented or parameterless moves, return null
        return null;
    }
  }

  /**
   * Get detailed explanation of why a move cannot be executed
   *
   * Executes move validation and returns structured error information
   * with context and suggestions. Returns null if the move is valid.
   *
   * @param moveId - Move to check
   * @param params - Parameters to use for the move
   * @returns Error information or null if move is valid
   *
   * @example
   * ```typescript
   * const error = engine.whyCannotExecuteMove(
   *   "chooseWhoGoesFirstMove",
   *   { playerId: "player_one", params: { playerId: "invalid" } }
   * );
   * // => {
   * //   moveId: "chooseWhoGoesFirstMove",
   * //   errorCode: "INVALID_PLAYER_ID",
   * //   reason: "Invalid player ID: invalid",
   * //   context: { playerId: "invalid", validPlayers: [...] },
   * //   suggestions: ["Choose a valid player ID"]
   * // }
   * ```
   */
  whyCannotExecuteMove(
    moveId: string,
    params: any,
  ): MoveValidationError | null {
    // Attempt to execute the move to get detailed error information
    const result = this.executeMove(moveId, params);

    // If move succeeded, no error
    if (result.success) {
      return null;
    }

    // Parse error result and generate helpful error object
    return {
      moveId,
      errorCode: result.errorCode || "UNKNOWN_ERROR",
      reason: result.error || "Move cannot be executed",
      context: result.errorContext,
      suggestions: this.generateSuggestions(
        moveId,
        result.errorCode,
        result.errorContext,
      ),
    };
  }

  /**
   * Generate helpful suggestions based on error context
   *
   * @param moveId - Move that failed
   * @param errorCode - Error code from move execution
   * @param errorContext - Additional error context
   * @returns Array of helpful suggestions
   * @private
   */
  private generateSuggestions(
    moveId: string,
    errorCode?: string,
    errorContext?: Record<string, any>,
  ): string[] {
    const suggestions: string[] = [];

    switch (errorCode) {
      case "NOT_CHOOSING_PLAYER":
        if (errorContext?.choosingPlayer) {
          suggestions.push(
            `Wait for ${errorContext.choosingPlayer} to choose the first player`,
          );
        }
        break;

      case "INVALID_PLAYER_ID":
        if (errorContext?.validPlayers) {
          suggestions.push(
            `Choose one of the valid players: ${errorContext.validPlayers.join(", ")}`,
          );
        }
        break;

      case "WRONG_PHASE":
        if (errorContext?.requiredPhase) {
          suggestions.push(
            `Wait until ${errorContext.requiredPhase} phase to use this move`,
          );
        }
        break;

      case "FIRST_PLAYER_ALREADY_CHOSEN":
        suggestions.push("The first player has already been selected");
        break;

      case "INSUFFICIENT_INK":
        if (
          errorContext?.required !== undefined &&
          errorContext?.available !== undefined
        ) {
          const needed = errorContext.required - errorContext.available;
          suggestions.push(`Add ${needed} more cards to your inkwell`);
        }
        break;

      case "NOT_YOUR_TURN":
        suggestions.push("Wait for your turn");
        break;

      case "CONDITION_FAILED":
        suggestions.push(
          `The conditions for ${moveId} are not met at this time`,
        );
        break;

      default:
        // Generic suggestion if no specific one available
        if (errorCode) {
          suggestions.push(`Check the requirements for ${moveId}`);
        }
        break;
    }

    return suggestions;
  }

  // ========== Private Helper Methods ==========

  /**
   * Get detailed information about a specific move
   *
   * @param moveId - Move to get information for
   * @returns Move information with metadata
   * @private
   */
  private getMoveInfo(moveId: string): AvailableMoveInfo {
    // Move metadata mapping
    // This provides display names, descriptions, and parameter schemas for moves
    switch (moveId) {
      case "chooseWhoGoesFirstMove":
        return {
          moveId,
          displayName: "Choose First Player",
          description: "Select which player will take the first turn",
          icon: "dice",
          paramSchema: {
            required: [
              {
                name: "playerId",
                type: "playerId",
                description: "Player to go first",
              },
            ],
          },
        };

      case "alterHand":
        return {
          moveId,
          displayName: "Mulligan",
          description:
            "Choose cards to put on bottom of deck and draw new ones",
          icon: "hand",
          paramSchema: {
            required: [
              {
                name: "playerId",
                type: "playerId",
                description: "Player mulliganing",
              },
              {
                name: "cardsToMulligan",
                type: "object",
                description: "Cards to put on bottom of deck",
              },
            ],
          },
        };

      case "passTurn":
        return {
          moveId,
          displayName: "Pass Turn",
          description: "End your turn and pass priority to the next player",
          icon: "forward",
        };

      // Default fallback for moves without explicit metadata
      default:
        return {
          moveId,
          displayName: moveId
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim(),
          description: `Execute ${moveId} move`,
        };
    }
  }

  /**
   * Enumerate parameters for chooseWhoGoesFirstMove
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateChooseFirstPlayerParams(
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Check if move is available for this player
    const availableMoves = this.getAvailableMoves(playerId);
    if (!availableMoves.includes("chooseWhoGoesFirstMove")) {
      return null;
    }

    // Get all valid player IDs from game state
    const state = this.getState();
    const validPlayers = Object.keys(state.loreScores) as PlayerId[];

    // Return all valid player choices
    return {
      validCombinations: validPlayers.map((p) => ({ playerId: p })),
      parameterInfo: {
        playerId: {
          type: "playerId",
          description: "Player who will go first",
          validValues: validPlayers,
        },
      },
    };
  }

  /**
   * Enumerate parameters for playCard
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumeratePlayCardParams(
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Check if move is available
    const availableMoves = this.getAvailableMoves(playerId);
    if (!availableMoves.includes("playCard")) {
      return null;
    }

    // Get cards in hand
    const handZone = this.zones.getZone({ zoneId: "hand" as any, playerId });
    const cardsInHand = handZone?.cards || [];

    // For now, return all cards in hand
    // TODO: Filter by ink cost when card registry is available
    return {
      validCombinations: cardsInHand.map((cardId) => ({ cardId })),
      parameterInfo: {
        cardId: {
          type: "cardId",
          description: "Card to play from hand",
          validValues: cardsInHand,
        },
      },
    };
  }

  /**
   * Enumerate parameters for quest
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateQuestParams(
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Check if move is available
    const availableMoves = this.getAvailableMoves(playerId);
    if (!availableMoves.includes("quest")) {
      return null;
    }

    // Get characters in play
    const playZone = this.zones.getZone({ zoneId: "play" as any, playerId });
    const cardsInPlay = playZone?.cards || [];

    // TODO: Filter by ready status and character type when card metadata is available
    // For now, return all cards in play
    return {
      validCombinations: cardsInPlay.map((cardId) => ({ cardId })),
      parameterInfo: {
        cardId: {
          type: "cardId",
          description: "Character to quest with",
          validValues: cardsInPlay,
        },
      },
    };
  }

  /**
   * Enumerate parameters for challenge
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateChallengeParams(
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Check if move is available
    const availableMoves = this.getAvailableMoves(playerId);
    if (!availableMoves.includes("challenge")) {
      return null;
    }

    // Get player's characters (potential attackers)
    const playZone = this.zones.getZone({ zoneId: "play" as any, playerId });
    const attackers = playZone?.cards || [];

    // Get opponent's characters (potential defenders)
    const state = this.getState();
    const allPlayers = Object.keys(state.loreScores) as PlayerId[];
    const opponents = allPlayers.filter((p) => p !== playerId);

    const defenders: string[] = [];
    for (const opponent of opponents) {
      const opponentPlayZone = this.zones.getZone({
        zoneId: "play" as any,
        playerId: opponent,
      });
      defenders.push(...(opponentPlayZone?.cards || []));
    }

    // Generate all valid attacker-defender pairs
    const validCombinations: Array<{ attackerId: string; defenderId: string }> =
      [];
    for (const attackerId of attackers) {
      for (const defenderId of defenders) {
        validCombinations.push({ attackerId, defenderId });
      }
    }

    return {
      validCombinations,
      parameterInfo: {
        attackerId: {
          type: "cardId",
          description: "Attacking character",
          validValues: attackers,
        },
        defenderId: {
          type: "cardId",
          description: "Defending character or location",
          validValues: defenders,
        },
      },
    };
  }

  /**
   * Enumerate parameters for alterHand (mulligan)
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateAlterHandParams(
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Check if move is available
    const availableMoves = this.getAvailableMoves(playerId);
    if (!availableMoves.includes("alterHand")) {
      return null;
    }

    // Get cards in hand
    const handZone = this.zones.getZone({ zoneId: "hand" as any, playerId });
    const cardsInHand = handZone?.cards || [];

    // For mulligan, we want to return key options rather than full power set
    // Include: keep all (empty array), mulligan all, and individual cards
    const validCombinations: Array<{
      playerId: PlayerId;
      cardsToMulligan: string[];
    }> = [
      // Option 1: Keep all cards
      { playerId, cardsToMulligan: [] },
      // Option 2: Mulligan all cards
      { playerId, cardsToMulligan: [...cardsInHand] },
      // Options 3+: Mulligan individual cards
      ...cardsInHand.map((cardId) => ({
        playerId,
        cardsToMulligan: [cardId],
      })),
    ];

    return {
      validCombinations,
      parameterInfo: {
        playerId: {
          type: "playerId",
          description: "Player mulliganing",
          validValues: [playerId],
        },
        cardsToMulligan: {
          type: "object",
          description: "Array of card IDs to mulligan",
          validValues: cardsInHand,
        },
      },
    };
  }

  /**
   * Enumerate parameters for putACardIntoTheInkwell
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateInkwellParams(
    playerId: PlayerId,
  ): MoveParameterOptions | null {
    // Check if move is available
    const availableMoves = this.getAvailableMoves(playerId);
    if (!availableMoves.includes("putACardIntoTheInkwell")) {
      return null;
    }

    // Get cards in hand
    const handZone = this.zones.getZone({ zoneId: "hand" as any, playerId });
    const cardsInHand = handZone?.cards || [];

    // TODO: Filter by inkable property when card registry is available
    // For now, return all cards in hand
    return {
      validCombinations: cardsInHand.map((cardId) => ({ cardId })),
      parameterInfo: {
        cardId: {
          type: "cardId",
          description: "Card to put into inkwell",
          validValues: cardsInHand,
        },
      },
    };
  }
}
