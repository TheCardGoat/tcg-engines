import type { CharacterCard } from "@tcg/op-types";
import { op03Kaku080I18n } from "./080-kaku.i18n.ts";

export const op03Kaku080: CharacterCard = {
  id: "OP03-080",
  canonicalId: "OP03-080",
  slug: "kaku/op03-080",
  name: "Kaku",
  printings: [
    {
      id: "OP03-080",
      artId: "OP03-080",
      setCode: "OP03",
      collectorNumber: "080",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-080.jpg",
    },
    {
      id: "OP03-080_p1",
      artId: "OP03-080_p1",
      setCode: "OP03",
      collectorNumber: "080",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-080_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-080_p1.jpg",
      imageId: "OP03-080_p1",
    },
  ],
  effect:
    '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 3 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 2,
            position: "bottom",
            filters: [
              {
                filter: "trait",
                value: "CP",
                match: "includes",
              },
            ],
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
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Kaku080I18n,
};
