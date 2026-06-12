import { goofyKnightForADay } from "@tcg/lorcana-cards/cards/002";
import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";
import { meridaFormidableArcher } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const meridaMosquitoBitePutDamageRegression = createFixture({
  id: "merida-mosquito-bite-put-damage",
  name: "Merida + Mosquito Bite - Put Damage Is Not Deal Damage",
  description:
    "Visual validation for Merida - Formidable Archer and put-damage actions. P1 controls Merida and has Mosquito Bite in hand. Play Mosquito Bite targeting Goofy - Knight for a Day. Expected: Goofy has exactly 1 damage counter, and Merida's STEADY AIM does not create a pending trigger or add 2 extra damage.",
  skipPreGame: true,
  seed: "merida-mosquito-bite-put-damage",
  playerOne: {
    inkwell: mosquitoBite.cost,
    hand: [mosquitoBite],
    play: [{ card: meridaFormidableArcher, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: goofyKnightForADay, isDrying: false }],
    deck: 10,
    lore: 0,
  },
});
