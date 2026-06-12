import type { CharacterCard } from "@tcg/op-types";
import { op08Musshuru011I18n } from "./011-musshuru.i18n.ts";

export const op08Musshuru011: CharacterCard = {
  id: "OP08-011",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["FILM Drum Kingdom"],
  attribute: "special",
  effect: "NULL",
  i18n: op08Musshuru011I18n,
};
