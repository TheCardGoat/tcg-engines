import { type EffectTargets, type PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import { type Effect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { ResolvingParam } from "@lorcanito/lorcana-engine/types/types";
export type EffectOutput = {
    source: string;
    responder: "self" | "opponent" | string;
    effects: Effect;
};
export declare class EffectModel {
    effect: Effect;
    source: CardModel;
    responder: "self" | "opponent" | string;
    private readonly rootStore;
    private readonly observable;
    constructor(effects: Effect, source: CardModel, responder: "self" | "opponent" | string, rootStore: MobXRootStore, observable: boolean);
    sync(effect: EffectOutput): void;
    toJSON(): EffectOutput;
    isScryEffect(): boolean;
    get type(): "move" | "damage" | "restriction" | "draw" | "attribute" | "player-restriction" | "discard" | "heal" | "play" | "ability" | "exert" | "banish" | "lore" | "reveal" | "reveal-and-play" | "modal" | "reveal-top-card" | "reveal-from-top-until" | "move-to-location" | "character-moving-to-location" | "replacement" | "shuffle" | "put-damage" | "protection" | "move-damage" | "create-layer-based-on-target" | "move-damage-to" | "target-conditional" | "scry" | "mill" | "shuffle-deck" | "from-target-card-to-target-player" | "create-layer-for-player" | "create-layer-targeting-player" | "additional-inkwell" | "create-layer-based-on-condition";
    requiresTarget(): boolean;
    requiresPlayerTarget(): boolean;
    get potentialTargets(): CardModel[];
    get isModal(): boolean;
    get getSpecificCardFilter(): CardModel | CardModel[];
    hasRandomTarget(): boolean;
    calculateAmount(targets?: CardModel[]): number;
    replaceDynamicTargets({ targetPlayer }?: {
        targetPlayer?: string;
    }): void;
    replaceDynamicTargetFilters({ nameACard }?: {
        nameACard?: string;
    }): void;
    changeTarget(target: CardModel): void;
    get targets(): import("@lorcanito/lorcana-engine/effects/effectTargets").CardEffectTarget | PlayerEffectTarget;
    get target(): import("@lorcanito/lorcana-engine/effects/effectTargets").CardEffectTarget | PlayerEffectTarget;
    get hasSelfReferencingTarget(): boolean;
    get conditions(): Condition[];
    get areConditionsMet(): boolean;
    canTargetCard(cardTarget: CardModel, responder: string, skipNotification?: boolean, params?: ResolvingParam): boolean;
    resolvePlayerTargets(targets?: EffectTargets, layerParams?: ResolvingParam): string[];
    resolveCardTargets(target?: EffectTargets, params?: {
        targets?: CardModel[];
    }): CardModel[];
    resolve(params?: ResolvingParam): void;
    resolveEffect(effect: Effect, params?: ResolvingParam): void;
    get isLoreEffect(): boolean;
    get isCostReplacementEffect(): boolean;
    get isShiftReplacementEffect(): boolean;
    get isCostEffect(): boolean;
    get isStrengthEffect(): boolean;
    get isMoveCostEffect(): boolean;
    get isWillPowerEffect(): boolean;
    get isSingCostEffect(): boolean;
    resolveAmount(params: ResolvingParam | undefined): void;
    isNonAccumulative(): boolean;
}
//# sourceMappingURL=EffectModel.d.ts.map