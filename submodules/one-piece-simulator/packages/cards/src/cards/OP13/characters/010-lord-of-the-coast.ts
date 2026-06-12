import type { CharacterCard } from "@tcg/op-types";
import { op13LordOfTheCoast010I18n } from "./010-lord-of-the-coast.i18n.ts";

export const op13LordOfTheCoast010: CharacterCard = {
  id: "OP13-010",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["East Blue Neptunian"],
  attribute: "strike",
  i18n: op13LordOfTheCoast010I18n,
};
