import { CardRepository } from "../card/card-repository-factory";
import type { CoreCardInstance } from "../card/core-card-instance";
import type { CoreEngineState, GameDefinition } from "../game-configuration";
import type { Move } from "../move/move-types";
import type { CoreCtx } from "../state/context";
import type { BaseCoreCardFilter, GameSpecificCardDefinition, GameSpecificGameState, GameSpecificPlayerState } from "../types/game-specific-types";
import { CoreEngine } from "./core-engine";
export interface TestCardDefinition extends GameSpecificCardDefinition {
    id: string;
    name: string;
    cost: number;
}
export type TestCardInstance = CoreCardInstance<TestCardDefinition>;
export interface TestGameState extends GameSpecificGameState {
    players: Record<string, TestPlayerState>;
    testValue?: string;
    coreOpsModified?: boolean;
    gameOpsModified?: boolean;
    directModified?: boolean;
}
export interface TestPlayerState extends GameSpecificPlayerState {
    id: string;
    name: string;
    lore: number;
}
export interface TestCardFilter extends BaseCoreCardFilter {
    cost?: number;
}
export type TestMove = Move<TestGameState, TestCardDefinition, TestPlayerState, TestCardFilter, TestCardInstance, TestCoreEngine>;
export declare class TestCardRepository extends CardRepository<TestCardDefinition> {
    constructor(cards: TestCardDefinition[], dictionary: Record<string, Record<string, string>>);
    getCard(id: string): TestCardDefinition | undefined;
    getCards(ids: string[]): (TestCardDefinition | undefined)[];
}
export declare const testCard: TestCardDefinition;
export declare const testGame: GameDefinition<TestGameState>;
type TestEngineOpts = {
    debug?: boolean;
};
export declare class TestCoreEngine {
    readonly authoritativeEngine: CoreEngine<TestGameState, TestCardDefinition, TestPlayerState, TestCardFilter, TestCardInstance>;
    readonly playerOneEngine: CoreEngine<TestGameState, TestCardDefinition, TestPlayerState, TestCardFilter, TestCardInstance>;
    readonly playerTwoEngine: CoreEngine<TestGameState, TestCardDefinition, TestPlayerState, TestCardFilter, TestCardInstance>;
    activePlayerEngine: string;
    constructor(opts?: TestEngineOpts);
    get activeEngine(): CoreEngine<TestGameState, TestCardDefinition, TestPlayerState, TestCardFilter, TestCardInstance>;
    getState(): CoreEngineState<TestGameState> | null;
    getCtx(): CoreCtx;
    incrementTurnCount(): void;
    getTurnCount(): number;
}
export {};
//# sourceMappingURL=test-core-engine.d.ts.map