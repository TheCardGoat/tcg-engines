import type { CharacterCard } from "@tcg/op-types";
import { op10Marco055I18n } from "./055-marco.i18n.ts";

export const op10Marco055: CharacterCard = {
  id: "OP10-055",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP10",
  cost: 3,
  power: 5000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On K.O.] Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
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
  i18n: op10Marco055I18n,
};
