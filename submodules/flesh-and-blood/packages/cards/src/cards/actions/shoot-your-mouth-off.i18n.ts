import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shootYourMouthOff } from "./shoot-your-mouth-off.ts";

export const shootYourMouthOffI18n = defineFamilyI18n(shootYourMouthOff, {
  en: {
    name: "Shoot Your Mouth Off",
    text: "When the combat chain closes, if this didn't hit, the defending hero creates a Confidence token.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: shootYourMouthOffRedI18n,
  yellow: shootYourMouthOffYellowI18n,
  blue: shootYourMouthOffBlueI18n,
} = shootYourMouthOffI18n.cards;
