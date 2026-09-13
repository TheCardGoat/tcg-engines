import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfMight } from "./clash-of-might.ts";

export const clashOfMightI18n = defineFamilyI18n(clashOfMight, {
  en: {
    name: "Clash of Might",
    text: "When this defends, clash with the attacking hero. The winner creates a Might token.",
    typeText: "Brute / Guardian Action - Attack",
  },
});

export const {
  red: clashOfMightRedI18n,
  yellow: clashOfMightYellowI18n,
  blue: clashOfMightBlueI18n,
} = clashOfMightI18n.cards;
