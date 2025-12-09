import { type AbilityFilter, CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
import type { Dependencies, MoveResponse } from "@lorcanito/lorcana-engine/store/types";
import type { Game, ResolvingParam } from "@lorcanito/lorcana-engine/types/types";
export declare class CardStore {
    dependencies: Dependencies;
    cards: Record<string, CardModel>;
    temporary: Record<number, CardModel[]>;
    private readonly rootStore;
    private readonly observable;
    constructor(initialState: Game["cards"], dependencies: Dependencies, rootStore: MobXRootStore, observable: boolean);
    sync(): void;
    toJSON(): Record<string, unknown>;
    getCardIdsMapping(): Record<string, string>;
    getCardsIdsAndNames(): Record<string, string>;
    hasCard(instanceId?: string): boolean;
    getCard(instanceId?: string | null): CardModel | undefined;
    get getAllCards(): CardModel[];
    get characterCardsInPlay(): CardModel[];
    get locationsInPlay(): CardModel[];
    get locationCardsInPlay(): CardModel[];
    get cardsInPlay(): CardModel[];
    get cardsInDiscard(): CardModel[];
    get cardsInPlayAndDiscard(): CardModel[];
    get cardsInPlayYouOwn(): CardModel[];
    getCardsByTargetFilter(filters?: TargetFilter[], responder?: string, source?: CardModel, excludeSelf?: boolean, params?: ResolvingParam): CardModel[];
    getCardsByAbilityFilter(filters?: AbilityFilter[]): CardModel[];
    shiftCard(shifter: CardModel, shifted: CardModel, costs?: CardModel[]): MoveResponse;
    singCard(song: CardModel, singer: CardModel): MoveResponse;
    challenge(attackerId?: string, defenderId?: string): void;
    shuffleCardIntoDeck(instanceId: string): void;
    pickACardAtRandom(cards: CardModel[]): CardModel | undefined;
    getTemporaryCards(moveCount: number): CardModel[];
    addToTemporary(moveCount: number, card: CardModel): void;
    clearTemporary(): void;
}
//# sourceMappingURL=CardStore.d.ts.map