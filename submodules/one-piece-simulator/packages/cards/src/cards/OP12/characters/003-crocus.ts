import type { CharacterCard } from "@tcg/op-types";
import { op12Crocus003I18n } from "./003-crocus.i18n.ts";

export const op12Crocus003: CharacterCard = {
  id: "OP12-003",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP12",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Former Roger Pirates"],
  attribute: "wisdom",
  effect:
    "[On K.O.] You may reveal 2 Events from your hand: Play up to 1 red Character card with 3000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 3000,
              },
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Crocus003I18n,
};
