import {
  donaldDuckStruttingHisStuff,
  partOfYourWorld,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy, theNokkWaterSpirit } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../fixture-factory.js";

export const wardHiddenZoneSelectionRegressionFixture = createFixture({
  id: "ward-hidden-zone-selection",
  name: "Ward Hidden Zone Selection",
  description:
    "Regression repro for reports where Ward incorrectly blocked choosing cards in hand or discard during effect resolution.",
  playerOne: {
    hand: [ransack, theNokkWaterSpirit, donaldDuckStruttingHisStuff, partOfYourWorld],
    inkwell: 3,
    deck: [peteBadGuy],
    discard: [peteBadGuy],
  },
  playerTwo: {},
  seed: "regression-ward-hidden-zone-selection",
  skipPreGame: true,
});
