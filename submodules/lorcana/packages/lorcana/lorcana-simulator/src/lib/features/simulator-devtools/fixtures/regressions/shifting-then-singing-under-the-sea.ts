import { rapunzelGiftedWithHealing } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../fixture-factory.js";
import { rhinoOnesixteenthWolf, rhinoPowerHamster } from "@tcg/lorcana-cards/cards/008";
import { daisyDuckDonaldsDate } from "@tcg/lorcana-cards/cards/005";
import { mrSmeeBumblingMate } from "@tcg/lorcana-cards/cards/003";
import { stitchRockStar, underTheSea } from "@tcg/lorcana-cards/cards/009";
import {
  davidProtectiveSnowboarder,
  grandmotherWillowAncientAdvisorEpic,
  stitchNaughtyExperiment,
} from "@tcg/lorcana-cards/cards/011";

export const shiftingThenSingingUnderTheSea = createFixture({
  id: "shifting-the-sea",
  seed: "shifting-the-sea",
  skipPreGame: true,
  name: "Stitch interaction with Under the Sea",
  description: "Shifting Stitch and then singing under the sea is not resolving the effect.",
  playerOne: {
    hand: [stitchRockStar, underTheSea],
    play: [
      davidProtectiveSnowboarder,
      stitchNaughtyExperiment,
      grandmotherWillowAncientAdvisorEpic,
    ],
    inkwell: 4,
  },
  playerTwo: {
    play: [
      { card: rhinoOnesixteenthWolf, exerted: true },
      { card: rhinoOnesixteenthWolf, exerted: true },
      { card: rapunzelGiftedWithHealing, exerted: true },
      { card: daisyDuckDonaldsDate, exerted: true },
      mrSmeeBumblingMate,
      rhinoPowerHamster,
    ],
  },
});
