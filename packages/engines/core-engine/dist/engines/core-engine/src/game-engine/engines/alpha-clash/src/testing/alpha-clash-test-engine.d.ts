import type { AccessoryCard, AlphaClashCard, ClashCard, ClashgroundCard, ContenderCard } from "~/game-engine/engines/alpha-clash/src/cards/definitions/cardTypes";
import { AlphaClashEngine } from "../../alpha-clash-engine";
export type AlphaClashZoneType = "deck" | "hand" | "contender" | "clash" | "resource" | "accessory" | "clashground" | "oblivion" | "standby";
export type TestInitialState = Partial<{
    contender: ContenderCard;
    clashground: ClashgroundCard;
    clash: ClashCard[];
    accessory: AccessoryCard[];
    deck: number | AlphaClashCard[];
    hand: number | AlphaClashCard[];
    resource: number | AlphaClashCard[];
    oblivion: AlphaClashCard[];
    standby: AlphaClashCard[];
}>;
export type TestOptions = {
    skipPreGame?: boolean;
    debug?: boolean;
};
export declare class AlphaClashTestEngine {
    authoritativeEngine: AlphaClashEngine;
    playerOneEngine: AlphaClashEngine;
    playerTwoEngine: AlphaClashEngine;
    constructor(playerOneState?: TestInitialState, playerTwoState?: TestInitialState, options?: TestOptions);
    private createInitialState;
    private initializeCardZones;
    assertThatZonesContain(expectedState: TestInitialState, playerId: string): void;
    getGameSegment(): string;
    getGamePhase(): string;
}
//# sourceMappingURL=alpha-clash-test-engine.d.ts.map