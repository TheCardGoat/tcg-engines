import type { CharacterCard } from "@tcg/op-types";
import { op03Jabra085I18n } from "./085-jabra.i18n.ts";

export const op03Jabra085: CharacterCard = {
  id: "OP03-085",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  effect: "NULL",
  i18n: op03Jabra085I18n,
};
