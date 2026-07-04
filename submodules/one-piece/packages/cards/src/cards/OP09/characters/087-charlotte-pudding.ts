import type { CharacterCard } from "@tcg/op-types";
import { op09CharlottePudding087I18n } from "./087-charlotte-pudding.i18n.ts";

export const op09CharlottePudding087: CharacterCard = {
  id: "OP09-087",
  canonicalId: "OP09-087",
  slug: "charlotte-pudding/op09-087",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP09-087",
      artId: "OP09-087",
      setCode: "OP09",
      collectorNumber: "087",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-087.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] If your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09CharlottePudding087I18n,
};
