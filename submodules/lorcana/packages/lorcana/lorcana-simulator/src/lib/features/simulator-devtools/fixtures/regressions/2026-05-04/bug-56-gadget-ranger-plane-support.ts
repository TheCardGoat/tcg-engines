import { gadgetHackwrenchResourcefulMechanic, rangerPlane } from "@tcg/lorcana-cards/cards/012";
import {
  heiheiBoatSnack,
  chiefTuiRespectedLeader,
  belleStrangeButSpecial,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug56GadgetRangerPlaneSupport = createFixture({
  id: "bug-56-gadget-ranger-plane-support",
  name: "Bug 56 - Gadget + Ranger Plane Support stacking",
  description:
    "P1 has Ranger Plane (AIR SUPPORT: your characters gain Support) + Gadget Hackwrench (WELL SUPPLIED: your characters with Support get +1 {L}) + three vanilla characters (HeiHei, Chief Tui, Belle) that do not natively have Support. Inspect each non-Gadget character. They should display the Support keyword (granted by Ranger Plane) AND their printed {L} +1 (granted by Gadget). Bug: WELL SUPPLIED's static filter does not see Support gained from Ranger Plane's static AIR SUPPORT, so the +1 {L} buff is missing. Correct behavior: HeiHei reads 2 {L}, Chief Tui reads 3 {L}, Belle reads 4 {L} (each +1 over base).",
  playerOne: {
    play: [
      rangerPlane,
      { card: gadgetHackwrenchResourcefulMechanic, isDrying: false },
      { card: heiheiBoatSnack, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
      { card: belleStrangeButSpecial, isDrying: false },
    ],
    hand: [],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-56-gadget-ranger-plane-support",
  skipPreGame: true,
});
