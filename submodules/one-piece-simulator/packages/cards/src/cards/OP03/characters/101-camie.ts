import type { CharacterCard } from "@tcg/op-types";
import { op03Camie101I18n } from "./101-camie.i18n.ts";

export const op03Camie101: CharacterCard = {
  id: "OP03-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op03Camie101I18n,
};
