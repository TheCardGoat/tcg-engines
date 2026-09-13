import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { headShot } from "./head-shot.ts";

export const headShotI18n = defineFamilyI18n(headShot, {
  en: {
    name: "Head Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "When this is put into your arsenal face up, it gains +2{p} until end of turn.",
  },
});

export const {
  red: headShotRedI18n,
  yellow: headShotYellowI18n,
  blue: headShotBlueI18n,
} = headShotI18n.cards;
