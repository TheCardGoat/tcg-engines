// TODO: Once the set is released, we organize the cards by set and type

import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimTrulyMarvelous: LorcanaCharacterCardDefinition = {
  id: "eh8",
  missingTestCase: true,
  name: "Madam Mim",
  title: "Truly Marvelous",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.",
  type: "character",
  abilities: [
    {
      type: "activated",
      costs: [
        { type: "ink", amount: 2 },
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
          ],
        },
      ],
      effects: [youGainLore(1)],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 55,
  set: "006",
  rarity: "super_rare",
};
