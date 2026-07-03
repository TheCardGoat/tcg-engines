import type { CharacterCard } from "@tcg/op-types";
import { op02Sakazuki099I18n } from "./099-sakazuki.i18n.ts";

export const op02Sakazuki099: CharacterCard = {
  id: "OP02-099",
  canonicalId: "OP02-099",
  slug: "sakazuki/op02-099",
  name: "Sakazuki",
  printings: [
    {
      id: "OP02-099",
      artId: "OP02-099",
      setCode: "OP02",
      collectorNumber: "099",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099.jpg",
    },
    {
      id: "OP02-099_p1",
      artId: "OP02-099_p1",
      setCode: "OP02",
      collectorNumber: "099",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP02",
  cost: 6,
  power: 7000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099_p1.jpg",
      imageId: "OP02-099_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02Sakazuki099I18n,
};
