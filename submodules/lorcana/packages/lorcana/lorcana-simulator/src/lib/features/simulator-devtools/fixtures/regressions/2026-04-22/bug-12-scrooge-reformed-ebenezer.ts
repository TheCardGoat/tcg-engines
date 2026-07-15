import { belleStrangeButSpecial, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  chiefTuiProudOfMotunui,
  grammaTalaKeeperOfAncientStories,
  heiheiAccidentalExplorer,
} from "@tcg/lorcana-cards/cards/003";
import { scroogeMcduckReformedEbenezer } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "../../fixture-factory.js";

export const bug12ScroogeReformedEbenezer = createFixture({
  id: "bug-12-scrooge-reformed-ebenezer",
  name: "Bug 12 - Scrooge McDuck, Reformed Ebenezer",
  description:
    "NOT FIXED. Scrooge in hand with multiple friendly characters in play and deck stacked for put-under interaction. QA should attempt to play Scrooge and observe missing/incorrect behavior.",
  playerOne: {
    hand: [scroogeMcduckReformedEbenezer],
    play: [belleStrangeButSpecial, chiefTuiProudOfMotunui, heiheiAccidentalExplorer],
    inkwell: 10,
    deck: [
      heiheiBoatSnack,
      peteBadGuy,
      grammaTalaKeeperOfAncientStories,
      chiefTuiProudOfMotunui,
      belleStrangeButSpecial,
    ],
  },
  playerTwo: {
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-12-scrooge-reformed-ebenezer",
  skipPreGame: true,
});
