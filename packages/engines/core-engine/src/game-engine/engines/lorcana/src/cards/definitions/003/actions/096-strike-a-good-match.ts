import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  discardACard,
  drawXCards,
} from "@lorcanito/lorcana-engine/effects/effects";

export const strikeAGoodMatch: LorcanitoActionCard = {
  id: "fd2",
  name: "Strike a Good Match",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can Exert.png to sing this song for free.)_\n\n\nDraw 2 cards, then choose and discard a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Strike a Good Match",
      text: "Draw 2 cards, then choose and discard a card.",
      resolveEffectsIndividually: true,
      effects: [drawXCards(2), discardACard],
    },
  ],
  flavour: "Please bring honor to us \nPlease bring honor to us all",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Maxine Vee",
  number: 96,
  set: "ITI",
  rarity: "common",
};
