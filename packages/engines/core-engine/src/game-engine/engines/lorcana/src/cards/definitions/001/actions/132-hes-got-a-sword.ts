import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const hesGotASword: LorcanitoActionCard = {
  id: "wmw",
  name: "He's Got a Sword!",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
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
  flavour: "We've all got swords! \n−Razoul",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Koni",
  number: 132,
  set: "TFC",
  rarity: "common",
};
