import type { LorcanitoCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { Match, Table, TableCard } from "@lorcanito/lorcana-engine/types/types";
export type DeckCard = {
    publicId: string;
    qty: number;
    card: LorcanitoCard;
};
export type Deck = Array<DeckCard>;
export type GameLobby = {
    id: string;
    name: string;
    gameId: string;
    ownerId: string;
    messageId?: string;
    visibility: "public" | "private";
    players?: Record<string, boolean>;
    deckLists?: Record<string, string>;
    lastActivity?: string;
    wonDieRoll?: string | null;
    gameStarted: boolean;
};
export declare const createShortAndUniqueIds: (size: number) => string[];
export declare const createCards: (deck: Array<{
    publicId: string;
    qty: number;
}>, ownerId: string, uniqueIds?: string[]) => Record<string, TableCard>;
export declare function loadParsedDeckList(deckLists?: Record<string, Array<{
    publicId: string;
    qty: number;
}>>): {
    deckCards: Record<string, TableCard>;
};
export declare function createTablesFromCards(cards: Record<string, TableCard>): Record<string, Table>;
export declare function createTableFromCards(cards?: Record<string, TableCard>): Table;
export declare function recreateTable(sourceTable?: Table): Table;
export declare function createTable(): Table;
export declare function createEmptyMatch(matchId: string, gameId: string, seed: string, choosingFirstPlayer: string, players?: string[]): Match;
export declare function createMatch(matchId: string, gameId: string, cards: Record<string, TableCard>, choosingFirstPlayer: string): Match;
export declare function createEmptyGameLobby(id: string, gameId: string, name: string, userId?: string, lastActivity?: string, visibility?: "public" | "private"): GameLobby;
//# sourceMappingURL=game.d.ts.map