import type { CharacterCard } from "@tcg/op-types";
import { op12MsAllSunday075I18n } from "./075-ms-all-sunday.i18n.ts";

export const op12MsAllSunday075: CharacterCard = {
  id: "OP12-075",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "DON!! 1: Play this card.",
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 3 or less. Then, your opponent may add 1 DON!! card from their DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12MsAllSunday075I18n,
};
