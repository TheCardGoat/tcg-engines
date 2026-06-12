import { donaldDuckPerfectGentleman } from "@tcg/lorcana-cards/cards/002";
import {
  heiheiBoatSnack,
  donaldDuckStruttingHisStuff,
  chiefTuiRespectedLeader,
  grammaTalaStoryteller,
  partOfYourWorld,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug07DonaldDuckPerfectGentleman = createFixture({
  id: "bug-07-donald-duck-perfect-gentleman",
  name: "Bug 07 - Donald Duck Perfect Gentleman",
  description:
    "Donald Duck - Perfect Gentleman ready in play for both players so QA can observe the ALLOW ME start-of-turn trigger offering each player a draw. Both decks are stacked so the draws are visible.",
  playerOne: {
    play: [{ card: donaldDuckPerfectGentleman, exerted: false }],
    hand: [heiheiBoatSnack],
    inkwell: 3,
    deck: [
      donaldDuckStruttingHisStuff,
      chiefTuiRespectedLeader,
      grammaTalaStoryteller,
      partOfYourWorld,
    ],
  },
  playerTwo: {
    play: [{ card: donaldDuckPerfectGentleman, exerted: false }],
    deck: [
      partOfYourWorld,
      grammaTalaStoryteller,
      chiefTuiRespectedLeader,
      donaldDuckStruttingHisStuff,
    ],
  },
  seed: "bug-07-donald-duck-perfect-gentleman",
  skipPreGame: true,
});
