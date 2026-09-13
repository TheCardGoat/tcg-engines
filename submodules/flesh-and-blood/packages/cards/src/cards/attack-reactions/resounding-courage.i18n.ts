import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { resoundingCourage } from "./resounding-courage.ts";

export const resoundingCourageI18n = defineFamilyI18n(resoundingCourage, {
  en: {
    name: "Resounding Courage",
    typeText: "Light Warrior Attack Reaction",
    text: (amount) =>
      `Target Light Warrior attack gets +${amount}{p}. If you've charged this turn, create a Courage token.`,
  },
});
export const {
  red: resoundingCourageRedI18n,
  yellow: resoundingCourageYellowI18n,
  blue: resoundingCourageBlueI18n,
} = resoundingCourageI18n.cards;
