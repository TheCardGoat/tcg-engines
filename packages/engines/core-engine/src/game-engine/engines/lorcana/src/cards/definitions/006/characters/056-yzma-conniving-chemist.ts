// TODO: Once the set is released, we organize the cards by set and type

import { drawCardsUntilYouHaveXCardsInHand } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaConnivingChemist: LorcanaCharacterCardDefinition = {
  id: "fsf",
  name: "Yzma",
  title: "Conniving Chemist",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**FEEL THE POWER** {E} – _If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand._",
  type: "character",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
          ],
          comparison: { operator: "lt", value: 3 },
        },
      ],
      name: "FEEL THE POWER",
      text: "If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand._",
      effects: [drawCardsUntilYouHaveXCardsInHand(3)],
    },
  ],
  flavour: "One of these has got to work. Let's see what happens.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Jared Mathews",
  number: 56,
  set: "006",
  rarity: "legendary",
};
