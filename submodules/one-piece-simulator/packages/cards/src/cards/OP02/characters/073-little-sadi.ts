import type { CharacterCard } from "@tcg/op-types";
import { op02LittleSadi073I18n } from "./073-little-sadi.i18n.ts";

export const op02LittleSadi073: CharacterCard = {
  id: "OP02-073",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP02",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Impel Down"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-073_p1.jpg",
      imageId: "OP02-073_p1",
    },
  ],
  effect: "[On Play] Play up to 1 [Jailer Beast] type Character card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
                filter: "trait",
                value: "Jailer Beast",
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
  i18n: op02LittleSadi073I18n,
};
