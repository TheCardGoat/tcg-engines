import type { CharacterCard } from "@tcg/op-types";
import { op01Denjiro046I18n } from "./046-denjiro.i18n.ts";

export const op01Denjiro046: CharacterCard = {
  id: "OP01-046",
  canonicalId: "OP01-046",
  slug: "denjiro/op01-046",
  name: "Denjiro",
  printings: [
    {
      id: "OP01-046",
      artId: "OP01-046",
      setCode: "OP01",
      collectorNumber: "046",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-046.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP01",
  cost: 5,
  power: 7000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] If your Leader is [Kouzuki Oden], set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "leaderName",
            name: "Kouzuki Oden",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op01Denjiro046I18n,
};
