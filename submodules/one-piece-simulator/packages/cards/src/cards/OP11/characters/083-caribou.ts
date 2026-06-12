import type { CharacterCard } from "@tcg/op-types";
import { op11Caribou083I18n } from "./083-caribou.i18n.ts";

export const op11Caribou083: CharacterCard = {
  id: "OP11-083",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Caribou Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Trash 2 cards from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op11Caribou083I18n,
};
