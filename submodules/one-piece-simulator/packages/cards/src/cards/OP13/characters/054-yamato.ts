import type { CharacterCard } from "@tcg/op-types";
import { op13Yamato054I18n } from "./054-yamato.i18n.ts";

export const op13Yamato054: CharacterCard = {
  id: "OP13-054",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-054_p1_70Fwd6z.jpg",
      imageId: "OP13-054_p1",
    },
  ],
  effect:
    "[On Play] If you have 3 or less Life cards, draw 2 cards. Then, give up to 1 rested DON!! card to your Leader.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13Yamato054I18n,
};
