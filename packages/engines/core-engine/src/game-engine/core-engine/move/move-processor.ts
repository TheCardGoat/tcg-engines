import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import {
  type AnyEngineError,
  createEngineError,
  InvalidMoveError,
  UnknownMoveError,
} from "~/game-engine/core-engine/errors/engine-errors";
import type { Flow } from "~/game-engine/core-engine/game/flow";
import type {
  CoreEngineState,
  FnContext,
} from "~/game-engine/core-engine/game-configuration";
import {
  type InvalidMoveResult,
  isInvalidMove,
} from "~/game-engine/core-engine/move/move-types";
import type { Result } from "~/game-engine/core-engine/types/result";
import { Result as ResultHelpers } from "~/game-engine/core-engine/types/result";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";

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
  // readonly state: CoreEngineState<G>;
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
    flow: ReturnType<typeof Flow>,
  ): Result<ValidatedMove<G>, AnyEngineError> {
    const moveFunction = flow.getMove(
      fnContext.ctx,
      request.moveType,
      request.playerID,
    );

    if (!moveFunction) {
      return ResultHelpers.error(
        new UnknownMoveError(request.moveType, flow.moveNames),
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
  ): Result<MoveResult<G>, AnyEngineError> {
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

      if (this.debug && debuggers.stateTransitions) {
        logger.debug(
          `Move ${validatedMove.moveType} executed successfully, updating state`,
        );
        logger.debug("Old state G:", validatedMove.fnContext.G);
        logger.debug("New state G:", newG);
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

  constructor(debug = false) {
    this.validator = new MoveValidator();
    this.executor = new MoveExecutor(debug);
  }

  process(
    request: MoveRequest,
    flow: ReturnType<typeof Flow>,
    fnContext: FnContext<G>,
  ): Result<MoveResult<G>, AnyEngineError> {
    const validationResult = this.validator.validate(request, fnContext, flow);
    if (!validationResult.success) {
      // @ts-ignore
      return ResultHelpers.error(validationResult.error);
    }

    return this.executor.execute(validationResult.data, fnContext);
  }
}
