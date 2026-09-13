import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chargeOfTheLightBrigade } from "./charge-of-the-light-brigade.ts";

export const chargeOfTheLightBrigadeI18n = defineFamilyI18n(chargeOfTheLightBrigade, {
  en: {
    name: "Charge of the Light Brigade",
    text: "The next attack you charge to play this turn gets +3{p}.\nGo again",
    typeText: "Light Warrior Action",
  },
});

export const {
  red: chargeOfTheLightBrigadeRedI18n,
  yellow: chargeOfTheLightBrigadeYellowI18n,
  blue: chargeOfTheLightBrigadeBlueI18n,
} = chargeOfTheLightBrigadeI18n.cards;
