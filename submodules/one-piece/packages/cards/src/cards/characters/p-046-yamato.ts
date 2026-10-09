import type { CharacterCard } from "@tcg/op-types";
import { pYamato046I18n } from "./p-046-yamato.i18n.ts";
export const pYamato046: CharacterCard = {
  id: "P-046",
  canonicalId: "P-046",
  slug: "yamato/p-046",
  name: "Yamato",
  printings: [
    {
      id: "P-046",
      artId: "P-046",
      setCode: "P",
      collectorNumber: "046",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-046.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 1,
  traits: ["Land of Wano"],
  power: 2000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[On Play] You may place all cards in your hand at the bottom of your deck in any order. If you do, draw cards equal to the number you placed at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: "all",
              },
            },
            position: "bottom",
            order: "any",
          },
          {
            action: "draw",
            player: "self",
            amount: 0,
            amountFromPreviousActionTargets: true,
          },
        ],
      },
    ],
  },
  i18n: pYamato046I18n,
};
