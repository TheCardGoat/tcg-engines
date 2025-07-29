import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const friendsOnTheOtherSide: LorcanitoActionCard = {
  id: "rrg",
  name: "Friends On The Other Side",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song \rfor free.)_\n\rDraw 2 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "draw",
          amount: 2,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
      text: "Draw 2 cards.",
    },
  ],
  flavour: "The cards, the cards<br />\rthe cards will tell . . .",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Amber Kommavongsa",
  number: 64,
  set: "TFC",
  rarity: "common",
};
