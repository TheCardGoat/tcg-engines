import type { Meta, MobXRootStore } from "@lorcanito/lorcana-engine";
export declare class CardMetaModel {
    exerted?: boolean | null;
    playedThisTurn?: boolean | null;
    damage?: number | null;
    shifter?: string | null;
    shifted?: string | null;
    revealed?: boolean | null;
    location?: string | null;
    characters?: string[] | null;
    private readonly rootStore;
    constructor(meta: Meta | undefined | null, observable: boolean, rootStore: MobXRootStore);
    resetMeta(): void;
    update(meta: Partial<CardMetaModel>): void;
    sync(meta: Meta | undefined | null): void;
    toJSON(): Meta;
}
//# sourceMappingURL=CardMetaModel.d.ts.map