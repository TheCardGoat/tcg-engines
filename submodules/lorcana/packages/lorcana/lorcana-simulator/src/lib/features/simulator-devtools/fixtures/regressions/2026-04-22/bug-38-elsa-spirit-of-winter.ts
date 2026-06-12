import { elsaSpiritOfWinter } from "@tcg/lorcana-cards/cards/001";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug38ElsaSpiritOfWinterFixture = createFixture({
  id: "bug-38-elsa-spirit-of-winter",
  name: "Bug 38 - Elsa Spirit of Winter with no freeze targets",
  description:
    "Elsa - Spirit of Winter in hand with ink to play, but the opposing side has no characters in play. Exercises the DEEP FREEZE trigger against an empty target pool (skip-available path).",
  playerOne: {
    hand: [elsaSpiritOfWinter],
    inkwell: 8,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
  },
  playerTwo: {
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
  },
  seed: "bug-38-elsa-spirit-of-winter",
  skipPreGame: true,
});
