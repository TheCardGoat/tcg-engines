import type { CharacterCard } from "@tcg/op-types";
import { op06TenguyamaHitetsu108I18n } from "./108-tenguyama-hitetsu.i18n.ts";

export const op06TenguyamaHitetsu108: CharacterCard = {
  id: "OP06-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 1000,
  trigger:
    "Up to 1 of your [Land of Wano] type Leader or Character cards gains +2000 power during this turn.",
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    "[Trigger] Up to 1 of your [Land of Wano] type Leader or Character cards gains +2000 power during this turn.",
  i18n: op06TenguyamaHitetsu108I18n,
};
