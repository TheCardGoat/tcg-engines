import {
  anotherChosenCharacterOfYours,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { returnChosenCharacterWithCostLess } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const doubleCross = whenYouPlayThis({
  name: "DOUBLE-CROSS",
  text: "When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.",
  optional: true,
  effects: [
    {
      type: "damage",
      amount: 2,
      target: anotherChosenCharacterOfYours,
      afterEffect: [
        {
          type: "create-layer-based-on-target",
          target: thisCharacter,
          effects: [returnChosenCharacterWithCostLess(2)],
        },
      ],
    },
  ],
});

export const madameMedusaDeceivingPartner: LorcanaCharacterCardDefinition = {
  id: "mzj",
  name: "Madame Medusa",
  title: "Deceiving Partner",
  characteristics: ["storyborn", "villain"],
  text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.",
  type: "character",
  abilities: [doubleCross],
  inkwell: true,
  colors: ["amethyst", "ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Heidi Neuhofter",
  number: 47,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
