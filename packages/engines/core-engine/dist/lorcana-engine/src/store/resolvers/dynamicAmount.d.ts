import { type CardEffectTarget, type CardModel, type DynamicAmount, type EffectModel, type MobXRootStore } from "@lorcanito/lorcana-engine";
export declare function resolveAmount(effectModel: EffectModel, rootStore: MobXRootStore, targets?: CardModel[]): number;
export declare function calculateDynamicAmount(dynamicAmount: DynamicAmount | number, rootStore: MobXRootStore, targets?: CardModel[], source?: CardModel, effectTarget?: CardEffectTarget): number;
//# sourceMappingURL=dynamicAmount.d.ts.map