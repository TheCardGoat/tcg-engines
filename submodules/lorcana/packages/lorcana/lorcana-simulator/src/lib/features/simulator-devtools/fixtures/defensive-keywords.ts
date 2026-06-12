import { createFixture } from "./fixture-factory";
import {
  donaldDuckStruttingHisStuff,
  fireTheCannons,
  hakunaMatata,
  letItGo,
  plasmaBlaster,
  reflection,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { rajahGhostlyTiger } from "@tcg/lorcana-cards/cards/007";
import { eeyoreOverstuffedDonkey } from "@tcg/lorcana-cards/cards/009";

export const defensiveKeywordsFixture = createFixture({
  id: "defensive-keywords",
  name: "Defensive Keywords",
  description: "Testing defensive keywords: Ward, Vanish, Resist",
  skipPreGame: true,
  playerOne: {
    inkwell: 6,
    hand: [fireTheCannons, letItGo],
    play: [plasmaBlaster, stitchNewDog],
    deck: [reflection, hakunaMatata],
  },
  playerTwo: {
    play: [donaldDuckStruttingHisStuff, rajahGhostlyTiger, eeyoreOverstuffedDonkey],
    deck: [reflection, hakunaMatata],
  },
});
