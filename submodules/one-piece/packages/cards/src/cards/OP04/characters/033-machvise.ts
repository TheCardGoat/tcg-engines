import type { CharacterCard } from "@tcg/op-types";
import { op04Machvise033I18n } from "./033-machvise.i18n.ts";

export const op04Machvise033: CharacterCard = {
  id: "OP04-033",
  canonicalId: "OP04-033",
  slug: "machvise/op04-033",
  name: "Machvise",
  printings: [
    {
      id: "OP04-033",
      artId: "OP04-033",
      setCode: "OP04",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-033.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the [Donquixote Pirates] type, rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, set up to 1 of your DON!! cards as active at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
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
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op04Machvise033I18n,
};
