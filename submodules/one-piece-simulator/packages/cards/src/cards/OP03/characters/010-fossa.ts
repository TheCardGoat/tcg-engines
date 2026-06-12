import type { CharacterCard } from "@tcg/op-types";
import { op03Fossa010I18n } from "./010-fossa.i18n.ts";

export const op03Fossa010: CharacterCard = {
  id: "OP03-010",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03Fossa010I18n,
};
