import type { CharacterCard } from "@tcg/op-types";
import { op05YamatoSp121I18n } from "./121-yamato-sp.i18n.ts";

export const op05YamatoSp121: CharacterCard = {
  id: "OP01-121",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP05",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "Also treat this card's name as [Kouzuki Oden] according to the rules. [Double Attack] (This card deals 2 damage.) [Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    keywords: ["doubleAttack", "banish"],
  },
  i18n: op05YamatoSp121I18n,
};
