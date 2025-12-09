import { type TargetFilter } from "@lorcanito/lorcana-engine";
import { type ContinuousEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { EffectModel } from "@lorcanito/lorcana-engine/store/models/EffectModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
export declare class ContinuousEffectModel implements Omit<ContinuousEffect, "source" | "target" | "effect"> {
    type: "continuous";
    id: string;
    source: CardModel;
    target?: CardModel | null;
    playerTarget?: string;
    filters: TargetFilter[];
    duration: ContinuousEffect["duration"];
    effect: EffectModel;
    private rootStore;
    constructor({ id, source, target, playerTarget, duration, effect, filters, rootStore, observable, }: {
        id: string;
        source: CardModel;
        target?: CardModel | null;
        playerTarget?: string;
        duration: ContinuousEffect["duration"];
        effect: EffectModel;
        filters: TargetFilter[];
        rootStore: MobXRootStore;
        observable: boolean;
    });
    isValid(card: CardModel): boolean;
    isCostReplacementEffect(card: CardModel): boolean;
    isShiftReplacementEffect(card: CardModel): boolean;
    cardPlayed(card: CardModel): void;
    changeTarget(target: CardModel): void;
    sync(effect: ContinuousEffect): void;
    toJSON(): ContinuousEffect;
    isNonAccumulative(): boolean;
    isEquivalent(effect: ContinuousEffectModel): boolean;
}
//# sourceMappingURL=ContinuousEffectModel.d.ts.map