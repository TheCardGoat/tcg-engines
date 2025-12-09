import type { MoveResponse } from "@lorcanito/lorcana-engine";
import type { CardStore } from "@lorcanito/lorcana-engine/store/CardStore";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { ZoneModel } from "@lorcanito/lorcana-engine/store/models/ZoneModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { CardMovement, Table, TableTurn, Zones } from "@lorcanito/lorcana-engine/types/types";
type TurnChallengeMeta = {
    damage: number;
    banished: boolean;
};
export type Turn = {
    cardsMoved: Array<CardMovement>;
    challenges: Array<{
        attacker: CardModel;
        defender: CardModel;
        meta: {
            defender: TurnChallengeMeta;
            attacker: TurnChallengeMeta;
        };
    }>;
    damages: Record<string, boolean>;
    locations: Record<string, CardModel[]>;
    quests: TableTurn["quests"];
    abilities: TableTurn["abilities"];
};
export declare class TableModel {
    zones: Record<Zones, ZoneModel>;
    ownerId: string;
    lore: number;
    turn: Turn;
    private rootStore;
    constructor(zones: Record<Zones, ZoneModel>, ownerId: string, lore: number, turn: Turn, rootStore: MobXRootStore, observable: boolean);
    sync(table: Table): void;
    static fromTable(table: Table, ownerId: string, cardStore: CardStore, rootStore: MobXRootStore, observable?: boolean): TableModel;
    toJSON(): Table;
    canPayInkCost(card: CardModel, params?: {
        shift?: number;
        byPass?: number;
    }): boolean;
    resetTurn(): void;
    canAddToInkwell(): boolean;
    get opponentHasDonalDuckFlutteringWizard(): boolean;
    hasChallengedThisTurn(glimmer: CardModel): boolean;
    hasUsedAbility(name: string, sourceId: string): boolean;
    addUsedAbility(name: string, sourceId: string): void;
    cardMoved(movement: CardMovement): void;
    inkAvailable(): number;
    moveCard(card: CardModel, to: Zones, position?: "first" | "last", skipLog?: boolean, discard?: boolean, attacker?: CardModel, defender?: CardModel, effectSource?: CardModel, opts?: {
        triggerDraw?: boolean;
        movedHow?: CardMovement["how"];
        isPrivate?: boolean;
    }): MoveResponse;
    onEnterLocation(character: CardModel, location: CardModel, previousLocation?: CardModel): void;
    onQuest(character: CardModel): void;
    onDamage(card: CardModel, damageDealt: number): void;
    removeDuplicates(card: CardModel, ignoreZone: Zones): void;
    updateLore(lore: number): MoveResponse;
}
export {};
//# sourceMappingURL=TableModel.d.ts.map