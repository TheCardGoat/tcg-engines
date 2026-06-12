import type { CharacterCard } from "@tcg/op-types";
import { op10Bartolomeo052I18n } from "./052-bartolomeo.i18n.ts";

export const op10Bartolomeo052: CharacterCard = {
  id: "OP10-052",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 6000,
  traits: ["Dressrosa Barto Club"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Place up to 1 Character with a cost of 1 or less at the bottom of the owner's deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10Bartolomeo052I18n,
};
