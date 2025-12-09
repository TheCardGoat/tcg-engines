import type { LorcanitoCard } from "@lorcanito/lorcana-engine";
export type LorcanaCardDefinition = LorcanitoCard;
export type LorcanaGameState = {
    effects: LayerItem[];
    bag: LayerItem[];
    turnActions?: {
        putCardIntoInkwell?: boolean;
    };
};
export type Zone = "deck" | "hand" | "play" | "inkwell" | "discard" | "bag";
export type LayerItem = {
    id: string;
    sourceCardId: string;
    controllerId: string;
    ability: Ability;
    targets: Target[];
    timestamp: number;
    optional: boolean;
};
export type Ability = {
    id: string;
    type: "activated" | "triggered" | "static" | "keyword";
    text: string;
    cost?: AbilityCost;
    effect: Effect;
    timing?: TriggerTiming;
};
export type Duration = {
    type: "endOfTurn";
} | {
    type: "untilLeaves";
} | {
    type: "turns";
    count: number;
} | {
    type: "permanent";
};
export type AbilityCost = {
    exert?: boolean;
    ink?: number;
    banish?: boolean;
    discard?: number;
    damage?: number;
};
export type Effect = {
    type: string;
    parameters: Record<string, any>;
};
export type Target = {
    type: "card" | "player";
    id: string;
};
export type TriggerTiming = "onPlay" | "onQuest" | "onPutIntoInkwell" | "onChallenge" | "onBanish" | "onDamage" | "onMove" | "startOfTurn" | "endOfTurn";
export type ActionType = "playCard" | "inkCard" | "quest" | "challenge" | "activateAbility" | "move" | "sing" | "pass" | "concede" | "turnStart" | "turnEnd" | "phaseStep" | "phaseTransition" | "draw";
export type PlayerId = string;
export type InstanceId = string;
export type PublicId = string;
export type GameCards = Record<PlayerId, Record<InstanceId, PublicId>>;
//# sourceMappingURL=lorcana-engine-types.d.ts.map