import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const controlYourTemper: LorcanitoActionCard = {
  id: "eny",
  name: "Control Your Temper!",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "turn",
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
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Amber Kommavongsa",
  number: 26,
  set: "TFC",
  rarity: "common",
};
