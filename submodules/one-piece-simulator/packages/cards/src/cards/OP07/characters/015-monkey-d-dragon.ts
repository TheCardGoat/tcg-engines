import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDDragon015I18n } from "./015-monkey-d-dragon.i18n.ts";

export const op07MonkeyDDragon015: CharacterCard = {
  id: "OP07-015",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP07",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015_p1.jpg",
      imageId: "OP07-015_p1",
    },
  ],
  effect:
    "[Rush](This card can attack on the turn in which it is played.) [On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07MonkeyDDragon015I18n,
};
