import { vincenzoSantoriniTheExplosivesExpert } from "@tcg/lorcana-cards/cards/008";
import { donaldDuckStruttingHisStuff, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiProudOfMotunui } from "@tcg/lorcana-cards/cards/003";
import { createFixture } from "../../fixture-factory.js";

export const bug33VincenzoSantorini = createFixture({
  id: "bug-33-vincenzo-santorini",
  name: "Bug 33 – Vincenzo Santorini",
  description:
    "Vincenzo Santorini – The Explosives Expert in the active player's hand with an opposing character in play to target on enter-play.",
  playerOne: {
    hand: [vincenzoSantoriniTheExplosivesExpert, donaldDuckStruttingHisStuff],
    inkwell: 8,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy],
    play: [chiefTuiProudOfMotunui],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-33-vincenzo-santorini",
  skipPreGame: true,
});
