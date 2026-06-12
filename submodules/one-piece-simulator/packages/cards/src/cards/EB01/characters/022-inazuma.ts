import type { CharacterCard } from "@tcg/op-types";
import { eb01Inazuma022I18n } from "./022-inazuma.i18n.ts";

export const eb01Inazuma022: CharacterCard = {
  id: "EB01-022",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "EB01",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-022_p1.jpg",
      imageId: "EB01-022_p1",
    },
  ],
  effect: "[End of Your Turn] If you have 2 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: eb01Inazuma022I18n,
};
