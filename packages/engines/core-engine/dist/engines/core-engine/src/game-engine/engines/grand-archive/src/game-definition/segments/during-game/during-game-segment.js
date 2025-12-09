/**
 * Grand Archive During Game Segment
 *
 * Main gameplay segment with Grand Archive's 6 turn phases:
 * Wake Up → Materialize → Recollection → Draw → Main → End
 */
import { logger } from "~/game-engine/core-engine/utils/logger";
import { grandArchiveMoves } from "../../../moves/moves";
export const duringGameSegment = {
    next: "endGame",
    onBegin: ({ G }) => {
        logger.info("==== DURING GAME SEGMENT ====");
        return {
            ...G,
            currentSegment: "duringGame",
        };
    },
    endIf: ({ G, ctx, coreOps }) => {
        // Game ends when a player wins or loses
        for (const playerId of ctx.playerOrder) {
            const player = ctx.players[playerId];
            if (!player)
                continue;
            // TODO: Check win conditions - need CoreOperation method for championDamage
            // if (player.championDamage >= 25) {
            //   logger.info(`Game ending: ${playerId} champion defeated`);
            //   return true;
            // }
            // Check if player has no cards left to draw
            const deck = coreOps.getZone("mainDeck", playerId);
            if (deck.cards.length === 0) {
                logger.info(`Game ending: ${playerId} runs out of cards`);
                return true;
            }
        }
        return false;
    },
    onEnd: ({ G }) => {
        logger.info("During Game segment complete");
        return {
            ...G,
            currentSegment: "endGame",
        };
    },
    turn: {
        // Turn order is managed by CoreEngine
        onBegin: ({ G, ctx }) => {
            const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
            logger.info(`Turn ${ctx.numTurns}: ${currentPlayer}'s turn begins`);
            // TODO: Reset turn-specific player state - need CoreOperation methods
            // const player = ctx.players[currentPlayer];
            // Need CoreOperation methods to manage hasMaterialized, turnActions, etc.
            return {
                ...G,
                currentPhase: "wakeUpPhase",
                passedPlayers: new Set(),
            };
        },
        onEnd: ({ G, ctx }) => {
            const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
            logger.info(`Turn ${ctx.numTurns}: ${currentPlayer}'s turn ends`);
            // Clear temporary effects and end-of-turn cleanup
            return {
                ...G,
                effectsStack: [], // Clear any remaining effects
                combatState: undefined,
                combatPhase: undefined,
                passedPlayers: new Set(),
            };
        },
        phases: {
            // Phase 1: Wake Up Phase
            wakeUpPhase: {
                start: true,
                next: "materializePhase",
                onBegin: ({ G, ctx, coreOps }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Wake Up Phase`);
                    // Awaken all rested objects
                    const fieldZone = coreOps.getZone("field", currentPlayer);
                    for (const cardId of fieldZone.cards) {
                        // Awaken the card (remove rested state)
                        // This would be handled by the core engine's card state system
                    }
                    return {
                        ...G,
                        currentPhase: "wakeUpPhase",
                    };
                },
                endIf: () => true, // Automatic phase - no player actions
                moves: {
                // No moves available during wake up phase
                },
            },
            // Phase 2: Materialize Phase
            materializePhase: {
                next: "recollectionPhase",
                onBegin: ({ G, ctx }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Materialize Phase`);
                    return {
                        ...G,
                        currentPhase: "materializePhase",
                    };
                },
                endIf: ({ G, ctx }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    // TODO: Phase ends when player has materialized or chooses not to
                    // Need CoreOperation method to check if player has materialized
                    // For now, let phases progress automatically
                    return false; // player?.hasMaterialized;
                },
                moves: {
                    materializeCard: grandArchiveMoves.materializeCard,
                    skipMaterialization: grandArchiveMoves.skipMaterialization,
                },
            },
            // Phase 3: Recollection Phase
            recollectionPhase: {
                next: "drawPhase",
                onBegin: ({ G, ctx, coreOps }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Recollection Phase`);
                    // Return cards from Memory to Hand
                    const memoryZone = coreOps.getZone("memory", currentPlayer);
                    for (const cardId of [...memoryZone.cards]) {
                        coreOps.moveCard({
                            playerId: currentPlayer,
                            instanceId: cardId,
                            from: "memory",
                            to: "hand",
                            destination: "end",
                        });
                    }
                    // Grant opportunity to turn player
                    coreOps.setPriorityPlayer(currentPlayer);
                    return {
                        ...G,
                        currentPhase: "recollectionPhase",
                        opportunityPlayer: currentPlayer,
                        passedPlayers: new Set(),
                    };
                },
                endIf: ({ G, ctx }) => {
                    // Phase ends when all players pass opportunity
                    return G.passedPlayers.size === ctx.playerOrder.length;
                },
                moves: {
                    activateAbility: grandArchiveMoves.activateAbility,
                    activateCard: grandArchiveMoves.activateCard,
                    pass: grandArchiveMoves.pass,
                },
            },
            // Phase 4: Draw Phase
            drawPhase: {
                next: "mainPhase",
                onBegin: ({ G, ctx, coreOps }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Draw Phase`);
                    // Draw one card
                    coreOps.moveCard({
                        playerId: currentPlayer,
                        from: "mainDeck",
                        to: "hand",
                        destination: "end",
                    });
                    return {
                        ...G,
                        currentPhase: "drawPhase",
                    };
                },
                endIf: () => true, // Automatic phase - draw one card
                moves: {
                // No moves available during draw phase
                },
            },
            // Phase 5: Main Phase
            mainPhase: {
                next: "endPhase",
                onBegin: ({ G, ctx, coreOps }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Main Phase`);
                    // Grant opportunity to turn player
                    coreOps.setPriorityPlayer(currentPlayer);
                    return {
                        ...G,
                        currentPhase: "mainPhase",
                        opportunityPlayer: currentPlayer,
                        passedPlayers: new Set(),
                    };
                },
                endIf: ({ G, ctx }) => {
                    // Phase ends when all players pass opportunity
                    return G.passedPlayers.size === ctx.playerOrder.length;
                },
                moves: {
                    // All moves available during main phase
                    activateCard: grandArchiveMoves.activateCard,
                    materializeCard: grandArchiveMoves.materializeCard,
                    activateAbility: grandArchiveMoves.activateAbility,
                    declareAttack: grandArchiveMoves.declareAttack,
                    levelUpChampion: grandArchiveMoves.levelUpChampion,
                    pass: grandArchiveMoves.pass,
                },
            },
            // Phase 6: End Phase
            endPhase: {
                onBegin: ({ G, ctx, coreOps }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: End Phase`);
                    // Grant opportunity to turn player
                    coreOps.setPriorityPlayer(currentPlayer);
                    return {
                        ...G,
                        currentPhase: "endPhase",
                        opportunityPlayer: currentPlayer,
                        passedPlayers: new Set(),
                    };
                },
                endIf: ({ G, ctx }) => {
                    // Phase ends when all players pass opportunity
                    return G.passedPlayers.size === ctx.playerOrder.length;
                },
                onEnd: ({ G, ctx }) => {
                    // End of turn cleanup
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Turn ending`);
                    // Clear temporary damage from allies
                    // Reset turn-specific flags
                    // This would be handled by the core engine
                    return G;
                },
                moves: {
                    activateAbility: grandArchiveMoves.activateAbility,
                    activateCard: grandArchiveMoves.activateCard,
                    pass: grandArchiveMoves.pass,
                },
            },
            // Special Combat Phase (entered from Main Phase)
            combatPhase: {
                onBegin: ({ G, ctx }) => {
                    const currentPlayer = ctx.playerOrder[ctx.turnPlayerPos];
                    logger.info(`${currentPlayer}: Combat Phase`);
                    return {
                        ...G,
                        currentPhase: "combatPhase",
                        combatPhase: "attackDeclaration",
                    };
                },
                endIf: ({ G }) => {
                    return G.combatPhase === undefined;
                },
                onEnd: ({ G }) => {
                    // Return to Main Phase after combat
                    return {
                        ...G,
                        currentPhase: "mainPhase",
                        combatState: undefined,
                        combatPhase: undefined,
                    };
                },
                moves: {
                    declareAttack: grandArchiveMoves.declareAttack,
                    declareRetaliation: grandArchiveMoves.declareRetaliation,
                    activateAbility: grandArchiveMoves.activateAbility,
                    pass: grandArchiveMoves.pass,
                },
            },
        },
    },
};
//# sourceMappingURL=during-game-segment.js.map