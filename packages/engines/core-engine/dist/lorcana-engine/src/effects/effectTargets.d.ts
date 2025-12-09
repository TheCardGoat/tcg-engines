import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type { TargetFilter, TriggerTargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
export type CardEffectTarget = {
    type: "card";
    value: "all" | number | DynamicAmount;
    excludeSelf?: boolean;
    includeSelf?: boolean;
    upTo?: boolean;
    random?: boolean;
    filters: TargetFilter[];
};
export type PlayerEffectTarget = {
    type: "player";
    value: "self" | "opponent" | "all" | "target_owner" | "target";
} | {
    type: "player";
    value: "player_id";
    id: string;
};
export type EffectTargets = CardEffectTarget | PlayerEffectTarget;
export declare const cardEffectTargetPredicate: (target?: EffectTargets) => target is CardEffectTarget;
export declare const playerEffectTargetPredicate: (target?: EffectTargets) => target is PlayerEffectTarget;
export declare const challengeFilterPredicate: (filter?: TargetFilter) => filter is {
    filter: "challenge";
    value: "attacker" | "defender";
};
export declare const singFilterPredicate: (filter?: TargetFilter) => filter is {
    filter: "sing";
    value: "singer" | "song";
};
export declare const triggerFilterPredicate: (filter?: TargetFilter) => filter is TriggerTargetFilter;
//# sourceMappingURL=effectTargets.d.ts.map