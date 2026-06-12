import type { CharacterCard } from "@tcg/op-types";
import { op10Urouge101I18n } from "./101-urouge.i18n.ts";

export const op10Urouge101: CharacterCard = {
  id: "OP10-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Fallen Monk Pirates Supernovas"],
  attribute: "strike",
  i18n: op10Urouge101I18n,
};
