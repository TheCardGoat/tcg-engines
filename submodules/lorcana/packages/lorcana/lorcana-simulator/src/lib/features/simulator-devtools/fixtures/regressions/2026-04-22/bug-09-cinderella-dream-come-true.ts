import { cinderellaDreamComeTrue } from "@tcg/lorcana-cards/cards/010";
import {
  belleStrangeButSpecial,
  arielOnHumanLegs,
  heiheiBoatSnack,
  donaldDuckStruttingHisStuff,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug09CinderellaDreamComeTrue = createFixture({
  id: "bug-09-cinderella-dream-come-true",
  name: "Bug 09 - Cinderella Dream Come True",
  description:
    "Cinderella - Dream Come True ready in play. Hand contains Princess characters (Belle, Ariel) and a non-Princess character (Heihei) plus an action so QA can verify that WHATEVER YOU WISH FOR only triggers on turns a Princess was played.",
  playerOne: {
    play: [{ card: cinderellaDreamComeTrue, exerted: false }],
    hand: [belleStrangeButSpecial, arielOnHumanLegs, heiheiBoatSnack, donaldDuckStruttingHisStuff],
    inkwell: 6,
    deck: 10,
  },
  playerTwo: {
    deck: 10,
  },
  seed: "bug-09-cinderella-dream-come-true",
  skipPreGame: true,
});
