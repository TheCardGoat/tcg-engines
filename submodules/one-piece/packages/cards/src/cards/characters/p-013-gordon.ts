import type { CharacterCard } from "@tcg/op-types";
import { pGordon013I18n } from "./p-013-gordon.i18n.ts";
export const pGordon013: CharacterCard = {
  id: "P-013",
  canonicalId: "P-013",
  slug: "gordon/p-013",
  name: "Gordon",
  printings: [
    {
      id: "P-013",
      artId: "P-013",
      setCode: "P",
      collectorNumber: "013",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-013.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  power: 2000,
  traits: ["FILM"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may place this Character at the bottom of the owner's deck: Give up to 1 of your opponent's Characters −3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToDeck",
            position: "bottom",
          },
        ],
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
  i18n: pGordon013I18n,
};
