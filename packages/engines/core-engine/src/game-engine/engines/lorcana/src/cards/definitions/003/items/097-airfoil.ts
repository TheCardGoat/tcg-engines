import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";

export const airfoil: LorcanaItemCardDefinition = {
  id: "v9z",
  missingTestCase: true,
  name: "Airfoil",
  characteristics: ["item"],
  text: "**I GOT TO BE GOING** {E} – If you've played 2 or more actions this turn, draw a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "I Got to be Going",
      text: "{E} − If you've played 2 or more actions this turn, draw a card.",
      optional: false,
      costs: [{ type: "exert" }],
      conditions: [
        { type: "played-actions", comparison: { operator: "gte", value: 2 } },
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
    },
  ],
  flavour: "Discovered in the lost Sea Duck, it looked good as new.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Jenna Gray",
  number: 97,
  set: "ITI",
  rarity: "common",
};
