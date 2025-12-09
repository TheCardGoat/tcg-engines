import type { Abilities, Characteristics, LorcanitoCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { NumericComparison, StringComparison } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";
export type TriggerTargetFilter = {
    filter: "trigger";
    value: "source" | "target";
};
export type TargetFilter = {
    filter: "location";
    value: "source";
} | {
    filter: "turn";
    value: "played" | "inkwell" | "challenge";
    targetFilter: [TargetFilter];
    comparison: NumericComparison;
} | {
    filter: "was-challenged";
} | {
    filter: "can";
    value: "challenge" | "sing" | "sing_song" | "shift";
} | {
    filter: "challenge";
    value: "attacker" | "defender";
} | {
    filter: "sing";
    value: "singer" | "song";
} | {
    filter: "source";
    value: "self" | "trigger" | "target" | "other";
} | TriggerTargetFilter | {
    filter: "instanceId";
    value: string | string[];
} | {
    filter: "publicId";
    value: string | string[];
} | {
    filter: "top-deck";
    value: "self" | "opponent";
} | {
    filter: "attribute";
    value: "cost" | "strength";
    ignoreBonuses?: boolean;
    comparison: NumericComparison;
} | {
    filter: "attribute";
    value: "inkwell";
    ignoreBonuses?: boolean;
    comparison: boolean;
} | {
    filter: "attribute";
    value: "name" | "title";
    ignoreBonuses?: boolean;
    comparison: StringComparison;
} | {
    filter: "attribute";
    value: "instanceId";
    ignoreBonuses?: boolean;
    comparison: StringComparison;
} | {
    filter: "owner";
    value: "self" | "opponent" | string;
} | {
    filter: "name-a-card";
    value?: "name";
    comparison?: StringComparison;
} | {
    filter: "status";
    value: "ready" | "exerted" | "dry" | "damaged" | "at-location" | "has-card-under";
    negate?: boolean;
} | {
    filter: "status";
    value: "damage";
    comparison: NumericComparison;
    negate?: boolean;
} | {
    filter: "zone";
    value: Zones | Array<Zones>;
} | {
    filter: "ability";
    value: Abilities;
    negate?: boolean;
} | {
    filter: "characteristics";
    value: Characteristics[];
    conjunction?: "and" | "or";
    negate?: boolean;
} | {
    filter: "type";
    value: LorcanitoCard["type"] | Array<LorcanitoCard["type"]>;
    negate?: boolean;
};
export declare const challengeOpponentsCardsFilter: TargetFilter[];
export declare const readyCharacterOfYours: TargetFilter[];
export declare const enterLocationCardsFilter: TargetFilter[];
export declare const singASongFilter: TargetFilter[];
export declare const canSingTogetherFilter: TargetFilter[];
export declare const shiftCharFilter: (card?: LorcanitoCard) => TargetFilter[];
export declare function canSingFilter(song: LorcanitoCard): TargetFilter[];
export type FilterId = "owner" | "zone" | "status" | "keyword" | "type";
//# sourceMappingURL=filters.d.ts.map