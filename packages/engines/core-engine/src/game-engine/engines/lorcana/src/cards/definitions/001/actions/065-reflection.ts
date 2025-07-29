import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const reflection: LorcanitoActionCard = {
  id: "brz",
  name: "Reflection",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Reflection",
      text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 3,
          mode: "top",
          target: {
            type: "player",
            value: "self",
          },
          limits: {
            top: 3,
            bottom: 0,
            hand: 0,
            inkwell: 0,
          },
        },
      ],
    },
  ],
  flavour: "When will my reflection show \nWho I am inside?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Kevin Hong",
  number: 65,
  set: "TFC",
  rarity: "common",
};
