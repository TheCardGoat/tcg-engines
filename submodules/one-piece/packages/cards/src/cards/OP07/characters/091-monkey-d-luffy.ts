import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy091I18n } from "./091-monkey-d-luffy.i18n.ts";

export const op07MonkeyDLuffy091: CharacterCard = {
  id: "OP07-091",
  canonicalId: "OP07-091",
  slug: "monkey-d-luffy/op07-091",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP07-091",
      artId: "OP07-091",
      setCode: "OP07",
      collectorNumber: "091",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-091.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[When Attacking] Trash up to 1 of your opponent's Characters with a cost of 2 or less. Then, place any number of Character cards with a cost of 4 or more from your trash at the bottom of your deck in any order. This Character gains +1000 power during this turn for every 3 cards placed at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "trashFromField",
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07MonkeyDLuffy091I18n,
};
