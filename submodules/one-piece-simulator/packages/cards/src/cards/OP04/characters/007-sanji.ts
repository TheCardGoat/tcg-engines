import type { CharacterCard } from "@tcg/op-types";
import { op04Sanji007I18n } from "./007-sanji.i18n.ts";

export const op04Sanji007: CharacterCard = {
  id: "OP04-007",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "strike",
  effect: "NULL",
  i18n: op04Sanji007I18n,
};
