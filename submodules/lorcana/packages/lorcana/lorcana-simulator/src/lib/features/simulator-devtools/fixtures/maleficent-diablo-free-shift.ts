import { reflection } from "@tcg/lorcana-cards/cards/001";
import { aladdinBraveRescuer } from "@tcg/lorcana-cards/cards/004";
import { moanaDeterminedExplorer } from "@tcg/lorcana-cards/cards/005";
import { chipFriendIndeed } from "@tcg/lorcana-cards/cards/006";
import { baymaxGiantRobot } from "@tcg/lorcana-cards/cards/007";
import { daleBumbler } from "@tcg/lorcana-cards/cards/008";
import {
  maleficentDiabloEvilIncarnate,
  maleficentExultantSpellcaster,
} from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "./fixture-factory";

export const maleficentDiabloFreeShiftFixture = createFixture({
  id: "maleficent-diablo-free-shift",
  name: "Maleficent & Diablo Free Shift",
  description:
    "Visual validation for Maleficent & Diablo - Evil Incarnate: choose five character cards from discard, then choose Maleficent in play to shift onto for free.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [maleficentDiabloEvilIncarnate],
    play: [maleficentExultantSpellcaster],
    discard: [
      aladdinBraveRescuer,
      baymaxGiantRobot,
      chipFriendIndeed,
      daleBumbler,
      moanaDeterminedExplorer,
      reflection,
    ],
    deck: [reflection],
  },
  playerTwo: {
    inkwell: 0,
    hand: [],
    play: [],
    deck: [reflection],
  },
});
