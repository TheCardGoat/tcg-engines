import { broadwaySturdyAndStrong } from "@tcg/lorcana-cards/cards/010";
import { castleWyvernAboveTheClouds } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug44BroadwayBodyguardLocationFixture = createFixture({
  id: "bug-44-broadway-bodyguard-location",
  name: "Bug 44 - Bodyguard + location challengeability",
  description:
    "Broadway - Sturdy and Strong (Bodyguard) in play alongside an owned location. Opposing side has a ready attacker so we can verify that locations can still be challenged directly despite the Bodyguard being present.",
  playerOne: {
    play: [broadwaySturdyAndStrong, castleWyvernAboveTheClouds],
    inkwell: 5,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
  },
  playerTwo: {
    play: [{ card: peteBadGuy, exerted: false }],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-44-broadway-bodyguard-location",
  skipPreGame: true,
});
