import { woodyJungleGuide } from "@tcg/lorcana-cards/cards/012";
import { hammPiggyBank } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug70WoodyEveryoneGatherRound = createFixture({
  id: "bug-70-woody-everyone-gather-round",
  name: "Bug 70 - Woody EVERYONE GATHER 'ROUND on free-played Toy",
  description:
    "P1 has Woody - Jungle Guide in play (ready, not drying) and a low-cost Toy (Hamm - Piggy Bank) in hand. P1's inkwell is 0 so the Toy can ONLY enter via Woody's LET'S GET MOVIN' free-play. Quest with Woody, accept the optional free-play prompt, and play Hamm. Bug: when Woody plays the Toy via LET'S GET MOVIN', the static EVERYONE GATHER 'ROUND +1 willpower buff for Toy characters isn't applied to the entering Toy. Correct behavior: Hamm enters with +1 willpower from Woody's static ability immediately on resolution.",
  playerOne: {
    play: [{ card: woodyJungleGuide, isDrying: false }],
    hand: [hammPiggyBank],
    inkwell: 0,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-70-woody-everyone-gather-round",
  skipPreGame: true,
});
