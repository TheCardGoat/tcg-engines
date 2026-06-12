import type { CharacterCard } from "@tcg/op-types";
import { op08Thatch045I18n } from "./045-thatch.i18n.ts";

export const op08Thatch045: CharacterCard = {
  id: "OP08-045",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "If this Character would be removed from the field by your opponent's effect or K.O.'d, trash this Character and draw 1 card instead.",
  i18n: op08Thatch045I18n,
};
