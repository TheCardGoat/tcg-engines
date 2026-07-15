import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  friendsOnTheOtherSide,
  hakunaMatata,
  controlYourTemper,
  aWholeNewWorld,
  magicBroomBucketBrigade,
  mulanImperialSoldier,
  merlinGoat,
  stitchRockStar,
  dinglehopper,
  bePrepared,
  youHaveForgottenMe,
  motherKnowsBest,
  princePhillipDragonslayer,
  shieldOfVirtue,
  maleficentSorceress,
  elsaGlovesOff,
  peterPansShadowNotSewnOn,
} from "./fixture-cards.js";

export const boardPressureFixture: LorcanaSimulatorFixture = createFixture({
  id: "board-pressure",
  name: "Board Pressure",
  description: "Mid-game pressure state with larger play zones and discard piles.",
  playerOne: {
    deck: 29,
    discard: [friendsOnTheOtherSide, hakunaMatata, controlYourTemper],
    hand: [aWholeNewWorld, magicBroomBucketBrigade],
    inkwell: 6,
    lore: 11,
    play: [mulanImperialSoldier, merlinGoat, stitchRockStar, dinglehopper],
  },
  playerTwo: {
    deck: 27,
    discard: [youHaveForgottenMe, motherKnowsBest],
    hand: [motherKnowsBest, princePhillipDragonslayer, bePrepared, shieldOfVirtue],
    inkwell: 5,
    lore: 14,
    play: [maleficentSorceress, elsaGlovesOff, peterPansShadowNotSewnOn],
  },
  seed: "storybook-local-board-pressure",
});
