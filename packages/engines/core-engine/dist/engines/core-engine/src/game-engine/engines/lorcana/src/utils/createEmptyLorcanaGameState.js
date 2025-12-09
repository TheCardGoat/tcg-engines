/**
 * Creates an empty LorcanaGameState with additional properties needed for testing
 */
export function createEmptyLorcanaGameState(matchId = "", gameId = "", randomSeed = "", firstPlayer = "", playerIds = []) {
    return {
        effects: [],
        bag: [],
        turnActions: undefined, // Explicitly set to undefined to start fresh
    };
}
//# sourceMappingURL=createEmptyLorcanaGameState.js.map