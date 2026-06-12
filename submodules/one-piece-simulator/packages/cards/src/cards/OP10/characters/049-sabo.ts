import type { CharacterCard } from "@tcg/op-types";
import { op10Sabo049I18n } from "./049-sabo.i18n.ts";

export const op10Sabo049: CharacterCard = {
  id: "OP10-049",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    "If your Character with a base cost of 7 or less other than [Sabo] would be removed from the field by your opponent's effect, you may return this Character to the owner's hand instead.",
  i18n: op10Sabo049I18n,
};
