import { AbilityModel, type CardModel, type Effect, type MobXRootStore, type TargetFilter, type TriggeredAbility } from "@lorcanito/lorcana-engine";
import { type IsValidTriggerParams } from "@lorcanito/lorcana-engine/store/resolvers/triggerResolver";
export declare class TriggeredAbilityModel {
    type: "static-triggered";
    cardSource: CardModel;
    cardThatTriggered: CardModel;
    layer: TriggeredAbility["layer"];
    trigger: TriggeredAbility["trigger"];
    effects: TriggeredAbility["effects"];
    optional: TriggeredAbility["optional"];
    conditions: TriggeredAbility["conditions"];
    secondaryConditions: TriggeredAbility["secondaryConditions"];
    model: AbilityModel;
    private readonly rootStore;
    private readonly observable;
    constructor(abilityModel: AbilityModel, source: CardModel, cardThatTriggered: CardModel, rootStore: MobXRootStore, observable: boolean);
    get filters(): TargetFilter[];
    replaceTriggerTarget(source: CardModel, trigger: CardModel): void;
    replaceDynamicTargets(params: IsValidTriggerParams): void;
    replaceMoveToLocationTriggerTarget(source: CardModel, trigger: CardModel): void;
    replaceChallengeTarget(params?: {
        attacker?: CardModel;
        defender?: CardModel;
    }): void;
    replaceSingTarget(params?: {
        singer?: CardModel;
        song?: CardModel;
        singers?: CardModel[];
    }): void;
    replaceTriggerSourceAndTarget(params?: {
        triggerSource?: CardModel;
        triggerTarget?: CardModel;
    }): void;
    meetTriggerConditions(): boolean;
    isValidTarget(target: CardModel, debug?: boolean): boolean;
    isValidTriggerTarget(targetParam?: CardModel, params?: IsValidTriggerParams, debug?: boolean): boolean;
    isValidTrigger(target?: CardModel, params?: IsValidTriggerParams): boolean;
    activate(target: CardModel, params?: IsValidTriggerParams & {
        playerId?: string;
        dynamicAmount?: number;
        skipAutoResolve?: boolean;
    }): void;
    toJSON(): {
        source: string;
        effects: Effect[];
        trigger: import("@lorcanito/lorcana-engine").Trigger;
        optional: boolean;
        layer: import("@lorcanito/lorcana-engine").ResolutionAbility;
    };
}
//# sourceMappingURL=TriggeredAbilityModel.d.ts.map