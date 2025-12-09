type PlayerId = string;
type CardInstanceId = string;
interface StoreInterface {
    shuffleDeck: (playerId: string) => unknown;
    startGame: (playerId: string) => unknown;
    drawInitialHands: () => unknown;
    alterHand: (cards: string[], player: PlayerId) => unknown;
}
export interface GameContext {
    startingPlayer: PlayerId;
    pendingAlteringHand: PlayerId[];
    stateManager: StoreInterface;
    alteredCards: Record<PlayerId, number>;
}
type GameEvent = {
    type: "CHOOSE_FIRST_PLAYER";
    order: PlayerId[];
} | {
    type: "ALTER_HANDS";
    playerId: PlayerId;
    cards: CardInstanceId[];
};
export declare function createGameStartMachine({ initialState, initialContext, }?: {
    initialState?: string;
    initialContext?: GameContext;
}): import("xstate").StateMachine<GameContext, GameEvent, {}, never, import("xstate").Values<{
    chooseFirstPlayer: {
        type: "chooseFirstPlayer";
        params: unknown;
    };
    alterHand: {
        type: "alterHand";
        params: unknown;
    };
    initialize: {
        type: "initialize";
        params: unknown;
    };
    startGame: {
        type: "startGame";
        params: unknown;
    };
    shuffleDecks: {
        type: "shuffleDecks";
        params: unknown;
    };
    drawInitialHands: {
        type: "drawInitialHands";
        params: unknown;
    };
}>, {
    type: "allPlayersDecided";
    params: unknown;
}, never, "choosingFirstPlayer" | "alteringHands" | "gameStarted", string, {}, {}, import("xstate").EventObject, import("xstate").MetaObject, {
    readonly id: "matchStart";
    readonly initial: string;
    readonly context: GameContext;
    readonly states: {
        readonly choosingFirstPlayer: {
            readonly entry: "initialize";
            readonly exit: readonly ["shuffleDecks", "drawInitialHands"];
            readonly on: {
                readonly CHOOSE_FIRST_PLAYER: {
                    readonly target: "alteringHands";
                    readonly actions: readonly ["chooseFirstPlayer"];
                };
            };
        };
        readonly alteringHands: {
            readonly on: {
                readonly ALTER_HANDS: readonly [{
                    readonly target: "gameStarted";
                    readonly actions: "alterHand";
                    readonly guard: "allPlayersDecided";
                }, {
                    readonly target: "alteringHands";
                    readonly actions: "alterHand";
                }];
            };
        };
        readonly gameStarted: {
            readonly entry: "startGame";
            readonly type: "final";
        };
    };
}>;
export declare const gameStartMachine: import("xstate").StateMachine<GameContext, GameEvent, {}, never, import("xstate").Values<{
    chooseFirstPlayer: {
        type: "chooseFirstPlayer";
        params: unknown;
    };
    alterHand: {
        type: "alterHand";
        params: unknown;
    };
    initialize: {
        type: "initialize";
        params: unknown;
    };
    startGame: {
        type: "startGame";
        params: unknown;
    };
    shuffleDecks: {
        type: "shuffleDecks";
        params: unknown;
    };
    drawInitialHands: {
        type: "drawInitialHands";
        params: unknown;
    };
}>, {
    type: "allPlayersDecided";
    params: unknown;
}, never, "choosingFirstPlayer" | "alteringHands" | "gameStarted", string, {}, {}, import("xstate").EventObject, import("xstate").MetaObject, {
    readonly id: "matchStart";
    readonly initial: string;
    readonly context: GameContext;
    readonly states: {
        readonly choosingFirstPlayer: {
            readonly entry: "initialize";
            readonly exit: readonly ["shuffleDecks", "drawInitialHands"];
            readonly on: {
                readonly CHOOSE_FIRST_PLAYER: {
                    readonly target: "alteringHands";
                    readonly actions: readonly ["chooseFirstPlayer"];
                };
            };
        };
        readonly alteringHands: {
            readonly on: {
                readonly ALTER_HANDS: readonly [{
                    readonly target: "gameStarted";
                    readonly actions: "alterHand";
                    readonly guard: "allPlayersDecided";
                }, {
                    readonly target: "alteringHands";
                    readonly actions: "alterHand";
                }];
            };
        };
        readonly gameStarted: {
            readonly entry: "startGame";
            readonly type: "final";
        };
    };
}>;
export {};
//# sourceMappingURL=matchStartMachine.d.ts.map