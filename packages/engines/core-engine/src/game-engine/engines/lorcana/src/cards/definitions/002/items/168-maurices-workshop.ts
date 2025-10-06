import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauricesWorkshop: LorcanaItemCardDefinition = {
  id: "oja",

  name: "Maurice's Workshop",
  characteristics: ["item"],
  text: "**LOOKING FOR THIS?** Whenever you play another item, you may pay 1 {I} to draw a card.",
  type: "item",
  abilities: [
    wheneverTargetPlays({
      name: "Looking For This?",
      text: "Whenever you play another item, you may pay 1 {I} to draw a card.",
      optional: true,
      costs: [{ type: "ink", amount: 1 }],
      excludeSelf: true,
      triggerFilter: [
        { filter: "type", value: "item" },
        { filter: "owner", value: "self" },
      ],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  flavour: "The solution you need could be just a few adjustments away.",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Antonia Flechsig",
  number: 168,
  set: "ROF",
  rarity: "rare",
};
