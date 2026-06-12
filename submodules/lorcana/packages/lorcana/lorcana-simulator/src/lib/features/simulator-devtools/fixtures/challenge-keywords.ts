import { createFixture } from "./fixture-factory";
import {
  captainHookForcefulDuelist,
  genieOnTheJob,
  hakunaMatata,
  mauiHeroToAll,
  reflection,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { daisyDuckDonaldsDate } from "@tcg/lorcana-cards/cards/005";
import { crikeeGoodLuckCharm } from "@tcg/lorcana-cards/cards/010";

export const challengeKeywordsFixture = createFixture({
  id: "challenge-keywords",
  name: "Challenge Keywords",
  description:
    "Testing challenge-related keywords: Alert, Bodyguard, Evasive, Challenger, Rush, Reckless",
  skipPreGame: true,
  playerOne: {
    inkwell: 8,
    hand: [mauiHeroToAll],
    play: [crikeeGoodLuckCharm, captainHookForcefulDuelist, stitchNewDog],
    deck: [reflection, hakunaMatata],
  },
  playerTwo: {
    play: [
      { card: genieOnTheJob, exerted: true },
      { card: simbaProtectiveCub, exerted: true },
      { card: daisyDuckDonaldsDate, exerted: true },
    ],
    deck: [reflection, hakunaMatata],
  },
});
