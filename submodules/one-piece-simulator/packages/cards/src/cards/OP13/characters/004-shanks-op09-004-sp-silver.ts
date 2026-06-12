import type { CharacterCard } from "@tcg/op-types";
import { op13ShanksOp09004SpSilver004I18n } from "./004-shanks-op09-004-sp-silver.i18n.ts";

export const op13ShanksOp09004SpSilver004: CharacterCard = {
  id: "OP09-004",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP13",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "Give all of your opponent's Characters 1000 power.[Rush] (This card can attack on the turn in which it is played.)",
  effects: {
    keywords: ["rush"],
  },
  i18n: op13ShanksOp09004SpSilver004I18n,
};
