import type { LorcanitoCard, LorcanitoCharacterCard, Zones } from "@lorcanito/lorcana-engine";
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import { type CoreCtx } from "~/game-engine/core-engine/state/context";
import type { InstanceId } from "~/game-engine/core-engine/types";
import { LorcanaCardRepository } from "../cards/lorcana-card-repository";
import { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaGameState, Zone } from "../lorcana-engine-types";
export declare const testCharacterCard: LorcanitoCharacterCard;
export declare const cardWithoutInkwell: LorcanitoCharacterCard;
export type TestInitialState = Partial<Record<Zone, LorcanitoCard[] | number>> & {
    lore?: number;
};
type Opts = {
    debug?: boolean;
    skipPreGame?: boolean;
    cardRepository?: LorcanaCardRepository;
};
export declare class LorcanaTestEngine {
    private readonly cards;
    readonly authoritativeEngine: LorcanaEngine;
    readonly playerOneEngine: LorcanaEngine;
    readonly playerTwoEngine: LorcanaEngine;
    activePlayerEngine: string;
    constructor(playerState?: TestInitialState, opponentState?: TestInitialState, opts?: Opts);
    dispose(): void;
    potentialMoves(): any[];
    getZone(zone: Zones, playerId?: string): string[];
    getCardsByZone(zone: Zones, playerId?: string): CoreCardInstance<{
        id: string;
    }>[];
    changeActivePlayer(playerId: string): void;
    get activeEngine(): LorcanaEngine;
    getZonesCardCount(player?: string): Record<Zone, number>;
    assertThatZonesContain(zones: Partial<Record<Zone, number>>, playerId?: string): void;
    getState(): LorcanaGameState;
    getCtx(): CoreCtx;
    getCards(): Record<string, Record<string, string>>;
    getCardModel(card: LorcanitoCard, _index?: number): CoreCardInstance;
    getPlayerLore(player?: string): number;
    getNumTurns(): number;
    getNumMoves(): number;
    getGameSegment(): string;
    getGamePhase(): string;
    getGameStep(): string;
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
    get engineHashes(): {
        playerOne: string;
        playerTwo: string;
        authoritative: string;
    };
    get engineStates(): {
        playerOne: CoreEngineState<LorcanaGameState>;
        playerTwo: CoreEngineState<LorcanaGameState>;
        authoritative: CoreEngineState<LorcanaGameState>;
    };
    /**
     * Get all cards in a specific zone using the new CardManager
     */
    getCardsInZone(zone: string, owner?: string): CoreCardInstance<{
        id: string;
    }>[];
    private get moves();
    private wasMoveExecutedAndPropagated;
    chooseWhoGoesFirst(playerID: string): {
        success: true;
        data: CoreEngineState<LorcanaGameState>;
    };
    alterHand(cards: InstanceId[]): {
        success: true;
        data: CoreEngineState<LorcanaGameState>;
    };
    putACardIntoTheInkwell(instanceId: string): {
        success: true;
        data: CoreEngineState<LorcanaGameState>;
    };
    passTurn(): {
        success: true;
        data: CoreEngineState<LorcanaGameState>;
    };
}
export declare function createLorcanaEngineMocks(playerState?: TestInitialState, opponentState?: TestInitialState, skipPreMatch?: boolean): {
    game: LorcanaGameState;
    initialCoreContext: CoreCtx;
};
export {};
//# sourceMappingURL=lorcana-test-engine.d.ts.map