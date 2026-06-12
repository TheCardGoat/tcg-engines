import type { CharacterCard } from "@tcg/op-types";
import { op08Inuarashi022I18n } from "./022-inuarashi.i18n.ts";

export const op08Inuarashi022: CharacterCard = {
  id: "OP08-022",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Minks The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the {Minks} type, up to 2 of your opponent's rested Characters with a cost of 5 or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Minks",
          },
        ],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
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
  i18n: op08Inuarashi022I18n,
};
