import type { CharacterCard } from "@tcg/op-types";
import { op12KinEmon025I18n } from "./025-kin-emon.i18n.ts";

export const op12KinEmon025: CharacterCard = {
  id: "OP12-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  i18n: op12KinEmon025I18n,
};
