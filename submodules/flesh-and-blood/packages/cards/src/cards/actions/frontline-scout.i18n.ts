import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { frontlineScout } from "./frontline-scout.ts";

export const frontlineScoutI18n = defineFamilyI18n(frontlineScout, {
  en: {
    name: "Frontline Scout",
    typeText: "Generic Action - Attack",
    text: "You may look at the defending hero's hand.\\nIf Frontline Scout is played from arsenal, it gains go again.",
  },
});

export const {
  red: frontlineScoutRedI18n,
  yellow: frontlineScoutYellowI18n,
  blue: frontlineScoutBlueI18n,
} = frontlineScoutI18n.cards;
