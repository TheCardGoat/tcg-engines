import type { CharacterCard } from "@tcg/op-types";
import { op10Bian053I18n } from "./053-bian.i18n.ts";

export const op10Bian053: CharacterCard = {
  id: "OP10-053",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Dressrosa The Tontattas"],
  attribute: "slash",
  effect:
    'If you have a "The Tontattas" type Character other than [Bian], this Character gains [Blocker].',
  i18n: op10Bian053I18n,
};
