import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratigansMarvelousTrap: LorcanaItemCardDefinition = {
  id: "ihx",

  name: "Ratigan's Marvelous Trap",
  characteristics: ["item"],
  text: "**SNAP! BOOM! TWANG!** Banish this item − Each opponent loses 2 lore.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Snap! Boom! Twang!",
      text: "Banish this item − Each opponent loses 2 lore.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "lore",
          amount: 2,
          modifier: "subtract",
          target: {
            type: "player",
            value: "opponent",
          },
        },
      ],
    },
  ],
  flavour: "Simple in purpose, elaborate in execution−just like Ratigan.",
  colors: ["emerald"],
  cost: 3,
  illustrator: "Leonardo Giammichele",
  number: 102,
  set: "ROF",
  rarity: "rare",
};
