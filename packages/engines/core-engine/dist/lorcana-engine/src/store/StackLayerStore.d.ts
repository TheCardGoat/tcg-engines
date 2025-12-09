import { AbilityModel } from "@lorcanito/lorcana-engine/store/models/AbilityModel";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { StackLayerModel } from "@lorcanito/lorcana-engine/store/models/StackLayerModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies, MoveResponse } from "@lorcanito/lorcana-engine/store/types";
import type { GameEffect, ResolvingParam } from "@lorcanito/lorcana-engine/types/types";
export declare class StackLayerStore {
    dependencies: Dependencies;
    layers: StackLayerModel[];
    readonly rootStore: MobXRootStore;
    readonly observable: boolean;
    constructor(initialState: GameEffect[], dependencies: Dependencies, rootStore: MobXRootStore, observable: boolean);
    sync(effects?: GameEffect[]): void;
    toJSON(): GameEffect[] | undefined;
    getLayer(effectId: string): StackLayerModel;
    addAbilityToStack(ability: AbilityModel, card: CardModel, opts?: {
        addToTheBottomOfStack?: boolean;
        params?: ResolvingParam;
        skipAutoResolve?: boolean;
    }): MoveResponse;
    private addLayerToStack;
    private addOptionalLayerToStack;
    autoTarget(layer: StackLayerModel): void;
    removeLayerFromStack(layer: StackLayerModel): StackLayerModel[];
    /**
     * @deprecated Use sortedTopLayer instead.
     */
    get topLayer(): StackLayerModel;
    get sortedTopLayer(): StackLayerModel;
    get ownLayers(): StackLayerModel[];
    get opponentLayers(): StackLayerModel[];
    get getLayers(): StackLayerModel[];
    resolveTopOfStack(params?: ResolvingParam): false | MoveResponse;
    resolveLayerById(layerId: string, params?: ResolvingParam, opts?: {
        skipLogs?: boolean;
    }): MoveResponse;
}
//# sourceMappingURL=StackLayerStore.d.ts.map