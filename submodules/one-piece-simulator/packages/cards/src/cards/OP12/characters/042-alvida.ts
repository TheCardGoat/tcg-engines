import type { CharacterCard } from "@tcg/op-types";
import { op12Alvida042I18n } from "./042-alvida.i18n.ts";

export const op12Alvida042: CharacterCard = {
  id: "OP12-042",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: "strike",
  effect:
    "If you have 2 or more Characters with a base cost of 5 or more, this Character gains +1 cost.\n[On Play] Place up to 1 of your opponent's Characters with a base cost of 1 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12Alvida042I18n,
};
