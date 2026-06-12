import type { CharacterCard } from "@tcg/op-types";
import { op09NamiSp106I18n } from "./106-nami-sp.i18n.ts";

export const op09NamiSp106: CharacterCard = {
  id: "OP08-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 1000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card with a [Trigger] from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less. Then, if you have 3 or less cards in your hand, draw 1 card.",
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09NamiSp106I18n,
};
