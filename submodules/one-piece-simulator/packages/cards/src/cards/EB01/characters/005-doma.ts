import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005I18n } from "./005-doma.i18n.ts";

export const eb01Doma005: CharacterCard = {
  id: "EB01-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  i18n: eb01Doma005I18n,
};
