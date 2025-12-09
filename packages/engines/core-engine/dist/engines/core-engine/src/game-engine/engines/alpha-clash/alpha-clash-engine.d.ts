/**
 * Alpha Clash Game Engine
 *
 * Main engine class that coordinates all Alpha Clash game systems:
 * - Extends CoreEngine for state management and move processing
 * - Integrates card repository and game definition
 * - Provides Alpha Clash-specific utility methods
 */
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { AlphaClashCardDefinition, AlphaClashCardFilter, AlphaClashGameState, AlphaClashPlayerState } from "./alpha-clash-engine-types";
import { AlphaClashCardRepository } from "./src/cards/alpha-clash-card-repository";
type AlphaClashCardInstance = CoreCardInstance<AlphaClashCardDefinition>;
export interface AlphaClashEngineConfig {
    initialState: AlphaClashGameState;
    initialCoreCtx: CoreCtx;
    cards: Record<string, Record<string, string>>;
    cardRepository?: AlphaClashCardRepository;
    playerId?: string;
    gameId: string;
    players: string[];
    debug?: boolean;
}
export declare class AlphaClashEngine extends GameEngine<AlphaClashGameState, AlphaClashCardDefinition, AlphaClashPlayerState, AlphaClashCardFilter, AlphaClashCardInstance> {
    private cardRepository;
    constructor(config: AlphaClashEngineConfig);
    /**
     * Get available moves for the engine
     */
    get moves(): {
        chooseFirstPlayer: (playerId: string) => import("../../core-engine").Result<import("../../core-engine/game-configuration").CoreEngineState<{
            currentSegment?: string;
            currentPhase?: import("./alpha-clash-engine-types").AlphaClashGamePhase;
            players?: Record<string, AlphaClashPlayerState>;
            currentExpansionStep?: import("./alpha-clash-engine-types").AlphaClashExpansionStep;
            currentClashStep?: import("./alpha-clash-engine-types").AlphaClashClashStep;
            gameEnded?: boolean;
            winner?: string;
            activeClashground?: string;
            clashState?: {
                attackers: string[];
                defenders: string[];
                obstructors: Record<string, string>;
                clashBuffs: {
                    attacker?: string;
                    defender?: string;
                };
                damage: Record<string, number>;
            };
            priorityState?: {
                window: import("./alpha-clash-engine-types").AlphaClashPriorityWindow;
                activePlayer: string;
                passedPlayers: Set<string>;
            };
            effectsStack?: Array<{
                id: string;
                effect: any;
                source: string;
                targets?: string[];
            }>;
            firstPlayerChosen?: boolean;
        }>, import("../../core-engine/errors/engine-errors").AnyEngineError>;
        mulligan: (cardsToMulligan: string[]) => {
            success: false;
            error: import("../../core-engine/errors/engine-errors").AnyEngineError;
        } | {
            success: true;
            data: import("../../core-engine/game-configuration").CoreEngineState<{
                currentSegment?: string;
                currentPhase?: import("./alpha-clash-engine-types").AlphaClashGamePhase;
                players?: Record<string, AlphaClashPlayerState>;
                currentExpansionStep?: import("./alpha-clash-engine-types").AlphaClashExpansionStep;
                currentClashStep?: import("./alpha-clash-engine-types").AlphaClashClashStep;
                gameEnded?: boolean;
                winner?: string;
                activeClashground?: string;
                clashState?: {
                    attackers: string[];
                    defenders: string[];
                    obstructors: Record<string, string>;
                    clashBuffs: {
                        attacker?: string;
                        defender?: string;
                    };
                    damage: Record<string, number>;
                };
                priorityState?: {
                    window: import("./alpha-clash-engine-types").AlphaClashPriorityWindow;
                    activePlayer: string;
                    passedPlayers: Set<string>;
                };
                effectsStack?: Array<{
                    id: string;
                    effect: any;
                    source: string;
                    targets?: string[];
                }>;
                firstPlayerChosen?: boolean;
            }>;
        } | {
            success: boolean;
            error: string;
        };
        concede: (playerId: string) => import("../../core-engine").Result<import("../../core-engine/game-configuration").CoreEngineState<{
            currentSegment?: string;
            currentPhase?: import("./alpha-clash-engine-types").AlphaClashGamePhase;
            players?: Record<string, AlphaClashPlayerState>;
            currentExpansionStep?: import("./alpha-clash-engine-types").AlphaClashExpansionStep;
            currentClashStep?: import("./alpha-clash-engine-types").AlphaClashClashStep;
            gameEnded?: boolean;
            winner?: string;
            activeClashground?: string;
            clashState?: {
                attackers: string[];
                defenders: string[];
                obstructors: Record<string, string>;
                clashBuffs: {
                    attacker?: string;
                    defender?: string;
                };
                damage: Record<string, number>;
            };
            priorityState?: {
                window: import("./alpha-clash-engine-types").AlphaClashPriorityWindow;
                activePlayer: string;
                passedPlayers: Set<string>;
            };
            effectsStack?: Array<{
                id: string;
                effect: any;
                source: string;
                targets?: string[];
            }>;
            firstPlayerChosen?: boolean;
        }>, import("../../core-engine/errors/engine-errors").AnyEngineError>;
    };
    /**
     * Get the Alpha Clash card repository
     */
    getCardRepository(): AlphaClashCardRepository;
    /**
     * Get all cards in a specific zone for a player
     */
    getZoneCards(zone: string, playerId?: string): Array<{
        instanceId: string;
        definition: AlphaClashCardDefinition;
    }>;
    /**
     * Get player's hand cards
     */
    getHandCards(playerId?: string): Array<{
        instanceId: string;
        definition: AlphaClashCardDefinition;
    }>;
    /**
     * Get player's battlefield cards (clash zone)
     */
    getBattlefieldCards(playerId?: string): Array<{
        instanceId: string;
        definition: AlphaClashCardDefinition;
    }>;
    /**
     * Get player's contender card
     */
    getContenderCard(playerId?: string): {
        instanceId: string;
        definition: AlphaClashCardDefinition;
    } | undefined;
    /**
     * Get active clashground card
     */
    getActiveClashground(): {
        instanceId: string;
        definition: AlphaClashCardDefinition;
        owner: string;
    } | undefined;
    /**
     * Get cards by filter
     */
    getCardsByFilter(filter: AlphaClashCardFilter, playerId?: string): Array<{
        instanceId: string;
        definition: AlphaClashCardDefinition;
        zone: string;
    }>;
    /**
     * Check if a card matches a filter
     */
    private matchesFilter;
    /**
     * Check if a card can be played
     */
    canPlayCard(instanceId: string, playerId?: string): boolean;
    /**
     * Get player's available resources
     */
    getAvailableResources(playerId?: string): number;
    /**
     * Check if player can afford a card
     */
    canAffordCard(instanceId: string, playerId?: string): boolean;
    /**
     * Get game statistics
     */
    getGameStats(): {
        turn: number;
        currentPlayer: string;
        phase: string;
        playerStats: Record<string, {
            handSize: number;
            deckSize: number;
            clashCards: number;
            resources: number;
            contenderHealth?: number;
        }>;
    };
}
export {};
//# sourceMappingURL=alpha-clash-engine.d.ts.map