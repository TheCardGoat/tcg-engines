import { mickeyMouseBobCratchit, ohanaMeansFamily } from "@tcg/lorcana-cards/cards/011";
import {
  belleStrangeButSpecial,
  heiheiBoatSnack,
  donaldDuckStruttingHisStuff,
  chiefTuiRespectedLeader,
  grammaTalaStoryteller,
  partOfYourWorld,
  goofyDaredevil,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug11OhanaMeansFamily = createFixture({
  id: "bug-11-ohana-means-family",
  name: "Bug 11 - Ohana Means Family",
  description:
    "Ohana Means Family action in hand with enough ink. A friendly character (Belle) is in play with several damage counters so the action removes all damage and draws that many cards. Deck is stacked so QA can observe the draws resolve.",
  playerOne: {
    play: [
      { card: belleStrangeButSpecial, damage: 4 },
      { card: mickeyMouseBobCratchit, damage: 1 },
    ],
    hand: [ohanaMeansFamily],
    inkwell: 3,
    deck: [
      donaldDuckStruttingHisStuff,
      chiefTuiRespectedLeader,
      grammaTalaStoryteller,
      partOfYourWorld,
      heiheiBoatSnack,
    ],
  },
  playerTwo: {
    play: [{ card: goofyDaredevil, damage: 1 }],
    deck: 10,
  },
  seed: "bug-11-ohana-means-family",
  skipPreGame: true,
});
