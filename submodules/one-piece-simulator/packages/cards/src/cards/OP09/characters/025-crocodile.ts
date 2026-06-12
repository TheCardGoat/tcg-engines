import type { CharacterCard } from "@tcg/op-types";
import { op09Crocodile025I18n } from "./025-crocodile.i18n.ts";

export const op09Crocodile025: CharacterCard = {
  id: "OP09-025",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Baroque Works The Seven Warlords of the Sea ODYSSEY"],
  attribute: "special",
  effect:
    'If your Leader has the "ODYSSEY" type, this Character cannot be K.O.\'d in battle by Leaders.',
  i18n: op09Crocodile025I18n,
};
