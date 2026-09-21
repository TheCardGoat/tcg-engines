import type { CharacterCard } from "@tcg/op-types";
import { op16Shinobu087I18n } from "./op16-087-shinobu.i18n.ts";

export const op16Shinobu087: CharacterCard = {
  id: "OP16-087",
  canonicalId: "OP16-087",
  slug: "shinobu/op16-087",
  name: "Shinobu",
  printings: [
    {
      id: "OP16-087",
      artId: "OP16-087",
      setCode: "OP16",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-087_imE9hNZ.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP16",
  cost: 2,
  power: 1000,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  effect:
    "[On Play] You may trash this Character: If your Leader has the {Land of Wano} type, draw 1 card and up to 1 of your [Kouzuki Momonosuke] gains +20 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Land of Wano",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Kouzuki Momonosuke",
                },
              ],
            },
            value: 20,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16Shinobu087I18n,
};
