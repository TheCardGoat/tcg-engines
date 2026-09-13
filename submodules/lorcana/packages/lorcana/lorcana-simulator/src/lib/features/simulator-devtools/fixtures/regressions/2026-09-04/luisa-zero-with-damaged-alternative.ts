import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { luisaMadrigalConfidentClimber } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const luisaZeroWithDamagedAlternative = createFixture({
  id: "luisa-zero-with-damaged-alternative",
  name: "Luisa - choose zero with a damaged alternative",
  description:
    "Choose undamaged Mickey for the up-to step, then move Luisa's existing damage to the opponent. Damaged Chief Tui must not force a nonzero choice.",
  playerOne: {
    play: [
      { card: luisaMadrigalConfidentClimber, damage: 3, isDrying: false },
      { card: chiefTuiRespectedLeader, damage: 1, isDrying: false },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    inkwell: 1,
    deck: 5,
  },
  playerTwo: { play: [chiefTuiRespectedLeader], deck: 5 },
  seed: "luisa-zero-with-damaged-alternative",
  skipPreGame: true,
});
