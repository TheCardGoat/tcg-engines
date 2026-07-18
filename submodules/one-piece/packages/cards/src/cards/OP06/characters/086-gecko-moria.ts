import type { CharacterCard } from "@tcg/op-types";
import { op06GeckoMoria086I18n } from "./086-gecko-moria.i18n.ts";

export const op06GeckoMoria086: CharacterCard = {
  id: "OP06-086",
  canonicalId: "OP06-086",
  slug: "gecko-moria/op06-086",
  name: "Gecko Moria",
  printings: [
    {
      id: "OP06-086",
      artId: "OP06-086",
      setCode: "OP06",
      collectorNumber: "086",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-086.jpg",
    },
    {
      id: "OP06-086_p1",
      artId: "OP06-086_p1",
      setCode: "OP06",
      collectorNumber: "086",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-086_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP06",
  cost: 8,
  power: 9000,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-086_p1.jpg",
      imageId: "OP06-086_p1",
    },
  ],
  effect:
    "[On Play] Choose up to 1 Character card with a cost of 4 or less and up to 1 Character card with a cost of 2 or less from your trash. Play 1 card and play the other card rested.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "playGrouped",
            source: {
              player: "self",
              zone: "trash",
            },
            groups: [
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "cost",
                    comparison: "lte",
                    value: 4,
                  },
                  {
                    filter: "cardCategory",
                    value: "character",
                  },
                ],
              },
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "cost",
                    comparison: "lte",
                    value: 2,
                  },
                  {
                    filter: "cardCategory",
                    value: "character",
                  },
                ],
              },
            ],
            playStates: {
              single: "active",
              multiple: ["active", "rested"],
            },
            chooseOnPlayOrder: true,
          },
        ],
      },
    ],
  },
  i18n: op06GeckoMoria086I18n,
};
