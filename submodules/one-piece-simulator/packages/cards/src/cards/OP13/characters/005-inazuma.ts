import type { CharacterCard } from "@tcg/op-types";
import { op13Inazuma005I18n } from "./005-inazuma.i18n.ts";

export const op13Inazuma005: CharacterCard = {
  id: "OP13-005",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "slash",
  effect: "[On Play] Give up to 1 rested DON!! card to your Leader.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13Inazuma005I18n,
};
