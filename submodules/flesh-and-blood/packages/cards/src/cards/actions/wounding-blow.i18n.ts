import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { woundingBlow } from "./wounding-blow.ts";

export const woundingBlowI18n = defineFamilyI18n(woundingBlow, {
  en: {
    name: "Wounding Blow",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: woundingBlowRedI18n,
  yellow: woundingBlowYellowI18n,
  blue: woundingBlowBlueI18n,
} = woundingBlowI18n.cards;
