import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  arielSingingMermaid,
  rapunzelGiftedWithHealing,
  mickeyMouseBraveLittleTailor,
  developYourBrain,
  tinkerBellPeterPansAlly,
  dinglehopper,
  hakunaMatata,
  mauiHeroToAll,
  bePrepared,
  befuddle,
  controlYourTemper,
  princePhillipDragonslayer,
  shieldOfVirtue,
  motherKnowsBest,
} from "./fixture-cards.js";

export const openingHandFixture: LorcanaSimulatorFixture = createFixture({
  id: "opening-hand",
  name: "Opening Hand",
  description: "Opening hand state: each player has 7 cards in hand, no board cards in play.",
  playerOne: {
    deck: 53,
    discard: [],
    hand: [
      arielSingingMermaid,
      rapunzelGiftedWithHealing,
      mickeyMouseBraveLittleTailor,
      developYourBrain,
      tinkerBellPeterPansAlly,
      dinglehopper,
      hakunaMatata,
    ],
    inkwell: [],
    lore: 0,
    play: [],
  },
  playerTwo: {
    deck: 53,
    discard: [],
    hand: [
      mauiHeroToAll,
      bePrepared,
      befuddle,
      controlYourTemper,
      princePhillipDragonslayer,
      shieldOfVirtue,
      motherKnowsBest,
    ],
    inkwell: [],
    lore: 0,
    play: [],
  },
  seed: "storybook-local-opening-hand",
});
