import { type Ability, type AbilityModel, type CardModel, type Effect, type EffectModel, type MobXRootStore, type ResolvingParam, type StackLayerModel } from "@lorcanito/lorcana-engine";
import { type EffectTargets, type PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { FloatingTriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/FloatingTriggeredAbilityModel";
import type { TriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/TriggeredAbilityModel";
import type { StackLayerStore } from "@lorcanito/lorcana-engine/store/StackLayerStore";
export declare function resolveCardTargets(effectModel: EffectModel, rootStore: MobXRootStore, targets?: EffectTargets, params?: {
    targets?: CardModel[];
    mode?: string;
}): CardModel[];
export declare function resolvePlayerTargets(effectModel: EffectModel, rootStore: MobXRootStore, targets?: EffectTargets, layerParams?: ResolvingParam): string[];
export declare function canCardBeTargeted(effectModel: EffectModel, rootStore: MobXRootStore, cardTarget: CardModel, responder: string, effectTarget?: EffectTargets, skipNotification?: boolean, params?: ResolvingParam, debug?: boolean): boolean;
export declare function doesItRequireTarget(effectModel: EffectModel): boolean;
export declare function matchesTargetFilters(rootStore: MobXRootStore, card: CardModel, target?: EffectTargets | PlayerEffectTarget, expectedOwner?: string, source?: CardModel, params?: ResolvingParam): boolean;
export declare function isValidAbilityTriggerTarget(rootStore: MobXRootStore, ability: TriggeredAbilityModel | FloatingTriggeredAbilityModel, target?: CardModel, source?: CardModel, debug?: boolean): boolean;
export declare function autoTarget(stackLayerStore: StackLayerStore, rootStore: MobXRootStore, layer: StackLayerModel): void;
export declare function calculateHowManyTargets(ability: AbilityModel, store: MobXRootStore): number | "all" | import("@lorcanito/lorcana-engine").DynamicAmount;
export declare function hasValidTarget(ability: AbilityModel): boolean;
export declare function doesEffectTargetPlayer(effect: Effect): boolean;
export declare function doesAbilityTargetPlayer(ability: AbilityModel): boolean;
export declare function isUpToTarget(ability: AbilityModel): boolean;
export declare function isValidPlayerEffectTarget(source: CardModel, effect: Effect, playerId: string): boolean;
export declare function isValidPlayerTarget(source: CardModel, ability: Ability, playerId: string): boolean;
//# sourceMappingURL=targetsResolver.d.ts.map