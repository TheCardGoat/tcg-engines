import type { CharacterCard } from "@tcg/op-types";
import { op01Shinobu043I18n } from "./043-shinobu.i18n.ts";

export const op01Shinobu043: CharacterCard = {
  id: "OP01-043",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "special",
  effect: "NULL",
  i18n: op01Shinobu043I18n,
};
