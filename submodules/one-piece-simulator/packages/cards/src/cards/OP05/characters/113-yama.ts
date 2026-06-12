import type { CharacterCard } from "@tcg/op-types";
import { op05Yama113I18n } from "./113-yama.i18n.ts";

export const op05Yama113: CharacterCard = {
  id: "OP05-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05Yama113I18n,
};
