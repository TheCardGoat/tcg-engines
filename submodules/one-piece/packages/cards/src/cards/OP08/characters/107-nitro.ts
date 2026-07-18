import type { CharacterCard } from "@tcg/op-types";
import { op08Nitro107I18n } from "./107-nitro.i18n.ts";

export const op08Nitro107: CharacterCard = {
  id: "OP08-107",
  canonicalId: "OP08-107",
  slug: "nitro",
  name: "Nitro",
  printings: [
    {
      id: "OP08-107",
      artId: "OP08-107",
      setCode: "OP08",
      collectorNumber: "107",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-107.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "special",
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your [Charlotte Pudding] cards gains +2000 power during this turn.",
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
              filters: [
                {
                  filter: "name",
                  value: "Charlotte Pudding",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Nitro107I18n,
};
