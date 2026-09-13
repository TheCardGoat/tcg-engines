import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dampen } from "./dampen.ts";

export const dampenI18n = defineFamilyI18n(dampen, {
  en: {
    name: "Dampen",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to any target.\nPrevent the next X arcane damage that would be dealt to your hero this turn, where X is the damage dealt by Dampen.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: dampenRedI18n,
  yellow: dampenYellowI18n,
  blue: dampenBlueI18n,
} = dampenI18n.cards;
