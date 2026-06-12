import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  friendsOnTheOtherSide,
  hakunaMatata,
  stitchNewDog,
  mauiHeroToAll,
  maleficentBidingHerTime,
  mulanImperialSoldier,
  merlinGoat,
  maleficentSorceress,
  elsaGlovesOff,
  peterPansShadowNotSewnOn,
  youHaveForgottenMe,
} from "./fixture-cards.js";

export const winStateFixture: LorcanaSimulatorFixture = createFixture({
  id: "win-state",
  name: "Win State",
  description: "Player Two has reached 20 lore and won the game.",
  playerOne: {
    deck: 10,
    discard: [friendsOnTheOtherSide, hakunaMatata],
    hand: [stitchNewDog],
    inkwell: 7,
    lore: 14,
    play: [mulanImperialSoldier, merlinGoat],
  },
  playerTwo: {
    deck: 8,
    discard: [youHaveForgottenMe],
    hand: [maleficentBidingHerTime],
    inkwell: 10,
    lore: 20,
    play: [maleficentSorceress, elsaGlovesOff, peterPansShadowNotSewnOn, mauiHeroToAll],
  },
  seed: "storybook-local-win-state",
});
