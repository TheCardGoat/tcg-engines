import { type ModalEffectMode } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { AbilityModel } from "@lorcanito/lorcana-engine/store/models/AbilityModel";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { MoveResponse } from "@lorcanito/lorcana-engine/store/types";
import type { GameEffect, ResolvingParam } from "@lorcanito/lorcana-engine/types/types";
export declare class StackLayerModel {
    source: CardModel;
    instanceId: string;
    id: string;
    responder: string;
    ability: AbilityModel;
    private readonly observable;
    private readonly rootStore;
    constructor(id: string, source: CardModel, ability: AbilityModel, rootStore: MobXRootStore, observable: boolean);
    sync(effect: GameEffect): void;
    toJSON(): GameEffect;
    cancel(): void;
    skipEffect(recursiveCall?: boolean): MoveResponse;
    resolve(params?: ResolvingParam, opts?: {
        skipLogs?: boolean;
        skipResolution?: boolean;
    }): boolean | MoveResponse;
    effectCardFilters(): import("../..").TargetFilter[];
    targetAmount(): number | "all" | import("../..").DynamicAmount;
    hasValidTarget(): boolean;
    isOptional(): boolean;
    get isNameACardLayer(): boolean;
    get isModalLayer(): boolean;
    get getModalEffectModes(): ModalEffectMode[];
    get targetsPlayer(): boolean;
    upToTarget(): boolean;
    isInvalidTargetResolution(skipResolution?: boolean): boolean;
    requiresTarget(): boolean;
    requiresPlayerTarget(): boolean;
    getPotentialTargets(): CardModel[];
    getScryEffect(): import("@lorcanito/lorcana-engine/effects/effectTypes").ScryEffect;
    get autoResolve(): boolean;
    get name(): string;
    get description(): string;
    get responderToPlayer(): string;
}
//# sourceMappingURL=StackLayerModel.d.ts.map