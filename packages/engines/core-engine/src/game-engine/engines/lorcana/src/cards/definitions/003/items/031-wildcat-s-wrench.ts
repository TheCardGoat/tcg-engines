import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";

export const wildcatsWrench: LorcanaItemCardDefinition = {
  id: "d8n",
  name: "Wildcat's Wrench",
  characteristics: ["item"],
  text: "**REBUILD** {E} – Remove up to 2 damage from chosen location.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Rebuild",
      text: "{E} – Remove up to 2 damage from chosen location.",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "location" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "The right tool makes all the difference.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Ellie Horie",
  number: 31,
  set: "ITI",
  rarity: "uncommon",
};
