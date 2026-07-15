import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MsWednesday083I18n } from "./083-ms-wednesday.i18n.ts";

export const op14eb04MsWednesday083: CharacterCard = {
  id: "OP14-083",
  canonicalId: "OP14-083",
  slug: "ms-wednesday/op14-083",
  name: "Ms. Wednesday",
  printings: [
    {
      id: "OP14-083",
      artId: "OP14-083",
      setCode: "OP14EB04",
      collectorNumber: "083",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-083_LqsBZiC.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may trash this Character: Give up to 1 of your opponent's 0 cost Characters 3000 power during this turn.",
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
            action: "modifyPower",
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
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04MsWednesday083I18n,
};
