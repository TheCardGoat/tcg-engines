import { ResultHelpers } from "~/game-engine/core-engine";
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import { type CoreCtx } from "~/game-engine/core-engine/state/context";
import { LorcanaCardInstance } from "./cards/lorcana-card-instance";
import type { LorcanaCardRepository } from "./cards/lorcana-card-repository";
import type { GameCards, LorcanaGameState, TriggerTiming, Zone } from "./lorcana-engine-types";
import type { LorcanaCardDefinition, LorcanaCardFilter, LorcanaPlayerState } from "./lorcana-generic-types";
export type { LorcanaCardDefinition, LorcanaCardFilter, LorcanaPlayerState };
export declare class LorcanaEngine extends GameEngine<LorcanaGameState, LorcanaCardDefinition, LorcanaPlayerState, LorcanaCardFilter, LorcanaCardInstance> {
    protected cardRepository?: LorcanaCardRepository;
    constructor({ initialState, initialCoreCtx, cards, cardRepository, gameId, playerId, seed, players, debug, }: {
        initialState: LorcanaGameState;
        initialCoreCtx?: CoreCtx;
        cards: GameCards;
        cardRepository?: LorcanaCardRepository;
        gameId: string;
        playerId?: string;
        debug?: boolean;
        seed?: string;
        players: string[];
    });
    /**
     * Initializes card models with Lorcana-specific functionality
     */
    protected initializeCardModels(): void;
    /**
     * Get a card instance by its ID
     * Use this method when you need a fully typed LorcanaCardInstance
     */
    getLorcanaCardInstance(instanceId: string): LorcanaCardInstance | undefined;
    /** Get engine store for backward compatibility with legacy APIs */
    getStore(): {
        state: import("../../../core-engine/game-configuration").CoreEngineState<LorcanaGameState>;
        stateHash: string;
    };
    /**
     * Add triggered effects to the bag for processing
     * This is a Lorcana-specific mechanism for handling card triggers
     */
    addTriggeredEffectsToTheBag(timing: TriggerTiming, cardInstanceId: string): void;
    /**
     * Process all effects currently in the bag
     * This resolves triggered effects in the proper order
     */
    resolveBag(): void;
    get moves(): {
        chooseWhoGoesFirstMove: (playerId: string) => ResultHelpers<import("../../../core-engine/game-configuration").CoreEngineState<LorcanaGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        alterHand: (cardsToAlter: string[]) => {
            success: false;
            error: import("../../../core-engine/errors/engine-errors").AnyEngineError;
        } | {
            success: true;
            data: import("../../../core-engine/game-configuration").CoreEngineState<LorcanaGameState>;
        } | {
            success: false;
            error: string;
        };
        putACardIntoTheInkwell: (instanceId: string) => {
            success: false;
            error: import("../../../core-engine/errors/engine-errors").AnyEngineError;
        } | {
            success: true;
            data: import("../../../core-engine/game-configuration").CoreEngineState<LorcanaGameState>;
        } | {
            success: false;
            error: string;
        };
        passTurn: () => {
            success: false;
            error: import("../../../core-engine/errors/engine-errors").AnyEngineError;
        } | {
            success: true;
            data: import("../../../core-engine/game-configuration").CoreEngineState<LorcanaGameState>;
        } | {
            success: false;
            error: string;
        };
    };
    getCardZone(instanceId: string): Zone | undefined;
    getZonesCardCount(player?: string): Record<Zone, number>;
    queryAllPlayers(): import("~/game-engine/core-engine/state/context").PlayerState<unknown>[];
    queryAllZones(): import("~/game-engine/core-engine/engine/zone-operation").Zone[];
    queryAllCards(): CoreCardInstance<LorcanaCardDefinition>[];
    /**
     * Type-safe card filtering with Lorcana-specific properties
     */
    queryCardsByFilter(filter: LorcanaCardFilter): CoreCardInstance<{
        id: string;
    }>[];
    get core(): this;
    hasPlayerMulliganed(playerId: string): boolean;
    canPlayerPutCardIntoInkwell(playerId: string): boolean;
}
//# sourceMappingURL=lorcana-engine.d.ts.map