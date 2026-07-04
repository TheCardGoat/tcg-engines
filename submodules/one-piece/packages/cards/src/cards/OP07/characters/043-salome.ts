import type { CharacterCard } from "@tcg/op-types";
import { op07Salome043I18n } from "./043-salome.i18n.ts";

export const op07Salome043: CharacterCard = {
  id: "OP07-043",
  canonicalId: "OP07-043",
  slug: "salome/op07-043",
  name: "Salome",
  printings: [
    {
      id: "OP07-043",
      artId: "OP07-043",
      setCode: "OP07",
      collectorNumber: "043",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-043.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Animal Kuja Pirates"],
  attribute: "strike",
  effect:
    "[Your Turn] [On Play] Up to 1 of your [Boa Hancock] cards gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Boa Hancock",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Salome043I18n,
};
