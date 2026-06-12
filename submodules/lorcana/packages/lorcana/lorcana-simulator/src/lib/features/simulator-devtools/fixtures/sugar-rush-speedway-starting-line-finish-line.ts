import {
  rapunzelsTowerSecludedPrison,
  sugarRushSpeedwayStartingLine,
  taffytaMuttonfudgeSourSpeedster,
  vanellopeVonSchweetzRandomRosterRacer,
} from "@tcg/lorcana-cards/cards/005";
import { sugarRushSpeedwayFinishLine } from "@tcg/lorcana-cards/cards/006";

import { createFixture } from "./fixture-factory";

export const sugarRushSpeedwayStartingLineFinishLineFixture = createFixture({
  id: "sugar-rush-speedway-starting-line-finish-line",
  name: "Sugar Rush Speedway Starting Line to Finish Line",
  description:
    "Stages Starting Line, Finish Line, and two racers so the free move, damage, target filtering, and Finish Line move trigger can be inspected in the browser simulator.",
  skipPreGame: true,
  playerOne: {
    lore: 0,
    inkwell: 4,
    hand: [],
    play: [
      sugarRushSpeedwayStartingLine,
      sugarRushSpeedwayFinishLine,
      rapunzelsTowerSecludedPrison,
      {
        card: vanellopeVonSchweetzRandomRosterRacer,
        atLocation: sugarRushSpeedwayStartingLine,
        isDrying: false,
      },
      {
        card: taffytaMuttonfudgeSourSpeedster,
        atLocation: rapunzelsTowerSecludedPrison,
        isDrying: false,
      },
    ],
    deck: 5,
  },
  playerTwo: {
    inkwell: 4,
    hand: [],
    play: [],
    deck: 5,
  },
});
