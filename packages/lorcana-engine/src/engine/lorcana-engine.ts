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
    const validMoves: string[] = [];

    // Check each registered move
    for (const moveId of Object.keys(this.gameDefinition.moves)) {
      // Special case: For moves that require parameters to be valid,
      // try to enumerate and check if we have any valid combinations
      if (this.moveRequiresParameters(moveId)) {
        const params = this.enumerateMoveParameters(
          moveId as keyof LorcanaMoveParams,
          playerId,
        );

        if (params !== null && params.validCombinations.length > 0) {
          validMoves.push(moveId);
        }
      } else {
        // For moves that work with empty params or are parameterless,
        // use simple condition check
        const canExecute = this.canExecuteMove(moveId, {
          playerId,
          params: {},
        });

        if (canExecute) {
          validMoves.push(moveId);
        }
      }
    }

    return validMoves;
  }

  /**
   * Check if a move requires parameters to be valid
   *
   * Some moves like chooseWhoGoesFirstMove must have parameters to pass validation.
   * Others like passTurn and concede work with empty parameters.
   *
   * @param moveId - Move ID to check
   * @returns True if move requires parameters
   * @private
   */
  private moveRequiresParameters(moveId: string): boolean {
    // Moves that MUST have parameters to be valid
    const requiresParams = new Set([
      "chooseWhoGoesFirstMove",
      "alterHand", // Has enumerator and requires cardsToMulligan parameter
      // Note: Other moves like playCard, quest, challenge, putACardIntoTheInkwell
      // are NOT in this list because their enumeration returns null (not yet implemented).
      // They will be checked with empty params and conditions will handle validation.
    ]);

    return requiresParams.has(moveId);
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
   * **Implementation Note**: This method uses `executeMove()` internally,
   * which is safe because `@tcg/core`'s RuleEngine uses Immer for immutable
   * state management. Failed move executions are automatically rolled back
   * and do not modify game state.
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
    // Safe: Failed executions are rolled back by Immer (no side effects)
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
    // Get all valid player IDs from game state
    const state = this.getState();
    const validPlayers = Object.keys(state.loreScores) as PlayerId[];

    // For each valid player choice, check if the move can be executed
    const validCombinations: Array<{ playerId: PlayerId }> = [];
    for (const targetPlayerId of validPlayers) {
      const canExecute = this.canExecuteMove("chooseWhoGoesFirstMove", {
        playerId,
        params: { playerId: targetPlayerId },
      });

      if (canExecute) {
        validCombinations.push({ playerId: targetPlayerId });
      }
    }

    // If no valid combinations, move is not available
    if (validCombinations.length === 0) {
      return null;
    }

    // Return valid player choices
    return {
      validCombinations,
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
    _playerId: PlayerId,
  ): MoveParameterOptions | null {
    // TODO: Implement full enumeration with access to internal zone state
    // Current limitation: Cannot access RuleEngine's internal zone state directly
    //
    // Full implementation requires:
    // 1. Access to hand zone cards (currently via internal state)
    // 2. Card registry access for ink cost filtering
    // 3. Available ink calculation from game state
    //
    // Temporary workaround: Return null to indicate no enumeration available
    // This moves parameter validation to execution time via whyCannotExecuteMove()
    return null;
  }

  /**
   * Enumerate parameters for quest
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateQuestParams(
    _playerId: PlayerId,
  ): MoveParameterOptions | null {
    // TODO: Implement full enumeration with access to internal zone and card state
    // Current limitation: Cannot access RuleEngine's internal zone state directly
    //
    // Full implementation requires:
    // 1. Access to play zone cards
    // 2. Card metadata access for ready status (not exerted, not drying)
    // 3. Card type filtering (only characters can quest)
    // 4. Lore value calculation (from card registry)
    //
    // Temporary workaround: Return null to indicate no enumeration available
    // This moves parameter validation to execution time via whyCannotExecuteMove()
    return null;
  }

  /**
   * Enumerate parameters for challenge
   *
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null if move not available
   * @private
   */
  private enumerateChallengeParams(
    _playerId: PlayerId,
  ): MoveParameterOptions | null {
    // TODO: Implement full enumeration with access to internal zone and card state
    // Current limitation: Cannot access RuleEngine's internal zone state directly
    //
    // Full implementation requires:
    // 1. Access to play zone cards for both player and opponents
    // 2. Card metadata for ready status and character type
    // 3. Valid attacker-defender pair generation (N x M combinations)
    // 4. Evasive and Bodyguard ability filtering
    //
    // Temporary workaround: Return null to indicate no enumeration available
    // This moves parameter validation to execution time via whyCannotExecuteMove()
    return null;
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
    // Check if move is available (validates phase, pending mulligan status, etc.)
    const canExecute = this.canExecuteMove("alterHand", {
      playerId,
      params: { playerId, cardsToMulligan: [] }, // Empty array = keep all cards
    });

    if (!canExecute) {
      return null;
    }

    // Get cards in hand to enumerate mulligan options
    // Access internal state to get hand cards (testing backdoor similar to LorcanaTestEngine)
    const internalState = (this as any).internalState;
    if (!internalState) {
      // Fallback to simple keep-all option if we can't access internal state
      return {
        validCombinations: [
          {
            playerId,
            cardsToMulligan: [],
          },
        ],
        parameterInfo: {},
      };
    }

    const handCards =
      internalState.zones?.hand?.cardIds.filter((cardId: string) => {
        const card = internalState.cards?.[cardId];
        return card && String(card.ownerId) === String(playerId);
      }) || [];

    // Generate combinations: keep all (empty array) and mulligan all (all cards)
    // For efficiency, we only generate these two extreme options
    // Full power-set enumeration (2^n combinations) would be too expensive for large hands
    const validCombinations = [
      {
        playerId,
        cardsToMulligan: [], // Keep all cards
      },
      {
        playerId,
        cardsToMulligan: handCards, // Mulligan all cards
      },
    ];

    return {
      validCombinations,
      parameterInfo: {
        cardsToMulligan: {
          type: "cardId[]",
          description: "Cards to mulligan (put on bottom of deck)",
          validValues: handCards,
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
    _playerId: PlayerId,
  ): MoveParameterOptions | null {
    // TODO: Implement full enumeration with access to internal zone state
    // Current limitation: Cannot access RuleEngine's internal zone state directly
    //
    // Full implementation requires:
    // 1. Access to hand zone cards
    // 2. Check if player has already inked this turn (turnMetadata)
    // 3. Optional: Card registry access to prefer inkable cards
    //
    // Temporary workaround: Return null to indicate no enumeration available
    // This moves parameter validation to execution time via whyCannotExecuteMove()
    return null;
  }
}
