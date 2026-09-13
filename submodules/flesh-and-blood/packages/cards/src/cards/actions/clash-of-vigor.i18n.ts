import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfVigor } from "./clash-of-vigor.ts";

export const clashOfVigorI18n = defineFamilyI18n(clashOfVigor, {
  en: {
    name: "Clash of Vigor",
    text: "When this defends, clash with the attacking hero. The winner creates a Vigor token.",
    typeText: "Guardian / Warrior Action - Attack",
  },
});

export const {
  red: clashOfVigorRedI18n,
  yellow: clashOfVigorYellowI18n,
  blue: clashOfVigorBlueI18n,
} = clashOfVigorI18n.cards;
