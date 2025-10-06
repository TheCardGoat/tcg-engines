import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dragonGem: LorcanaItemCardDefinition = {
  id: "mwf",
  name: "Dragon Gem",
  characteristics: ["item"],
  text: "**BRING BACK TO LIFE** {E}, 3 {I} − Return a character card with **Support** from your discard to your hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Bring Back to Life",
      text: "{E}, 3 {I} − Return a character card with **Support** from your discard to your hand.",
      costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
              { filter: "ability", value: "support" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Hope shines in even the darkest situations.",
  colors: ["amber"],
  cost: 3,
  illustrator: "Andrew Trabbold",
  number: 33,
  set: "ROF",
  rarity: "rare",
};
