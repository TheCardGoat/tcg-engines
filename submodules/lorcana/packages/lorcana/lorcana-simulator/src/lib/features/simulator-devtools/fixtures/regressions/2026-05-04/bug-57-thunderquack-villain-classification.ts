import { theThunderquack } from "@tcg/lorcana-cards/cards/011";
import { mrIncredibleTakingOutTheTrash } from "@tcg/lorcana-cards/cards/012";
import { heiheiBoatSnack, chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug57ThunderquackVillainClassification = createFixture({
  id: "bug-57-thunderquack-villain-classification",
  name: "Bug 57 - Thunderquack Villain classification propagation",
  description:
    "P1 has The Thunderquack in play (VIGILANTE JUSTICE: all opposing characters gain the Villain classification) plus Mr. Incredible - Taking Out the Trash in hand with enough ink to play him. P2 has two non-Villain characters (HeiHei - Boat Snack, Chief Tui - Respected Leader). First inspect P2's characters and verify both display the Villain classification. Then play Mr. Incredible from P1's hand and confirm KA-POW! offers HeiHei or Chief Tui as legal targets for the 2-damage effect. Bug: Thunderquack's property-modification static does not actually add Villain to opposing characters at runtime, so KA-POW! finds no eligible targets and the prompt is skipped. Correct behavior: both P2 characters are valid Villain targets.",
  playerOne: {
    play: [theThunderquack],
    hand: [mrIncredibleTakingOutTheTrash],
    inkwell: 6,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [
      { card: heiheiBoatSnack, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "bug-57-thunderquack-villain-classification",
  skipPreGame: true,
});
