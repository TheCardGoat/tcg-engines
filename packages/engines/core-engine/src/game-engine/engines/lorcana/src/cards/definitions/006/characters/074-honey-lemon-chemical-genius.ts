// TODO: Once the set is released, we organize the cards by set and type

import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const honeyLemonChemicalGenius: LorcanitoCharacterCardDefinition = {
  id: "rl9",
  missingTestCase: true,
  name: "Honey Lemon",
  title: "Chemical Genius",
  characteristics: ["hero", "storyborn", "inventor"],
  text: "**HERE'S THE BEST PART** When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      optional: true,
      costs: [{ type: "ink", amount: 2 }],
      name: "HERE'S THE BEST PART",
      text: "When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
      effects: [
        {
          type: "create-layer-for-player",
          target: opponent,
          layer: {
            type: "resolution",
            name: "Here's the Best Part",
            text: "Choose and discard a card.",
            responder: "self",
            effects: [
              {
                type: "discard",
                amount: 1,
                target: {
                  type: "card",
                  value: 1,
                  filters: [
                    { filter: "zone", value: "hand" },
                    { filter: "owner", value: "self" },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "You're going to love this!",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  illustrator: "Aristidis Zentelis",
  number: 74,
  set: "006",
  rarity: "uncommon",
};
