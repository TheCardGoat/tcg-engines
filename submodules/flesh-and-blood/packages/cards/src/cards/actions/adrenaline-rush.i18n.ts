import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { adrenalineRush } from "./adrenaline-rush.ts";

export const adrenalineRushI18n = defineFamilyI18n(adrenalineRush, {
  en: {
    name: "Adrenaline Rush",
    typeText: "Generic Action - Attack",
    text: "When you play this, if you have less {h} than an opposing hero, this gets +3{p}.",
  },
});

export const {
  red: adrenalineRushRedI18n,
  yellow: adrenalineRushYellowI18n,
  blue: adrenalineRushBlueI18n,
} = adrenalineRushI18n.cards;
