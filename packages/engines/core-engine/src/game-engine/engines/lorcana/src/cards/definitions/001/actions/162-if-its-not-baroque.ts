import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const ifItsNotBaroque: LorcanitoActionCard = {
  id: "m65",
  name: "If It's Not Baroque",
  characteristics: ["action"],
  text: "Return an item card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  flavour: ". . . Don't fix it.",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Kenneth Anderson",
  number: 162,
  set: "TFC",
  rarity: "rare",
};
