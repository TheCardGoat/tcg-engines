import type { CharacterCard } from "@tcg/op-types";
import { op11CharlottePraline029I18n } from "./029-charlotte-praline.i18n.ts";

export const op11CharlottePraline029: CharacterCard = {
  id: "OP11-029",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["The Sun Pirates Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Rest up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11CharlottePraline029I18n,
};
