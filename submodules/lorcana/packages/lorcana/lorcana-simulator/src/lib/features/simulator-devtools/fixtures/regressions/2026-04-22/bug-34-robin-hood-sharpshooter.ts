import { robinHoodSharpshooter } from "@tcg/lorcana-cards/cards/005";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  chiefTuiRespectedLeader,
  donaldDuckStruttingHisStuff,
  friendsOnTheOtherSide,
  grabYourSword,
  grammaTalaStoryteller,
  mickeyMouseArtfulRogue,
  minnieMouseBelovedPrincess,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";
import { woodyJungleGuide } from "@tcg/lorcana-cards/cards/012";

export const bug34RobinHoodSharpshooterFixture = createFixture({
  id: "bug-34-robin-hood-sharpshooter",
  name: "Bug 34 - Robin Hood Sharpshooter / Steel Boost",
  description:
    "Robin Hood - Sharpshooter in hand with ink to play and multiple opposing targets so the 2-target selection UI can be exercised.",
  playerOne: {
    play: [robinHoodSharpshooter],
    inkwell: 7,
    deck: [
      mickeyMouseArtfulRogue,
      donaldDuckStruttingHisStuff,
      grammaTalaStoryteller,
      friendsOnTheOtherSide,
      grabYourSword,
      woodyJungleGuide,
      minnieMouseBelovedPrincess,
    ],
  },
  playerTwo: {
    play: [peteBadGuy, chiefTuiRespectedLeader, grammaTalaStoryteller],
    inkwell: 5,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-34-robin-hood-sharpshooter",
  skipPreGame: true,
});
