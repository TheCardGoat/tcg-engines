import { madamMimElephant } from "@tcg/lorcana-cards/cards/005";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiRespectedLeader, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug01MadamMimSneakyMove = createFixture({
  id: "bug-01-madam-mim-sneaky-move",
  name: "Bug 01 - Madam Mim Elephant Sneaky Move",
  description:
    "Madam Mim - Elephant in play with 0 damage at the start of the turn. The Sneaky Move trigger should either be unavailable (no damage to move) or should correctly move counters to an opposing character when Mim has damage.",
  playerOne: {
    play: [{ card: madamMimElephant, damage: 1 }],
    hand: [heiheiBoatSnack],
    inkwell: 4,
    deck: 10,
  },
  playerTwo: {
    play: [peteBadGuy, chiefTuiRespectedLeader],
    deck: 10,
  },
  seed: "bug-01-madam-mim-sneaky-move",
  skipPreGame: true,
});
