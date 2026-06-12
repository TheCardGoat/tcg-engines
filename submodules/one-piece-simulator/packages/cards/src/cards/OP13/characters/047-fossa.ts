import type { CharacterCard } from "@tcg/op-types";
import { op13Fossa047I18n } from "./047-fossa.i18n.ts";

export const op13Fossa047: CharacterCard = {
  id: "OP13-047",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "If your Character with a type including \"Whitebeard Pirates\" would be K.O.'d by your opponent's effect, you may trash this Character instead.",
  i18n: op13Fossa047I18n,
};
