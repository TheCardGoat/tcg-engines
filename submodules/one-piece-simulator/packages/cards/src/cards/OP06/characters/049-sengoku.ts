import type { CharacterCard } from "@tcg/op-types";
import { op06Sengoku049I18n } from "./049-sengoku.i18n.ts";

export const op06Sengoku049: CharacterCard = {
  id: "OP06-049",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  i18n: op06Sengoku049I18n,
};
