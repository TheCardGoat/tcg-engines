import { type CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards, InstanceId } from "~/game-engine/core-engine/types";
import type { GundamGameState, ZoneType } from "~/game-engine/engines/gundam/src/gundam-engine-types";
import type { GundamitoBaseCard, GundamitoCard, GundamitoCommandCard, GundamitoPilotCard, GundamitoResourceCard, GundamitoUnitCard } from "../cards/definitions/cardTypes";
import { GundamCardRepository } from "../cards/gundam-card-repository";
import { GundamEngine } from "../gundam-engine";
export declare const mockUnitCard: GundamitoUnitCard;
export declare const mockPilotCard: GundamitoPilotCard;
export declare const mockBaseCard: GundamitoBaseCard;
export declare const mockCommandCard: GundamitoCommandCard;
export declare const mockResourceCard: GundamitoResourceCard;
export type TestInitialState = Partial<Record<ZoneType, GundamitoCard[] | number>>;
type Opts = {
    debug?: boolean;
    skipPreGame?: boolean;
    cardRepository?: GundamCardRepository;
};
export declare class GundamTestEngine {
    private readonly cards;
    authoritativeEngine: GundamEngine;
    playerOneEngine: GundamEngine;
    playerTwoEngine: GundamEngine;
    activeEngine: string;
    constructor(playerState?: TestInitialState, opponentState?: TestInitialState, opts?: Opts);
    dispose(): void;
    potentialMoves(): any[];
    changeActivePlayer(playerId: string): void;
    get engine(): GundamEngine;
    getZonesCardCount(player?: string): Record<ZoneType, number>;
    assertThatZonesContain(zones: Partial<Record<ZoneType, number>>, playerId?: string): void;
    getState(): GundamGameState;
    getCtx(): {
        turnPlayer: string;
        priorityPlayer: string;
        playerOrder: Array<import("~/game-engine/core-engine/types").PlayerID>;
        turnPlayerPos: number;
        priorityPlayerPos: number;
        gameId: string;
        matchId: string;
        otp?: import("~/game-engine/core-engine/types").PlayerID;
        choosingFirstPlayer?: import("~/game-engine/core-engine/types").PlayerId;
        pendingMulligan?: Set<import("~/game-engine/core-engine/types").PlayerId>;
        pendingChampionSelection?: Set<import("~/game-engine/core-engine/types").PlayerId>;
        gameOver?: unknown;
        winner?: import("~/game-engine/core-engine/types").PlayerID;
        manualMode?: boolean;
        numTurns: number;
        numMoves?: number;
        numTurnMoves: number;
        currentSegment?: string;
        currentTurn?: string;
        currentPhase?: string;
        currentStep?: string;
        cards: GameCards;
        cardZones?: Record<string, import("~/game-engine/core-engine/engine/zone-operation").Zone>;
        moveHistory: import("~/game-engine/core-engine/state/context").GameMoveHistoryEntry[];
        players: {
            [id: string]: import("~/game-engine/core-engine/state/context").PlayerState<unknown>;
        };
        seed?: string | number;
    };
    getCards(): Record<string, Record<string, string>>;
    getCardModel(card: GundamitoCard, _index?: number): import("~/game-engine/engines/gundam/src/gundam-engine-types").GundamModel;
    getPlayerLore(player?: string): number;
    getNumTurns(): number;
    getNumMoves(): number;
    getGameSegment(): string;
    getGamePhase(): string;
    getPriorityPlayers(): string[];
    getTurnPlayer(): string;
    getFlowState(): {
        gameSegment: string;
        gamePhase: string;
        gameStep: string;
        priorityPlayers: string[];
        turnPlayer: string;
        numTurns: number;
        numMoves: number;
    };
    private get moves();
    get engineHashes(): {
        playerOne: string;
        playerTwo: string;
        authoritative: string;
    };
    get engineStates(): {
        playerOne: import("../../../../core-engine/game-configuration").CoreEngineState<GundamGameState>;
        playerTwo: import("../../../../core-engine/game-configuration").CoreEngineState<GundamGameState>;
        authoritative: import("../../../../core-engine/game-configuration").CoreEngineState<GundamGameState>;
    };
    chooseFirstPlayer(playerID: string): import("../../../../core-engine").Result<import("../../../../core-engine/game-configuration").CoreEngineState<GundamGameState>, import("../../../../core-engine/errors/engine-errors").AnyEngineError>;
    alterHand(cards: InstanceId[]): void;
    redrawHand(redraw: boolean): void;
    /**
     * Get enriched card by instance ID using the new CardManager
     */
    getEnrichedCard(instanceId: string): any;
    /**
     * Get all cards for a player using the new CardManager
     */
    getPlayerCards(playerId: string): any[];
    getZone(zone: string, playerId?: string): string[];
    getCardsByZone(zone: string, playerId?: string): (import("~/game-engine/engines/gundam/src/gundam-engine-types").GundamModel | {
        instanceId: string;
    })[];
    /**
     * Get cards matching a custom filter using the new CardManager
     */
    getCardsWithFilter(filter: (cardState: any) => boolean): any[];
    /**
     * Get all cards in the game using the new CardManager
     */
    getAllEnrichedCards(): any[];
    /**
     * Demonstrate the new CardManager with a comprehensive query
     */
    demonstrateCardManager(): {
        totalCards: number;
        player1CardCount: number;
        handCardCount: number;
        customFilterCount: number;
        sampleCard: {
            instanceId: any;
            publicId: any;
            owner: any;
            zone: any;
            definition: any;
        };
    };
}
export declare function createMockGame(playerState?: TestInitialState, opponentState?: TestInitialState, skipPreMatch?: boolean): {
    game: GundamGameState;
    initialCoreContext: CoreCtx;
};
export {};
//# sourceMappingURL=gundam-test-engine.d.ts.map