import { belleStrangeButSpecial, genieOnTheJob } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../fixture-factory.js";
import { retroEvolutionDevice } from "@tcg/lorcana-cards/cards/011";
import { woodyJungleGuide } from "@tcg/lorcana-cards/cards/012";

export const retroEvolutionDeviceGenie = createFixture({
  id: "retro-evolution-device-genie",
  seed: "retro-evolution-device-genie",
  skipPreGame: true,
  name: "Retro Evolution Device won't play Genie",
  description:
    "Player reports RED would not let them play Genie from hand. Setup: RED in play, Belle (cost 4) as sacrifice, Genie - On the Job (cost 6) in hand. Banishing Belle should allow playing Genie (4+2=6). Activate RED -> banish Belle -> try to play Genie.",
  playerOne: {
    hand: [genieOnTheJob],
    play: [retroEvolutionDevice, belleStrangeButSpecial],
    inkwell: 5,
    deck: 10,
  },
  playerTwo: {
    play: [woodyJungleGuide],
    inkwell: 3,
    deck: 10,
  },
});
