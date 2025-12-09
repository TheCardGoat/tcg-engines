import { assign, setup } from "xstate";
export function createGameStartMachine({ initialState, initialContext, } = {}) {
    const initial = initialState || "choosingFirstPlayer";
    const context = initialContext || {
        startingPlayer: "",
        pendingAlteringHand: [],
        stateManager: {
            shuffleDeck: (playerId) => {
                throw new Error("Not implemented");
            },
            startGame: (playerId) => {
                throw new Error("Not implemented");
            },
            alterHand: (cards, player) => {
                throw new Error("Not implemented");
            },
            drawInitialHands: () => {
                throw new Error("Not implemented");
            },
        },
        alteredCards: {},
    };
    return setup({
        types: {
            context: {},
            events: {},
        },
        actions: {
            initialize: () => { },
            startGame: ({ context: { stateManager, startingPlayer } }) => {
                stateManager.startGame(startingPlayer);
            },
            shuffleDecks: ({ context }) => {
                for (const player of context.pendingAlteringHand) {
                    context.stateManager.shuffleDeck(player);
                }
            },
            drawInitialHands: ({ context }) => {
                context.stateManager.drawInitialHands();
            },
            chooseFirstPlayer: assign({
                startingPlayer: ({ context, event }) => {
                    if (event.type === "CHOOSE_FIRST_PLAYER") {
                        return event.order[0] || "SOMETHING_WENT_WRONG";
                    }
                    return context.startingPlayer;
                },
                pendingAlteringHand: ({ context, event }) => {
                    if (event.type === "CHOOSE_FIRST_PLAYER") {
                        return event.order;
                    }
                    return context.pendingAlteringHand;
                },
            }),
            alterHand: assign({
                pendingAlteringHand: ({ context, event }) => {
                    if (event.type === "ALTER_HANDS") {
                        const { cards, playerId } = event;
                        context.stateManager.alterHand(cards, playerId);
                        context.alteredCards[playerId] = cards.length;
                        return context.pendingAlteringHand.filter((player) => player !== playerId);
                    }
                    return context.pendingAlteringHand;
                },
            }),
        },
        guards: {
            allPlayersDecided: ({ context }) => context.pendingAlteringHand.length <= 1,
        },
    }).createMachine({
        id: "matchStart",
        initial,
        context,
        states: {
            choosingFirstPlayer: {
                entry: "initialize",
                exit: ["shuffleDecks", "drawInitialHands"],
                on: {
                    CHOOSE_FIRST_PLAYER: {
                        target: "alteringHands",
                        actions: ["chooseFirstPlayer"],
                    },
                },
            },
            alteringHands: {
                on: {
                    ALTER_HANDS: [
                        {
                            target: "gameStarted",
                            actions: "alterHand",
                            guard: "allPlayersDecided",
                        },
                        {
                            target: "alteringHands",
                            actions: "alterHand",
                        },
                    ],
                },
            },
            gameStarted: {
                entry: "startGame",
                type: "final",
            },
        },
    });
}
export const gameStartMachine = createGameStartMachine();
// 3.1. Starting a Game
// 3.1.1. Starting a game involves several steps that all players follow. Once these steps are completed, the game is considered to be started.
// 3.1.2. First, use a method for randomly determining who chooses who is the starting player and takes the first turn of the game. This can include rolling dice, flipping a coin, or other methods. If this game is next in a best-of series (such as a best-of-three), the losing player of the previous game chooses the starting player.
// 3.1.3. Second, each player randomizes (shuffles) their deck. Players may use any form of randomization they find convenient and comfortable, but the method chosen must sufficiently randomize the deck. Each player must offer an opposing player a chance to cut their deck after it’s shuffled. Once these steps are complete, the deck is ready to play and is placed in the play area.
// 3.1.4. Third, each player begins the game with 0 lore. Players may use any method for tracking their lore, such as pen and paper, lore trackers, or the official Disney Lorcana Trading Card Game Companion app.
// 3.1.5. Fourth, each player draws 7 cards.
// 3.1.6. Fifth, players may alter their hands, beginning with the starting player. Each player can alter their hand only once in each game, following the steps listed here.
// 3.1.6.1. Step 1 – The player selects any number of cards from their hand and places them on the bottom of their deck without revealing them.
// 3.1.6.2. Step 2 – The player draws until they have 7 cards in their hand.
// 3.1.6.3. Step 3 – In turn order, each other player completes steps 1 and 2 if they choose to alter their hand.
// 3.1.6.4. Step 4 – Each player who altered their hand by 1 or more cards shuffles their deck.
// 3.1.6.5. Step 5 – Each player who altered their hand offers an opposing player a chance to cut their deck. Note that some play events may allow additional randomizing methods or require specific ones.
// 3.1.7. Once all players have altered or chosen not to alter their hand, the game officially starts with the starting player’s Beginning Phase (see 4.2).
// 3.1.8. Certain formats and tournament policies may add to, remove from, or otherwise adjust these rules.
//# sourceMappingURL=matchStartMachine.js.map