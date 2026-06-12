import type { CharacterCard } from "@tcg/op-types";
import { op02Inuarashi027I18n } from "./027-inuarashi.i18n.ts";

export const op02Inuarashi027: CharacterCard = {
  id: "OP02-027",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  effect:
    "If all of your DON!! cards are rested, this Character cannot be removed from the field by your opponent's effects.",
  i18n: op02Inuarashi027I18n,
};
