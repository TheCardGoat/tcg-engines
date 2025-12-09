import { type CardModel, type Cost, type MobXRootStore } from "@lorcanito/lorcana-engine";
export declare function payCosts(costs: Cost[], targetCards: CardModel[], source: CardModel, rootStore: MobXRootStore, payingPlayer?: string): boolean;
export declare function canPayCosts(costs: Cost[], targetCards: CardModel[], source: CardModel, rootStore: MobXRootStore, payingPlayer?: string): boolean;
export declare function calculateShiftCostModifier(rootStore: MobXRootStore, cardModel: CardModel): number;
export declare function calculateCostModifier(rootStore: MobXRootStore, cardModel: CardModel): number;
//# sourceMappingURL=costResolver.d.ts.map