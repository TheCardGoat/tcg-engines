import type { CharacterCard } from "@tcg/op-types";
import { op13Atlas101I18n } from "./101-atlas.i18n.ts";

export const op13Atlas101: CharacterCard = {
  id: "OP13-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  i18n: op13Atlas101I18n,
};
