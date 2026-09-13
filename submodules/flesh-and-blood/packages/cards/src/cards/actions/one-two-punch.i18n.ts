import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { oneTwoPunch } from "./one-two-punch.ts";

export const oneTwoPunchI18n = defineFamilyI18n(oneTwoPunch, {
  en: {
    name: "One-Two Punch",
    text: 'Combo - If Head Jab was the last attack this combat chain, this has "When this hits a hero, deal 2 damage to them."',
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: oneTwoPunchRedI18n,
  yellow: oneTwoPunchYellowI18n,
  blue: oneTwoPunchBlueI18n,
} = oneTwoPunchI18n.cards;
