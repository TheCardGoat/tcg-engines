import type { CharacterCard } from "@tcg/op-types";
import { op10UsoHachiSp001I18n } from "./001-uso-hachi-sp.i18n.ts";

export const op10UsoHachiSp001: CharacterCard = {
  id: "ST18-001",
  canonicalId: "ST18-001",
  slug: "uso-hachi-sp",
  name: "Uso-Hachi (SP)",
  printings: [
    {
      id: "ST18-001",
      artId: "ST18-001",
      setCode: "OP10",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[On Play] If you have 8 or more DON!! cards on your field, rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10UsoHachiSp001I18n,
};
