import type { CharacterCard } from "@tcg/op-types";
import { op10Brook035I18n } from "./035-brook.i18n.ts";

export const op10Brook035: CharacterCard = {
  id: "OP10-035",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 5000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "slash",
  effect:
    "[On K.O.] Rest up to 1 of your opponent's Leader or Character cards with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
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
  i18n: op10Brook035I18n,
};
