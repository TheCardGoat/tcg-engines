import type { CharacterCard } from "@tcg/op-types";
import { op06JaguarDSaul053I18n } from "./053-jaguar-d-saul.i18n.ts";

export const op06JaguarDSaul053: CharacterCard = {
  id: "OP06-053",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Giant Navy"],
  attribute: "strike",
  effect:
    "[On K.O.] Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06JaguarDSaul053I18n,
};
