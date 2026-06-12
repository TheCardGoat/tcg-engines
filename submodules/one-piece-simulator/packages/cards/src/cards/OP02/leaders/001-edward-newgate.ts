import type { LeaderCard } from "@tcg/op-types";
import { op02EdwardNewgate001I18n } from "./001-edward-newgate.i18n.ts";

export const op02EdwardNewgate001: LeaderCard = {
  id: "OP02-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP02",
  power: 6000,
  life: 6,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-001_p1.jpg",
      imageId: "OP02-001_p1",
    },
  ],
  effect: "[End of Your Turn] Add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op02EdwardNewgate001I18n,
};
