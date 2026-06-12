import type { CharacterCard } from "@tcg/op-types";
import { eb01KouzukiHiyori013I18n } from "./013-kouzuki-hiyori.i18n.ts";

export const eb01KouzukiHiyori013: CharacterCard = {
  id: "EB01-013",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB01",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-013_p1.jpg",
      imageId: "EB01-013_p1",
    },
  ],
  effect:
    "[Activate:Main] You may trash this Character: Play up to 1 [Land of Wano] type Character card with a cost of 5 or less other than [Kouzuki Hiyori] from your hand. Then, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
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
                value: "Kouzuki Hiyori",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Land of Wano",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01KouzukiHiyori013I18n,
};
