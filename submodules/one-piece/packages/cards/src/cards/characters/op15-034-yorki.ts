import type { CharacterCard } from "@tcg/op-types";
import { op15Yorki034I18n } from "./op15-034-yorki.i18n.ts";

export const op15Yorki034: CharacterCard = {
  id: "OP15-034",
  canonicalId: "OP15-034",
  slug: "yorki/op15-034",
  name: "Yorki",
  printings: [
    {
      id: "OP15-034",
      artId: "OP15-034",
      setCode: "OP15",
      collectorNumber: "034",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-034_sGAlDJf.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Rumbar Pirates"],
  attribute: "slash",
  effect: "[Your Turn] [On Play] Up to 1 of your [Brook] cards gains +2000 power during this turn.",
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
                  value: "Brook",
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
  i18n: op15Yorki034I18n,
};
