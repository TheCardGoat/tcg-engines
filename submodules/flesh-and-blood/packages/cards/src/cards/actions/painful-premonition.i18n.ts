import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { painfulPremonition } from "./painful-premonition.ts";

export const painfulPremonitionI18n = defineFamilyI18n(painfulPremonition, {
  en: {
    name: "Painful Premonition",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to any target.\nIf this deals damage, create a Sigil of Fate token.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: painfulPremonitionRedI18n,
  yellow: painfulPremonitionYellowI18n,
  blue: painfulPremonitionBlueI18n,
} = painfulPremonitionI18n.cards;
