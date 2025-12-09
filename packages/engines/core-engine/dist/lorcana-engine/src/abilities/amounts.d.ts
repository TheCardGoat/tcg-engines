import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
export interface DynamicAmount {
    dynamic: true;
    amount?: number;
    getAmountFromTrigger?: boolean;
    target?: {
        attribute: "strength" | "lore" | "damage" | "cost";
    };
    sourceAttribute?: "strength" | "lore" | "damage" | "chars-at-location";
    targetLocation?: {
        attribute: "lore";
    };
    excludeSelf?: boolean;
    filters?: TargetFilter[];
    filterMultiplier?: number;
    difference?: TargetFilter[] | number;
    targetFilterReducer?: "damage";
}
export declare const forEachItemYouHaveInPlay: DynamicAmount;
export declare const forEachCharYouHaveInPlay: DynamicAmount;
export declare const forEachCardInYourHand: DynamicAmount;
export declare const forEachCardInYourDiscard: DynamicAmount;
export declare const allCardsInYourDeck: DynamicAmount;
//# sourceMappingURL=amounts.d.ts.map