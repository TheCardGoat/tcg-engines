import { logger } from "../../../shared/logger";
import { LogLevel } from "../../types/log-types";
import type { LogCollector } from "../../utils/log-collector";
import type { CoreCardInstance } from "../card/core-card-instance";
import type { CoreEngineState, PlayerID } from "../game-configuration";
import type { CoreCtx } from "../state/context";
import type { GameSpecificCardFilter } from "../types/game-specific-types";
import {
  type EnumerableMove,
  GameMoveConstraint,
  isEnumerableMove,
  type Move,
  type MoveConstraintFailure,
  type TargetSpec,
} from "./move-types";

/**
 * FlowManager interface for the enumeration service to use
 */
export interface MoveProvider<G = unknown> {
  // Gets all moves for the current context
  getAllMovesForCurrentContext(
    state: CoreEngineState<G>,
  ): Record<string, Move> | null;

  // Gets a specific move
  getMove(ctx: CoreCtx, moveName: string, playerID: string): Move | null;

  // Checks if a player can act in the current state
  canPlayerAct(state: CoreEngineState<G>, playerID: string): boolean;
}

/**
 * Information about an available move
 */
export interface AvailableMove {
  readonly name: string;
  readonly isAvailable: boolean;
  readonly unavailableReason?: MoveConstraintFailure;
  readonly requiredTargetTypes: string[];
  readonly priority: number;
  // Phase 3: Add support for move categories to better organize moves in UI
  readonly category?: string;
  // Phase 3: Add detailed description for moves to improve user experience
  readonly description?: string;
}

/**
 * Information about a target for a move parameter
 */
export interface MoveTarget {
  readonly specId: string;
  readonly parameterIndex: number;
  readonly required: boolean;
  readonly targetType: string;
  readonly description: string;
  readonly messageKey: string;
  readonly validTargets: Array<string | PlayerID | Record<string, unknown>>;
  // Phase 3: Add support for target exclusivity (can't select the same target for different parameters)
  readonly exclusivityGroup?: string;
  // Phase 3: Add support for target rendering hints (e.g., highlight targets differently)
  readonly renderHint?: string;
}

/**
 * Container for all potential targets for a move
 */
export interface MoveTargets {
  readonly targets: MoveTarget[];
  readonly errors?: MoveConstraintFailure[];
  // Phase 3: Add support for dependent targets (targets that depend on other targets)
  readonly dependentTargets?: Record<string, string[]>;
}

/**
 * Service to enumerate available moves and potential targets
 * Based on the current game state and player
 */
export class MoveEnumerationService<G = unknown> {
  constructor(
    private readonly moveProvider: MoveProvider<G>,
    private readonly logCollector: LogCollector,
  ) {}

