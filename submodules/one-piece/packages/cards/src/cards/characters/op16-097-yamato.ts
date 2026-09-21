import type { CharacterCard } from "@tcg/op-types";
import { op16Yamato097I18n } from "./op16-097-yamato.i18n.ts";

export const op16Yamato097: CharacterCard = {
  id: "OP16-097",
  canonicalId: "OP16-097",
  slug: "yamato/op16-097",
  name: "Yamato",
  printings: [
    {
      id: "OP16-097",
      artId: "OP16-097",
      setCode: "OP16",
      collectorNumber: "097",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-097_p9eq1wc.jpg",
      label: "Yamato (097)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP16",
  cost: 8,
  power: 8000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "[On Play] Add up to 1 {Land of Wano} type Character card with a cost of 6 or less from your trash to your hand. Then, play up to 1 Character card with a cost of 2 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                  match: "includes",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
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
      },
    ],
  },
  i18n: op16Yamato097I18n,
};
