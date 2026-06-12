import type { CharacterCard } from "@tcg/op-types";
import { op13CurlyDadan009I18n } from "./009-curly-dadan.i18n.ts";

export const op13CurlyDadan009: CharacterCard = {
  id: "OP13-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Mountain Bandits Mountain Bandits"],
  attribute: "slash",
  effect:
    'If you have a "Mountain Bandits" type Character other than this card, this Character gains [Double Attack].',
  i18n: op13CurlyDadan009I18n,
};
