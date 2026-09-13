import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { smashInstinct } from "./smash-instinct.ts";

export const smashInstinctI18n = defineFamilyI18n(smashInstinct, {
  en: {
    name: "Smash Instinct",
    text: "When this attacks, intimidate.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: smashInstinctRedI18n,
  yellow: smashInstinctYellowI18n,
  blue: smashInstinctBlueI18n,
} = smashInstinctI18n.cards;
