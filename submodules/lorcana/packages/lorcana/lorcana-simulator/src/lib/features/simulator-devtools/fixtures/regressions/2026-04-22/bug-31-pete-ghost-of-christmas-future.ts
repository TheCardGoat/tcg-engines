import { peteGhostOfChristmasFuture } from "@tcg/lorcana-cards/cards/011";
import { donaldDuckStruttingHisStuff, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiProudOfMotunui } from "@tcg/lorcana-cards/cards/003";
import { createFixture } from "../../fixture-factory.js";

export const bug31PeteGhostOfChristmasFuture = createFixture({
  id: "bug-31-pete-ghost-of-christmas-future",
  name: "Bug 31 – Pete, Ghost of Christmas Future",
  description:
    "Pete – Ghost of Christmas Future in play with a card underneath (boosted) and ready to quest so we can exercise the quest/trigger flow when boosted.",
  playerOne: {
    hand: [donaldDuckStruttingHisStuff],
    play: [
      {
        card: peteGhostOfChristmasFuture,
        cardsUnder: [{ card: chiefTuiProudOfMotunui, publicFaceState: "faceDown" as const }],
      },
    ],
    inkwell: 7,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-31-pete-ghost-of-christmas-future",
  skipPreGame: true,
});
