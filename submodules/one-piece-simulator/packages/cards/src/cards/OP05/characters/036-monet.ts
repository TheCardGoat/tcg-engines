import type { CharacterCard } from "@tcg/op-types";
import { op05Monet036I18n } from "./036-monet.i18n.ts";

export const op05Monet036: CharacterCard = {
  id: "OP05-036",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Block] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
        actions: [
          {
            action: "rest",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05Monet036I18n,
};
