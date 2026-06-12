import { tinkerBellGiantFairy } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug37TinkerBellGiantFairyFixture = createFixture({
  id: "bug-37-tinker-bell-giant-fairy",
  name: "Bug 37 - Tinker Bell Giant Fairy lone-target banish",
  description:
    "Tinker Bell - Giant Fairy in play with exactly one opposing character available so the banish-trigger selection path is exercised with a single legal target (graceful no-op verification).",
  playerOne: {
    play: [tinkerBellGiantFairy],
    inkwell: 6,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
  },
  playerTwo: {
    play: [{ card: peteBadGuy, exerted: true }],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-37-tinker-bell-giant-fairy",
  skipPreGame: true,
});
