import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import type { AnyConsolidatedError } from "~/game-engine/core-engine/errors/consolidated-errors";
import {
  type AnyEngineError,
  createEngineError,
  InvalidMoveError,
  UnknownMoveError,
} from "~/game-engine/core-engine/errors/engine-errors";
import type { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
import type {
  CoreEngineState,
  FnContext,
} from "~/game-engine/core-engine/game-configuration";
import {
  type InvalidMoveResult,
  isInvalidMove,
  type Move,
} from "~/game-engine/core-engine/move/move-types";
import type { Result } from "~/game-engine/core-engine/types/result";
import { Result as ResultHelpers } from "~/game-engine/core-engine/types/result";

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
  readonly moveFunction: Move<G>; // Properly typed move function
  readonly fnContext: FnContext<G>;
};

export type MoveResult<G> = {
  readonly newState: CoreEngineState<G>;
};

/**
 * Pure move validation service
 * Validates player permissions and move availability
 */
export class MoveValidator<G> {
  constructor() {}

  validate(
    request: MoveRequest,
    fnContext: FnContext<G>,
    flowManager: FlowManager<G>,
  ): Result<ValidatedMove<G>, AnyEngineError> {
    const moveFunction = flowManager.getMove(
      fnContext.ctx,
      request.moveType,
      request.playerID,
    );

    if (!moveFunction) {
      return ResultHelpers.error(
        new UnknownMoveError(request.moveType, flowManager.moveNames),
      );
    }

    return ResultHelpers.ok({
      playerID: request.playerID,
      moveType: request.moveType,
      args: request.args,
      moveFunction,
      fnContext,
    });
  }
}

/**
 * Pure move execution service
 * Executes validated moves and creates new game state
 */
export class MoveExecutor<G> {
  private readonly engine: CoreEngine;

  constructor(private readonly debug: boolean = false) {}

  execute(
    validatedMove: ValidatedMove<G>,
    fnContext: FnContext<G>,
  ): Result<MoveResult<G>, AnyEngineError | AnyConsolidatedError> {
    try {
      const actualMoveFunction = this.extractMoveFunction(
        validatedMove.moveFunction,
      );

      const newG = actualMoveFunction(
        fnContext,
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

      const newState = fnContext._getUpdatedState();

      return ResultHelpers.ok({
        newState,
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

  // Extract the actual function from Move type (could be function or object with move property)
  private extractMoveFunction(
    moveFunction: Move<G>,
  ): (
    context: FnContext<G>,
    ...args: unknown[]
  ) => G | undefined | InvalidMoveResult {
    // Handle function moves directly
    if (typeof moveFunction === "function") {
      return moveFunction as (
        context: FnContext<G>,
        ...args: unknown[]
      ) => G | undefined | InvalidMoveResult;
    }

    // Handle object-based moves
    if (typeof moveFunction === "object" && moveFunction !== null) {
      // Check for EnumerableMove (has execute property)
      if (
        "execute" in moveFunction &&
        typeof moveFunction.execute === "function"
      ) {
        return moveFunction.execute as unknown as (
          context: FnContext<G>,
          ...args: unknown[]
        ) => G | undefined | InvalidMoveResult;
      }

      // Check for LongFormMove (has move property)
      if ("move" in moveFunction && typeof moveFunction.move === "function") {
        return moveFunction.move as (
          context: FnContext<G>,
          ...args: unknown[]
        ) => G | undefined | InvalidMoveResult;
      }
    }

    // Fallback - treat as function
    return moveFunction as unknown as (
      context: FnContext<G>,
      ...args: unknown[]
    ) => G | undefined | InvalidMoveResult;
  }
}

/**
 * Main move processor service
 * Orchestrates move validation and execution
 */
export class MoveProcessor<G> {
  private readonly validator: MoveValidator<G>;
  private readonly executor: MoveExecutor<G>;

  constructor(debug = false) {
    this.validator = new MoveValidator();
    this.executor = new MoveExecutor(debug);
  }

  process(
    request: MoveRequest,
    flowManager: FlowManager<G>,
    fnContext: FnContext<G>,
  ): Result<MoveResult<G>, AnyEngineError | AnyConsolidatedError> {
    const validationResult = this.validator.validate(
      request,
      fnContext,
      flowManager,
    );
    if (ResultHelpers.isError(validationResult)) {
      return ResultHelpers.error(validationResult.error);
    }

    return this.executor.execute(validationResult.data, fnContext);
  }
}
