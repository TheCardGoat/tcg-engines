import { theBlackCauldronEnchanted } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiRespectedLeader, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug06BlackCauldron = createFixture({
  id: "bug-06-black-cauldron",
  name: "Bug 06 - The Black Cauldron with Cards Under",
  description:
    "The Black Cauldron item in play with two face-up character cards placed under it. Sufficient ink to allow QA to activate the item and play out the characters from under it.",
  playerOne: {
    play: [
      {
        card: theBlackCauldronEnchanted,
        cardsUnder: [
          { card: peteBadGuy, publicFaceState: "faceUp" as const },
          { card: chiefTuiRespectedLeader, publicFaceState: "faceUp" as const },
        ],
      },
    ],
    hand: [heiheiBoatSnack],
    inkwell: 10,
    deck: 10,
  },
  playerTwo: {
    deck: 10,
  },
  seed: "bug-06-black-cauldron",
  skipPreGame: true,
});
