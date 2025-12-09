import { type ScryEffectPayload, type TargetFilter } from "@lorcanito/lorcana-engine";
import type { CardStore } from "@lorcanito/lorcana-engine/store/CardStore";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { TableModel } from "@lorcanito/lorcana-engine/store/models/TableModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies, MoveResponse } from "@lorcanito/lorcana-engine/store/types";
import type { CardMovement, Match, Table, Zones } from "@lorcanito/lorcana-engine/types/types";
export declare class TableStore {
    dependencies: Dependencies;
    tables: Record<string, TableModel>;
    cardStore: CardStore;
    rootStore: MobXRootStore;
    constructor(initialState: Record<string, TableModel>, dependencies: Dependencies, cardStore: CardStore, rootStore: MobXRootStore, observable: boolean);
    static fromTable(tables: Record<string, Table>, dependencies: Dependencies, cardStore: CardStore, rootStore: MobXRootStore, observable: boolean): TableStore;
    sync(tables: Match["tables"]): void;
    toJSON(): Match["tables"];
    get JSON(): Match["tables"];
    getTables(): TableModel[];
    get players(): string[];
    getTable(playerId?: string): TableModel;
    payInk(table: TableModel, amount: number): boolean;
    hasChallengedThisTurn(glimmer: CardModel): boolean;
    alterHand(cardsToAlter: string[], playerId: string): void;
    findCardZone(card: CardModel): string;
    getStackCards(): CardModel[];
    get getPendingEffects(): import("@lorcanito/lorcana-engine").StackLayerModel[];
    move(card: CardModel, to: Zones, opts?: {
        skipLog?: true;
        position?: "first" | "last";
        attacker?: CardModel;
        defender?: CardModel;
        discard?: boolean;
        isPrivate?: boolean;
    }): void;
    moveCard(instanceId: string, to: Zones, opts?: {
        skipLog?: boolean;
        position?: "first" | "last";
        attacker?: CardModel;
        defender?: CardModel;
        discard?: boolean;
        effectSource?: CardModel;
        isPrivate?: boolean;
        triggerDraw?: boolean;
        movedHow?: CardMovement["how"];
    }): MoveResponse;
    playCardFromHand(card: CardModel, params?: {
        bodyguard?: boolean;
    }): void;
    get allCardsMoved(): Record<string, CardMovement[]>;
    setPlayerLore(player: string, lore: number): MoveResponse;
    shuffleDeck(player: string): MoveResponse;
    scry(top?: CardModel[], bottom?: CardModel[], hand?: CardModel[], inkwell?: CardModel[], discard?: CardModel[], play?: CardModel[], tutorFilters?: TargetFilter[], playFilters?: TargetFilter[], limits?: ScryEffectPayload["limits"], shouldReveal?: boolean, playExerted?: boolean): MoveResponse;
    addToInkwell(instanceId: string): MoveResponse;
    getPlayerZone(ownerId: string, zone: Zones): import("./models/ZoneModel").ZoneModel;
    getPlayerZoneCards(ownerId: string, zone: Zones): CardModel[];
    getTopDeckCard(ownerId: string): CardModel;
    getBottomDeckCard(ownerId: string): CardModel;
    drawCards(ownerId: string, amount?: number, opts?: {
        skipLog?: boolean;
        effectSource?: CardModel;
    }): MoveResponse;
    discardCards(cards: CardModel[]): MoveResponse;
}
//# sourceMappingURL=TableStore.d.ts.map