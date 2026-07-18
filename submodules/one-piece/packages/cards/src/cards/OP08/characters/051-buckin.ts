import type { CharacterCard } from "@tcg/op-types";
import { op08Buckin051I18n } from "./051-buckin.i18n.ts";

export const op08Buckin051: CharacterCard = {
  id: "OP08-051",
  canonicalId: "OP08-051",
  slug: "buckin/op08-051",
  name: "Buckin",
  printings: [
    {
      id: "OP08-051",
      artId: "OP08-051",
      setCode: "OP08",
      collectorNumber: "051",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-051.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Former Rocks Pirates"],
  attribute: "wisdom",
  effect:
    "[Your Turn] [On Play] Up to 1 of your [Edward Weevil] cards gains +2000 power during this turn.",
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Edward Weevil",
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
  i18n: op08Buckin051I18n,
};
