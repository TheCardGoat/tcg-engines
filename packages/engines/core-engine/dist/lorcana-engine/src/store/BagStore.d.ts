import { StackLayerModel } from "@lorcanito/lorcana-engine/store/models/StackLayerModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies } from "@lorcanito/lorcana-engine/store/types";
import type { GameEffect } from "@lorcanito/lorcana-engine/types/types";
export declare class BagStore {
    dependencies: Dependencies;
    layers: StackLayerModel[];
    readonly rootStore: MobXRootStore;
    readonly observable: boolean;
    constructor(initialState: GameEffect[], dependencies: Dependencies, rootStore: MobXRootStore, observable: boolean);
    sync(effects?: GameEffect[]): void;
    toJSON(): GameEffect[] | undefined;
}
//# sourceMappingURL=BagStore.d.ts.map