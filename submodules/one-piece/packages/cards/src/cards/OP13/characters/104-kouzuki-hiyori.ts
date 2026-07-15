import type { CharacterCard } from "@tcg/op-types";
import { op13KouzukiHiyori104I18n } from "./104-kouzuki-hiyori.i18n.ts";

export const op13KouzukiHiyori104: CharacterCard = {
  id: "OP13-104",
  canonicalId: "OP13-104",
  slug: "kouzuki-hiyori/op13-104",
  name: "Kouzuki Hiyori",
  printings: [
    {
      id: "OP13-104",
      artId: "OP13-104",
      setCode: "OP13",
      collectorNumber: "104",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-104_oLjaCOM.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP13",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    "[Blocker][On K.O.] You may trash 1 card from your hand: If your Leader is multicolored, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13KouzukiHiyori104I18n,
};
