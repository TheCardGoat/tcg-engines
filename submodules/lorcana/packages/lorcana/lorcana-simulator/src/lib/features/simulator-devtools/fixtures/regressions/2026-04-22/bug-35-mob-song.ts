import { theMobSong } from "@tcg/lorcana-cards/cards/004";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  chiefTuiRespectedLeader,
  donaldDuckStruttingHisStuff,
  grammaTalaStoryteller,
  mickeyMouseArtfulRogue,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug35MobSongFixture = createFixture({
  id: "bug-35-mob-song",
  name: "Bug 35 - The Mob Song multi-target selection",
  description:
    "The Mob Song in hand with 3+ valid opposing character targets for multi-target selection UI coverage.",
  playerOne: {
    hand: [theMobSong],
    inkwell: theMobSong.cost,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
  },
  playerTwo: {
    play: [
      peteBadGuy,
      chiefTuiRespectedLeader,
      grammaTalaStoryteller,
      donaldDuckStruttingHisStuff,
      mickeyMouseArtfulRogue,
    ],
    inkwell: 5,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-35-mob-song",
  skipPreGame: true,
});
