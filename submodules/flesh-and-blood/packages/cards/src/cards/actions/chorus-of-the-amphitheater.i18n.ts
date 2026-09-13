import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chorusOfTheAmphitheater } from "./chorus-of-the-amphitheater.ts";

export const chorusOfTheAmphitheaterI18n = defineFamilyI18n(chorusOfTheAmphitheater, {
  en: {
    name: "Chorus of the Amphitheater",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to any target.\nInstant - Discard this: If an action or instant card you control would deal arcane damage this turn, instead it deals that much plus 1.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: chorusOfTheAmphitheaterRedI18n,
  yellow: chorusOfTheAmphitheaterYellowI18n,
  blue: chorusOfTheAmphitheaterBlueI18n,
} = chorusOfTheAmphitheaterI18n.cards;
