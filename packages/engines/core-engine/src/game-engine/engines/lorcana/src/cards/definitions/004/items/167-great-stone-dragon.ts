import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";

export const greatStoneDragon: LorcanaItemCardDefinition = {
  id: "jbi",
  name: "Great Stone Dragon",
  characteristics: ["item"],
  text: "**ASLEEP** This item enters play exerted.\n\n\n**AWAKEN** {E}- Put a character card from your discard into your inkwell facedown and exerted.",
  type: "item",
  abilities: [
    {
      type: "resolution",
      name: "ASLEEP",
      text: "This item enters play exerted.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "source",
                value: "self",
              },
            ],
          },
        },
      ],
    },
    {
      type: "activated",
      name: "AWAKEN",
      text: "{E}- Put a character card from your discard into your inkwell facedown and exerted.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "move",
          exerted: true,
          to: "inkwell",
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "zone",
                value: "discard",
              },
              {
                filter: "type",
                value: "character",
              },
              {
                filter: "owner",
                value: "self",
              },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Ryan Bittner",
  number: 167,
  set: "URR",
  rarity: "uncommon",
};
