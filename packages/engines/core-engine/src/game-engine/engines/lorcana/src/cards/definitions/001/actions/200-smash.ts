import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const smash: LorcanitoActionCard = {
  id: "ub4",
  name: "Smash",
  characteristics: ["action"],
  text: "Deal 3 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Smash",
      text: "Deal 3 damage to chosen character.",
      effects: [
        {
          type: "damage",
          amount: 3,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: '"Go away!"',
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Simangaliso Sibaya",
  number: 200,
  set: "TFC",
  rarity: "uncommon",
};
