import { returnChosenCharacterWithCostLess } from "@lorcanito/lorcana-engine/effects/effects";

import { ifYouHaveCharacterNamed } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theLamp: LorcanaItemCardDefinition = {
  id: "byw",
  name: "The Lamp",
  characteristics: ["item"],
  text: "**GOOD OR EVIL** Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "GOOD OR EVIL",
      text: "Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
      costs: [{ type: "banish" }],
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "draw",
          amount: 2,
          target: self,
          conditions: [ifYouHaveCharacterNamed("Jafar")],
        },
        {
          ...returnChosenCharacterWithCostLess(4),
          conditions: [ifYouHaveCharacterNamed("Genie")],
        },
      ],
    },
  ],
  colors: ["amethyst"],
  illustrator: "Ever Galvez / Anna Stosik",
  number: 64,
  cost: 2,
  set: "ITI",
  rarity: "rare",
};
