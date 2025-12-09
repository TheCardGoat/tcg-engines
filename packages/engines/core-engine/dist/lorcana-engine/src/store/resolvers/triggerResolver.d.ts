import { type Ability, type CardModel, type MobXRootStore, type Trigger, type TriggeredAbility, type Zones } from "@lorcanito/lorcana-engine";
import type { TriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/TriggeredAbilityModel";
export type IsValidTriggerParams = {
    isChallenge?: boolean;
    attacker?: CardModel;
    defender?: CardModel;
    song?: CardModel;
    location?: CardModel;
    previousLocation?: CardModel;
    singer?: CardModel;
    singers?: CardModel[];
    singing?: boolean;
    hasShifted?: boolean;
    damageSource?: CardModel;
    playerId?: string;
    destination?: Zones;
    from?: Zones;
    shifted?: CardModel;
    shifter?: CardModel;
    triggeredBy?: CardModel;
};
export declare function isValidTrigger(abilityModel: TriggeredAbilityModel, rootStore: MobXRootStore, target: CardModel, params?: IsValidTriggerParams): boolean;
export declare const onEndOfTurnPredicate: (ability?: Ability) => ability is TriggeredAbility;
export declare const startOfTurnPredicate: (ability?: Ability) => ability is TriggeredAbility;
export declare function getTriggerPredicate(trigger: Trigger["on"]): (ability: {
    trigger: Trigger;
}) => boolean;
//# sourceMappingURL=triggerResolver.d.ts.map