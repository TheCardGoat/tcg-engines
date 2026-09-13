import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { singeingSteelblade } from "./singeing-steelblade.ts";

export const singeingSteelbladeI18n = defineFamilyI18n(singeingSteelblade, {
  en: {
    name: "Singeing Steelblade",
    text: "When you attack with Singeing Steelblade, deal 1 arcane damage to target hero.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: singeingSteelbladeRedI18n,
  yellow: singeingSteelbladeYellowI18n,
  blue: singeingSteelbladeBlueI18n,
} = singeingSteelbladeI18n.cards;
