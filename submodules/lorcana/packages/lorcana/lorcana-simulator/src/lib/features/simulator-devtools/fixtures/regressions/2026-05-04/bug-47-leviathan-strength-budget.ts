import { theLeviathanGuardianOfAtlantis } from "@tcg/lorcana-cards/cards/012";
import { befuddle } from "@tcg/lorcana-cards/cards/001";
import { gastonArrogantHunter } from "@tcg/lorcana-cards/cards/001";
import { mrSmeeLoyalFirstMate } from "@tcg/lorcana-cards/cards/001";
import { feliciaAlwaysHungry } from "@tcg/lorcana-cards/cards/002";
import { argesTheCyclops } from "@tcg/lorcana-cards/cards/004";
import { createFixture } from "../../fixture-factory.js";

export const bug47LeviathanStrengthBudget = createFixture({
  id: "bug-47-leviathan-strength-budget",
  name: "Bug 47 - The Leviathan strength budget",
  description:
    "P1 has The Leviathan - Guardian of Atlantis in hand. IT'S A MACHINE! triggers when you play Leviathan if 2+ cards entered your discard this turn, allowing you to banish any number of opposing characters with total {S} 10 or less. Bug: the target selector uses totalCostBudget instead of totalStrengthBudget, so the cap is enforced against printed cost (sum 8) instead of printed strength (sum 13). To trigger the discard gate, play both copies of Befuddle first (each is a 1-cost action, going to discard on resolution). Then play Leviathan. Repro steps: (1) play Befuddle twice on any legal target to put 2 cards in your discard; (2) play The Leviathan; (3) accept the optional and try to select all four opposing characters (Felicia 1c/3s, Gaston 2c/4s, Arges 2c/4s, Mr. Smee 3c/2s). Correct behavior: only subsets whose total strength <= 10 are selectable, so all four (total 13) cannot be selected together. Buggy behavior: total cost is 8, so all four can be selected.",
  playerOne: {
    play: [],
    hand: [theLeviathanGuardianOfAtlantis, befuddle, befuddle],
    inkwell: 12,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [
      { card: feliciaAlwaysHungry, isDrying: false },
      { card: gastonArrogantHunter, isDrying: false },
      { card: argesTheCyclops, isDrying: false },
      { card: mrSmeeLoyalFirstMate, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "bug-47-leviathan-strength-budget",
  skipPreGame: true,
});
