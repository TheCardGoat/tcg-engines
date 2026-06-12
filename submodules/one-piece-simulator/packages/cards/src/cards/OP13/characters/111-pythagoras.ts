import type { CharacterCard } from "@tcg/op-types";
import { op13Pythagoras111I18n } from "./111-pythagoras.i18n.ts";

export const op13Pythagoras111: CharacterCard = {
  id: "OP13-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  i18n: op13Pythagoras111I18n,
};
