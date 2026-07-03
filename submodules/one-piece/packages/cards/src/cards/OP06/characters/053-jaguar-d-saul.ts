import type { CharacterCard } from "@tcg/op-types";
import { op06JaguarDSaul053I18n } from "./053-jaguar-d-saul.i18n.ts";

export const op06JaguarDSaul053: CharacterCard = {
  id: "OP06-053",
  canonicalId: "OP06-053",
  slug: "jaguar-d-saul/op06-053",
  name: "Jaguar.D.Saul",
  printings: [
    {
      id: "OP06-053",
      artId: "OP06-053",
      setCode: "OP06",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-053.jpg",
    },
  ],
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
