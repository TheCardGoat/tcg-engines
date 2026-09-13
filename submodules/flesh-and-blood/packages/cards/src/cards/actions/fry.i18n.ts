import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fry } from "./fry.ts";

export const fryI18n = defineFamilyI18n(fry, {
  en: {
    name: "Fry",
    typeText: "Lightning Action - Attack",
    text: "Go again",
  },
});

export const { red: fryRedI18n, yellow: fryYellowI18n, blue: fryBlueI18n } = fryI18n.cards;
