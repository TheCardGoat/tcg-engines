import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import {
  type AnyEngineError,
  createEngineError,
  InvalidMoveError,
  InvalidPlayerError,
  UnknownMoveError,
} from "~/game-engine/core-engine/errors/engine-errors";
import type {
  CoreEngineState,
  GameRuntime,
} from "~/game-engine/core-engine/game-configuration";
import type { LongFormMove } from "~/game-engine/core-engine/move/move-types";
import {
  type InvalidMoveResult,
  isInvalidMove,
} from "~/game-engine/core-engine/move/move-types";
import type { Result } from "~/game-engine/core-engine/types/result";
import { Result as ResultHelpers } from "~/game-engine/core-engine/types/result";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaEngine } from "~/game-engine/engines/lorcana/src/lorcana-engine";

// Types for move processing
export type MoveRequest = {
  readonly playerID: string;
  readonly moveType: string;
  readonly args: readonly unknown[];
};

export type ValidatedMove<G> = {
  readonly playerID: string;
  readonly moveType: string;
  readonly args: readonly unknown[];
  readonly moveFunction: any; // Can be regular function or LongFormMove
  readonly state: CoreEngineState<G>;
};

export type MoveResult<G> = {
  readonly newState: CoreEngineState<G>;
  readonly stateChanged: boolean;
};

/**
 * Pure move validation service
 * Validates player permissions and move availability
 */
export class MoveValidator<G> {
  constructor(
    private readonly game: GameRuntime<G>,
    private readonly canPlayerMove: (playerID: string) => boolean,
  ) {}

  validate(
    request: MoveRequest,
    currentState: CoreEngineState<G>,
  ): Result<ValidatedMove<G>, AnyEngineError> {
    // Validate player can make moves
    if (!this.canPlayerMove(request.playerID)) {
      const reason = "Player does not have priority to make moves";
      return ResultHelpers.error(
        new InvalidPlayerError(request.playerID, reason),
      );
    }

    // Find the move function using the flow system
    const moveFunction = this.game.flow.getMove(
      currentState.ctx,
      request.moveType,
      request.playerID,
    );

    if (!moveFunction) {
      return ResultHelpers.error(
        new UnknownMoveError(request.moveType, this.game.flow.moveNames),
      );
    }

    return ResultHelpers.ok({
      playerID: request.playerID,
      moveType: request.moveType,
      args: request.args,
      moveFunction,
      state: currentState,
    });
  }
}

/**
 * Pure move execution service
 * Executes validated moves and creates new game state
 */
export class MoveExecutor<G> {
  private readonly engine: CoreEngine<any, any, any, any, any>;

  constructor(
    engine: CoreEngine<any, any, any, any, any>,
    private readonly debug: boolean = false,
  ) {
    this.engine = engine;
  }

  execute(
    validatedMove: ValidatedMove<G>,
  ): Result<MoveResult<G>, AnyEngineError> {
    try {
      // Handle both regular moves and long-form moves
      const actualMoveFunction = this.extractMoveFunction(
        validatedMove.moveFunction,
      );

      // Use standard CoreOperation
      const coreOperation = new CoreOperation({
        state: validatedMove.state,
        engine: this.engine,
      });

      const newG = actualMoveFunction(
        {
          G: validatedMove.state.G,
          ctx: validatedMove.state.ctx,
          coreOps: coreOperation,
          gameOps: this.engine,
          playerID: validatedMove.playerID,
        },
        // TODO: THIS IS REALLY BAD, We should implement in a type-safe way
        ...validatedMove.args,
      );

      // Handle both old INVALID_MOVE string and new InvalidMoveResult structure
      if (newG === "INVALID_MOVE") {
        return ResultHelpers.error(
          new InvalidMoveError(
            validatedMove.moveType,
            validatedMove.playerID,
            "Move function returned INVALID_MOVE",
          ),
        );
      }

      // Handle new structured invalid move result
      if (isInvalidMove(newG)) {
        const invalidResult = newG as InvalidMoveResult;
        return ResultHelpers.error(
          new InvalidMoveError(
            validatedMove.moveType,
            validatedMove.playerID,
            `${invalidResult.reason}: ${invalidResult.messageKey}`,
          ),
        );
      }

      if (this.debug && debuggers.stateTransitions) {
        logger.debug(
          `Move ${validatedMove.moveType} executed successfully, updating state`,
        );
        logger.debug("Old state G:", validatedMove.state.G);
        logger.debug("New state G:", newG);
      }

      const newState: CoreEngineState<G> = {
        ...validatedMove.state,
        G: newG,
        // This will override any context mutations made by the move
        ctx: coreOperation.state.ctx,
        _stateID: validatedMove.state._stateID + 1,
      };

      return ResultHelpers.ok({
        newState,
        stateChanged: true,
      });
    } catch (error) {
      const engineError = createEngineError(error, {
        operation: "executeMove",
        playerID: validatedMove.playerID,
        moveType: validatedMove.moveType,
      });
      return ResultHelpers.error(engineError);
    }
  }

  // TODO: We should properly type this
  private extractMoveFunction(
    moveFunction: any,
  ): (context: any, ...args: unknown[]) => any {
    return moveFunction as (context: any, ...args: unknown[]) => any;
  }
}

/**
 * Main move processor service
 * Orchestrates move validation and execution
 */
export class MoveProcessor<G> {
  private readonly validator: MoveValidator<G>;
  private readonly executor: MoveExecutor<G>;
  private readonly engine: CoreEngine<any, any, any, any, any>;

  constructor(
    game: GameRuntime<G>,
    canPlayerMove: (playerID: string) => boolean,
    debug = false,
    engine: CoreEngine<any, any, any, any, any>,
  ) {
    this.validator = new MoveValidator(game, canPlayerMove);
    this.executor = new MoveExecutor(engine, debug);
    this.engine = engine;
  }

  process(
    request: MoveRequest,
    currentState: CoreEngineState<G>,
  ): Result<MoveResult<G>, AnyEngineError> {
    // Step 1: Validate the move request
    const validationResult = this.validator.validate(request, currentState);
    if (validationResult.success) {
      const validatedMove = validationResult.data;

      // Step 2: Execute the validated move
      const executionResult = this.executor.execute(validatedMove);
      if (executionResult.success) {
        return ResultHelpers.ok(executionResult.data);
      }

      return {
        success: false,
        error: (executionResult as { success: false; error: AnyEngineError })
          .error,
      };
    }

    return {
      success: false,
      error: (validationResult as { success: false; error: AnyEngineError })
        .error,
    };
  }
}
