/**
 * Utility function to create an empty Riftbound game state
 * This provides a clean starting point for game initialization
 */
/**
 * Creates an empty player state with all zones initialized
 */
export function createEmptyPlayerState(playerId, playerName) {
    return {
        id: playerId,
        name: playerName,
        // Initialize all zones as empty arrays
        zones: {
            deck: [],
            hand: [],
            resourceDeck: [],
            base: [],
            legendZone: [],
            championZone: [],
            removalArea: [], // Banishment
            trash: [],
            sideboard: [], // Facedown/hidden cards
        },
        // Resource pools (empty at start)
        energyPool: 0,
        powerPool: {
            fury: 0,
            calm: 0,
            mind: 0,
            body: 0,
            chaos: 0,
            order: 0,
        },
        universalPower: 0,
        // Victory and scoring
        points: 0,
        burnOutCount: 0,
        hasScored: new Set(),
        // Turn state
        hasPlayedCard: false,
        focus: false,
        // Combat state
        combatRole: "none",
        isRelevantPlayer: false,
        // Domain identity (will be set during setup)
        domainIdentity: [],
        chosenChampion: undefined,
        championLegend: undefined,
    };
}
/**
 * Creates an empty Riftbound game state
 */
export function createEmptyRiftboundGameState() {
    return {
        // Game state
        gameState: "neutral-open",
        // Battlefield system (empty at start)
        battlefields: {},
        // Victory conditions (default to 1v1 Duel mode)
        victoryScore: 8,
        gameMode: "1v1-duel",
        teamMode: false,
        teams: undefined,
        // Combat system
        pendingCombats: [],
        currentCombat: undefined,
        // Chain system (empty stack)
        chain: [],
        // Showdown system
        showdown: undefined,
        // Battlefield control
        battlefieldControl: {},
        contestedBattlefields: new Set(),
    };
}
/**
 * Adds a player to an existing game state
 */
export function addPlayerToGameState(gameState, playerId, playerName, insertIndex) {
    const newPlayerState = createEmptyPlayerState(playerId, playerName);
    return gameState;
}
/**
 * Sets up the game state for a specific mode of play
 */
export function setupGameMode(gameState, mode) {
    switch (mode) {
        case "1v1-duel":
        case "1v1-match":
            gameState.victoryScore = 8;
            gameState.gameMode = mode;
            gameState.teamMode = false;
            break;
        case "ffa3-skirmish":
            gameState.victoryScore = 8;
            gameState.gameMode = mode;
            gameState.teamMode = false;
            break;
        case "ffa4-war":
            gameState.victoryScore = 8;
            gameState.gameMode = mode;
            gameState.teamMode = false;
            break;
        case "2v2-magma":
            gameState.victoryScore = 11;
            gameState.gameMode = mode;
            gameState.teamMode = true;
            // Teams will be set up during player assignment
            break;
    }
    return gameState;
}
/**
 * Sets up teams for 2v2 mode
 */
export function setupTeams(gameState, team1, team2) {
    if (gameState.gameMode !== "2v2-magma") {
        throw new Error("Teams can only be set up in 2v2 mode");
    }
    gameState.teams = {
        team1: [team1[0], team1[1]],
        team2: [team2[0], team2[1]],
    };
    return gameState;
}
/**
 * Initialize the first turn based on game mode
 */
export function initializeFirstTurn(gameState, firstPlayer) {
    return gameState;
}
/**
 * Utility to get the number of battlefields for a game mode
 */
export function getBattlefieldCount(mode) {
    switch (mode) {
        case "1v1-duel":
        case "1v1-match":
            return 2;
        case "ffa3-skirmish":
            return 3;
        case "ffa4-war":
        case "2v2-magma":
            return 3;
        default:
            return 2;
    }
}
/**
 * Utility to check if a player is a teammate of another player
 */
export function areTeammates(gameState, player1, player2) {
    if (!(gameState.teamMode && gameState.teams)) {
        return false;
    }
    for (const team of Object.values(gameState.teams)) {
        if (team.includes(player1) && team.includes(player2)) {
            return true;
        }
    }
    return false;
}
/**
 * Utility to get a player's teammates
 */
export function getTeammates(gameState, playerId) {
    if (!(gameState.teamMode && gameState.teams)) {
        return [];
    }
    for (const team of Object.values(gameState.teams)) {
        if (team.includes(playerId)) {
            return team.filter((p) => p !== playerId);
        }
    }
    return [];
}
//# sourceMappingURL=createEmptyRiftboundGameState.js.map