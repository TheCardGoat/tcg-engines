import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rebelliousRush } from "./rebellious-rush.ts";

export const rebelliousRushI18n = defineFamilyI18n(rebelliousRush, {
  en: {
    name: "Rebellious Rush",
    text: "Go again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: rebelliousRushRedI18n,
  yellow: rebelliousRushYellowI18n,
  blue: rebelliousRushBlueI18n,
} = rebelliousRushI18n.cards;
