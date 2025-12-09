import type { TargetFilter } from "./targetFilters";
export type CardEffectTarget = {
    type: "card";
    value?: number | "all";
    excludeSelf?: boolean;
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
export type EffectTarget = CardEffectTarget | PlayerEffectTarget;
//# sourceMappingURL=targets.d.ts.map