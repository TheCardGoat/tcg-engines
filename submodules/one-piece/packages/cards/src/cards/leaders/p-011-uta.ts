import type { LeaderCard } from "@tcg/op-types";
import { pUta011I18n } from "./p-011-uta.i18n.ts";
export const pUta011: LeaderCard = {
  id: "P-011",
  canonicalId: "P-011",
  slug: "uta/p-011",
  name: "Uta",
  printings: [
    {
      id: "P-011",
      artId: "P-011",
      setCode: "P",
      collectorNumber: "011",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-011.png",
    },
  ],
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "P",
  life: 5,
  power: 5000,
  traits: ["FILM"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] ① (You may rest the specified number of DON!! cards in your cost area.): Up to 1 of your Characters with no base effect gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "noBaseEffect",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
        optional: true,
      },
    ],
  },
  i18n: pUta011I18n,
};
