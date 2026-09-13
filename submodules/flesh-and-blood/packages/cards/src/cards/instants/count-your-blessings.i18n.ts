import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { countYourBlessings } from "./count-your-blessings.ts";

export const countYourBlessingsI18n = defineFamilyI18n(countYourBlessings, {
  en: {
    name: "Count Your Blessings",
    typeText: "Generic Instant",
    text: (baseAmount) =>
      `Gain X{h}, where X is ${baseAmount} plus the number of Count Your Blessings in your graveyard.`,
  },
});

export const {
  red: countYourBlessingsRedI18n,
  yellow: countYourBlessingsYellowI18n,
  blue: countYourBlessingsBlueI18n,
} = countYourBlessingsI18n.cards;
