import { createEngineError, InvalidMoveError, UnknownMoveError, } from "~/game-engine/core-engine/errors/engine-errors";
import { isInvalidMove, } from "~/game-engine/core-engine/move/move-types";
import { Result as ResultHelpers } from "~/game-engine/core-engine/types/result";
/**
 * Pure move validation service
 * Validates player permissions and move availability
 */
export class MoveValidator {
    constructor() { }
    validate(request, fnContext, flowManager) {
        const moveFunction = flowManager.getMove(fnContext.ctx, request.moveType, request.playerID);
        if (!moveFunction) {
            return ResultHelpers.error(new UnknownMoveError(request.moveType, flowManager.moveNames));
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
export class MoveExecutor {
    debug;
    engine;
    constructor(debug = false) {
        this.debug = debug;
    }
    execute(validatedMove, fnContext) {
        try {
            const actualMoveFunction = this.extractMoveFunction(validatedMove.moveFunction);
            const newG = actualMoveFunction(fnContext, 
            // TODO: THIS IS REALLY BAD, We should implement in a type-safe way
            ...validatedMove.args);
            // Handle both old INVALID_MOVE string and new InvalidMoveResult structure
            if (newG === "INVALID_MOVE") {
                return ResultHelpers.error(new InvalidMoveError(validatedMove.moveType, validatedMove.playerID, "Move function returned INVALID_MOVE"));
            }
            // Handle new structured invalid move result
            if (isInvalidMove(newG)) {
                const invalidResult = newG;
                return ResultHelpers.error(new InvalidMoveError(validatedMove.moveType, validatedMove.playerID, `${invalidResult.reason}: ${invalidResult.messageKey}`));
            }
            const newState = fnContext._getUpdatedState();
            return ResultHelpers.ok({
                newState,
            });
        }
        catch (error) {
            const engineError = createEngineError(error, {
                operation: "executeMove",
                playerID: validatedMove.playerID,
                moveType: validatedMove.moveType,
            });
            return ResultHelpers.error(engineError);
        }
    }
    // Extract the actual function from Move type (could be function or object with move property)
    extractMoveFunction(moveFunction) {
        // Handle function moves directly
        if (typeof moveFunction === "function") {
            return moveFunction;
        }
        // Handle object-based moves
        if (typeof moveFunction === "object" && moveFunction !== null) {
            // Check for EnumerableMove (has execute property)
            if ("execute" in moveFunction &&
                typeof moveFunction.execute === "function") {
                return moveFunction.execute;
            }
            // Check for LongFormMove (has move property)
            if ("move" in moveFunction && typeof moveFunction.move === "function") {
                return moveFunction.move;
            }
        }
        // Fallback - treat as function
        return moveFunction;
    }
}
/**
 * Main move processor service
 * Orchestrates move validation and execution
 */
export class MoveProcessor {
    validator;
    executor;
    constructor(debug = false) {
        this.validator = new MoveValidator();
        this.executor = new MoveExecutor(debug);
    }
    process(request, flowManager, fnContext) {
        const validationResult = this.validator.validate(request, fnContext, flowManager);
        if (!validationResult.success) {
            // @ts-ignore
            return ResultHelpers.error(validationResult.error);
        }
        return this.executor.execute(validationResult.data, fnContext);
    }
}
//# sourceMappingURL=move-processor.js.map