  /**
   * Get all available moves for a player in the current state
   * @param state The current game state
   * @param playerID The player to check moves for
   * @returns Array of available move information
   */
  getAvailableMoves(
    state: CoreEngineState<G>,
    playerID: string,
  ): AvailableMove[] {
    const allMoves = this.moveProvider.getAllMovesForCurrentContext(state);
    if (!allMoves) return [];

    const results: AvailableMove[] = [];

    // Check each move
    Object.entries(allMoves).forEach(([name, move]) => {
      let isAvailable = true;
      let unavailableReason: MoveConstraintFailure | undefined;
      let requiredTargetTypes: string[] = [];
      let priority = 0;
      // Phase 3: Extract additional move metadata
      let category: string | undefined;
      let description: string | undefined;

      try {
        // Skip if player cannot act in current state
        if (!this.moveProvider.canPlayerAct(state, playerID)) {
          isAvailable = false;
          unavailableReason = {
            constraintId: "cannot-act",
            reason: "Player cannot act in current state",
            messageKey: "moves.errors.cannotAct",
            context: {
              playerId: playerID,
              phase: state.ctx.currentPhase,
              step: state.ctx.currentStep,
            },
          };
        } else if (isEnumerableMove(move)) {
          // Get and check constraints from the move
          const context = this.createMoveContext(state, playerID, move);
          const constraints = move.getConstraints?.(context) || [];

          // Check each constraint
          for (const constraint of constraints) {
            if (!constraint.check(context)) {
              isAvailable = false;
              unavailableReason = {
                constraintId: constraint.id,
                reason: constraint.failureReason,
                messageKey: constraint.messageKey,
                context: constraint.context,
              };
              break;
            }
          }

          // Get required target types if move is available
          if (isAvailable && move.getTargetSpecs) {
            const targetSpecs = move.getTargetSpecs(context);
            requiredTargetTypes = targetSpecs
              .filter((spec) => spec.required)
              .map((spec) => spec.targetType);
          }

          // Get move priority
          if (move.getPriority) {
            priority = move.getPriority(context);
          }

          // Phase 3: Extract additional metadata from move (if available)
          if (move.metadata) {
            category = move.metadata.category;
            description = move.metadata.description;
          }
        }
      } catch (error) {
        this.logCollector.log(
          LogLevel.DEVELOPER,
          `Error checking move availability for ${name}: ${error}`,
        );
        isAvailable = false;
        unavailableReason = {
          constraintId: "error-checking",
          reason: `Error checking move availability: ${error}`,
          messageKey: "moves.errors.availabilityCheckFailed",
          context: { error: String(error), moveName: name },
        };
      }

      results.push({
        name,
        isAvailable,
        unavailableReason,
        requiredTargetTypes,
        priority,
        category,
        description,
      });
    });

    // Sort moves by priority (higher first)
    return results.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get potential targets for a specific move
   * @param state The current game state
   * @param playerID The player making the move
   * @param moveName The name of the move
   * @param args Existing arguments (to resolve dependent targets)
   * @returns Object containing target information
   */
  getPotentialTargets(
    state: CoreEngineState<G>,
    playerID: string,
    moveName: string,
    ...args: unknown[]
  ): MoveTargets {
    const move = this.moveProvider.getMove(state.ctx, moveName, playerID);
    if (!move) {
      return {
        targets: [],
        errors: [
          {
            constraintId: "move-not-found",
            reason: `Move ${moveName} not found`,
            messageKey: "moves.errors.moveNotFound",
            context: { moveName },
          },
        ],
      };
    }

    // Only enumerable moves support target specs
    if (!(isEnumerableMove(move) && move.getTargetSpecs)) {
      return {
        targets: [],
        errors: [
          {
            constraintId: "no-target-specs",
            reason: `Move ${moveName} does not support target enumeration`,
            messageKey: "moves.errors.noTargetSpecs",
            context: { moveName },
          },
        ],
      };
    }

    try {
      const context = this.createMoveContext(state, playerID, move);
      const targetSpecs = move.getTargetSpecs(context, ...args);

      const targets = targetSpecs.map((spec) =>
        this.resolveTargetSpec(spec, context, state),
      );

      // Phase 3: Extract target dependencies if specified
      const dependentTargets: Record<string, string[]> = {};
      targetSpecs.forEach((spec, index) => {
        if (spec.dependsOn && spec.dependsOn.length > 0) {
          dependentTargets[spec.id] = [...spec.dependsOn];
        }
      });

      return {
        targets,
        // Phase 3: Include dependent targets information in response
        ...(Object.keys(dependentTargets).length > 0
          ? { dependentTargets }
          : {}),
      };
    } catch (error) {
      this.logCollector.log(
        LogLevel.DEVELOPER,
        `Error getting targets for move ${moveName}: ${error}`,
      );
      return {
        targets: [],
        errors: [
          {
            constraintId: "target-resolution-error",
            reason: `Error resolving targets: ${error}`,
            messageKey: "moves.errors.targetResolutionFailed",
            context: { error: String(error), moveName },
          },
        ],
      };
    }
  }

  /**
   * Create the context object for move evaluation
   */
  private createMoveContext(
    state: CoreEngineState<G>,
    playerID: string,
    move: EnumerableMove,
  ): any {
    // This is a simplified version - in real implementation, we'd
    // need to create the full context with coreOps, gameOps, etc.
    // For the enumeration service, we don't need the full context
    return {
      G: state.G,
      ctx: state.ctx,
      playerID,
    };
  }

  /**
   * Resolve a target specification to find valid targets
   */
  private resolveTargetSpec(
    spec: TargetSpec<any, any>,
    context: any,
    state: CoreEngineState<G>,
  ): MoveTarget {
    let validTargets: Array<string | PlayerID | Record<string, unknown>> = [];

    switch (spec.targetType) {
      case "card":
        validTargets = this.resolveCardTargets(spec, context, state);
        break;
      case "player":
        validTargets = this.resolvePlayerTargets(spec, context, state);
        break;
      case "zone":
        validTargets = this.resolveZoneTargets(spec, context, state);
        break;
      case "choice":
        // Convert readonly array to mutable array
        validTargets = spec.choices ? [...spec.choices] : [];
        break;
      default:
        validTargets = [];
    }

    return {
      specId: spec.id,
      parameterIndex: spec.parameterIndex,
      required: spec.required,
      targetType: spec.targetType,
      description: spec.description,
      messageKey: spec.messageKey,
      validTargets,
      // Phase 3: Include exclusivity group if specified
      ...(spec.exclusivityGroup
        ? { exclusivityGroup: spec.exclusivityGroup }
        : {}),
      // Phase 3: Include render hint if specified
      ...(spec.renderHint ? { renderHint: spec.renderHint } : {}),
    };
  }

  /**
   * Resolve card targets using the card filter
   */
  private resolveCardTargets(
    spec: TargetSpec<any, any>,
    context: any,
    state: CoreEngineState<G>,
  ): string[] {
    // Phase 3: Implement enhanced card filtering
    // This is a simplified implementation
    // In a real implementation, we would:
    // 1. Use the card filter to find all cards matching the criteria
    // 2. Apply any additional filters from the spec
    // 3. Return the list of card instance IDs

    // For Phase 3, we're returning a placeholder
    return [];
  }

  /**
   * Resolve player targets
   */
  private resolvePlayerTargets(
    spec: TargetSpec<any, any>,
    context: any,
    state: CoreEngineState<G>,
  ): string[] {
    const players = state.ctx.playerOrder;

    // Phase 3: Apply more sophisticated player filtering
    if (spec.filter) {
      return players.filter((playerId) => {
        try {
          // Apply the filter function to each player ID
          return spec.filter!({ ...context, targetPlayerId: playerId });
        } catch (error) {
          this.logCollector.log(
            LogLevel.DEVELOPER,
            `Error filtering player target ${playerId}: ${error}`,
          );
          return false;
        }
      });
    }

    return players;
  }

  /**
   * Resolve zone targets
   */
  private resolveZoneTargets(
    spec: TargetSpec<any, any>,
    context: any,
    state: CoreEngineState<G>,
  ): string[] {
    // Phase 3: Implement enhanced zone filtering
    // This is a simplified implementation
    // In a real implementation, we would:
    // 1. Get all zones from the state
    // 2. Filter zones based on spec criteria
    // 3. Return the list of zone IDs

    // For Phase 3, we're returning a placeholder
    return [];
  }
}
