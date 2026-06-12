import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Shiryu048I18n } from "./048-shiryu.i18n.ts";

export const op14eb04Shiryu048: CharacterCard = {
  id: "OP14-048",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 8,
  power: 10000,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    "[On Play] Return up to 1 of your opponent's Characters to the owner's hand. Then, trash all cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Shiryu048I18n,
};
