import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { malign } from "./malign.ts";

export const malignI18n = defineFamilyI18n(malign, {
  en: {
    name: "Malign",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nDamage that would be dealt by Malign can't be prevented.",
  },
});

export const {
  red: malignRedI18n,
  yellow: malignYellowI18n,
  blue: malignBlueI18n,
} = malignI18n.cards;
