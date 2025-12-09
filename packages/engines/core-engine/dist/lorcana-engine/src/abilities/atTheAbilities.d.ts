import type { Cost, Effect, ResolutionAbility, TriggeredAbility } from "@lorcanito/lorcana-engine";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
export declare const atTheEndOfTurnLayer: (params: {
    name?: string;
    text?: string;
    optional?: boolean;
    layer: ResolutionAbility;
    conditions?: Condition[];
    secondaryConditions?: Condition[];
    target: EffectTargets;
}) => TriggeredAbility;
export declare const atTheStartOfYourTurnLayer: (params: {
    name?: string;
    text?: string;
    optional?: boolean;
    doesItTriggerFromDiscard?: boolean;
    layer: ResolutionAbility;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const atTheEndOfOpponentTurn: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
    responder?: ResolutionAbility["responder"];
}) => TriggeredAbility;
export declare const atTheEndOfYourTurn: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
    secondaryConditions?: Condition[];
}) => TriggeredAbility;
export declare const atTheStartOfYourTurn: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    doesItTriggerFromDiscard?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
    resolutionConditions?: Condition[];
    dependentEffects?: boolean;
}) => TriggeredAbility;
//# sourceMappingURL=atTheAbilities.d.ts.map