import type { CharacterCard } from "@tcg/op-types";
import { op12Helmeppo033I18n } from "./033-helmeppo.i18n.ts";

export const op12Helmeppo033: CharacterCard = {
  id: "OP12-033",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  traits: ["Navy East Blue"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Block] Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12Helmeppo033I18n,
};
