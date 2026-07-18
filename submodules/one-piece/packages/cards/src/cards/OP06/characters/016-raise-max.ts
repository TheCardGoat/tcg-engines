import type { CharacterCard } from "@tcg/op-types";
import { op06RaiseMax016I18n } from "./016-raise-max.i18n.ts";

export const op06RaiseMax016: CharacterCard = {
  id: "OP06-016",
  canonicalId: "OP06-016",
  slug: "raise-max",
  name: "Raise Max",
  printings: [
    {
      id: "OP06-016",
      artId: "OP06-016",
      setCode: "OP06",
      collectorNumber: "016",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-016.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP06",
  cost: 1,
  power: 2000,
  traits: ["FILM Revolutionary Army"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may place this Character at the bottom of the owner's deck: Give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [{ cost: "returnThisToDeck", position: "bottom" }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06RaiseMax016I18n,
};
