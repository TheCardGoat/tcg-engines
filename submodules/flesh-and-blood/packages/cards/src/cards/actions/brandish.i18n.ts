import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brandish } from "./brandish.ts";

export const brandishI18n = defineFamilyI18n(brandish, {
  en: {
    name: "Brandish",
    typeText: "Generic Action - Attack",
    text: "If Brandish hits, your next weapon attack this turn gains +1{p}.\nGo again",
  },
});

export const {
  red: brandishRedI18n,
  yellow: brandishYellowI18n,
  blue: brandishBlueI18n,
} = brandishI18n.cards;
