import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { loseTheWay } from "@tcg/lorcana-cards/cards/006";
import { darkwingDuckCoolUnderPressure } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "../../fixture-factory.js";

export const loseTheWaySelectedFirstRegression = createFixture({
  id: "lose-the-way-selected-first",
  name: "Lose the Way - original character stays exerted",
  description:
    "Player report regression: play Lose the Way on Darkwing Duck, accept the optional discard, discard Mickey Mouse, then pass the turn. Darkwing Duck must remain exerted through Player Two's ready step; the discard card must not receive the ready restriction.",
  skipPreGame: true,
  seed: "lose-the-way-selected-first",
  playerOne: {
    inkwell: loseTheWay.cost,
    hand: [loseTheWay, mickeyMouseTrueFriend],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [{ card: darkwingDuckCoolUnderPressure, exerted: false }],
    deck: 10,
    lore: 0,
  },
});
