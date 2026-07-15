import { mickeyMouseBraveLittleTailor } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  chiefTuiRespectedLeader,
  donaldDuckStruttingHisStuff,
  grammaTalaStoryteller,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";
import { mickeyMouseBraveLittlePrince } from "@tcg/lorcana-cards/cards/009";

export const bug40ResistCardsUnderFixture = createFixture({
  id: "bug-40-resist-cards-under",
  name: "Bug 40 - Resist / cards-under willpower interaction",
  description:
    "Mickey Mouse - Brave Little Tailor in play with a stacked cards-under arrangement so engine behaviour for willpower and cards-under can be inspected. No printed 'cards-under grants +Willpower' mechanism currently exists, so this fixture just wires a stack scenario; substitute with a +Willpower aura card when such a mechanic is added.",
  playerOne: {
    play: [
      {
        card: mickeyMouseBraveLittlePrince,
        cardsUnder: [
          { card: chiefTuiRespectedLeader, publicFaceState: "faceUp" as const },
          { card: grammaTalaStoryteller, publicFaceState: "faceUp" as const },
        ],
      },
    ],
    inkwell: 8,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
  },
  playerTwo: {
    play: [peteBadGuy],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-40-resist-cards-under",
  skipPreGame: true,
});
