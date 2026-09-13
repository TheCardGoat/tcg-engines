import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sicEmShot } from "./sic-em-shot.ts";

export const sicEmShotI18n = defineFamilyI18n(sicEmShot, {
  en: {
    name: "Sic 'Em Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "Go again",
  },
});

export const {
  red: sicEmShotRedI18n,
  yellow: sicEmShotYellowI18n,
  blue: sicEmShotBlueI18n,
} = sicEmShotI18n.cards;
