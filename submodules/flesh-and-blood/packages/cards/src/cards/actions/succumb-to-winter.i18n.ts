import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { succumbToWinter } from "./succumb-to-winter.ts";

export const succumbToWinterI18n = defineFamilyI18n(succumbToWinter, {
  en: {
    name: "Succumb to Winter",
    text: (_parameter, color) =>
      `Ice Fusion\nDeal ${color === "red" ? 3 : color === "yellow" ? 4 : 5} arcane damage to any target. If Succumb to Winter was fused and targets a hero, destroy a frozen card in their arsenal. If it was fused and targets a frozen ally, destroy that ally.`,
    typeText: "Elemental Wizard Action",
  },
});

export const {
  red: succumbToWinterRedI18n,
  yellow: succumbToWinterYellowI18n,
  blue: succumbToWinterBlueI18n,
} = succumbToWinterI18n.cards;
