import type { CharacterCard } from "@tcg/op-types";
import { op09JesusBurgess086I18n } from "./086-jesus-burgess.i18n.ts";

export const op09JesusBurgess086: CharacterCard = {
  id: "OP09-086",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "strike",
  effect:
    "This Character cannot be K.O.'d by your opponent's effects.\nIf your Leader has the \"Blackbeard Pirates\" type, this Character gains +1000 power for every 4 cards in your trash.",
  i18n: op09JesusBurgess086I18n,
};
