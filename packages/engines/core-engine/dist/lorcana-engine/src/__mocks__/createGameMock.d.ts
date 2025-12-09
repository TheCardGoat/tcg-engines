import type { LorcanitoCard, LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { Match, TableCard, Zones } from "@lorcanito/lorcana-engine/types/types";
export declare const testCharacterCard: LorcanitoCharacterCard;
export type PartialRecord<K extends string, T> = {
    [P in K]?: T;
};
export type TestInitialState = PartialRecord<Zones, LorcanitoCard[] | number> & {
    lore?: number;
};
export declare function createMockMatch(playerState?: TestInitialState, opponentState?: TestInitialState, skipPreMatch?: boolean): {
    game: Match;
    cards: Record<string, TableCard>;
};
//# sourceMappingURL=createGameMock.d.ts.map