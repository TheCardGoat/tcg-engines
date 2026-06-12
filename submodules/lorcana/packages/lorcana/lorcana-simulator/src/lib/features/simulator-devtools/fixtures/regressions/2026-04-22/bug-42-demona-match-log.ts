import { demonaScourgeOfTheWyvernClan } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  donaldDuckStruttingHisStuff,
  grammaTalaStoryteller,
  chiefTuiRespectedLeader,
  partOfYourWorld,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug42DemonaMatchLogFixture = createFixture({
  id: "bug-42-demona-match-log",
  name: "Bug 42 - Demona / Genie draws in match log",
  description:
    "Demona - Scourge of the Wyvern Clan in play and ready to trigger. Deck is stacked with visible cards so draw counts in the match log can be verified.",
  playerOne: {
    play: [{ card: demonaScourgeOfTheWyvernClan, exerted: false }],
    inkwell: 6,
    deck: [
      donaldDuckStruttingHisStuff,
      grammaTalaStoryteller,
      chiefTuiRespectedLeader,
      partOfYourWorld,
    ],
    hand: [],
  },
  playerTwo: {
    play: [peteBadGuy],
    inkwell: 3,
    deck: [
      donaldDuckStruttingHisStuff,
      grammaTalaStoryteller,
      chiefTuiRespectedLeader,
      partOfYourWorld,
    ],
    hand: [],
  },
  seed: "bug-42-demona-match-log",
  skipPreGame: true,
});
