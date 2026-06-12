import type { CharacterCard } from "@tcg/op-types";
import { op13Inuarashi061I18n } from "./061-inuarashi.i18n.ts";

export const op13Inuarashi061: CharacterCard = {
  id: "OP13-061",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Minks Roger Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If you have any DON!! cards given, add up to 1 DON!! card from your DON!! deck and rest it. Then, K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donGiven",
            player: "self",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
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
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13Inuarashi061I18n,
};
