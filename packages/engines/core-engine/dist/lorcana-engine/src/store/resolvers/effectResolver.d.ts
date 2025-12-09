import { type CardModel, type Effect, EffectModel, type MobXRootStore, type ResolvingParam } from "@lorcanito/lorcana-engine";
export declare function createEffectId(count: number, effect: Effect, source: CardModel, target?: string): string;
export declare function resolveEffect(effect: Effect, effectModel: EffectModel, rootStore: MobXRootStore, params?: ResolvingParam): import("@lorcanito/lorcana-engine").MoveResponse;
//# sourceMappingURL=effectResolver.d.ts.map