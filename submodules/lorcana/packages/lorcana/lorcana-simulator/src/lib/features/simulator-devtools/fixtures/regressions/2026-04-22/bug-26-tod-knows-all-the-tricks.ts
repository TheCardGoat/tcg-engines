import { todKnowsAllTheTricks, educationOrElimination } from "@tcg/lorcana-cards/cards/011";
import { donaldDuckStruttingHisStuff, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";
import { mulanArmoredFighter } from "@tcg/lorcana-cards/cards/004";

export const bug26TodKnowsAllTheTricks = createFixture({
  id: "bug-26-tod-knows-all-the-tricks",
  name: "Bug 26 – Tod Knows All the Tricks",
  description:
    "Opposing Tod – Knows All the Tricks (7-cost) exerted; active player has Education or Elimination in hand with ink to target him.",
  playerOne: {
    hand: [educationOrElimination, donaldDuckStruttingHisStuff],
    play: [todKnowsAllTheTricks],
    inkwell: 7,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy],
    play: [{ card: todKnowsAllTheTricks, exerted: true, damage: 1 }, mulanArmoredFighter],
    inkwell: 8,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-26-tod-knows-all-the-tricks",
  skipPreGame: true,
});
