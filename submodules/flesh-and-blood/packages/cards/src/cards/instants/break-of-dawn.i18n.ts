import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { breakOfDawn } from "./break-of-dawn.ts";

export const breakOfDawnI18n = defineFamilyI18n(breakOfDawn, {
  en: {
    name: "Break of Dawn",
    typeText: "Light Instant",
    text: (amount) =>
      `The next time a Shadow source would deal damage this turn, prevent ${amount} of that damage.`,
  },
});

export const {
  red: breakOfDawnRedI18n,
  yellow: breakOfDawnYellowI18n,
  blue: breakOfDawnBlueI18n,
} = breakOfDawnI18n.cards;
