import {
  drawACard,
  exertChosenCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/effect";

import { chosenCardFromYourHand } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const halfHexwellCrown: LorcanaItemCardDefinition = {
  id: "tj0",
  missingTestCase: true,
  name: "Half Hexwell Crown",
  characteristics: ["item"],
  text: "**AN UNEXPECTED FIND**, {E}, 2 {I} — Draw a card. *A PERILOUS POWER** {E}, 2 {I}, Discard a card – Exert chosen character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "AN UNEXPECTED FIND",
      text: "{E}, 2 {I} — Draw a card.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [drawACard],
    },
    {
      type: "activated",
      name: "A PERILOUS POWER",
      text: "{E}, 2 {I}, Discard a card – Exert chosen character.",
      costs: [
        { type: "exert" },
        { type: "ink", amount: 2 },
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: chosenCardFromYourHand.filters,
        },
      ],
      effects: [exertChosenCharacter],
    },
  ],
  flavour: "The broken crown holds dark and mysterious powers.",
  colors: ["amethyst"],
  cost: 6,
  illustrator: "John Loren",
  number: 65,
  set: "SSK",
  rarity: "rare",
};
