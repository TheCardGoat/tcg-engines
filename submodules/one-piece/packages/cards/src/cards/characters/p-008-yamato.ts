import type { CharacterCard } from "@tcg/op-types";
import { pYamato008I18n } from "./p-008-yamato.i18n.ts";
export const pYamato008: CharacterCard = {
  id: "P-008",
  canonicalId: "P-008",
  slug: "yamato/p-008",
  name: "Yamato",
  printings: [
    {
      id: "P-008",
      artId: "P-008",
      setCode: "P",
      collectorNumber: "008",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-008.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 5000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "[Activate: Main] You may rest this Character: Rest 1 of your opponent's Characters with a cost of 2 or less.",
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pYamato008I18n,
};
