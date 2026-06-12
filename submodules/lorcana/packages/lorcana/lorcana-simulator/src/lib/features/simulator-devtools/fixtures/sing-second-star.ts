import {
  goofyMusketeer,
  maximusPalaceHorse,
  princePhillipDragonslayer,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { secondStarToTheRightEnchanted } from "@tcg/lorcana-cards/cards/004";
import { createFixture } from "./fixture-factory";
import { tipoGrowingSon } from "@tcg/lorcana-cards/cards/005";
import { madHatterEccentricHost } from "@tcg/lorcana-cards/cards/006";

export const singSecondStarFixture = createFixture({
  id: "sing-second-star",
  name: "Sing Second Star (Enchanted)",
  description:
    "Reproduce the player report: try to sing Second Star to the Right (Enchanted) using characters that total 10+ cost. Player one has the enchanted song in hand and ready, dry singers in play. Also enough ink to hard-cast for comparison.",
  skipPreGame: true,
  playerOne: {
    inkwell: 10,
    hand: [secondStarToTheRightEnchanted, tipoGrowingSon],
    play: [
      madHatterEccentricHost,
      { card: goofyMusketeer, isDrying: false },
      { card: maximusPalaceHorse, isDrying: false },
      { card: princePhillipDragonslayer, isDrying: false },
      { card: simbaProtectiveCub, isDrying: false },
    ],
    deck: 20,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 20,
  },
});
