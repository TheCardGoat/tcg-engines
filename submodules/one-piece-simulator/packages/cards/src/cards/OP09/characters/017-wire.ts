import type { CharacterCard } from "@tcg/op-types";
import { op09Wire017I18n } from "./017-wire.i18n.ts";

export const op09Wire017: CharacterCard = {
  id: "OP09-017",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect:
    '[DON!! x1] If your Leader has 7000 power or more and the "Kid Pirates" type, this Character gains [Rush].',
  i18n: op09Wire017I18n,
};
