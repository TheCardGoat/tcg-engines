import type { CharacterCard } from "@tcg/op-types";
import { op10CharlotteFlampeSp056I18n } from "./056-charlotte-flampe-sp.i18n.ts";

export const op10CharlotteFlampeSp056: CharacterCard = {
  id: "EB01-056",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10CharlotteFlampeSp056I18n,
};
