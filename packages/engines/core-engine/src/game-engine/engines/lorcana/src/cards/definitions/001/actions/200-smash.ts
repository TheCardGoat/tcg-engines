import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const smash: LorcanaActionCardDefinition = {
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
