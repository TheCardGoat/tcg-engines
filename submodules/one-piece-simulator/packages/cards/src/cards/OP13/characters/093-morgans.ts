import type { CharacterCard } from "@tcg/op-types";
import { op13Morgans093I18n } from "./093-morgans.i18n.ts";

export const op13Morgans093: CharacterCard = {
  id: "OP13-093",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Journalist"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Draw 2 cards and trash 2 cards from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op13Morgans093I18n,
};
