import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { steadfast } from "./steadfast.ts";

export const steadfastI18n = defineFamilyI18n(steadfast, {
  en: {
    name: "Steadfast",
    typeText: "Guardian Instant",
    text: (amount) =>
      `Prevent the next ${amount} damage that would be dealt to your hero this turn by a source of your choice.`,
  },
});

export const {
  red: steadfastRedI18n,
  yellow: steadfastYellowI18n,
  blue: steadfastBlueI18n,
} = steadfastI18n.cards;
