import type { CharacterCard } from "@tcg/op-types";
import { eb01Bingoh016I18n } from "./016-bingoh.i18n.ts";

export const eb01Bingoh016: CharacterCard = {
  id: "EB01-016",
  canonicalId: "EB01-016",
  slug: "bingoh",
  name: "Bingoh",
  printings: [
    {
      id: "EB01-016",
      artId: "EB01-016",
      setCode: "EB01",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-016.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may rest this Character: K.O. up to 1 of your opponent's rested Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Bingoh016I18n,
};
