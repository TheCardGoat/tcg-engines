import type { LeaderCard } from "@tcg/op-types";
import { op08CharlottePudding058I18n } from "./058-charlotte-pudding.i18n.ts";

export const op08CharlottePudding058: LeaderCard = {
  id: "OP08-058",
  canonicalId: "OP08-058",
  slug: "charlotte-pudding/op08-058",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP08-058",
      artId: "OP08-058",
      setCode: "OP08",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-058.jpg",
    },
    {
      id: "OP08-058_p1",
      artId: "OP08-058_p1",
      setCode: "OP08",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-058_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["purple", "yellow"],
  rarity: "L",
  setId: "OP08",
  power: 5000,
  life: 4,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-058_p1.jpg",
      imageId: "OP08-058_p1",
    },
  ],
  effect:
    "[When Attacking] You may turn 2 cards from the top of your Life cards face-up: Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 2,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08CharlottePudding058I18n,
};
