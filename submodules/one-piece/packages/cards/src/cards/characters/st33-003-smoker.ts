import type { CharacterCard } from "@tcg/op-types";
import { st33Smoker003I18n } from "./st33-003-smoker.i18n.ts";
export const st33Smoker003: CharacterCard = {
  id: "ST33-003",
  canonicalId: "ST33-003",
  slug: "smoker/st33-003",
  name: "Smoker",
  printings: [
    {
      id: "ST33-003",
      artId: "ST33-003",
      setCode: "ST33",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST33-003.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST33",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from your hand: Place up to 2 of your opponent's Characters with a cost of 2 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st33Smoker003I18n,
};
