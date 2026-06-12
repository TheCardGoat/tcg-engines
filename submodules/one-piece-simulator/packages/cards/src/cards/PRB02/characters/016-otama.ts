import type { CharacterCard } from "@tcg/op-types";
import { prb02Otama016I18n } from "./016-otama.i18n.ts";

export const prb02Otama016: CharacterCard = {
  id: "PRB02-016",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB02",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-016_p1.jpg",
      imageId: "PRB02-016",
    },
  ],
  effect:
    "[Activate: Main] You may rest this Character and add 1 card from the top or bottom of your Life cards to your hand: Up to 1 of your Leader or Character cards gains +3000 power during this turn.[Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02Otama016I18n,
};
