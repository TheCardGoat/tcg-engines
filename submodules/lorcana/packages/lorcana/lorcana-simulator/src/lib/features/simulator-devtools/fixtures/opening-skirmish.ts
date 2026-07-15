import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  arielWhoseitCollector,
  goofyMusketeer,
  tinkerBellPeterPansAlly,
  mauiDemigod,
  befuddle,
  youHaveForgottenMe,
  developYourBrain,
  mickeyMouseTrueFriend,
  rapunzelGiftedArtist,
  motherKnowsBest,
  aladdinStreetRat,
} from "./fixture-cards.js";

export const openingSkirmishFixture: LorcanaSimulatorFixture = createFixture({
  id: "opening-skirmish",
  name: "Opening Skirmish",
  description: "Small opening board with both hands visible in authoritative mode.",
  playerOne: {
    deck: 42,
    discard: [arielWhoseitCollector],
    hand: [mickeyMouseTrueFriend, rapunzelGiftedArtist, developYourBrain],
    inkwell: 3,
    lore: 3,
    play: [goofyMusketeer, tinkerBellPeterPansAlly],
  },
  playerTwo: {
    deck: 38,
    discard: [motherKnowsBest],
    hand: [mauiDemigod, befuddle, youHaveForgottenMe],
    inkwell: 4,
    lore: 5,
    play: [aladdinStreetRat],
  },
  seed: "storybook-local-opening-skirmish",
});
