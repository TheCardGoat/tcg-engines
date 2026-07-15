import { luisaMadrigalConfidentClimber } from "@tcg/lorcana-cards/cards/012";
import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug67LuisaMadrigalZeroDamage = createFixture({
  id: "bug-67-luisa-madrigal-zero-damage",
  name: "Bug 67 - Luisa Madrigal I CAN TAKE IT at 0 damage",
  description:
    "P1 has Luisa Madrigal - Confident Climber (ready, not drying, 0 damage on her) and Chief Tui (with 2 damage on him) in play. Activate Luisa's I CAN TAKE IT ability targeting Chief Tui — the effect should move damage FROM Chief Tui TO Luisa. Bug: the move-damage effect fails / no-ops when the destination (Luisa) currently has 0 damage. Correct behavior: damage moves from Chief Tui to Luisa, leaving Chief Tui at 0 and Luisa at the moved amount.",
  playerOne: {
    play: [
      { card: luisaMadrigalConfidentClimber, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false, damage: 2 },
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
  seed: "bug-67-luisa-madrigal-zero-damage",
  skipPreGame: true,
});
