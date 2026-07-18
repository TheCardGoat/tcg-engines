import type { EventCard } from "@tcg/op-types";
import { op08ImperialFlame094I18n } from "./094-imperial-flame.i18n.ts";

export const op08ImperialFlame094: EventCard = {
  id: "OP08-094",
  canonicalId: "OP08-094",
  slug: "imperial-flame",
  name: "Imperial Flame",
  printings: [
    {
      id: "OP08-094",
      artId: "OP08-094",
      setCode: "OP08",
      collectorNumber: "094",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-094.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP08",
  cost: 2,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Main]/[Counter] You may place 3 cards from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent's Characters with a cost of 2 or less. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [{ cost: "returnTrashToDeck", amount: 3, position: "bottom" }],
        actions: [
          {
            action: "ko",
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
        optional: true,
      },
      {
        trigger: "counter",
        costs: [{ cost: "returnTrashToDeck", amount: 3, position: "bottom" }],
        actions: [
          {
            action: "ko",
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
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op08ImperialFlame094I18n,
};
