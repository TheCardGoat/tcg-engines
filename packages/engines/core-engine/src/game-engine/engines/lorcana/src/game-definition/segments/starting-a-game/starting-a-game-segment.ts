import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import type { LorcanaGameState } from "../../../lorcana-engine-types";
import { lorcanaMoves } from "../../../moves/moves";

// **3.1. Starting a Game**
// **3.1.1. **Starting a game involves several steps that all players fol ow. Once these steps are completed, the game is considered to be started.
// **3.1.2. **First, use a method for randomly determining who chooses who is the starting player and takes the first turn of the game. This can include rol ing dice, flipping a coin, or other methods. If this game is next in a best-of series \(such as a best-of-three\), the losing player of the previous game chooses the starting player.
// **3.1.3. **Second, each player randomizes \(shuffles\) their deck. Players may use any form of randomization they find convenient and comfortable, but the method chosen must sufficiently randomize the deck. Each player must offer an opposing player a chance to cut their deck after it’s shuffled. Once these steps are complete, the deck is ready to play and is placed in the play area.
// **3.1.4. **Third, each player begins the game with 0 lore. Players may use any method for tracking their lore, such as pen and paper, lore trackers, or the official *Disney Lorcana* Trading Card Game Companion app.
// **3.1.5. **Fourth, each player draws 7 cards.
// **3.1.6. **Fifth, players may alter their hands, beginning with the starting player. Each player can alter their hand only once in each game, following the steps listed here.
// **3.1.6.1. **Step 1 – The player selects any number of cards from their hand and places them on the bottom of their deck without revealing them.
// **3.1.6.2. **Step 2 – The player draws until they have 7 cards in their hand.
// **3.1.6.3. **Step 3 – In turn order, each other player completes steps 1 and 2 if they choose to alter their hand.
// **3.1.6.4. **Step 4 – Each player who altered their hand by 1 or more cards shuffles their deck.
// **3.1.6.5. **Step 5 – Each player who altered their hand offers an opposing player a chance to cut their deck. Note that some play events may al ow additional randomizing methods or require specific ones.
// **3.1.7. **Once all players have altered or chosen not to alter their hand, the game officially starts with the starting player’s Beginning Phase \(see 4.2\).
export const startingAGameSegment: SegmentConfig<LorcanaGameState> = {
  start: true,
  next: "duringGame",

  onBegin: ({ G, ctx, coreOps }) => {
    coreOps.setPendingMulligan(coreOps.getPlayers());

    return G;
  },

  onEnd: ({ G, ctx, coreOps }) => {
    // When the starting game segment ends, set both priority and turn player to the chosen first player
    if (ctx.otp) {
      coreOps.setPriorityPlayer(ctx.otp);
      coreOps.setTurnPlayer(ctx.otp);
    }

    // coreOps.setPendingMulligan([]);

    return G;
  },

  endIf: ({ ctx, coreOps }) => {
    if (ctx.otp === undefined) {
      return false;
    }

    return !ctx.pendingMulligan || ctx.pendingMulligan.size === 0;
  },

  turn: {
    phases: {
      chooseFirstPlayer: {
        start: true,
        next: "alterHand",

        endIf: ({ ctx }) => {
          return ctx.otp !== undefined;
        },

        moves: {
          chooseWhoGoesFirstMove: lorcanaMoves.chooseWhoGoesFirstMove,
        },
      },
      alterHand: {
        endIf: ({ ctx }) => {
          const totalPlayers = ctx.playerOrder.length;
          const playersWhoAltered = ctx.pendingMulligan?.size || 0;
          return playersWhoAltered >= totalPlayers;
        },

        onBegin: ({ G, ctx, coreOps }) => {
          // Set priority to the chosen first player when the alterHand phase begins
          // According to rule 3.1.6: "players may alter their hands, beginning with the starting player"
          if (ctx.otp) {
            coreOps.setPriorityPlayer(ctx.otp);
          }
          return G;
        },

        moves: {
          alterHand: lorcanaMoves.alterHand,
        },
      },
    },
  },
};
