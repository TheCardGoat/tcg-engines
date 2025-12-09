import { type MobXRootStore } from "@lorcanito/lorcana-engine";
import type { FloatingTriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { IsValidTriggerParams } from "@lorcanito/lorcana-engine/store/resolvers/triggerResolver";
export declare class FloatingTriggeredAbilityModel {
    cardSource: CardModel;
    id: string;
    readonly type: "floating-triggered";
    duration: number;
    layer: FloatingTriggeredAbility["layer"];
    trigger: FloatingTriggeredAbility["trigger"];
    optional: FloatingTriggeredAbility["optional"];
    responder?: FloatingTriggeredAbility["responder"];
    text?: FloatingTriggeredAbility["text"];
    name?: FloatingTriggeredAbility["name"];
    cost?: FloatingTriggeredAbility["costs"];
    conditions?: FloatingTriggeredAbility["conditions"];
    private readonly rootStore;
    private readonly observable;
    constructor(id: string, ability: FloatingTriggeredAbility, source: CardModel, duration: number, rootStore: MobXRootStore, observable: boolean);
    sync(ability: FloatingTriggeredAbility): void;
    replaceTriggerSourceAndTarget(): void;
    activate(target: CardModel, params?: IsValidTriggerParams & {
        playerId?: string;
        dynamicAmount?: number;
        skipAutoResolve?: boolean;
    }): void;
    isValidTrigger(target?: CardModel, params?: IsValidTriggerParams): boolean;
    isValidTarget(target: CardModel): boolean;
    replaceDynamicTargets(params: IsValidTriggerParams): void;
    meetTriggerConditions(): boolean;
    isValidTriggerTarget(target?: CardModel, params?: unknown, debug?: boolean): boolean;
    toJSON(): FloatingTriggeredAbility;
}
//# sourceMappingURL=FloatingTriggeredAbilityModel.d.ts.map