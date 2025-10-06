import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const coconutbasket: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "hoh",
  reprints: ["bxv"],

  name: "Coconut Basket",
  text: "**CONSIDER THE COCONUT** Whenever you play a character,\ryou may remove up to 2 damage from chosen character.",
  type: "item",
  abilities: [
    wheneverTargetPlays({
      optional: true,
      name: "Consider the Coconut",
      text: "Whenever you play a character, you may remove up to 2 damage from chosen character.",
      triggerFilter: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
      ],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    }),
  ],
  flavour:
    "The coconut is a versatile gift from the gods, used to make nearly everything - including baskets to carry more coconuts.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Milica Celikovic",
  number: 166,
  set: "TFC",
  rarity: "uncommon",
};
