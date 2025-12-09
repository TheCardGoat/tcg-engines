import type { CardMetaModel } from "@lorcanito/lorcana-engine/store/models/CardMetaModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies } from "@lorcanito/lorcana-engine/store/types";
import type { Match } from "@lorcanito/lorcana-engine/types/types";
export declare class MetaStore {
    dependencies: Dependencies;
    metas: Record<string, CardMetaModel>;
    private readonly rootStore;
    private readonly observable;
    constructor(initialState: Match["metas"], dependencies: Dependencies, rootStore: MobXRootStore, observable: boolean);
    sync(metas?: Match["metas"]): void;
    toJSON(): Match["metas"];
    get json(): Record<string, import("@lorcanito/shared/lorcana-engine").Meta>;
}
//# sourceMappingURL=MetaStore.d.ts.map