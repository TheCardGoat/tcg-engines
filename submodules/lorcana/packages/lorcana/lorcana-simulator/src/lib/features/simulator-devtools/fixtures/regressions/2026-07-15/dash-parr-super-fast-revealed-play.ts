import { dashParrDodgeballDynamo, dashParrSuperFast } from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "../../fixture-factory.js";

export const dashParrSuperFastRevealedPlayRegression = createFixture({
  id: "dash-parr-super-fast-revealed-play",
  name: "Dash Parr - Super Fast Revealed Play",
  description:
    "Visual validation for Follow Me!: quest Dash Parr - Super Fast, accept the reveal, choose Play, and Dash Parr - Dodgeball Dynamo moves directly from the revealed top card into play. The flow must not ask the player to select a card from hand.",
  skipPreGame: true,
  seed: "dash-parr-super-fast-revealed-play",
  playerOne: {
    inkwell: dashParrDodgeballDynamo.cost,
    hand: [],
    play: [{ card: dashParrSuperFast, isDrying: false }],
    deck: [dashParrDodgeballDynamo],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
});
