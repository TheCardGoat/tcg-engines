/**
 * Type guard to check if a move is an enumerable move
 */
export function isEnumerableMove(move) {
    return typeof move === "object" && move !== null && "execute" in move;
}
/**
 * Type guard to check if a move is a function move
 */
export function isMoveFn(move) {
    return typeof move === "function";
}
/**
 * Helper function to create an enumerable move
 */
export function createEnumerableMove(move) {
    return move;
}
/**
 * Helper function to create an invalid move result
 */
export function createInvalidMove(reason, messageKey, context) {
    return {
        type: "INVALID_MOVE",
        reason,
        messageKey,
        context,
    };
}
/**
 * Type guard to check if a result is an invalid move
 */
export function isInvalidMove(result) {
    return (typeof result === "object" &&
        result !== null &&
        result.type === "INVALID_MOVE");
}
/**
 * Helper function to adapt legacy function moves to EnumerableMove objects
 * This is temporary for Phase 1 and will be removed in Phase 2
 */
export function adaptLegacyMove(legacyMoveFn) {
    return {
        execute: legacyMoveFn,
    };
}
/**
 * Helper function to get the execution function from any move type
 */
export function getExecuteFunction(move) {
    if (isEnumerableMove(move)) {
        return move.execute;
    }
    return move;
}
//# sourceMappingURL=move-types.js.map