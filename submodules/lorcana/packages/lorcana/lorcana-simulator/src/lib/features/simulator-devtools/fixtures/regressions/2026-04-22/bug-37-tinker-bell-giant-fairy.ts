import { tinkerBellGiantFairy } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug37TinkerBellGiantFairyFixture = createFixture({
  id: "bug-37-tinker-bell-giant-fairy",
  name: "Bug 37 - Tinker Bell Giant Fairy banish damage",
  description:
    "Tinker Bell - Giant Fairy can banish Pete in a challenge while Gramma Tala remains as the legal target for PUNY PIRATE!'s optional 2 damage.",
  playerOne: {
    play: [{ card: tinkerBellGiantFairy, isDrying: false }],
    inkwell: 6,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
  },
  playerTwo: {
    play: [
      { card: peteBadGuy, exerted: true, isDrying: false },
      { card: grammaTalaStoryteller, exerted: false, isDrying: false },
    ],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-37-tinker-bell-giant-fairy",
  skipPreGame: true,
});
