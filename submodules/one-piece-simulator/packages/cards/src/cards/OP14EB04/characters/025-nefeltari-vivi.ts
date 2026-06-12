import type { CharacterCard } from "@tcg/op-types";
import { op14eb04NefeltariVivi025I18n } from "./025-nefeltari-vivi.i18n.ts";

export const op14eb04NefeltariVivi025: CharacterCard = {
  id: "EB04-025",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 7,
  power: 4000,
  traits: ["Alabasta"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-025_p1_9mhjRwC.jpg",
      imageId: "EB04-025_p1",
    },
  ],
  effect:
    "[On Play] Play up to 1 {Alabasta} type Character card with a cost of 8 or less other than [Nefeltari Vivi] from your hand. Then, your opponent places 1 card from your hand at the bottom of their deck.",
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
                filter: "excludeName",
                value: "Nefeltari Vivi",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 8,
              },
              {
                filter: "trait",
                value: "Alabasta",
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
  i18n: op14eb04NefeltariVivi025I18n,
};
