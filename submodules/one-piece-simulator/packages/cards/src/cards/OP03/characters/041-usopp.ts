import type { CharacterCard } from "@tcg/op-types";
import { op03Usopp041I18n } from "./041-usopp.i18n.ts";

export const op03Usopp041: CharacterCard = {
  id: "OP03-041",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP03",
  cost: 4,
  power: 5000,
  traits: ["East Blue"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-041_p1.jpg",
      imageId: "OP03-041_p1",
    },
  ],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [DON!! x1] When this Character's attack deals damage to your opponent's Life, you may trash 7 cards from the top of your deck.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenDealsDamage",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 7,
          },
        ],
      },
    ],
  },
  i18n: op03Usopp041I18n,
};
