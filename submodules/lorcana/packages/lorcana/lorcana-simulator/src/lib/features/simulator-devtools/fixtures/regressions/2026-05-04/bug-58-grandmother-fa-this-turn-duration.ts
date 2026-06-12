import { grandmotherFaSpiritedElder } from "@tcg/lorcana-cards/cards/007";
import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug58GrandmotherFaThisTurnDuration = createFixture({
  id: "bug-58-grandmother-fa-this-turn-duration",
  name: "Bug 58 - Grandmother Fa +2 {S} this-turn duration",
  description:
    "P1 has Grandmother Fa - Spirited Elder (ready, not drying) + Chief Tui - Respected Leader in play. On P1's turn, quest with Grandmother Fa, accept I'VE GOT ALL THE LUCK WE'LL NEED, and target Chief Tui to grant +2 {S} this turn. Verify Chief Tui shows the boosted strength. End P1's turn and pass to P2. Bug: the +2 {S} this-turn buff persists into P2's turn instead of expiring at end-of-turn cleanup. Correct behavior: Chief Tui's strength reverts to its printed value the moment P1's turn ends, and stays reverted for the rest of P2's turn.",
  playerOne: {
    play: [
      { card: grandmotherFaSpiritedElder, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
    ],
    hand: [],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-58-grandmother-fa-this-turn-duration",
  skipPreGame: true,
});
