import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";
export declare class ZoneModel {
    zone: Zones;
    cards: CardModel[];
    ownerId: string;
    private rootStore;
    constructor(zone: Zones, cards: CardModel[], ownerId: string, rootStore: MobXRootStore, observable: boolean);
    sync(zone: string[] | undefined): void;
    toJSON(): string[];
    hasCard(card: CardModel): boolean;
    inkAvailable(): number;
    inkTotal(): number;
    addCard(card: CardModel, position?: "last" | "first"): void;
    removeCard(card: CardModel): void;
}
//# sourceMappingURL=ZoneModel.d.ts.map