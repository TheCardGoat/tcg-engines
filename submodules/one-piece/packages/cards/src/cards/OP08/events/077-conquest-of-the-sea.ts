import type { EventCard } from "@tcg/op-types";
import { op08ConquestOfTheSea077I18n } from "./077-conquest-of-the-sea.i18n.ts";

export const op08ConquestOfTheSea077: EventCard = {
  id: "OP08-077",
  canonicalId: "OP08-077",
  slug: "conquest-of-the-sea",
  name: "Conquest of the Sea",
  printings: [
    {
      id: "OP08-077",
      artId: "OP08-077",
      setCode: "OP08",
      collectorNumber: "077",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-077.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP08",
  cost: 6,
  traits: ["Animal Kingdom Pirates The Four Emperors Big Mom Pirates"],
  effect:
    "[Main] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Animal Kingdom Pirates] or [Big Mom Pirates] type, K.O. up to 2 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "ko",
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
                  value: 6,
                },
              ],
            },
            condition: {
              condition: "compound",
              operator: "or",
              conditions: [
                {
                  condition: "leaderTrait",
                  trait: "Animal Kingdom Pirates",
                  match: "includes",
                },
                {
                  condition: "leaderTrait",
                  trait: "Big Mom Pirates",
                  match: "includes",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08ConquestOfTheSea077I18n,
};
